/*******************************************************************
 * ศูนย์บัญชาการข้อมูลเศรษฐกิจ จังหวัดหนองบัวลำภู — Backend (Apps Script)
 *
 * โครงสร้าง Google Sheet ที่ต้องมี 4 ชีต
 * ─────────────────────────────────────────────────────────────────
 * 1) Data     : id | domain | key | period | area | value | unit |
 *               agency | updated_at | updated_by | note | status
 *      period = ปี พ.ศ. รูปแบบ 2569-08 (รายเดือน) หรือ 2569 (รายปี)
 *      area   = PROV | 3901..3906 (รหัสอำเภอ)
 *      status = draft | submitted | approved
 *
 * 2) Users    : agency_code | agency_name | pin_hash | domains | role |
 *               active | fail_count | locked_until | last_login
 *      domains = spend,factory  (คั่นด้วยจุลภาค) หรือ * สำหรับแอดมิน
 *      role    = admin | agency
 *
 * 3) Log      : ts | agency_code | action | detail | ip_hint
 *
 * 4) Meta     : key | value      (เก็บค่าคงที่ เช่น latest_period)
 *
 * การตั้งค่าความปลอดภัย (Project Settings → Script properties)
 * ─────────────────────────────────────────────────────────────────
 *   PEPPER      : สตริงสุ่มยาว ≥ 32 ตัวอักษร  (ใช้ผสมก่อน hash PIN)
 *   TOKEN_KEY   : สตริงสุ่มยาว ≥ 32 ตัวอักษร  (ใช้เซ็น session token)
 *   SHEET_ID    : ไอดีของ Google Sheet
 *
 * ห้ามเก็บ PIN เป็นข้อความธรรมดาในชีตหรือในโค้ดเด็ดขาด
 * ใช้เมนู "ระบบข้อมูลเศรษฐกิจ → ตั้ง PIN ให้หน่วยงาน" เพื่อสร้าง hash
 *
 * Deploy: New deployment → Web app → Execute as: Me →
 *         Who has access: Anyone  (ตัวระบบคุมสิทธิ์ด้วย PIN เอง)
 *******************************************************************/

var PROP = PropertiesService.getScriptProperties();
var SHEETS = { DATA:'Data', USERS:'Users', LOG:'Log', META:'Meta', TABLES:'Tables', HISTORY:'History' };
var TOKEN_TTL_MIN = 90;      // อายุ session
var MAX_FAIL = 5;            // ผิดกี่ครั้งจึงล็อก
var LOCK_MIN = 15;           // ล็อกนานกี่นาที

/* ───────────────────────── entry points ───────────────────────── */
function doGet(e){ return route(e); }
function doPost(e){
  var p = e.parameter || {};
  if (e.postData && e.postData.contents) {
    try { p = Object.assign({}, p, JSON.parse(e.postData.contents)); } catch (err) {}
  }
  return route({ parameter:p });
}

function route(e){
  var p = (e && e.parameter) || {};
  var out;
  try {
    switch (String(p.action||'').toLowerCase()) {
      case 'series':   out = actSeries(p);   break;
      case 'tables':   out = actTables(p);   break;   // สาธารณะ: ตารางรายละเอียด
      case 'savetable':out = actSaveTable(p);break;   // หน่วยงานเจ้าของข้อมูลเท่านั้น   // สาธารณะ: อ่านข้อมูลที่อนุมัติแล้ว
      case 'meta':     out = actMeta();      break;
      case 'login':    out = actLogin(p);    break;
      case 'session':  out = actSession(p);  break;
      case 'mydata':   out = actMyData(p);   break;
      case 'periods':  out = actPeriods(p);  break;   // งวดที่มีข้อมูลแล้ว
      case 'history':  out = actHistory(p);  break;   // ประวัติการแก้ไข
      case 'submit':   out = actSubmit(p);   break;
      case 'approve':  out = actApprove(p);  break;
      case 'changepin':out = actChangePin(p);break;
      case 'users':    out = actUsers(p);     break;   // แอดมิน: รายชื่อและสถานะ
      case 'genpins':  out = actGenPins(p);   break;   // แอดมิน: สุ่ม PIN ใหม่
      case 'setpin':   out = actSetPin(p);    break;   // แอดมิน: ตั้ง PIN เอง
      case 'setactive':out = actSetActive(p); break;   // แอดมิน: เปิด/ปิดบัญชี
      case 'unlock':   out = actUnlock(p);    break;   // แอดมิน: ปลดล็อกบัญชี
      case 'logout':   out = actLogout(p);   break;
      case '': case 'ping': out = {
        ok:true, service:'NBL Economy API', time:new Date().toISOString(),
        ready:{ sheet:!!PROP.getProperty('SHEET_ID'), pepper:!!PROP.getProperty('PEPPER'), token:!!PROP.getProperty('TOKEN_KEY') }
      }; break;
      default: out = { ok:false, error:'ไม่รู้จักคำสั่ง' };
    }
  } catch (err) {
    out = { ok:false, error:String(err && err.message || err) };
  }
  return reply(out, p.callback);
}

