/* ─────────────── 0) ค่าคงที่ ─────────────── */
const CFG = { build:'2.4.0', API:'https://script.google.com/macros/s/AKfycbwtThh7l3ZrMx1HH3O6VHv9V4xtg1Rl6jSzE0Ozwbt6PXTN2sWSS5y9vbnQ9K-DRrbk6A/exec', latest:{y:2569,m:8}, asof:'9 กันยายน 2569' };
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
  series:[{key:'inv',agg:'last',label:'เบิกจ่ายงบลงทุนสะสม',unit:'ล้านบาท',base:2575,trend:.05,seas:.30,kpi:1,dec:0},
          {key:'ope',agg:'last',label:'เบิกจ่ายงบประจำสะสม',unit:'ล้านบาท',base:2262,trend:.03,seas:.16,dec:0}]},
 {id:'crop',sector:'agri',agency:'สำนักงานเกษตรจังหวัดหนองบัวลำภู',lag:15,real:true,
  series:[{key:'value',agg:'sum',label:'มูลค่าผลผลิตพืชอายุสั้น',unit:'ล้านบาท',base:2960,trend:.02,seas:.30,kpi:1,dec:0},
          {key:'area',agg:'last',label:'เนื้อที่ปลูก',agg:'last',unit:'ไร่',base:949634,trend:.008,seas:.06,int:1}]},
 {id:'factory',sector:'industry',agency:'สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู',lag:30,
  series:[{key:'newf',agg:'sum',label:'โรงงานใหม่/ขยายกิจการ',unit:'แห่ง',base:4,trend:.04,seas:.5,kpi:1,int:1},
          {key:'cap',agg:'last',label:'เงินลงทุนสะสม',unit:'ล้านบาท',base:9800,trend:.045,seas:.05,int:1},
          {key:'emp',agg:'last',label:'แรงงานในโรงงาน',agg:'last',unit:'คน',base:6350,trend:.025,seas:.04,int:1}]},
 {id:'power',sector:'industry',agency:'การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู',lag:25,
  series:[{key:'ind',agg:'sum',label:'ไฟฟ้าภาคอุตสาหกรรม',unit:'ล้านหน่วย',base:11.8,trend:.03,seas:.08,kpi:1,dec:2},
          {key:'biz',agg:'sum',label:'ไฟฟ้าภาคธุรกิจ',unit:'ล้านหน่วย',base:7.4,trend:.028,seas:.10,dec:2}]},
 {id:'cpi',sector:'trade',agency:'สำนักงานพาณิชย์จังหวัดหนองบัวลำภู',lag:20,invert:true,
  series:[{key:'idx',agg:'avg',label:'ดัชนีราคาผู้บริโภค',unit:'ดัชนี (2562=100)',base:108.4,trend:.012,seas:.03,kpi:1,dec:1},
          {key:'yoy',agg:'avg',label:'อัตราเงินเฟ้อทั่วไป',unit:'% YoY',base:1.3,trend:0,seas:.55,pct:1,dec:2}]},
 {id:'credit',sector:'trade',agency:'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',lag:30,
  series:[{key:'amt',agg:'sum',label:'วงเงินสินเชื่ออนุมัติ',unit:'ล้านบาท',base:52,trend:.05,seas:.28,kpi:1,dec:1},
          {key:'cnt',agg:'sum',label:'จำนวนรายที่ได้รับอนุมัติ',unit:'ราย',base:29,trend:.035,seas:.24,int:1}]},
 {id:'fuel',sector:'consume',agency:'สำนักงานพลังงานจังหวัดหนองบัวลำภู',lag:35,
  series:[{key:'total',agg:'sum',label:'ปริมาณการใช้น้ำมันรวม',unit:'ล้านลิตร',base:14.2,trend:.02,seas:.09,kpi:1,dec:2},
          {key:'diesel',agg:'sum',label:'ดีเซล',unit:'ล้านลิตร',base:8.6,trend:.018,seas:.12,dec:2}]},
 {id:'car',sector:'consume',agency:'สำนักงานขนส่งจังหวัดหนองบัวลำภู',lag:15,
  series:[{key:'moto',agg:'sum',label:'รถจักรยานยนต์จดทะเบียนใหม่',unit:'คัน',base:735,trend:.02,seas:.19,kpi:1,int:1},
          {key:'car',agg:'sum',label:'รถยนต์นั่งส่วนบุคคล',unit:'คัน',base:118,trend:.03,seas:.24,int:1},
          {key:'comm',agg:'sum',label:'รถเพื่อการพาณิชย์',unit:'คัน',base:64,trend:.035,seas:.30,int:1}]},
 {id:'labor',sector:'labor',agency:'สำนักงานแรงงานจังหวัดหนองบัวลำภู · สำนักงานสถิติจังหวัด',lag:45,freq:'Q',real:true,
  series:[{key:'ue',agg:'last',label:'จำนวนผู้ว่างงาน',unit:'คน',base:2960,trend:.01,seas:.5,kpi:1,int:1},
          {key:'ur',agg:'avg',label:'อัตราการว่างงาน',unit:'%',base:1.12,trend:0,seas:.45,pct:1,dec:2},
          {key:'emp',agg:'last',label:'ผู้มีงานทำ',agg:'last',unit:'คน',base:261684,trend:.008,seas:.03,int:1},
          {key:'force',agg:'last',label:'กำลังแรงงานรวม',unit:'คน',base:264644,trend:.006,seas:.02,int:1}]},
 {id:'social',sector:'labor',agency:'สำนักงานประกันสังคมจังหวัดหนองบัวลำภู',lag:30,
  series:[{key:'m33',agg:'last',label:'ผู้ประกันตน มาตรา 33',unit:'คน',base:21500,trend:.02,seas:.06,kpi:1,int:1},
          {key:'m40',agg:'last',label:'ผู้ประกันตน มาตรา 40',unit:'คน',base:64800,trend:.015,seas:.04,int:1}]},
 {id:'tour',sector:'tourism',agency:'สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู',lag:50,
  series:[{key:'visit',agg:'sum',label:'ผู้เยี่ยมเยือน',unit:'คน-ครั้ง',base:78000,trend:.05,seas:.30,kpi:1,int:1},
          {key:'rev',agg:'sum',label:'รายได้จากการท่องเที่ยว',unit:'ล้านบาท',base:210,trend:.06,seas:.32,dec:1},
          {key:'occ',agg:'avg',label:'อัตราการเข้าพักเฉลี่ย',unit:'%',base:42,trend:.02,seas:.22,pct:1,dec:1}]}
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
      return{...mo,v:+v.toFixed(s.dec??(s.int?0:2))}});
    DB[d.id][s.key]=arr;
    const last=arr[arr.length-1].v,R2=rnd(3571*(di+1)+97*(si+1));
    DBD[d.id][s.key]={};
    DISTRICTS.forEach(dt=>{DBD[d.id][s.key][dt.code]=+(last*dt.w*(.84+R2()*.36)).toFixed(s.int?0:2)});
  })});
