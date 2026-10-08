/* ─────────────── 0) ค่าคงที่ ─────────────── */
const CFG = { build:'2.7.0', API:'https://script.google.com/macros/s/AKfycbwtThh7l3ZrMx1HH3O6VHv9V4xtg1Rl6jSzE0Ozwbt6PXTN2sWSS5y9vbnQ9K-DRrbk6A/exec', latest:{y:2569,m:8}, asof:'9 กันยายน 2569' };
const TH_M = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const DISTRICTS = [
  {code:'3901',name:'เมืองหนองบัวลำภู',lat:17.204,lng:102.441,w:.32},
  {code:'3904',name:'ศรีบุญเรือง',     lat:16.999,lng:102.284,w:.21},
  {code:'3902',name:'นากลาง',          lat:17.320,lng:102.220,w:.17},
  {code:'3903',name:'โนนสัง',          lat:17.028,lng:102.567,w:.14},
  {code:'3905',name:'สุวรรณคูหา',      lat:17.529,lng:102.298,w:.10},
  {code:'3906',name:'นาวัง',           lat:17.446,lng:102.155,w:.06}
];
const IC = {
  bank:'<path d="M3 9.5 12 4l9 5.5"/><path d="M5 9.5V19M9.7 9.5V19M14.3 9.5V19M19 9.5V19M3 19.5h18"/>',
  leaf:'<path d="M12 21V10"/><path d="M12 10C12 6.4 9.5 3.7 5.7 3.3c-.4 3.9 2 6.6 6.3 6.7ZM12 14.4c0-3.1 2.1-5.5 5.2-5.8.4 3.3-1.7 5.7-5.2 5.8Z"/><path d="M6 21h12"/>',
  factory:'<path d="M3 20.5h18M4.5 20.5V10l5 3.2V10l5 3.2V6.4h4.9v14.1"/><path d="M8 17h2M13 17h2M18 17h1.5"/>',
  cart:'<circle cx="9.5" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.4 12.1h11.2l2.3-8.6H6"/>',
  bolt:'<path d="M13.5 2.5 4.5 13.8h6.2l-1.2 7.7 9.3-11.6h-6.4z"/>',
  chart:'<path d="M3.5 20.5h17"/><path d="M6.5 16.6V11M11 16.6V6.6M15.5 16.6v-7M20 16.6V4.6"/>',
  people:'<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 6M18 14.9c2 .7 3.3 2.4 3.3 5.1"/>',
  coin:'<ellipse cx="12" cy="6.5" rx="7.5" ry="3"/><path d="M4.5 6.5v11c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-11"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
  drop:'<path d="M12 3.2c3.4 3.9 5.4 6.9 5.4 9.4A5.4 5.4 0 0 1 12 18a5.4 5.4 0 0 1-5.4-5.4c0-2.5 2-5.5 5.4-9.4Z"/>',
  brief:'<rect x="2.8" y="7.2" width="18.4" height="12.6" rx="2"/><path d="M8.6 7.2V5.4a1.8 1.8 0 0 1 1.8-1.8h3.2a1.8 1.8 0 0 1 1.8 1.8v1.8M2.8 12.6h18.4"/>',
  plane:'<path d="M10.5 20.5 21 3.5 4 12l5.4 2.2z"/><path d="M9.4 14.2 21 3.5"/>'
};

/* ─────────────── 1) ข้อมูลจริงจากเอกสารหน่วยงาน ─────────────── */
/* ข้อมูลจริงชุดหลักอยู่ในไฟล์ data1.js (ตัวแปร REAL) */

/* ─────────────── 2) ชุดข้อมูลรายหน่วยงาน ─────────────── */
const DATASETS = [
 {id:'spend',sector:'fiscal',agency:'สำนักงานคลังจังหวัดหนองบัวลำภู',lag:20,real:true,
  series:[{key:'inv',ico:'spend',agg:'last',label:'เบิกจ่ายงบลงทุนสะสม',unit:'ล้านบาท',base:2575,trend:.05,seas:.30,kpi:1,dec:0},
          {key:'ope',ico:'spend',agg:'last',label:'เบิกจ่ายงบประจำสะสม',unit:'ล้านบาท',base:2262,trend:.03,seas:.16,dec:0}]},
 {id:'crop',sector:'agri',agency:'สำนักงานเกษตรจังหวัดหนองบัวลำภู',lag:15,real:true,
  series:[{key:'value',ico:'income',agg:'sum',label:'มูลค่าผลผลิตพืชอายุสั้น',unit:'ล้านบาท',base:2960,trend:.02,seas:.30,kpi:1,dec:0},
          {key:'area',ico:'landuse',label:'เนื้อที่ปลูก',agg:'last',unit:'ไร่',base:949634,trend:.008,seas:.06,int:1}]},
 {id:'factory',sector:'industry',agency:'สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู',lag:30,
  series:[{key:'newf',ico:'factorynew',agg:'sum',label:'โรงงานใหม่/ขยายกิจการ',unit:'แห่ง',base:4,trend:.04,seas:.5,kpi:1,int:1},
          {key:'cap',ico:'invest',agg:'last',label:'เงินลงทุนสะสม',unit:'ล้านบาท',base:9800,trend:.045,seas:.05,int:1},
          {key:'emp',agg:'last',label:'แรงงานในโรงงาน',ico:'employed',agg:'last',unit:'คน',base:6350,trend:.025,seas:.04,int:1}]},
 {id:'power',sector:'industry',agency:'การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู',lag:25,
  series:[{key:'ind',ico:'power',agg:'sum',label:'ไฟฟ้าภาคอุตสาหกรรม',unit:'ล้านหน่วย',base:11.8,trend:.03,seas:.08,kpi:1,dec:2},
          {key:'biz',ico:'power',agg:'sum',label:'ไฟฟ้าภาคธุรกิจ',unit:'ล้านหน่วย',base:7.4,trend:.028,seas:.10,dec:2}]},
 {id:'cpi',sector:'trade',agency:'สำนักงานพาณิชย์จังหวัดหนองบัวลำภู',lag:20,invert:true,
  series:[{key:'idx',ico:'cpi',agg:'avg',label:'ดัชนีราคาผู้บริโภค',unit:'ดัชนี (2562=100)',base:108.4,trend:.012,seas:.03,kpi:1,dec:1},
          {key:'yoy',ico:'inflation',agg:'avg',label:'อัตราเงินเฟ้อทั่วไป',unit:'% YoY',base:1.3,trend:0,seas:.55,pct:1,dec:2}]},
 {id:'credit',sector:'trade',agency:'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',lag:30,
  series:[{key:'amt',ico:'credit',agg:'sum',label:'วงเงินสินเชื่ออนุมัติ',unit:'ล้านบาท',base:52,trend:.05,seas:.28,kpi:1,dec:1},
          {key:'cnt',ico:'credit',agg:'sum',label:'จำนวนรายที่ได้รับอนุมัติ',unit:'ราย',base:29,trend:.035,seas:.24,int:1}]},
 {id:'fuel',sector:'consume',agency:'สำนักงานพลังงานจังหวัดหนองบัวลำภู',lag:35,
  series:[{key:'total',ico:'fuel',agg:'sum',label:'ปริมาณการใช้น้ำมันรวม',unit:'ล้านลิตร',base:14.2,trend:.02,seas:.09,kpi:1,dec:2},
          {key:'diesel',ico:'fuel',agg:'sum',label:'ดีเซล',unit:'ล้านลิตร',base:8.6,trend:.018,seas:.12,dec:2}]},
 {id:'car',sector:'consume',agency:'สำนักงานขนส่งจังหวัดหนองบัวลำภู',lag:15,
  series:[{key:'moto',ico:'vehicle',agg:'sum',label:'รถจักรยานยนต์จดทะเบียนใหม่',unit:'คัน',base:735,trend:.02,seas:.19,kpi:1,int:1},
          {key:'car',ico:'vehicle',agg:'sum',label:'รถยนต์นั่งส่วนบุคคล',unit:'คัน',base:118,trend:.03,seas:.24,int:1},
          {key:'comm',ico:'vehicle',agg:'sum',label:'รถเพื่อการพาณิชย์',unit:'คัน',base:64,trend:.035,seas:.30,int:1}]},
 {id:'labor',sector:'labor',agency:'สำนักงานแรงงานจังหวัดหนองบัวลำภู · สำนักงานสถิติจังหวัด',lag:45,freq:'Q',real:true,
  series:[{key:'ue',ico:'unemployed',agg:'last',label:'จำนวนผู้ว่างงาน',unit:'คน',base:2960,trend:.01,seas:.5,kpi:1,int:1},
          {key:'ur',ico:'unemprate',agg:'avg',label:'อัตราการว่างงาน',unit:'%',base:1.12,trend:0,seas:.45,pct:1,dec:2},
          {key:'emp',agg:'last',label:'ผู้มีงานทำ',ico:'employed',agg:'last',unit:'คน',base:261684,trend:.008,seas:.03,int:1},
          {key:'force',ico:'lfpr',agg:'last',label:'กำลังแรงงานรวม',unit:'คน',base:264644,trend:.006,seas:.02,int:1}]},
 {id:'social',sector:'labor',agency:'สำนักงานประกันสังคมจังหวัดหนองบัวลำภู',lag:30,
  series:[{key:'m33',ico:'social',agg:'last',label:'ผู้ประกันตน มาตรา 33',unit:'คน',base:21500,trend:.02,seas:.06,kpi:1,int:1},
          {key:'m40',ico:'social',agg:'last',label:'ผู้ประกันตน มาตรา 40',unit:'คน',base:64800,trend:.015,seas:.04,int:1}]},
 {id:'tour',sector:'tourism',agency:'สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู',lag:50,
  series:[{key:'visit',ico:'visitor',agg:'sum',label:'ผู้เยี่ยมเยือน',unit:'คน-ครั้ง',base:78000,trend:.05,seas:.30,kpi:1,int:1},
          {key:'rev',ico:'income',agg:'sum',label:'รายได้จากการท่องเที่ยว',unit:'ล้านบาท',base:210,trend:.06,seas:.32,dec:1},
          {key:'occ',ico:'accommodation',agg:'avg',label:'อัตราการเข้าพักเฉลี่ย',unit:'%',base:42,trend:.02,seas:.22,pct:1,dec:1}]}
];

const SECTORS = [
 {id:'fiscal',ico:'fiscal',img:'assets/s-fiscal.jpg',  name:'การคลังภาครัฐ',       icon:'bank',   color:'#0d9268',weight:.24,datasets:['spend'],
  pitch:'ตัวขับเคลื่อนอันดับหนึ่งของเศรษฐกิจจังหวัด',
  desc:'เม็ดเงินงบประมาณที่รัฐอัดเข้าสู่ระบบเศรษฐกิจจังหวัด'},
 {id:'agri',ico:'agri',img:'assets/s-agri.jpg',    name:'ภาคเกษตรและฐานราก',   icon:'leaf',   color:'#66a33a',weight:.24,datasets:['crop'],
  pitch:'ครัวเรือนเกษตรกร 101,836 ครัวเรือน',
  desc:'พืชอายุสั้น ไม้ผล แหล่งน้ำ และสถาบันเกษตรกร'},
 {id:'industry',ico:'industry',img:'assets/s-industry.jpg',name:'อุตสาหกรรมและการผลิต',icon:'factory',color:'#356aad',weight:.16,datasets:['factory','power'],
  pitch:'ยืนยันด้วยปริมาณไฟฟ้าที่ใช้จริง',
  desc:'โรงงาน เงินลงทุน การจ้างงาน และการใช้ไฟฟ้า'},
 {id:'trade',ico:'trade',img:'assets/s-trade.jpg',   name:'การค้าและค่าครองชีพ', icon:'cart',   color:'#b5851a',weight:.14,datasets:['cpi','credit'],
  pitch:'เงินในกระเป๋าซื้อของได้เท่าเดิมหรือไม่',
  desc:'ดัชนีราคาผู้บริโภคและสินเชื่อเพื่อการลงทุน'},
 {id:'consume',ico:'consume',img:'assets/s-consume.jpg', name:'การบริโภคและพลังงาน', icon:'bolt',   color:'#d0563f',weight:.12,datasets:['fuel','car'],
  pitch:'ตัวชี้ที่เห็นผลเร็วที่สุด',
  desc:'การใช้น้ำมันเชื้อเพลิงและรถจดทะเบียนใหม่'},
 {id:'labor',ico:'labor',img:'assets/s-labor.jpg',   name:'ตลาดแรงงาน',          icon:'brief',  color:'#7d5b8f',weight:.07,datasets:['labor','social'],
  pitch:'คนมีงานทำ คือกำลังซื้อที่ยั่งยืน',
  desc:'การมีงานทำ การว่างงาน และผู้ประกันตน'},
 {id:'tourism',ico:'tourism',img:'assets/s-tourism.jpg', name:'ภาคการท่องเที่ยว',    icon:'plane',  color:'#12867e',weight:.03,datasets:['tour'],
  pitch:'รายได้ใหม่ที่ไหลเข้าจังหวัด',
  desc:'ผู้เยี่ยมเยือน รายได้ และอัตราการเข้าพัก'}
];

/* ─────────────── 3) ชุดตัวเลขรายเดือน (โครงร่าง) ─────────────── */
function rnd(s){let x=s>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296}}
const MONTHS=(()=>{const a=[];let y=CFG.latest.y-3,m=CFG.latest.m+1;
  for(let i=0;i<36;i++){if(m>12){m=1;y++}
    a.push({y,m,key:y+'-'+String(m).padStart(2,'0'),label:TH_M[m-1]+' '+String(y).slice(-2)});m++}return a})();
const YEARS=[CFG.latest.y-2,CFG.latest.y-1,CFG.latest.y];
const DB={},DBD={};
DATASETS.forEach((d,di)=>{DB[d.id]={};DBD[d.id]={};
  d.series.forEach((s,si)=>{
    const R=rnd(7919*(di+3)+131*(si+2));
    const arr=MONTHS.map((mo,i)=>{
      const t=Math.pow(1+s.trend,(i-35)/12);
      const sea=1+s.seas*.5*Math.sin((mo.m-1)/12*Math.PI*2-(di%3))+s.seas*.2*Math.cos((mo.m-1)/6*Math.PI);
      const nz=1+(R()-.5)*s.seas*.4;
      let v=s.base*t*sea*nz;
      if(s.pct)v=s.base+(sea-1)*s.base*1.6+(R()-.5)*.6;
      if(s.int)v=Math.round(v);
      return{...mo,v:+v.toFixed(s.dec??(s.int?0:2)),sim:true}});
    DB[d.id][s.key]=arr;
    const last=arr[arr.length-1].v,R2=rnd(3571*(di+1)+97*(si+1));
    DBD[d.id][s.key]={};
    DISTRICTS.forEach(dt=>{DBD[d.id][s.key][dt.code]=+(last*dt.w*(.84+R2()*.36)).toFixed(s.int?0:2)});
  })});
function baseAvg(a,y){const q=a.filter(x=>x.y===y);return q.reduce((p,c)=>p+c.v,0)/(q.length||1)}
/* ─────────────── 3b) สถานะข้อมูลจริง/จำลอง ───────────────
   ทุกจุดใน DB เริ่มเป็น sim:true (ค่าจำลองจากค่าฐาน) · loadLive() เปลี่ยนเป็น sim:false เมื่อมีค่าที่อนุมัติแล้วจากชีต
   SIM_TOUCH เก็บว่าตัวเลขที่เพิ่งดึงผ่าน seriesAt() เป็นค่าจริงหรือจำลอง แล้ว kpiCard() ติดป้ายให้เอง */
const LIVE={ok:false,err:false,at:'',rows:0,pending:0};
const DBD_REAL={};
let SIM_TOUCH=null;
function simTouch(arr,idx){
  if(!arr||!arr.length||arr[0].sim===undefined)return;
  const pts=(idx&&idx.length?idx.map(i=>arr[i]):[arr[arr.length-1]]).filter(Boolean);
  if(!pts.length)return;
  SIM_TOUCH=SIM_TOUCH||{sim:0,real:0};
  pts.forEach(p=>p.sim?SIM_TOUCH.sim++:SIM_TOUCH.real++);
}
function simTake(){const t=SIM_TOUCH;SIM_TOUCH=null;return t}
function simChip(t,mini){
  if(!t||!t.sim)return '';
  const part=t.real>0;
  const tip=(part?'ข้อมูลจริงบางเดือน':'ข้อมูลจำลอง')+'|'+(part
    ?`งวดนี้มีค่าจริง ${t.real} เดือน อีก ${t.sim} เดือนยังเป็นค่าจำลอง ตัวเลขรวมจึงยังไม่ใช่ค่าจริง`
    :'หน่วยงานยังไม่ได้ส่งค่าจริงของงวดนี้ หรือส่งแล้วแต่ยังรออนุมัติ ตัวเลขนี้สร้างจากค่าฐานเพื่อทดสอบการแสดงผล ห้ามนำไปอ้างอิง');
  return `<span class="simchip${part?' part':''}${mini?' mini':''}" data-tip2="${tip}">${part?'จริงบางส่วน':'จำลอง'}</span>`;
}
/* สรุปรายชุด: เดือนที่มีค่าจริงใน 12 เดือนล่าสุด */
function realStat(id){
  const d=DATASETS.find(x=>x.id===id); if(!d)return null;
  let real=0,tot=0,last=null;
  d.series.forEach(se=>{const arr=DB[id][se.key]||[];
    arr.slice(-12).forEach(x=>{tot++;if(!x.sim){real++;if(!last||x.key>last)last=x.key}})});
  return {real,tot,share:tot?real/tot:0,last};
}
function buildMei(){
  const base=CFG.latest.y-2;
  const comps=SECTORS.map(sec=>{const idx=MONTHS.map(()=>0);
    sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id),s=d.series[0],arr=DB[id][s.key],b=baseAvg(arr,base)||1;
      arr.forEach((x,i)=>{const r=(x.v/b)*100;idx[i]+=(d.invert?(200-r):r)/sec.datasets.length})});
    return{sec,idx}});
  const out=MONTHS.map((mo,i)=>{let v=0,w=0;comps.forEach(c=>{v+=c.idx[i]*c.sec.weight;w+=c.sec.weight});
    return{...mo,v:+(v/w).toFixed(1)}});
  /* สัดส่วนน้ำหนักของดัชนีที่มาจากค่าจริง: เดือนล่าสุด และเฉลี่ย 12 เดือน */
  const realW=i=>{let r=0,w=0;SECTORS.forEach(sec=>sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id),a=DB[id][d.series[0].key];
      const ww=sec.weight/sec.datasets.length;w+=ww;if(a[i]&&!a[i].sim)r+=ww}));return w?r/w:0};
  const n=MONTHS.length, lastReal=realW(n-1);
  let yr=0;for(let i=n-12;i<n;i++)yr+=realW(i);
  return{out,comps,real:lastReal,real12:yr/12}}
let MEI=buildMei();
const R3=rnd(20690);
const NAT={th:MEI.out.map((m,i)=>+(100+(i-24)*.16+Math.sin(i/5)*1.1+(R3()-.5)*.8).toFixed(1)),
           ne:MEI.out.map((m,i)=>+(100+(i-24)*.12+Math.sin(i/4.4+1)*1.4+(R3()-.5)).toFixed(1))};

/* ─────────────── 4) store + การแก้ไข ─────────────── */
const LS={data:'nblEcon.data',set:'nblEcon.settings'};
let D=JSON.parse(JSON.stringify(REAL));
(function loadEdits(){try{const raw=localStorage.getItem(LS.data);if(!raw)return;
  const o=JSON.parse(raw);deepMerge(D,o)}catch(e){}})();
function deepMerge(t,s){for(const k in s){
  if(s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k])){if(!t[k])t[k]={};deepMerge(t[k],s[k])}
  else t[k]=s[k]}return t}
function saveEdits(){try{localStorage.setItem(LS.data,JSON.stringify(D))}catch(e){}}
function editCount(){try{return localStorage.getItem(LS.data)?1:0}catch(e){return 0}}
function pathGet(p){return p.split('.').reduce((o,k)=>o&&o[/^\d+$/.test(k)?+k:k],D)}

let SET={coverUrl:'assets/cover-fields.jpg',coverOp:38,sideUrl:'assets/side-forest.jpg',sideOp:26,accent:'#0d9268',kiosk:20,api:'https://script.google.com/macros/s/AKfycbwtThh7l3ZrMx1HH3O6VHv9V4xtg1Rl6jSzE0Ozwbt6PXTN2sWSS5y9vbnQ9K-DRrbk6A/exec'};
(function loadSet(){try{const r=localStorage.getItem(LS.set);if(r)Object.assign(SET,JSON.parse(r))}catch(e){}})();
function saveSet(){try{localStorage.setItem(LS.set,JSON.stringify(SET))}catch(e){alert('บันทึกไม่สำเร็จ — พื้นที่เก็บข้อมูลในเบราว์เซอร์เต็ม (รูปอาจใหญ่เกินไป)')}}
function applySet(){
  const r=document.documentElement;
  if(SET.accent){r.style.setProperty('--brand',SET.accent)}
  r.style.setProperty('--cover-img',SET.coverUrl?`url("${SET.coverUrl}")`:'none');
  r.style.setProperty('--side-img',SET.sideUrl?`url("${SET.sideUrl}")`:'none');
  r.style.setProperty('--side-op',(SET.sideOp||0)/100);
  const cb=document.getElementById('coverBg');if(cb)cb.style.opacity=(SET.coverOp||0)/100;
  CFG.API=(SET.api===undefined?'https://script.google.com/macros/s/AKfycbwtThh7l3ZrMx1HH3O6VHv9V4xtg1Rl6jSzE0Ozwbt6PXTN2sWSS5y9vbnQ9K-DRrbk6A/exec':SET.api)||'';
}

/* ─────────────── 5) utils ─────────────── */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const cv=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function f(v,d){if(v==null||isNaN(v))return'—';
  return Number(v).toLocaleString('th-TH',{minimumFractionDigits:d??0,maximumFractionDigits:d??0})}
function f_num(v){if(v==null||isNaN(v))return'—';return Number(v).toLocaleString('th-TH',{maximumFractionDigits:2})}
function pctc(a,b){return b?((a-b)/Math.abs(b))*100:null}
function chip(p){if(p==null)return'<span class="chip">—</span>';
  const c=p>.15?'up':p<-.15?'dn':'fl',a=p>.15?'▲':p<-.15?'▼':'▬';
  return`<span class="chip ${c}">${a} ${p>0?'+':''}${p.toFixed(1)}%</span>`}
/* ป้ายคู่ · เทียบปีก่อน และ เทียบเดือนก่อน ในการ์ดเดียวกัน
   unit 'pct' = ตัวเลขเป็นร้อยละ · unit 'pt' = เป็นจุด (ใช้เมื่อต้นทางให้มาเป็นอัตราอยู่แล้ว) */
function chip2(yoy,mom,unit,ctx){
  /* ป้ายคู่ เทียบปีก่อน + เทียบเดือนก่อน · ทุกป้ายมี tooltip บอกว่าเทียบกับอะไร และคำนวณอย่างไร
     ctx = {now:'ส.ค. 69', py:'ส.ค. 68', pm:'ก.ค. 69', v:ค่าเดือนนี้, vy:ค่าเดือนเดียวกันปีก่อน, vm:ค่าเดือนก่อน,
            u:'ล้านบาท', yoyDirect:true ถ้าต้นทางรายงานเป็นอัตราเทียบปีก่อนอยู่แล้ว, src, label} */
  ctx=ctx||{};
  const n=x=>x==null?'—':(typeof f_num==='function'?f_num(x):String(x));
  const sgn=x=>(x>0?'+':'')+x.toFixed(2);
  const tipY=yoy==null?'':tipOf({t:'เทียบเดือนเดียวกันปีก่อน (YoY)'+(ctx.label?' · '+ctx.label:''),
    d:ctx.now?(ctx.now+' เทียบกับ '+(ctx.py||'เดือนเดียวกันของปีก่อน')):'เทียบกับงวดเดียวกันของปีก่อน ตัดผลของฤดูกาลออกแล้ว',
    calc:ctx.yoyDirect
      ? 'ต้นทางรายงานเป็นร้อยละเทียบปีก่อนโดยตรง = '+sgn(yoy)+'% · ค่าบวกคือขยายตัว ค่าลบคือหดตัว'
      : (ctx.vy!=null?'(ค่าเดือนนี้ − ค่าปีก่อน) ÷ ค่าปีก่อน × 100 = ('+n(ctx.v)+' − '+n(ctx.vy)+') ÷ '+n(ctx.vy)+' × 100 = '+sgn(yoy)+'%'
                     :'(ค่างวดนี้ − ค่างวดเดียวกันปีก่อน) ÷ ค่างวดเดียวกันปีก่อน × 100 = '+sgn(yoy)+'%'),
    src:ctx.src||'',when:ctx.now?'เดือน '+ctx.now:''});
  const tipM=mom==null?'':tipOf({t:'เทียบเดือนก่อน (MoM)'+(ctx.label?' · '+ctx.label:''),
    d:ctx.now?(ctx.now+' เทียบกับ '+(ctx.pm||'เดือนก่อนหน้า')):'เทียบกับเดือนก่อนหน้า',
    calc:unit==='pt'
      ? 'ผลต่างของอัตราเทียบปีก่อนระหว่างสองเดือน = '+(ctx.v!=null&&ctx.vm!=null?n(ctx.v)+'% − '+n(ctx.vm)+'% = ':'')+sgn(mom)+' จุด'+
        ' · หน่วยเป็น "จุด" ไม่ใช่การเติบโตรายเดือน เพราะต้นทางรายงานเป็นอัตราเทียบปีก่อน ใช้ดูว่าแรงขึ้นหรืออ่อนลงจากเดือนก่อน'
      : (ctx.vm!=null?'(ค่าเดือนนี้ − ค่าเดือนก่อน) ÷ ค่าเดือนก่อน × 100 = ('+n(ctx.v)+' − '+n(ctx.vm)+') ÷ '+n(ctx.vm)+' × 100 = '+sgn(mom)+'%'
                     :'(ค่าเดือนนี้ − ค่าเดือนก่อน) ÷ ค่าเดือนก่อน × 100 = '+sgn(mom)+'%')+
        (ctx.u&&ctx.v!=null&&ctx.vm!=null?' · เปลี่ยนแปลง '+(ctx.v-ctx.vm>0?'+':'')+n(ctx.v-ctx.vm)+' '+ctx.u:''),
    src:ctx.src||'',when:ctx.now?'เดือน '+ctx.now:''});
  const one=(v,lab,u,tip)=>{
    if(v==null)return `<span class="chip">— ${lab}</span>`;
    const c=v>.15?'up':v<-.15?'dn':'fl', a=v>.15?'▲':v<-.15?'▼':'▬';
    return `<span class="chip ${c}"${tip?` data-tip2="${tip}"`:''}>${a} ${v>0?'+':''}${v.toFixed(1)}${u==='pt'?' จุด':'%'} <em>${lab}</em></span>`;
  };
  return `<span class="chip2">${one(yoy,'ปีก่อน','pct',tipY)}${one(mom,'เดือนก่อน',unit||'pct',tipM)}</span>`;
}
function spark(vals,color){
  const w=100,h=26,mn=Math.min(...vals),mx=Math.max(...vals),r=(mx-mn)||1;
  const p=vals.map((v,i)=>[i/(vals.length-1)*w,h-2-((v-mn)/r)*(h-6)]);
  const dl='M'+p.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' L');
  const id='s'+Math.random().toString(36).slice(2,8);
  return`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${color}" stop-opacity=".3"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  <path d="${dl} L${w},${h} L0,${h} Z" fill="url(#${id})"/><path d="${dl}" fill="none" stroke="${color}" stroke-width="1.7" stroke-linejoin="round"/>
  <circle cx="${w}" cy="${p[p.length-1][1].toFixed(1)}" r="2.2" fill="${color}"/></svg>`}
/* ชื่อไอคอนใส่หลายตัวคั่นด้วย | ได้ เช่น 'product|otop'
   ถ้าตัวแรกยังไม่มีไฟล์ จะไล่ไปตัวถัดไปเอง หมดแล้วจึงถอยไปใช้ไอคอนเส้น
   ทำให้เพิ่มไอคอนใหม่ทีหลังได้โดยไม่ต้องแก้โค้ด และระหว่างที่ยังไม่มีก็ไม่มีช่องว่าง */
/* ─────────────── แผนภาพสัดส่วนแบบกล่อง (squarified treemap) ───────────────
   เขียนใหม่ตามอัลกอริทึม squarified ฉบับมาตรฐาน ของเดิมคำนวณอัตราส่วนผิด
   ทำให้กล่องแรกกินพื้นที่ทั้งแผ่น · items = [{n,v,color,icon,bg,tip,sub}] */
function tmLayout(items,W,H){
  const list=items.filter(x=>x.v>0).slice().sort((a,b)=>b.v-a.v);
  const total=list.reduce((a,b)=>a+b.v,0)||1;
  const out=[];
  let x=0,y=0,w=W,h=H;
  let rest=list.map(it=>({it,a:it.v/total*W*H}));   /* แปลงค่าเป็นพื้นที่จริงทันที */
  const worst=(row,len)=>{
    const s=row.reduce((a,b)=>a+b.a,0);
    const mx=row[0].a, mn=row[row.length-1].a;      /* เรียงมากไปน้อยอยู่แล้ว */
    return Math.max((len*len*mx)/(s*s),(s*s)/(len*len*mn));
  };
  while(rest.length){
    const len=Math.min(w,h);
    const row=[rest[0]]; let k=1;
    while(k<rest.length&&worst(row.concat([rest[k]]),len)<=worst(row,len)){row.push(rest[k]);k++;}
    const s=row.reduce((a,b)=>a+b.a,0);
    const thick=s/len;                              /* ความหนาของแถว */
    let off=0;
    row.forEach(r=>{
      const side=r.a/thick;                          /* ความยาวของกล่องในแถว */
      if(w>=h) out.push({it:r.it,x,y:y+off,w:thick,h:side});
      else     out.push({it:r.it,x:x+off,y,w:side,h:thick});
      off+=side;
    });
    if(w>=h){x+=thick;w-=thick}else{y+=thick;h-=thick}
    rest=rest.slice(row.length);
    if(w<0.5||h<0.5)break;
  }
  return {boxes:out,total:total};
}
function treemap(items,opt){
  opt=opt||{};
  const W=opt.w||1000, H=opt.h||560;
  const {boxes,total}=tmLayout(items,W,H);
  if(!boxes.length)return '';
  return boxes.map(b=>{
    const p=b.it.v/total*100;
    const aw=b.w/W*100, ah=b.h/H*100, area=aw*ah/100;
    const cls=(aw<9||ah<9)?'tm tiny':(area<4||aw<16||ah<14)?'tm sm':'tm';
    const art=(b.it.bg&&area>=3)?`<span class="tmbg" style="background-image:url('${b.it.bg}')"></span>`:'';
    const ico=(b.it.icon&&area>=2)?`<img class="tmic" src="${b.it.icon}" alt="" loading="lazy" onerror="this.remove()">`:'';
    const sub=(b.it.sub&&area>=6)?`<em>${b.it.sub}</em>`:'';
    return `<div class="${cls}" style="left:${(b.x/W*100).toFixed(3)}%;top:${(b.y/H*100).toFixed(3)}%;`+
      `width:${aw.toFixed(3)}%;height:${ah.toFixed(3)}%;background:${b.it.color}"`+
      (b.it.tip?` data-tip2="${b.it.tip}"`:'')+`>${art}${ico}<b>${b.it.n}</b><span>${p.toFixed(2)}%</span>${sub}</div>`;
  }).join('');
}

/* ─────────────── วงแหวนสัดส่วน ───────────────
   วาดเป็น SVG เองเพื่อคุมช่องว่างระหว่างชิ้นและไฮไลต์ตอนชี้ได้
   items = [{n,v,color,tip}] · รายชื่อสาขาแสดงเป็นรายการข้างนอก ไม่ยัดป้ายรอบวงให้รก */
function donutRing(items,opt){
  opt=opt||{};
  const W=460,H=460,CX=230,CY=230,R=opt.r||196,RI=opt.ri||126;
  /* ตำแหน่งข้อความกลางวง · วงเล็กใช้ช่องไฟกว้างขึ้นให้ตัวเลขไม่ชนขอบวง */
  const Y=opt.mini?[CY-46,CY+18,CY+56]:[CY-26,CY+14,CY+42];
  const list=items.filter(x=>x.v>0);
  const total=list.reduce((a,b)=>a+b.v,0)||1;
  const pol=(r,a)=>[CX+r*Math.cos(a),CY+r*Math.sin(a)];
  const PAD=0.006;                                  /* ช่องว่างบาง ๆ ระหว่างชิ้น */
  let ang=-Math.PI/2;
  const arcs=list.map((it,i)=>{
    const sweep=it.v/total*Math.PI*2;
    const a0=ang+PAD/2, a1=ang+sweep-PAD/2; ang+=sweep;
    const big=(a1-a0)>Math.PI?1:0;
    const [x0,y0]=pol(R,a0),[x1,y1]=pol(R,a1),[u0,v0]=pol(RI,a1),[u1,v1]=pol(RI,a0);
    const d=`M${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 ${big} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`+
            ` L${u0.toFixed(2)},${v0.toFixed(2)} A${RI},${RI} 0 ${big} 0 ${u1.toFixed(2)},${v1.toFixed(2)} Z`;
    return `<path d="${d}" fill="${it.color}" class="dr-arc" data-sec="${i}"${it.grp?` data-grp="${it.grp}"`:''}${it.tip?` data-tip2="${it.tip}"`:''}></path>`;
  }).join('');
  const c=`<text x="${CX}" y="${Y[0]}" text-anchor="middle" class="dr-t1">${opt.centerTop||''}</text>
    <text x="${CX}" y="${Y[1]}" text-anchor="middle" class="dr-t2">${opt.centerMid||''}</text>
    <text x="${CX}" y="${Y[2]}" text-anchor="middle" class="dr-t3">${opt.centerSub||''}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="dring" xmlns="http://www.w3.org/2000/svg">${arcs}${c}</svg>`;
}

/* ─────────────── วงแหวนซ้อนหลายชั้น ───────────────
   rings = [ [ {n,v,color,tip,key}, ... ], ... ] จากชั้นในสุดไปชั้นนอกสุด
   แต่ละชั้นต้องรวมได้เท่ากันและเรียงลำดับสอดคล้องกัน ชิ้นของชั้นนอกจะอยู่ใต้ชิ้นแม่ในชั้นใน */
function donutNested(rings,opt){
  opt=opt||{};
  const W=460,H=460,CX=230,CY=230;
  const hole=opt.hole||88, gap=opt.gap||3, outer=opt.outer||214;
  const band=(outer-hole-gap*(rings.length-1))/rings.length;
  const pol=(r,a)=>[CX+r*Math.cos(a),CY+r*Math.sin(a)];
  let svg='';
  rings.forEach((ring,ri)=>{
    const r0=hole+ri*(band+gap), r1=r0+band;
    const tot=ring.reduce((s,x)=>s+(x.v>0?x.v:0),0)||1;
    let ang=-Math.PI/2;
    ring.forEach((it,i)=>{
      if(!(it.v>0))return;
      const sw=it.v/tot*Math.PI*2, pad=Math.min(.006,sw*.2);
      const a0=ang+pad/2, a1=ang+sw-pad/2; ang+=sw;
      const big=(a1-a0)>Math.PI?1:0;
      const [x0,y0]=pol(r1,a0),[x1,y1]=pol(r1,a1),[u0,v0]=pol(r0,a1),[u1,v1]=pol(r0,a0);
      const d=`M${x0.toFixed(2)},${y0.toFixed(2)} A${r1},${r1} 0 ${big} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`+
              ` L${u0.toFixed(2)},${v0.toFixed(2)} A${r0},${r0} 0 ${big} 0 ${u1.toFixed(2)},${v1.toFixed(2)} Z`;
      svg+=`<path d="${d}" fill="${it.color}" class="dr-arc" data-ring="${ri}" data-key="${it.key||''}"`+
        `${it.sec!=null?` data-sec="${it.sec}"`:''}${it.tip?` data-tip2="${it.tip}"`:''}></path>`;
      /* ป้ายร้อยละบนชิ้นของชั้นใน ถ้าชิ้นใหญ่พอ */
      if(opt.labelRings&&opt.labelRings.indexOf(ri)>=0&&sw>.35){
        const mid=(a0+a1)/2, [lx,ly]=pol((r0+r1)/2,mid);
        svg+=`<text x="${lx.toFixed(1)}" y="${(ly+5).toFixed(1)}" text-anchor="middle" class="dr-pc">${(it.v/tot*100).toFixed(1)}%</text>`;
      }
    });
  });
  const c=`<text x="${CX}" y="${CY-18}" text-anchor="middle" class="dr-t1">${opt.centerTop||''}</text>
    <text x="${CX}" y="${CY+12}" text-anchor="middle" class="dr-t2s">${opt.centerMid||''}</text>
    <text x="${CX}" y="${CY+34}" text-anchor="middle" class="dr-t3">${opt.centerSub||''}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="dring nested" xmlns="http://www.w3.org/2000/svg">${svg}${c}</svg>`;
}

/* ผสมสองสีตามสัดส่วน k · ใช้ไล่สีระหว่างสาขาในหมวดเดียวกันให้แยกออกจากกัน */
function mixHex(a,b,k){
  const p=h=>[1,3,5].map(i=>parseInt(String(h).trim().substr(i,2),16));
  const A=p(a),B=p(b);
  return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('');
}
/* ไล่เฉดสีจากสีหลักของหมวด ยิ่งอันดับต้นยิ่งเข้ม */
function shade(hex,k){
  const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
  const c=p(hex.trim());
  const m=c.map(v=>Math.round(v+(255-v)*k));
  return '#'+m.map(v=>v.toString(16).padStart(2,'0')).join('');
}

/* ─────────────── ไอคอนหน้าแถวตาราง ───────────────
   จับคู่จากชื่อรายการ เรียงจากคำที่เจาะจงที่สุดไปกว้างที่สุด
   ไฟล์อยู่ที่ assets/icons/ic-row-<slug>.png ถ้ายังไม่มีจะไม่ขึ้นเฉย ๆ ไม่พัง */
const ROW_ICO=[
  /* ── ภาคเกษตร · พืช ── */
  [/ข้าวโพด/,'corn'],
  [/น้ำมันพืช|น้ำมันปาล์มบรรจุ|น้ำมันถั่วเหลือง/,'cookingoil'],
  [/ข้าวเปลือกเหนียว|ข้าวสารเหนียว|ข้าวเหนียว/,'stickyrice'],
  [/ข้าวนาปี|ข้าวเปลือก|ข้าวสาร|^ข้าว/,'rice'],
  [/อ้อย/,'sugarcane'],
  [/มันสำปะหลัง/,'cassava'],
  [/มันเทศ/,'sweetpotato'],
  [/พืชผัก|ผักสด/,'vegetable'],
  [/ถั่วลิสง/,'peanut'],
  [/ถั่วเหลือง/,'soybean'],
  [/ถั่วเขียว/,'mungbean'],
  [/ปอเทือง/,'sunhemp'],
  [/ปาล์ม/,'oilpalm'],
  [/ยางก้อน|น้ำยาง|ยางพารา/,'rubber'],
  /* ── ภาคเกษตร · ไม้ผลเศรษฐกิจ ── */
  [/ทุเรียน/,'durian'],
  [/ลำไย/,'longan'],
  [/กาแฟ/,'coffee'],
  [/เงาะ/,'rambutan'],
  [/ลิ้นจี่/,'lychee'],
  [/อินทผลัม/,'date'],
  [/^ไม้ผล|ไม้ผลเศรษฐกิจ/,'fruit'],
  /* ── ภาคเกษตร · แหล่งน้ำ ── */
  [/สูบน้ำ|โซลาร์|พลังงานแสงอาทิตย์/,'solarpump'],
  [/อ่างเก็บน้ำ|ชลประทาน|ฝาย|คลองส่งน้ำ|ประตูระบายน้ำ/,'irrigation'],
  [/บ่อบาดาล|บ่อน้ำ|สระน้ำ|แหล่งน้ำ/,'pond'],
  /* ── ภาคเกษตร · สถาบันและกลุ่ม ── */
  [/ศูนย์เรียนรู้|ศพก/,'learncenter'],
  [/ศัตรูพืช|ศจช/,'pest'],
  [/ดินปุ๋ย|ศดปช/,'soil'],
  [/กลุ่มส่งเสริมอาชีพ|กลุ่มแม่บ้าน|ยุวเกษตรกร/,'groupmaker'],
  [/วิสาหกิจชุมชน/,'sme'],
  [/แปลงใหญ่/,'bigplot'],
  [/เกษตรอินทรีย์|อินทรีย์/,'organic'],
  /* ── ภาคเกษตร · ปศุสัตว์และประมง ── */
  [/ปศุสัตว์/,'livestock'],
  [/ประมง/,'fish'],
  [/สุกร|หมู/,'pork'],
  [/เนื้อโค|โคเนื้อ|วัว/,'beef'],
  [/ไข่ไก่|ไข่เป็ด|^ไข่/,'egg'],
  [/ไก่/,'chicken'],
  [/ปลานิล|ปลา/,'fish'],
  /* ── อุตสาหกรรมและการผลิต ── */
  [/แปรรูปผลผลิตการเกษตร|แปรรูปการเกษตร/,'agroprocess'],
  [/โลหะ|วัสดุก่อสร้าง/,'metal'],
  [/อาหารและเครื่องดื่ม/,'foodbev'],
  [/พลังงาน|ชีวมวล/,'bioenergy'],
  [/ไม้และเฟอร์|เฟอร์นิเจอร์|ไม้แปรรูป/,'woodfurn'],
  /* ── OTOP ── */
  [/^ผ้า/,'cloth'],
  [/ของใช้|ของตกแต่ง|ของที่ระลึก/,'houseware'],
  [/สมุนไพร/,'herb'],
  [/เครื่องดื่ม/,'drink'],
  [/^อาหาร/,'food'],
  [/กลุ่มผู้ผลิตชุมชน/,'groupmaker'],
  [/รายเดียว|เจ้าของรายเดียว/,'singlemaker'],
  [/วิสาหกิจ|SME/i,'sme'],
  /* ── อื่น ๆ ── */
  [/GPP/i,'gpp'],
  [/งบประมาณ|เบิกจ่าย/,'spend'],
  [/OTOP/i,'otop']
];
function rowIcoName(label){
  const t=String(label||'');
  for(const [re,ic] of ROW_ICO)if(re.test(t))return ic;
  return null;
}
/* คืน <img> ไว้วางหน้าข้อความในตาราง · px ปกติ 18 */
function rowIco(label,px){
  const n=rowIcoName(label); if(!n)return '';
  const core=['rice','sugarcane','cassava','rubber','otop','gpp','spend',
               'fruit','irrigation','bigplot','organic'].indexOf(n)>=0;
  const file=core?('ic-'+n):('ic-row-'+n);
  return `<img class="rowico" src="assets/icons/${file}.png" alt="" width="${px||18}" height="${px||18}"
    loading="lazy" onerror="this.remove()">`;
}

function icoImg(name,px){
  const chain=String(name||'').split('|').filter(Boolean);
  const first=chain[0]||'';
  const rest=chain.slice(1).join('|');
  const onerr=rest
    ? `if(this.dataset.chain){var c=this.dataset.chain.split('|');if(c.length&&c[0]){this.dataset.chain=c.slice(1).join('|');this.src='assets/icons/ic-'+c[0]+'.png';return}}this.closest('.icow')?this.closest('.icow').classList.add('noimg'):0;this.remove()`
    : `this.closest('.icow')?this.closest('.icow').classList.add('noimg'):0;this.remove()`;
  return `<img class="ico" src="assets/icons/ic-${first}.png" alt="" width="${px||30}" height="${px||30}"
    ${rest?`data-chain="${rest}"`:''} loading="lazy" onerror="${onerr}">`;
}
function icoBase(name){const c=String(name||'').split('|').filter(Boolean);return c[c.length-1]||''}

/* ─────────────── ไอคอนเฉพาะจุด (จับคู่จากข้อความจริงบนการ์ด/หัวข้อ/แถว) ───────────────
   ทุกจุดที่ความหมายต่างกันจะได้ไอคอนของตัวเอง ไม่ใช้ซ้ำกับจุดอื่น
   ถ้าไฟล์ใหม่ยังไม่อัปโหลด จะถอยไปใช้ไอคอนเดิมเอง หน้าไม่มีช่องว่าง
   วิธีเพิ่ม: เพิ่มบรรทัด [/ข้อความ/,'ชื่อไฟล์'] แล้ววางไฟล์ assets/icons/ic-<ชื่อไฟล์>.png */
const ICO_REMAP={
 /* หัวข้อกล่อง (h3) */
 hd:[
  [/^สัดส่วน(เนื้อที่|พื้นที่)ปลูก/,'landshare'],
  [/^มูลค่าผลผลิตรายพืช/,'cropvalue'],
  [/^ผลผลิตเฉลี่ยต่อไร่/,'yieldperrai'],
  [/^พื้นที่ปลูกและพื้นที่ให้ผล/,'orchardarea'],
  [/^ปฏิทินการเก็บเกี่ยว/,'harvestcal'],
  [/^แหล่งน้ำเพื่อการเกษตรแยกตามประเภท/,'watertype'],
  [/^แหล่งน้ำชลประทานจำแนก/,'irrigationtype'],
  [/^ความเชื่อมโยงกับศูนย์บัญชาการ/,'waterlink'],
  [/^แหล่งท่องเที่ยวเชิงเกษตร/,'agrotourism'],
  [/^สถาบันและศูนย์เรียนรู้/,'institution'],
  [/^โครงสร้างการปกครอง/,'admin'],
  [/^ครัวเรือนเกษตรกรตามช่วงอายุ/,'farmerage'],
  [/^อันดับรายอำเภอ/,'ranking'],
  [/^สัดส่วนต่อจังหวัด/,'share'],
  [/^เทียบกับค่าเฉลี่ยจังหวัด/,'vsavg'],
  [/^ตารางข้อมูลรายอำเภอ/,'table'],
  [/^งบส่วนราชการ/,'budgetfunc'],
  [/^สัดส่วนงบที่เบิกจ่าย/,'budgetsplit'],
  [/^งบกรมและงบจังหวัด/,'provbudget'],
  [/^เงินกันไว้เบิกเหลื่อมปี/,'carryover'],
  [/^เม็ดเงินภาครัฐตามงวด/,'govflow'],
  [/^ดัชนีภาวะเศรษฐกิจ/,'mei'],
  [/^โครงสร้างเศรษฐกิจ/,'structure'],
  [/^การวิเคราะห์ด้านอุปสงค์/,'analysis'],
  [/^ตัวขับเคลื่อนดัชนี/,'drivers'],
  [/^รายได้และค่าใช้จ่ายเฉลี่ย/,'incexp'],
  [/^แหล่งที่มาของรายได้/,'incsource'],
  [/^หนี้ในระบบและนอกระบบ/,'debttype'],
  [/^ค่าใช้จ่ายตามขนาดครัวเรือน/,'hhsize'],
  [/^การกระจายค่าใช้จ่าย/,'expdist'],
  [/^5 กลุ่มอุตสาหกรรม/,'topindustry'],
  [/^จำนวนผู้ว่างงานและอัตรา/,'uetrend'],
  [/^อัตราการว่างงานรายปี/,'urtrend'],
  [/^ผู้มีงานทำแยกสาขา/,'empsector'],
  [/^สถานภาพการทำงาน/,'workstatus'],
  [/^รายได้จากผลิตภัณฑ์ OTOP รายปี/i,'otoptrend'],
  [/^รายได้รายเดือน/,'monthlyrev'],
  [/^รายได้รายอำเภอ/,'districtrev'],
  [/^ผลิตภัณฑ์จำแนกตามประเภท/,'producttype'],
  [/^ลักษณะผู้ประกอบการ/,'entrepreneur'],
  [/^ศักยภาพผลิตภัณฑ์รายอำเภอ/,'potential'],
  [/^รายได้ OTOP เทียบ/i,'sectorcompare'],
  [/^ความเร็วของข้อมูล/,'datalag'],
  [/^สถานะการส่งข้อมูล/,'datastatus'],
  [/^จำนวนประชากรรายปี/,'poptrend'],
  [/^การเกิดและการตาย/,'birthdeath'],
  [/^สัดส่วนวัย/,'agegroup'],
  [/^ประชากรรายอำเภอ/,'districtpop'],
  [/^แผนที่ประชากร/,'popmap'],
  [/^สรุปภาวะเศรษฐกิจจังหวัด/,'summary'],
  [/^ตารางสรุปตัวชี้วัด/,'kpitable'],
  [/^สิ่งที่ยังขาด/,'datagap'],
  [/^ภาพพื้นหลังหน้าปก/,'coverimg'],
  [/^ภาพพื้นหลังแถบเมนู/,'sidebarimg'],
  [/^สีหลัก/,'palette'],
  [/^โหมดจอนำเสนอ/,'presenter'],
  [/^ข้อมูลที่แก้ไขไว้ในเครื่อง/,'localdata'],
  [/^การเชื่อมต่อฐานข้อมูล/,'database'],
  [/^ทะเบียนชุดข้อมูล/,'catalog'],
  [/^วิธีคำนวณดัชนี/,'formula'],
  [/ช่องทางติดต่อ$/,'contact'],
  [/^แนวโน้มผู้เยี่ยมเยือน/,'visitortrend'],
  [/^สัดส่วนชาวไทยและชาวต่างชาติ/,'nationality'],
  [/^ค่าใช้จ่ายเฉลี่ยต่อคน/,'touristspend'],
  [/^อัตราการเข้าพัก/,'occupancy'],
  [/^ผู้เยี่ยมเยือน รายได้/,'monthlytour'],
  [/^แหล่งท่องเที่ยว(\s*[\d,]+ แห่ง)?$/,'attractionmap'],
  [/^ประเภทแหล่งท่องเที่ยว/,'attractiontype'],
  [/^ศักยภาพที่ยังไม่ถูกใช้/,'untapped'],
  [/^ราคาเทียบปีก่อน/,'agriprice'],
  [/^พืชเศรษฐกิจ$/,'pricecrop'],
  [/^พืชไร่และพืชพลังงาน/,'pricefield'],
  [/^ปศุสัตว์และประมง/,'pricemeat'],
  [/^สินค้าอุปโภคบริโภค/,'pricegoods']
 ],
 /* การ์ดตัวเลข (ชื่อการ์ด) */
 kpi:[
  [/^ครัวเรือนเกษตรกร$/,'farmhh'],
  [/^ผลผลิตรวม/,'yield'],
  [/^มูลค่าผลผลิต(เกษตร)?$/,'cropvalue'],
  [/^ท่องเที่ยวเชิงเกษตร/,'agrotourism'],
  [/^พื้นที่รับประโยชน์/,'irrigatedarea'],
  [/^ระบบสูบน้ำโซลาร์/,'solarpump'],
  [/^พื้นที่เกษตรที่ยังพึ่งน้ำฝน/,'rainfed'],
  [/^องค์กรปกครองท้องถิ่น/,'localgov'],
  [/^พื้นที่ภาคการเกษตร/,'farmland'],
  [/^เบิกจ่ายภาพรวม|^เบิกจ่ายงบประมาณ/,'disburse'],
  [/^(เบิกจ่าย)?งบลงทุน/,'capex'],
  [/^(เบิกจ่าย)?งบประจำ/,'opex'],
  [/^งบจัดสรรทั้งจังหวัด/,'allocation'],
  [/^เม็ดเงินรัฐลงพื้นที่/,'govflow'],
  [/^ดัชนีเศรษฐกิจรายเดือน/,'mei'],
  [/^GPP ต่อหัว/,'gpppc'],
  [/^สัดส่วนภาคเกษตรใน GPP/,'agrishare'],
  [/^เงินเหลือต่อเดือน/,'savings'],
  [/^ไฟฟ้าภาคธุรกิจ/,'powerbiz'],
  [/^ผู้ประกอบการ/,'entrepreneur'],
  [/^ร้านค้าชุมชน/,'communityshop'],
  [/^ดีเซล/,'diesel'],
  [/^รถจักรยานยนต์/,'motorcycle'],
  [/^รถยนต์นั่ง/,'car'],
  [/^รถเพื่อการพาณิชย์/,'truck'],
  [/^จำนวนรายที่ได้รับอนุมัติ/,'borrowers'],
  [/^สินค้าที่ราคาสูงขึ้น/,'priceup'],
  [/^สินค้าที่ราคาลดลง/,'pricedown'],
  [/^น้ำยางสด/,'latex'],
  [/^นักท่องเที่ยว/,'tourist'],
  [/^นักทัศนาจร/,'excursionist']
 ],
 /* ไอคอนหน้าแถวตาราง (ข้อความทั้งช่อง รวมบรรทัดรายละเอียด) */
 row:[
  [/ข้าวสารหอมมะลิ/,'row-milledrice'],
  [/ข้าวเปลือกเหนียว/,'row-paddysticky'],
  [/มันสำปะหลัง.*ลานมัน/,'row-cassavayard'],
  [/มันสำปะหลัง.*โรงแป้ง/,'row-cassavastarch'],
  [/ข้าวโพด.*ฝัก/,'row-cornear'],
  [/ข้าวโพด.*เมล็ด.*14\.5/,'row-corndry'],
  [/ข้าวโพด.*เมล็ด/,'row-cornkernel'],
  [/ยางก้อนถ้วย/,'row-cuplump'],
  [/น้ำยางสด/,'row-latex'],
  [/สามชั้น/,'row-porkbelly'],
  [/เนื้อโคชำแหละ/,'row-beefcut'],
  [/^โคเนื้อ/,'row-cattle'],
  [/ไก่.*อก/,'row-chickenbreast'],
  [/ไก่.*(น่อง|สะโพก)/,'row-chickenleg'],
  [/^ประมง/,'row-fishery'],
  [/สูบน้ำด้วยไฟฟ้า/,'row-electricpump'],
  [/บ่อบาดาล/,'row-groundwell'],
  [/แหล่งน้ำในไร่นา/,'row-farmpond'],
  [/อ่างเก็บน้ำ/,'row-reservoir'],
  [/^พื้นที่ชลประทาน/,'row-irrigatedarea'],
  [/กลุ่มส่งเสริมอาชีพ/,'row-farmgroup'],
  [/กลุ่มแม่บ้าน/,'row-housewife'],
  [/ยุวเกษตรกร/,'row-youthfarmer']
 ]
};
function icoCtxOf(img){
  const tx=el=>el?String(el.textContent||'').replace(/\s+/g,' ').trim():'';
  const k=img.closest('.kpi');if(k)return['kpi',tx(k.querySelector('.h>span:last-child'))];
  const b=img.closest('.bigkpi');if(b)return['kpi',tx(b.querySelector('.bk-l'))];
  if(img.classList.contains('rowico'))return['row',tx(img.closest('td,.nm,span,div'))];
  const h=img.closest('header');if(h)return['hd',tx(h.querySelector('h3,h2'))];
  return['',''];
}
function icoFallback(){
  const c=String(this.dataset.fb||'').split('|').filter(Boolean);
  if(c.length){this.dataset.fb=c.slice(1).join('|');this.src='assets/icons/'+c[0]+'.png';return}
  const w=this.closest('.icow');if(w)w.classList.add('noimg');this.remove();
}
function relabelIcons(root){
  const r=root||document;if(!r.querySelectorAll)return;
  const imgs=r.matches&&r.matches('img.ico,img.rowico')?[r]:r.querySelectorAll('img.ico:not([data-rl]),img.rowico:not([data-rl])');
  imgs.forEach(img=>{
    if(img.dataset.rl)return;img.dataset.rl='1';
    const [ctx,t]=icoCtxOf(img);const list=ICO_REMAP[ctx];if(!list||!t)return;
    const hit=list.find(x=>x[0].test(t));if(!hit)return;
    const m=(img.getAttribute('src')||'').match(/icons\/(ic-[^\/]+?)\.png/);const cur=m?m[1]:'';
    const want='ic-'+hit[1];if(want===cur)return;
    const rest=img.dataset.chain?img.dataset.chain.split('|').filter(Boolean).map(x=>'ic-'+x):[];
    img.dataset.fb=[cur].concat(rest).filter(Boolean).join('|');
    img.onerror=icoFallback;
    img.src='assets/icons/'+want+'.png';
  });
}
/* พื้นหลังศิลป์ของการ์ด KPI — ใช้ชื่อเดียวกับไอคอนของการ์ดนั้น
   เป็น background-image ใน CSS ถ้าไฟล์ยังไม่มีจะไม่ขึ้นเฉย ๆ ไม่มี error และไม่กระทบข้อความ */
const CARD_BG_DIR='assets/cardbg/';
function cardBg(name){return name?`<span class="kpibg" style="background-image:url('${CARD_BG_DIR}bg-${name}.webp')"></span>`:''}
function kpiCard(o){
  const T=o.go?'button':'div';
  let sc=o.sim===false?(SIM_TOUCH=null,''):simChip(simTake());
  /* การ์ดดัชนี NBL–MEI ไม่ได้อ่านผ่าน seriesAt จึงตรวจจากสัดส่วนน้ำหนักที่เป็นค่าจริงแทน */
  if(!sc&&o.sim!==false&&typeof MEI!=='undefined'&&MEI.real<.999&&/NBL|ดัชนีเศรษฐกิจรายเดือน|ดัชนีภาวะเศรษฐกิจ/.test(String(o.label||'')))
    sc=simChip({sim:1,real:MEI.real>0?1:0});
  const bg=o.bg===false?'':cardBg(o.bg||icoBase(o.img));
  return`<${T} class="kpi${bg?' hasbg':''}"${o.go?` data-go="${o.go}"`:''}${o.tip?` data-tip2="${o.tip}"`:''}
    ${o.color?`style="--kpi:${o.color}"`:''}>
    ${bg}
    <div class="h">${o.img?`<span class="ic icow img" style="background:${o.color}14">${icoImg(o.img,26)}<svg viewBox="0 0 24 24" style="stroke:${o.color}">${IC[o.icon]||''}</svg></span>`
      :o.icon?`<span class="ic" style="background:${o.color}1e"><svg viewBox="0 0 24 24" style="stroke:${o.color}">${IC[o.icon]}</svg></span>`:''}<span>${o.label}</span></div>
    ${o.rows?`<div class="kv2">${o.rows.map(r=>`<div class="kr"><span>${r[0]}</span><b class="n">${r[1]}</b><small>${r[2]||''}</small></div>`).join('')}</div>`
      :`<div class="v n">${o.value}${o.unit?`<small>${o.unit}</small>`:''}</div>`}
    ${o.spark?`<div class="spark">${o.spark}</div>`:''}
    <div class="f">${sc}${o.chip||''}${o.sub?`<span class="sub">${o.sub}</span>`:''}</div></${T}>`}
function gaugeSvg(p,color){
  const R=34,cx=39,cy=41,C=Math.PI*R,v=Math.min(100,p)/100;
  return`<svg viewBox="0 0 78 47"><path d="M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${cv('--line')}" stroke-width="8" stroke-linecap="round"/>
  <path d="M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
   stroke-dasharray="${(C*v).toFixed(1)} ${C.toFixed(1)}"/></svg>`}
function cropValue(){return D.crop.rows.reduce((a,r)=>a+(r.price?r.y*r.price:0),0)/1e6}
/* เซลล์ตารางที่แก้ไขได้ */
function ec(path,val,dec,cls){
  return`<td class="${cls||'r'}" data-path="${path}"${dec!=null?` data-dec="${dec}"`:''}>${val}</td>`}

/* ─────────────── 6) tooltip ─────────────── */
const TIP=()=>document.getElementById('tip');
function initTip(){
  document.addEventListener('mouseover',e=>{
    const el=e.target.closest('[data-tip2]');if(!el)return;
    const parts=String(el.dataset.tip2).split('|').filter(x=>x!=='');
    let html=`<div class="tt">${parts[0]}</div>`;
    const desc=[],meta=[];
    parts.slice(1).forEach(p=>{
      if(/^(ที่มา|วิธีคำนวณ|งวดข้อมูล|เกณฑ์)/.test(p))meta.push(p); else desc.push(p);
    });
    if(desc.length)html+=`<div class="td">${desc.join('<br>')}</div>`;
    meta.forEach(m=>{
      const i=m.indexOf(':');
      const k=i>0?m.slice(0,i):'', v=i>0?m.slice(i+1).trim():m;
      html+=`<div class="tm"><span>${k}</span>${v}</div>`;
    });
    TIP().innerHTML=html;
    TIP().classList.add('on');moveTip(e)});
  document.addEventListener('mousemove',e=>{if(TIP().classList.contains('on'))moveTip(e)});
  document.addEventListener('mouseout',e=>{if(e.target.closest('[data-tip2]'))TIP().classList.remove('on')});
}
function moveTip(e){
  const t=TIP(),w=t.offsetWidth,h=t.offsetHeight;
  let x=e.clientX+16,y=e.clientY+16;
  if(x+w>innerWidth-10)x=e.clientX-w-14;
  if(y+h>innerHeight-10)y=e.clientY-h-14;
  t.style.left=x+'px';t.style.top=y+'px';
}

/* ─────────────── 7) charts ─────────────── */
function chDefaults(){
  if(typeof Chart==='undefined')return;
  const small=innerWidth<768;
  Chart.defaults.font.family="'IBM Plex Sans Thai',system-ui,sans-serif";
  Chart.defaults.font.size=small?10:11;
  Chart.defaults.color=cv('--dim');
  const dd=Chart.defaults;
  dd.layout=dd.layout||{}; dd.layout.padding={top:8,right:12,bottom:2,left:2};
  dd.elements=dd.elements||{}; dd.elements.bar=dd.elements.bar||{}; dd.elements.point=dd.elements.point||{};
  dd.animation=(typeof dd.animation==='object'&&dd.animation)||{};
  Chart.defaults.plugins.legend.position='bottom';
  Chart.defaults.plugins.legend.labels.boxWidth=8;
  Chart.defaults.plugins.legend.labels.boxHeight=8;
  Chart.defaults.plugins.legend.labels.padding=12;
  Chart.defaults.plugins.legend.labels.usePointStyle=true;
  Chart.defaults.plugins.legend.labels.font={size:small?10:10.5};
  Chart.defaults.plugins.tooltip.enabled=false;
  Chart.defaults.plugins.tooltip.external=externalTip;
  dd.elements.bar.borderRadius=5;
  dd.elements.point.hoverRadius=5;
  dd.elements.point.hitRadius=12;
  dd.animation.duration=700;
  dd.animation.easing='easeOutCubic';
  Chart.defaults.maintainAspectRatio=false;
}
const CH={};
/* เก็บกวาดกราฟกำพร้า · ถ้า canvas ของกราฟถูกถอดออกจากหน้า (เช่นวาดการ์ดใหม่ด้วย innerHTML)
   Chart.js จะยังถือกราฟนั้นไว้และโยน error ตอนปรับขนาดจอ ซึ่งโผล่มาเป็น "Script error."
   ตรวจทุกครั้งที่หน้าเปลี่ยนโครงสร้าง แล้วทำลายกราฟที่ไม่มี canvas อยู่ในหน้าแล้ว */
(function(){
  if(typeof MutationObserver==='undefined')return;
  let tm=null;
  const sweep=()=>{
    tm=null;
    try{
      if(typeof Chart==='undefined'||!Chart.instances)return;
      Object.values(Chart.instances).forEach(c=>{
        if(c&&c.canvas&&!document.body.contains(c.canvas)){try{c.destroy()}catch(e){}}
      });
    }catch(e){}
  };
  const watch=()=>{
    if(watch.on||!document.body)return; watch.on=true;
    new MutationObserver(ms=>{
      if(tm)return;
      if(ms.some(m=>[...m.removedNodes].some(n=>n.nodeType===1&&(n.tagName==='CANVAS'||(n.querySelector&&n.querySelector('canvas'))))))
        tm=setTimeout(sweep,0);
    }).observe(document.body,{childList:true,subtree:true});
  };
  if(document.body)watch(); else document.addEventListener('DOMContentLoaded',watch);
  /* กันอีกชั้น · ปรับขนาดจอเมื่อไรก็กวาดก่อน เพราะจังหวะนั้นคือตอนที่ Chart.js โยน error */
  window.addEventListener('resize',sweep,true);
})();

/* ทำลายกราฟของ canvas นั้นก่อนจะถอดหรือสร้าง canvas ใหม่
   ถ้าไม่ทำ Chart.js จะยังถือ canvas เก่าไว้แล้วโยน error ตอนปรับขนาดหน้าจอ */
function killChart(id){
  try{ if(typeof Chart!=='undefined'){const c=Chart.getChart(id); if(c)c.destroy();} }catch(e){}
}
function mk(id,cfg){
  const el=document.getElementById(id);if(!el||typeof Chart==='undefined')return;
  /* กราฟผสมแท่งกับเส้น · ให้เส้นวาดทับแท่งเสมอ ไม่โดนแท่งบัง
     ใน Chart.js ชุดที่ order น้อยกว่าวาดทีหลังจึงอยู่บนสุด (ถ้าหน้าไหนกำหนด order เองจะไม่ไปยุ่ง) */
  try{
    const ds=(cfg.data&&cfg.data.datasets)||[];
    const ty=ds.map(d=>d.type||cfg.type);
    if(ty.indexOf('line')>=0&&ty.indexOf('bar')>=0)
      ds.forEach((d,i)=>{ if(d.order==null)d.order=ty[i]==='line'?0:1; });
  }catch(e){}
  const small=innerWidth<768;
  try{
    const o=cfg.options=cfg.options||{};
    o.scales=o.scales||{};
    if(o.indexAxis==='y'&&o.scales.y){
      o.scales.y.ticks=Object.assign({autoSkip:false,crossAlign:'far',padding:4},o.scales.y.ticks||{});
      o.scales.y.afterFit=function(sc){sc.width=Math.min(sc.width+6, small?128:210)};
    }
    if(o.scales.x&&o.indexAxis!=='y'){
      o.scales.x.ticks=Object.assign({autoSkip:true,maxRotation:small?40:0,minRotation:0},o.scales.x.ticks||{});
    }
    if(cfg.type==='doughnut'||cfg.type==='pie'){
      o.plugins=o.plugins||{}; o.plugins.legend=o.plugins.legend||{};
      if(small||o.plugins.legend.position==='right'&&el.clientWidth<420)o.plugins.legend.position='bottom';
      o.plugins.legend.labels=Object.assign({boxWidth:8,boxHeight:8,padding:9,font:{size:small?9.5:10.5}},o.plugins.legend.labels||{});
    }
    if(CH[id])CH[id].destroy();
    CH[id]=new Chart(el,cfg);
  }catch(e){console.warn('chart',id,e)}}
const ax=(e={})=>({grid:{color:cv('--grid'),drawTicks:false},border:{display:false},
  ticks:{padding:6,maxRotation:0,autoSkipPadding:14},...e});
const PAL=()=>[cv('--brand'),cv('--blue'),cv('--gold'),cv('--coral'),cv('--leaf'),cv('--brand2'),cv('--plum')];

/* ─────────────── 14) ภาคส่วนรายเดือน (สร้างหน้าอัตโนมัติ) ─────────────── */
const SEC_META={
  industry:{title:'อุตสาหกรรมและการผลิต',lead:'โรงงาน เงินลงทุน และการจ้างงาน โดยมีปริมาณการใช้ไฟฟ้าภาคอุตสาหกรรมเป็นตัวยืนยันว่าโรงงานเดินเครื่องจริงหรือไม่',
    insight:'การใช้ไฟฟ้าภาคอุตสาหกรรมเป็นตัวชี้เชิงประจักษ์ที่โกหกไม่ได้ ถ้าจำนวนโรงงานเพิ่มแต่ไฟฟ้าไม่เพิ่ม แปลว่าโรงงานที่ขออนุญาตยังไม่เดินเครื่องจริง',
    extra:{title:'5 กลุ่มอุตสาหกรรมที่ลงทุนสูงสุด',unit:'ล้านบาท',
      rows:[['แปรรูปผลผลิตการเกษตร',3120],['ผลิตภัณฑ์อโลหะ / วัสดุก่อสร้าง',2140],['อาหารและเครื่องดื่ม',1580],
            ['ผลิตพลังงานและไฟฟ้าชีวมวล',1120],['ผลิตภัณฑ์ไม้และเฟอร์นิเจอร์',760]]}},
  trade:{title:'การค้า ค่าครองชีพ และการลงทุนเอกชน',lead:'ดัชนีราคาผู้บริโภคบอกว่าเงินในกระเป๋าประชาชนซื้อของได้เท่าเดิมหรือไม่ ส่วนสินเชื่อบอกว่าผู้ประกอบการยังกล้าลงทุนอยู่หรือเปล่า',
    insight:'เมื่อเงินเฟ้อเร่งตัวขึ้นพร้อมกับสินเชื่อที่ชะลอลง เป็นสัญญาณว่ากำลังซื้อถูกบีบสองทาง ควรพิจารณามาตรการลดค่าครองชีพควบคู่กับการเข้าถึงแหล่งทุน'},
  consume:{title:'การบริโภคและพลังงาน',lead:'ปริมาณน้ำมันที่ใช้และรถที่จดทะเบียนใหม่ คือกระจกสะท้อนกำลังซื้อและความเชื่อมั่นของครัวเรือนที่เห็นผลเร็วที่สุด',
    insight:'รถจักรยานยนต์จดทะเบียนใหม่เป็นตัวชี้กำลังซื้อระดับฐานราก ส่วนรถเพื่อการพาณิชย์สะท้อนความเชื่อมั่นของผู้ประกอบการขนส่งและการค้า'},
  labor:{title:'ตลาดแรงงาน',lead:'คนมีงานทำคือฐานกำลังซื้อที่ยั่งยืนที่สุด หน้านี้ติดตามการมีงานทำ การว่างงาน และการเข้าสู่ระบบประกันสังคม',
    insight:'จังหวัดที่พึ่งภาคเกษตรสูงมักมีแรงงานนอกระบบมาก ตัวเลขผู้ประกันตนมาตรา 40 ที่เพิ่มขึ้นจึงเป็นสัญญาณที่ดีว่าแรงงานอิสระเข้าสู่ระบบคุ้มครองมากขึ้น'},
  tourism:{title:'ภาคการท่องเที่ยว',lead:'รายได้จากการท่องเที่ยวคือเงินใหม่ที่ไหลเข้าจังหวัดจากภายนอก ต่างจากการค้าภายในที่เป็นการหมุนเงินก้อนเดิม',
    insight:'หนองบัวลำภูมีจุดขายด้านธรรมชาติและแหล่งท่องเที่ยวเชิงเกษตร 73 แห่ง การเชื่อมเส้นทางท่องเที่ยวเข้ากับแปลงใหญ่และวิสาหกิจชุมชนจะเพิ่มรายได้ให้เกษตรกรโดยตรง'}
};
function renderSector(sid){
  const sec=SECTORS.find(s=>s.id===sid),M=SEC_META[sid];
  const all=[];sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id);d.series.forEach(s=>all.push({d,s}))});
  const agy=[...new Set(sec.datasets.map(id=>DATASETS.find(x=>x.id===id).agency))].join(' · ');
  const el=document.getElementById('v-'+sid);
  el.innerHTML=`
    <div class="ph"><div class="t" style="display:flex;gap:14px;align-items:flex-start">
      <span class="bigico icow img">${icoImg(sec.ico||sec.id,52)}</span>
      <span><h2>${M.title}</h2><p>${M.lead}</p></span></div>
      <div class="r"><span class="chip mock">โครงร่าง รอข้อมูลจริง</span><span class="chip">${agy.replace(/สำนักงาน/g,'สนง.')}</span></div></div>
    ${slicerBar('slc-'+sid,{freqs:['M','Q','Y'],freq:'M',label:'เลือกงวดข้อมูล',compare:true})}
    <div class="grid g4 mb" id="k-${sid}"></div>
    <div class="grid g21 mb">
      <div class="c"><header><h3>แนวโน้มรายเดือน 36 เดือน</h3>
        <span class="r"><span class="segs" data-dom="${sid}"><button class="on" data-mode="line">ค่าจริง</button><button data-mode="yoy">%YoY</button></span></span></header>
        <div class="b"><div class="ch lg"><canvas id="c-${sid}"></canvas></div><div class="note">${M.insight}</div></div></div>
      <div class="c"><header><span class="hdico icow img" data-hdico="${M.extra?'industry':'compare'}"></span><h3>${M.extra?M.extra.title:'เปรียบเทียบรายปี'}</h3>${M.extra?`<span class="u">${M.extra.unit}</span>`:''}</header>
        <div class="b">${M.extra?'<div class="sc"><table class="t" id="tx-'+sid+'"></table></div>':'<div class="ch lg"><canvas id="cy-'+sid+'"></canvas></div>'}</div></div>
    </div>
    <div class="grid g2">
      ${M.extra?`<div class="c"><header><h3>เปรียบเทียบรายปี</h3></header><div class="b"><div class="ch"><canvas id="cy-${sid}"></canvas></div></div></div>`:''}
      <div class="c"><header><h3>กระจายรายอำเภอ</h3><span class="u">เดือนล่าสุด</span></header>
        <div class="b"><div class="sc"><table class="t" id="td-${sid}"></table></div></div></div>
    </div>
    <div class="c" style="margin-top:13px"><header><h3>แหล่งข้อมูลและหน่วยงานผู้รับผิดชอบ</h3></header>
      <div class="b">${srcBar(sec.datasets)}</div></div>`;
  const st=slicerState('slc-'+sid);
  const info=document.getElementById('slc-'+sid+'-info');
  const full={M:1,Q:3,Y:12}[st.freq];
  if(info)info.innerHTML=`กำลังแสดง <b>${st.label}</b>`+
    (st.freq==='M'?'':` · ครอบคลุม ${st.idx.length} เดือน`+(st.idx.length<full?' <span style="color:var(--warn)">(ยังไม่ครบงวด)</span>':''))+
    (st.cmp?' · เทียบงวดเดียวกันปีก่อน':'');
  $('#k-'+sid).innerHTML=all.slice(0,4).map((o,i)=>{
    const arr=DB[o.d.id][o.s.key];
    const mode=o.s.agg||(o.s.pct?'avg':'sum');
    const modeTxt={sum:'ผลรวมในงวด',avg:'ค่าเฉลี่ยในงวด',last:'ค่า ณ สิ้นงวด'}[mode];
    const now=seriesAt(arr,st,mode), was=seriesPrevYear(arr,st,mode);
    const pc=was?pctc(now,was):null;
    return kpiCard({icon:['chart','coin','people','bolt'][i],img:o.s.ico,color:PAL()[i],label:o.s.label,
      value:f(now,o.s.dec??0),unit:o.s.unit,
      chip:(pc==null?'<span class="chip">—</span>':chip(pc))+' '+statusBadge(pc,!!o.d.invert,o.s.label+' เทียบงวดเดียวกันปีก่อน'),
      spark:spark(arr.slice(-18).map(x=>x.v),PAL()[i]),
      sub:agencyName(o.d.id).replace('สำนักงาน','สนง.').replace('จังหวัดหนองบัวลำภู','จ.นภ.'),
      tip:tipOf({t:o.s.label,
        d:'หน่วยวัด '+o.s.unit+(st.freq==='M'?' · ค่าของเดือนที่เลือก':' · '+modeTxt),
        calc:st.freq==='M'?'ค่าที่หน่วยงานรายงานในเดือนนั้นโดยตรง'
          :({sum:'รวมค่ารายเดือนภายในงวดที่เลือก',
             avg:'เฉลี่ยค่ารายเดือนภายในงวดที่เลือก เพราะเป็นอัตราหรือดัชนี นำมาบวกกันไม่ได้',
             last:'ใช้ค่าของเดือนสุดท้ายในงวด เพราะเป็นยอดสะสมหรือจำนวนคงค้าง ณ เวลาหนึ่ง นำมาบวกกันจะนับซ้ำ'}[mode])+
            (pc!=null?' · เปรียบเทียบกับงวดเดียวกันของปีก่อน = (งวดนี้ − ปีก่อน) ÷ ปีก่อน × 100':''),
        src:o.d.id, when:st.label})})}).join('');
  drawSectorChart(sid,'line');
  mk('cy-'+sid,{type:'bar',data:{labels:YEARS.map(y=>'ปี '+y),
    datasets:all.slice(0,3).map((o,i)=>({label:o.s.label,
      data:YEARS.map(y=>{const q=DB[o.d.id][o.s.key].filter(x=>x.y===y);if(!q.length)return null;
        return o.s.pct?+(q.reduce((a,b)=>a+b.v,0)/q.length).toFixed(2):+q.reduce((a,b)=>a+b.v,0).toFixed(1)}),
      backgroundColor:PAL()[i],borderRadius:5,barPercentage:.7}))},
    options:{plugins:{legend:{position:'bottom',labels:{padding:10,font:{size:10}}}},
      scales:{x:ax({grid:{display:false}}),y:ax({beginAtZero:true,ticks:{callback:v=>f(v,0)}})}}});
  const o=all[0],vals=DISTRICTS.map(dt=>({n:dt.name,v:DBD[o.d.id][o.s.key][dt.code]})).sort((a,b)=>b.v-a.v);
  const tot=vals.reduce((a,b)=>a+b.v,0)||1,mx=vals[0].v||1;
  $('#td-'+sid).innerHTML=`<thead><tr><th>อำเภอ</th><th class="r">${o.s.label} (${o.s.unit})</th><th class="r">สัดส่วน</th><th style="width:110px"></th></tr></thead><tbody>`+
    vals.map(r=>`<tr><td>${r.n}</td><td class="r">${f(r.v,o.s.dec??0)}</td><td class="r">${(r.v/tot*100).toFixed(1)}%</td>
      <td><div class="bar"><i style="width:${(r.v/mx*100).toFixed(0)}%;background:${sec.color}"></i></div></td></tr>`).join('')+'</tbody>';
  bindSlicers(()=>renderSector(sid));
  if(M.extra){const m2=M.extra.rows[0][1];
    $('#tx-'+sid).innerHTML=`<thead><tr><th>รายการ</th><th class="r">${M.extra.unit}</th><th style="width:80px"></th></tr></thead><tbody>`+
      M.extra.rows.map(r=>`<tr><td>${rowIco(r[0])}${r[0]}</td><td class="r">${f(r[1],0)}</td>
        <td><div class="bar"><i style="width:${(r[1]/m2*100).toFixed(0)}%;background:${sec.color}"></i></div></td></tr>`).join('')+'</tbody>';}
}
function drawSectorChart(sid,mode){
  const sec=SECTORS.find(s=>s.id===sid),ds=[];let i=0;
  sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id);
    d.series.forEach(s=>{const arr=DB[id][s.key];
      const data=mode==='yoy'?arr.map((x,j)=>j<12?null:+pctc(x.v,arr[j-12].v).toFixed(2)):arr.map(x=>x.v);
      const c=PAL()[i%7];
      ds.push({label:s.label+(mode==='yoy'?' (%YoY)':' ('+s.unit+')'),data,borderColor:c,backgroundColor:c+'20',
        borderWidth:i===0?2.4:1.7,pointRadius:0,pointHoverRadius:4,tension:.32,fill:i===0&&mode!=='yoy',
        yAxisID:(mode==='yoy'||i===0)?'y':'y2'});i++})});
  const scales={x:ax({grid:{display:false},ticks:{maxTicksLimit:13,font:{size:9.5}}}),y:ax({ticks:{callback:v=>f(v,0)}})};
  if(mode!=='yoy'&&ds.length>1)scales.y2={position:'right',grid:{display:false},border:{display:false},ticks:{callback:v=>f(v,0),font:{size:9.5}}};
  mk('c-'+sid,{type:'line',data:{labels:MONTHS.map(m=>m.label),datasets:ds},
    options:{interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom',labels:{padding:11,font:{size:10}}}},scales}});
}

/* ─────────────── 19) โหมดแก้ไขตาราง ─────────────── */
let EDIT=false;
let AUTH=null;
try{AUTH=JSON.parse(sessionStorage.getItem('nblEcon.auth')||'null')}catch(e){}

/* หน่วยงานที่มีสิทธิ์แก้แต่ละตาราง — ต้องตรงกับคอลัมน์ domains ในชีต Users */
const OWNER_NAME={spend:'สำนักงานคลังจังหวัด',crop:'สำนักงานเกษตรจังหวัด',
  factory:'สำนักงานอุตสาหกรรมจังหวัด',power:'การไฟฟ้าส่วนภูมิภาคจังหวัด',
  cpi:'สำนักงานพาณิชย์จังหวัด',credit:'SME D Bank',fuel:'สำนักงานพลังงานจังหวัด',
  car:'สำนักงานขนส่งจังหวัด',labor:'สำนักงานแรงงานจังหวัด',social:'สำนักงานประกันสังคมจังหวัด',
  tour:'สำนักงานการท่องเที่ยวและกีฬาจังหวัด','*':'ผู้ดูแลระบบเท่านั้น'};
function myDomainList(){return String((AUTH&&AUTH.domains)||'').split(',').map(x=>x.trim()).filter(Boolean)}
function canEdit(owner){
  if(!AUTH)return false;
  if(AUTH.role==='admin'||myDomainList().indexOf('*')>=0)return true;
  return owner&&owner!=='*'&&myDomainList().indexOf(owner)>=0;
}
function tableOwner(td){
  const t=td.closest('[data-owner]');
  return t?t.dataset.owner:'*';
}

function applyEditMode(){
  document.querySelectorAll('table[data-owner]').forEach(t=>{
    t.classList.toggle('locked',EDIT&&!canEdit(t.dataset.owner));
  });
  $$('td[data-path]').forEach(td=>{
    if(EDIT&&canEdit(tableOwner(td)))td.setAttribute('contenteditable','true');
    else td.removeAttribute('contenteditable');
  });
}

/* ── กล่องเข้าสู่ระบบสำหรับแก้ไขข้อมูล ── */
function authBox(){
  return new Promise(resolve=>{
    const wrap=document.createElement('div');
    wrap.className='modal';
    wrap.innerHTML=`<div class="mbox">
      <h3>ยืนยันตัวตนก่อนแก้ไขข้อมูล</h3>
      <p>ระบบจะเปิดให้แก้ไขเฉพาะตารางที่หน่วยงานของท่านรับผิดชอบ ผู้ดูแลระบบแก้ไขได้ทุกตาราง</p>
      <label>หน่วยงาน</label>
      <select id="mAg">
        <option value="klang">สำนักงานคลังจังหวัดหนองบัวลำภู</option>
        <option value="agri">สำนักงานเกษตรจังหวัดหนองบัวลำภู</option>
        <option value="industry">สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู</option>
        <option value="pea">การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู</option>
        <option value="commerce">สำนักงานพาณิชย์จังหวัดหนองบัวลำภู</option>
        <option value="smebank">ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมฯ</option>
        <option value="energy">สำนักงานพลังงานจังหวัดหนองบัวลำภู</option>
        <option value="transport">สำนักงานขนส่งจังหวัดหนองบัวลำภู</option>
        <option value="labour">สำนักงานแรงงานจังหวัดหนองบัวลำภู</option>
        <option value="sso">สำนักงานประกันสังคมจังหวัดหนองบัวลำภู</option>
        <option value="mots">สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู</option>
        <option value="province">สำนักงานจังหวัดหนองบัวลำภู (ผู้ดูแลระบบ)</option>
        <option value="admin">สำนักงานสถิติจังหวัดหนองบัวลำภู (ผู้ดูแลระบบ)</option>
      </select>
      <label>รหัส PIN</label>
      <input id="mPin" type="password" inputmode="numeric" maxlength="10" autocomplete="off" placeholder="••••••">
      <div class="mmsg" id="mMsg"></div>
      <div class="mact">
        <button class="tb" id="mCancel">ยกเลิก</button>
        <button class="tb on" id="mOk">เข้าสู่ระบบ</button>
      </div>
      <div class="mnote">PIN ถูกเก็บเป็นค่า hash บนเซิร์ฟเวอร์เท่านั้น ใส่ผิดเกิน 5 ครั้งระบบจะล็อกบัญชี 15 นาที</div>
    </div>`;
    document.body.appendChild(wrap);
    const close=v=>{wrap.remove();resolve(v)};
    wrap.querySelector('#mCancel').onclick=()=>close(false);
    wrap.addEventListener('click',e=>{if(e.target===wrap)close(false)});
    const msg=t=>{wrap.querySelector('#mMsg').textContent=t;wrap.querySelector('#mMsg').style.display='block'};
    const go=async()=>{
      const pin=wrap.querySelector('#mPin').value.trim();
      if(!CFG.API){msg('ยังไม่ได้เชื่อมฐานข้อมูล — ไปตั้งค่า URL ที่หน้าตั้งค่าระบบก่อน');return}
      if(!/^\d{4,10}$/.test(pin)){msg('กรอก PIN เป็นตัวเลข');return}
      wrap.querySelector('#mOk').disabled=true;
      try{
        const r=await jsonp(CFG.API,{action:'login',agency:wrap.querySelector('#mAg').value,pin});
        if(!r||!r.ok)throw new Error((r&&r.error)||'เข้าสู่ระบบไม่สำเร็จ');
        AUTH={token:r.token,code:r.agency.code,name:r.agency.name,role:r.agency.role,domains:r.agency.domains,
              exp:Date.now()+(r.expires_in||5400)*1000};
        try{sessionStorage.setItem('nblEcon.auth',JSON.stringify(AUTH))}catch(e){}
        close(true);
      }catch(err){msg(err.message);wrap.querySelector('#mOk').disabled=false}
    };
    wrap.querySelector('#mOk').onclick=go;
    wrap.querySelector('#mPin').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
    setTimeout(()=>wrap.querySelector('#mPin').focus(),80);
  });
}
function authValid(){return AUTH&&AUTH.exp&&AUTH.exp>Date.now()}
function authLogout(){AUTH=null;try{sessionStorage.removeItem('nblEcon.auth')}catch(e){}
  if(EDIT)toggleEdit();}

async function toggleEdit(){
  if(!EDIT){
    if(!authValid()){AUTH=null;
      const ok=await authBox();
      if(!ok)return;}
  }
  EDIT=!EDIT;
  try{localStorage.setItem('nblEcon.editing',EDIT?'1':'0')}catch(e){}
  document.body.classList.toggle('editing',EDIT);
  const be=$('#btnEdit'); if(be)be.classList.toggle('on',EDIT);
  let bar=document.getElementById('edbar');
  if(EDIT&&!bar){
    bar=document.createElement('div');bar.id='edbar';bar.className='edbar';
    const scope=(AUTH.role==='admin'||myDomainList().indexOf('*')>=0)
      ? 'สิทธิ์ผู้ดูแลระบบ แก้ไขได้ทุกตาราง'
      : 'แก้ไขได้เฉพาะ '+myDomainList().map(d=>OWNER_NAME[d]||d).join(' · ');
    bar.innerHTML=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h4.5L19 9.5a2.1 2.1 0 0 0-3-3L5.5 17z"/></svg>
      <span><b>${AUTH.name||AUTH.code}</b> — ${scope} · คลิกที่ตัวเลขเพื่อแก้ไข กด Enter เพื่อบันทึก</span>
      <span class="sp"></span>
      <button class="tb" id="btnEdOut" style="height:26px;font-size:11px">ออกจากระบบ</button>
      <button class="tb" id="btnEdDone" style="height:26px;font-size:11px">เสร็จสิ้น</button>`;
    const m=document.querySelector('.main'); if(m)m.prepend(bar);
    const bo=document.getElementById('btnEdOut'); if(bo)bo.onclick=authLogout;
  }else if(!EDIT&&bar)bar.remove();
  applyEditMode();
}
function commitCell(td){
  if(!canEdit(tableOwner(td))){applyEditMode();return}
  const path=td.dataset.path,dec=+(td.dataset.dec||0);
  const raw=td.textContent.replace(/[, \s]/g,'').replace('—','');
  const v=raw===''?null:Number(raw);
  if(raw!==''&&isNaN(v)){alert('กรุณากรอกเป็นตัวเลข');return}
  const keys=path.split('.'),lastK=keys.pop();
  const obj=keys.reduce((o,k)=>o[/^\d+$/.test(k)?+k:k],D);
  obj[/^\d+$/.test(lastK)?+lastK:lastK]=v;
  saveEdits();
  safeRender();
  applyEditMode();
  const root=path.split('.')[0];
  if(TABLE_OWNER.hasOwnProperty(root))pushTable(root);
}

/* ─────────────── 20) live data ─────────────── */
function jsonp(url,p={}){return new Promise((res,rej)=>{
  const cb='cb_'+Math.random().toString(36).slice(2),sc=document.createElement('script');
  const to=setTimeout(()=>{cl();rej(new Error('หมดเวลาเชื่อมต่อ'))},15000);
  function cl(){clearTimeout(to);delete window[cb];sc.remove()}
  window[cb]=d=>{cl();res(d)};sc.onerror=()=>{cl();rej(new Error('เชื่อมต่อไม่ได้'))};
  sc.src=url+(url.includes('?')?'&':'?')+new URLSearchParams({...p,callback:cb});document.head.appendChild(sc)})}
const QMON={1:[1,2,3],2:[4,5,6],3:[7,8,9],4:[10,11,12]};
/* ใส่ค่าที่อนุมัติแล้วหนึ่งแถวลงชุดรายเดือน · รายไตรมาสกระจายลง 3 เดือน (ชุดแบบผลรวมหาร 3 ชุดแบบอัตรา/สะสมใช้ค่าเดิม) */
function applyLiveRow(row){
  const d=DATASETS.find(x=>x.id===row.domain), se=d&&d.series.find(x=>x.key===row.key);
  const arr=se&&DB[row.domain][row.key]; if(!arr)return false;
  const per=String(row.period||''), val=Number(row.value); if(!isFinite(val))return false;
  let keys=[],share=1; const q=per.match(/^(\d{4})-Q([1-4])$/);
  if(q){keys=QMON[q[2]].map(m=>q[1]+'-'+String(m).padStart(2,'0'));
    if((se.agg||(se.pct?'avg':'sum'))==='sum')share=1/3;}
  else if(/^\d{4}-\d{2}$/.test(per))keys=[per];
  else return false;
  const area=String(row.area||'PROV');
  if(area==='PROV'){let hit=false;
    keys.forEach(k=>{const t=arr.find(x=>x.key===k);if(t){t.v=+(val*share).toFixed(se.dec??4);t.sim=false;hit=true}});
    return hit;}
  if(DBD[row.domain]&&DBD[row.domain][row.key]){
    DBD[row.domain][row.key][area]=val;
    (DBD_REAL[row.domain+'|'+row.key]=DBD_REAL[row.domain+'|'+row.key]||{})[area]=true;return true}
  return false;
}
/* หน้าภาคส่วนที่ใช้ตารางจริง: รับค่าที่อนุมัติแล้วชุดเดียวกับที่กรอกทีละช่อง */
function applyLiveToPages(rows){
  let n=0;
  /* ท่องเที่ยว: รายเดือน → ปีงบประมาณ ต.ค.–ก.ย. */
  if(typeof DX!=='undefined'&&DX.tour){
    const MAP={visit:'visitor',rev:'revenue',occ:'occ'};
    rows.forEach(r=>{
      if(r.domain!=='tour'||!MAP[r.key]||String(r.area||'PROV')!=='PROV')return;
      const m=String(r.period).match(/^(\d{4})-(\d{2})$/); if(!m)return;
      const y=+m[1],mo=+m[2], fy=mo>=10?y+1:y, i=mo>=10?mo-9:mo+3;
      const list=DX.tour[MAP[r.key]]; if(!Array.isArray(list))return;
      const t=list.find(x=>x.fy===fy&&x.i===i);
      if(t)t.v=+r.value; else list.push({fy,i,label:TH_M[mo-1]+'-'+String(y).slice(-2),v:+r.value});
      n++;
    });
    ['visitor','revenue','occ'].forEach(k=>Array.isArray(DX.tour[k])&&DX.tour[k].sort((a,b)=>a.fy-b.fy||a.i-b.i));
  }
  /* แรงงาน: รายไตรมาส → ตารางภาวะการทำงาน */
  const LQ=D&&D.labor&&D.labor.quarters;
  if(Array.isArray(LQ)){
    const by={};
    rows.forEach(r=>{
      if(r.domain!=='labor'||['ue','ur','emp','force'].indexOf(r.key)<0||String(r.area||'PROV')!=='PROV')return;
      if(!/^\d{4}-Q[1-4]$/.test(r.period))return;
      (by[r.period]=by[r.period]||{})[r.key]=+r.value;
    });
    Object.keys(by).forEach(q=>{
      const v=by[q]; let t=LQ.find(x=>x.q===q);
      if(!t){
        if(v.force==null||v.emp==null)return;   /* แถวใหม่ต้องมีอย่างน้อยกำลังแรงงานและผู้มีงานทำ */
        t={q,y:+q.slice(0,4),n:+q.slice(-1),pop15:null,lfpr:null,notin:null};LQ.push(t);
      }
      Object.assign(t,v);
      if(v.ur==null&&t.force&&t.ue!=null)t.ur=+(t.ue/t.force*100).toFixed(2);
      n++;
    });
    LQ.sort((a,b)=>a.q<b.q?-1:1);
  }
  return n;
}
async function loadLive(){
  if(!CFG.API){LIVE.err=true;return}
  try{const r=await jsonp(CFG.API,{action:'series'});
    if(!r||!r.ok)throw 0;
    LIVE.ok=true;LIVE.at=r.updated||'';LIVE.rows=0;
    r.rows.forEach(row=>{if(applyLiveRow(row))LIVE.rows++});
    applyLiveToPages(r.rows);
    MEI=buildMei();safeRender();
  }catch(e){LIVE.err=true;try{trustBar()}catch(_){}}
}



/* ─────────────── 20b) ตารางรายละเอียด: ซิงก์กับ Google Sheet ─────────────── */
const TABLE_OWNER={fiscal:'spend',crop:'crop',fruit:'crop',water:'crop',base:'crop',price:'cpi',labor:'labor',
  otop:'otop',tour:'tour',pop:'popreg',pyr:'popreg',irrig:'irrig',house:'house',agri2:'crop',
  gpp:'spend',gppgrow:'spend',macro:'spend'};
let TBL_META={};
/* รวมตารางจากชีตทับค่าในไฟล์แบบรายหัวข้อ — หัวข้อที่ชีตยังไม่มีใช้ค่าจากไฟล์
   ตารางท่องเที่ยวรุ่นเก่าในชีตไม่มีประเภทแหล่ง (t) → คงรายการพิกัดชุดใหม่จากไฟล์ไว้ ไม่ให้พิกัดผิดชุดเดิมกลับมา */
function mergeRemote(k,local,remote){
  if(!remote||typeof remote!=='object'||Array.isArray(remote)||!local||typeof local!=='object'||Array.isArray(local))return remote;
  const out=Object.assign({},local,remote);
  if(k==='tour'&&Array.isArray(local.spots)&&(!Array.isArray(remote.spots)||!remote.spots.some(x=>x&&x.t)))out.spots=local.spots;
  return out;
}
async function loadTables(){
  if(!CFG.API)return;
  try{
    const r=await jsonp(CFG.API,{action:'tables'});
    if(!r||!r.ok||!r.tables)return;
    let n=0;
    Object.keys(r.tables).forEach(k=>{
      if(D[k]!==undefined){ D[k]=r.tables[k]; n++; }
      else if(typeof DX!=='undefined'&&DX[k]!==undefined){ DX[k]=mergeRemote(k,DX[k],r.tables[k]); n++; }
    });
    TBL_META=r.updated||{};
    /* ตารางปิรามิดเก็บเป็นแถวแบน ต้องแปลงกลับเข้าโครงสร้างที่หน้าประชากรใช้ */
    if(r.tables.pyr&&typeof pyrApplyRows==='function')pyrApplyRows(DX.pyr);
    if(n)safeRender();
  }catch(e){}
}
function toast(text,bad){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}
  t.textContent=text;
  t.className='toast on'+(bad?' bad':'');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),3200);
}
async function pushTable(key){
  if(!CFG.API){toast('บันทึกในเครื่องนี้แล้ว — ยังไม่ได้เชื่อมฐานข้อมูลกลาง',true);return}
  const store=(D[key]!==undefined)?D:(typeof DX!=='undefined'&&DX[key]!==undefined?DX:null);
  if(!store){toast('ไม่รู้จักตาราง '+key,true);return}
  if(!authValid()){toast('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',true);return}
  try{
    const res=await fetch(CFG.API,{method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({action:'savetable',token:AUTH.token,key:key,json:JSON.stringify(store[key])})});
    const r=await res.json();
    if(!r.ok)throw new Error(r.error||'บันทึกไม่สำเร็จ');
    toast('บันทึกขึ้นฐานข้อมูลกลางแล้ว ทุกคนเห็นตรงกัน');
  }catch(e){
    toast('บันทึกขึ้นฐานข้อมูลกลางไม่สำเร็จ ('+e.message+') เก็บไว้ในเครื่องนี้แล้ว',true);
  }
}

/* ─────────────── 23) Tooltip กราฟแบบการ์ดลอย ─────────────── */
function chartTipEl(){
  let el=document.getElementById('chtip');
  if(!el){el=document.createElement('div');el.id='chtip';document.body.appendChild(el)}
  return el;
}
/* สร้างข้อความ tooltip แบบมีโครงสร้าง — ใช้กับทุกตัวชี้วัด
   t=ชื่อ · d=ความหมาย · calc=วิธีคำนวณ · src=หน่วยงานเจ้าของข้อมูล (คีย์ใน AGENCY_FULL หรือข้อความ) · when=งวดข้อมูล */
function tipOf(o){
  const ag=(typeof AGENCY_FULL!=='undefined'&&AGENCY_FULL[o.src])?AGENCY_FULL[o.src]:null;
  const src=ag?(ag.n+(ag.doc?' · '+ag.doc:'')):(o.src||'');
  return [o.t||'', o.d||'', o.calc?('วิธีคำนวณ: '+o.calc):'', src?('ที่มา: '+src):'', o.when?('งวดข้อมูล: '+o.when):'']
    .filter(Boolean).join('|').replace(/"/g,'&#34;');
}
function agencyName(k){const a=AGENCY_FULL[k];return a?a.n:k}

function externalTip(ctx){
  const el=chartTipEl(), tt=ctx.tooltip;
  if(!tt||tt.opacity===0){el.classList.remove('on');return}
  const title=(tt.title||[]).join(' ');
  const colors=tt.labelColors||[];
  const lines=(tt.body||[]).map(b=>b.lines).flat();
  let html=title?`<div class="cht-t">${title}</div>`:'';
  html+=lines.map((raw,i)=>{
    const c=colors[i]||{};
    const col=c.backgroundColor||c.borderColor||'var(--brand)';
    const str=String(raw);
    const k=str.lastIndexOf(':');
    if(k>0){
      const lab=str.slice(0,k).trim(), val=str.slice(k+1).trim();
      return `<div class="cht-r"><i style="background:${col}"></i><span class="cht-l">${lab}</span><b class="cht-v">${val}</b></div>`;
    }
    return `<div class="cht-r"><i style="background:${col}"></i><b class="cht-v" style="margin-left:0">${str}</b></div>`;
  }).join('');
  const foot=(tt.footer||[]).join(' ');
  if(foot)html+=`<div class="cht-f">${foot}</div>`;
  el.innerHTML=html;
  el.classList.add('on');
  const r=ctx.chart.canvas.getBoundingClientRect();
  const w=el.offsetWidth,h=el.offsetHeight;
  let x=r.left+tt.caretX+16, y=r.top+tt.caretY-h/2;
  if(x+w>innerWidth-10)x=r.left+tt.caretX-w-16;
  if(x<8)x=8;
  if(y<8)y=8;
  if(y+h>innerHeight-8)y=innerHeight-h-8;
  el.style.left=x+'px'; el.style.top=y+'px';
}

/* ─────────────── 24) ตัวเลขวิ่งขึ้นตอนเปิดหน้า ─────────────── */
function animateNums(root){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  (root||document).querySelectorAll('.kpi .v, .cvst b, .pil b, .meibox .big, .big2').forEach(el=>{
    if(el.dataset.anim)return;
    const small=el.querySelector('small');
    const raw=(small?el.childNodes[0]&&el.childNodes[0].textContent:el.textContent)||'';
    const txt=raw.trim();
    const m=txt.match(/^-?[\d,]+(\.\d+)?%?$/);
    if(!m)return;
    const pct=txt.endsWith('%');
    const num=parseFloat(txt.replace(/[,%]/g,''));
    if(!isFinite(num)||Math.abs(num)<1)return;
    const dec=(txt.split('.')[1]||'').replace('%','').length;
    el.dataset.anim='1';
    const t0=performance.now(), dur=Math.min(900,420+Math.log10(Math.abs(num)+1)*180);
    const write=v=>{
      const out=v.toLocaleString('th-TH',{minimumFractionDigits:dec,maximumFractionDigits:dec})+(pct?'%':'');
      if(small)el.childNodes[0].textContent=out; else el.textContent=out;
    };
    const step=now=>{
      const p=Math.min(1,(now-t0)/dur);
      const e=1-Math.pow(1-p,3);
      write(num*e);
      if(p<1)requestAnimationFrame(step); else write(num);
    };
    requestAnimationFrame(step);
  });
}

/* ─────────────── 25) การ์ดค่อย ๆ ปรากฏ ─────────────── */
function revealCards(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const els=[...document.querySelectorAll('.main .c, .main .kpi, .main .sect, .main .gau, .main .pcard, .main .fruit')];
  els.slice(0,40).forEach((el,i)=>{
    if(el.dataset.rev)return;
    el.dataset.rev='1';
    el.style.animation=`riseIn .42s cubic-bezier(.22,.7,.3,1) ${Math.min(i*28,420)}ms both`;
  });
}


/* ─────────────── 26) ปุ่มกลับขึ้นบน ─────────────── */
function initToTop(){
  if(document.getElementById('toTop'))return;
  const b=document.createElement('button');
  b.id='toTop';b.className='totop';b.setAttribute('aria-label','กลับขึ้นบน');
  b.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  document.body.appendChild(b);
  const sc=document.querySelector('.main');
  const target=sc||window;
  b.onclick=()=>{(sc||window).scrollTo({top:0,behavior:'smooth'})};
  const onScroll=()=>{
    const y=sc?sc.scrollTop:window.scrollY;
    b.classList.toggle('on',y>320);
  };
  target.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('scroll',onScroll,{passive:true});
}


/* ─────────────── 27) แบนเนอร์ภาพหัวหน้า (ใส่ไฟล์เมื่อไรก็ขึ้นเอง) ─────────────── */
function bannerInto(target,src,title,sub,place){
  if(!target)return;
  if(target.querySelector(':scope > .pgbanner')||target.dataset.bnr==='wait')return;
  /* กันแบนเนอร์ซ้อน: safeRender ถูกเรียกหลายรอบ (โหลดข้อมูลจริง/ตาราง) ก่อนรูปโหลดเสร็จ */
  target.dataset.bnr='wait';
  const img=new Image();
  img.onerror=()=>{delete target.dataset.bnr};
  img.onload=()=>{
    delete target.dataset.bnr;
    if(target.querySelector(':scope > .pgbanner'))return;
    const d=document.createElement('div');
    d.className='pgbanner';
    d.style.backgroundImage=`url('${src}')`;
    d.innerHTML=`<div class="pgb-in"><b>${title}</b>${sub?`<span>${sub}</span>`:''}</div>`;
    if(place==='append')target.appendChild(d); else target.prepend(d);
  };
  img.src=src;
}
function pageBanner(){
  if(['cover','report','settings'].indexOf(PAGE.id)>=0)return;
  const v=document.querySelector('.view.on'); if(!v)return;
  const n=NAVI.find(x=>x.id===PAGE.id); if(!n)return;
  bannerInto(v,'assets/h-'+PAGE.id+'.jpg',n.label,'ศูนย์บัญชาการข้อมูลเศรษฐกิจ จังหวัดหนองบัวลำภู');
}


/* ─────────────── 27b) ตราสถานะเศรษฐกิจ ─────────────── */
/* ใช้เกณฑ์เดียวกันทุกตัวชี้วัด: เทียบกับงวดเดียวกันปีก่อน */
function statusOf(pct,invert){
  if(pct==null||isNaN(pct))return {k:'normal',t:'ไม่มีข้อมูลเทียบ',c:'--faint'};
  const v=invert?-pct:pct;
  if(v>=3)  return {k:'good',  t:'ดี',     c:'--good'};
  if(v<=-3) return {k:'bad',   t:'ต้องเฝ้าระวัง',c:'--bad'};
  return             {k:'normal',t:'ทรงตัว', c:'--warn'};
}
function statusBadge(pct,invert,label){
  const st=statusOf(pct,invert);
  return `<span class="stbadge ${st.k}" data-tip2="สถานะ ${st.t}|${label||'เทียบกับงวดเดียวกันปีก่อน'}${pct==null?'':' · เปลี่ยนแปลง '+(pct>0?'+':'')+pct.toFixed(1)+'%'}|เกณฑ์: เกิน +3% = ดี · -3% ถึง +3% = ทรงตัว · ต่ำกว่า -3% = ต้องเฝ้าระวัง">
    <img src="assets/icons/ic-${st.k}.png" alt="" width="20" height="20" onerror="this.remove()">
    <b style="color:var(${st.c})">${st.t}</b></span>`;
}

/* ─────────────── 28) แหล่งที่มา · ชื่อเต็มหน่วยงาน ─────────────── */
const AGENCY_FULL={
  spend  :{n:'สำนักงานคลังจังหวัดหนองบัวลำภู',dept:'กรมบัญชีกลาง กระทรวงการคลัง',tel:'0 4231 2410 ต่อ 26921-26',doc:'รายงานผลการเบิกจ่ายและใช้จ่ายเงินงบประมาณ'},
  crop   :{n:'สำนักงานเกษตรจังหวัดหนองบัวลำภู',dept:'กรมส่งเสริมการเกษตร กระทรวงเกษตรและสหกรณ์',tel:'0 4231 3301',doc:'รายงานข้อมูลภาวะการผลิตพืช'},
  factory:{n:'สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู',dept:'สำนักงานปลัดกระทรวงอุตสาหกรรม กระทรวงอุตสาหกรรม',tel:'',doc:'ทะเบียนโรงงานอุตสาหกรรม'},
  power  :{n:'การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู',dept:'การไฟฟ้าส่วนภูมิภาค กระทรวงมหาดไทย',tel:'',doc:'สถิติการจำหน่ายกระแสไฟฟ้าแยกประเภทผู้ใช้'},
  cpi    :{n:'สำนักงานพาณิชย์จังหวัดหนองบัวลำภู',dept:'สำนักงานปลัดกระทรวงพาณิชย์ กระทรวงพาณิชย์',tel:'0 4231 2018',doc:'รายงานสถานการณ์ราคาสินค้าเกษตรที่สำคัญและสินค้าอุปโภคบริโภค'},
  credit :{n:'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',dept:'สาขาหนองบัวลำภู',tel:'',doc:'รายงานการอนุมัติสินเชื่อเพื่อการลงทุน'},
  fuel   :{n:'สำนักงานพลังงานจังหวัดหนองบัวลำภู',dept:'สำนักงานปลัดกระทรวงพลังงาน กระทรวงพลังงาน',tel:'',doc:'รายงานปริมาณการใช้น้ำมันเชื้อเพลิงรายจังหวัด'},
  car    :{n:'สำนักงานขนส่งจังหวัดหนองบัวลำภู',dept:'กรมการขนส่งทางบก กระทรวงคมนาคม',tel:'',doc:'สถิติการจดทะเบียนรถใหม่'},
  labor  :{n:'สำนักงานสถิติจังหวัดหนองบัวลำภู',dept:'สำนักงานสถิติแห่งชาติ กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม · ร่วมกับ สำนักงานแรงงานจังหวัดหนองบัวลำภู',tel:'0 4231 6736',doc:'การสำรวจภาวะการทำงานของประชากร (Labor Force Survey) รายไตรมาส'},
  social :{n:'สำนักงานประกันสังคมจังหวัดหนองบัวลำภู',dept:'สำนักงานประกันสังคม กระทรวงแรงงาน',tel:'',doc:'สถิติผู้ประกันตนจำแนกตามมาตรา'},
  tour   :{n:'สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู',dept:'สำนักงานปลัดกระทรวงการท่องเที่ยวและกีฬา',tel:'',doc:'สถิติผู้เยี่ยมเยือนและรายได้จากการท่องเที่ยว'},
  popreg2:{n:'ที่ทำการปกครองจังหวัดหนองบัวลำภู',dept:'กรมการปกครอง กระทรวงมหาดไทย',tel:'',doc:'ข้อมูลทะเบียนราษฎร'},
  otop   :{n:'สำนักงานพัฒนาชุมชนจังหวัดหนองบัวลำภู',dept:'กรมการพัฒนาชุมชน กระทรวงมหาดไทย',tel:'',doc:'ข้อมูลผู้ประกอบการ ผลิตภัณฑ์ และรายได้จากผลิตภัณฑ์ OTOP'},
  popreg :{n:'ที่ทำการปกครองจังหวัดหนองบัวลำภู',dept:'กรมการปกครอง กระทรวงมหาดไทย',tel:'',doc:'ข้อมูลทะเบียนราษฎร จำนวนประชากร การเกิด การตาย และการย้ายถิ่น'},
  irrig  :{n:'โครงการชลประทานหนองบัวลำภู',dept:'สำนักงานชลประทานที่ 5 กรมชลประทาน กระทรวงเกษตรและสหกรณ์',tel:'',doc:'ข้อมูลแหล่งน้ำชลประทาน พื้นที่รับประโยชน์ และสถานีสูบน้ำด้วยไฟฟ้า'},
  house  :{n:'สำนักงานสถิติจังหวัดหนองบัวลำภู',dept:'สำนักงานสถิติแห่งชาติ กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม',tel:'0 4231 6736',doc:'โครงการสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน (Household Socio-Economic Survey)'},
  gpp    :{n:'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ',dept:'',tel:'',doc:'ผลิตภัณฑ์มวลรวมจังหวัด (GPP) ฉบับ พ.ศ. 2567'}
};
function srcBar(keys,extra){
  const list=(Array.isArray(keys)?keys:[keys]).map(k=>AGENCY_FULL[k]).filter(Boolean);
  if(!list.length)return '';
  return `<div class="srcbar">
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5.5A2 2 0 0 1 6 3.5h9l5 5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14.5 3.6V9h5.2"/></svg>
    <div>${list.map(a=>`<div class="src1"><b>${a.n}</b>${a.dept?` · ${a.dept}`:''}
      ${a.doc?`<span>ที่มา: ${a.doc}</span>`:''}${a.tel?`<span>โทร ${a.tel}</span>`:''}</div>`).join('')}
    ${extra?`<div class="src1"><span>${extra}</span></div>`:''}</div></div>`;
}

/* ─────────────── 29) ปุ่มสลับกราฟ / ตารางรายละเอียด ─────────────── */
function viewToggle(id,labelChart,labelTable){
  return `<span class="segs vt" data-vt="${id}">
    <button class="on" data-v="chart">${labelChart||'กราฟ'}</button>
    <button data-v="table">${labelTable||'ตารางข้อมูล'}</button></span>`;
}
function bindToggle(){
  document.querySelectorAll('.segs.vt').forEach(w=>{
    if(w.dataset.bound)return; w.dataset.bound='1';
    w.addEventListener('click',e=>{
      const b=e.target.closest('button'); if(!b)return;
      w.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
      const id=w.dataset.vt, v=b.dataset.v;
      const c=document.getElementById(id+'-chart'), t=document.getElementById(id+'-table');
      if(c)c.classList.toggle('hide',v!=='chart');
      if(t)t.classList.toggle('hide',v!=='table');
      if(v==='chart'&&CH[id])setTimeout(()=>{try{CH[id].resize()}catch(e){}},30);
    });
  });
}


/* ─────────────── 30) ตัวกรองเวลาแบบใช้ร่วมทุกหน้า ─────────────── */
const SLC={};   /* เก็บสถานะของแต่ละตัวกรอง */
const FQ_LABEL={M:'รายเดือน',Q:'รายไตรมาส',Y:'รายปี'};

/* สร้างรายการงวดจากชุดข้อมูลรายเดือน 36 เดือน */
function periodsOf(freq){
  if(freq==='M')return MONTHS.map((m,i)=>({k:'M'+i,label:TH_M[m.m-1]+' '+m.y,short:m.label,i}));
  if(freq==='Q'){
    const out=[];
    MONTHS.forEach((m,i)=>{
      const q=Math.ceil(m.m/3), k='Q'+m.y+'-'+q;
      let e=out.find(x=>x.k===k);
      if(!e){e={k,label:'ไตรมาส '+q+'/'+m.y,short:'Q'+q+'/'+String(m.y).slice(-2),idx:[]};out.push(e)}
      e.idx.push(i);
    });
    return out.map(x=>Object.assign(x,{i:x.idx[x.idx.length-1]}));
  }
  const ys=[...new Set(MONTHS.map(m=>m.y))];
  return ys.map(y=>{const idx=MONTHS.map((m,i)=>m.y===y?i:-1).filter(i=>i>=0);
    return {k:'Y'+y,label:'ปี '+y,short:'ปี '+y,i:idx[idx.length-1],idx}});
}

/**
 * สร้างแถบตัวกรองเวลา
 * cfg: {freqs:['M','Q','Y'], freq:'M', value:'M35', label:'งวดข้อมูล', compare:true, fy:false}
 */
function slicerBar(id,cfg){
  cfg=Object.assign({freqs:['M','Q','Y'],freq:'M',compare:true,label:'งวดข้อมูล'},cfg||{});
  if(!SLC[id])SLC[id]=cfg; else cfg=SLC[id];
  const ps=periodsOf(cfg.freq);
  if(!cfg.value||!ps.find(p=>p.k===cfg.value))cfg.value=ps[ps.length-1].k;
  const cur=ps.find(p=>p.k===cfg.value), ci=ps.indexOf(cur);
  return `<div class="slicer" data-slicer="${id}">
    <span class="sl-lab"><img class="slico" src="assets/icons/ic-filter.png" alt="" onerror="this.remove()">${cfg.label}</span>
    ${cfg.freqs.length>1?`<span class="sl-seg">${cfg.freqs.map(f=>
      `<button data-fq="${f}" class="${f===cfg.freq?'on':''}">${FQ_LABEL[f]}</button>`).join('')}</span>`:''}
    <span class="sl-nav">
      <button data-step="-1" ${ci<=0?'disabled':''} aria-label="ก่อนหน้า">
        <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <select data-pick>${ps.map(p=>`<option value="${p.k}"${p.k===cfg.value?' selected':''}>${p.label}</option>`).join('')}</select>
      <button data-step="1" ${ci>=ps.length-1?'disabled':''} aria-label="ถัดไป">
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </span>
    <button class="sl-now${ci===ps.length-1?' on':''}" data-now>ล่าสุด</button>
    ${cfg.compare?`<button class="sl-cmp${cfg.cmp?' on':''}" data-cmp>
      <img class="slico" src="assets/icons/ic-compare.png" alt="" onerror="this.remove()">เทียบปีก่อน</button>`:''}
    <span class="sl-info" id="${id}-info"></span>
  </div>`;
}
function slicerState(id){
  const cfg=SLC[id]; if(!cfg)return null;
  const ps=periodsOf(cfg.freq);
  const cur=ps.find(p=>p.k===cfg.value)||ps[ps.length-1];
  return {freq:cfg.freq,key:cur.k,label:cur.label,i:cur.i,idx:cur.idx||[cur.i],cmp:!!cfg.cmp,periods:ps};
}
/* ค่าของชุดข้อมูลตามงวดที่เลือก — รายเดือนใช้ค่าเดือนนั้น รายไตรมาส/ปีใช้ผลรวมหรือค่าเฉลี่ย */
/* mode: sum=ยอดไหลรวมกันได้ · avg=อัตราหรือดัชนีใช้ค่าเฉลี่ย · last=ค่าสะสมหรือค่าสต๊อก ใช้ค่าสิ้นงวด */
function aggVals(vals,mode){
  if(!vals.length)return null;
  if(mode==='last')return vals[vals.length-1];
  if(mode==='avg')return vals.reduce((a,b)=>a+b,0)/vals.length;
  return vals.reduce((a,b)=>a+b,0);
}
function seriesAt(arr,st,mode){
  simTouch(arr,st?(st.idx||[st.i]):null);
  if(!st)return arr[arr.length-1].v;
  const idx=st.idx||[st.i];
  const vals=idx.map(i=>arr[i]&&arr[i].v).filter(v=>v!=null);
  if(st.freq==='M')return vals.length?vals[vals.length-1]:null;
  return aggVals(vals,mode);
}
function seriesPrevYear(arr,st,mode){
  if(!st)return null;
  const idx=(st.idx||[st.i]).map(i=>i-12).filter(i=>i>=0);
  if(!idx.length)return null;
  const vals=idx.map(i=>arr[i]&&arr[i].v).filter(v=>v!=null);
  if(!vals.length)return null;
  if(st.freq==='M')return vals[vals.length-1];
  return aggVals(vals,mode);
}
/* ─────────────── 30ข) แถบเลือกปี — ใช้กับหน้าที่ข้อมูลเป็นรายปี ─────────────── */
/* cfg: {years:[...], value, selId:'otopYear', label:'เลือกปีข้อมูล', note:'...'} */
function yearBar(id,cfg){
  const ys=(cfg.years||[]).slice().sort((a,b)=>a-b);
  const cur=cfg.value!=null?cfg.value:ys[ys.length-1];
  const i=ys.indexOf(cur);
  const desc=ys.slice().reverse();
  return `<div class="slicer yearbar" data-yearbar="${id}" data-sel="${cfg.selId}">
    <span class="sl-lab"><img class="slico" src="assets/icons/ic-filter.png" alt="" onerror="this.remove()">${cfg.label||'เลือกปีข้อมูล'}</span>
    <span class="sl-nav">
      <button data-ystep="-1" ${i<=0?'disabled':''} aria-label="ปีก่อนหน้า">
        <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <select class="sel" id="${cfg.selId}">${desc.map(y=>
        `<option value="${y}"${y===cur?' selected':''}>ปี ${y}${(cfg.partial||[]).indexOf(y)>=0?' · ข้อมูลไม่ครบ':''}</option>`).join('')}</select>
      <button data-ystep="1" ${i>=ys.length-1?'disabled':''} aria-label="ปีถัดไป">
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </span>
    <button class="sl-now${i===ys.length-1?' on':''}" data-ynow>ปีล่าสุด</button>
    <span class="sl-info">${cfg.note||('ข้อมูลชุดนี้ประกาศปีละครั้ง จึงเลือกดูได้เป็นรายปี ย้อนหลังถึงปี '+ys[0])}</span>
  </div>`;
}
/* ปุ่มถอย/เดินหน้า/ปีล่าสุด สั่งงานผ่าน select เดิม จึงใช้ตัวจัดการเหตุการณ์ของหน้านั้นได้เลย
   ผูกที่ document ครั้งเดียว แถบจึงยังทำงานหลังหน้าวาดใหม่ */
document.addEventListener('click',function(e){
  const bar=e.target.closest('[data-yearbar]'); if(!bar)return;
  const st=e.target.closest('[data-ystep]'), nw=e.target.closest('[data-ynow]');
  if(!st&&!nw)return;
  const sel=document.getElementById(bar.dataset.sel); if(!sel)return;
  const opts=[...sel.options].map(o=>o.value);   /* เรียงจากปีใหม่ไปเก่า */
  let i=opts.indexOf(sel.value);
  if(st)i=i-(+st.dataset.ystep);
  else i=0;
  if(i<0||i>=opts.length)return;
  sel.value=opts[i];
  sel.dispatchEvent(new Event('change',{bubbles:true}));
});
function bindYearBar(){}
/* ผูกการเปลี่ยนปีที่ document ครั้งเดียว จึงไม่หลุดเมื่อหน้าถูกวาดใหม่ */
const YEAR_HOOK={};
document.addEventListener('change',function(e){
  const el=e.target;
  if(!el||!el.id||!YEAR_HOOK[el.id])return;
  YEAR_HOOK[el.id](el.value);
  try{if(typeof PAGE!=='undefined'&&PAGE)gdcSyncBadge(PAGE.id)}catch(x){}
});
function onYearChange(selId,fn){YEAR_HOOK[selId]=fn}

/* วาดตัวควบคุมภายในแถบตัวกรองใหม่ โดยไม่แตะตัวแถบเอง จึงไม่เสียการผูกเหตุการณ์ */
function redrawSlicer(id){
  const el=document.querySelector('[data-slicer="'+id+'"]'); if(!el)return;
  const tmp=document.createElement('div');
  tmp.innerHTML=slicerBar(id,SLC[id]);
  const fresh=tmp.firstElementChild; if(!fresh)return;
  el.innerHTML=fresh.innerHTML;
}
function bindSlicers(onChange){
  document.querySelectorAll('[data-slicer]').forEach(el=>{
    if(el.dataset.bound)return; el.dataset.bound='1';
    const id=el.dataset.slicer;
    el.addEventListener('click',e=>{
      const fq=e.target.closest('[data-fq]');
      const st=e.target.closest('[data-step]');
      const nw=e.target.closest('[data-now]');
      const cp=e.target.closest('[data-cmp]');
      const c=SLC[id]; if(!c)return;
      if(fq){c.freq=fq.dataset.fq;c.value=null}
      else if(st){const ps=periodsOf(c.freq);
        if(!c.value||!ps.find(p=>p.k===c.value))c.value=ps[ps.length-1].k;
        const i=ps.findIndex(p=>p.k===c.value);
        const n=ps[i+ +st.dataset.step]; if(n)c.value=n.k; else return}
      else if(nw){const ps=periodsOf(c.freq);c.value=ps[ps.length-1].k}
      else if(cp){c.cmp=!c.cmp}
      else return;
      redrawSlicer(id);
      onChange&&onChange(id);
    });
    el.addEventListener('change',e=>{
      if(!e.target.matches('[data-pick]'))return;
      SLC[id].value=e.target.value;
      redrawSlicer(id);
      onChange&&onChange(id);
    });
  });
}


/* ─────────────── 31) แผนที่เชิงบริการ — ป๊อปอัปพร้อมนำทาง ─────────────── */
const GMAP=(lat,lng,name)=>`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`+
  (name?('&query_place_id='):'')
const ICO_NAV='<svg viewBox="0 0 24 24"><path d="M3 11.5 21 3l-8.5 18-2-7.5z"/></svg>';
const ICO_PIN='<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>';
const ICO_COPY='<svg viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M4.5 15.5v-9a2 2 0 0 1 2-2h9"/></svg>';
/**
 * สร้างป๊อปอัปแบบบริการ ใช้ได้กับทุกจุดที่มีพิกัด
 * o: {name, sub, rows:[[label,value]], lat, lng, nearby:'คำค้นบริการใกล้เคียง'}
 */
function servicePopup(o){
  const q=`${o.lat},${o.lng}`;
  const nav=`https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`;
  const view=`https://www.google.com/maps/search/?api=1&query=${q}`;
  const near=o.nearby?`https://www.google.com/maps/search/${encodeURIComponent(o.nearby)}/@${o.lat},${o.lng},15z`:'';
  const sv=`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${q}`;
  return `<div class="pop">
    <div class="ph2"><b>${o.name}</b>${o.sub?`<span>${o.sub}</span>`:''}</div>
    <div class="pb">
      ${(o.rows||[]).map(r=>`<div class="prow"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}
      ${o.km!=null?`<div class="prow"><span>ระยะจากตำแหน่งท่าน</span><b>${o.km.toFixed(1)} กม. · ราว ${driveMin(o.km)} นาที</b></div>`:''}
      <div class="prow"><span>พิกัด</span><b>${(+o.lat).toFixed(5)}, ${(+o.lng).toFixed(5)}</b></div>
      <div class="pact">
        <a class="go" href="${nav}" target="_blank" rel="noopener">${ICO_NAV}นำทาง</a>
        <a href="${view}" target="_blank" rel="noopener">${ICO_PIN}เปิดแผนที่</a>
        <button onclick="navigator.clipboard&&navigator.clipboard.writeText('${q}');this.textContent='คัดลอกแล้ว'">${ICO_COPY}พิกัด</button>
      </div>
      <div class="pact" style="margin-top:6px">
        ${near?`<a href="${near}" target="_blank" rel="noopener">${ICO_PIN}${o.nearby}ใกล้ที่นี่</a>`:''}
        <a href="${sv}" target="_blank" rel="noopener">${ICO_PIN}ดูภาพถนน</a>
      </div>
    </div></div>`;
}


/* ─────────────── 32) เครื่องมือแผนที่ฟรี — ไม่ต้องใช้ API key ─────────────── */
const BASEMAPS={
  plain :{n:'เรียบ',   url:null},
  street:{n:'ถนน',     url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          max:19,att:'แผนที่ © Esri'},
  sat   :{n:'ดาวเทียม',url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          max:19,att:'ภาพดาวเทียม © Esri, Maxar, Earthstar Geographics',
          over:['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
                'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}']},
  topo  :{n:'ภูมิประเทศ',url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          max:19,att:'แผนที่ © Esri'}
};
/* สไตล์ขอบเขตอำเภอตามพื้นหลัง — บนภาพจริงต้องโปร่ง ไม่อย่างนั้นสีเขียวอ่อนจะทับจนดูไม่ออก */
function geoStyleFor(k,base){
  base=base||{};
  if(k==='plain')return Object.assign({color:'#fff',weight:2,fillColor:'#cfe9dc',fillOpacity:.85},base.plain||{});
  if(k==='sat')  return {color:'#ffe066',weight:2.4,dashArray:'',fillOpacity:0};
  return {color:'#0b7a55',weight:2.2,dashArray:'6 4',fillOpacity:0};
}
function baseSwitcher(id){
  return `<div class="basesw" data-base="${id}">${Object.entries(BASEMAPS).map(([k,v],i)=>
    `<button data-bm="${k}" class="${i===0?'on':''}">${v.n}</button>`).join('')}</div>`;
}
function applyBase(map,state,k){
  const cfg=BASEMAPS[k]||BASEMAPS.plain;
  if(state.layer){map.removeLayer(state.layer);state.layer=null}
  state.key=k;
  if(cfg.url){
    const ls=[L.tileLayer(cfg.url,{maxZoom:cfg.max||18,maxNativeZoom:17,subdomains:cfg.sub||'abc',attribution:cfg.att||''})]
      .concat((cfg.over||[]).map(u=>L.tileLayer(u,{maxZoom:cfg.max||18,maxNativeZoom:17,opacity:.95})));
    state.layer=L.layerGroup(ls).addTo(map);
    ls.forEach(l=>l.bringToBack&&l.bringToBack());
    ls[0].bringToBack();
    if(!map.attributionControl){map.attributionControl=L.control.attribution({prefix:false,position:'bottomright'}).addTo(map)}
  }
  const el=map.getContainer();
  el.classList.toggle('bm-plain',k==='plain');el.classList.toggle('bm-sat',k==='sat');
  if(state.onChange)state.onChange(k);
}
function bindBase(id,map,state){
  const el=document.querySelector(`[data-base="${id}"]`); if(!el)return;
  state.map=map;
  if(state.key&&state.key!=='plain')applyBase(map,state,state.key);
  el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x.dataset.bm===(state.key||'plain')));
  if(el.dataset.b)return;
  el.dataset.b='1';
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-bm]'); if(!b||!state.map)return;
    el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    applyBase(state.map,state,b.dataset.bm);
  });
}
/* ระยะทางเส้นตรงแบบ Haversine (กิโลเมตร) */
function distKm(a,b,c,d){
  const R=6371,r=Math.PI/180;
  const dLa=(c-a)*r,dLo=(d-b)*r;
  const h=Math.sin(dLa/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(dLo/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function driveMin(km){return Math.round(km/45*60*1.25)}   /* ถนนต่างจังหวัด เฉลี่ย 45 กม./ชม. บวกตัวคูณเส้นทางจริง */
/* ขอตำแหน่งผู้ใช้จากเบราว์เซอร์ ฟรีและไม่ต้องใช้คีย์ */
function askLocation(){
  return new Promise((res,rej)=>{
    if(!navigator.geolocation)return rej(new Error('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง'));
    navigator.geolocation.getCurrentPosition(
      p=>res({lat:p.coords.latitude,lng:p.coords.longitude,acc:p.coords.accuracy}),
      e=>rej(new Error(e.code===1?'ท่านปฏิเสธการเข้าถึงตำแหน่ง':'ระบุตำแหน่งไม่สำเร็จ')),
      {enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  });
}
function fullscreenBtn(targetSel){
  return `<button class="tb fsbtn" data-fs="${targetSel}">
    <svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>เต็มจอ</button>`;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-fs]'); if(!b)return;
  const el=document.querySelector(b.dataset.fs); if(!el)return;
  if(document.fullscreenElement)document.exitFullscreen();
  else if(el.requestFullscreen)el.requestFullscreen();
});


/* ─────────────── 33) ตัวเล่นอัตโนมัติ — เลื่อนตามปี หยุดเมื่อชี้เมาส์ ─────────────── */
const PLAYERS={};
/**
 * cfg: {frames:[...], i:0, ms:1600, onFrame(v,i), hoverStop:'#selector'}
 * คืน HTML ของแถบควบคุม แล้วเรียก bindPlayer(id) หลังใส่ลง DOM
 */
function playerBar(id,cfg){
  const old=PLAYERS[id]||{};
  PLAYERS[id]=Object.assign({i:0,ms:1600,playing:false},old,cfg,
    {frames:cfg.frames,onFrame:cfg.onFrame,timer:old.timer,paused:old.paused});
  if(old.i!=null&&cfg.keepIndex!==false)PLAYERS[id].i=old.i;
  const p=PLAYERS[id];
  return `<div class="player" data-player="${id}">
    <button class="pl-btn" data-pl="play" title="เล่นอัตโนมัติ">
      <svg viewBox="0 0 24 24" class="ic-play"><path d="M7 4.5 19 12 7 19.5z"/></svg>
      <svg viewBox="0 0 24 24" class="ic-pause"><path d="M8 4.5h3.4v15H8zM12.6 4.5H16v15h-3.4z"/></svg>
      <span class="pl-txt">เล่นอัตโนมัติ</span></button>
    <span class="pl-track">
      ${p.frames.map((fr,i)=>`<button class="pl-dot${i===p.i?' on':''}" data-plf="${i}" title="${fr.label||fr}">
        <span>${fr.short||fr.label||fr}</span></button>`).join('')}
    </span>
    <span class="pl-now" id="${id}-now"></span>
  </div>`;
}
/* noInit=true → ตั้งสถานะให้ถูกต้องโดยไม่เรียก onFrame (ใช้เมื่อหน้าถูกวาดใหม่ทั้งหน้า) */
function bindPlayer(id,noInit){
  const el=document.querySelector(`[data-player="${id}"]`); if(!el||el.dataset.b)return;
  el.dataset.b='1';
  const p=PLAYERS[id];
  const step=()=>{ p.i=(p.i+1)%p.frames.length; apply(); };
  const apply=()=>{
    el.querySelectorAll('[data-plf]').forEach((d,i)=>d.classList.toggle('on',i===p.i));
    const now=document.getElementById(id+'-now');
    const fr=p.frames[p.i];
    if(now)now.textContent=fr.label||fr;
    p.onFrame(fr,p.i);
  };
  const play=()=>{ if(p.timer)return; p.playing=true; el.classList.add('playing');
    p.timer=setInterval(()=>{ if(!p.paused){ const q=PLAYERS[id]; q.i=(q.i+1)%q.frames.length; q.onFrame(q.frames[q.i],q.i); } },p.ms); };
  const stop=()=>{ clearInterval(p.timer); p.timer=null; p.playing=false; el.classList.remove('playing'); };
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-pl]'), d=e.target.closest('[data-plf]');
    if(b){ p.playing?stop():play(); return; }
    if(d){ stop(); p.i=+d.dataset.plf; apply(); }
  });
  /* ชี้ที่กราฟแล้วหยุดชั่วคราว ออกจากกราฟแล้วเล่นต่อ */
  if(p.hoverStop){
    const g=document.querySelector(p.hoverStop);
    if(g){
      g.addEventListener('mouseenter',()=>{p.paused=true;el.classList.add('paused')});
      g.addEventListener('mouseleave',()=>{p.paused=false;el.classList.remove('paused')});
    }
  }
  if(noInit){
    el.querySelectorAll('[data-plf]').forEach((d,i)=>d.classList.toggle('on',i===p.i));
    const now=document.getElementById(id+'-now');
    if(now)now.textContent=(p.frames[p.i].label||p.frames[p.i]);
    if(p.timer){el.classList.add('playing')}
  }else apply();
  if(p.auto&&!p.timer)play();
}

/* ─────────────── 34) แผนที่เฉดสีรายอำเภอ — ใช้ร่วมได้ทุกหน้า ─────────────── */
const CHO_RAMP=[[0,'#eaf6f0'],[.2,'#c2e7d4'],[.4,'#8fd3b3'],[.6,'#4fb98c'],[.8,'#1d8e64'],[1,'#0a5c42']];
function choMix(a,b,k){const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
  const A=p(a),B=p(b);
  return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')}
function choColor(t){t=Math.max(0,Math.min(1,isFinite(t)?t:0));
  for(let i=1;i<CHO_RAMP.length;i++)if(t<=CHO_RAMP[i][0]){
    const a=CHO_RAMP[i-1],b=CHO_RAMP[i];
    return choMix(a[1],b[1],(t-a[0])/(b[0]-a[0]))}
  return CHO_RAMP[CHO_RAMP.length-1][1]}
let CHO_GEO=null;
async function ampGeoJson(){
  if(CHO_GEO)return CHO_GEO;
  try{
    const r=await fetch('assets/nbl-amphoe.geojson');
    if(!r.ok)return null;
    const j=await r.json();
    if(!j||!j.features||!j.features.length)return null;
    CHO_GEO=j; return j;
  }catch(e){return null}
}
function choAmpName(f){
  const p=(f&&f.properties)||{};
  for(const k of ['amp_th','AMPHOE_T','amphoe','AP_TN','amp_name'])
    if(p[k])return String(p[k]).replace(/^อ\./,'').trim();
  return '';
}
function choLegend(mn,mx,unit,dec){
  const stops=CHO_RAMP.map(r=>choColor(r[0]));
  return `<div class="cho-lg">
    <span class="cho-lg-t">น้อย</span>
    <span class="cho-lg-bar" style="background:linear-gradient(90deg,${stops.join(',')})"></span>
    <span class="cho-lg-t">มาก</span>
    <span class="cho-lg-v">${f(mn,dec)} – ${f(mx,dec)} ${unit||''}</span></div>`;
}
/* แผนผังสำรอง ใช้เมื่อโหลดแผนที่ไม่ได้ — เฉดสีเดียวกับแผนที่ */
function choFallback(rows,mn,span,o){
  const sorted=rows.slice().sort((a,b)=>b.value-a.value);
  return `<div class="cho-fb">`+sorted.map(r=>`
    <div class="cho-fb-r${o.selected===r.name?' on':''}" data-cho-amp="${r.name}" data-tip2="${o.tipOf?o.tipOf(r):''}">
      <span class="nm">${r.name}</span>
      <span class="tr"><i style="width:${Math.max(6,((r.value-mn)/span)*100).toFixed(0)}%;background:${choColor((r.value-mn)/span)}"></i></span>
      <span class="vv">${r.value==null||!isFinite(r.value)?'—':f(r.value,o.dec??0)}</span></div>`).join('')+
    `</div><div class="note">แสดงเป็นแผนผังสำรองเพราะโหลดขอบเขตแผนที่ไม่ได้ ตรวจว่าอัปโหลด <code>assets/nbl-amphoe.geojson</code> แล้วหรือยัง</div>`;
}
/* rows = [{name,value}] · o = {unit,dec,height,title,tipOf} */
async function drawAmpChoropleth(boxId,rows,o){
  const box=document.getElementById(boxId); if(!box)return;
  o=o||{};
  const vals=rows.map(r=>r.value).filter(v=>v!=null&&isFinite(v));
  const mn=vals.length?Math.min(...vals):0, mx=vals.length?Math.max(...vals):0, span=(mx-mn)||1;
  const geo=(typeof L!=='undefined')?await ampGeoJson():null;
  if(!geo){box.innerHTML=choFallback(rows,mn,span,o)+choLegend(mn,mx,o.unit,o.dec??0);return}
  const byName={}; rows.forEach(r=>byName[r.name]=r.value);
  const selW=nm=>o.selected&&nm===o.selected;
  const pick=nm=>{
    if(byName[nm]!=null)return byName[nm];
    const hit=rows.find(r=>nm&&(nm.indexOf(r.name)>=0||r.name.indexOf(nm)>=0));
    return hit?hit.value:null;
  };
  box.innerHTML=`<div class="cho-map" id="${boxId}-m" style="height:${o.height||390}px"></div>`+choLegend(mn,mx,o.unit,o.dec??0);
  const el=document.getElementById(boxId+'-m');
  if(box._map){try{box._map.remove()}catch(e){}}
  const map=L.map(el,{zoomControl:true,scrollWheelZoom:false,attributionControl:false,dragging:true});
  box._map=map;
  const layer=L.geoJSON(geo,{
    style:ft=>{const nm=choAmpName(ft),v=pick(nm);
      return{color:selW(nm)?'#0b3c32':'#ffffff',weight:selW(nm)?3.4:1.6,
        fillColor:v==null?'#e8ecea':(o.colorFor?o.colorFor(v,(v-mn)/span):choColor((v-mn)/span)),fillOpacity:o.selected&&!selW(nm)?.55:.92}},
    onEachFeature:(ft,lyr)=>{
      const nm=choAmpName(ft), v=pick(nm);
      const row={name:nm,value:v};
      lyr.bindTooltip(o.tipHtml?o.tipHtml(row):`<b>${nm}</b><br>${v==null?'ไม่มีข้อมูล':f(v,o.dec??0)+' '+(o.unit||'')}`,
        {sticky:true,direction:'top',className:'cho-tt'+(o.tipHtml?' rich':'')});
      lyr.on('mouseover',()=>lyr.setStyle({weight:3.4,color:'#0b3c32'}));
      lyr.on('mouseout',()=>lyr.setStyle({weight:selW(nm)?3.4:1.6,color:selW(nm)?'#0b3c32':'#ffffff'}));
      if(o.onClick){lyr.on('click',()=>o.onClick(nm));
        /* ป้ายชื่ออำเภอบนแผนที่ */
        if(o.labels){try{const c=lyr.getBounds().getCenter();
          L.marker(c,{interactive:false,icon:L.divIcon({className:'cho-lbl',html:`<span>${nm.replace('เมืองหนองบัวลำภู','เมืองฯ')}${v!=null?'<b>'+f(v,o.dec??0)+'</b>':''}</span>`,iconSize:null})}).addTo(map)}catch(e){}}
      }
      else if(v!=null)lyr.bindPopup(`<div class="cho-pop"><b>${nm}</b>
        <span>${f(v,o.dec??0)} ${o.unit||''}</span>
        <small>สูงสุด ${f(mx,o.dec??0)} · ต่ำสุด ${f(mn,o.dec??0)}</small></div>`);
    }}).addTo(map);
  try{map.fitBounds(layer.getBounds(),{padding:[12,12]})}catch(e){map.setView([17.22,102.33],9)}
  setTimeout(()=>{try{map.invalidateSize()}catch(e){}},120);
  return map;
}

/* ─────────────── 22) โครงร่วม: แถบบน เมนู และการเริ่มระบบ ─────────────── */
const NAVI=[
 {id:'cover',   file:'index.html',    label:'หน้าปกจังหวัด',   ic:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.2V20h13v-9.8"/><path d="M9.6 20v-5.4h4.8V20"/>'},
 {id:'overview',file:'overview.html', label:'ภาพรวมเศรษฐกิจ',  ic:'<rect x="3" y="3.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3.5" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7" rx="1.6"/>'},
 {id:'gpp',     file:'gpp.html',      label:'GPP และการเติบโต',ic:'<path d="M3.5 17.5 9 11l4 3.6 7.2-8.4"/><path d="M15.6 6.2h4.9v4.9"/><path d="M3.5 20.5h17"/>'},

 {grp:'เศรษฐกิจรายภาคส่วน'},
 {id:'fiscal',  file:'fiscal.html',   label:'การคลังภาครัฐ',        ic:IC.bank},
 {id:'agri',    file:'agri.html',     label:'ภาคเกษตร',             ic:IC.leaf},
 {id:'industry',file:'industry.html', label:'อุตสาหกรรมและการผลิต', ic:IC.factory},
 {id:'trade',   file:'trade.html',    label:'การค้าและค่าครองชีพ',  ic:IC.cart},
 {id:'consume', file:'consume.html',  label:'การบริโภคและพลังงาน',  ic:IC.bolt},
 {id:'tourism', file:'tourism.html',  label:'ภาคการท่องเที่ยว',     ic:IC.plane},
 {id:'otop',    file:'otop.html',     label:'OTOP และเศรษฐกิจชุมชน', ic:'<path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5z"/><path d="M3.5 8.5 12 13l8.5-4.5M12 13v7"/>'},

 {grp:'สังคมและประชากร'},
 {id:'labor',   file:'labor.html',    label:'ตลาดแรงงาน',           ic:IC.brief},
 {id:'household',file:'household.html',label:'ครัวเรือนและความเหลื่อมล้ำ',
   ic:'<path d="M3.5 10.5 12 4l8.5 6.5"/><path d="M5.8 9.4V20h12.4V9.4"/><path d="M9.6 20v-5.2h4.8V20"/>'},
 {id:'population',file:'population.html',label:'ประชากรและโครงสร้างอายุ',
   ic:'<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 6M18 14.9c2 .7 3.3 2.4 3.3 5.1"/>'},

 {grp:'มุมมองและเครื่องมือ'},
 {id:'area',    file:'area.html',     label:'ข้อมูลเชิงพื้นที่',    ic:'<path d="M9 3.5 3.5 6v14.5L9 18l6 2.5 5.5-2.5V3.5L15 6z"/><path d="M9 3.5V18M15 6v14.5"/>'},
 {id:'report',  file:'report.html',   label:'รายงานและบทวิเคราะห์', ic:'<path d="M4 5.5A2 2 0 0 1 6 3.5h9l5 5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14.5 3.6V9h5.2M8 12.5h8M8 16h5"/>'},
 {id:'sources', file:'sources.html',  label:'แหล่งข้อมูลและที่มา',  ic:'<ellipse cx="12" cy="6" rx="7.6" ry="2.9"/><path d="M4.4 6v12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V6"/><path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9"/>'},
 {id:'settings',file:'settings.html', label:'ตั้งค่าระบบ',          ic:'<circle cx="12" cy="12" r="3.1"/><path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a1.9 1.9 0 0 1-3.8 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.3a1.9 1.9 0 0 1 0-3.8h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1A1.9 1.9 0 1 1 7.5 4.2l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5v-.3a1.9 1.9 0 1 1 3.8 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0 1.1 2.8h.3a1.9 1.9 0 0 1 0 3.8h-.2a1.6 1.6 0 0 0-1.4 1z"/>'}
];
const SEAL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAB/lBMVEXeXl3lnGChWCslHBqkX1rb5uEhoUpbJirp2JrzkCOhMBnioJqfLlQYGhnZYicebTYWIR3eapSilWLVMSikzdpgUjRqXk2dW5AeKyRWnlJjUJNfojdpsN2goqBeYmEfba1xwk8hldYljjobfMP6PYLPNGgnckxmmqOhzaIuOZFwMUfuyXYmZFEJUyhVO40mjaJTXFqcpqOfrc7dssbY2tqfO4SYozZuAAB0xO6PxzxRVFI1wk1mw4qLyHb/AAA2UEdXk3EA/3hrloqdxLf/AP8jn2om7qtc57GSl5a13NMlRjo9TEcA/wAA//9owT5y///+yQAAAH8vRD5nKj1VAFV/fwDfv7////8CAgL2+voAAADzdpk5lNHuOnvyZ5D6/LIHqk7U5+0yicnyV4dEmdOItuJNt0kxs0rxZy201e2oyun1haVrqtpUo9j1SYTVl0vuWC2PxkKVxOczh0OxaDLTSynNiEjxdynJeDZ2teTb69Ly1pHPhjpqu0eGttvvt3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADG+YkxAAAAgHRSTlP+///p/v//+f////78nv/+YP7//////v8f//////8Q///////8/f7////9/xcT//9iFv//Fv//Av//n////wFNEQMcHAEHBAlDGFeMAQH/A/8Ch7wDAggA/P8C/v/+/v/////+//////////7///3//////////////////////xjwg9cAACaCSURBVHja5Z2JWyJJmv8jLzIhAcmUQ470KhHLq7qsruqaq2d2ZnZm793fiQdioaCiCDYiYIP6r+/3jciExFLbqunZ2efZt0STK/OT7xVvREZGseJ/c2H/MwB3P5PZ3d3/JoBE8+Q7s7t/W8AR3NuZmZlYxJNYbGZmdnb0kb8VoHvoWYApyvbnokQi38y+/YsZ2V9CR1rbflaUSGzmL2NkX4cn6HyKUxQlkUgKSegTKnUZv9If2VfixSJjtKRtG8bBpBiOndSVMSO5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';

function buildShell(active){
  const top=document.getElementById('topbar');
  if(top)top.innerHTML=`
    <button class="tb hamb" id="hamb" aria-label="เมนู"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <div class="seal"><img src="${SEAL}" alt="ตราประจำจังหวัดหนองบัวลำภู"></div>
    <a class="gdtop" href="apistatus.html" data-tip2="เชื่อมข้อมูลกับ GD Catalog|แดชบอร์ดดึงข้อมูลจากระบบบัญชีข้อมูลจังหวัดหนองบัวลำภู (nongbualamphu.gdcatalog.go.th) ผ่าน API โดยอัตโนมัติ · คลิกเพื่อดูสถานะการเชื่อมต่อ"><img src="assets/logo-gd.png" alt="GD Catalog" onerror="this.parentNode.remove()"></a>
    <div class="brand"><h1>ศูนย์บัญชาการข้อมูลเศรษฐกิจ จังหวัดหนองบัวลำภู</h1>
      <p>Nong Bua Lam Phu Economic Data Command Center</p></div>
    <div class="sp"></div>
    <div class="asof"><b id="asof">ข้อมูล ณ ${CFG.asof}</b><span>ปีงบประมาณ 2569 · build ${CFG.build}</span></div>
    <button class="tb" id="btnEdit" data-tip2="โหมดแก้ไขตาราง|คลิกที่ตัวเลขในตารางเพื่อแก้ไขได้ทันที บันทึกลงเครื่องนี้"><svg viewBox="0 0 24 24"><path d="M4 20h4.5L19 9.5a2.1 2.1 0 0 0-3-3L5.5 17z"/><path d="M14.5 6.5l3 3"/></svg></button>
    <button class="tb" id="btnTheme"><svg viewBox="0 0 24 24"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/><circle cx="12" cy="12" r="3.6"/></svg></button>
    <button class="tb kioskbtn" id="btnKiosk"><svg viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg><span>จอนำเสนอ</span></button>
    <button class="tb" id="btnTour" data-tip2="นำเสนอทีละการ์ด|เดินทีละการ์ดแบบสไลด์ เต็มจอ · ใช้ลูกศรซ้ายขวาหรือรีโมตพรีเซนต์ · กด Q เปิด QR ให้ผู้ฟังสแกน · Esc ออก"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg><span>นำเสนอ</span></button>
    <a class="tb tb-api" id="btnApi" href="apistatus.html" data-tip2="ศูนย์ควบคุมแหล่งข้อมูล (API)|ดูว่าแต่ละหน้าดึงข้อมูลจากระบบบัญชีข้อมูลจังหวัดแล้วหรือยัง สถานะการเชื่อมต่อ และประวัติการอัปเดต"><svg viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v6.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V5.5M4.5 12v6.5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V12"/></svg><span>API</span></a>
    <button class="tb tb-bell" id="btnBell" aria-label="การแจ้งเตือนข้อมูลอัปเดต" data-tip2="แจ้งเตือนข้อมูลอัปเดต|เมื่อหน่วยงานปรับปรุงชุดข้อมูลที่แดชบอร์ดใช้บนระบบบัญชีข้อมูลจังหวัด จะแจ้งที่นี่"><svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/></svg><i class="bdg" id="bellN"></i></button>
    <button class="tb" id="btnShare" data-tip2="คัดลอกลิงก์หน้านี้|ลิงก์จำหน้า ปี เดือน และแท็บที่กำลังดูอยู่ ส่งใน LINE แล้วผู้รับจะเปิดมาตรงจุดเดียวกัน"><svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg></button>
    <button class="tb" id="btnPrint"><svg viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z"/></svg></button>
    <a class="tb" href="input.html"><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/></svg><span>กรอกข้อมูล</span></a>`;
  const side=document.getElementById('sidebar');
  if(side)side.innerHTML=
     `<button class="railbtn" id="btnRail" data-tip="ขยายเมนู" aria-label="พับเมนู">
        <svg viewBox="0 0 24 24"><path d="M14.5 7 9.5 12l5 5"/></svg><span>พับเมนู</span></button>`
    +NAVI.map(n=>n.grp?`<div class="grp">${n.grp}</div>`
    :`<a class="nv${n.id===active?' act':''}" href="${n.file}" data-tip="${n.label}">
        <svg viewBox="0 0 24 24">${n.ic}</svg><span>${n.label}</span></a>`).join('')
    +`<div class="sfoot">“ข้อมูลที่เร็วกว่า<br>คือการตัดสินใจที่ดีกว่า”</div>`
    +`<a class="sgdc" href="apistatus.html" data-tip="ข้อมูลจาก GD Catalog"><span class="sgdc-l"><img src="assets/logo-gd.png" alt="" onerror="this.remove()"></span>
        <span class="sgdc-t"><b>ข้อมูลจาก GD Catalog</b><small id="sgdcT">ระบบบัญชีข้อมูลจังหวัด</small></span><i class="ldot"></i></a>`;

  const main=document.querySelector('.main');
  if(main&&!document.getElementById('pgfoot')){
    const f=document.createElement('footer');
    f.id='pgfoot'; f.className='pgfoot';
    f.innerHTML=`
      <div class="pf-in">
        <div class="pf-brand">
          <img src="${SEAL}" alt="ตราประจำจังหวัดหนองบัวลำภู">
          <div>
            <b>สำนักงานจังหวัดหนองบัวลำภู</b>
            <span>ศาลากลางจังหวัดหนองบัวลำภู ชั้น 4 ถ.หนองบัวลำภู – เลย<br>
            ต.ลำภู อ.เมือง จ.หนองบัวลำภู 39000</span>
          </div>
        </div>
        <div class="pf-links">
          <a href="tel:042316680">
            <svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>
            0 4231 6680-1</a>
          <a href="https://www.nongbualamphu.go.th/" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.4 2.7 3.6 5.5 3.6 8.6s-1.2 5.9-3.6 8.6c-2.4-2.7-3.6-5.5-3.6-8.6S9.6 6.1 12 3.4Z"/></svg>
            เว็บไซต์จังหวัด</a>
          <a href="input.html">
            <svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/></svg>
            ระบบกรอกข้อมูล</a>
        </div>
      </div>
      <div class="pf-copy">© 2025 จัดทำโดย สำนักงานสถิติจังหวัดหนองบัวลำภู · โทร 0 4231 6736 · build ${CFG.build}</div>`;
    main.appendChild(f);
  }
  try{sgdcDate()}catch(e){}
}

/* เตือนเมื่อโฟลเดอร์ assets ยังไม่ได้อัปโหลด */
function checkAssets(){
  const img=new Image();
  img.onerror=()=>{
    if(document.getElementById('assetWarn'))return;
    const d=document.createElement('div');d.id='assetWarn';d.className='edbar';
    d.style.cssText='background:var(--coral-l);border-color:rgba(201,69,47,.35);color:var(--bad)';
    d.innerHTML='<b>ไม่พบโฟลเดอร์ assets</b> — ภาพพื้นหลังและภาพประกอบจะไม่แสดง โปรดอัปโหลดโฟลเดอร์ assets ที่มีรูป 12 ไฟล์ ไว้ระดับเดียวกับ index.html';
    const m=document.querySelector('.main');if(m)m.prepend(d);
  };
  img.src='assets/cover-fields.jpg?v='+CFG.build;
}

const DS={
  init(pageId,render){
    PAGE={id:pageId,render:render||function(){}};
    /* ดึงชุดข้อมูลจากระบบบัญชีข้อมูลจังหวัดที่หน้านี้ใช้ แล้ววาดใหม่ด้วยตัวเลขจาก API */
    setTimeout(()=>{try{gdcSyncPage(pageId)}catch(e){console.error(e)}},60);
    document.addEventListener('DOMContentLoaded',()=>DS.boot());
    if(document.readyState!=='loading')DS.boot();
  },
  booted:false,
  boot(){
    if(DS.booted)return; DS.booted=true;
    try{const t=localStorage.getItem('nblEcon.theme');if(t)document.documentElement.dataset.theme=t}catch(e){}
    applySet(); chDefaults(); initTip(); buildShell(PAGE.id);
    document.body.classList.toggle('cover',PAGE.id==='cover');

    document.addEventListener('click',e=>{
      const cp=e.target.closest('[data-cover]');
      if(cp&&window.onCoverPick){window.onCoverPick(cp.dataset.cover);return}
      const ac=e.target.closest('[data-accent]');
      if(ac&&window.onAccentPick){window.onAccentPick(ac.dataset.accent);return}
      if(e.target.closest('#btnEdDone')){toggleEdit();return}
      const sg=e.target.closest('.segs button');
      if(sg){const w=sg.parentElement;
        w.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===sg));
        if(window.onSeg)window.onSeg(w,sg);}
    });
    document.addEventListener('focusout',e=>{
      const td=e.target.closest&&e.target.closest('td[data-path][contenteditable]');
      if(td)commitCell(td)});
    document.addEventListener('keydown',e=>{
      if(e.key==='Enter'&&e.target.matches&&e.target.matches('td[data-path][contenteditable]')){e.preventDefault();e.target.blur()}
      if(e.key==='Escape'&&EDIT)toggleEdit()});

    const hb=document.getElementById('hamb');
    if(hb)hb.onclick=()=>document.body.classList.toggle('navopen');
    const app=document.getElementById('app');
    let railed=false; try{railed=localStorage.getItem('nblEcon.rail')==='1'}catch(e){}
    if(railed&&app)app.classList.add('narrow');
    const rb=document.getElementById('btnRail');
    if(rb)rb.onclick=()=>{
      const on=app.classList.toggle('narrow');
      try{localStorage.setItem('nblEcon.rail',on?'1':'0')}catch(e){}
      setTimeout(()=>{Object.values(CH).forEach(c=>{try{c.resize()}catch(e){}});
        if(window.MAP&&MAP.invalidateSize)MAP.invalidateSize()},280);
    };
    const bp=document.getElementById('btnPrint');
    if(bp)bp.onclick=()=>window.print();
    const be=document.getElementById('btnEdit');
    if(be)be.onclick=toggleEdit;
    const bt=document.getElementById('btnTheme');
    if(bt)bt.onclick=()=>{
      const t=document.documentElement.dataset.theme==='light'?'dark':'light';
      document.documentElement.dataset.theme=t;
      try{localStorage.setItem('nblEcon.theme',t)}catch(e){}
      chDefaults(); safeRender();};

    /* โหมดจอนำเสนอ: เดินหน้าไปทีละหน้า */
    const bk=document.getElementById('btnKiosk');
    if(bk)bk.onclick=()=>{
      let on=false; try{on=sessionStorage.getItem('nblEcon.kiosk')==='1'}catch(e){}
      try{sessionStorage.setItem('nblEcon.kiosk',on?'0':'1')}catch(e){}
      location.reload();};
    let kioskOn=false; try{kioskOn=sessionStorage.getItem('nblEcon.kiosk')==='1'}catch(e){}
    if(kioskOn){
      document.body.classList.add('kiosk');
      if(bk)bk.classList.add('on');
      const ord=['overview','gpp','fiscal','agri','industry','trade','consume','labor','tourism','area'];
      let i=ord.indexOf(PAGE.id); if(i<0)i=0;
      setTimeout(()=>{const nx=NAVI.find(n=>n.id===ord[(i+1)%ord.length]);
        if(nx)location.href=nx.file;},(SET.kiosk||20)*1000);
    }

    try{EDIT=localStorage.getItem('nblEcon.editing')==='1'}catch(e){}
    safeRender();
    if(EDIT){EDIT=false;if(authValid())toggleEdit();else{try{localStorage.setItem('nblEcon.editing','0')}catch(e){}}}
    initToTop(); checkAssets(); loadLive(); loadTables();
    let rz;
    window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{
      chDefaults();
      Object.values(CH).forEach(c=>{try{c.resize()}catch(e){}});
    },220)});
    window.addEventListener('error',ev=>showBootErr(ev),true);
    bootSelfCheck();
  }
};
/* ─────────────── ตรวจสภาพการติดตั้ง — บอกให้ชัดว่าอะไรขาด ─────────────── */
const DS_VERSION='3.2.0';
const BOOT={miss:[],hard:[],api:false};
function bootBox(){
  let box=document.getElementById('bootErr');
  if(!box){
    box=document.createElement('div'); box.id='bootErr';
    box.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#fff;'+
      'border-radius:13px;padding:13px 16px;font:13.5px/1.75 system-ui;'+
      'box-shadow:0 14px 34px -14px rgba(0,0,0,.42);max-height:42vh;overflow:auto';
    const x=document.createElement('button');
    x.textContent='ปิด'; x.style.cssText='float:right;border:1px solid currentColor;background:transparent;'+
      'border-radius:8px;padding:3px 11px;font:12px system-ui;cursor:pointer;opacity:.75';
    x.onclick=()=>box.remove(); box.appendChild(x);
    const h=document.createElement('b'); h.id='bootErrHead'; box.appendChild(h);
    const ul=document.createElement('div'); ul.id='bootErrList'; box.appendChild(ul);
    document.body.appendChild(box);
  }
  return box;
}
/* ไฟล์รูปที่หายไม่ทำให้หน้าพัง เพราะมี onerror ถอดออกให้อยู่แล้ว
   จึงรวบเป็นข้อความเตือนบรรทัดเดียว ไม่ปนกับข้อผิดพลาดจริง */
function bootPaint(){
  const box=bootBox(), head=document.getElementById('bootErrHead'), list=document.getElementById('bootErrList');
  const hard=BOOT.hard.length>0;
  box.style.background='#fff';
  box.style.border='1px solid '+(hard?'#f0c4bb':'#ecd8a8');
  box.style.color=hard?'#8a2f20':'#7a5c12';
  head.textContent=hard?'โหลดหน้าไม่สมบูรณ์'
    :(BOOT.api&&!BOOT.miss.length)?'หน้าทำงานได้ · ใช้ข้อมูลจากไฟล์ล่าสุด'
    :'หน้าทำงานได้ แต่มีไฟล์ประกอบขาดอยู่';
  list.innerHTML='';
  BOOT.hard.slice(0,6).forEach(m=>{
    const d=document.createElement('div'); d.textContent='• '+m; list.appendChild(d);
  });
  if(BOOT.api){
    const d=document.createElement('div');
    d.textContent='• เชื่อมต่อฐานข้อมูลออนไลน์ไม่สำเร็จในรอบนี้ · หน้าเว็บแสดงข้อมูลจากไฟล์ล่าสุดที่เผยแพร่ไว้ '+
      'ค่าที่หน่วยงานเพิ่งแก้ผ่านระบบกรอกข้อมูลอาจยังไม่ปรากฏ · ระบบจะลองใหม่อัตโนมัติเมื่อเปิดหน้าอีกครั้ง';
    list.appendChild(d);
  }
  if(BOOT.miss.length){
    const names=[...new Set(BOOT.miss)];
    const d=document.createElement('div');
    d.textContent='• ไฟล์รูปหรือไอคอนที่ยังไม่ได้อัปโหลด '+names.length+' ไฟล์: '+
      names.slice(0,12).join(', ')+(names.length>12?' และอีก '+(names.length-12)+' ไฟล์':'')+
      ' — จุดที่ใช้ไฟล์เหล่านี้จะถอยไปใช้ไอคอนเส้นแทน ไม่กระทบการใช้งาน';
    list.appendChild(d);
  }
}
function showBootErr(ev,extra){
  if(extra){BOOT.hard.push(extra);bootPaint();return}
  const t=ev&&ev.target;
  if(t&&t!==window&&(t.src||t.href)){
    const u=String(t.src||t.href);
    /* ภาพแผนที่พื้นหลังหลุดบางแผ่นเป็นเรื่องปกติของผู้ให้บริการ tile ไม่ใช่หน้าเว็บพัง จึงไม่แจ้งเตือน */
    if((t.classList&&t.classList.contains('leaflet-tile'))||/arcgisonline|cartocdn|tile\.openstreetmap/.test(u))return;
    /* ไอคอนที่มีไฟล์สำรองจะสลับไปใช้ไฟล์สำรองเอง ไม่นับว่าหาย */
    if(t.dataset&&(t.dataset.fb||t.dataset.chain||t.dataset.opt!=null))return;   /* ภาพที่ไม่บังคับ (เช่นภาพประจำอำเภอ) ไม่นับว่าขาด */
    /* เรียก API ของ Apps Script ไม่สำเร็จ ไม่ใช่หน้าเว็บพัง — แดชบอร์ดอ่านจากไฟล์ข้อมูลได้ครบอยู่แล้ว
       API ใช้เฉพาะดึงค่าที่หน่วยงานแก้ผ่านระบบกรอกข้อมูล และมักหลุดเพราะ Apps Script ตื่นช้าหรือโควตาเต็ม
       จึงแจ้งเป็นหมายเหตุเบา ๆ ไม่ขึ้นกล่องแดงว่าโหลดหน้าไม่สมบูรณ์ */
    if(/script\.google\.com/.test(u)){BOOT.api=true;bootPaint();return}
    const name=u.split('/').pop().split('?')[0];
    if(/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name)){BOOT.miss.push(name);bootPaint();return}
    BOOT.hard.push('โหลดไฟล์ไม่สำเร็จ: '+u.replace(location.origin,''));bootPaint();return;
  }
  const where=ev&&ev.filename?(String(ev.filename).replace(location.origin,'')+' บรรทัด '+ev.lineno):'ไม่ทราบไฟล์';
  const msg=(ev&&ev.message)||'ไม่ทราบสาเหตุ';
  /* "Script error." ที่ไม่มีชื่อไฟล์คือข้อความที่เบราว์เซอร์ปิดรายละเอียดของสคริปต์ข้ามโดเมนไว้
     ไม่มีข้อมูลให้แก้ และหน้าเว็บยังทำงานต่อได้ตามปกติ จึงเก็บลง console แทนการขึ้นกล่องแดง
     สาเหตุหลักที่เคยเจอคือกราฟที่ถูกถอด canvas ออกแล้วยังค้างอยู่ ซึ่งตอนนี้ระบบเก็บกวาดให้เองแล้ว */
  if(/^Script error\.?$/i.test(msg)&&!(ev&&ev.filename)){
    try{console.warn('ข้อผิดพลาดจากสคริปต์ภายนอก (เบราว์เซอร์ซ่อนรายละเอียด) · หน้าเว็บยังทำงานปกติ')}catch(e){}
    return;
  }
  /* ResizeObserver loop เป็นคำเตือนของเบราว์เซอร์ ไม่ใช่ความผิดพลาดของหน้า */
  if(/ResizeObserver loop/i.test(msg))return;
  BOOT.hard.push(msg+(msg==='Script error.'?' (มาจากสคริปต์ภายนอก เช่น Chart.js หรือ Leaflet ที่โหลดไม่สำเร็จ)':'')+' — '+where);
  bootPaint();
}
function checkCardBg(){
  const urls=new Set();
  document.querySelectorAll('.kpibg,.fruitbg').forEach(el=>{
    const m=/url\(["']?([^"')]+)["']?\)/.exec(el.style.backgroundImage||'');
    if(m)urls.add(m[1]);
  });
  if(document.querySelector('.slicer'))urls.add(CARD_BG_DIR+'bg-slicer.webp');
  urls.forEach(u=>{
    const img=new Image();
    img.onerror=()=>{BOOT.miss.push(u.split('/').pop());bootPaint()};
    img.src=u;
  });
}
/* ตรวจว่าไฟล์ร่วมมาครบและเป็นรุ่นเดียวกับหน้าหรือไม่ */
function bootSelfCheck(){
  const miss=[];
  try{
    const brand=getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
    if(!brand)miss.push('ds.css ยังไม่ถูกโหลด หน้าจะไม่มีสีและเลย์เอาต์ — ตรวจว่าอัปโหลด ds.css แล้วและชื่อไฟล์เป็นตัวพิมพ์เล็กทั้งหมด');
  }catch(e){}
  if(typeof Chart==='undefined')miss.push('Chart.js โหลดไม่สำเร็จ กราฟทุกตัวจะไม่ขึ้น — ตรวจการเชื่อมต่ออินเทอร์เน็ตหรือการเข้าถึง cdn.jsdelivr.net');
  if(document.querySelector('#map,.cho-map,#tilemap')&&typeof L==='undefined')
    miss.push('Leaflet โหลดไม่สำเร็จ แผนที่จะไม่ขึ้น — ตรวจการเข้าถึง unpkg.com');
  /* พื้นหลังการ์ดเป็น background-image ของ CSS ซึ่งพังเงียบ ๆ ถ้าไฟล์ไม่มี
     จึงยิงตรวจซ้ำด้วย Image() เบราว์เซอร์ดึงจากแคชอยู่แล้ว ไม่เพิ่มโหลดจริง */
  setTimeout(checkCardBg,900);
  const need=['yearBar','drawAmpChoropleth','slicerBar','tipOf','f_num'];
  const old=need.filter(n=>typeof window[n]!=='function');
  if(old.length)miss.push('ds.js เป็นรุ่นเก่ากว่าหน้านี้ (ขาด '+old.join(', ')+') — อัปโหลด ds.js รุ่นล่าสุดทับ');
  miss.forEach(m=>showBootErr(null,m));
}
let PAGE={id:'',render(){}};
/* เติมไอคอนให้ทุกจุดที่ประกาศไว้ รวมถึงส่วนที่วาดทีหลัง */
function fillIcons(root){
  (root||document).querySelectorAll('[data-bigico]').forEach(el=>{if(!el.innerHTML)el.innerHTML=icoImg(el.dataset.bigico,52)});
  (root||document).querySelectorAll('[data-hdico]').forEach(el=>{if(!el.innerHTML)el.innerHTML=icoImg(el.dataset.hdico,26)});
  relabelIcons(root||document);
}
/* หน้าไหนวาดการ์ดเพิ่มทีหลัง ไอคอนก็ยังขึ้นเอง ไม่ต้องเรียกซ้ำ */
(function(){
  if(typeof MutationObserver==='undefined')return;
  const mo=new MutationObserver(ms=>{
    for(const m of ms)for(const n of m.addedNodes){
      if(n.nodeType!==1)continue;
      if(n.hasAttribute&&(n.hasAttribute('data-hdico')||n.hasAttribute('data-bigico')))fillIcons(n.parentNode||document);
      else if(n.querySelector&&n.querySelector('[data-hdico],[data-bigico]'))fillIcons(n);
      if(n.tagName==='IMG'||(n.querySelector&&n.querySelector('img.ico,img.rowico')))relabelIcons(n);
    }
  });
  document.addEventListener('DOMContentLoaded',()=>mo.observe(document.body,{childList:true,subtree:true}));
})();
/* แถบบอกความน่าเชื่อถือของตัวเลขรายเดือน — แสดงเฉพาะหน้าที่ใช้ชุดรายเดือน */
/* หน้าภาพรวมและหน้า GPP ใช้ข้อมูลจริงจากแฟ้มของหน่วยงานแล้ว ไม่ต้องมีแถบเตือนข้อมูลจำลอง */
/* หน้าการคลังใช้เฉพาะข้อมูลจริงแล้ว (รายงานผลการเบิกจ่าย + ยอดที่คลังจังหวัดกรอก) จึงไม่อยู่ในรายการนี้ */
/* หน้าอุตสาหกรรมใช้ข้อมูลรายปีจาก API และไฟล์รายงานสถิติแล้ว ไม่มีชุดรายเดือนจำลอง */
const TRUST_PAGES={trade:['cpi','credit'],
  consume:['fuel','car'],area:null};
function trustBar(){
  if(typeof PAGE==='undefined'||!TRUST_PAGES.hasOwnProperty(PAGE.id))return;
  const v=document.querySelector('.view.on'); if(!v)return;
  const ids=TRUST_PAGES[PAGE.id]||DATASETS.map(d=>d.id);
  const st=ids.map(id=>({id,d:DATASETS.find(x=>x.id===id),r:realStat(id)})).filter(x=>x.d&&x.r);
  const full=st.filter(x=>x.r.share>=.999).length, none=st.filter(x=>x.r.real===0).length, part=st.length-full-none;
  const showMei=false;
  const lv=full===st.length?'ok':none===st.length?'bad':'warn';
  let el=v.querySelector('.trust');
  if(!el){el=document.createElement('div');el.className='trust';
    const sl=v.querySelector('.slicer'), ph=v.querySelector('.ph');
    if(sl&&sl.parentNode)sl.parentNode.insertBefore(el,sl);
    else if(ph&&ph.nextSibling)ph.parentNode.insertBefore(el,ph.nextSibling);else v.prepend(el)}
  const open=el.classList.contains('open');
  el.className='trust '+lv+(open?' open':'');
  const conn=LIVE.ok?'':LIVE.err?'<b>เชื่อมฐานข้อมูลกลางไม่ได้</b> · ':'<b>กำลังโหลดข้อมูลจริง</b> · ';
  const msg=lv==='ok'?`ตัวเลขรายเดือนในหน้านี้เป็นค่าจริงจากหน่วยงานครบ 12 เดือนล่าสุด`
    :lv==='bad'?`ตัวเลขรายเดือนในหน้านี้ยังเป็น<b>ข้อมูลจำลอง</b>ทั้งหมด ใช้ทดสอบการแสดงผลเท่านั้น ห้ามนำไปอ้างอิง`
    :`ข้อมูลจริง ${full} ชุด · จริงบางเดือน ${part} ชุด · ยังเป็นข้อมูลจำลอง ${none} ชุด — การ์ดที่มีป้าย <span class="simchip mini">จำลอง</span> ห้ามนำไปอ้างอิง`;
  el.innerHTML=`<div class="tr-h"><span class="tr-dot"></span><span class="tr-t">${conn}${msg}
      ${showMei?` · ดัชนี NBL–MEI เดือนล่าสุดคำนวณจากค่าจริง <b>${Math.round(MEI.real*100)}%</b> ของน้ำหนัก`:''}</span>
      <button class="tb tr-btn" type="button">${open?'ซ่อน':'ดูรายชุด'}</button></div>
    <div class="tr-list">${st.map(x=>{const pc=Math.round(x.r.share*100);
      return `<div class="tr-row"><span class="nm">${x.d.series.map(s=>s.label).slice(0,2).join(' · ')}</span>
        <span class="ag">${agencyName(x.id).replace('สำนักงาน','สนง.').replace('จังหวัดหนองบัวลำภู','จ.')}</span>
        <span class="bar"><i style="width:${pc}%"></i></span>
        <span class="pc ${pc>=100?'ok':pc>0?'warn':'bad'}">${pc>=100?'จริงครบ':pc>0?'จริง '+pc+'%':'จำลอง'}</span>
        <span class="ls">${x.r.last?'ล่าสุด '+TH_M[+x.r.last.slice(5)-1]+' '+x.r.last.slice(2,4):'ยังไม่มีค่าจริง'}</span></div>`}).join('')}
      <div class="tr-note">ค่าจริงมาจากข้อมูลที่ผู้ดูแลระบบอนุมัติแล้วในระบบกรอกข้อมูล · ข้อมูลที่หน่วยงานส่งแต่ยังรออนุมัติยังไม่ขึ้นแดชบอร์ด</div></div>`;
  v.querySelectorAll('.chip.mock').forEach(c=>{c.textContent=lv==='ok'?'ข้อมูลจริง':lv==='bad'?'ข้อมูลจำลอง รอข้อมูลจริง':'ข้อมูลจริงบางส่วน';
    c.classList.toggle('real',lv==='ok')});
  const b=el.querySelector('.tr-btn');
  if(b)b.onclick=()=>{el.classList.toggle('open');b.textContent=el.classList.contains('open')?'ซ่อน':'ดูรายชุด'};
  /* ป้ายที่ชื่อดัชนี NBL–MEI */
  if(showMei&&MEI.real<.999)document.querySelectorAll('.lb,h3').forEach(h=>{
    if(!/NBL–MEI/.test(h.textContent)||h.querySelector('.simchip'))return;
    h.insertAdjacentHTML('beforeend',' '+simChip({sim:1,real:MEI.real>0?1:0},true));
  });
}
/* หัวหน้าเพจย่อเป็นแถบบางเมื่อเลื่อนลง ไม่บังหัวการ์ด */
function bindPhMini(){
  const m=document.querySelector('.main'); if(!m||m.dataset.phm)return; m.dataset.phm='1';
  let raf=0;
  const upd=()=>{raf=0;const y=Math.max(m.scrollTop||0,window.scrollY||0);
    document.querySelectorAll('.view.on>.ph,.ph').forEach(p=>p.classList.toggle('mini',y>60))};
  const on=()=>{if(!raf)raf=requestAnimationFrame(upd)};
  m.addEventListener('scroll',on,{passive:true});window.addEventListener('scroll',on,{passive:true});
}
function safeRender(){
  try{PAGE.render()}catch(e){console.error('render '+PAGE.id,e)}
  try{gdcPanels(PAGE.id)}catch(e){console.error('panels',e)}
  try{gdcSyncBadge(PAGE.id)}catch(e){}
  try{
    bindPhMini();
    trustBar();
    document.querySelectorAll('[data-build]').forEach(e=>e.textContent=CFG.build);
    fillIcons();
    pageBanner();bindToggle();revealCards();animateNums();
  }catch(e){}
}

document.addEventListener('click',function(e){
  const g=e.target.closest('[data-go]');
  if(!g||e.target.closest('td[data-path]'))return;
  const n=NAVI.find(x=>x.id===g.dataset.go);
  if(n)location.href=n.file;
});


/* ════════════════════════════════════════════════════════════════════
   เครื่องมือการนำเสนอ
   1) ลิงก์เปิดตรงจุด   2) บันทึกการ์ดเป็นภาพ   3) นำเสนอทีละการ์ด   4) QR
   ════════════════════════════════════════════════════════════════════ */
const LIB={
  h2c:'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
  qr :'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'
};
function loadLib(url,glob){
  if(window[glob])return Promise.resolve(window[glob]);
  return new Promise((res,rej)=>{
    const s=document.createElement('script'); s.src=url; s.crossOrigin='anonymous';
    s.onload=()=>window[glob]?res(window[glob]):rej(new Error('โหลดไลบรารีไม่สำเร็จ'));
    s.onerror=()=>rej(new Error('โหลดไลบรารีไม่สำเร็จ ตรวจการเชื่อมต่ออินเทอร์เน็ต'));
    document.head.appendChild(s);
  });
}
function toast(msg,kind){
  let t=document.getElementById('dsToast');
  if(!t){t=document.createElement('div');t.id='dsToast';document.body.appendChild(t)}
  t.className='dstoast '+(kind||'ok'); t.textContent=msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('on'),2600);
}

/* ── 1) ลิงก์เปิดตรงจุด ── หน้าแต่ละหน้าเก็บสถานะ (ปี เดือน แท็บ) ลงในลิงก์ และอ่านกลับตอนเปิด */
const URLST={
  get(k){try{return new URLSearchParams(location.search).get(k)}catch(e){return null}},
  set(o){
    try{
      const u=new URL(location.href);
      Object.keys(o).forEach(k=>{const v=o[k]; if(v==null||v==='')u.searchParams.delete(k); else u.searchParams.set(k,String(v))});
      history.replaceState(null,'',u.toString());
    }catch(e){}
  }
};
async function copyLink(){
  const url=location.href;
  try{ await navigator.clipboard.writeText(url); toast('คัดลอกลิงก์แล้ว · เปิดแล้วจะมาตรงหน้าและงวดที่กำลังดู'); }
  catch(e){ window.prompt('คัดลอกลิงก์นี้',url); }
}

/* ── 2) บันทึกการ์ดเป็นภาพ ── ภาพมีหัวเรื่อง ที่มา และวันที่ข้อมูลติดมาด้วย เอาไปใส่สไลด์หรือส่งต่อได้ทันที */
function cardTitle(el){
  if(el.classList&&el.classList.contains('grid')){
    const n=[...el.querySelectorAll(':scope > .kpi .h span:last-child')].map(x=>x.textContent.trim());
    return 'ตัวเลขสำคัญ · '+n.slice(0,3).join(' · ')+(n.length>3?' และอีก '+(n.length-3)+' รายการ':'');
  }
  const h=el.querySelector('header h3, .h span:last-child, .lb, h2');
  return h?h.textContent.replace(/\s+/g,' ').trim():'การ์ดข้อมูล';
}
async function snapCard(el){
  if(!el)return;
  try{
    toast('กำลังสร้างภาพ…','wait');
    const h2c=await loadLib(LIB.h2c,'html2canvas');
    const foot=document.createElement('div');
    foot.className='snapfoot';
    foot.innerHTML=`<b>ศูนย์บัญชาการข้อมูลเศรษฐกิจ จังหวัดหนองบัวลำภู</b>
      <span>ข้อมูล ณ ${CFG.asof} · ${document.title.split('·')[0].trim()} · พิมพ์ ${new Date().toLocaleDateString('th-TH',{dateStyle:'medium'})}</span>`;
    el.classList.add('snapping'); el.appendChild(foot);
    const bg=getComputedStyle(el).backgroundColor;
    const cv=await h2c(el,{scale:2,backgroundColor:(bg&&bg!=='rgba(0, 0, 0, 0)')?bg:'#ffffff',useCORS:true,logging:false,
      /* สำเนาที่ใช้วาดภาพจะเล่นแอนิเมชันเปิดการ์ดใหม่ตั้งแต่ต้น (โปร่งใส) ภาพเลยออกมาขาวทั้งแผ่น จึงปิดแอนิเมชันในสำเนา */
      onclone:d=>{const st=d.createElement('style');
        st.textContent='*,*::before,*::after{animation:none!important;transition:none!important}'+
          '.c,.kpi,.grid,.hero,.reveal,.in,[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}';
        d.head.appendChild(st);},
      ignoreElements:n=>n.classList&&(n.classList.contains('snapbtn')||n.classList.contains('segs')||n.classList.contains('vswitch')||n.classList.contains('briefbtn'))});
    foot.remove(); el.classList.remove('snapping');
    let url;
    try{ url=cv.toDataURL('image/png'); }
    catch(te){
      /* ภาพพื้นหลังจากโดเมนอื่นทำให้บันทึกไม่ได้ · ลองใหม่โดยตัดภาพพื้นหลังตกแต่งออก ตัวเลขและกราฟยังครบ */
      el.classList.add('snapping'); el.appendChild(foot);
      const cv2=await h2c(el,{scale:2,backgroundColor:'#ffffff',logging:false,
        ignoreElements:n=>n.classList&&(n.classList.contains('snapbtn')||n.classList.contains('segs')||n.classList.contains('vswitch')||n.classList.contains('briefbtn')||n.classList.contains('kpibg')||n.tagName==='IMG'),
        onclone:d=>{const st=d.createElement('style');st.textContent='*{animation:none!important;transition:none!important;background-image:none!important}.c,.kpi,.grid,.hero{opacity:1!important;transform:none!important}';d.head.appendChild(st)}});
      foot.remove(); el.classList.remove('snapping');
      url=cv2.toDataURL('image/png');
    }
    const name=(cardTitle(el)+' '+new Date().toISOString().slice(0,10)).replace(/[\\/:*?"<>|]+/g,' ').slice(0,80)+'.png';
    const a=document.createElement('a'); a.download=name; a.href=url; a.click();
    toast('บันทึกภาพแล้ว · '+name);
  }catch(e){
    document.querySelectorAll('.snapfoot').forEach(x=>x.remove());
    document.querySelectorAll('.snapping').forEach(x=>x.classList.remove('snapping'));
    toast('บันทึกภาพไม่สำเร็จ: '+e.message,'err');
  }
}
const SNAP_ICO='<svg viewBox="0 0 24 24"><path d="M4 8h3l2-2.5h6L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.6"/></svg>';
function decorateSnap(){
  document.querySelectorAll('.view.on .c>header, main .c>header').forEach(h=>{
    if(h.querySelector('.snapbtn'))return;
    const b=document.createElement('button'); b.className='snapbtn'; b.type='button';
    b.setAttribute('aria-label','บันทึกการ์ดนี้เป็นภาพ');
    b.dataset.tip2='บันทึกเป็นภาพ|ได้ไฟล์ PNG คมชัด มีหัวเรื่อง ที่มา และวันที่ข้อมูลติดมา เอาไปใส่สไลด์หรือส่ง LINE ได้ทันที';
    b.innerHTML=SNAP_ICO; h.appendChild(b);
  });
  document.querySelectorAll('.kpi').forEach(k=>{
    if(k.querySelector(':scope > .snapbtn'))return;
    const b=document.createElement('button'); b.className='snapbtn mini'; b.type='button';
    b.setAttribute('aria-label','บันทึกการ์ดนี้เป็นภาพ'); b.dataset.tip2='บันทึกการ์ดนี้เป็นภาพ';
    b.innerHTML=SNAP_ICO; k.appendChild(b);
  });
}
(function(){
  let t=null;
  const run=()=>{t=null;try{decorateSnap()}catch(e){}};
  const start=()=>{
    run();
    new MutationObserver(()=>{if(!t)t=setTimeout(run,250)}).observe(document.body,{childList:true,subtree:true});
  };
  if(document.body)start(); else document.addEventListener('DOMContentLoaded',start);
})();

/* ── 3) นำเสนอทีละการ์ด ── หรี่ส่วนอื่น เน้นการ์ดปัจจุบัน เลื่อนมากลางจอ ใช้ลูกศรหรือรีโมตพรีเซนต์ */
const TOUR={on:false,i:0,list:[]};
function tourItems(){
  const root=document.querySelector('.view.on')||document.querySelector('main')||document.body;
  const pick=[...root.querySelectorAll('.hero, .grid, .c, .pgbanner + .ph, .slicer')].filter(el=>{
    if(!el.offsetParent&&getComputedStyle(el).position!=='fixed')return false;
    if(el.classList.contains('grid')&&!el.querySelector(':scope > .kpi'))return false;   /* เอาเฉพาะแถวการ์ดตัวเลข */
    if(el.classList.contains('slicer'))return false;
    const r=el.getBoundingClientRect(); if(r.height<40)return false;
    return true;
  });
  /* ไม่เอาการ์ดที่ซ้อนอยู่ในตัวที่เลือกแล้ว */
  return pick.filter(el=>!pick.some(p=>p!==el&&p.contains(el)));
}
function tourShow(){
  document.querySelectorAll('.tour-cur').forEach(x=>x.classList.remove('tour-cur'));
  const el=TOUR.list[TOUR.i]; if(!el)return;
  el.classList.add('tour-cur');
  el.scrollIntoView({behavior:'smooth',block:el.getBoundingClientRect().height>innerHeight*.8?'start':'center'});
  const hud=document.getElementById('tourHud');
  if(hud){
    hud.querySelector('.th-n').textContent=(TOUR.i+1)+' / '+TOUR.list.length;
    hud.querySelector('.th-t').textContent=cardTitle(el);
    hud.querySelector('.th-bar i').style.width=((TOUR.i+1)/TOUR.list.length*100)+'%';
  }
  URLST.set({card:TOUR.i+1});
}
function tourStart(){
  TOUR.list=tourItems(); if(!TOUR.list.length){toast('หน้านี้ไม่มีการ์ดให้นำเสนอ','err');return}
  TOUR.on=true; const c=+URLST.get('card'); TOUR.i=(c>0&&c<=TOUR.list.length)?c-1:0;
  document.body.classList.add('tour');
  let hud=document.getElementById('tourHud');
  if(!hud){
    hud=document.createElement('div'); hud.id='tourHud';
    hud.innerHTML=`<button class="th-b" data-tour="-1" aria-label="ก่อนหน้า">‹</button>
      <div class="th-m"><div class="th-row"><span class="th-n"></span><span class="th-t"></span></div>
        <div class="th-bar"><i></i></div></div>
      <button class="th-b" data-tour="1" aria-label="ถัดไป">›</button>
      <button class="th-x" data-tour="qr">QR</button>
      <button class="th-x" data-tour="fs">เต็มจอ</button>
      <button class="th-x" data-tour="end">ออก</button>`;
    document.body.appendChild(hud);
  }
  hud.classList.add('on');
  tourShow();
}
function tourEnd(){
  TOUR.on=false; document.body.classList.remove('tour');
  document.querySelectorAll('.tour-cur').forEach(x=>x.classList.remove('tour-cur'));
  const hud=document.getElementById('tourHud'); if(hud)hud.classList.remove('on');
  qrHide(); URLST.set({card:null});
  if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
}
function tourGo(d){ if(!TOUR.on)return; TOUR.i=Math.max(0,Math.min(TOUR.list.length-1,TOUR.i+d)); tourShow(); }

/* ── 4) QR ให้ผู้ฟังสแกนเปิดหน้าเดียวกันบนมือถือ ── */
async function qrSvg(text,cell){
  const q=await loadLib(LIB.qr,'qrcode');
  const qr=q(0,'M'); qr.addData(text); qr.make();
  return qr.createSvgTag({cellSize:cell||5,margin:2,scalable:true});
}
async function qrShow(){
  let box=document.getElementById('qrBox');
  if(box&&box.classList.contains('on')){qrHide();return}
  if(!box){box=document.createElement('div');box.id='qrBox';document.body.appendChild(box)}
  const u=new URL(location.href); u.searchParams.delete('card');
  try{
    box.innerHTML=`<div class="qr-i">${await qrSvg(u.toString(),6)}</div>
      <b>สแกนเพื่อเปิดหน้านี้บนมือถือ</b><span>${document.title.split('·')[0].trim()}</span>`;
    box.classList.add('on');
  }catch(e){toast('สร้าง QR ไม่สำเร็จ: '+e.message,'err')}
}
function qrHide(){const b=document.getElementById('qrBox'); if(b)b.classList.remove('on')}

document.addEventListener('click',e=>{
  const sb=e.target.closest('.snapbtn');
  if(sb){e.preventDefault();e.stopPropagation();snapCard(sb.classList.contains('mini')?sb.closest('.kpi'):sb.closest('.c'));return}
  if(e.target.closest('#btnShare')){copyLink();return}
  if(e.target.closest('#btnTour')){TOUR.on?tourEnd():tourStart();return}
  const t=e.target.closest('[data-tour]');
  if(t){const v=t.dataset.tour;
    if(v==='end')tourEnd(); else if(v==='qr')qrShow();
    else if(v==='fs'){document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}
    else tourGo(+v);
  }
},true);
document.addEventListener('keydown',e=>{
  if(!TOUR.on)return;
  if(/INPUT|SELECT|TEXTAREA/.test((e.target.tagName||'')))return;
  const k=e.key;
  if(k==='ArrowRight'||k==='PageDown'||k===' '||k==='ArrowDown'){e.preventDefault();tourGo(1)}
  else if(k==='ArrowLeft'||k==='PageUp'||k==='ArrowUp'){e.preventDefault();tourGo(-1)}
  else if(k==='Escape'){tourEnd()}
  else if(k==='q'||k==='Q'||k==='ๆ'){qrShow()}
  else if(k==='f'||k==='F'||k==='ด'){document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}
});
/* เปิดลิงก์ที่มี ?card= จะเข้าโหมดนำเสนอที่การ์ดนั้นทันที */
window.addEventListener('load',()=>{ if(URLST.get('card'))setTimeout(tourStart,900); });


/* ════════════════════════════════════════════════════════════════════
   ระบบบัญชีข้อมูลจังหวัดหนองบัวลำภู (gdcatalog · CKAN Datastore API)
   หน่วยงานปรับปรุงข้อมูลที่ระบบบัญชีข้อมูลจังหวัดที่เดียว แดชบอร์ดดึงไปใช้เอง
   ════════════════════════════════════════════════════════════════════ */
const GDC={
  base:'https://nongbualamphu.gdcatalog.go.th',
  api :'https://nongbualamphu.gdcatalog.go.th/api/3/action/datastore_search',
  ttl :30*60*1000,                      /* เก็บผลไว้ในเครื่อง 30 นาที ลดการเรียกซ้ำ */
  /* ทะเบียนชุดข้อมูลที่ย้ายมาใช้ API
     state: 'api' = ต่อเข้าแดชบอร์ดแล้ว · 'map' = ลงทะเบียนแล้ว รอจับคู่คอลัมน์ · 'file' = ยังใช้ไฟล์ข้อมูลเดิม */
  RES:[
    {id:'b58050df-6cd7-461e-be9b-f1108d6a152c',page:'fiscal',agency:'spend',n:'เงินกันไว้เบิกเหลื่อมปีงบประมาณ',state:'api'},
    {id:'2fb4cd9f-efcf-4719-b35b-34a20c89ab67',page:'fiscal',agency:'spend',n:'คงเหลือเงินกันไว้เบิกเหลื่อมปี',state:'api'},
    {id:'b0e1424c-409d-4200-be75-a6a026851bbd',page:'fiscal',agency:'spend',n:'การเบิกจ่ายงบประมาณ',state:'api'},
    {id:'3bafb802-ddb5-4534-a391-d399c91b3588',page:'fiscal',agency:'spend',n:'การเบิกจ่ายเงินกันไว้เบิกเหลื่อมปี',state:'api'},
    {id:'e180a38e-e31f-4338-967e-91ebb42424c9',page:'fiscal',agency:'spend',n:'ความต้องการ (เพิ่ม) การเบิกจ่ายงบประมาณ',state:'api'},
    {id:'e68752b1-8f4b-4b28-92a6-0a78e849575a',page:'fiscal',agency:'spend',n:'การก่อหนี้ผูกพันของการเบิกจ่ายงบประมาณ',state:'api'},
    {id:'07053215-af15-4271-9539-88d142a63dc8',page:'fiscal',agency:'spend',n:'ผลการเบิกจ่ายงบประมาณ',state:'api'},
    {id:'21962d43-ccb4-48e6-a760-c815212f271e',page:'fiscal',agency:'spend',n:'ผลการใช้จ่ายงบประมาณ',state:'api'},
    {id:'8206aee0-36e0-45de-b5cf-6bb850a6ae3c',page:'fiscal',agency:'spend',n:'ลำดับผลการเบิกจ่ายงบประมาณ',state:'api'},
    /* ภาคเกษตร · แหล่งน้ำเพื่อการเกษตร */
    {id:'95537e06-3fbd-48ed-b64a-f7ff75b8a85b',page:'agri',agency:'irrig',n:'แหล่งน้ำชลประทาน จำแนกตามประเภทแหล่งน้ำ',state:'api'},
    {id:'5d8b0bd9-9f5a-4385-a63e-16a300cd7a5e',page:'agri',agency:'irrig',n:'จำนวนแหล่งน้ำขนาดเล็ก',state:'api'},
    {id:'94c6b113-e8f7-4aca-bb8c-4fbea3454b70',page:'agri',agency:'crop',n:'จำนวนครัวเรือนเกษตรกร',state:'api'},
    {id:'e7795256-a7e4-46d1-86d8-c58cd22023db',page:'agri',agency:'irrig',n:'จำนวนพื้นที่ที่ได้รับประโยชน์ในเขตชลประทาน',state:'api'},
    /* ชุดที่มีในระบบบัญชีข้อมูลจังหวัดแล้ว แต่ระบบยังไม่เปิดอ่านผ่าน API (ยังไม่มีรหัส resource) */
    {id:'',page:'agri',agency:'irrig',n:'จำนวนพื้นที่เพาะปลูกในเขตชลประทาน',state:'link',ds:'dataset_02_24'},
    {id:'',page:'agri',agency:'ldd',n:'ข้อมูลสระน้ำในไร่นานอกเขตชลประทาน',state:'link',ds:'information-on'},
    {id:'',page:'agri',agency:'env',n:'จำนวนบ่อบาดาล ประเภทเกษตรกรรม',state:'link',ds:'dataset_02_05'},
    {id:'',page:'agri',agency:'irrig',n:'จำนวนปริมาณเก็บกักน้ำ',state:'link',ds:'dataset_04_03'},
    {id:'',page:'agri',agency:'irrig',n:'จำนวนพื้นที่ชลประทาน',state:'link',ds:'dataset_04_04'},
    {id:'',page:'agri',agency:'irrig',n:'จำนวนครัวเรือนในเขตชลประทานที่ได้รับประโยชน์',state:'link',ds:'dataset_04_06'},
    {id:'',page:'agri',agency:'irrig',n:'โครงการแก้มลิง',state:'link'},
    /* ตลาดแรงงาน · สำนักงานสถิติจังหวัด */
    {id:'cf364469-3e3f-4457-aee0-87bdbb0870a0',page:'labor',agency:'nso',n:'ประชากรอายุ 15 ปีขึ้นไป จำแนกตามสถานภาพแรงงาน เป็นรายไตรมาส',state:'api',use:'กำลังแรงงาน ผู้มีงานทำ ผู้ว่างงาน อัตราการว่างงาน อัตราการมีส่วนร่วม'},
    {id:'a392e50d-2b4c-4367-97eb-2591d04ca6dc',page:'labor',agency:'sso',n:'จำนวนผู้ประกันตนตามมาตรา 33',state:'api',use:'ผู้ประกันตนในระบบประกันสังคม'},
    {id:'4e729f3a-6676-470c-ab7f-6465bf538a38',page:'labor',agency:'sso',n:'จำนวนผู้ประกันตนตามมาตรา 39',state:'api',use:'ผู้ประกันตนในระบบประกันสังคม'},
    {id:'ae943535-c621-420c-beb0-fe1b5af287dd',page:'labor',agency:'sso',n:'จำนวนผู้ประกันตนตามมาตรา 40',state:'api',use:'ผู้ประกันตนในระบบประกันสังคม'},
    {id:'38498cfc-f015-448a-815b-b9ab09691698',page:'labor',agency:'sso',n:'การใช้บริการของผู้ประกันตนตามมาตรา 33 และมาตรา 39',state:'avail'},
    {id:'f913c7e3-1b77-4239-9daf-29d8e23e01bc',page:'industry',agency:'ind',n:'จำนวนสถานประกอบการอุตสาหกรรม',state:'api',use:'สถานประกอบการรายปีและรายอำเภอ'},
    {id:'a0ea6508-d3f2-4b6b-9a49-60c6a3acb059',page:'industry',agency:'nesdc',n:'รายได้ภาคอุตสาหกรรม (GPP)',state:'api',use:'รายได้ภาคอุตสาหกรรม (GPP)'},
    {id:'501555c3-cd78-43ef-adc9-0713dcb38b9d',page:'labor',agency:'nso',n:'ประชากรอายุ 15 ปีขึ้นไปที่มีงานทำ จำแนกตามกิจกรรมทางเศรษฐกิจ และเพศ เป็นรายไตรมาส',state:'api',use:'ผู้มีงานทำแยกตามสาขาเศรษฐกิจ ในภาคเกษตร/นอกภาคเกษตร'},
    {id:'37398ad3-6536-47ed-82ab-2e4883927542',page:'labor',agency:'nso',n:'ประชากรอายุ 15 ปีขึ้นไปที่มีงานทำ จำแนกตามสถานภาพการทำงาน และเพศ เป็นรายไตรมาส',state:'api',use:'ผู้มีงานทำแยกตามสถานภาพการทำงาน'},
    {id:'af4f22e7-74e4-41a8-bf45-4034514446d8',page:'labor',agency:'nso',n:'การทำงานต่ำกว่าระดับด้านชั่วโมงการทำงาน',state:'api',use:'ผู้ทำงานต่ำกว่าระดับรายไตรมาส'},
    {id:'9d89b6d3-d47f-466f-8fb6-ee9138dedacb',page:'labor',agency:'nso',n:'อัตราการว่างงาน',state:'api'},
    {id:'5184ddd5-b72b-4ce1-8cb0-91265a3c1a8e',page:'labor',agency:'nso',n:'จำนวนผู้ว่างงาน',state:'avail'},
    {id:'d4562b99-2732-49b5-8cfe-b3282196e0ab',page:'labor',agency:'nso',n:'ประชากรอายุ 15 ปีขึ้นไปที่มีงานทำ จำแนกตามอาชีพ และเพศ เป็นรายไตรมาส',state:'avail'},
    {id:'78e14a3f-8c22-4c77-b267-b21ed68e63bd',page:'labor',agency:'nso',n:'ประชากรอายุ 15 ปีขึ้นไปที่มีงานทำ จำแนกตามระดับการศึกษาที่สำเร็จ และเพศ เป็นรายไตรมาส',state:'avail'},
    {id:'0ffce67f-bef6-4a16-a116-3107dc681a10',page:'labor',agency:'nso',n:'ประชากรอายุ 15 ปีขึ้นไป จำแนกตามเพศ และสถานภาพแรงงาน',state:'avail'},
    {id:'40275f48-de7a-4451-92a8-9c1b32fdc9bc',page:'labor',agency:'nso',n:'กำลังแรงงานจังหวัดหนองบัวลำภู',state:'avail'},
    {id:'22c3a494-1e56-47a1-abea-73574db8fada',page:'labor',agency:'nso',n:'ชุดข้อมูลกำลังแรงงาน ตามโครงการการสำรวจภาวะการทำงานของประชากร ปี 2562 ถึง 2568',state:'avail'},
    /* ครัวเรือนและความเหลื่อมล้ำ · สำนักงานสถิติจังหวัด */
    {id:'c0a430d9-63a9-4cc9-be0b-bf43fd49e2d9',page:'household',agency:'nso',n:'รายได้ ค่าใช้จ่าย หนี้สินโดยรวม ตามโครงการสำรวจ แต่ละช่วงปี',state:'api',use:'รายได้ ค่าใช้จ่าย หนี้สินเฉลี่ยต่อครัวเรือน'},
    {id:'a8d80120-4838-414f-bdbd-ec8667e2016e',page:'household',agency:'nso',n:'หนี้สินเฉลี่ยต่อครัวเรือน',state:'api',use:'หนี้ในระบบและนอกระบบ'},
    {id:'909b635e-c6e1-4fcb-b89b-aedb9c04d621',page:'household',agency:'nso',n:'สัมประสิทธิ์ความไม่เสมอภาค (Gini coefficient) ด้านรายได้',state:'api',use:'กราฟ Gini แบ่ง 5 และ 10 กลุ่ม'},
    {id:'4fac937e-84c4-4b98-b92d-1c83e459add8',page:'household',agency:'nso',n:'ค่าใช้จ่ายเฉลี่ยต่อเดือนของครัวเรือน จำแนกตามขนาดของครัวเรือน',state:'api',use:'ค่าใช้จ่ายตามขนาดครัวเรือน'},
    {id:'ba544923-8995-4a2e-a7ab-35977f07975d',page:'household',agency:'nso',n:'รายได้เฉลี่ยต่อเดือนของครัวเรือน จำแนกตามแหล่งที่มาของรายได้',state:'api',use:'โครงสร้างแหล่งรายได้'},
    {id:'aa2c77c6-3d19-4ae3-a1b1-9605c14aa751',page:'household',agency:'nso',n:'ค่าใช้จ่ายเฉลี่ยต่อเดือนของครัวเรือน',state:'api',use:'การกระจายครัวเรือนตามช่วงค่าใช้จ่าย'},
    {id:'73df9a5b-6433-4009-bcae-9590a46c35d6',page:'household',agency:'nso',n:'ร้อยละของครัวเรือน จำแนกตามลักษณะที่สำคัญของครัวเรือน',state:'avail'},
    {id:'399f28c9-80d6-43bc-b7f2-f214cd5c1e8d',page:'household',agency:'nso',n:'รายได้เฉลี่ยต่อเดือนของครัวเรือน จำแนกตามสถานะทางเศรษฐสังคม',state:'avail'},
    {id:'a3ebe2ae-6aa0-41a0-8805-c671bc57d0c8',page:'household',agency:'nso',n:'ค่าใช้จ่ายเฉลี่ยต่อปีของครัวเรือน จำแนกตามสถานะทางเศรษฐสังคม',state:'avail'},
    {id:'99f1ed66-2fe3-4b7b-853e-737932776c54',page:'household',agency:'nso',n:'สัมประสิทธิ์ความไม่เสมอภาค (Gini) ด้านรายจ่ายเพื่อการอุปโภคบริโภค',state:'avail'},
    {id:'9d279dbb-0e2a-483b-9bab-ecb223756a09',page:'household',agency:'nso',n:'Gini ด้านรายจ่าย แยกตามขอบเขตชั้นค่าใช้จ่ายและกลุ่มครัวเรือน',state:'avail'},
    {id:'2e73835e-fd7d-4767-817a-81ba7216b56d',page:'household',agency:'nso',n:'ครัวเรือนที่มีที่อยู่อาศัยใช้วัสดุคงทนและเป็นของตนเอง',state:'avail'},
    /* ประชากร */
    {id:'7d183fa3-e333-48aa-ae9f-f9fd13746a80',page:'population',agency:'nso',n:'อัตราเพิ่มของประชากร',state:'api',use:'อัตราเพิ่มของประชากรรายอำเภอ'},
    /* การเงิน · ธนาคารแห่งประเทศไทย */
    {id:'ec2ae427-8a15-44e0-8be3-692e07393f2b',page:'trade',agency:'bot',n:'จำนวนธนาคารพาณิชย์',state:'avail'},
    {id:'f73d6b1a-b890-43d4-b9a1-0f4d6ed873e4',page:'trade',agency:'bot',n:'เงินฝากของธนาคารพาณิชย์',state:'avail'},
    {id:'b519ce91-d7b1-4719-96d8-795b5307b6ba',page:'trade',agency:'bot',n:'จำนวนสินเชื่อของธนาคารพาณิชย์',state:'avail'},
    /* ค่าเป้าหมาย */
    {id:'85640650-a585-476c-af0e-733309d50161',page:'tourism',agency:'mots',n:'ค่าเป้าหมายตัวชี้วัดท่องเที่ยว',state:'avail'},
    {id:'64467029-96c0-4558-996f-a96ce0f4763f',page:'otop',agency:'cdd',n:'ค่าเป้าหมายตัวชี้วัด OTOP',state:'avail'}
,
    /* ชุดข้อมูลรอบที่ 3 · แสดงผ่านแผงอัตโนมัติ */
    {id:'f7724a59-3324-486e-a169-aa3c42381467',page:'tourism',agency:'mots',n:'ข้อมูลรายชื่อร้านอาหาร จังหวัดหนองบัวลำภู',state:'avail'},
    {id:'afbca98b-44bb-4f16-b6de-e4c3eaee2f1b',page:'tourism',agency:'mots',n:'ข้อมูลรายชื่อร้านอาหาร ภายในจังหวัดหนองบัวลำภู',state:'avail'},
    {id:'eff8b887-c008-4586-824a-159630d7fbce',page:'tourism',agency:'mots',n:'อัตราการเข้าพัก',state:'api'},
    {id:'49c6f93a-08ff-4790-a57e-9af4fe9e9461',page:'tourism',agency:'mots',n:'ที่พักโรงแรมห้องพักที่จดทะเบียนในจังหวัด',state:'avail'},
    {id:'c1532969-364d-43fd-89b0-b112c513d739',page:'tourism',agency:'mots',n:'ที่พัก',state:'avail'},
    {id:'b38581a7-0385-48d4-b491-6a7c30f0adf3',page:'tourism',agency:'mots',n:'ห้องพัก',state:'avail'},
    {id:'a7276fe4-85eb-463b-a1d6-98b4401896b2',page:'tourism',agency:'mots',n:'อัตราการเข้าพัก',state:'avail'},
    {id:'0a8c611d-8c18-48c0-bf32-daf9b7a82837',page:'tourism',agency:'mots',n:'การเข้าพัก',state:'avail'},
    {id:'79932db4-c98d-4117-8781-3713491fa111',page:'tourism',agency:'mots',n:'ค่าเฉลี่ยระยะเวลาเข้าพัก',state:'avail'},
    {id:'b4e18e41-b21c-406a-a05b-17968cca8dba',page:'tourism',agency:'mots',n:'คนเข้าพัก (คน/ห้อง)',state:'avail'},
    {id:'009d7f8c-7389-47f4-bdae-50f044a7ae95',page:'tourism',agency:'mots',n:'ระยะเวลาการเข้าพักโดยเฉลี่ย',state:'avail'},
    {id:'da6ebc3a-f545-4fad-a406-e527655189b9',page:'tourism',agency:'mots',n:'ที่พัก โรงแรม',state:'avail'},
    {id:'b689c7e2-2b65-4177-8434-3aac0fca590f',page:'tourism',agency:'mots',n:'ค่าใช้จ่ายต่อคนต่อวันของนักท่องเที่ยว',state:'api'},
    {id:'04ea026d-7fd8-4e64-9268-c13007d84689',page:'tourism',agency:'mots',n:'จำนวนนักท่องเที่ยว',state:'avail'},
    {id:'5e65986f-ebe0-44e9-adf7-215ce4e90dad',page:'tourism',agency:'mots',n:'นักท่องเที่ยวภายในจังหวัดหนองบัวลำภู จำแนกประเภท',state:'api'},
    {id:'baad78a2-9acd-4ee3-ae3d-1cb81086cb83',page:'tourism',agency:'mots',n:'รายได้จากการท่องเที่ยว',state:'avail'},
    {id:'170f017c-126e-4432-a58f-20f4bef30f78',page:'tourism',agency:'mots',n:'รายได้จากการท่องเที่ยว รายเดือน',state:'api'},
    {id:'051f08e3-265d-4399-9e96-01f4daf8eb02',page:'tourism',agency:'mots',n:'จำนวนผู้เยี่ยมเยือน',state:'api',use:'แนวโน้มผู้เยี่ยมเยือนรายปี'},
    {id:'450a2393-a4a6-412f-8d08-6f7dcfc87203',page:'tourism',agency:'mots',n:'แหล่งท่องเที่ยวจังหวัด',state:'avail'},
    {id:'5213acd6-1913-4cc7-9807-1caa20855cd5',page:'tourism',agency:'mots',n:'จำนวนแหล่งท่องเที่ยว จำแนกตามประเภท',state:'api'},
    {id:'f6d19f7c-82ed-4ff5-adb3-eeafa859161f',page:'tourism',agency:'mots',n:'รายชื่อแหล่งท่องเที่ยว',state:'api',use:'ตรวจทานรายชื่อแหล่งท่องเที่ยวกับชุดพิกัด'},
    {id:'e379647a-653f-467c-9d93-f3f0d2df85b1',page:'tourism',agency:'mots',n:'พิกัด ตำแหน่ง รายชื่อแหล่งท่องเที่ยว',state:'api',use:'แผนที่และรายชื่อแหล่งท่องเที่ยว'},
    {id:'42694bb9-6870-4d50-bbae-27859db9d06c',page:'tourism',agency:'mots',n:'จำนวนผู้เยี่ยมเยือน รายเดือน',state:'api',use:'ผู้เยี่ยมเยือนรายเดือนและเทียบปีต่อปี'},
    {id:'ce3fd380-daef-4e3e-b6ef-eca62e45c137',page:'tourism',agency:'mots',n:'อัตราการเข้าพัก รายเดือน',state:'api',use:'อัตราการเข้าพักรายเดือน'},
    {id:'04e99c9f-fc2d-41dd-949e-524374a8cf54',page:'tourism',agency:'mots',n:'จำนวนแหล่งท่องเที่ยวที่สำคัญ',state:'avail'},
    {id:'7d37b553-3c4d-4cb2-9201-45635655b597',page:'tourism',agency:'mots',n:'ฐานข้อมูล เพื่อการท่องเที่ยวเชิงอนุรักษ์และวัฒนธรรม',state:'avail'},
    {id:'d522f7e7-7039-480b-ab9b-d96a42dfa3b1',page:'tourism',agency:'mots',n:'จำนวนธุรกิจนำเที่ยวที่ผ่านเกณฑ์มาตรฐาน',state:'avail'},
    {id:'4493a5ac-411a-48df-bf97-f63fdcfa313f',page:'tourism',agency:'mots',n:'จำนวนผู้ประกอบการการท่องเที่ยว',state:'avail'},
    {id:'95e09cb9-2f10-4d13-a82e-b0e0913c7c18',page:'tourism',agency:'mots',n:'จำนวนชุมชนท่องเที่ยวที่มีการประชาสัมพันธ์ผ่านสื่อ Social media ต่างๆ',state:'avail'},
    {id:'c6b78bad-346b-4250-b4f5-3a1b424bece6',page:'population',agency:'dopa',n:'ประชากรจากการทะเบียน จำแนกตามกลุ่มอายุ และอำเภอ',state:'api'},
    {id:'2a80f2c7-5397-4dc7-91ee-cc449106e9d0',page:'population',agency:'dopa',n:'จำนวนการย้ายเข้าและย้ายออก',state:'api'},
    {id:'9e6e0bb9-0a84-4f8f-85d1-a933d7a4824c',page:'population',agency:'dopa',n:'จำนวนหมู่บ้านทั้งสิ้นในจังหวัด',state:'avail'},
    {id:'b1d4dba9-98ce-4c6a-ad70-88e045eb16af',page:'population',agency:'dopa',n:'จำนวนการเกิด',state:'api'},
    {id:'7fde384d-d5cf-4300-b9cc-d578dd80d723',page:'population',agency:'dopa',n:'จำนวนการตาย',state:'api'},
    {id:'39373f2b-c360-4231-bee9-05e9ae4392a8',page:'population',agency:'dopa',n:'อัตราการจดทะเบียนสมรส',state:'avail'},
    {id:'4c87df45-e347-4044-8712-9897f349ba7b',page:'population',agency:'dopa',n:'อัตราการจดทะเบียนหย่า',state:'avail'},
    {id:'5c879c91-8648-4771-b514-768ef75ea42b',page:'population',agency:'dopa',n:'จำนวนการจดทะเบียนสมรส',state:'avail'},
    {id:'ff6ef4f6-0503-4a66-8074-ea819916942b',page:'population',agency:'dopa',n:'จำนวนการจดทะเบียนหย่า',state:'avail'},
    {id:'03b88975-36e5-46e1-b0fa-0456f0a37193',page:'population',agency:'dopa',n:'จำนวนประชากรจากการทะเบียน',state:'api'},
    {id:'47bf6256-547c-4e2a-81a8-ffaa55f48a3d',page:'population',agency:'dopa',n:'สถิติจำนวนประชากรแยกรายอายุ',state:'api',use:'ปิรามิดประชากรแยกสัญชาติ ในเขต/นอกเขตเทศบาล'},
    {id:'adafe2b2-6a2f-419e-9cb8-3cccf7e21032',page:'tourism',agency:'mots',n:'สถานประกอบการที่พักแรมที่ถูกต้องตามกฎหมาย',state:'avail'},
    {id:'238104ec-9d77-4d7d-8f41-475daf874056',page:'population',agency:'dopa',n:'ประชากรในเขตเมือง (ประชากรในเขตเทศบาลเมือง) จำแนกเป็นตำบล',state:'avail'},
    {id:'70bfe61c-63bf-45ff-b680-794fc435db08',page:'population',agency:'dopa',n:'พื้นที่ทั้งจังหวัด',state:'avail'},
    {id:'dc7f6fbb-1477-40d6-bf96-f18a0faa0f5d',page:'population',agency:'dopa',n:'เนื้อที่ ระยะทางจากเขตหรืออำเภอถึงจังหวัด และเขตการปกครอง',state:'avail'},
    {id:'03463b5e-c71f-41e8-80d5-bf7794def331',page:'tourism',agency:'mots',n:'ข้อมูลสถานที่ประกอบธุรกิจที่พักที่ปฏิบัติตามพระราชบัญญัติโรงแรม',state:'api'},
    {id:'71dde2da-6581-4dd8-9baa-a7283c4aa182',page:'population',agency:'dopa',n:'สัดส่วนประชากรในเขตเมือง (ประชากรในเขต เทศบาลเมือง)',state:'avail'},
    {id:'ea696fbf-964f-408d-81f5-8547932853be',page:'population',agency:'dopa',n:'ความหนาแน่นของประชากร',state:'avail'},
    {id:'d8eed6d0-1528-491b-8f95-5f0de887fd69',page:'population',agency:'dopa',n:'จำนวนบ้านจากการทะเบียน',state:'api'},
    {id:'e4646cb6-790f-47d2-8ab4-64ea578cddde',page:'labor',agency:'nso',n:'ประชากรอายุ 15 ปีขึ้นไปที่มีงานทำ จำแนกตามจำนวนชั่วโมงทำงานต่อสัปดาห์ และเพศ เป็นรายไตรมาส',state:'avail'},
    {id:'4a431891-9e4e-49df-a4a0-eaaeff41b7bf',page:'otop',agency:'cdd',n:'จำนวนร้านค้า OTOP ในชุมชน',state:'api'},
    {id:'c10f01ae-3cdc-4de4-a8b0-39f8438044ab',page:'otop',agency:'cdd',n:'จำนวนผลิตภัณฑ์สินค้า OTOP จำแนกตามประเภทผลิตภัณฑ์',state:'api'},
    {id:'700584d7-29bc-4749-82ee-dba82098ca0d',page:'otop',agency:'cdd',n:'ข้อมูลสถานประกอบการร้านค้า OTOP',state:'api'},
    {id:'9ca59463-14ab-4247-9602-cc0c06a5ed46',page:'otop',agency:'cdd',n:'ผลิตภัณฑ์ OTOP ที่ได้มาตรฐานระดับ 5 ดาว',state:'api'},
    {id:'ccdf24ab-2807-4560-84f2-2ced40827cff',page:'otop',agency:'cdd',n:'แหล่งเรียนรู้ วิชชาลัย',state:'api'},
    {id:'90309f56-8577-44ab-b694-804bf492c3c5',page:'otop',agency:'cdd',n:'รายได้จากผลิตภัณฑ์ OTOP',state:'api'},
    {id:'b11c718d-fa12-4d60-aa83-37d56fbf4cef',page:'otop',agency:'cdd',n:'รายได้จากผลิตภัณฑ์ OTOP รายเดือน',state:'api'},
    {id:'144dbb21-4aaf-4b29-81be-43e4aa52199d',page:'otop',agency:'cdd',n:'จำนวนผู้ประกอบการ OTOP',state:'avail'},
    {id:'d15c9ff8-0b36-4977-8193-622db6e4f738',page:'otop',agency:'cdd',n:'สินค้า OTOP',state:'avail'},
    {id:'52876d96-9bc4-4f17-8161-d5f97874169e',page:'otop',agency:'cdd',n:'จำนวนหมู่บ้าน OTOP เพื่อการท่องเที่ยว',state:'avail'},
    {id:'ba82c891-eb8c-47ec-8880-5626f73ee86c',page:'agri',agency:'crop',n:'พื้นที่เพาะปลูก',state:'avail'},
    {id:'9835997c-1c59-4b76-b423-147424232d1f',page:'agri',agency:'crop',n:'จำนวนครัวเรือนเกษตรกรปลูกพืช',state:'avail'},
    {id:'6f4ddf77-1629-4aa6-9115-916759ed0fc6',page:'agri',agency:'crop',n:'ตลาดเกษตรกร',state:'avail'},
    {id:'0eb6ce3f-50fc-412b-b385-f0293fa30f9b',page:'agri',agency:'crop',n:'จำนวนตลาดเกษตรกรจังหวัดหนองบัวลำภู',state:'avail'},
    {id:'7df17762-f040-4f65-bc25-d8ea42f46426',page:'agri',agency:'crop',n:'พื้นที่ข้าว',state:'avail'},
    {id:'c74197a6-c749-4b48-ba9a-fcfe38980aae',page:'agri',agency:'crop',n:'เนื้อที่ใช้ประโยชน์ทางการเกษตร',state:'avail'},
    {id:'5fc364e9-112a-4ba2-b8c6-30389247625b',page:'agri',agency:'crop',n:'พื้นที่เกษตรปลอดภัย',state:'avail'},
    {id:'043bbed1-5a1d-4e35-acb0-1a54893df21f',page:'agri',agency:'crop',n:'เนื้อที่ใช้ประโยชน์ทางการเกษตร',state:'avail'},
    {id:'f5907cb4-e8eb-4258-a1e9-e9e418e14aec',page:'otop',agency:'cdd',n:'จำนวนวิสาหกิจชุมชน',state:'avail'}
  ],
  _mem:{},
  /* เรียก API แบบ JSONP (CKAN รองรับพารามิเตอร์ callback) จึงข้ามโดเมนได้โดยไม่ติด CORS */
  _jsonp(params){
    return new Promise((res,rej)=>{
      const cb='gdc_'+Math.random().toString(36).slice(2);
      const q=Object.keys(params).map(k=>encodeURIComponent(k)+'='+encodeURIComponent(params[k])).join('&');
      const s=document.createElement('script'); let done=false;
      const end=()=>{done=true;try{delete window[cb]}catch(e){window[cb]=undefined}s.remove();clearTimeout(t)};
      const t=setTimeout(()=>{if(!done){end();rej(new Error('หมดเวลารอระบบบัญชีข้อมูลจังหวัด'))}},15000);
      window[cb]=d=>{end(); (d&&d.success)?res(d.result):rej(new Error((d&&d.error&&(d.error.message||d.error.__type))||'ระบบตอบกลับไม่สำเร็จ'))};
      s.onerror=()=>{end();rej(new Error('เชื่อมต่อระบบบัญชีข้อมูลจังหวัดไม่ได้'))};
      s.src=GDC.api+'?'+q+'&callback='+cb;
      document.head.appendChild(s);
    });
  },
  /* ดึงทุกแถวของชุดข้อมูล · แบ่งหน้าครั้งละ 1,000 แถว */
  async all(id,opt){
    opt=opt||{};
    const key='gdc:'+id;
    if(!opt.fresh){
      const m=GDC._mem[id]; if(m&&Date.now()-m.t<GDC.ttl)return m.v;
      try{const c=JSON.parse(sessionStorage.getItem(key)||'null'); if(c&&Date.now()-c.t<GDC.ttl){GDC._mem[id]=c;return c.v}}catch(e){}
    }
    let off=0, rec=[], fields=null, total=0;
    do{
      const r=await GDC._jsonp({resource_id:id,limit:1000,offset:off});
      fields=fields||r.fields; total=r.total||0; rec=rec.concat(r.records||[]); off+=1000;
    }while(rec.length<total&&off<20000);
    const v={id,fields:(fields||[]).filter(f=>f.id!=='_id'),records:rec,total,at:new Date().toISOString()};
    try{GDC.logPull(id,v)}catch(e){}
    const c={t:Date.now(),v}; GDC._mem[id]=c;
    try{sessionStorage.setItem(key,JSON.stringify(c))}catch(e){}
    return v;
  },
  url(id){return GDC.base+'/dataset/?res_id='+id},
  byPage(p){return GDC.RES.filter(r=>r.page===p)},
  /* สถานะของหน้า · ใช้ติดป้ายบอกผู้ดูว่าตัวเลขมาจาก API หรือไฟล์เดิม */
  pageState(p){
    const L=GDC.byPage(p).filter(r=>r.state!=='avail'); if(!L.length)return 'file';
    if(L.every(r=>r.state==='api'))return 'api';
    if(L.some(r=>r.state==='api'))return 'part';
    return 'map';
  }
};
/* ป้ายแหล่งข้อมูลของหน้า · กดแล้วไปหน้าสถานะ API */
function gdcBadge(page){
  let st=GDC.pageState(page);
  if(page==='fiscal'&&typeof FISCAL_API!=='undefined'){
    if(FISCAL_API.state==='err')return `<a class="gdcb file" href="apistatus.html#fiscal" data-tip2="${tipOf({t:'เชื่อมต่อระบบบัญชีข้อมูลจังหวัดไม่ได้',
      d:'แสดงตัวเลขชุดล่าสุดที่บันทึกไว้ในแดชบอร์ดไปก่อน '+(FISCAL_API.err||''),calc:'ระบบจะลองใหม่เมื่อเปิดหน้าอีกครั้ง · กดเพื่อดูสถานะรายชุด',src:'',when:''})}"><i></i>API ไม่ตอบสนอง · ใช้ข้อมูลสำรอง</a>`;
    if(FISCAL_API.state==='loading')return '<span class="gdcb map"><i></i>กำลังดึงจากระบบบัญชีข้อมูลจังหวัด…</span>';
  }
  const T={api:['api','ดึงจากระบบบัญชีข้อมูลจังหวัด (API)'],part:['part','ดึงจาก API บางส่วน'],
           map:['map','กำลังย้ายไปใช้ API'],file:['file','ใช้ไฟล์ข้อมูล']}[st];
  const n=GDC.byPage(page);
  return `<a class="gdcb ${T[0]}" href="apistatus.html${page?'#'+page:''}" data-tip2="${tipOf({t:'แหล่งข้อมูลของหน้านี้',
    d:st==='api'?'ตัวเลขดึงตรงจากระบบบัญชีข้อมูลจังหวัดหนองบัวลำภู หน่วยงานปรับปรุงที่นั่นแล้วแดชบอร์ดเปลี่ยนตาม'
      :st==='part'?'บางชุดดึงจาก API แล้ว บางชุดยังใช้ไฟล์ข้อมูลเดิม'
      :st==='map'?'ลงทะเบียนชุดข้อมูล '+n.length+' ชุดกับระบบบัญชีข้อมูลจังหวัดแล้ว กำลังจับคู่คอลัมน์ ระหว่างนี้ยังแสดงตัวเลขจากไฟล์เดิม'
      :'ยังไม่ได้ย้ายไปใช้ระบบบัญชีข้อมูลจังหวัด',
    calc:'กดเพื่อดูสถานะการเชื่อมต่อรายชุดข้อมูล',src:'',when:''})}"><i></i>${T[1]}</a>`;
}

/* ────────────────── ตัวช่วยอ่านแถวจาก API ──────────────────
   ชื่อคอลัมน์และค่าบางช่องมีช่องว่างหัวท้าย (เช่น " ค่าข้อมูล ") และตัวเลขมีจุลภาค จึงทำความสะอาดก่อนใช้ */
const TH_MONTH_FULL=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
function gdcRows(v){
  const rec=(v&&v.records||[]);
  if(rec.length){const ks=Object.keys(rec[0]).filter(k=>k!=='_id');
    if(ks.length===1&&ks[0].indexOf('\t')>=0){const H=ks[0].split('\t').map(x=>x.trim());
      return rec.map(r=>{const V=String(r[ks[0]]||'').split('\t');const o={};H.forEach((h,i)=>o[h]=(V[i]||'').trim());return o})}}
  return rec.map(r=>{const o={};Object.keys(r).forEach(k=>{if(k!=='_id')o[String(k).trim()]=typeof r[k]==='string'?r[k].trim():r[k]});return o});
}
function gdcNum(x){
  if(x==null)return null; if(typeof x==='number')return isFinite(x)?x:null;
  const t=String(x).replace(/[,\s]/g,''); if(t===''||t==='-')return null;
  const n=Number(t); return isFinite(n)?n:null;
}
const gdcMonth=t=>TH_MONTH_FULL.indexOf(String(t||'').trim())+1;
const gdcVal=r=>gdcNum(r['ค่าข้อมูล']!=null?r['ค่าข้อมูล']:(r['จำนวน']!=null?r['จำนวน']:r['ค่า']));
const gdcYear=r=>parseInt(String(r['ปีงบประมาณ']||r['ปี']||'').trim(),10)||null;

/* ══════════════ การคลัง · ประกอบข้อมูลจาก 9 ชุดของคลังจังหวัด ══════════════
   ผลลัพธ์มีโครงเดียวกับข้อมูลเดิมของหน้าการคลัง ทุกหน้าที่ใช้ D.fiscal จึงทำงานต่อได้ทันที
   ปีงบประมาณ เดือน และงวดที่เลือกได้ มาจากข้อมูลใน API ทั้งหมด เพิ่มปีหรือเดือนใหม่ในระบบบัญชีข้อมูลจังหวัด หน้าจะเพิ่มตามเอง */
GDC.FIS={alloc:'b0e1424c-409d-4200-be75-a6a026851bbd',dis:'07053215-af15-4271-9539-88d142a63dc8',
  use:'21962d43-ccb4-48e6-a760-c815212f271e',commit:'e68752b1-8f4b-4b28-92a6-0a78e849575a',
  demand:'e180a38e-e31f-4338-967e-91ebb42424c9',rank:'8206aee0-36e0-45de-b5cf-6bb850a6ae3c',
  cNet:'b58050df-6cd7-461e-be9b-f1108d6a152c',cDis:'3bafb802-ddb5-4534-a391-d399c91b3588',cLeft:'2fb4cd9f-efcf-4719-b35b-34a20c89ab67'};
GDC.fiscal=async function(fresh){
  const K=Object.keys(GDC.FIS), R={};
  await Promise.all(K.map(async k=>{try{R[k]=gdcRows(await GDC.all(GDC.FIS[k],{fresh}))}catch(e){R[k]=null;GDC.err=GDC.err||{};GDC.err[k]=e.message}}));
  if(!R.alloc||!R.dis)throw new Error('ดึงชุดข้อมูลหลักของการเบิกจ่ายไม่ได้');
  /* งวด = ปีงบประมาณ + เดือน เรียงตามปีงบ (ต.ค. เป็นเดือนแรก) */
  const pk=r=>{const y=gdcYear(r),m=gdcMonth(r['เดือน']);return (y&&m)?y+'-'+String(m).padStart(2,'0'):null};
  const P={};
  R.dis.forEach(r=>{const k=pk(r);if(k&&gdcVal(r)!=null){const y=gdcYear(r),m=gdcMonth(r['เดือน']);P[k]={fy:y,m,o:(m+2)%12,key:k}}});
  const periods=Object.values(P).sort((a,b)=>(a.fy-b.fy)||(a.o-b.o));
  const TY={'ภาพรวม':'ภาพรวม','ประจำ':'รายจ่ายประจำ','ลงทุน':'รายจ่ายลงทุน'};
  const pick=(rows,k,f)=>{if(!rows)return null;const r=rows.find(r=>pk(r)===k&&Object.keys(f).every(c=>String(r[c]||'').trim()===f[c]));return r?gdcVal(r):null};
  const noteOf=(rows,k)=>{const r=(rows||[]).find(r=>pk(r)===k&&/ข้อมูล ณ/.test(r['หมายเหตุ']||''));
    return r?String(r['หมายเหตุ']).replace(/ข้อมูล\s*ณ\s*(วันที่)?\s*/,'').trim():''};
  const build=p=>{
    const k=p.key, FN='งบส่วนราชการ(Function)', PV='งบจังหวัด';
    const row=(t,src,ข้อมูล)=>pick(src,k,{'ข้อมูล':ข้อมูล,'ประเภทข้อมูล':t});
    const fnDis=Object.keys(TY).map(t=>{const a=row(t,R.alloc,FN),v=row(t,R.dis,FN);
      return {k:TY[t],alloc:a,val:v,pct:a&&v!=null?+(v/a*100).toFixed(2):null,over:null,
        rank:pick(R.rank,k,{'ข้อมูล':'ระดับประเทศ','ประเภทข้อมูล':t}),
        rankR:pick(R.rank,k,{'ข้อมูล':'ระดับภาค','ประเภทข้อมูล':t}),rankZ:pick(R.rank,k,{'ข้อมูล':'ระดับเขต','ประเภทข้อมูล':t})}});
    const fnUse=Object.keys(TY).map(t=>{const a=row(t,R.alloc,FN),v=row(t,R.use,FN);
      return {k:TY[t],alloc:a,val:v,pct:a&&v!=null?+(v/a*100).toFixed(2):null,over:null,rank:null,
        commit:row(t,R.commit,FN),demand:row(t,R.demand,FN)}});
    const prov=Object.keys(TY).map(t=>{const a=row(t,R.alloc,PV),d=row(t,R.dis,PV),u=row(t,R.use,PV);
      return {k:TY[t],alloc:a,dis:d,dpct:a&&d!=null?+(d/a*100).toFixed(2):null,drank:null,
        use:u,upct:a&&u!=null?+(u/a*100).toFixed(2):null,urank:null,commit:row(t,R.commit,PV)}});
    const sh=(arr)=>{const c=arr[1].val||0,i=arr[2].val||0,t=c+i;return t?{cur:+(c/t*100).toFixed(2),inv:+(i/t*100).toFixed(2)}:{cur:null,inv:null}};
    const CI={'ข้อมูล':'เงินกันไว้เบิกเหลื่อมปีงบประมาณ พ.ศ. '+(p.fy-1)};
    const cv=(src,item)=>pick(src,k,Object.assign({'รายการข้อมูล':item},CI))??pick(src,k,{'รายการข้อมูล':item});
    const cA=cv(R.cNet,'เงินกันฯ ภาพรวม'), cD=cv(R.cDis,'เงินกันฯ ภาพรวม'), cL=cv(R.cLeft,'เงินกันฯ ภาพรวม');
    const parts=['ส่วนราชการ อบจ. เทศบาลตำบลและเทศบาลเมือง','องค์การบริหารส่วนตำบล'].map(n=>({n,alloc:cv(R.cNet,n),dis:cv(R.cDis,n),left:cv(R.cLeft,n)}));
    return {fn:{dis:fnDis,use:fnUse},mix:{dis:sh(fnDis),use:sh(fnUse)},prov,
      carry:{alloc:cA,dis:cD,left:cL,pct:cA&&cD!=null?+(cD/cA*100).toFixed(2):null,year:p.fy-1,parts},
      asof:noteOf(R.dis,k)||noteOf(R.alloc,k), fy:p.fy, m:p.m, key:k, src:'api'};
  };
  const all=periods.map(build);
  return {periods,all,latest:all[all.length-1],at:new Date().toISOString()};
};
/* โหลดข้อมูลการคลังจาก API แล้วแทนข้อมูลเดิมของหน้า · หน้าใดที่ใช้ D.fiscal จะวาดใหม่ด้วยตัวเลขจาก API */
const FISCAL_API={state:'idle',model:null,err:null};
function fiscalSync(after){
  if(FISCAL_API.state==='loading')return;
  FISCAL_API.state='loading';
  GDC.fiscal().then(M=>{
    if(!M.latest)throw new Error('ไม่พบงวดข้อมูลใน API');
    FISCAL_API.model=M; FISCAL_API.state='ok';
    D.fiscal=Object.assign({},D.fiscal,M.latest);
    if(after)after(M); else if(PAGE&&PAGE.render)try{PAGE.render()}catch(e){console.error(e)}
    try{gdcLive(PAGE.id)}catch(x){}
  }).catch(e=>{FISCAL_API.state='err';FISCAL_API.err=e.message;
    if(PAGE&&PAGE.render)try{PAGE.render()}catch(x){} try{gdcLive(PAGE.id)}catch(x){} });
}
/* แผนผังสำรอง (ตอนโหลดแผนที่ไม่ได้) กดเลือกอำเภอได้เหมือนแผนที่ */
document.addEventListener('click',e=>{const r=e.target.closest('[data-cho-amp]');if(r&&window.onChoPick)window.onChoPick(r.dataset.choAmp)});

/* ════════════════════════════════════════════════════════════════════
   ชั้นซิงก์ข้อมูลจากระบบบัญชีข้อมูลจังหวัด (ทุกหน้า)
   แต่ละชุด: res = รหัส resource · build = แปลงแถวจาก API เป็นโครงข้อมูลเดิมของหน้า · apply = แทนที่ข้อมูลเดิม
   หน้าไหนใช้ชุดไหน ดูที่ pages · ถ้าดึงไม่ได้ หน้ายังใช้ข้อมูลเดิมพร้อมบันทึกสถานะไว้
   ════════════════════════════════════════════════════════════════════ */
const gq=r=>{const y=gdcYear(r);const m=String(r['ช่วงเวลา']||r['ไตรมาส']||'').match(/(\d)/);return (y&&m)?{q:y+'-Q'+m[1],y,n:+m[1]}:null};
const qKey=x=>x.y*10+x.n;
GDC.amp=x=>{const a=String(x||'').replace(/^อำเภอ/,'').trim();return a==='เมือง'?'เมืองหนองบัวลำภู':a};
GDC.SYNC={
  house:{pages:['household'],agency:'nso',
    res:{main:'c0a430d9-63a9-4cc9-be0b-bf43fd49e2d9',debt:'a8d80120-4838-414f-bdbd-ec8667e2016e',gini:'909b635e-c6e1-4fcb-b89b-aedb9c04d621',
         expense:'4fac937e-84c4-4b98-b92d-1c83e459add8',income_src:'ba544923-8995-4a2e-a7ab-35977f07975d',poverty:'aa2c77c6-3d19-4ae3-a1b1-9605c14aa751'},
    build(R){const o={};
      if(R.main)o.main=R.main.map(r=>({y:gdcYear(r),k:r['ประเภท'],v:gdcVal(r),u:r['หน่วย']||'บาท'})).filter(r=>r.y&&r.v!=null);
      if(R.debt)o.debt=R.debt.map(r=>({y:gdcYear(r),k:r['ประเภทหนี้'],v:gdcVal(r)})).filter(r=>r.y&&r.v!=null);
      if(R.gini)o.gini=R.gini.map(r=>{const b=String(r['ขอบเขตจำกัดชั้นรายได้']||'');
        /* สำรวจปีเว้นปี แต่ละรอบมี 2 แถว (แบ่ง 5 และ 10 กลุ่ม) · ปี 2464 ในระบบคือ 2564 ที่พิมพ์ผิดหลักร้อย จึงแก้ให้ */
        let y=gdcYear(r);if(y&&y<2500&&y+100>2500){o._qa=o._qa||[];o._qa.push('Gini: ปี '+y+' ในระบบบัญชีข้อมูลน่าจะเป็น '+(y+100)+' (พิมพ์ผิด) แดชบอร์ดใช้เป็น '+(y+100)+' ให้');y+=100}
        return {y,k:r['รายการข้อมูล'],g:/10\s*กลุ่ม/.test(b)?10:/5\s*กลุ่ม/.test(b)?5:null,v:gdcVal(r)}}).filter(r=>r.y&&r.v!=null);
      if(R.expense)o.expense=R.expense.map(r=>({y:gdcYear(r),size:r['ขนาดครัวเรือน'],k:r['รายการ'],v:gdcNum(r['ค่าของข้อมูล'])})).filter(r=>r.y&&r.v!=null);
      if(R.income_src)o.income_src=R.income_src.map(r=>({y:gdcYear(r),k:r['แหล่งรายได้'],item:r['รายการ'],v:gdcVal(r)})).filter(r=>r.y&&r.v!=null);
      if(R.poverty)o.poverty=R.poverty.map(r=>({y:gdcYear(r),k:r['รายการข้อมูล'],t:r['ประเภท'],v:gdcVal(r),u:r['หน่วย']})).filter(r=>r.y&&r.v!=null);
      return o},
    apply(o){if(typeof DX!=='undefined'&&DX.house)Object.keys(o).forEach(k=>{if(o[k]&&o[k].length)DX.house[k]=o[k]})}},
  labor:{pages:['labor'],agency:'nso',
    res:{status:'cf364469-3e3f-4457-aee0-87bdbb0870a0',ind:'501555c3-cd78-43ef-adc9-0713dcb38b9d',
         wst:'37398ad3-6536-47ed-82ab-2e4883927542',under:'af4f22e7-74e4-41a8-bf45-4034514446d8',
         rate:'9d89b6d3-d47f-466f-8fb6-ee9138dedacb',s33:'a392e50d-2b4c-4367-97eb-2591d04ca6dc',s39:'4e729f3a-6676-470c-ab7f-6465bf538a38',
         s40:'ae943535-c621-420c-beb0-fe1b5af287dd'},
    build(R){const o={_qa:[]};
      if(R.status){const Q={};
        R.status.filter(r=>String(r['เพศ']).trim()==='รวม').forEach(r=>{const q=gq(r),v=gdcVal(r);if(!q||v==null)return;
          const k=String(r['สถานภาพแรงงาน']).trim(),x=Q[q.q]=Q[q.q]||Object.assign({},q);
          ({'ประชากรอายุ 15 ปีขึ้นไป':'pop15','กำลังแรงงานรวม':'force','ผู้มีงานทำ':'emp','ผู้ว่างงาน':'ue','ผู้ไม่อยู่ในกำลังแรงงาน':'notin'}[k]&&(x[{'ประชากรอายุ 15 ปีขึ้นไป':'pop15','กำลังแรงงานรวม':'force','ผู้มีงานทำ':'emp','ผู้ว่างงาน':'ue','ผู้ไม่อยู่ในกำลังแรงงาน':'notin'}[k]]=v))});
        const ALLQ=Object.values(Q).filter(x=>x.force&&x.emp&&x.pop15).sort((a,b)=>qKey(a)-qKey(b));
        const L=ALLQ.slice(-12);
        /* อัตราการว่างงานทางการรายไตรมาส (ชุดอัตราการว่างงาน แถว "อัตราการว่างงานรวม") · ไตรมาสที่ไม่มี ใช้ผู้ว่างงาน ÷ กำลังแรงงาน */
        const RT={};(R.rate||[]).filter(r=>/อัตราการว่างงานรวม/.test(String(r['รายการ'])+String(r['เพศ']))).forEach(r=>{const q=gq(r),v=gdcVal(r);if(q&&v!=null)RT[q.q]=v});
        const rq=x=>RT[x.q]!=null?RT[x.q]:(x.ue!=null?x.ue/x.force*100:null);
        /* อัตราการว่างงานรายปี = ค่าเฉลี่ยของอัตรารายไตรมาส · ใช้เฉพาะปีที่มีข้อมูลครบ 4 ไตรมาส */
        const YA={};ALLQ.forEach(x=>{const a=YA[x.y]=YA[x.y]||{q:0,r:[]};a.q++;const v=rq(x);if(v!=null)a.r.push(v)});
        const ann=Object.keys(YA).map(Number).sort((a,b)=>a-b).filter(y=>YA[y].q>=4&&YA[y].r.length)
          .map(y=>[y,+(YA[y].r.reduce((a,b)=>a+b,0)/YA[y].r.length).toFixed(1),YA[y].r.length]).slice(-6);
        if(ann.length)o.annual=ann;
        /* ผู้ว่างงานบางไตรมาสเป็น n.a. (ตัวอย่างน้อยเกินประมาณค่าได้) · เก็บเป็นค่าว่าง ไม่แทนด้วยศูนย์ */
        L.forEach(x=>{x.ue=x.ue==null?null:x.ue;x.ur=rq(x)==null?null:+rq(x).toFixed(2);x.lfpr=+(x.force/x.pop15*100).toFixed(1);x.notin=x.notin||(x.pop15-x.force)});
        L.filter(x=>x.ue==null).forEach(x=>o._qa.push('ผู้ว่างงาน ไตรมาส '+x.n+'/'+x.y+' เป็น n.a. ในระบบบัญชีข้อมูล (ไม่มีค่าประมาณ) จึงแสดงเป็นค่าว่าง'));
        if(L.length){o.quarters=L;const t=L[L.length-1];o.latest='ไตรมาส '+t.n+'/'+t.y;
          const na=L.filter(x=>x.ue==null);
          o.note=na.length?'ไตรมาส '+na.map(x=>x.n+'/'+x.y).join(', ')+' ระบบบัญชีข้อมูลรายงานจำนวนผู้ว่างงานเป็น n.a. (กลุ่มตัวอย่างน้อยเกินกว่าจะประมาณค่าได้) จึงเว้นว่างไว้ มิได้หมายความว่าไม่มีผู้ว่างงาน'
            :'ข้อมูลจากการสำรวจภาวะการทำงานของประชากร ผ่านระบบบัญชีข้อมูลจังหวัด'}}
      const sumBy=(rows,key)=>{const Q={};rows.forEach(r=>{const q=gq(r),v=gdcVal(r);if(!q)return;const x=Q[q.q]=Q[q.q]||{q:q.q,y:q.y,n:q.n,m:{}};
        const k=String(r[key]).trim();if(v!=null)x.m[k]=(x.m[k]||0)+v});return Object.values(Q).sort((a,b)=>qKey(a)-qKey(b))};
      /* ตรวจความสอดคล้อง: ยอดรวมชาย+หญิงต้องใกล้กับผู้มีงานทำของไตรมาสเดียวกัน (คลาดได้ไม่เกิน 3%)
         ไตรมาสที่ไม่ผ่านจะไม่ใช้ และบันทึกไว้ให้หน่วยงานตรวจแก้ในระบบบัญชีข้อมูล */
      const EMP={};(o.quarters||[]).forEach(x=>EMP[x.q]=x.emp);
      const okQ=(x,name)=>{const e=EMP[x.q];if(!e)return true;const d=Math.abs(x.m['รวมยอด']-e)/e;
        if(d>0.03){o._qa.push(name+' ไตรมาส '+x.n+'/'+x.y+': ยอดรวมชาย+หญิง '+f_num(x.m['รวมยอด'])+' แต่ผู้มีงานทำ '+f_num(e)+' (ต่าง '+(d*100).toFixed(0)+'%) จึงไม่นำมาใช้');return false}return true};
      if(R.ind){const L=sumBy(R.ind,'อุตสาหกรรม').filter(x=>x.m['รวมยอด']>0&&x.m['ภาคเกษตรกรรม']>0&&okQ(x,'ผู้มีงานทำตามกิจกรรมทางเศรษฐกิจ'));const t=L[L.length-1];
        if(t){const tot=t.m['รวมยอด'],skip=['รวมยอด','ภาคเกษตรกรรม','นอกภาคเกษตรกรรม','ไม่ทราบ'];
          o.secQ=t.q;o.secTotal=tot;o.agri=t.m['ภาคเกษตรกรรม'];o.nonagri=t.m['นอกภาคเกษตรกรรม']||(tot-o.agri);
          o.sectors=Object.keys(t.m).filter(k=>skip.indexOf(k)<0&&t.m[k]>0).sort((a,b)=>t.m[b]-t.m[a]).slice(0,9).map(k=>[k,+(t.m[k]/tot*100).toFixed(1),t.m[k]])}}
      if(R.wst){const L=sumBy(R.wst,'สถานภาพการทำงาน').filter(x=>x.m['รวมยอด']>0&&okQ(x,'ผู้มีงานทำตามสถานภาพการทำงาน'));const t=L[L.length-1];
        if(t){const tot=t.m['รวมยอด'];o.statusQ=t.q;
          o.status=Object.keys(t.m).filter(k=>k!=='รวมยอด'&&t.m[k]>0).sort((a,b)=>t.m[b]-t.m[a]).map(k=>[k,+(t.m[k]/tot*100).toFixed(1),t.m[k]])}}
      /* ผู้ประกันตนในระบบประกันสังคม มาตรา 33 / 39 / 40 รายปี */
      {const S={};[['s33','m33'],['s39','m39'],['s40','m40']].forEach(([k,f])=>(R[k]||[]).forEach(r=>{const y=gdcYear(r),v=gdcVal(r);if(y&&v!=null)(S[y]=S[y]||{y})[f]=v}));
        const L=Object.values(S).sort((a,b)=>a.y-b.y);if(L.length)o.sso=L}
      if(R.under){o.under=R.under.map(r=>{const q=gq(r);return q?{q:q.q,v:gdcVal(r),_k:qKey(q)}:null}).filter(x=>x&&x.v!=null).sort((a,b)=>a._k-b._k).map(x=>({q:x.q,v:x.v}))}
      return o},
    apply(o){if(typeof D!=='undefined'&&D.labor)Object.keys(o).forEach(k=>{if(o[k]!=null&&(!Array.isArray(o[k])||o[k].length))D.labor[k]=o[k]})}},
  otop:{pages:['otop'],agency:'cdd',
    res:{rev:'90309f56-8577-44ab-b694-804bf492c3c5',mon:'b11c718d-fa12-4d60-aa83-37d56fbf4cef',prod:'c10f01ae-3cdc-4de4-a8b0-39f8438044ab',
         star:'9ca59463-14ab-4247-9602-cc0c06a5ed46',shop:'4a431891-9e4e-49df-a4a0-eaaeff41b7bf',vich:'ccdf24ab-2807-4560-84f2-2ced40827cff',
         ent:'700584d7-29bc-4749-82ee-dba82098ca0d'},
    build(R){const o={},amp=x=>{const a=String(x||'').replace(/^อำเภอ/,'').trim();return a==='เมือง'?'เมืองหนองบัวลำภู':a};
      const last=(rows,col)=>{const ys=rows.map(gdcYear).filter(Boolean);if(!ys.length)return null;const y=Math.max(...ys);const m={};
        rows.filter(r=>gdcYear(r)===y).forEach(r=>{const a=amp(r['อำเภอ']),v=gdcNum(r[col]);if(a&&v!=null)m[a]=(m[a]||0)+v});return {y,m}};
      if(R.rev){const Y={};R.rev.forEach(r=>{const y=gdcYear(r),a=amp(r['อำเภอ']),v=gdcVal(r);if(y&&a&&v!=null)(Y[y]=Y[y]||{})[a]=(Y[y][a]||0)+v});if(Object.keys(Y).length)o.revByYear=Y}
      if(R.mon){const M={};R.mon.forEach(r=>{const fy=gdcYear(r),i=parseInt(r['ลำดับตามปีงบประมาณ'],10),v=gdcVal(r);if(!fy||!i||v==null)return;
          const k=fy*100+i;(M[k]=M[k]||{fy,i,label:String(r['ช่วงเวลา']||'').trim(),v:0}).v+=v});
        const L=Object.keys(M).map(Number).sort((a,b)=>a-b).map(k=>M[k]);if(L.length)o.revMonthly=L}
      if(R.prod){const ys=R.prod.map(gdcYear).filter(Boolean);if(ys.length){const y=Math.max(...ys),T={},A={};
        R.prod.filter(r=>gdcYear(r)===y).forEach(r=>{const v=gdcNum(r['ปริมาณ']);if(v==null)return;const t=String(r['ประเภทผลิตภัณฑ์']||'').trim(),a=amp(r['อำเภอ']);
          T[t]=(T[t]||0)+v;A[a]=(A[a]||0)+v});o.prodYear=y;o.prodByType=T;o.prodByAmp=A}}
      if(R.star){const x=last(R.star,'ค่าข้อมูล');if(x){o.star5Year=x.y;o.star5=x.m}}
      if(R.shop){const x=last(R.shop,'ค่าข้อมูล');if(x){o.shopYear=x.y;o.shops=x.m}}
      if(R.vich){const x=last(R.vich,'ค่าข้อมูล');if(x)o.vichalai=x.m}
      /* รายชื่อผู้ประกอบการถูกลงซ้ำทุกปี จึงนับเฉพาะปีล่าสุด ไม่รวมทุกปี (รวมทุกปีจะนับคนเดิมซ้ำราว 4 เท่า) */
      if(R.ent){const ys=R.ent.map(gdcYear).filter(Boolean);if(ys.length){const y=Math.max(...ys),L=R.ent.filter(r=>gdcYear(r)===y),A={},T={};
        L.forEach(r=>{const a=amp(r['อำเภอ']),t=String(r['ลักษณะผู้ประกอบการ']||'').trim();if(a)A[a]=(A[a]||0)+1;if(t)T[t]=(T[t]||0)+1});
        o.entYear=y;o.entTotal=L.length;o.entByAmp=A;o.entByType=T}}
      return o},
    apply(o){if(typeof DX!=='undefined'&&DX.otop)Object.keys(o).forEach(k=>{if(o[k]!=null)DX.otop[k]=o[k]})}},
  /* ท่องเที่ยว · แทนตารางเดิมที่นำเข้าเป็นไฟล์ ด้วยชุดเดียวกันจาก API
     ที่ยังไม่มีใน API: ผู้เยี่ยมเยือนและอัตราการเข้าพักรายเดือน, พิกัดแหล่งท่องเที่ยวที่จัดประเภทแล้ว → ใช้ข้อมูลเดิม */
  tour:{pages:['tourism'],agency:'mots',
    res:{rev:'170f017c-126e-4432-a58f-20f4bef30f78',internal:'5e65986f-ebe0-44e9-adf7-215ce4e90dad',spend:'b689c7e2-2b65-4177-8434-3aac0fca590f',
         spot:'5213acd6-1913-4cc7-9807-1caa20855cd5',occ:'eff8b887-c008-4586-824a-159630d7fbce',acc:'03463b5e-c71f-41e8-80d5-bf7794def331',
         vis:'42694bb9-6870-4d50-bbae-27859db9d06c',spots:'e379647a-653f-467c-9d93-f3f0d2df85b1',occm:'ce3fd380-daef-4e3e-b6ef-eca62e45c137',
         visy:'051f08e3-265d-4399-9e96-01f4daf8eb02',spotList:'f6d19f7c-82ed-4ff5-adb3-eeafa859161f'},
    build(R){const o={},amp=GDC.amp,tx=(r,k)=>String(r[k]==null?'':r[k]).trim();
      const monthly=rows=>rows.map(r=>({fy:gdcYear(r),i:parseInt(r['ลำดับตามปีงบประมาณ'],10),label:tx(r,'ช่วงเวลา'),v:gdcVal(r)})).filter(x=>x.fy&&x.i&&x.v!=null).sort((a,b)=>a.fy-b.fy||a.i-b.i);
      if(R.rev){const L=monthly(R.rev);if(L.length)o.revenue=L}
      if(R.vis){const L=monthly(R.vis);if(L.length)o.visitor=L}
      if(R.occm){const L=monthly(R.occm);if(L.length)o.occ=L}
      /* ผู้เยี่ยมเยือนรายปี (นักท่องเที่ยว + นักทัศนาจร) ย้อนหลังได้ไกลกว่าชุดแยกไทย/ต่างชาติ */
      if(R.visy){const Y={};R.visy.forEach(r=>{const y=gdcYear(r),v=gdcVal(r),k=tx(r,'ประเภท');if(y&&v!=null)(Y[y]=Y[y]||{})[k]=(Y[y][k]||0)+v});if(Object.keys(Y).length)o.visitorYear=Y}
      /* รายชื่อและพิกัดแหล่งท่องเที่ยว (พิกัดแบบองศา-ลิปดา-ฟิลิปดา หรือทศนิยม) · ชุดนี้ไม่มีประเภทแหล่ง ประเภทใช้ตามที่แดชบอร์ดจัดไว้โดยเทียบชื่อ */
      if(R.spots){const dms=v=>{const t=String(v||'');const m=t.match(/(\d+(?:\.\d+)?)\s*°\s*(\d+(?:\.\d+)?)?\s*'?\s*(\d+(?:\.\d+)?)?\s*"?\s*[NS]?[\s,]+(\d+(?:\.\d+)?)\s*°\s*(\d+(?:\.\d+)?)?\s*'?\s*(\d+(?:\.\d+)?)?/i);
          const c=(d,mi,se)=>+d+(+mi||0)/60+(+se||0)/3600; if(m)return [c(m[1],m[2],m[3]),c(m[4],m[5],m[6])];
          const n=t.match(/(\d+\.\d+)\s*,\s*(\d+\.\d+)/);return n?[+n[1],+n[2]]:null};
        const seen={},L=[],skip=[];
        R.spots.slice().sort((a,b)=>(gdcYear(b)||0)-(gdcYear(a)||0)).forEach(r=>{const n=tx(r,'ชื่อแหล่งท่องเที่ยว');if(!n||seen[n])return;seen[n]=1;const c=dms(r['หน่วยพิกัด']);
          if(!c||c[0]<15||c[0]>19||c[1]<100||c[1]>104){skip.push(n);return}
          L.push({n,a:amp(r['อำเภอ']),ta:tx(r,'ตำบล'),lat:+c[0].toFixed(6),lng:+c[1].toFixed(6),t:'',img:'',y:gdcYear(r)})});
        if(L.length)o.spots=L.reverse();
        /* ตรวจทานกับชุดรายชื่อแหล่งท่องเที่ยว: ชื่อที่มีในรายชื่อแต่ไม่มีพิกัด แจ้งไว้ในคุณภาพข้อมูล */
        if(R.spotList){const nz=t=>String(t||'').replace(/\s+/g,'');const H=new Set(R.spots.map(r=>nz(r['ชื่อแหล่งท่องเที่ยว'])));
          const miss=R.spotList.map(r=>tx(r,'ชื่อแหล่งท่องเที่ยว')).filter(n=>n&&!H.has(nz(n)));
          if(miss.length)(o._qa=o._qa||[]).push('มีในรายชื่อแหล่งท่องเที่ยว แต่ไม่มีในชุดพิกัด: '+miss.join(', '))}
        if(skip.length)(o._qa=o._qa||[]).push('แหล่งท่องเที่ยวไม่มีพิกัดที่ใช้ได้ จึงไม่แสดงบนแผนที่: '+skip.join(', '))}
      if(R.internal){const L=R.internal.map(r=>({y:gdcYear(r),item:tx(r,'รายการข้อมูล'),kind:tx(r,'ประเภทข้อมูล'),who:tx(r,'นักท่องเที่ยว'),v:gdcVal(r),u:tx(r,'หน่วย')})).filter(x=>x.y&&x.v!=null);if(L.length)o.internal=L}
      if(R.spend){const L=R.spend.map(r=>({y:gdcYear(r),who:tx(r,'นักท่องเที่ยว'),kind:tx(r,'ประเภทข้อมูล'),v:gdcVal(r)})).filter(x=>x.y&&x.v!=null);if(L.length)o.spend=L}
      if(R.spot){const ys=R.spot.map(gdcYear).filter(Boolean);if(ys.length){const y=Math.max(...ys),T={},A={};
        R.spot.filter(r=>gdcYear(r)===y).forEach(r=>{const v=gdcVal(r);if(v==null)return;const t=tx(r,'ประเภท'),a=amp(r['อำเภอ']);T[t]=(T[t]||0)+v;A[a]=(A[a]||0)+v});
        o.spotYear=y;o.spotByType=T;o.spotByAmp=A}}
      if(R.occ){const L=R.occ.map(r=>({y:gdcYear(r),v:gdcVal(r)})).filter(x=>x.y&&x.v!=null).sort((a,b)=>b.y-a.y);if(L.length)o.occYear=L}
      if(R.acc){const ys=R.acc.map(gdcYear).filter(Boolean);if(ys.length){const y=Math.max(...ys),L=R.acc.filter(r=>gdcYear(r)===y),A={};let rooms=0;
        L.forEach(r=>{const a=amp(r['อำเภอ']),n=gdcNum(r['จำนวนห้องพัก'])||0;(A[a]=A[a]||{n:0,rooms:0}).n++;A[a].rooms+=n;rooms+=n});
        o.accYear=y;o.accTotal=L.length;o.accRooms=rooms;o.accByAmp=A}}
      return o},
    apply(o){if(typeof DX==='undefined'||!DX.tour)return;
      if(o.spots){const T={};(DX.tour.spots||[]).forEach(s=>{if(s.t)T[s.n]=s.t;if(s.img)T[s.n+'|img']=s.img});o.spots.forEach(s=>{s.t=T[s.n]||'';s.img=T[s.n+'|img']||''})}
      Object.keys(o).forEach(k=>{if(o[k]!=null)DX.tour[k]=o[k]})}},
  /* อุตสาหกรรม · สถานประกอบการรายอำเภอ และรายได้ภาคอุตสาหกรรม (GPP) จาก API
     เงินทุน คนงาน ประเภทอุตสาหกรรม และเหมืองแร่ ยังไม่มีใน API ใช้ไฟล์รายงานสถิติของสำนักงานอุตสาหกรรมจังหวัด (ในหน้า industry.html) */
  ind:{pages:['industry'],agency:'ind',
    res:{est:'f913c7e3-1b77-4239-9daf-29d8e23e01bc',gpp:'a0ea6508-d3f2-4b6b-9a49-60c6a3acb059'},
    build(R){const o={};
      if(R.est){const E={};R.est.forEach(r=>{const y=gdcYear(r),a=GDC.amp(r['อำเภอ']);if(!y||!a)return;const v=gdcNum(r['จำนวน']);(E[y]=E[y]||{})[a]=v==null?0:v});if(Object.keys(E).length)o.est=E}
      if(R.gpp){const G=R.gpp.map(r=>{const t=String(r['ปี']).trim();return {y:parseInt(t,10),st:/p/i.test(t)?'p':/r/i.test(t)?'r':'',v:gdcNum(r['ค่าของข้อมูล']??r['ค่าข้อมูล'])}}).filter(x=>x.y&&x.v!=null).sort((a,b)=>a.y-b.y);if(G.length)o.gpp=G}
      return o},
    apply(o){window.IND_API=Object.assign(window.IND_API||{},o)}},
  /* ประชากร · แทนตารางเดิมที่นำเข้าเป็นไฟล์ (ปิรามิดรายอายุของกรมการปกครองยังเป็นไฟล์) */
  pop:{pages:['population'],agency:'dopa',
    res:{pop:'03b88975-36e5-46e1-b0fa-0456f0a37193',age:'c6b78bad-346b-4250-b4f5-3a1b424bece6',growth:'7d183fa3-e333-48aa-ae9f-f9fd13746a80',
         birth:'b1d4dba9-98ce-4c6a-ad70-88e045eb16af',death:'7fde384d-d5cf-4300-b9cc-d578dd80d723',move:'2a80f2c7-5397-4dc7-91ee-cc449106e9d0',
         house:'d8eed6d0-1528-491b-8f95-5f0de887fd69',pyr:'47bf6256-547c-4e2a-81a8-ffaa55f48a3d'},
    build(R){const o={},amp=GDC.amp,tx=(r,k)=>String(r[k]==null?'':r[k]).trim(),notA=a=>!a||/เขตเทศบาล|รวม|ทั้งจังหวัด/.test(a);
      const last=rows=>{const ys=rows.map(gdcYear).filter(Boolean);return ys.length?Math.max(...ys):null};
      const byYear=rows=>{const m={};rows.forEach(r=>{const y=gdcYear(r),v=gdcVal(r);if(y&&v!=null)m[y]=(m[y]||0)+v});return m};
      if(R.pop){const y=last(R.pop);if(y){const A={};R.pop.filter(r=>gdcYear(r)===y).forEach(r=>{const a=amp(r['อำเภอ']),g=tx(r,'เพศ'),v=gdcVal(r);if(!notA(a)&&v!=null&&/^(ชาย|หญิง)$/.test(g))(A[a]=A[a]||{})[g]=v});
        o.popYear=y;o.popByAmpSex=A;o.popSeries=byYear(R.pop.filter(r=>/^(ชาย|หญิง)$/.test(tx(r,'เพศ'))&&!notA(amp(r['อำเภอ']))))}}
      /* กลุ่มอายุ: รวมเฉพาะแถวอำเภอ (แถวในเขต/นอกเขตเทศบาลเป็นการแบ่งซ้ำของยอดเดียวกัน) */
      if(R.age){const y=last(R.age);if(y){const B={};R.age.filter(r=>gdcYear(r)===y&&!notA(amp(r['อำเภอ']))).forEach(r=>{const v=gdcNum(r['จำนวน']);if(v!=null)B[tx(r,'กลุ่มอายุ')]=(B[tx(r,'กลุ่มอายุ')]||0)+v});o.ageYear=y;o.ageBands=B}}
      if(R.growth){const L=R.growth.map(r=>({y:gdcYear(r),a:amp(r['อำเภอ']),v:gdcVal(r)})).filter(r=>r.y&&r.v!=null);if(L.length)o.growth=L}
      if(R.birth){const m=byYear(R.birth);if(Object.keys(m).length)o.birth=m}
      if(R.death){const m=byYear(R.death);if(Object.keys(m).length)o.death=m}
      if(R.move){const m={};R.move.forEach(r=>{const y=gdcYear(r),t=tx(r,'ประเภท'),v=gdcVal(r);if(y&&t&&v!=null)(m[y]=m[y]||{})[t]=(m[y][t]||0)+v});if(Object.keys(m).length)o.move=m}
      /* ปิรามิดประชากร: รายอายุปีต่อปี → ช่วง 5 ปี 17 ช่วง · ยอดอำเภอ = แถวอำเภอ (นอกเขตเทศบาล) + เทศบาลในอำเภอ · PROV = รวม 6 อำเภอ */
      const Z=()=>new Array(17).fill(0);
      if(R.pyr){const band=t=>{if(/น้อยกว่า 1/.test(t))return 0;if(/มากกว่า 100/.test(t))return 16;const m=t.match(/(\d+)/);return m?Math.min(16,Math.floor(+m[1]/5)):-1};
        const nat={ALL:{},TH:{},NT:{}},nz={ALL:{},TH:{},NT:{}};
        R.pyr.forEach(r=>{const age=tx(r,'อายุ');if(/ยอดรวม/.test(age))return;const b=band(age);if(b<0)return;
          const y=String(gdcYear(r)),A0=amp(r['อำเภอ']),isIn=/เทศบาล/.test(tx(r,'พื้นที่')),nk=/ไม่ได้/.test(tx(r,'สัญชาติ'))?'NT':'TH',m=gdcNum(r['ชาย'])||0,f=gdcNum(r['หญิง'])||0;
          if(y==='null'||!A0)return;
          [nk,'ALL'].forEach(K=>[A0,'PROV'].forEach(A=>{const s=((nat[K][y]=nat[K][y]||{})[A]=nat[K][y][A]||{'ชาย':Z(),'หญิง':Z()});s['ชาย'][b]+=m;s['หญิง'][b]+=f;
            const z=((nz[K][y]=nz[K][y]||{})[A]=nz[K][y][A]||{in:Z(),out:Z()});z[isIn?'in':'out'][b]+=m+f}))});
        if(Object.keys(nat.ALL).length){o._pyrNat=nat;o._pyrNatZone=nz}}
      /* ปิรามิดในเขต/นอกเขตเทศบาล และรายอำเภอ จากชุดกลุ่มอายุ */
      if(R.age){const BANDS=(typeof DX_PYR!=='undefined'&&DX_PYR.bands)||[...new Set(R.age.map(r=>tx(r,'กลุ่มอายุ')))];const zone={},ap={};
        R.age.forEach(r=>{const y=String(gdcYear(r)),a=amp(r['อำเภอ']),bi=BANDS.indexOf(tx(r,'กลุ่มอายุ')),v=gdcNum(r['จำนวน']);if(bi<0||v==null||y==='null')return;
          if(/ในเขตเทศบาล/.test(a))(zone[y]=zone[y]||{in:Z(),out:Z()}).in[bi]+=v;else if(/นอกเขตเทศบาล/.test(a))(zone[y]=zone[y]||{in:Z(),out:Z()}).out[bi]+=v;else ((ap[y]=ap[y]||{})[a]=ap[y][a]||Z())[bi]+=v});
        if(Object.keys(zone).length){o._pyrZone=zone;o._pyrAmp=ap}}
      if(R.house){const y=last(R.house);if(y){const A={};R.house.filter(r=>gdcYear(r)===y).forEach(r=>{const a=amp(r['อำเภอ']),v=gdcVal(r);if(!notA(a)&&v!=null)A[a]=(A[a]||0)+v});o.houseYear=y;o.houses=A}}
      return o},
    apply(o){
      if(typeof DX_PYR!=='undefined'){
        if(o._pyrNat){DX_PYR.nat=o._pyrNat;DX_PYR.natZone=o._pyrNatZone;DX_PYR.sex=o._pyrNat.ALL;
          try{if(typeof pyrRowsFromNat==='function'&&typeof DX!=='undefined')DX.pyr=pyrRowsFromNat()}catch(e){}}
        if(o._pyrZone){DX_PYR.zone=o._pyrZone;DX_PYR.amp=o._pyrAmp;DX_PYR.years=Object.keys(o._pyrZone).map(Number).sort((a,b)=>a-b)}}
      ['_pyrNat','_pyrNatZone','_pyrZone','_pyrAmp'].forEach(k=>delete o[k]);
      if(typeof DX!=='undefined'&&DX.pop)Object.keys(o).forEach(k=>{if(o[k]!=null)DX.pop[k]=o[k]})}}
};
const SYNC_STATE={};          /* สถานะรายชุดของหน้านี้ · ใช้ติดป้ายและหน้าสถานะ */
/* ป้ายสถานะ API ที่หัวหน้า (เหมือนหน้าการคลัง) · วาดใหม่ทุกครั้งที่หน้า render เพื่อไม่ให้หาย */
function gdcSyncBadge(pageId){
  try{gdcLive(pageId)}catch(e){}
  const st=Object.values(SYNC_STATE); if(!st.length)return;
  let gs=document.getElementById('gdcPageBadge');
  if(!gs||!document.body.contains(gs)){const r=document.querySelector('.view.on .ph .r, .ph .r'); if(!r)return; gs=document.createElement('span');gs.id='gdcPageBadge';r.appendChild(gs)}
  gs.innerHTML=st.some(x=>x.state==='loading')?'<span class="gdcb map"><i></i>กำลังดึงจากระบบบัญชีข้อมูลจังหวัด…</span>'
    :st.every(x=>x.state==='err')?'<a class="gdcb file" href="apistatus.html#'+pageId+'"><i></i>API ไม่ตอบสนอง · ใช้ข้อมูลสำรอง</a>'
    :(function(){const S=srcInventory().filter(x=>x.page===pageId&&x.type!=='avail'),a=S.filter(x=>x.type==='api').length;
       return a<S.length?'<a class="gdcb part" href="apistatus.html#'+pageId+'"><i></i>ดึงจาก API บางส่วน · '+a+'/'+S.length+' ชุด</a>'
         :'<a class="gdcb api" href="apistatus.html#'+pageId+'"><i></i>ดึงจากระบบบัญชีข้อมูลจังหวัด (API)</a>'})();
}
function gdcSyncPage(pageId){
  const jobs=Object.keys(GDC.SYNC).filter(k=>GDC.SYNC[k].pages.indexOf(pageId)>=0);
  if(!jobs.length)return;
  jobs.forEach(j=>{
    const S=GDC.SYNC[j]; SYNC_STATE[j]={state:'loading'};
    const R={},keys=Object.keys(S.res);
    Promise.all(keys.map(k=>GDC.all(S.res[k]).then(v=>{R[k]=gdcRows(v)}).catch(e=>{R[k]=null;(SYNC_STATE[j].err=SYNC_STATE[j].err||{})[k]=e.message})))
      .then(()=>{
        try{const o=S.build(R); SYNC_STATE[j].qa=o._qa||[]; delete o._qa; S.apply(o); SYNC_STATE[j].state=keys.every(k=>R[k])?'ok':(keys.some(k=>R[k])?'part':'err');
          try{localStorage.setItem('gdc-qa-'+j,JSON.stringify({at:Date.now(),qa:SYNC_STATE[j].qa}))}catch(e){}}
        catch(e){SYNC_STATE[j].state='err';console.error('sync '+j,e)}
        if(SYNC_STATE[j].state!=='err')safeRender();
        gdcSyncBadge(pageId);
      });
  });
  gdcSyncBadge(pageId);
}

/* ════════════ จุดไฟ "ข้อมูลสด" บนการ์ดที่ตัวเลขมาจาก API + แถบเรืองระหว่างรอข้อมูล ════════════
   แต่ละหน้า: รหัสกราฟหรือกล่อง → ชุดข้อมูลที่ใช้ (job.key) · จุดขึ้นเฉพาะเมื่อดึงชุดนั้นได้จริง */
const LIVE_MAP={
  labor:{cUe:['labor.status'],cAnn:['labor.status'],cForce:['labor.status'],cSec:['labor.ind'],cStatus:['labor.wst'],cUnder:['labor.under'],cSso:['labor.s33','labor.s39','labor.s40']},
  otop:{cRev:['otop.rev'],cMon:['otop.mon'],cType:['otop.prod'],cCap:['otop.star','otop.shop','otop.vich'],cCmp:['otop.rev','otop.prod','otop.star']},
  tourism:{cTrend:['tour.internal','tour.visy'],cMix:['tour.internal'],cSpend:['tour.spend'],cOcc:['tour.occ'],cMon:['tour.vis','tour.occm'],cYoY:['tour.vis','tour.rev','tour.occm'],cSpot:['tour.spots'],cAcc:['tour.acc']},
  population:{cPop:['pop.pop'],cBD:['pop.birth','pop.death'],cDep:['pop.age'],cAmp:['pop.pop'],cMove:['pop.move'],pyrBox:['pop.pyr','pop.age']},
  household:{cIE:['house.main'],cDebt:['house.debt'],cGini:['house.gini'],cSrc:['house.income_src'],cSize:['house.expense'],cDist:['house.poverty']},
  industry:{cEst:['ind.est'],cGpp:['ind.gpp'],tAmp:['ind.est']},
  fiscal:{cFiscalMix:['fis.dis','fis.alloc'],cFiscalTrend:['fis.dis','fis.alloc','fis.use']}
};
function liveRes(key){const [j,k]=key.split('.');if(j==='fis')return GDC.FIS&&GDC.FIS[k];const S=GDC.SYNC[j];return S&&S.res[k]}
function liveState(key){const j=key.split('.')[0];
  if(j==='fis')return typeof FISCAL_API==='undefined'?'':FISCAL_API.state==='ok'?'ok':FISCAL_API.state==='loading'||FISCAL_API.state==='idle'?'loading':'err';
  const st=SYNC_STATE[j];if(!st)return'';if(st.state==='loading')return'loading';
  const k=key.split('.')[1];return st.state==='err'||(st.err&&st.err[k])?'err':'ok'}
const thDate=x=>{try{return new Date(x).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'})}catch(e){return''}};
function gdcLive(pageId){
  const M=LIVE_MAP[pageId];if(!M)return;
  const mod=ld(NOTI.K,{})||{};
  Object.keys(M).forEach(id=>{
    const el=document.getElementById(id);if(!el)return;
    const card=el.closest('.c');if(!card)return;
    const keys=M[id],sts=keys.map(liveState);
    card.classList.toggle('gdc-shim',sts.some(x=>x==='loading'));
    const ok=keys.filter((k,i)=>sts[i]==='ok');
    const h=card.querySelector(':scope>header h3, header h3');if(!h)return;
    let dot=h.querySelector('.livedot');
    if(!ok.length){if(dot)dot.remove();return}
    const names=ok.map(k=>{const rid=liveRes(k),r=GDC.RES.find(z=>z.id===rid);return {n:r?r.n:k,m:mod[rid]}});
    const last=names.map(x=>x.m).filter(Boolean).sort().pop();
    const tip='ข้อมูลสดจาก API|'+[...new Set(names.map(x=>x.n))].join(' · ')+(last?' — ปรับปรุงบนระบบบัญชีข้อมูลล่าสุด '+thDate(last):' — ดึงจากระบบบัญชีข้อมูลจังหวัดเมื่อเปิดหน้านี้');
    if(!dot){dot=document.createElement('a');dot.className='livedot';dot.href='apistatus.html#'+pageId;dot.innerHTML='<i></i><span>LIVE</span>';h.appendChild(dot)}
    dot.setAttribute('data-tip2',tip.replace(/"/g,'&quot;'));
  });
}
/* ป้ายท้ายเมนู: วันที่ล่าสุดที่หน่วยงานปรับปรุงชุดข้อมูลที่แดชบอร์ดใช้ */
function sgdcDate(){
  const el=document.getElementById('sgdcT');if(!el)return;
  const mod=ld(NOTI.K,null);if(!mod)return;
  const ids=new Set(GDC.RES.filter(r=>r.state==='api').map(r=>r.id));
  const last=Object.keys(mod).filter(id=>ids.has(id)).map(id=>mod[id]).sort().pop();
  if(last)el.textContent='อัปเดตล่าสุด '+thDate(last);
}

/* ════════════ ประวัติการอัปเดต และข้อมูลเมตาจากระบบบัญชีข้อมูล ════════════ */
GDC.AGENCY={nso:'สำนักงานสถิติจังหวัดหนองบัวลำภู',spend:'สำนักงานคลังจังหวัดหนองบัวลำภู',irrig:'โครงการชลประทานหนองบัวลำภู',
  crop:'สำนักงานเกษตรจังหวัดหนองบัวลำภู',ldd:'สถานีพัฒนาที่ดินหนองบัวลำภู',env:'สำนักงานทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัด',
  bot:'ธนาคารแห่งประเทศไทย',mots:'สำนักงานการท่องเที่ยวและกีฬาจังหวัด',cdd:'สำนักงานพัฒนาชุมชนจังหวัด',energy:'สำนักงานพลังงานจังหวัด',
  dopa:'ที่ทำการปกครองจังหวัด',nesdc:'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ',ind:'สำนักงานอุตสาหกรรมจังหวัด',
  pea:'การไฟฟ้าส่วนภูมิภาคจังหวัด',moc:'สำนักงานพาณิชย์จังหวัด',dlt:'สำนักงานขนส่งจังหวัด',sso:'สำนักงานประกันสังคมจังหวัด',sme:'ธนาคาร SME D Bank'};
/* ลายเซ็นของชุดข้อมูล · เปลี่ยนเมื่อจำนวนแถวหรือเนื้อหาเปลี่ยน */
function gdcSig(v){let h=0;const t=JSON.stringify(v.records);for(let i=0;i<t.length;i+=7)h=(h*31+t.charCodeAt(i))|0;return v.total+':'+t.length+':'+h}
GDC.logPull=function(id,v){
  const sig=gdcSig(v), K='gdc-seen', H='gdc-hist';
  let seen={},hist=[];try{seen=JSON.parse(localStorage.getItem(K)||'{}');hist=JSON.parse(localStorage.getItem(H)||'[]')}catch(e){}
  const old=seen[id];
  if(!old)hist.unshift({id,at:v.at,kind:'first',total:v.total});
  else if(old.sig!==sig)hist.unshift({id,at:v.at,kind:'changed',total:v.total,prev:old.total});
  seen[id]={sig,total:v.total,at:v.at,first:old?old.first:v.at};
  try{localStorage.setItem(K,JSON.stringify(seen));localStorage.setItem(H,JSON.stringify(hist.slice(0,300)))}catch(e){}
};
GDC.history=()=>{try{return JSON.parse(localStorage.getItem('gdc-hist')||'[]')}catch(e){return[]}};
GDC.seen=()=>{try{return JSON.parse(localStorage.getItem('gdc-seen')||'{}')}catch(e){return{}}};
/* เรียก action อื่นของ CKAN แบบ JSONP (resource_show, package_show) */
GDC.call=function(action,params){
  return new Promise((res,rej)=>{
    const cb='gdcm_'+Math.random().toString(36).slice(2);
    const q=Object.keys(params).map(k=>encodeURIComponent(k)+'='+encodeURIComponent(params[k])).join('&');
    const s=document.createElement('script');let done=false;
    const end=()=>{done=true;try{delete window[cb]}catch(e){}s.remove();clearTimeout(t)};
    const t=setTimeout(()=>{if(!done){end();rej(new Error('หมดเวลา'))}},12000);
    window[cb]=d=>{end();(d&&d.success)?res(d.result):rej(new Error((d&&d.error&&d.error.message)||'ไม่สำเร็จ'))};
    s.onerror=()=>{end();rej(new Error('เชื่อมต่อไม่ได้'))};
    s.src=GDC.base+'/api/3/action/'+action+'?'+q+'&callback='+cb;document.head.appendChild(s);
  });
};
/* ข้อมูลเมตาของชุด: วันที่ปรับปรุงบนระบบบัญชีข้อมูล ชื่อชุด หน่วยงานเจ้าของ · เก็บไว้ 1 ชั่วโมง */
GDC.meta=async function(id,fresh){
  const K='gdc-meta:'+id;
  if(!fresh){try{const c=JSON.parse(sessionStorage.getItem(K)||'null');if(c&&Date.now()-c.t<3600e3)return c.v}catch(e){}}
  const r=await GDC.call('resource_show',{id});
  let pk=null;try{pk=await GDC.call('package_show',{id:r.package_id})}catch(e){}
  const v={id,name:r.name,modified:r.last_modified||r.metadata_modified||r.created,created:r.created,format:r.format,
    pkg:pk?pk.name:r.package_id,pkgTitle:pk?pk.title:'',org:pk&&pk.organization?pk.organization.title:'',
    pkgModified:pk?pk.metadata_modified:null,url:GDC.base+'/dataset/'+(pk?pk.name:r.package_id)+'/resource/'+id};
  try{sessionStorage.setItem(K,JSON.stringify({t:Date.now(),v}))}catch(e){}
  return v;
};
/* ดูจำนวนแถวและคอลัมน์แบบเบา (1 แถว) */
GDC.peek=async function(id){const r=await GDC._jsonp({resource_id:id,limit:3});return {total:r.total,fields:(r.fields||[]).filter(f=>f.id!=='_id'),records:r.records||[]}};

/* ════════════ ทะเบียนแหล่งข้อมูลของทุกหน้า (รวมส่วนที่ยังไม่ใช่ API) ════════════
   type: api = ดึงจากระบบบัญชีข้อมูลจังหวัด · link = มีบนระบบบัญชีข้อมูลแล้ว รอเปิดอ่านผ่าน API
         gas = ระบบกรอกข้อมูลของแดชบอร์ด · file = ข้อมูลไฟล์ (นำเข้าจากเอกสารหรือ Excel)
         ext = ไฟล์จากหน่วยงานภายนอก · sim = ข้อมูลจำลอง */
const SRC_INV=[
  ['index','การเบิกจ่ายงบประมาณและเม็ดเงินภาครัฐบนหน้าปก','api','spend','ใช้ชุดเดียวกับหน้าการคลังภาครัฐ'],
  ['index','ภาวะเศรษฐกิจเดือนล่าสุดบนหน้าปก','gas','spend','ไฟล์ Excel ของคลังจังหวัด แก้ไขผ่านระบบกรอกข้อมูล'],
  ['overview','แท็บภาคการคลัง (การเบิกจ่ายงบประมาณ เงินกันเหลื่อมปี)','api','spend','ใช้ชุดเดียวกับหน้าการคลังภาครัฐ'],
  ['gpp','เสถียรภาพการคลัง','api','spend','ใช้ชุดเดียวกับหน้าการคลังภาครัฐ'],
  ['overview','เครื่องชี้เศรษฐกิจรายเดือน (ภาพรวม อุปสงค์ อุปทาน การเงิน แรงงาน)','gas','spend','ไฟล์ Excel ของคลังจังหวัด แก้ไขผ่านระบบกรอกข้อมูล'],
  ['overview','แนวโน้มประมาณการเศรษฐกิจ 6 ด้าน','sim','spend','ค่าตัวอย่างจากค่าเฉลี่ย 3 เดือน รอคลังจังหวัดกรอกค่าจริง'],
  ['gpp','ผลิตภัณฑ์มวลรวมจังหวัด (GPP) 19 สาขา','ext','nesdc','แฟ้ม GPP ของ สศช. ฉบับ พ.ศ. 2567'],
  ['gpp','เทียบจังหวัดภาคตะวันออกเฉียงเหนือ','ext','nesdc','แฟ้ม GPP ของ สศช. แผ่น NE และ CLUSTERS'],
  ['gpp','อัตราการขยายตัว GPP และ GDP','gas','spend','ระบบกรอกข้อมูล ตาราง gppgrow'],
  ['agri','ภาวะการผลิตพืชอายุสั้น · ไม้ผล · พืชเศรษฐกิจหลัก','gas','crop','ระบบกรอกข้อมูล ตาราง crop fruit base'],
  ['agri','แปลงใหญ่ · แหล่งท่องเที่ยวเชิงเกษตร · องค์กรเกษตรกร · GAP · อินทรีย์','file','crop','เอกสารสำนักงานเกษตรจังหวัด'],
  ['agri','ระบบกระจายน้ำด้วย Solar Cell','file','energy','เอกสารสำนักงานพลังงานจังหวัด ก.ค. 2569'],
  ['agri','บ่อขนาดเล็ก (เกษตรทฤษฎีใหม่)','file','crop','รอสอบถามแหล่งข้อมูล'],
  ['industry','เงินทุนและคนงานในสถานประกอบการอุตสาหกรรม รายอำเภอ','file','ind','ไฟล์รายงานสถิติ ตาราง 12.4 · ยังไม่มีใน API'],
  ['industry','สถานประกอบการจำแนกตามประเภทอุตสาหกรรม','file','ind','ไฟล์รายงานสถิติ ตาราง 12.3 · ยังไม่มีใน API'],
  ['industry','เหมืองแร่ คนงานเหมือง และปริมาณแร่ที่ผลิตได้','file','ind','ไฟล์รายงานสถิติ ตาราง 12.5 · ยังไม่มีใน API'],
  ['trade','ราคาสินค้าเกษตรรายสัปดาห์','gas','moc','ระบบกรอกข้อมูล ตาราง price'],
  ['trade','ดัชนีราคาผู้บริโภค','sim','moc','รอหน่วยงานส่งข้อมูลจริง'],
  ['trade','สินเชื่อ SME','sim','sme','รอหน่วยงานส่งข้อมูลจริง'],
  ['consume','การจำหน่ายน้ำมันเชื้อเพลิง','sim','energy','รอหน่วยงานส่งข้อมูลจริง'],
  ['consume','รถจดทะเบียนใหม่','sim','dlt','รอหน่วยงานส่งข้อมูลจริง'],
  ['area','ข้อมูลเชิงพื้นที่รายอำเภอ','file','dopa','รวมจากหลายหน่วยงาน']
];
const SRC_TYPE={api:['ดึงจาก API','api'],link:['กำลังเชื่อมข้อมูล','link'],avail:['มีใน API ยังไม่ได้แสดง','avail'],
  gas:['ระบบกรอกข้อมูล','gas'],file:['ข้อมูลไฟล์','file'],ext:['ไฟล์หน่วยงานภายนอก','ext'],sim:['ข้อมูลจำลอง','sim']};
/* รวมทะเบียนทั้งหมดเป็นรายการเดียว ใช้ในหน้าสถานะ */
function srcInventory(){
  const L=GDC.RES.map(r=>({page:r.page,n:r.n,type:r.state==='map'?'link':r.state,agency:r.agency,id:r.id,ds:r.ds,use:r.use||''}));
  SRC_INV.forEach(x=>L.push({page:x[0],n:x[1],type:x[2],agency:x[3],note:x[4]}));
  return L;
}

/* ════════════════════════════════════════════════════════════════════
   แผงข้อมูลเพิ่มเติมจากระบบบัญชีข้อมูลจังหวัด
   ชุดที่หน่วยงานส่งเข้าระบบแล้วแต่หน้าเดิมยังไม่มีที่แสดง · วาดต่อท้ายหน้าเป็นการ์ดกราฟ
   ทุกการ์ดอ่านปี ไตรมาส และหมวดจากข้อมูลใน API เอง เพิ่มงวดใหม่ในระบบแล้วกราฟเพิ่มตาม
   ════════════════════════════════════════════════════════════════════ */
const PNL_DATA={}, PNL_LOAD={};
const pv=r=>{for(const k of ['ค่าข้อมูล','จำนวน','ค่าของข้อมูล','ร้อยละ','ค่าของเป้าหมาย','ค่า'])if(r[k]!=null&&r[k]!=='')return gdcNum(r[k]);return null};
const pTxt=(r,k)=>String(r[k]==null?'':r[k]).trim();
/* รวมค่าตามไตรมาส × หมวด (บวกชาย+หญิงให้เอง) */
/* ตรวจคุณภาพระหว่างอ่าน: ไตรมาสที่ยังมาไม่ถึง (กรอกปีผิด) และไตรมาสที่ค่าเป็นศูนย์ทั้งหมด (ยังไม่ได้กรอก) จะไม่นำมาใช้ */
const PNL_QA={};
const qEnd=x=>new Date(x.y-543,x.n*3,0);
function byQ(rows,cat,filt,qaKey){const Q={};rows.forEach(r=>{if(filt&&!filt(r))return;const q=gq(r),v=pv(r);if(!q||v==null)return;
  const x=Q[q.q]=Q[q.q]||{q:q.q,y:q.y,n:q.n,m:{}};const c=cat?pTxt(r,cat):'_';x.m[c]=(x.m[c]||0)+v});
  const now=new Date(), L=Object.values(Q).sort((a,b)=>(a.y*10+a.n)-(b.y*10+b.n));
  return L.filter(x=>{
    if(qEnd(x)>now){if(qaKey)(PNL_QA[qaKey]=PNL_QA[qaKey]||new Set()).add('ไตรมาส '+x.n+'/'+x.y+' ยังมาไม่ถึง (น่าจะกรอกปีผิด) จึงไม่นำมาใช้');return false}
    if(Object.values(x.m).every(v=>v===0)){if(qaKey)(PNL_QA[qaKey]=PNL_QA[qaKey]||new Set()).add('ไตรมาส '+x.n+'/'+x.y+' มีค่าเป็นศูนย์ทั้งหมด (น่าจะยังไม่ได้กรอก) จึงไม่นำมาใช้');return false}
    return true})}
const qLab=x=>'Q'+x.n+'/'+String(x.y).slice(-2);
/* ชุดที่ยังไม่รู้โครงสร้างแน่ชัด: หาเองว่าคอลัมน์ไหนคือปี ค่า และหมวด */
function autoShape(rows){
  if(!rows.length)return null;
  const keys=Object.keys(rows[0]);
  const skip=/^(ปี|ปีงบประมาณ|จังหวัด|หน่วย|แหล่งที่มา|ที่มา|หน่วยงาน|หมายเหตุ|โครงการ|_id)$/;
  const cats=keys.filter(k=>!skip.test(k)&&pv({ค่าข้อมูล:rows[0][k]})==null).map(k=>({k,n:new Set(rows.map(r=>pTxt(r,k))).size})).filter(x=>x.n>1&&x.n<=12);
  return {cat:cats.length?cats.sort((a,b)=>a.n-b.n)[0].k:null};
}
GDC.PANELS={
  labor:[
    {id:'9d89b6d3-d47f-466f-8fb6-ee9138dedacb',t:'อัตราการว่างงาน แยกเพศ',u:'ร้อยละ',ic:'labor',build(R){
      const L=byQ(R,'เพศ',r=>/^(ชาย|หญิง)$/.test(pTxt(r,'เพศ')),'อัตราการว่างงาน').slice(-12);
      return {type:'line',labels:L.map(qLab),sets:['ชาย','หญิง'].map(g=>({label:g,data:L.map(x=>x.m[g]??null)})),
        note:'ไตรมาสล่าสุด '+qLab(L[L.length-1])+' · ชาย '+(L[L.length-1].m['ชาย']??'—')+'% · หญิง '+(L[L.length-1].m['หญิง']??'—')+'%',dec:1}}},
    {id:'5184ddd5-b72b-4ce1-8cb0-91265a3c1a8e',t:'จำนวนผู้ว่างงาน แยกเพศ',u:'คน',ic:'labor',build(R){
      const L=byQ(R,'เพศ',null,'จำนวนผู้ว่างงาน').slice(-12);const t=L[L.length-1];
      return {type:'bar',stack:true,labels:L.map(qLab),sets:['ชาย','หญิง'].map(g=>({label:g,data:L.map(x=>x.m[g]??null)})),
        note:'ไตรมาสล่าสุด '+qLab(t)+' รวม '+f_num((t.m['ชาย']||0)+(t.m['หญิง']||0))+' คน'}}},
    {id:'0ffce67f-bef6-4a16-a116-3107dc681a10',t:'สถานภาพแรงงาน ชายเทียบหญิง',u:'คน',ic:'labor',build(R){
      const Q={};R.forEach(r=>{const q=gq(r),v=pv(r);if(!q||v==null)return;(Q[q.q]=Q[q.q]||{q,m:{}}).m[pTxt(r,'สถานภาพแรงงาน')+'|'+pTxt(r,'เพศ')]=v});
      const k=Object.keys(Q).sort().pop(),X=Q[k],C=['กำลังแรงงานรวม','ผู้มีงานทำ','ผู้ว่างงาน','ผู้ไม่อยู่ในกำลังแรงงาน'];
      return {type:'bar',labels:C,sets:['ชาย','หญิง'].map(g=>({label:g,data:C.map(c=>X.m[c+'|'+g]??null)})),note:'ไตรมาส '+X.q.n+'/'+X.q.y}}},
    {id:'d4562b99-2732-49b5-8cfe-b3282196e0ab',t:'ผู้มีงานทำ จำแนกตามอาชีพ',u:'คน',ic:'labor',build(R){
      const L=byQ(R,'อาชีพ',null,'ผู้มีงานทำ จำแนกตามอาชีพ').filter(x=>Object.keys(x.m).length>=5);const t=L[L.length-1];
      const K=Object.keys(t.m).filter(k=>t.m[k]>0).sort((a,b)=>t.m[b]-t.m[a]);
      return {type:'hbar',labels:K,sets:[{label:'ผู้มีงานทำ',data:K.map(k=>t.m[k])}],note:'ไตรมาส '+t.n+'/'+t.y+' · ชาย+หญิง'}}},
    {id:'78e14a3f-8c22-4c77-b267-b21ed68e63bd',t:'ผู้มีงานทำ จำแนกตามระดับการศึกษา',u:'คน',ic:'labor',build(R){
      const L=byQ(R,'รายการ',null,'ผู้มีงานทำ จำแนกตามระดับการศึกษา').filter(x=>x.m['รวมยอด']>0);const t=L[L.length-1];
      const K=Object.keys(t.m).filter(k=>k!=='รวมยอด'&&t.m[k]>0).sort((a,b)=>t.m[b]-t.m[a]);
      return {type:'hbar',labels:K,sets:[{label:'ผู้มีงานทำ',data:K.map(k=>t.m[k])}],note:'ไตรมาส '+t.n+'/'+t.y+' · ชาย+หญิง'}}},
    {id:'22c3a494-1e56-47a1-abea-73574db8fada',t:'ผู้อยู่นอกกำลังแรงงาน จำแนกตามเหตุผล',u:'คน',ic:'labor',build(R){
      const L=byQ(R,'สถานภาพแรงงาน',r=>/นอกกำลังแรงงาน/.test(pTxt(r,'ประเภท')),'ชุดข้อมูลกำลังแรงงาน 2562–2568');const t=L[L.length-1];
      const K=Object.keys(t.m).filter(k=>t.m[k]>0).sort((a,b)=>t.m[b]-t.m[a]);
      return {type:'donut',labels:K,sets:[{label:'คน',data:K.map(k=>t.m[k])}],note:'ไตรมาส '+t.n+'/'+t.y+' · รวม '+f_num(K.reduce((a,k)=>a+t.m[k],0))+' คน'}}},
    {id:'40275f48-de7a-4451-92a8-9c1b32fdc9bc',t:'ผู้รอฤดูกาล และผู้ว่างงาน',u:'คน',ic:'labor',build(R){
      const Q={};R.forEach(r=>{const y=gdcYear(r),n=parseInt(pTxt(r,'ไตรมาส'),10),v=pv(r);if(!y||!n||v==null)return;
        const x=Q[y*10+n]=Q[y*10+n]||{y,n,m:{}};x.m[pTxt(r,'ผู้อยู่ในกำลังแรงงาน')]=v});
      const L=Object.keys(Q).sort().map(k=>Q[k]).slice(-12);
      return {type:'bar',labels:L.map(qLab),sets:[{label:'ผู้ที่รอฤดูกาล',data:L.map(x=>x.m['ผู้ที่รอฤดูกาล']??null)},{label:'ผู้ว่างงาน',data:L.map(x=>x.m['ผู้ว่างงาน']??null),type:'line'}],
        note:'ผู้รอฤดูกาลคือแรงงานภาคเกษตรที่รอฤดูเพาะปลูก สูงขึ้นในช่วงแล้ง'}}}
  ],
  household:[
    {id:'73df9a5b-6433-4009-bcae-9590a46c35d6',t:'ลักษณะที่สำคัญของครัวเรือน',u:'ร้อยละ',ic:'household',pick:'ลักษณะครัวเรือน',build(R,sel){
      const ys=[...new Set(R.map(gdcYear).filter(Boolean))].sort(), y=ys[ys.length-1];
      const cats=[...new Set(R.map(r=>pTxt(r,'ลักษณะครัวเรือน')))]; const c=sel&&cats.indexOf(sel)>=0?sel:cats[0];
      const L=R.filter(r=>gdcYear(r)===y&&pTxt(r,'ลักษณะครัวเรือน')===c).map(r=>[pTxt(r,'รายการ'),pv(r)]).filter(x=>x[1]!=null).sort((a,b)=>b[1]-a[1]);
      return {type:'hbar',labels:L.map(x=>x[0]),sets:[{label:'ร้อยละ',data:L.map(x=>x[1])}],dec:1,opts:cats,sel:c,note:'ปี '+y+' · '+c}}},
    {ids:['399f28c9-80d6-43bc-b7f2-f214cd5c1e8d','a3ebe2ae-6aa0-41a0-8805-c671bc57d0c8'],t:'รายได้และค่าใช้จ่ายของครัวเรือน ตามสถานะทางเศรษฐสังคม',u:'บาท/เดือน',ic:'household',build(A,B){
      const yA=Math.max(...A.map(gdcYear).filter(Boolean)), yB=Math.max(...B.map(gdcYear).filter(Boolean)), y=Math.min(yA,yB);
      const m=(R,yy)=>{const o={};R.filter(r=>gdcYear(r)===yy).forEach(r=>{const v=pv(r);if(v!=null)o[pTxt(r,'สถานะทางเศรษฐสังคม')]=v});return o};
      const a=m(A,y),b=m(B,y),K=Object.keys(a).sort((x,z)=>a[z]-a[x]);
      return {type:'hbar',labels:K,sets:[{label:'รายได้',data:K.map(k=>a[k])},{label:'ค่าใช้จ่าย',data:K.map(k=>b[k]??null)}],
        note:'ปี '+y+' · กลุ่มที่รายได้สูงสุด '+K[0]+' '+f_num(a[K[0]])+' บาท'}}},
    {id:'99f1ed66-2fe3-4b7b-853e-737932776c54',t:'Gini ด้านรายจ่ายเพื่อการอุปโภคบริโภค',u:'ค่าสัมประสิทธิ์',ic:'household',auto:true},
    {id:'9d279dbb-0e2a-483b-9bab-ecb223756a09',t:'Gini ด้านรายจ่าย แยกตามการแบ่งกลุ่มครัวเรือน',u:'ค่าสัมประสิทธิ์',ic:'household',auto:true},
    {id:'2e73835e-fd7d-4767-817a-81ba7216b56d',t:'ครัวเรือนที่มีที่อยู่อาศัยใช้วัสดุคงทนและเป็นของตนเอง',u:'',ic:'household',auto:true}
  ],
  trade:[
    {ids:['ec2ae427-8a15-44e0-8be3-692e07393f2b','f73d6b1a-b890-43d4-b9a1-0f4d6ed873e4','b519ce91-d7b1-4719-96d8-795b5307b6ba'],t:'ธนาคารพาณิชย์ในจังหวัด · เงินฝากและสินเชื่อ',u:'ล้านบาท',ic:'credit',wide:true,build(N,Dp,Ln){
      const m=R=>{const o={};R.forEach(r=>{const y=gdcYear(r),v=pv(r);if(y&&v!=null)o[y]=v});return o};
      const n=m(N),d=m(Dp),l=m(Ln),Y=[...new Set([...Object.keys(d),...Object.keys(l)])].sort();const yl=Y[Y.length-1];
      return {type:'bar',labels:Y.map(y=>'ปี '+y),sets:[{label:'เงินฝาก',data:Y.map(y=>d[y]??null)},{label:'สินเชื่อ',data:Y.map(y=>l[y]??null)},
          {label:'สินเชื่อต่อเงินฝาก (%)',data:Y.map(y=>d[y]&&l[y]?+(l[y]/d[y]*100).toFixed(1):null),type:'line',axis:'y1'}],
        kpi:[['ธนาคารพาณิชย์',f_num(n[yl]??n[Math.max(...Object.keys(n))]),'แห่ง'],['เงินฝาก',f_num(d[yl]),'ล้านบาท'],['สินเชื่อ',f_num(l[yl]),'ล้านบาท'],['สินเชื่อต่อเงินฝาก',d[yl]&&l[yl]?(l[yl]/d[yl]*100).toFixed(1):'—','%']],
        note:'ปี '+yl+' · สินเชื่อต่อเงินฝากต่ำกว่า 100% แปลว่าเงินออมในพื้นที่ยังถูกปล่อยกู้กลับมาในจังหวัดไม่เต็มที่',y1:'%'}}}
  ],
  tourism:[{id:'85640650-a585-476c-af0e-733309d50161',t:'ค่าเป้าหมายรายได้จากการท่องเที่ยว',u:'ล้านบาท',ic:'tourism',build:R=>tiers(R)}],
  otop:[{id:'64467029-96c0-4558-996f-a96ce0f4763f',t:'ค่าเป้าหมายยอดจำหน่าย OTOP',u:'ล้านบาท',ic:'otop',build:R=>tiers(R)}]
};
/* ค่าเป้าหมาย 3 ระดับ แยกรอบ 6 และ 12 เดือน */
function tiers(R){
  const fy=Math.max(...R.map(r=>parseInt(pTxt(r,'ปีงบประมาณ'),10)).filter(Boolean));
  const X=R.filter(r=>parseInt(pTxt(r,'ปีงบประมาณ'),10)===fy), rounds=[...new Set(X.map(r=>pTxt(r,'รอบ')))], T=[...new Set(X.map(r=>pTxt(r,'ประเภท')))];
  return {type:'bar',labels:rounds.map(x=>'รอบ '+x),sets:T.map(t=>({label:t,data:rounds.map(rd=>{const r=X.find(z=>pTxt(z,'รอบ')===rd&&pTxt(z,'ประเภท')===t);return r?pv(r):null})})),
    note:'ปีงบประมาณ '+fy+' · '+X.map(r=>pTxt(r,'ระยะเวลา')).filter((v,i,a)=>a.indexOf(v)===i).join(' / '),dec:2};
}
/* ════ แผงอัตโนมัติรุ่นที่ 2 · อ่านโครงสร้างชุดข้อมูลเอง แล้วเลือกรูปแบบที่เหมาะ ════
   รายชื่อ (ร้านอาหาร ที่พัก ผู้ประกอบการ) → นับรายอำเภอ + รายชื่อเด่น
   มีอำเภอ → เทียบรายอำเภอปีล่าสุด · มีหลายหมวด → เส้นรายปีแยกหมวด · มีเดือน → เส้นรายเดือน · มีแต่ปี → แท่งรายปี */
const TH_MF=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
function autoBuild2(R0,qaKey){
  if(!R0||!R0.length)return null;
  const K=Object.keys(R0[0]);
  /* ทำความสะอาดก่อนใช้: ปีที่เป็นไปไม่ได้ (เช่น 2464 ที่น่าจะพิมพ์ผิดจาก 2564) ไม่นำมาใช้ · ถ้ามีแถวเพศ "รวม" ใช้เฉพาะแถวรวม ไม่บวกชาย+หญิงซ้ำ */
  const BE=new Date().getFullYear()+543, qa=m=>{if(qaKey)(PNL_QA[qaKey]=PNL_QA[qaKey]||new Set()).add(m)};
  let R=R0.filter(r=>{const y=gdcYear(r);if(y&&(y<2500||y>BE+1)){qa('ปี '+y+' ไม่สมเหตุผล (น่าจะพิมพ์ผิด) จึงไม่นำมาใช้');return false}return true});
  if(K.indexOf('เพศ')>=0&&R.some(r=>pTxt(r,'เพศ')==='รวม'))R=R.filter(r=>pTxt(r,'เพศ')==='รวม');
  if(!R.length)return null;
  const yc=K.find(k=>/^(ปี|ปีงบประมาณ|พ\.ศ\.)$/.test(k)), mc=K.find(k=>/^เดือน$/.test(k)), ac=K.find(k=>/^อำเภอ$/.test(k));
  const uc=K.find(k=>/^หน่วย$/.test(k));
  /* คอลัมน์ตัวเลข: นับเฉพาะช่องที่กรอกแล้ว ("-" "n.a." หรือช่องว่าง ถือว่ายังไม่มีข้อมูล) */
  const blank=x=>x==null||/^(-+|n\.?a\.?|)$/i.test(String(x).replace(/\s/g,''));
  const numOK=k=>{let n=0,t=0;R.forEach(r=>{if(blank(r[k]))return;t++;if(gdcNum(r[k])!=null)n++});return n>0&&n>=t*.6};
  const vc=['ค่าข้อมูล','จำนวน','ปริมาณ','ค่าของข้อมูล','ค่า','ร้อยละ','จำนวนห้องพัก','มูลค่า'].find(k=>K.indexOf(k)>=0&&numOK(k));
  const skip=/^(จังหวัด|แหล่งที่มา|ที่มา|หน่วยงาน|หมายเหตุ|หน่วย|ปี|ปีงบประมาณ|เดือน|อำเภอ|เบอร์|โทร)/;
  const uniq=k=>new Set(R.map(r=>pTxt(r,k))).size;
  const txt=K.filter(k=>!skip.test(k)&&k!==vc&&!numOK(k));
  /* คอลัมน์ชื่อรายการ: ตรวจความไม่ซ้ำภายในปีล่าสุด เพราะรายชื่อเดิมถูกลงซ้ำทุกปี */
  /* รายชื่อ: ใช้ปีล่าสุดถ้าปีนั้นลงข้อมูลครบ (อย่างน้อยครึ่งหนึ่งของปีที่มากที่สุด) ไม่งั้นรวมทุกปีโดยตัดชื่อซ้ำ (เก็บแถวปีล่าสุด) */
  const uq=(k,A)=>new Set(A.map(r=>pTxt(r,k))).size;
  const nameLike=k=>/ชื่อ|รายชื่อ|ที่ตั้งตลาด/.test(k);
  const RL=(()=>{if(!yc)return R;const c={};R.forEach(r=>{const y=gdcYear(r);if(y)c[y]=(c[y]||0)+1});const ys=Object.keys(c).map(Number);if(!ys.length)return R;
    const y=Math.max(...ys),mx=Math.max(...ys.map(v=>c[v]));if(c[y]>=mx*.5)return R.filter(r=>gdcYear(r)===y);
    const nk=txt.filter(nameLike).sort((p,q)=>uniq(q)-uniq(p))[0];if(!nk)return R.filter(r=>gdcYear(r)===y);
    const M={};R.slice().sort((a,b)=>(gdcYear(a)||0)-(gdcYear(b)||0)).forEach(r=>M[pTxt(r,nk)]=r);return Object.values(M)})();
  const nameC=txt.filter(k=>nameLike(k)&&uq(k,RL)>8&&uq(k,RL)>=RL.length*.5).sort((p,q)=>uq(q,RL)-uq(p,RL))[0];
  const cats=txt.filter(k=>k!==nameC&&uniq(k)>1&&uniq(k)<=12&&!/ที่อยู่|ที่ตั้ง|ช่องทาง|เมนู|รางวัล|พิกัด|ตำบล/.test(k));
  const unit=uc?(R.map(r=>pTxt(r,uc)).find(Boolean)||''):'';
  const Y=yc?[...new Set(R.map(gdcYear).filter(Boolean))].sort((a,b)=>a-b):[];
  const yl=Y[Y.length-1], yp=Y[Y.length-2];
  const val=r=>vc?gdcNum(r[vc]):1;
  const sum=f=>R.filter(f).reduce((a,r)=>a+(val(r)||0),0);
  /* ชื่ออำเภอให้ตรงกัน ("เมือง" = "เมืองหนองบัวลำภู") · แถว ในเขต/นอกเขตเทศบาล เป็นการแบ่งอีกแบบ ไม่ใช่อำเภอ ไม่นับรวม */
  const amp=x=>{const a=String(x||'').replace(/^อำเภอ/,'').trim();return a==='เมือง'?'เมืองหนองบัวลำภู':a};
  const notAmp=a=>!a||/รวม|ทั้งจังหวัด|ทุกอำเภอ|เขตเทศบาล/.test(a);
  /* 1) รายชื่อ */
  if(nameC){
    const L=RL;
    const byA={};if(ac)L.forEach(r=>{const a=amp(r[ac]);if(notAmp(a))return;byA[a]=(byA[a]||0)+(vc&&!/^จำนวน$/.test(vc)?(val(r)||0):1)});
    const A=Object.keys(byA).sort((a,b)=>byA[b]-byA[a]);
    const mode=vc&&vc!=='จำนวน'?vc:'จำนวนรายการ';
    return {type:ac?'hbar':'none',labels:A,sets:[{label:mode,data:A.map(a=>byA[a])}],u:mode==='จำนวนรายการ'?'รายการ':unit,
      kpi:[['ทั้งหมด'+(yl&&L.every(r=>gdcYear(r)===yl)?' ปี '+yl:''),f_num(L.length),'รายการ']].concat(vc&&vc!=='จำนวน'?[['รวม'+vc,f_num(L.reduce((a,r)=>a+(val(r)||0),0)),unit]]:[]),
      list:L.map(r=>pTxt(r,nameC)+(ac?' · '+amp(r[ac]):'')),note:(ac?'นับรายอำเภอ':'')+(yl?(L.every(r=>gdcYear(r)===yl)?' · ปี '+yl:' · รวมทุกปี ตัดชื่อซ้ำ'):'')};
  }
  /* ไม่มีคอลัมน์ค่ามาตรฐาน แต่มีหลายคอลัมน์ตัวเลข (เช่น ตำบล/หมู่บ้าน หรือ ครัวเรือน/แปลง/เนื้อที่) */
  if(!vc){
    const nums=K.filter(k=>!skip.test(k)&&numOK(k)&&!/^(ปี|ลำดับ)/.test(k));
    if(!nums.length)return null;
    const main=nums.find(k=>/เนื้อที่|พื้นที่|ไร่|หมู่บ้าน|มูลค่า/.test(k))||nums[nums.length-1];
    const L=yc?R.filter(r=>gdcYear(r)===Math.max(...R.map(gdcYear).filter(Boolean))):R;
    if(ac){const byA={};L.forEach(r=>{const a=amp(r[ac]);if(notAmp(a))return;byA[a]=(byA[a]||0)+(gdcNum(r[main])||0)});
      const A=Object.keys(byA).sort((a,b)=>byA[b]-byA[a]);
      return {type:'hbar',labels:A,sets:[{label:main.replace(/_/g,' '),data:A.map(a=>+byA[a].toFixed(2))}],u:main.replace(/_/g,' '),
        kpi:nums.slice(0,4).map(k=>['รวม'+k.replace(/_/g,' '),f_num(Math.round(L.reduce((a,r)=>a+(gdcNum(r[k])||0),0))),'']),
        note:'แยกรายอำเภอ'+(yc?' · ปี '+Math.max(...R.map(gdcYear).filter(Boolean)):'')}}
    return null;
  }
  /* 2ก) รายเดือนแบบ "ต.ค.-66" เรียงตามลำดับปีงบประมาณ */
  const TM=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  const pc=K.find(k=>R.slice(0,10).every(r=>/^(ม\.ค\.|ก\.พ\.|มี\.ค\.|เม\.ย\.|พ\.ค\.|มิ\.ย\.|ก\.ค\.|ส\.ค\.|ก\.ย\.|ต\.ค\.|พ\.ย\.|ธ\.ค\.)\s*-?\s*\d{2}$/.test(pTxt(r,k))));
  if(pc){const P={};R.forEach(r=>{const m=pTxt(r,pc).match(/^(.+?)\s*-?\s*(\d{2})$/);if(!m)return;const mi=TM.indexOf(m[1].trim());if(mi<0)return;
      const k=(2500+ +m[2])*100+mi+1;P[k]=(P[k]||0)+(val(r)||0)});
    const ks=Object.keys(P).map(Number).sort((a,b)=>a-b).slice(-24);
    if(ks.length>1)return {type:'bar',labels:ks.map(k=>TM[k%100-1]+' '+String(Math.floor(k/100)).slice(-2)),sets:[{label:unit||'ค่า',data:ks.map(k=>P[k])}],u:unit,
      note:'รายเดือน · ล่าสุด '+TM[ks[ks.length-1]%100-1]+' '+Math.floor(ks[ks.length-1]/100)+' '+f_num(P[ks[ks.length-1]])+' '+unit+(ac?' (รวมทุกอำเภอ)':'')}}
  /* 2ข) รายไตรมาส · ใช้ไตรมาสล่าสุด แยกตามหมวด (บวกชาย+หญิงให้เอง) */
  const qc=K.find(k=>/^(ช่วงเวลา|ไตรมาส)$/.test(k)&&R.slice(0,10).some(r=>/ไตรมาส/.test(pTxt(r,k))));
  if(qc&&yc){
    const qk=r=>{const m=pTxt(r,qc).match(/(\d)/);return m?gdcYear(r)*10+(+m[1]):0};
    const now=new Date(), okq=k=>new Date(Math.floor(k/10)-543,(k%10)*3,0)<=now;
    const QS=[...new Set(R.map(qk))].filter(k=>k&&okq(k)).sort((a,b)=>a-b);
    const cq=cats.filter(k=>k!==qc&&!/เพศ/.test(k)).sort((a,b)=>uniq(b)-uniq(a))[0];
    for(let i=QS.length-1;i>=0;i--){const L=R.filter(r=>qk(r)===QS[i]);const m={};L.forEach(r=>{const c=cq?pTxt(r,cq):'รวม';if(/^รวม/.test(c))return;const v=val(r);if(v!=null)m[c]=(m[c]||0)+v});
      const C=Object.keys(m).filter(c=>m[c]>0).sort((a,b)=>m[b]-m[a]);
      if(C.length)return {type:'hbar',labels:C,sets:[{label:unit||'ค่า',data:C.map(c=>m[c])}],u:unit,note:'ไตรมาส '+(QS[i]%10)+'/'+Math.floor(QS[i]/10)+(cq?' · แยกตาม'+cq:'')}}
  }
  /* 2) รายเดือน */
  if(mc&&yc){
    const P={};R.forEach(r=>{const y=gdcYear(r),m=TH_MF.indexOf(pTxt(r,mc))+1||parseInt(pTxt(r,mc),10);if(!y||!m)return;const k=y*100+m;P[k]=(P[k]||0)+(val(r)||0)});
    const ks=Object.keys(P).map(Number).sort((a,b)=>a-b).slice(-24);
    if(ks.length>1)return {type:'line',labels:ks.map(k=>TH_M[k%100-1]+' '+String(Math.floor(k/100)).slice(-2)),sets:[{label:unit||'ค่า',data:ks.map(k=>P[k])}],u:unit,
      note:'ล่าสุด '+TH_M[ks[ks.length-1]%100-1]+' '+Math.floor(ks[ks.length-1]/100)+' · '+f_num(P[ks[ks.length-1]])+' '+unit};
  }
  /* 3) รายอำเภอ */
  if(ac&&uniq(ac)>2){
    const L=yl?R.filter(r=>gdcYear(r)===yl):R;const byA={};L.forEach(r=>{const a=amp(r[ac]);if(notAmp(a))return;byA[a]=(byA[a]||0)+(val(r)||0)});
    const A=Object.keys(byA).sort((a,b)=>byA[b]-byA[a]);
    const tot=A.reduce((a,k)=>a+byA[k],0), ptot=yp?sum(r=>gdcYear(r)===yp&&!notAmp(amp(r[ac]))):null;
    const avgType=/อัตรา|ร้อยละ|เปอร์เซ็น|ความหนาแน่น|เฉลี่ย|สัดส่วน/.test(unit+' '+K.join(' ')+' '+pTxt(R[0],'รายการ')+pTxt(R[0],'รายการข้อมูล'));
    return {type:'hbar',labels:A,sets:[{label:(yl?'ปี '+yl:'ค่า'),data:A.map(a=>+byA[a].toFixed(2))}],u:unit,dec:avgType?2:0,
      note:(yl?'ปี '+yl+' · ':'')+(avgType?'สูงสุด '+A[0]+' '+f(byA[A[0]],2)+' '+unit:'รวมทั้งจังหวัด '+f_num(Math.round(tot))+' '+unit+(ptot?' · '+(tot>=ptot?'▲ +':'▼ ')+f_num(Math.round(tot-ptot))+' จากปี '+yp:''))};
  }
  /* 4) หลายหมวด × รายปี */
  const cc=cats.sort((a,b)=>uniq(b)-uniq(a))[0];
  if(cc&&Y.length>1){
    const C=[...new Set(R.map(r=>pTxt(r,cc)))].slice(0,8);
    return {type:Y.length>2?'line':'bar',labels:Y.map(y=>'ปี '+y),u:unit,
      sets:C.map(c=>({label:c.length>34?c.slice(0,32)+'…':c,data:Y.map(y=>{const x=R.filter(r=>gdcYear(r)===y&&pTxt(r,cc)===c&&val(r)!=null);return x.length?x.reduce((a,r)=>a+val(r),0):null})})),
      note:'แยกตาม'+cc+' · ปี '+Y[0]+'–'+yl};
  }
  /* 5) หมวดในปีเดียว */
  if(cc){const L=yl?R.filter(r=>gdcYear(r)===yl):R;const m={};L.forEach(r=>{const c=pTxt(r,cc);m[c]=(m[c]||0)+(val(r)||0)});const C=Object.keys(m).sort((a,b)=>m[b]-m[a]);
    return {type:'hbar',labels:C,sets:[{label:unit||'ค่า',data:C.map(c=>m[c])}],u:unit,note:(yl?'ปี '+yl+' · ':'')+'แยกตาม'+cc}}
  /* 6) รายปีอย่างเดียว · ถ้าเป็นอัตราหรือค่าเฉลี่ยใช้ค่าเฉลี่ย ไม่บวกกัน */
  const isAvg=/อัตรา|ร้อยละ|เปอร์เซ็น|ความหนาแน่น|เฉลี่ย|สัดส่วน|ต่อ/.test(unit+' '+pTxt(R[0],'รายการ')+' '+pTxt(R[0],'รายการข้อมูล'));
  if(Y.length){const m={},c={};R.forEach(r=>{const y=gdcYear(r),v=val(r);if(y&&v!=null){m[y]=(m[y]||0)+v;c[y]=(c[y]||0)+1}});
    if(isAvg)Object.keys(m).forEach(y=>m[y]=+(m[y]/c[y]).toFixed(2));
    return {type:'bar',labels:Y.map(y=>'ปี '+y),sets:[{label:unit||'ค่า',data:Y.map(y=>m[y])}],u:unit,
      note:'ปี '+yl+' · '+f_num(m[yl])+' '+unit+(yp&&m[yp]?' · '+(m[yl]>=m[yp]?'▲ +':'▼ ')+f_num(m[yl]-m[yp])+' จากปี '+yp:'')}}
  return null;
}
/* กราฟอัตโนมัติสำหรับชุดที่โครงสร้างยังไม่แน่ชัด: แยกหมวดถ้ามี ไม่งั้นเป็นเส้นรายปี */
function autoBuild(R,qaKey){
  const o=autoBuild2(R,qaKey); if(o)return o;
  const sh=autoShape(R)||{};const Y=[...new Set(R.map(gdcYear).filter(Boolean))].sort();
  if(sh.cat){const C=[...new Set(R.map(r=>pTxt(r,sh.cat)))].slice(0,8);
    return {type:'line',labels:Y.map(y=>'ปี '+y),sets:C.map(c=>({label:c.length>40?c.slice(0,38)+'…':c,data:Y.map(y=>{const r=R.find(z=>gdcYear(z)===y&&pTxt(z,sh.cat)===c);return r?pv(r):null})})),dec:3,note:'แยกตาม '+sh.cat}}
  return {type:'line',labels:Y.map(y=>'ปี '+y),sets:[{label:'ค่า',data:Y.map(y=>{const r=R.find(z=>gdcYear(z)===y);return r?pv(r):null})}],dec:2};
}
let PNL_SEL={};
const PG_IC={tourism:'tourism',otop:'otop',population:'population',agri:'agri',labor:'labor',household:'household',trade:'credit'};
const PNL_ALL={};
/* ไม่ต่อท้ายแผงข้อมูลเพิ่มเติมในหน้าใด · API ใช้แทนข้อมูลเดิมในตัวหน้าเท่านั้น (คงหน้าตาเดิม)
   ชุดที่มีใน API แต่หน้ายังไม่ได้แสดง ดูได้ที่หน้าสถานะ API (สถานะ "มีใน API ยังไม่ได้แสดง") */
const PNL_ENABLED=false;
try{if(!PNL_ENABLED)localStorage.removeItem('gdc-qa-panels')}catch(e){}
function gdcPanels(page){
  if(!PNL_ENABLED){const x=document.getElementById('gdcExtra');if(x)x.remove();return}
  const P=(GDC.PANELS[page]||[]).concat(GDC.RES.filter(r=>r.page===page&&r.auto).map(r=>({id:r.id,t:r.n,u:'',ic:PG_IC[page]||'chart',auto:2})));
  if(!P.length)return;
  const view=document.querySelector('.view.on'); if(!view)return;
  let sec=document.getElementById('gdcExtra');
  if(!sec||!view.contains(sec)){sec=document.createElement('section');sec.id='gdcExtra';sec.className='gdc-extra mb';view.appendChild(sec)}
  const vis=P.filter((p,i)=>i<8||PNL_ALL[page]);
  const need=[...new Set(vis.flatMap(p=>p.ids||[p.id]))].filter(id=>!(id in PNL_DATA)&&!PNL_LOAD[id]);
  need.forEach(id=>{PNL_LOAD[id]=1;GDC.all(id).then(v=>{PNL_DATA[id]=gdcRows(v)}).catch(e=>{PNL_DATA[id]={err:e.message}}).finally(()=>gdcPanels(page))});
  sec.innerHTML=`<div class="gx-h"><span class="gx-ic"></span><div><b>ข้อมูลเพิ่มเติมจากระบบบัญชีข้อมูลจังหวัด</b>
      <span>${P.length} ชุด ดึงสดจาก API · หน่วยงานปรับปรุงที่ระบบบัญชีข้อมูลแล้ว การ์ดเหล่านี้เปลี่ยนตามเอง</span></div>
      <a class="gdcb api" href="apistatus.html#${page}"><i></i>ดูสถานะ API</a></div>
    <div class="grid g2">${P.map((p,i)=>`<div class="c gx-c${p.wide?' gx-w':''}${i>=8&&!PNL_ALL[page]?' gx-more':''}" id="gx-${i}"><header><span class="hdico icow img">${icoImg(p.ic,26)}</span><h3>${p.t}</h3>
      <span class="u">${p.u}</span><span class="r"><span class="chip real">API</span></span></header><div class="b gx-b"><div class="gx-wait">กำลังดึงจากระบบบัญชีข้อมูลจังหวัด…</div></div></div>`).join('')}</div>
    ${P.length>8?`<button class="gx-all" data-gxall="${page}">${PNL_ALL[page]?'ย่อกลับ':'แสดงอีก '+(P.length-8)+' ชุดข้อมูล'}</button>`:''}`;
  P.forEach((p,i)=>{
    const ids=p.ids||[p.id], box=sec.querySelector('#gx-'+i+' .gx-b');
    if(ids.some(id=>!(id in PNL_DATA)))return;
    const bad=ids.find(id=>PNL_DATA[id].err);
    if(bad){box.innerHTML=`<div class="ps-pend">เชื่อมต่อชุดนี้ไม่ได้ · ${PNL_DATA[bad].err}</div>`;return}
    let o; try{o=p.auto?autoBuild(PNL_DATA[ids[0]],p.t):p.build(...ids.map(id=>PNL_DATA[id]),PNL_SEL[i]); if(o&&o.u!=null&&p.auto){const hu=sec.querySelector('#gx-'+i+' header .u');if(hu)hu.textContent=o.u}}catch(e){box.innerHTML='<div class="ps-pend">โครงสร้างข้อมูลไม่ตรงกับที่คาด · ตรวจที่หน้าสถานะ API</div>';console.error(e);return}
    if(!o||((!o.labels||!o.labels.length)&&!o.list)){box.innerHTML='<div class="ps-pend">ชุดข้อมูลนี้ยังไม่มีค่าที่แสดงเป็นกราฟได้</div>';return}
    const listH=o.list?`<div class="gx-list">${o.list.slice(0,14).map(x=>`<span>${x}</span>`).join('')}${o.list.length>14?`<em>และอีก ${f_num(o.list.length-14)} รายการ</em>`:''}</div>`:'';
    if(o.type==='none'){box.innerHTML=(o.kpi?`<div class="gx-kpi">${o.kpi.map(k=>`<div><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join('')}</div>`:'')+listH+`<div class="note">${o.note||''}</div>`;return}
    const col=PAL(), h=o.type==='hbar'?Math.min(420,Math.max(200,o.labels.length*28+50)):o.type==='donut'?260:250;
    box.innerHTML=(o.opts?`<div class="gx-sel">${o.opts.map(x=>`<button class="${x===o.sel?'on':''}" data-gx="${i}" data-gv="${x}">${x}</button>`).join('')}</div>`:'')+
      (o.kpi?`<div class="gx-kpi">${o.kpi.map(k=>`<div><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></div>`).join('')}</div>`:'')+
      `<div class="ch" style="height:${h}px;flex:none"><canvas id="gxc-${i}"></canvas></div>${listH}<div class="note">${o.note||''}</div>`;
    const ds=o.sets.map((s,j)=>({label:s.label,data:s.data,type:s.type||undefined,yAxisID:s.axis||'y',
      backgroundColor:o.type==='donut'?o.labels.map((_,k)=>col[k%col.length]):(s.type==='line'?col[(j+3)%col.length]:col[j%col.length]),
      borderColor:o.type==='donut'?'#fff':col[(s.type==='line'?j+3:j)%col.length],borderWidth:o.type==='line'||s.type==='line'?2.4:o.type==='donut'?2:0,
      borderRadius:o.type==='donut'?0:5,tension:.3,pointRadius:o.type==='line'||s.type==='line'?3:0,fill:false,stack:o.stack?'s':undefined}));
    savePnlQa();
    const fmt=v=>v==null?'—':f(v,o.dec!=null?o.dec:(Math.abs(v)<10&&v%1?2:0));
    mk('gxc-'+i,{type:o.type==='hbar'?'bar':o.type==='donut'?'doughnut':o.type,data:{labels:o.labels,datasets:ds},
      options:Object.assign({plugins:{legend:{display:o.type==='donut'||ds.length>1,position:o.type==='donut'?'right':'bottom',labels:{boxWidth:12,boxHeight:10,font:{size:11}}},
          tooltip:{callbacks:{label:c=>(c.dataset.label?c.dataset.label+' ':'')+fmt(c.raw)+' '+(c.dataset.yAxisID==='y1'?(o.y1||''):(o.u!=null?o.u:p.u))}}}},
        o.type==='donut'?{cutout:'58%'}:{indexAxis:o.type==='hbar'?'y':'x',
          scales:Object.assign({x:ax({stacked:!!o.stack,grid:{display:o.type==='hbar'},ticks:Object.assign({font:{size:10.5},maxRotation:0,autoSkip:true},
              o.type==='hbar'?{callback:v=>fmt(v)}:{})}),
            y:ax({stacked:!!o.stack,beginAtZero:true,grid:{display:o.type!=='hbar'},ticks:{font:{size:10.5},
              callback:o.type==='hbar'?function(v){const l=this.getLabelForValue(v);return l.length>26?l.slice(0,25)+'…':l}:(v=>fmt(v))}})},
            ds.some(d=>d.yAxisID==='y1')?{y1:ax({position:'right',beginAtZero:true,grid:{display:false},ticks:{callback:v=>v+'%'}})}:{})})});
  });
}
function savePnlQa(){try{const o={};Object.keys(PNL_QA).forEach(k=>o[k]=[...PNL_QA[k]]);
  const old=JSON.parse(localStorage.getItem('gdc-qa-panels')||'{}');localStorage.setItem('gdc-qa-panels',JSON.stringify(Object.assign(old,o)))}catch(e){}}
document.addEventListener('click',e=>{const a=e.target.closest('[data-gxall]');if(a){PNL_ALL[a.dataset.gxall]=!PNL_ALL[a.dataset.gxall];gdcPanels(PAGE.id)}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-gx]');if(b){PNL_SEL[b.dataset.gx]=b.dataset.gv;gdcPanels(PAGE.id)}});

/* ════════════════════════════════════════════════════════════════════
   แจ้งเตือนเมื่อหน่วยงานปรับปรุงข้อมูลบนระบบบัญชีข้อมูลจังหวัด
   ตรวจวันที่ปรับปรุงของทุกชุดที่แดชบอร์ดใช้ (resource_show) ทุก 15 นาที
   เจอชุดที่ปรับปรุงใหม่ → ขึ้นจุดแดงที่กระดิ่ง · ล้างแคชชุดนั้นให้หน้าดึงฉบับใหม่ · แจ้งบนเดสก์ท็อปถ้าอนุญาต
   ════════════════════════════════════════════════════════════════════ */
const NOTI={K:'gdc-mod',N:'gdc-notify',A:'gdc-watch-at'};
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(e){return d}};
const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const toISO=x=>x?(/Z|[+-]\d\d:?\d\d$/.test(x)?x:x+'Z'):null;
GDC.notifs=()=>ld(NOTI.N,[]);
GDC.unread=()=>GDC.notifs().filter(n=>!n.read).length;
GDC.watching=false;
GDC.watchUpdates=async function(force,onProgress){
  if(GDC.watching)return {skipped:true};
  const last=ld(NOTI.A,0);
  if(!force&&Date.now()-last<15*60e3){updateBell();return {skipped:true}}
  GDC.watching=true;
  const ids=[...new Set(GDC.RES.filter(r=>r.id).map(r=>r.id))];
  const mod=ld(NOTI.K,null), first=!mod, seen=mod||{}, notes=GDC.notifs(), fresh=[];
  let i=0,done=0;
  const work=async()=>{while(i<ids.length){const id=ids[i++];
    try{const r=await GDC.call('resource_show',{id});const m=toISO(r.last_modified||r.metadata_modified);
      if(m){const prev=seen[id];
        const isNew=first?(Date.now()-new Date(m)<7*864e5):(prev&&new Date(m)>new Date(prev));
        if(isNew&&!notes.some(n=>n.id===id&&n.modified===m)){const x=GDC.RES.find(z=>z.id===id)||{};
          const n={id,n:x.n||r.name,page:x.page,agency:x.agency,modified:m,at:new Date().toISOString(),read:false};
          notes.unshift(n);fresh.push(n);
          try{sessionStorage.removeItem('gdc:'+id);delete GDC._mem[id]}catch(e){}}
        seen[id]=m;}
    }catch(e){}
    done++; if(onProgress)onProgress(done,ids.length);}};
  await Promise.all([work(),work(),work(),work(),work(),work()]);
  sv(NOTI.K,seen); sv(NOTI.N,notes.slice(0,200)); sv(NOTI.A,Date.now());
  GDC.watching=false; updateBell();
  if(fresh.length&&typeof Notification!=='undefined'&&Notification.permission==='granted'){
    try{new Notification('ข้อมูลอัปเดตบนระบบบัญชีข้อมูลจังหวัด '+fresh.length+' ชุด',{body:fresh.slice(0,3).map(x=>x.n).join('\n'),icon:'assets/favicon.png',tag:'gdc-update'})}catch(e){}}
  return {checked:ids.length,fresh:fresh.length,first};
};
function updateBell(){
  const n=GDC.unread(), b=document.getElementById('bellN');
  if(b){b.textContent=n>9?'9+':n||'';b.classList.toggle('on',n>0)}
  const bt=document.getElementById('btnBell'); if(bt)bt.classList.toggle('ring',n>0);
  sgdcDate(); try{if(PAGE)gdcLive(PAGE.id)}catch(e){}
  const p=document.getElementById('notiPanel'); if(p&&p.classList.contains('on'))drawNoti();
}
const PG_NAME={fiscal:'การคลังภาครัฐ',agri:'ภาคเกษตร',labor:'ตลาดแรงงาน',household:'ครัวเรือนและความเหลื่อมล้ำ',population:'ประชากร',
  trade:'การค้าและค่าครองชีพ',tourism:'ภาคการท่องเที่ยว',otop:'OTOP และเศรษฐกิจชุมชน'};
function notiAgo(x){const s=(Date.now()-new Date(x))/1000;return s<3600?Math.max(1,Math.round(s/60))+' นาทีที่แล้ว':s<86400?Math.round(s/3600)+' ชม.ที่แล้ว':Math.round(s/86400)+' วันที่แล้ว'}
function drawNoti(){
  const p=document.getElementById('notiPanel'); if(!p)return;
  const L=GDC.notifs(), u=L.filter(x=>!x.read).length, last=ld(NOTI.A,0);
  const perm=typeof Notification==='undefined'?'none':Notification.permission;
  p.innerHTML=`<div class="np-h"><b>ข้อมูลอัปเดต</b><span>${u?u+' รายการใหม่':'ไม่มีรายการใหม่'}</span>
      <button data-np="chk" title="ตรวจตอนนี้">⟳</button></div>
    <div class="np-l">${L.length?L.slice(0,30).map(x=>`<a class="np-i${x.read?'':' new'}" href="${x.page?x.page+'.html':'apistatus.html'}" data-np-read="${x.id}|${x.modified}">
        <span class="np-d"></span><span class="np-t"><b>${x.n}</b><small>${(GDC.AGENCY&&GDC.AGENCY[x.agency])||''} ปรับปรุงบนระบบบัญชีข้อมูล · ${notiAgo(x.modified)}</small>
        ${x.page?`<em>ใช้ในหน้า${PG_NAME[x.page]||x.page}</em>`:''}</span></a>`).join('')
      :'<div class="np-e">ยังไม่มีการอัปเดต<br><small>ระบบตรวจทุก 15 นาที '+(last?'· ตรวจล่าสุด '+notiAgo(new Date(last).toISOString()):'')+'</small></div>'}</div>
    <div class="np-f">${u?'<button data-np="all">อ่านทั้งหมดแล้ว</button>':''}
      ${perm==='default'?'<button data-np="perm">เปิดแจ้งเตือนบนเดสก์ท็อป</button>':perm==='granted'?'<span class="np-ok">✓ แจ้งเตือนบนเดสก์ท็อปเปิดอยู่</span>':''}
      <a href="apistatus.html#hist">ดูประวัติทั้งหมด ›</a></div>`;
}
document.addEventListener('click',e=>{
  const bell=e.target.closest('#btnBell'), p=document.getElementById('notiPanel');
  if(bell){let pn=p;if(!pn){pn=document.createElement('div');pn.id='notiPanel';document.body.appendChild(pn)}
    pn.classList.toggle('on');if(pn.classList.contains('on'))drawNoti();try{TIP().classList.remove('on')}catch(x){}return}
  const a=e.target.closest('[data-np]');
  if(a){const v=a.dataset.np;
    if(v==='all'){sv(NOTI.N,GDC.notifs().map(x=>Object.assign(x,{read:true})));updateBell();drawNoti()}
    else if(v==='chk'){a.textContent='…';GDC.watchUpdates(true).then(()=>drawNoti())}
    else if(v==='perm'&&typeof Notification!=='undefined'){Notification.requestPermission().then(()=>drawNoti())}
    return}
  const r=e.target.closest('[data-np-read]');
  if(r){const [id,m]=r.dataset.npRead.split('|');sv(NOTI.N,GDC.notifs().map(x=>x.id===id&&x.modified===m?Object.assign(x,{read:true}):x));updateBell()}
  if(p&&p.classList.contains('on')&&!e.target.closest('#notiPanel'))p.classList.remove('on');
});
/* เริ่มตรวจหลังหน้าโหลดเสร็จ และทุก 15 นาทีที่หน้ายังเปิดอยู่ */
window.addEventListener('load',()=>{setTimeout(()=>{updateBell();GDC.watchUpdates()},3000);setInterval(()=>GDC.watchUpdates(),15*60e3)});