function reply(obj, cb){
  var body = JSON.stringify(obj);
  if (cb && /^[A-Za-z_$][\w$]*$/.test(cb)) {
    return ContentService.createTextOutput(cb + '(' + body + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

/* ───────────────────────── sheet helpers ──────────────────────── */
/**
 * อ่านรหัสสเปรดชีต — รองรับทั้งการวางรหัสล้วน และการวาง URL ทั้งเส้น
 * ถ้าวาง URL มา ระบบจะตัดเอาเฉพาะรหัสและเขียนกลับให้เรียบร้อยเอง
 */
function sheetId_(){
  var raw = String(PROP.getProperty('SHEET_ID') || '').trim();
  if (!raw) throw new Error('ยังไม่ได้ใส่ SHEET_ID ที่ Project Settings → Script properties');
  var m = raw.match(/[-\w]{25,}/);          // รหัสสเปรดชีตยาว 40 กว่าตัวอักษร
  var id = m ? m[0] : raw;
  if (id !== raw) PROP.setProperty('SHEET_ID', id);   // เก็บให้สะอาดไว้ใช้ครั้งต่อไป
  return id;
}
function ss(){
  try {
    return SpreadsheetApp.openById(sheetId_());
  } catch (e) {
    throw new Error('เปิดสเปรดชีตไม่ได้ — ตรวจว่า SHEET_ID ถูกต้อง และบัญชีนี้มีสิทธิ์เข้าถึงไฟล์ (' + e.message + ')');
  }
}
function sheet(name){
  var s = ss().getSheetByName(name);
  if (!s) throw new Error('ไม่พบชีต ' + name);
  return s;
}
function rows(name){
  var v = sheet(name).getDataRange().getValues();
  if (v.length < 2) return { head:v[0]||[], list:[] };
  var head = v[0].map(function(h){ return String(h).trim(); });
  var list = v.slice(1).map(function(r, i){
    var o = { _row: i + 2 };
    head.forEach(function(h, j){ o[h] = r[j]; });
    return o;
  });
  return { head:head, list:list };
}

/* ───────────────────────── crypto ─────────────────────────────── */
function sha256(str){
  var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8);
  return b.map(function(x){ return ('0' + (x & 0xff).toString(16)).slice(-2); }).join('');
}
function hashPin(pin){
  var pepper = PROP.getProperty('PEPPER');
  if (!pepper || pepper.length < 16) throw new Error('ยังไม่ได้ตั้งค่า PEPPER');
  return sha256(pepper + '::' + String(pin).trim());
}
function timingSafeEqual(a, b){
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function b64u(bytes){
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
}
function signToken(payload){
  var key = PROP.getProperty('TOKEN_KEY');
  if (!key || key.length < 16) throw new Error('ยังไม่ได้ตั้งค่า TOKEN_KEY');
  var body = b64u(Utilities.newBlob(JSON.stringify(payload)).getBytes());
  var sig  = b64u(Utilities.computeHmacSha256Signature(body, key));
  return body + '.' + sig;
}
function verifyToken(token){
  if (!token || String(token).indexOf('.') < 0) return null;
  var key = PROP.getProperty('TOKEN_KEY');
  var parts = String(token).split('.');
  var expect = b64u(Utilities.computeHmacSha256Signature(parts[0], key));
  if (!timingSafeEqual(parts[1], expect)) return null;
  var payload;
  try { payload = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString()); }
  catch (e) { return null; }
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}
function requireAuth(p, needAdmin){
  var s = verifyToken(p.token);
  if (!s) throw new Error('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
  if (needAdmin && s.role !== 'admin') throw new Error('ต้องใช้สิทธิ์ผู้ดูแลระบบ');
  return s;
}

/* ───────────────────────── logging ────────────────────────────── */
function logIt(agency, action, detail){
  try {
    sheet(SHEETS.LOG).appendRow([new Date(), agency || '-', action, detail || '', '']);
  } catch (e) {}
}

/* ───────────────────────── actions ────────────────────────────── */

/** อ่านข้อมูลสาธารณะ (เฉพาะแถวที่ approved) */
function actSeries(p){
  var cache = CacheService.getScriptCache();
  var ck = 'series::' + (p.domain||'all') + '::' + (p.area||'all');
  var hit = cache.get(ck);
  if (hit && p.nocache !== '1') return JSON.parse(hit);

  var d = rows(SHEETS.DATA).list.filter(function(r){
    if (String(r.status||'').toLowerCase() !== 'approved') return false;
    if (p.domain && r.domain !== p.domain) return false;
    if (p.area && String(r.area) !== String(p.area)) return false;
    return true;
  });
  var out = {
    ok: true,
    updated: new Date().toISOString(),
    rows: d.map(function(r){
      return {
        domain: r.domain, key: r.key, period: String(r.period),
        area: String(r.area || 'PROV'), value: Number(r.value),
        unit: r.unit, agency: r.agency, updated_at: r.updated_at
      };
    })
  };
  try { cache.put(ck, JSON.stringify(out), 300); } catch(e){}
  return out;
}

function actMeta(){
  var m = {};
  rows(SHEETS.META).list.forEach(function(r){ m[r.key] = r.value; });
  var users = rows(SHEETS.USERS).list.filter(function(u){ return String(u.active).toLowerCase() !== 'false'; });
  return {
    ok: true, meta: m,
    agencies: users.map(function(u){
      return { code: u.agency_code, name: u.agency_name, domains: String(u.domains||'') };
    })
  };
}

/** เข้าสู่ระบบด้วยรหัสหน่วยงาน + PIN */
function actLogin(p){
  var code = String(p.agency||'').trim();
  var pin  = String(p.pin||'').trim();
  if (!code || !pin) return { ok:false, error:'กรอกรหัสหน่วยงานและ PIN' };

  var lock = LockService.getScriptLock();
  lock.waitLock(8000);
  try {
    var R = rows(SHEETS.USERS);
    var u = R.list.filter(function(x){ return String(x.agency_code).trim() === code; })[0];
    // ตอบข้อความเดียวกันเสมอ เพื่อไม่ให้เดาได้ว่ารหัสหน่วยงานมีจริงหรือไม่
    var GENERIC = { ok:false, error:'รหัสหน่วยงานหรือ PIN ไม่ถูกต้อง' };
    if (!u) { logIt(code, 'login_fail', 'ไม่พบหน่วยงาน'); return GENERIC; }
    if (String(u.active).toLowerCase() === 'false') return { ok:false, error:'บัญชีถูกปิดใช้งาน' };

    var now = new Date();
    if (u.locked_until && new Date(u.locked_until) > now) {
      var mins = Math.ceil((new Date(u.locked_until) - now) / 60000);
      return { ok:false, error:'ใส่ PIN ผิดหลายครั้ง ระบบล็อกไว้อีก ' + mins + ' นาที' };
    }

    if (!timingSafeEqual(hashPin(pin), String(u.pin_hash||''))) {
      var fc = Number(u.fail_count||0) + 1;
      var col = R.head.indexOf('fail_count') + 1;
      sheet(SHEETS.USERS).getRange(u._row, col).setValue(fc);
      if (fc >= MAX_FAIL) {
        sheet(SHEETS.USERS).getRange(u._row, R.head.indexOf('locked_until') + 1)
          .setValue(new Date(now.getTime() + LOCK_MIN * 60000));
      }
      logIt(code, 'login_fail', 'ครั้งที่ ' + fc);
      return GENERIC;
    }

    // สำเร็จ — ล้างตัวนับ
    sheet(SHEETS.USERS).getRange(u._row, R.head.indexOf('fail_count') + 1).setValue(0);
    sheet(SHEETS.USERS).getRange(u._row, R.head.indexOf('locked_until') + 1).setValue('');
    sheet(SHEETS.USERS).getRange(u._row, R.head.indexOf('last_login') + 1).setValue(now);
    logIt(code, 'login_ok', '');

    var token = signToken({
      a: code, role: String(u.role||'agency'),
      d: String(u.domains||''),
      exp: now.getTime() + TOKEN_TTL_MIN * 60000
    });
    return {
      ok: true, token: token,
      agency: { code: code, name: u.agency_name, role: String(u.role||'agency'), domains: String(u.domains||'') },
      expires_in: TOKEN_TTL_MIN * 60
    };
  } finally { lock.releaseLock(); }
}

function actSession(p){
  var s = verifyToken(p.token);
  return s ? { ok:true, agency:{ code:s.a, role:s.role, domains:s.d }, exp:s.exp }
           : { ok:false, error:'เซสชันหมดอายุ' };
}

function actLogout(p){
  var s = verifyToken(p.token);
  if (s) logIt(s.a, 'logout', '');
  return { ok:true };
}

/** ข้อมูลของหน่วยงานตัวเอง */
function actMyData(p){
  var s = requireAuth(p);
  var allow = String(s.d||'').split(',').map(function(x){ return x.trim(); });
  var all = allow.indexOf('*') >= 0;
  var list = rows(SHEETS.DATA).list.filter(function(r){
    if (!all && allow.indexOf(String(r.domain)) < 0) return false;
    if (p.period && String(r.period) !== String(p.period)) return false;
    return true;
  });
  return { ok:true, rows:list.map(function(r){
    return { id:r.id, domain:r.domain, key:r.key, period:String(r.period), area:String(r.area),
             value:Number(r.value), status:r.status, updated_at:r.updated_at, updated_by:r.updated_by, note:r.note };
  })};
}

/**
 * บันทึกข้อมูล — รับได้ทั้งแถวเดียวและหลายแถว (JSON string ใน p.payload)
 * payload = [{domain,key,period,area,value,unit,note}, ...]
 */
function actSubmit(p){
  var s = requireAuth(p);
  var allow = String(s.d||'').split(',').map(function(x){ return x.trim(); });
  var all = allow.indexOf('*') >= 0;

  var items;
  try { items = JSON.parse(p.payload || '[]'); } catch (e) { return { ok:false, error:'payload ไม่ถูกต้อง' }; }
  if (!items.length) return { ok:false, error:'ไม่มีข้อมูลที่จะบันทึก' };
  if (items.length > 400) return { ok:false, error:'ส่งได้ครั้งละไม่เกิน 400 รายการ' };

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = sheet(SHEETS.DATA);
    var R = rows(SHEETS.DATA);
    var idx = {};
    R.list.forEach(function(r){ idx[[r.domain, r.key, r.period, r.area].join('|')] = r._row; });

    var appends = [], hist = [], updates = 0, now = new Date();
    items.forEach(function(it){
      var domain = String(it.domain||'').trim(), key = String(it.key||'').trim();
      var period = String(it.period||'').trim(), area = String(it.area||'PROV').trim();
      if (!domain || !key || !period) return;
      if (!all && allow.indexOf(domain) < 0) throw new Error('ไม่มีสิทธิ์บันทึกชุดข้อมูล ' + domain);
      if (!/^\d{4}(-\d{2}|-Q[1-4])?$/.test(period)) throw new Error('รูปแบบงวดข้อมูลไม่ถูกต้อง: ' + period);
      var val = Number(it.value);
      if (isNaN(val)) throw new Error('ค่าตัวเลขไม่ถูกต้องที่ ' + domain + '/' + key);

      var k = [domain, key, period, area].join('|');
      var status = (s.role === 'admin') ? 'approved' : 'submitted';
      if (idx[k]) {
        var row = idx[k];
        var oldVal = sh.getRange(row, R.head.indexOf('value') + 1).getValue();
        if (String(oldVal) !== String(val)) {
          hist.push([now, domain, key, period, area, oldVal, val, s.a, it.note || '']);
        }
        sh.getRange(row, R.head.indexOf('value') + 1).setValue(val);
        sh.getRange(row, R.head.indexOf('updated_at') + 1).setValue(now);
        sh.getRange(row, R.head.indexOf('updated_by') + 1).setValue(s.a);
        sh.getRange(row, R.head.indexOf('note') + 1).setValue(it.note || '');
        sh.getRange(row, R.head.indexOf('status') + 1).setValue(status);
        updates++;
      } else {
        appends.push([Utilities.getUuid().slice(0, 8), domain, key, period, area, val,
                      it.unit || '', it.agency || s.a, now, s.a, it.note || '', status]);
        hist.push([now, domain, key, period, area, '', val, s.a, 'บันทึกครั้งแรก']);
      }
    });
    if (appends.length) sh.getRange(sh.getLastRow() + 1, 1, appends.length, appends[0].length).setValues(appends);
    if (hist.length) {
      var hs = sheet(SHEETS.HISTORY);
      hs.getRange(hs.getLastRow() + 1, 1, hist.length, hist[0].length).setValues(hist);
    }
    CacheService.getScriptCache().removeAll(['series::all::all']);
    logIt(s.a, 'submit', 'เพิ่ม ' + appends.length + ' แก้ไข ' + updates);
    return { ok:true, inserted:appends.length, updated:updates };
  } finally { lock.releaseLock(); }
}

/** แอดมินอนุมัติข้อมูลที่หน่วยงานส่งเข้ามา */
function actApprove(p){
  var s = requireAuth(p, true);
  var ids = String(p.ids||'').split(',').map(function(x){ return x.trim(); }).filter(Boolean);
  var R = rows(SHEETS.DATA), sh = sheet(SHEETS.DATA), n = 0;
  var col = R.head.indexOf('status') + 1;
  R.list.forEach(function(r){
    if (ids.length ? ids.indexOf(String(r.id)) >= 0 : String(r.status) === 'submitted') {
      sh.getRange(r._row, col).setValue('approved'); n++;
    }
  });
  CacheService.getScriptCache().removeAll(['series::all::all']);
  logIt(s.a, 'approve', n + ' รายการ');
  return { ok:true, approved:n };
}

/** เปลี่ยน PIN ของตัวเอง (ต้องยืนยัน PIN เดิม) */
function actChangePin(p){
  var s = requireAuth(p);
  var oldPin = String(p.old||'').trim(), newPin = String(p.pin||'').trim();
  if (!/^\d{6,10}$/.test(newPin)) return { ok:false, error:'PIN ใหม่ต้องเป็นตัวเลข 6–10 หลัก' };
  if (/^(\d)\1+$/.test(newPin) || '0123456789'.indexOf(newPin) >= 0)
    return { ok:false, error:'PIN ต้องไม่เป็นเลขซ้ำหรือเรียงต่อกัน' };

  var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS);
  var u = R.list.filter(function(x){ return String(x.agency_code).trim() === s.a; })[0];
  if (!u) return { ok:false, error:'ไม่พบบัญชี' };
  if (!timingSafeEqual(hashPin(oldPin), String(u.pin_hash||''))) {
    logIt(s.a, 'changepin_fail', ''); return { ok:false, error:'PIN เดิมไม่ถูกต้อง' };
  }
  sh.getRange(u._row, R.head.indexOf('pin_hash') + 1).setValue(hashPin(newPin));
  logIt(s.a, 'changepin_ok', '');
  return { ok:true };
}




/** งวดที่หน่วยงานนี้มีข้อมูลแล้ว — ใช้ทำจุดสถานะในหน้ากรอก */
function actPeriods(p){
  var s = requireAuth(p);
  var allow = String(s.d||'').split(',').map(function(x){ return x.trim(); });
  var all = allow.indexOf('*') >= 0;
  var want = String(p.domain||'').trim();
  var map = {};
  rows(SHEETS.DATA).list.forEach(function(r){
    var dom = String(r.domain||'');
    if (!all && allow.indexOf(dom) < 0) return;
    if (want && dom !== want) return;
    var per = String(r.period||''), area = String(r.area||'PROV');
    var k = per + '|' + area;
    if (!map[k]) map[k] = { period:per, area:area, n:0, at:'', by:'' };
    map[k].n++;
    var t = r.updated_at ? new Date(r.updated_at) : null;
    if (t && (!map[k].at || t > new Date(map[k].at))) { map[k].at = t.toISOString(); map[k].by = r.updated_by || ''; }
  });
  var list = [];
  for (var k in map) list.push(map[k]);
  list.sort(function(a,b){ return a.period < b.period ? 1 : -1; });
  return { ok:true, periods:list };
}

/** ประวัติการแก้ไขย้อนหลัง */
function actHistory(p){
  var s = requireAuth(p);
  var allow = String(s.d||'').split(',').map(function(x){ return x.trim(); });
  var all = allow.indexOf('*') >= 0;
  var want = String(p.domain||'').trim();
  var per = String(p.period||'').trim();
  var lim = Math.min(200, Number(p.limit||60));
  var list = rows(SHEETS.HISTORY).list.filter(function(r){
    var dom = String(r.domain||'');
    if (!all && allow.indexOf(dom) < 0) return false;
    if (want && dom !== want) return false;
    if (per && String(r.period) !== per) return false;
    return true;
  }).map(function(r){
    return { ts: r.ts ? new Date(r.ts).toISOString() : '', domain:r.domain, key:r.key,
             period:String(r.period), area:String(r.area||'PROV'),
             oldValue: r.old_value === '' ? null : Number(r.old_value),
             newValue: Number(r.new_value), by: r.by, note: r.note || '' };
  });
  list.sort(function(a,b){ return a.ts < b.ts ? 1 : -1; });
  return { ok:true, history: list.slice(0, lim), total: list.length };
}

/* ═══════════ ตารางรายละเอียด (พืชอายุสั้น ไม้ผล ราคา งบจังหวัด ฯลฯ) ═══════════ */

/** หน่วยงานที่มีสิทธิ์แก้แต่ละตาราง — ต้องตรงกับคอลัมน์ domains ในชีต Users */
var TABLE_OWNER = {
  fiscal:'spend',   // งบกรมและงบจังหวัด · เงินกันเหลื่อมปี
  crop:'crop',      // ภาวะการผลิตพืชอายุสั้น
  fruit:'crop',     // ไม้ผลเศรษฐกิจ
  water:'crop',     // แหล่งน้ำเพื่อการเกษตร
  base:'crop',      // ฐานข้อมูลพื้นฐานการเกษตร แปลงใหญ่ ท่องเที่ยวเชิงเกษตร
  price:'cpi',      // ราคาสินค้าเกษตรและอุปโภคบริโภครายสัปดาห์
  labor:'labor',    // ภาวะการทำงานของประชากร รายไตรมาส
  otop:'otop',      // OTOP รายได้ ผลิตภัณฑ์ ผู้ประกอบการ
  tour:'tour',      // ท่องเที่ยว ผู้เยี่ยมเยือน ที่พัก แหล่งท่องเที่ยว
  pop:'popreg',     // ประชากร การเกิด การตาย การย้ายถิ่น
  irrig:'irrig',    // ชลประทาน แหล่งน้ำ พื้นที่รับประโยชน์
  house:'house',    // ครัวเรือน รายได้ ค่าใช้จ่าย หนี้สิน
  agri2:'crop',     // เนื้อที่ใช้ประโยชน์ มาตรฐานสินค้าเกษตร
  gpp:'*'           // GPP — ผู้ดูแลระบบเท่านั้น
};

/** อ่านตารางทั้งหมด (สาธารณะ) */
function actTables(p){
  var cache = CacheService.getScriptCache();
  if (p.nocache !== '1') {
    var hit = cache.get('tables::all');
    if (hit) return JSON.parse(hit);
  }
  var out = { ok:true, tables:{}, updated:{} };
  rows(SHEETS.TABLES).list.forEach(function(r){
    var k = String(r.key||'').trim();
    if (!k) return;
    try { out.tables[k] = JSON.parse(r.json); } catch (e) { return; }
    out.updated[k] = { at: r.updated_at ? new Date(r.updated_at).toISOString() : '', by: r.updated_by || '' };
  });
  try { cache.put('tables::all', JSON.stringify(out), 120); } catch (e) {}
  return out;
}

/** บันทึกตารางหนึ่งชุด — ตรวจสิทธิ์ตาม TABLE_OWNER */
function actSaveTable(p){
  var s = requireAuth(p);
  var key = String(p.key||'').trim();
  if (!TABLE_OWNER.hasOwnProperty(key)) return { ok:false, error:'ไม่รู้จักตาราง ' + key };

  var owner = TABLE_OWNER[key];
  var allow = String(s.d||'').split(',').map(function(x){ return x.trim(); });
  var isAdmin = (s.role === 'admin') || allow.indexOf('*') >= 0;
  if (!isAdmin && (owner === '*' || allow.indexOf(owner) < 0))
    return { ok:false, error:'หน่วยงานของท่านไม่มีสิทธิ์แก้ไขตารางนี้' };

  var obj;
  try { obj = JSON.parse(p.json); } catch (e) { return { ok:false, error:'ข้อมูลไม่ใช่ JSON ที่ถูกต้อง' }; }
  var text = JSON.stringify(obj);
  if (text.length > 45000) return { ok:false, error:'ข้อมูลใหญ่เกินกำหนด' };

  var lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    var R = rows(SHEETS.TABLES), sh = sheet(SHEETS.TABLES), now = new Date();
    var row = R.list.filter(function(x){ return String(x.key).trim() === key; })[0];
    if (row) {
      sh.getRange(row._row, R.head.indexOf('json') + 1).setValue(text);
      sh.getRange(row._row, R.head.indexOf('updated_at') + 1).setValue(now);
      sh.getRange(row._row, R.head.indexOf('updated_by') + 1).setValue(s.a);
    } else {
      sh.appendRow([key, text, now, s.a]);
    }
    try { CacheService.getScriptCache().remove('tables::all'); } catch (e) {}
    logIt(s.a, 'savetable', key + ' (' + text.length + ' ตัวอักษร)');
    return { ok:true, key:key, at:now.toISOString() };
  } finally { lock.releaseLock(); }
}