function baseAvg(a,y){const q=a.filter(x=>x.y===y);return q.reduce((p,c)=>p+c.v,0)/(q.length||1)}
function buildMei(){
  const base=CFG.latest.y-2;
  const comps=SECTORS.map(sec=>{const idx=MONTHS.map(()=>0);
    sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id),s=d.series[0],arr=DB[id][s.key],b=baseAvg(arr,base)||1;
      arr.forEach((x,i)=>{const r=(x.v/b)*100;idx[i]+=(d.invert?(200-r):r)/sec.datasets.length})});
    return{sec,idx}});
  const out=MONTHS.map((mo,i)=>{let v=0,w=0;comps.forEach(c=>{v+=c.idx[i]*c.sec.weight;w+=c.sec.weight});
    return{...mo,v:+(v/w).toFixed(1)}});
  return{out,comps}}
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
function pctc(a,b){return b?((a-b)/Math.abs(b))*100:null}
function chip(p){if(p==null)return'<span class="chip">—</span>';
  const c=p>.15?'up':p<-.15?'dn':'fl',a=p>.15?'▲':p<-.15?'▼':'▬';
  return`<span class="chip ${c}">${a} ${p>0?'+':''}${p.toFixed(1)}%</span>`}
function spark(vals,color){
  const w=100,h=26,mn=Math.min(...vals),mx=Math.max(...vals),r=(mx-mn)||1;
  const p=vals.map((v,i)=>[i/(vals.length-1)*w,h-2-((v-mn)/r)*(h-6)]);
  const dl='M'+p.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' L');
  const id='s'+Math.random().toString(36).slice(2,8);
  return`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${color}" stop-opacity=".3"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  <path d="${dl} L${w},${h} L0,${h} Z" fill="url(#${id})"/><path d="${dl}" fill="none" stroke="${color}" stroke-width="1.7" stroke-linejoin="round"/>
  <circle cx="${w}" cy="${p[p.length-1][1].toFixed(1)}" r="2.2" fill="${color}"/></svg>`}