/* ═══════════ คำสั่งสำหรับหน้าจัดการรหัส (ต้องเป็นผู้ดูแลระบบเท่านั้น) ═══════════ */

/** รายชื่อหน่วยงานพร้อมสถานะ — ไม่ส่ง pin_hash ออกไปเด็ดขาด */
function actUsers(p){
  var s = requireAuth(p, true);
  var now = new Date();
  var list = rows(SHEETS.USERS).list.map(function(u){
    var locked = u.locked_until && new Date(u.locked_until) > now;
    return {
      code: String(u.agency_code||''), name: String(u.agency_name||''),
      domains: String(u.domains||''), role: String(u.role||'agency'),
      active: String(u.active).toLowerCase() !== 'false',
      hasPin: String(u.pin_hash||'').length === 64,
      fail: Number(u.fail_count||0),
      locked: !!locked,
      lockedUntil: locked ? new Date(u.locked_until).toISOString() : '',
      lastLogin: u.last_login ? new Date(u.last_login).toISOString() : ''
    };
  });
  logIt(s.a, 'admin_users', list.length + ' รายการ');
  return { ok:true, users:list };
}

/**
 * สุ่ม PIN ใหม่ — p.codes = 'all' หรือรหัสหน่วยงานคั่นด้วยจุลภาค
 * ส่ง PIN จริงกลับไปครั้งเดียวเพื่อให้ผู้ดูแลบันทึกเก็บ ระบบไม่เก็บไว้ที่ใดเลย
 */
function actGenPins(p){
  var s = requireAuth(p, true);
  var want = String(p.codes||'all').trim();
  var only = want === 'all' ? null : want.split(',').map(function(x){ return x.trim(); }).filter(Boolean);

  var lock = LockService.getScriptLock(); lock.waitLock(15000);
  try {
    var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS);
    var used = {}, out = [];
    R.list.forEach(function(u){
      var code = String(u.agency_code||'').trim();
      if (!code) return;
      if (only && only.indexOf(code) < 0) return;
      var pin;
      do { pin = randomPin_(); } while (used[pin]);
      used[pin] = true;
      sh.getRange(u._row, R.head.indexOf('pin_hash') + 1).setValue(hashPin(pin));
      sh.getRange(u._row, R.head.indexOf('fail_count') + 1).setValue(0);
      sh.getRange(u._row, R.head.indexOf('locked_until') + 1).setValue('');
      out.push({ code: code, name: String(u.agency_name||code), pin: pin, role: String(u.role||'agency') });
    });
    logIt(s.a, 'admin_genpins', out.length + ' หน่วยงาน: ' + out.map(function(x){ return x.code; }).join(','));
    return { ok:true, generated: out, at: new Date().toISOString() };
  } finally { lock.releaseLock(); }
}

/** ตั้ง PIN ให้หน่วยงานหนึ่งด้วยค่าที่ผู้ดูแลกำหนดเอง */
function actSetPin(p){
  var s = requireAuth(p, true);
  var code = String(p.code||'').trim(), pin = String(p.pin||'').trim();
  if (!code) return { ok:false, error:'ไม่ได้ระบุหน่วยงาน' };
  if (!/^\d{6,10}$/.test(pin)) return { ok:false, error:'PIN ต้องเป็นตัวเลข 6–10 หลัก' };
  if (/^(\d)\1+$/.test(pin) || '0123456789'.indexOf(pin) >= 0 || '9876543210'.indexOf(pin) >= 0)
    return { ok:false, error:'PIN ต้องไม่เป็นเลขซ้ำหรือเรียงต่อกัน' };

  var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS);
  var u = R.list.filter(function(x){ return String(x.agency_code).trim() === code; })[0];
  if (!u) return { ok:false, error:'ไม่พบหน่วยงาน ' + code };
  sh.getRange(u._row, R.head.indexOf('pin_hash') + 1).setValue(hashPin(pin));
  sh.getRange(u._row, R.head.indexOf('fail_count') + 1).setValue(0);
  sh.getRange(u._row, R.head.indexOf('locked_until') + 1).setValue('');
  logIt(s.a, 'admin_setpin', code);
  return { ok:true, code:code };
}