function icoImg(name,px){
  return `<img class="ico" src="assets/icons/ic-${name}.png" alt="" width="${px||30}" height="${px||30}"
    loading="lazy" onerror="this.closest('.icow')?this.closest('.icow').classList.add('noimg'):0;this.remove()">`;
}
function kpiCard(o){
  const T=o.go?'button':'div';
  return`<${T} class="kpi"${o.go?` data-go="${o.go}"`:''}${o.tip?` data-tip2="${o.tip}"`:''}>
    <div class="h">${o.img?`<span class="ic icow img" style="background:${o.color}14">${icoImg(o.img,26)}<svg viewBox="0 0 24 24" style="stroke:${o.color}">${IC[o.icon]||''}</svg></span>`
      :o.icon?`<span class="ic" style="background:${o.color}1e"><svg viewBox="0 0 24 24" style="stroke:${o.color}">${IC[o.icon]}</svg></span>`:''}<span>${o.label}</span></div>
    <div class="v n">${o.value}${o.unit?`<small>${o.unit}</small>`:''}</div>
    ${o.spark?`<div class="spark">${o.spark}</div>`:''}
    <div class="f">${o.chip||''}${o.sub?`<span class="sub">${o.sub}</span>`:''}</div></${T}>`}
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
function mk(id,cfg){
  const el=document.getElementById(id);if(!el||typeof Chart==='undefined')return;
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
      <div class="c"><header><h3>${M.extra?M.extra.title:'เปรียบเทียบรายปี'}</h3>${M.extra?`<span class="u">${M.extra.unit}</span>`:''}</header>
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
    return kpiCard({icon:['chart','coin','people','bolt'][i],color:PAL()[i],label:o.s.label,
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
      M.extra.rows.map(r=>`<tr><td>${r[0]}</td><td class="r">${f(r[1],0)}</td>
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
async function loadLive(){
  if(!CFG.API)return;
  try{const r=await jsonp(CFG.API,{action:'series'});
    if(!r||!r.ok)throw 0;
    r.rows.forEach(row=>{const s=DB[row.domain]&&DB[row.domain][row.key];if(!s)return;
      const t=s.find(x=>x.key===row.period);if(!t)return;
      if(row.area==='PROV')t.v=+row.value;else if(DBD[row.domain][row.key])DBD[row.domain][row.key][row.area]=+row.value});
    MEI=buildMei();safeRender();
  }catch(e){}
}



/* ─────────────── 20b) ตารางรายละเอียด: ซิงก์กับ Google Sheet ─────────────── */
const TABLE_OWNER={fiscal:'spend',crop:'crop',fruit:'crop',water:'crop',base:'crop',price:'cpi',labor:'labor',
  otop:'otop',tour:'tour',pop:'pop',irrig:'irrig',house:'house',agri2:'crop',gpp:'*'};
let TBL_META={};
async function loadTables(){
  if(!CFG.API)return;
  try{
    const r=await jsonp(CFG.API,{action:'tables'});
    if(!r||!r.ok||!r.tables)return;
    let n=0;
    Object.keys(r.tables).forEach(k=>{
      if(D[k]!==undefined){ D[k]=r.tables[k]; n++; }
      else if(typeof DX!=='undefined'&&DX[k]!==undefined){ DX[k]=r.tables[k]; n++; }
    });
    TBL_META=r.updated||{};
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
  if(target.querySelector(':scope > .pgbanner'))return;
  const img=new Image();
  img.onload=()=>{
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
  gpp    :{n:'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ',dept:'สำนักนายกรัฐมนตรี',tel:'',doc:'ผลิตภัณฑ์มวลรวมจังหวัด (GPP) แบบปริมาณลูกโซ่'}
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
    <span class="sl-lab">${cfg.label}</span>
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
      <svg viewBox="0 0 24 24"><path d="M4 17.5 10 11l4 3.5 6-7.5"/></svg>เทียบปีก่อน</button>`:''}
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
      else if(st){const ps=periodsOf(c.freq);const i=ps.findIndex(p=>p.k===c.value);
        const n=ps[i+ +st.dataset.step]; if(n)c.value=n.k; else return}
      else if(nw){const ps=periodsOf(c.freq);c.value=ps[ps.length-1].k}
      else if(cp){c.cmp=!c.cmp}
      else return;
      onChange&&onChange(id);
    });
    el.addEventListener('change',e=>{
      if(!e.target.matches('[data-pick]'))return;
      SLC[id].value=e.target.value;
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
  street:{n:'ถนน',     url:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          sub:'abcd',max:19},
  sat   :{n:'ดาวเทียม',url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          max:17},
  topo  :{n:'ภูมิประเทศ',url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          max:17}
};
function baseSwitcher(id){
  return `<div class="basesw" data-base="${id}">${Object.entries(BASEMAPS).map(([k,v],i)=>
    `<button data-bm="${k}" class="${i===0?'on':''}">${v.n}</button>`).join('')}</div>`;
}
function bindBase(id,map,state){
  const el=document.querySelector(`[data-base="${id}"]`); if(!el||el.dataset.b)return;
  el.dataset.b='1';
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-bm]'); if(!b)return;
    el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    const k=b.dataset.bm, cfg=BASEMAPS[k];
    if(state.layer){map.removeLayer(state.layer);state.layer=null}
    if(cfg.url){
      state.layer=L.tileLayer(cfg.url,{maxZoom:cfg.max||18,subdomains:cfg.sub||'abc',opacity:.92}).addTo(map);
      state.layer.bringToBack();
    }
    if(state.onChange)state.onChange(k);
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
const SEAL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAB/lBMVEXeXl3lnGChWCslHBqkX1rb5uEhoUpbJirp2JrzkCOhMBnioJqfLlQYGhnZYicebTYWIR3eapSilWLVMSikzdpgUjRqXk2dW5AeKyRWnlJjUJNfojdpsN2goqBeYmEfba1xwk8hldYljjobfMP6PYLPNGgnckxmmqOhzaIuOZFwMUfuyXYmZFEJUyhVO40mjaJTXFqcpqOfrc7dssbY2tqfO4SYozZuAAB0xO6PxzxRVFI1wk1mw4qLyHb/AAA2UEdXk3EA/3hrloqdxLf/AP8jn2om7qtc57GSl5a13NMlRjo9TEcA/wAA//9owT5y///+yQAAAH8vRD5nKj1VAFV/fwDfv7////8CAgL2+voAAADzdpk5lNHuOnvyZ5D6/LIHqk7U5+0yicnyV4dEmdOItuJNt0kxs0rxZy201e2oyun1haVrqtpUo9j1SYTVl0vuWC2PxkKVxOczh0OxaDLTSynNiEjxdynJeDZ2teTb69Ly1pHPhjpqu0eGttvvt3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADG+YkxAAAAgHRSTlP+///p/v//+f////78nv/+YP7//////v8f//////8Q///////8/f7////9/xcT//9iFv//Fv//Av//n////wFNEQMcHAEHBAlDGFeMAQH/A/8Ch7wDAggA/P8C/v/+/v/////+//////////7///3//////////////////////xjwg9cAACaCSURBVHja5Z2JWyJJmv8jLzIhAcmUQ470KhHLq7qsruqaq2d2ZnZm793fiQdioaCiCDYiYIP6r+/3jciExFLbqunZ2efZt0STK/OT7xVvREZGseJ/c2H/MwB3P5PZ3d3/JoBE8+Q7s7t/W8AR3NuZmZlYxJNYbGZmdnb0kb8VoHvoWYApyvbnokQi38y+/YsZ2V9CR1rbflaUSGzmL2NkX4cn6HyKUxQlkUgKSegTKnUZv9If2VfixSJjtKRtG8bBpBiOndSVMSO55O5/CSDhzcS8QydUh9AM416S2EgkSRLEK3bC+2TkG/fU/rqAHM9VnpKwQQE0xsKqmsxk5lzJZJJJNQzOe3rfTrqMSuxrEL8M0Icn6AgOYK8WPBltvQJoGJT3UKSdcLU48+WI7KvwlCToTAHHaV5x1b2aW8hkFsTmK0GZEYyGrYwR/0qAdOoxgQflke7MLc42Iar6ao5vHL4SmDfEKA2gRhdx9suUyL5EfYrAg0JAp+3s7FQOX3HlvToUeAtzweAcZz6cK7XrlYqm7VRKXI9rI8TYFymRvZjvrVBfUuDtCMnNvao2co1DIEJeLWSCvcwCqe/VRcX9yE69+mrhFanRQyQlzv68gDCKUF/C8ONBtPpOpQIG0IFxQT29VBcItUFvVjikVrlrHC4cOuSMRtJT4uzPCeh5H1l3Ao/LRandLs0dNhpwu14wysi+Df8HKtqOdgaP0BgbHDhCiW9famb2Ir5vI676pM/wdnbOXl00Gnd1gNTV0+Dp5dbFYVub+MTI2ibZmStRmX0hIXsJH08uUJ/B1FwuV6+3b+oThCMAFu2dRsdwGqJkZGnOCSUawhOVb14WzewlfHyHUN90hvyrhEe1DcQzn444iXZ6CkBz/KLrhB4vPZy8dGAkhCP+LIDg4+aF94XniE1IqXRxUxsdWBMke5c9ADLNB1iZdAdNi0OJrpljL9Eh+0m+mEguxqV66Jfq2QgjXscPGZIBsHc6rbnaojdG5hU6Fp4YhZlfqkP2Ij6433SmNAFYyt002pV6HJK7i1erudxFgfBOT6PSzk48XoFa8Z6nRPDxDdI2PFESjvgCHbKX8UkP+QRkFS9WD5EAX9EvFXiI4tOeVtGgPA7PCfGUiL1IEYTGywjZC/wPfPnH+MCVazeA+OrwolqtFi570WDv8vL0lFU4W10ThPUx3kjgiB7h1wOO+cKP0VUbd21SydlOI0fHlII9HsWnvZ5Dhr+o8zDhivQccZy7X0rInmvfeH55nK9Rf5ivtV4QygsG4YVB9SbXQJzX6/ELLjkPsF4ZkXqE3zzf6rHn2t/I43zVWuVsFJtu9qDYJPMCMHoZvMwdXtQqVSSjUqlK0j6rI0qQZOITVrZFxp79OkDOlzy4zx8+8L+7iohKSn+EqPEkIgVhX9If7Bw1OXgdhU6VvkEuetGu13NxfxtIsUyEb5+rbdjzAZxAfil8Fh81EaAIA/ql1SkVmr3eJXxQ0cF3GZS0kcPd8XCvVim11yfa6AoIKWNHnnND9myAKJ/nv8PGDaQdj9facU/ga3HGVadvb0dPkWlOrXr87q7RyMEXXb/ItSfgSOJ54yDxE4HCnnLAWXJg4yCaWXCtdHZXFYe6ad8IqbW5cEYHOTrYi27ruoINtCh3cdjV1zRWa1q9Xh+3Kzy6nWmDB8ozpQ17zsD2Adsjf7vD+ZNL1WpIvw3YCynmopZr5DgnEO8aDCHc6xHdtgxjnwYdeusChj3koSLa7xI8UXMzePwu1/iYYgemMPLuFwEKAydQ/omkxf1p1KxWDy+oOajU+FHBUS1lUGf1evK22uuFtqPkjpeFkohiVxAlJNWSSDyNuzuCXlClA5UbefYLASNUYBnM79TaqDrx8m2lkTurUoyX1OBlsNfb1oNI1rqOzcugWnLLntIEZpXHS8l7/RBuqPD6dfYLAEcGNrWJRoqeVXxuzv/UG9VqhpJ0UN+OIs30rmHk02gwulWv1uqNh4gPJYN8TeH4lBeyJ5sQMjAlkQmkOBzPQz4rlWCoXKPRuGFRHiFJyTTvJUlXggCmooafwLN8VTJy8pkGhT2ZomHgwsUdCDWyLXIuahLyG96fhC7bJSoJtfpZLfcONUwvqCvOYDAwDNMmU0OjZpvXMu3q8zrMDyiSlSfihD2qQN6EsGSp6jkOfOawBA+vtnkrAsBGTuPVHW/4g1CgvJ00gEcDXUnECV5iBUREAQH/vAozosl7IhmyJyNkwM6QUS5yZxeuc/PdXTQQibm7+lnpIhd3zC14Qd1E3gsGFcXkCjTW7m1FQbREESelklpIpRaqDwJl4mkpfM/j5O0LAYUCKUJ2dmo8vSBBYK8lLwBHcshSKmvnHElEiG0MhAbvJRVGRiAHU6VSimVOC270jmK4OvHcVeE3j6qQPZ1iRtkEZUG95PH5dlwIOkEnl0OODgYRIaZBGry/J8Lktgw3DJ4WFgrBVNBe8PMgC/pSDoTihFT47YsARY5WKcUgF7e9GD5z6bgyq1yfC5mg2rMXVOiqBwM7UJ4pdSH39zDyNlWGQXZoRxlMXR2dYAmRVcld3JzdjF5cKHgqnH0RYEx4IBqks4vDC1Gz1NpoLqpnwK1cCF+Ed6eoeFapyOIGNgZSR+5K0pCRkRWetE/VfhQdURQyAg8l1yir5koXDU+FwgsfC+RHABUewqmP1JDCII0GmQTptupWw+0G6fUMJu5RhY8yMChvh0zDkDotyZBsiVQoXZMbAp1qsMIN4eAM677CnwrYOrlOqeQF8mPNCXswSCQsDA/0GQUbuXr95kG/p15aSJ0yil/w6T0JgLZ9cODYRku6v2eovOCGYGRRlru4o+C/QKVAneW410euXLTb9Uo7d7Gg8qrGLQx3nwLc9UJEP5DUSb+uj8Jl1OpVbqrs9JJ3Q7YVVIOmISUdStOGJN1LaPIUEOJ9/DPbORRaoGq3z3J37XYuV+EJ1GuhzkiFSQqTMcgjgPA+aJjqQOSYwgVHw3lXL6rtcWes4huxMtCiIcNEtxWV3A0aNEzZHoTk+3vqOUVBiD4eMrZELV6d992p/G43Shdtz84wBXRbZYYjwgQmnEjZzM8XmXVDxIACiU0kUleBUBrv4NI4ByfUqAG5vFRQZPHesNQyDgzjwJQkRprrgVA/9VplrZ27u7iI36E7Sta+QbjU6dldzpdpyMa7s5EZH6EfkL8RoTKBpXJcfbV6+yZ3BiehQRaUmOiKoxX2ajATQUwBnDSESK2BcWBLA9QLXLoqWRlqPjXo4+3ShesyvC7k5rlwn+VcG/POZCzyGKD7umthNGn+McB6rU0djEatDWev8XEh6giT/wVl1XSl2x0YpiqRD95zyJaqJHhHmQPu3Iia9VGBjVdg45kiVf+Kz8hs3AtWYrszbgyruUad6izyOV73VbgTIcXU22QbqJP3hE+j/wHE6EgolGUJUSxUGBzK8n/AxExErdZwaXK53EPAnM/GxZjyCCBenXWz9IGUQpWHUk+M/vBUTaULGOv12k2u5vYezWifga/VFcIYG9IFkQFdq+vSo4vfrRZep6/X27XaDYpH9PQKhUzjgeRSro13uRnHXYAxoKK4SQZZunDjfq2BwkXLXTTa7ZqTUjN07jd43G1twaSqyiZF7Uqt+7XWw5eZyiTTIYHmGrlCSlXVi4eAOS9Xoxf/VhmrkI3HeZXi98IFDeb/aq2itWu0B4mZqUyhUEg5ti3hqNfTn0mnOxx25OlH5JpfA5UkVbUlwzSc3EMV3rCBwRPNzNviP+rjPsoIMBLWN/7oueBNI8f1R18kbzy7adzkoDMEKB2HRa+nHxWZRA1NPyGgZF0UjExK1e5q1G/1Aaa4E/6SNLiuh0eB7Jn4T8q+vlH0XPCmceMTTUMHOHejciXIIcgTeIlEpy+3JCn6BN/0dCgkI5ZklrohQN8xcjdwwgRPNLPFGX1f+fOEiWFhfUlfL7pZ0LmpjeWmpmn0vKGy6+iTcg3VJRIJvdOXkGdUWY72/Ne3J4TBV2o34/2LP1vcCdHazRY3dNLWrA9wphgLN11AZMGtml/OKmf0u+2YfPzlUYkOW10CTCRQcJlSS251o+N3L4V4W1Gpi85MjQZPfHLHDAJ8yzXYDHup0NNghB0B8K2Ikdpj0nakaOgp6SI3Sy6haqt9ZMLu6E0ZUctk7hshVQiqGu1M42fO4SBtHiUKogSAR2pkAvC7fyHADREjA9Z+FHArxcUJ4zgpnjUcFUeNop6KIrugM9KCmZNwRDxbwxOJu2xU3qIRTq2m4nuebXhfp3525sLBIWsfRdX6SwBu6Ecs8q9+wO+LEausrBOgYtwDsP25jF7DkaZTcT6u5UTlELlYvyOtoUOydo+aWrYBO1iTWh0CjIai7rUxLRRVaxS8xLRF2ms0tgQbXimk52VpDFi2IsXvxoC7u+vKHosUOSCCON5+RmrteGo65LTvsOUBDluopSGDteFpn/p2A7R3MnMBt3irHgpd71RGDnfHUTneXaGQvs0ez8s8jPlAV6S8p/xO1P9MxEhEPVdjoywTP/sJgbXu6C8ACYO1pA9UyaDYagUlqrkGUrfV7xMg0opzA3dTQ+qWpp2NY0Lg5Qrp4+PsMWQ+6wMEjuuEjPPN6OfnqzMckLJM/eynCVX8rhNgnxreltq551NlusEWOAf33WFr2HEBt87uainyP9jUF7XAIzohJycnWa/iQk5ZPT/Xf8sTDaPEuK6Y5p6yvvtyQBCm6gSoCsA+0qC9Bt11g4z4JFlGq8cIkEWden0rNO0I//Ph5dInfgl4gEiEyp5p8YwDQCgyoppCpTFeKmz5AOuuPOCrb8EN6xwwihgBYKLTkaUBTNwFX6slw8StPgfs44TVadV1ujtu27va2V1hjBYIfPoUCIhMXXRtbKrc2gSYVM/PLX2WVOsCjgSl1goJDZT7BcqbluN1p8812EeFkJBlEK51+12km6Et2/3OsM+kqArAeCoqN2qjiOWkvyasAEcjCZwc30bHgPA58zxJOmMzxX9etfYsxm0viq13lTph/eY38/O3t7dZyPHxbfrXK/G6po0Z1agaJ8CoxPotACYAOGz1o32pNUSrIvf7w2FPaHArdOnUOZtTcOKwSrzgcrkCutv522sPkBoOC1CraE4Y7F0ul/fUmHtpCYDOisDKHvsFpkj/mhiFVLaiIUcAng6loYwELfdbrU4n2sJvXVf73dbwFIAqc9Rrxr+3gnQCkpX0JB3w+BF8gH+MqXvl8hGqLoZWuHxULuszxVnPB7P/9pBs7CwnhZU6XdOCsGhI7cryKQt10WyoZON+i6J62AmhyVNbUivUi4bkrhy9VOky2Ly7v8WTgF953mECY0C42yr4ymiRWTGSP4LABceAYk+ujywuBlwnDnziOw6kV/jIqXMdDTE51Avp0hrA5OEQDthFX04UNqrU6uuh0xCaw6iqVeK/9oVEwNPdie/8x0HCqyuiykc4YJM1mf7WBUSayfLPfwpMiu+Us8fplRVNS1EdIF9v6/dGS5U71A1Bn862u+SRCdmQholtql9Dsga8T4FJv/vkNwyd/CjNEOCGDqgmB0Shtb+/r7+dHQEmHuxpwpvhzrc8dG5X4ioBhrbltQE02GlJJnqdhm2sCQ0aa0OZAOWQ/evHdnUSmEAOXI26TaiqURLu7zfDBLiuhJea+/ofiv/X69NNAh7PQ068Jwi223kh2Xl7BGjLCfvePDDsgcG7dCC0DWRHoUEfFEfhHvMQOLDoNXUUruv6UnMprPwDAGf0sB4OK3wm7IwH6Fn15PgHIcLivhdIfsEBFdnggK21A0M6GJjSoNvqcEAalkMUJ1yCCU/x4oPbmG8kxm1x8ZuIngcWSlQCbDKUkKt6xC23TPlX4ptowMcwx2I/J4LwVrwlo6APKR1j0E2oXbtlSIMBjc5IwyFMTA2eEoJCk4FA4BFnuXXFjeJfJUbl1npEp6qWLemUZv5O2S9bpmmVw5F/FwWrPH9Lruaj4yJexa952jq+xUs2M+4RxAcATNiyZKgoaYyWYQyHaJoF4L0BwMc8+WEaC8gmAVJFrYSPOFEejse+ozyzd36+d9RESc1L/igcbf4hnmB8IAJwzbinqLDvJQmVjMm63Q56KDQEkoAGDWkiL0Obj+VXeJVsGPyiHSK4yYnKeYQ02/0uEm6W9/bKzTBKatFpys672nc5fnhCfmGj4UUm7lKHKYkSkKaOoqjud1qUGOUuAQ6kpJ/uamoqQEjLywF/SoTIvNP0D8U/ImxdIvSSGdo3xAgELjnzveh2upl67CVcpfzxAFAyzBBIQhS10BiVgkYXZQLqaRpl0Dmg6sumJ4Epf2oNjKM54HU73bAlpAi1xTGdUdJu7i/pM16e+ZUbWUKWl5eJNb18RZr1mR+AAykEkj515+yWahrIhazf77ekLooZSecmJsCpq+VA+upqKnB1lRZ0V4E0XllOiySNT7gdd95H328SE9PR1MX0JhUL5aOjfV3ZEEMfciAw4SBTVxz3iurfW+z2Nn37w23adgH1jsybjtZQlQa2baDW73eolukMdZ0DLqavphanlq+Wr67IxIuLy9hahq2Xrxavpq7SaTw+eUFcnFH0/aMjIJXLTT3GlPxR2TpHcXPEwkjcdBXMkF2H4T6CU7xC6QvXTmNXOOkpOhDUmU6nuYn1jkSAydYQBSvKfqpmWqraQhDruk6AU1NTVzhNUh+EFDm1nCZS7CnNH9htyB08Kir5MAMToMpHeYXpYLXUsK6WmYqaRhRcV+QedL60MzpZ2jWd/BS0iedXZCkcIskBEa8yFQfdNX6bAUDRHTHYvZTQEzozJHuKyxWdHe1M7DdNT/DyYoAeV1PX7vBbbLWssrKqh1ULcaIzJayGw/mlpq4yhirbdUKoL037vOJgYk/LMAU/6eVFbh+85AGiUet0+h3UC0g5fVJhX0Jo6wkAagBMXglEOKLYIlmEgflf/izBW+II9T/OLabqzaV8GGgKAPOs2URbt8oscy/iOuHyFLRGjKBbFHZJp8VJL08JOEjWdgE7FBbo2QEJMY3GGLDUDYCJmWbaKNjSWTghfqaEzhLC4MvprFBt4ER022O7Mzr6S0xXwuFmk+UBSOVgORy2wjorW2Vlgw+iX/Pjwxhp8pi0OH3a+fKye/rkncfzHqDcJeUNJF2nMmbtHorsAPTATgjAY8rOgZM0ftLk2fQncLwYOMkuniwuLp5kUa3yQfRvaFQBHRAdQCikj8IRBpOX93TVLK/m6bk7AJdYnHJtcQXOxUT2yj3pQJr2jaPwlsA2NRNa6ndNdJ6gxCSlG2TptYNBJ2SoqnFgqxwQDdvJschc8yfz82lK/2n0eX6Df/PUK7PdS000knrUzK8emaqOOEYU/0lBvKyGYfUwFPp2V1zICSFEAglKDQE4ymKaVHDrVh6UebLZRfRYPEDoUKW+sUqAujxEHx69FE1VdNswWswUl1F+/PFHevyomdpnQhPN3EH+WTgdzKmuhs/3LIUKVnRBrXw+vIpY0XlBw1s7bhWgLPKynAxEv+fnwUmnT2dtGA4BKvinQVtrNh9+0+WOhI5xR9ZsRVF0VULuHpP8iIdlaT8+FHGZJMZHjhAdq+F83jLP0a1jNG5kmmEYfq/MlL/7TthYSnB7jEhW6B/+GrRrTXvnHs40dwCoKOqOiqp1TU4kebFPUdxRd0wOuGOaBn1nx0inV37E9zXL5IDaGFMzvYuJu6iuGIcJo55R/pHa4lgS9i5Trkbn2LuUw1bEN7UdvyXeWaQB07LcHRNgCBgwp44OvG1TFQMfNOwPQxl7RfeYAdC20+mCk87+kE1jK520CVQ7f8f1yU8ZbuBa+HsA7sHryoiLZKw4y0QnOYzko1qMytm34oK2Seb48ZyfsjY6UYu2cS50AE0AdlvIMPjpox6kfIhooes3NOZ6fy/dSzumRH3sxUVkJSAi3Sxms7bDLf0OZiRMYzwnYLcIQNU6V8MwKHAYb5ypFdlTy2Hl92L8g0/bIrLmOxqs1XZcwHfmjzRaajo72MaeCVBC7Xs/GDAZnaZu54OqDmUi7EiDe1hflnY080NWZIRb2ggsUquX1sjS75pWkwBFiPBCofh7JVxW0bixMh9IZ/wq2CoDMJU4KAlHs1LQP39nvdtZSaezDp8EWtF+XOHTVeMroLasSoUAZX2b2jNdQfMG5zPNTn8IwH5IYh1Fl0MATHMNQnHZNOX/wOJyobKz49DlPpMrYKTAderDoc4qh1UqZdbF+CDlHkRxvnmEojXGh/qVA6iwou04O1o2e/xDmqZHvavsaA48aYUAtcq5C6h39I4qhVATorRBkQofHPJCQTJ1ua/oAHSc7PwiOoHp+E4ljday4KysOPGVuLZTwGbFU+C3ZD4Uq8CgnCe6Txxw908RtCnMgl6ppzdWYdyJo41avE1TrDQ1KHPxeD674qTxggO1EuC2HoQ/y0p/KBndD2q0o8rdloRKC4B9AUjfXl6p4OyA5Uyt/OYDKTNd2XHIH1c0b27UDCVBploWMMKI4PEYdfEt+ikqTM+OdOWb0cyeNLUiaMuz6R0yt5P9gOyY/WGKwpEuGXNAha5+UYPXHxygrIFh7X63O4QGuYkJEFlpB9HLB6SyTiHxC4qV46xTSWcDi2mfB66jGUGIlNUjtBnjIeBiEdkPCkRHhZEDzO6KyWVmYYrXhFNJPgfascmTqE5YzN5mC44LKHyQydsdDqhpsm3TRRMJW9vbqknZUqvYUBrl/nmcG6FiJ+kscg6ixfQU+N0MhQFDd8libGKUv/jdv0ag2nNzNVwuuw0yD+TlKa5BHiOVeDyJp5+mCstw+MAiIocnalNNJI2dHRV16wCFoI3naD36Ks/jEIqEykoWJTgNRN3e/iLtOHyvU9lfpCsFZ4cZngJjYSpcVs1zuFrkX/zXSVAmoqtsJlEkMgD+0ZvBWkffa0pxaKpGpeLUz+hpQSssogUM/Fs67pB3oaARwuCDQ1hbldGUDN2JAgygpqoVKAPyIi17G3cqgSmqLWFvOLnFGxHugQBEHKxiF+rokrZ3KWwD2kVRs4c6e1Vcj+BxEi/U48m6g3agXk+nf3AKd+l6vV6AAm9/AKCqOupIKM306bKXnOiiVqCXdFe22mhGbrNTn6D/rbNC3ZkKzMNNpgr1wlaUTxGN0GVYJGTrfA9lDPxsY+JSWPH7v9dRY+tHqrpHgHwWtWIMpmuFXLxQ+PAhuxjIBRanEh8KhVzurl7A6X9Ix0cAOhWCaI1RtHJAdEH7/E5oXiDq+l08l0ynqZYsxK1UoR3H5hU26rkCuz/QvSvtM/+nbKnqkY4eiP7nSUCasrCK7FO2jo70f3Jb5CSM/LFwE0jzlmCZl9BZ6tM1GuiJFnIfC7p3UzYJVCipsuPYctKWpf74DV1vfPz4sdG4KUwVPt5Z1s3HXAHPsHHzRhXz+akV/l981NIqUw99fAfCeM7CnxU9DzsjBYmZF8LIqTeFN8s49yw5uGhT09n0mzc0cyH3ELBjJ1XHcWS7Iw+7fsBCjsvHN9hIObncG5r8QMZw5wBHvGlZOtKInleUPzycs0BD/Ovo7+0repjmC+y6Rj5gmYWFN/hB3KF8BVsAWfDD8ht+D3FG1/2AfEIANEgbnY643Z1bWH/j3nT85g3f28Kc+yTnTpWfEfPaNhTYdj+cR4M7++jMo/3wflhvUo6c9W42GEy/WZibK5Xm0FFaLi1Q3kHfae5NqVRamEvqsiuoYYayPKSOyJrEn8tU2AhJ6MmFBT7pkr4HrjdzpQXaKPlvNuC1dFMHQj5S3HhsatT/i6Cubup5jzAmblebnnu1TPc2T83RncPo7tETbM0l5ajHJw+HwWCwQ1dI1tbWWnJXkjvB4IfR21GZ33Q8t/yKdvYGwgcEwmMHRHv7/yPhJuknn1eemLsVCy+F9/P6Pgi/Lf5ufEOOuHN92fdnGYxqNBiVqUZwEeUgKtWWtKauZVQUiH26fMff5/MoOklOFUi/CaSPRQ/nWHZveJl17/8JN/f1/X1A/PIpwFX0j5twxCV96lvocFbxEy77MedWQzSVAgU+H9wKyav0b4hyS03KqwBEZb3qwicIsB+VafzkE+90Ue/m5FeyuBOC36tBfHoT1oUCl1ZpEPMxwA19fwnvh8NLS3qSZl+MbrriBklTl5P3OgMBmDdIs7YQGVCkNzkBHU9Zp0kKaEnEbIVhUE4maSYmPiuLyxs0lvXp5FNA9t0WxvmWcHCoZ2lf908VnZjgGMkvkf48QtHF2zYPpJB7CYcfAO0cnIoDdlRHjg5lDxCJsMO5WqhXuQDQdgQg6TI9/4mPxn86eZQPcDh8PvL4BEfhhPv5/NJSPg8rL38ryv9thQjHQ/QnnxLiiHRQx1Gj/fH0DkmAQYPuizL/iPdxUqIYcpz/nG905HDs+5knAPnVkzAe+X0QKiNCunUy+0kMNJ5kE/IIsKPaQBAovV6vbxjdvpjC0O8JwqBMHxkBQomBk9v542vJx1fkfHRQMvA+dTuemmQboQ8QIWSJss2Md3OnOZ3gQ8ywDVzeO2KIx6kgCaLEMlARDpBn7u/7rmdSAIVGn4e/Jk4Cv8pOSwfmmO9tZHVJHDNMh408NcnWHXxd4qchCH83JhzQrsGnj47G/WrICYhB6qoD05RaB4YhrQ26QxByemRs/1dCiU+Jad/tu8jPEX4xbp9H6P6+vj4xm/rBPOqIC+cRro9vMD5gMs49NC37ZmyRBkPX8jWMDsN2pTWGsvrgQLofSFEpGLq+vqZUE/JP8gpNh9iYjy8/4PK5x4w8PY/aVeEE4W+9W8h1uoVcpmP6ZkTxOW2Q6R7it9+R+l2+SIqktrqdvhTl74Vozts4jqanfbeQ04zaCT4o8LeT09FZ8RkVwtz6/y66S1QgVAZs+jp6/YjAwLwFZmIcCwbutPow8mefu56OGiI83FuLY0p+UiUPb1NkD+8l0f2ns4/GJ/ItugQR18zS9HT0s8NeXiNCpG6/2xq4QlMDyPOuL/0fjkZJfcK8iljyA/XVhP729Ye3RLDPbiaZ1HizGfYm37orGUxPXz6QawoCZJf7NU+kPioZ1A/Ra//npqfZwFUfLQRByyOEmxNH+1yBnwHuriv7fp0zBsJ/8sy8nTQeQRRBOjGHsYsGhl70f2qame7yALSUBs1zgvsx5ufbVz5bUIx9fjuJPgloNZmOE3bNTKtpmGw6ejmethjtBR8RvNjr96PXp2JmI/AmFiOZwf7oqv8koP75HYqP3E8yEScstZk6OqJonlzOBVr05lfSnB5etPpFdPRQKPAZmNNcexPLuSC7HB0xyw/4iIEfA9zd8BuZvd+0mtaRq0RvQZyDAyS6abohhwCp3Bdid7vdIaTbdV9I0k2KwDMeLIjze6jvqNnc3NxkfgOvf37Hy2M3XfmM/P59ajNDOjzi416jJYVUvqRQlEzdk1081ic27npBvmXbKk1ZJtt6SwopQn0xUl/zKJWyfIRk4I0X3lfnRfL7TSgwlXIvPUZmiv5FmQ4E4zSfl2rbXQ9OyLAfpazHaOUob+EoF28mIi6wHmVep5qv33v5IvzondqP3pn41nPD95twQdbkgEdHqhJb9yEqSW9Zq2tqT6hs7vd6fLWKSzQuNPec2r3RslaR2Ld8PkdMUct8f03SX2pz1Gp9u7v70ns7N9z8vrn5/rXV9ADLZOe/L/oWBhNLb9HMS29dsKg7c9oc8Nd9C4OJJa1+T9YVfPBB63UKTv6et1lP3MHLnlrBhQLl/Wv8YyPAo3LZCgstzvqWVkskP19ZDch2MjG5tBrUA+2tYi+0r5QFQNgntbn5Ok8BMvOIAz5zA3TMJdwkvqaF3QnCsrUqEGlxOv8yeXxtOhtCvfWJxekU7rtiRbZVq5yyCDCz+Zp2nGIECBXqMV9H6WX3uOtEuISWpGk1U5mMB1jeK6t6JPbWXXtQ+cnl/WgNQr7aXkRX8WVkBQBa1tHrTaiQ/OH9+yXi+4IboH2ExMcQxq9THp9AXFUiv30rhkxiT1AqtPag61X/DnWvqvwqvyU0CEaEcJM3dc/xPbsQhIJihmswk3ot3KbsIe5ZxBib/YM7sEOYPuGLTLo7+nYdZ7CqWnt74rtIW8KjU68FIGq62BcvY+AS5psE2HzNFQg7i0OkMikQgjG5CmN/sz7z1C42NmgVRV1V+cU378sZYQ5kGQ7YzCtfsRCEF8t02bvZdD1wM4PcLwCtDDRCo91ozehqIikt9s1IYlyhiqKvqlCdZe3hlEaAqcxrL800ebG08TVLaQhCVBycsCmcBvsmQCuTIR2SnEOIwC0NRiNxJJZl0tvne6nUXoY0KL4N/XkqpJmVq5HfFWe+fsUehEq+6QJm0Oq9FkayyntjERjn5/grBs7P6Ue8xj/AzwffS6Vew4th4c1Nj4/c7/H898I1j0SnhgMi6sqbwgszmT0/4flTYrkfSCF0kWDwRTyszYzIqk2q1md+atGjn17WatZr2inuLB8gHZXEsp7gMy2uQfocfYO+SBawLHd3KD9+V/zLVo0qjosj7oUp3pakXsNie+TtwhPPH9ehae7xM0BQ7HHfgHNsuknwyCvgfnLhrRcsrUaX0EZK5IfhR8uQT5GCMinzoRLpubl3Dm/lhK8tS+ieksBYfes/x8plnhIjq2wMmBKAGX58okCcgiqVsc5TFm3gI7CuiVPhOoSmxXfKHh9bVV64GubL1h/02dlrTBAwroIyZGvoi0wPTQEwQ/FqUv57nRIqTE0Chl++5OkLl5gUpVKYSiUPEGoRh4eaMhkTrkh0+Nkzgczf8ryUMrvHR1crlZdZ94sX6aRqjpV9kuEGfJ0ySYN8i2uOnnqq4zoue+0whImK8sXLdH7ZMqdo91Ezlcc1g+thAmfvNbySA0J1Xgra88GVUanxmvwLFjr9ooViRVmnhNkDxD03I2e83JhKWeM87lOe6Hf9ddZhnVjnWQfjnp/wGXFLSEZl7kbxi9fa/arVlEeM4vjPwvE/nG6m+NdfrNhF9BhRhv6kCssWzcL/+nW9v27JcY8RkChHGce0JoSjMboyjUpxo/j1q45/9aLt7gE3eLGv6PpqWPXJ6qqu8yp2ZqNY/K9fE33M+J1b2+9Sr+Sfx10S9Elm3DLvu7/JqvL+ReJGmA/lu5/jPzj42f7rhdnZmZG4//3Cz7Lr/yH/ecVfUf4T0f4YUwJ+y80AAAAASUVORK5CYII=';

function buildShell(active){
  const top=document.getElementById('topbar');
  if(top)top.innerHTML=`
    <button class="tb hamb" id="hamb" aria-label="เมนู"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <div class="seal"><img src="${SEAL}" alt="ตราประจำจังหวัดหนองบัวลำภู"></div>
    <div class="brand"><h1>ศูนย์บัญชาการข้อมูลเศรษฐกิจ จังหวัดหนองบัวลำภู</h1>
      <p>Nong Bua Lam Phu Economic Data Command Center</p></div>
    <div class="sp"></div>
    <div class="asof"><b id="asof">ข้อมูล ณ ${CFG.asof}</b><span>ปีงบประมาณ 2569 · build ${CFG.build}</span></div>
    <button class="tb" id="btnEdit" data-tip2="โหมดแก้ไขตาราง|คลิกที่ตัวเลขในตารางเพื่อแก้ไขได้ทันที บันทึกลงเครื่องนี้"><svg viewBox="0 0 24 24"><path d="M4 20h4.5L19 9.5a2.1 2.1 0 0 0-3-3L5.5 17z"/><path d="M14.5 6.5l3 3"/></svg></button>
    <button class="tb" id="btnTheme"><svg viewBox="0 0 24 24"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/><circle cx="12" cy="12" r="3.6"/></svg></button>
    <button class="tb kioskbtn" id="btnKiosk"><svg viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg><span>จอนำเสนอ</span></button>
    <button class="tb" id="btnPrint"><svg viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z"/></svg></button>
    <a class="tb" href="input.html"><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/></svg><span>กรอกข้อมูล</span></a>`;
  const side=document.getElementById('sidebar');
  if(side)side.innerHTML=
     `<button class="railbtn" id="btnRail" data-tip="ขยายเมนู" aria-label="พับเมนู">
        <svg viewBox="0 0 24 24"><path d="M14.5 7 9.5 12l5 5"/></svg><span>พับเมนู</span></button>`
    +NAVI.map(n=>n.grp?`<div class="grp">${n.grp}</div>`
    :`<a class="nv${n.id===active?' act':''}" href="${n.file}" data-tip="${n.label}">
        <svg viewBox="0 0 24 24">${n.ic}</svg><span>${n.label}</span></a>`).join('')
    +`<div class="sfoot">“ข้อมูลที่เร็วกว่า<br>คือการตัดสินใจที่ดีกว่า”</div>`;

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
    window.addEventListener('error',ev=>{
      if(document.getElementById('bootErr'))return;
      const d=document.createElement('div');d.id='bootErr';
      d.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#fff;color:#c9452f;'+
        'border:1px solid #f0c4bb;border-radius:12px;padding:12px 16px;font:14px/1.6 system-ui;box-shadow:0 12px 30px -14px rgba(0,0,0,.4)';
      d.textContent='โหลดหน้าไม่สมบูรณ์: '+(ev.message||'ไม่ทราบสาเหตุ')+' — ตรวจว่าอัปโหลด ds.css และ ds.js ครบและชื่อไฟล์ตรงตัวพิมพ์เล็กใหญ่';
      document.body.appendChild(d);});
  }
};
let PAGE={id:'',render(){}};
function safeRender(){
  try{PAGE.render()}catch(e){console.error('render '+PAGE.id,e)}
  try{
    document.querySelectorAll('[data-bigico]').forEach(el=>{if(!el.innerHTML)el.innerHTML=icoImg(el.dataset.bigico,52)});
    pageBanner();bindToggle();revealCards();animateNums();
  }catch(e){}
}

document.addEventListener('click',function(e){
  const g=e.target.closest('[data-go]');
  if(!g||e.target.closest('td[data-path]'))return;
  const n=NAVI.find(x=>x.id===g.dataset.go);
  if(n)location.href=n.file;
});