/** เปิด/ปิดการใช้งานบัญชีหน่วยงาน */
function actSetActive(p){
  var s = requireAuth(p, true);
  var code = String(p.code||'').trim();
  var on = String(p.active||'').toLowerCase() === 'true';
  var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS);
  var u = R.list.filter(function(x){ return String(x.agency_code).trim() === code; })[0];
  if (!u) return { ok:false, error:'ไม่พบหน่วยงาน ' + code };
  if (code === s.a && !on) return { ok:false, error:'ปิดบัญชีที่กำลังใช้งานอยู่ไม่ได้' };
  sh.getRange(u._row, R.head.indexOf('active') + 1).setValue(on);
  logIt(s.a, 'admin_setactive', code + ' = ' + on);
  return { ok:true, code:code, active:on };
}

/** ปลดล็อกบัญชีที่ถูกล็อกจากการใส่ PIN ผิดหลายครั้ง */
function actUnlock(p){
  var s = requireAuth(p, true);
  var code = String(p.code||'').trim();
  var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS);
  var u = R.list.filter(function(x){ return String(x.agency_code).trim() === code; })[0];
  if (!u) return { ok:false, error:'ไม่พบหน่วยงาน ' + code };
  sh.getRange(u._row, R.head.indexOf('fail_count') + 1).setValue(0);
  sh.getRange(u._row, R.head.indexOf('locked_until') + 1).setValue('');
  logIt(s.a, 'admin_unlock', code);
  return { ok:true, code:code };
}

/* ─────────────── เครื่องมือฝั่งผู้ดูแล (รันในตัวแก้ไขเท่านั้น) ─────────────── */

function onOpen(){
  SpreadsheetApp.getUi().createMenu('ระบบข้อมูลเศรษฐกิจ')
    .addItem('ตั้ง PIN ให้หน่วยงาน', 'uiSetPin')
    .addItem('สร้างค่า PEPPER / TOKEN_KEY', 'uiGenSecrets')
    .addItem('สร้างชีตเปล่าตามโครงสร้าง', 'uiScaffold')
    .addSeparator()
    .addItem('ตรวจสถานะระบบ', 'uiCheck')
    .addItem('สุ่ม PIN ใหม่ทุกหน่วยงาน', 'uiGenPins')
    .addToUi();
}

function uiGenPins(){
  var ui = SpreadsheetApp.getUi();
  var r = ui.alert('สุ่ม PIN ใหม่ทุกหน่วยงาน', 'PIN เดิมทั้งหมดจะใช้ไม่ได้ทันที ต้องการทำต่อหรือไม่', ui.ButtonSet.YES_NO);
  if (r !== ui.Button.YES) return;
  ui.alert('PIN ใหม่ (คัดลอกเก็บไว้ทันที)', GENERATE_PINS(), ui.ButtonSet.OK);
}

function uiCheck(){
  SpreadsheetApp.getUi().alert('สถานะระบบ', CHECK(), SpreadsheetApp.getUi().ButtonSet.OK);
}

function uiGenSecrets(){
  var ui = SpreadsheetApp.getUi();
  if (PROP.getProperty('PEPPER')) {
    var r = ui.alert('มี PEPPER อยู่แล้ว', 'การสร้างใหม่จะทำให้ PIN เดิมทั้งหมดใช้ไม่ได้ ต้องการทำต่อหรือไม่', ui.ButtonSet.YES_NO);
    if (r !== ui.Button.YES) return;
  }
  PROP.setProperty('PEPPER', Utilities.getUuid() + Utilities.getUuid());
  PROP.setProperty('TOKEN_KEY', Utilities.getUuid() + Utilities.getUuid());
  ui.alert('สร้างค่าลับเรียบร้อย', 'บันทึกไว้ใน Script properties แล้ว ไม่มีการแสดงค่าออกมาที่ใด', ui.ButtonSet.OK);
}

function uiSetPin(){
  var ui = SpreadsheetApp.getUi();
  var a = ui.prompt('รหัสหน่วยงาน', 'klang, agri, industry, pea, commerce, smebank, energy, transport, labour, sso, mots, cdd, dopa, rid, nso, province, admin',
                    ui.ButtonSet.OK_CANCEL);
  if (a.getSelectedButton() !== ui.Button.OK) return;
  var b = ui.prompt('PIN ใหม่', 'ตัวเลข 6–10 หลัก (ระบบจะเก็บเป็นค่า hash เท่านั้น)', ui.ButtonSet.OK_CANCEL);
  if (b.getSelectedButton() !== ui.Button.OK) return;
  var code = a.getResponseText().trim(), pin = b.getResponseText().trim();
  if (!/^\d{6,10}$/.test(pin)) { ui.alert('PIN ต้องเป็นตัวเลข 6–10 หลัก'); return; }

  var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS);
  var u = R.list.filter(function(x){ return String(x.agency_code).trim() === code; })[0];
  if (u) {
    sh.getRange(u._row, R.head.indexOf('pin_hash') + 1).setValue(hashPin(pin));
    sh.getRange(u._row, R.head.indexOf('fail_count') + 1).setValue(0);
    sh.getRange(u._row, R.head.indexOf('locked_until') + 1).setValue('');
  } else {
    sh.appendRow([code, code, hashPin(pin), '', 'agency', true, 0, '', '']);
  }
  ui.alert('ตั้ง PIN เรียบร้อย', 'เก็บเป็นค่า hash แล้ว โปรดแจ้ง PIN ให้หน่วยงานผ่านช่องทางที่ปลอดภัย และอย่าจดไว้ในชีต', ui.ButtonSet.OK);
}

/**
 * ═══════════════════════════════════════════════════════════════
 *  ★ ติดตั้งครั้งแรก — เลือกฟังก์ชันนี้ในตัวแก้ไข Apps Script แล้วกด Run
 *    ไม่ต้องรอเมนูในสเปรดชีต ใช้ได้แม้เมนูไม่ขึ้น
 * ═══════════════════════════════════════════════════════════════
 */
function SETUP() {
  var out = [];
  var id = sheetId_();
  out.push('SHEET_ID ที่ใช้ : ' + id);
  out.push('ชื่อสเปรดชีต   : ' + ss().getName());

  scaffoldCore();
  out.push('สร้างชีต Data / Users / Log / Meta และรายชื่อหน่วยงานเรียบร้อย');

  if (!PROP.getProperty('PEPPER')) {
    PROP.setProperty('PEPPER', Utilities.getUuid() + Utilities.getUuid());
    PROP.setProperty('TOKEN_KEY', Utilities.getUuid() + Utilities.getUuid());
    out.push('สร้าง PEPPER และ TOKEN_KEY ใหม่เรียบร้อย');
  } else {
    out.push('มี PEPPER อยู่แล้ว ไม่ได้สร้างใหม่ (PIN เดิมยังใช้ได้)');
  }

  out.push('');
  out.push('ติดตั้งเสร็จแล้ว ขั้นถัดไปตามลำดับ');
  out.push('  1. เลือกฟังก์ชัน CHECK แล้วกด Run เพื่อตรวจว่าครบ');
  out.push('  2. แก้ค่าในฟังก์ชัน SET_PIN แล้วกด Run ทีละหน่วยงาน');
  out.push('  3. Deploy เป็น Web app แล้วนำ URL ไปใส่ที่หน้าตั้งค่าระบบของแดชบอร์ด');
  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

/**
 * ★ ตั้ง PIN ให้หน่วยงาน — แก้ 2 บรรทัดล่างนี้ แล้วกด Run
 *   ทำซ้ำทีละหน่วยงานจนครบ
 */
function SET_PIN() {
  var AGENCY = 'admin';      // ← รหัสหน่วยงาน เช่น admin, province, klang, agri, commerce
  var PIN    = '246813';     // ← PIN ตัวเลข 6–10 หลัก (ห้ามเลขซ้ำหรือเรียงต่อกัน)

  if (!/^\d{6,10}$/.test(PIN)) throw new Error('PIN ต้องเป็นตัวเลข 6–10 หลัก');
  var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS);
  var u = R.list.filter(function(x){ return String(x.agency_code).trim() === AGENCY; })[0];
  if (u) {
    sh.getRange(u._row, R.head.indexOf('pin_hash') + 1).setValue(hashPin(PIN));
    sh.getRange(u._row, R.head.indexOf('fail_count') + 1).setValue(0);
    sh.getRange(u._row, R.head.indexOf('locked_until') + 1).setValue('');
  } else {
    sh.appendRow([AGENCY, AGENCY, hashPin(PIN), '', 'agency', true, 0, '', '']);
  }
  var msg = 'ตั้ง PIN ให้ ' + AGENCY + ' เรียบร้อย (เก็บเป็น hash เท่านั้น)';
  Logger.log(msg);
  return msg;
}


/**
 * ★ ตั้ง PIN ให้ทุกหน่วยงานรวดเดียว — เลือกฟังก์ชันนี้แล้วกด Run ครั้งเดียว
 *   เมื่อตั้งเสร็จและแจก PIN ให้หน่วยงานแล้ว ให้ลบตัวเลขในตาราง LIST ทิ้ง
 *   หรือใช้ GENERATE_PINS() แทน จะปลอดภัยกว่าเพราะไม่มี PIN ค้างในโค้ดเลย
 */
function SET_ALL_PINS() {
  var LIST = [
    ['admin', '538023'],
    ['province', '516151'],
    ['klang', '490397'],
    ['agri', '503175'],
    ['industry', '164467'],
    ['pea', '867331'],
    ['commerce', '140263'],
    ['smebank', '848542'],
    ['energy', '358140'],
    ['transport', '766085'],
    ['labour', '922667'],
    ['sso', '212520'],
    ['mots', '940673'],
  ];
  var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS), out = [];
  LIST.forEach(function(item){
    var code = item[0], pin = String(item[1] || '');
    if (!/^\d{6,10}$/.test(pin)) { out.push('ข้าม ' + code + ' (PIN ไม่ถูกรูปแบบ)'); return; }
    var u = R.list.filter(function(x){ return String(x.agency_code).trim() === code; })[0];
    if (u) {
      sh.getRange(u._row, R.head.indexOf('pin_hash') + 1).setValue(hashPin(pin));
      sh.getRange(u._row, R.head.indexOf('fail_count') + 1).setValue(0);
      sh.getRange(u._row, R.head.indexOf('locked_until') + 1).setValue('');
      out.push('ตั้ง PIN ' + code + ' เรียบร้อย');
    } else {
      sh.appendRow([code, code, hashPin(pin), '', 'agency', true, 0, '', '']);
      out.push('เพิ่มหน่วยงานใหม่ ' + code + ' พร้อม PIN');
    }
  });
  out.push('');
  out.push('เสร็จแล้ว ' + LIST.length + ' หน่วยงาน — อย่าลืมลบตัวเลข PIN ออกจากโค้ดหลังแจกเสร็จ');
  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

/**
 * ★ สุ่ม PIN ใหม่ให้ทุกหน่วยงานโดยไม่ต้องพิมพ์เอง
 *   ระบบจะสุ่ม บันทึกเป็น hash และแสดงตาราง PIN ใน Execution log เพียงครั้งเดียว
 *   ให้คัดลอกตารางนั้นเก็บไว้ทันที เพราะดูย้อนหลังไม่ได้อีก
 */
function GENERATE_PINS() {
  var R = rows(SHEETS.USERS), sh = sheet(SHEETS.USERS);
  var used = {}, out = ['รหัสหน่วยงาน\tหน่วยงาน\tPIN'];
  R.list.forEach(function(u){
    var code = String(u.agency_code || '').trim();
    if (!code) return;
    var pin;
    do { pin = randomPin_(); } while (used[pin]);
    used[pin] = true;
    sh.getRange(u._row, R.head.indexOf('pin_hash') + 1).setValue(hashPin(pin));
    sh.getRange(u._row, R.head.indexOf('fail_count') + 1).setValue(0);
    sh.getRange(u._row, R.head.indexOf('locked_until') + 1).setValue('');
    out.push(code + '\t' + (u.agency_name || code) + '\t' + pin);
  });
  out.push('');
  out.push('คัดลอกตารางนี้เก็บไว้ทันที ระบบไม่เก็บ PIN จริงไว้ที่ใดเลย ดูย้อนหลังไม่ได้');
  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

/** สุ่ม PIN 6 หลักที่ไม่เป็นเลขซ้ำ ไม่เรียงต่อกัน และไม่ขึ้นต้นด้วยศูนย์ */
function randomPin_() {
  for (var guard = 0; guard < 500; guard++) {
    var p = '';
    for (var i = 0; i < 6; i++) p += Math.floor(Math.random() * 10);
    if (p.charAt(0) === '0') continue;
    var uniq = {}, n = 0;
    for (var j = 0; j < 6; j++) if (!uniq[p.charAt(j)]) { uniq[p.charAt(j)] = 1; n++; }
    if (n <= 2) continue;
    if (p.substring(0, 3) === p.substring(3)) continue;
    var up = true, dn = true;
    for (var k = 0; k < 5; k++) {
      if (+p.charAt(k + 1) - +p.charAt(k) !== 1) up = false;
      if (+p.charAt(k) - +p.charAt(k + 1) !== 1) dn = false;
    }
    if (up || dn) continue;
    if (p.charAt(0) === p.charAt(1) && p.charAt(1) === p.charAt(2)) continue;
    if (p.charAt(3) === p.charAt(4) && p.charAt(4) === p.charAt(5)) continue;
    return p;
  }
  return String(Math.floor(100000 + Math.random() * 899999));
}

/** ★ ตรวจสถานะระบบ — กด Run แล้วดูผลใน Execution log */
function CHECK() {
  var out = [];
  var rawId = String(PROP.getProperty('SHEET_ID') || '').trim();
  out.push('SHEET_ID   : ' + (rawId ? 'ตั้งแล้ว' : '✗ ยังไม่ได้ตั้ง'));
  if (rawId && rawId.indexOf('http') === 0) out.push('             (วาง URL มา ระบบจะตัดเอาเฉพาะรหัสให้เอง)');
  out.push('PEPPER     : ' + (PROP.getProperty('PEPPER') ? 'ตั้งแล้ว' : '✗ ยังไม่ได้ตั้ง'));
  out.push('TOKEN_KEY  : ' + (PROP.getProperty('TOKEN_KEY') ? 'ตั้งแล้ว' : '✗ ยังไม่ได้ตั้ง'));
  try {
    var names = ss().getSheets().map(function(x){ return x.getName(); });
    out.push('ชีตที่มี   : ' + names.join(', '));
    var R = rows(SHEETS.USERS);
    var ready = R.list.filter(function(u){ return String(u.pin_hash||'').length === 64; });
    out.push('หน่วยงาน   : ' + R.list.length + ' แห่ง · ตั้ง PIN แล้ว ' + ready.length + ' แห่ง');
    out.push('ตั้ง PIN แล้ว: ' + ready.map(function(u){ return u.agency_code; }).join(', '));
    out.push('ยังไม่ตั้ง  : ' + R.list.filter(function(u){ return String(u.pin_hash||'').length !== 64; })
                                    .map(function(u){ return u.agency_code; }).join(', '));
    out.push('ข้อมูลในชีต Data : ' + Math.max(0, rows(SHEETS.DATA).list.length) + ' แถว');
  } catch (e) {
    out.push('อ่านชีตไม่ได้: ' + e.message);
  }
  var msg = out.join('\n');
  Logger.log(msg);
  return msg;
}

function uiScaffold(){
  scaffoldCore();
  SpreadsheetApp.getUi().alert('สร้างโครงสร้างชีตเรียบร้อย', 'ขั้นถัดไป: เมนู → สร้างค่า PEPPER / TOKEN_KEY แล้วจึงตั้ง PIN ให้แต่ละหน่วยงาน', SpreadsheetApp.getUi().ButtonSet.OK);
}

function scaffoldCore(){
  var book = ss();
  var spec = {
    Data : ['id','domain','key','period','area','value','unit','agency','updated_at','updated_by','note','status'],
    Users: ['agency_code','agency_name','pin_hash','domains','role','active','fail_count','locked_until','last_login'],
    Log  : ['ts','agency_code','action','detail','ip_hint'],
    Meta : ['key','value'],
    Tables:['key','json','updated_at','updated_by'],
    History:['ts','domain','key','period','area','old_value','new_value','by','note']
  };
  Object.keys(spec).forEach(function(name){
    var s = book.getSheetByName(name) || book.insertSheet(name);
    if (s.getLastRow() === 0) {
      s.appendRow(spec[name]);
      s.getRange(1, 1, 1, spec[name].length).setFontWeight('bold').setBackground('#251e42').setFontColor('#f4efe6');
      s.setFrozenRows(1);
    }
  });
  var u = book.getSheetByName('Users');
  if (u.getLastRow() === 1) {
    [['admin','สำนักงานสถิติจังหวัดหนองบัวลำภู','','*','admin',true,0,'',''],
     ['province','สำนักงานจังหวัดหนองบัวลำภู','','*','admin',true,0,'',''],
     ['klang','สำนักงานคลังจังหวัดหนองบัวลำภู','','spend','agency',true,0,'',''],
     ['agri','สำนักงานเกษตรจังหวัดหนองบัวลำภู','','crop','agency',true,0,'',''],
     ['industry','สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู','','factory','agency',true,0,'',''],
     ['pea','การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู','','power','agency',true,0,'',''],
     ['commerce','สำนักงานพาณิชย์จังหวัดหนองบัวลำภู','','cpi','agency',true,0,'',''],
     ['smebank','ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย','','credit','agency',true,0,'',''],
     ['energy','สำนักงานพลังงานจังหวัดหนองบัวลำภู','','fuel','agency',true,0,'',''],
     ['transport','สำนักงานขนส่งจังหวัดหนองบัวลำภู','','car','agency',true,0,'',''],
     ['labour','สำนักงานแรงงานจังหวัดหนองบัวลำภู','','labor','agency',true,0,'',''],
     ['sso','สำนักงานประกันสังคมจังหวัดหนองบัวลำภู','','social','agency',true,0,'',''],
     ['mots','สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู','','tour','agency',true,0,'',''],
     ['cdd','สำนักงานพัฒนาชุมชนจังหวัดหนองบัวลำภู','','otop','agency',true,0,'',''],
     ['dopa','ที่ทำการปกครองจังหวัดหนองบัวลำภู','','pop','agency',true,0,'',''],
     ['rid','โครงการชลประทานหนองบัวลำภู','','irrig','agency',true,0,'',''],
     ['nso','สำนักงานสถิติจังหวัดหนองบัวลำภู (ชุดสำรวจ)','','labor,house','agency',true,0,'','']
    ].forEach(function(r){ u.appendRow(r); });
  }
}
