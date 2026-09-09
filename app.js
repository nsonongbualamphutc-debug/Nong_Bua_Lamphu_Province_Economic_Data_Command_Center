/* ══════════════════════════════════════════════════════════════════
   ศูนย์บัญชาการข้อมูลเศรษฐกิจ จังหวัดหนองบัวลำภู
   app.js — ข้อมูล ตัวเรนเดอร์ ตารางแก้ไขได้ และการตั้งค่า
   ══════════════════════════════════════════════════════════════════ */

/* ─────────────── 0) ค่าคงที่ ─────────────── */
const CFG = { API:'', latest:{y:2569,m:8}, asof:'9 กันยายน 2569' };
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
const REAL = {
  /* สำนักงานคลังจังหวัดหนองบัวลำภู — ครั้งที่ 178/2569 ข้อมูล ณ 4 ก.ย. 2569 */
  fiscal:{
    fn:{
      dis:[{k:'ภาพรวม',alloc:5193.57,val:4838.27,pct:93.16,over:6.16,rank:1},
           {k:'รายจ่ายประจำ',alloc:2393.21,val:2262.78,pct:94.55,over:1.55,rank:12},
           {k:'รายจ่ายลงทุน',alloc:2800.36,val:2575.49,pct:91.97,over:23.97,rank:1}],
      use:[{k:'ภาพรวม',alloc:5193.57,val:4988.84,pct:96.06,over:3.06,rank:3},
           {k:'รายจ่ายประจำ',alloc:2393.21,val:2271.24,pct:94.90,over:0.90,rank:15},
           {k:'รายจ่ายลงทุน',alloc:2800.36,val:2717.60,pct:97.04,over:8.04,rank:4}]},
    mix:{dis:{cur:46.77,inv:53.23},use:{cur:45.53,inv:54.47}},
    prov:[{k:'ภาพรวม',alloc:236.63,dis:216.57,dpct:91.53,drank:4,use:229.99,upct:97.19,urank:8},
          {k:'รายจ่ายประจำ',alloc:37.86,dis:31.92,dpct:84.32,drank:13,use:36.15,upct:95.50,urank:5},
          {k:'รายจ่ายลงทุน',alloc:198.77,dis:184.65,dpct:92.90,drank:5,use:193.83,upct:97.52,urank:23}],
    carry:{alloc:904.76,dis:890.95,pct:98.47,left:13.81}
  },

  /* สำนักงานเกษตรจังหวัด — ภาวะการผลิตพืชอายุสั้น ณ 8 ก.ย. 2569 */
  crop:{
    hh:101836, area:949634.04, yieldKg:2579433666.27,
    rows:[
      {n:'ข้าวนาปี',          hh:60718, area:578005.00, y:0,             per:0,       price:null},
      {n:'อ้อยโรงงาน',        hh:25278, area:289132.78, y:2455221922.05, per:9993.64, price:1.07},
      {n:'มันสำปะหลังโรงงาน', hh:10576, area:64444.76,  y:118968277.72,  per:3291.83, price:2.20},
      {n:'ข้าวโพดเลี้ยงสัตว์', hh:1311,  area:5188.00,   y:2880141.00,    per:753.57,  price:5.78},
      {n:'พืชผัก',            hh:2484,  area:4009.50,   y:1820873.00,    per:570.72,  price:27.21},
      {n:'ถั่วลิสง',          hh:336,   area:942.00,    y:216669.00,     per:241.01,  price:12.26},
      {n:'ถั่วเหลือง',        hh:59,    area:262.00,    y:88200.00,      per:336.64,  price:20.00},
      {n:'ปอเทือง',           hh:38,    area:83.00,     y:21750.00,      per:262.05,  price:35.00},
      {n:'ถั่วเขียวผิวมัน',    hh:15,    area:75.00,     y:5000.00,       per:66.67,   price:40.00},
      {n:'มันเทศ',            hh:3,     area:2.00,      y:5040.00,       per:2520.00, price:25.00}],
    share:[['ข้าวนาปี',60.9],['อ้อยโรงงาน',30.4],['มันสำปะหลังโรงงาน',6.0],['พืชชนิดอื่น ๆ',1.9]]
  },

  /* ไม้ผลเศรษฐกิจสำคัญ ณ มิ.ย. 2569 */
  fruit:[
    {n:'ทุเรียน',  c:'#7a5b2e',farmers:109,area:327.20,yieldArea:95.00, kg:89020, season:'ก.ค. – ส.ค.', pmin:80,pmax:150},
    {n:'ลำไย',    c:'#a67c2b',farmers:248,area:936.75,yieldArea:839.00,kg:391790,season:'ก.ค. – ส.ค.', pmin:10,pmax:50},
    {n:'กาแฟ',    c:'#8c3f2f',farmers:28, area:169.75,yieldArea:141.75,kg:25435, season:'พ.ย. – ม.ค.', pmin:30,pmax:115},
    {n:'เงาะ',    c:'#c0392b',farmers:199,area:705.20,yieldArea:215.20,kg:101320,season:'มี.ค. – พ.ค.', pmin:25,pmax:50},
    {n:'ลิ้นจี่',  c:'#a93858',farmers:30, area:48.25, yieldArea:41.25, kg:18650, season:'มี.ค. – เม.ย.',pmin:35,pmax:80},
    {n:'อินทผลัม',c:'#b07d1f',farmers:52, area:217.00,yieldArea:181.00,kg:234800,season:'ส.ค. – ก.ย.', pmin:null,pmax:null}],

  /* ฐานข้อมูลพื้นฐานด้านการเกษตร ณ ก.ค. 2569 */
  base:{
    amphoe:6,tambon:59,muban:688,chumchon:33,
    pop:502088,popM:249382,popF:252706,
    agriArea:1550000,agriHH:72173,
    org:{obj:1,tessabanMuang:1,tessabanTambon:23,obt:43},
    ageBand:[['16–25 ปี',105],['26–35 ปี',1988],['36–45 ปี',10449],['46–55 ปี',23439],['56–65 ปี',21591],['66 ปีขึ้นไป',9905]],
    bigPlot:{plots:73,farmers:3996,area:36900,
      rows:[['ข้าว',24,1999,20087],['ยางพารา',15,660,9258],['อ้อยโรงงาน',9,355,3910],
            ['ปศุสัตว์',7,228,1779],['พืชผัก',6,238,331],['โคเนื้อ',6,52,434],
            ['ประมง',4,183,192],['มันสำปะหลัง',3,130,1247],['ไม้ผล',1,30,69]]},
    tour:{total:73,byAmphoe:{'3901':18,'3902':17,'3905':11,'3904':10,'3906':10,'3903':7}},
    mainCrop:[
      {n:'ข้าวนาปี 2569/70',    hh:41341,area:414487,per:null,   total:null},
      {n:'อ้อยโรงงาน 2568/69',  hh:25242,area:276100,per:9998.25,total:2022512},
      {n:'มันสำปะหลัง 2568/69', hh:10576,area:64227, per:3198.88,total:109371},
      {n:'ยางพารา 2569',        hh:8045, area:132606,per:218.61, total:18378}],
    organic:{farmers:12,area:39.87},
    inst:[['ศูนย์เรียนรู้การเพิ่มประสิทธิภาพการผลิตสินค้าเกษตร (ศพก.)',6,'ศูนย์'],
          ['ศูนย์จัดการศัตรูพืชชุมชน (ศจช.) เครือข่าย',119,'ศูนย์'],
          ['ศูนย์จัดการดินปุ๋ยชุมชน (ศดปช.)',10,'ศูนย์'],
          ['กลุ่มส่งเสริมอาชีพการเกษตร',717,'ราย'],
          ['กลุ่มแม่บ้านเกษตรกร',690,'ราย'],
          ['กลุ่มยุวเกษตรกร',519,'ราย']],
    vs:['วิสาหกิจชุมชนแปลงใหญ่อ้อยโรงงาน ตำบลโนนเมือง อำเภอโนนสัง',
        'วิสาหกิจชุมชนแปลงใหญ่ผักปลอดภัย ตำบลกุดจิก อำเภอเมืองหนองบัวลำภู'],
    gap:{total:445,area:8.0,rows:[['พืชผัก',214,1867],['ไม้ผล',448,1250.46],['หม่อน (ใบ)',6,40],['ประมง',27,25]]}
  },

  /* แหล่งน้ำเพื่อการเกษตร — ยืนยันแล้วเฉพาะระบบสูบน้ำพลังงานแสงอาทิตย์ */
  water:[
    {n:'ระบบสูบน้ำพลังงานแสงอาทิตย์ (โซลาร์เซลล์)',cnt:281,unit:'แห่ง',benefit:5437,ok:true},
    {n:'บ่อบาดาลเพื่อการเกษตร',                   cnt:null,unit:'แห่ง',benefit:null,ok:false},
    {n:'สถานีสูบน้ำด้วยไฟฟ้า',                     cnt:null,unit:'สถานี',benefit:null,ok:false},
    {n:'แหล่งน้ำในไร่นานอกเขตชลประทาน',            cnt:null,unit:'บ่อ',  benefit:null,ok:false},
    {n:'อ่างเก็บน้ำขนาดเล็กในเขตพื้นที่เกษตร',      cnt:null,unit:'แห่ง',benefit:null,ok:false},
    {n:'พื้นที่ชลประทานจริง',                       cnt:null,unit:'ไร่',  benefit:null,ok:false}
  ],

  gpp:{rows:[{y:2564,value:30120,pc:62800},{y:2565,value:31850,pc:66500},{y:2566,value:33240,pc:69800}],
    struct:[['เกษตรกรรม',28.4],['บริการและอื่น ๆ',24.3],['ค้าส่ง–ค้าปลีก',16.8],
            ['ภาครัฐ การศึกษา สาธารณสุข',16.4],['อุตสาหกรรม',14.1]]}
};

/* ─────────────── 2) ชุดข้อมูลรายหน่วยงาน ─────────────── */
const DATASETS = [
 {id:'spend',sector:'fiscal',agency:'สำนักงานคลังจังหวัดหนองบัวลำภู',lag:20,real:true,
  series:[{key:'inv',label:'เบิกจ่ายงบลงทุนสะสม',unit:'ล้านบาท',base:2575,trend:.05,seas:.30,kpi:1,dec:0},
          {key:'ope',label:'เบิกจ่ายงบประจำสะสม',unit:'ล้านบาท',base:2262,trend:.03,seas:.16,dec:0}]},
 {id:'crop',sector:'agri',agency:'สำนักงานเกษตรจังหวัดหนองบัวลำภู',lag:15,real:true,
  series:[{key:'value',label:'มูลค่าผลผลิตพืชอายุสั้น',unit:'ล้านบาท',base:2960,trend:.02,seas:.30,kpi:1,dec:0},
          {key:'area',label:'เนื้อที่ปลูก',unit:'ไร่',base:949634,trend:.008,seas:.06,int:1}]},
 {id:'factory',sector:'industry',agency:'สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู',lag:30,
  series:[{key:'newf',label:'โรงงานใหม่/ขยายกิจการ',unit:'แห่ง',base:4,trend:.04,seas:.5,kpi:1,int:1},
          {key:'cap',label:'เงินลงทุนสะสม',unit:'ล้านบาท',base:9800,trend:.045,seas:.05,int:1},
          {key:'emp',label:'แรงงานในโรงงาน',unit:'คน',base:6350,trend:.025,seas:.04,int:1}]},
 {id:'power',sector:'industry',agency:'การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู',lag:25,
  series:[{key:'ind',label:'ไฟฟ้าภาคอุตสาหกรรม',unit:'ล้านหน่วย',base:11.8,trend:.03,seas:.08,kpi:1,dec:2},
          {key:'biz',label:'ไฟฟ้าภาคธุรกิจ',unit:'ล้านหน่วย',base:7.4,trend:.028,seas:.10,dec:2}]},
 {id:'cpi',sector:'trade',agency:'สำนักงานพาณิชย์จังหวัดหนองบัวลำภู',lag:20,invert:true,
  series:[{key:'idx',label:'ดัชนีราคาผู้บริโภค',unit:'ดัชนี (2562=100)',base:108.4,trend:.012,seas:.03,kpi:1,dec:1},
          {key:'yoy',label:'อัตราเงินเฟ้อทั่วไป',unit:'% YoY',base:1.3,trend:0,seas:.55,pct:1,dec:2}]},
 {id:'credit',sector:'trade',agency:'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',lag:30,
  series:[{key:'amt',label:'วงเงินสินเชื่ออนุมัติ',unit:'ล้านบาท',base:52,trend:.05,seas:.28,kpi:1,dec:1},
          {key:'cnt',label:'จำนวนรายที่ได้รับอนุมัติ',unit:'ราย',base:29,trend:.035,seas:.24,int:1}]},
 {id:'fuel',sector:'consume',agency:'สำนักงานพลังงานจังหวัดหนองบัวลำภู',lag:35,
  series:[{key:'total',label:'ปริมาณการใช้น้ำมันรวม',unit:'ล้านลิตร',base:14.2,trend:.02,seas:.09,kpi:1,dec:2},
          {key:'diesel',label:'ดีเซล',unit:'ล้านลิตร',base:8.6,trend:.018,seas:.12,dec:2}]},
 {id:'car',sector:'consume',agency:'สำนักงานขนส่งจังหวัดหนองบัวลำภู',lag:15,
  series:[{key:'moto',label:'รถจักรยานยนต์จดทะเบียนใหม่',unit:'คัน',base:735,trend:.02,seas:.19,kpi:1,int:1},
          {key:'car',label:'รถยนต์นั่งส่วนบุคคล',unit:'คัน',base:118,trend:.03,seas:.24,int:1},
          {key:'comm',label:'รถเพื่อการพาณิชย์',unit:'คัน',base:64,trend:.035,seas:.30,int:1}]},
 {id:'labor',sector:'labor',agency:'สำนักงานแรงงานจังหวัดหนองบัวลำภู · สำนักงานสถิติจังหวัด',lag:45,
  series:[{key:'emp',label:'ผู้มีงานทำ',unit:'คน',base:258000,trend:.008,seas:.05,kpi:1,int:1},
          {key:'ur',label:'อัตราการว่างงาน',unit:'%',base:0.92,trend:0,seas:.4,pct:1,dec:2},
          {key:'force',label:'กำลังแรงงานรวม',unit:'คน',base:262000,trend:.006,seas:.04,int:1}]},
 {id:'social',sector:'labor',agency:'สำนักงานประกันสังคมจังหวัดหนองบัวลำภู',lag:30,
  series:[{key:'m33',label:'ผู้ประกันตน มาตรา 33',unit:'คน',base:21500,trend:.02,seas:.06,kpi:1,int:1},
          {key:'m40',label:'ผู้ประกันตน มาตรา 40',unit:'คน',base:64800,trend:.015,seas:.04,int:1}]},
 {id:'tour',sector:'tourism',agency:'สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู',lag:50,
  series:[{key:'visit',label:'ผู้เยี่ยมเยือน',unit:'คน-ครั้ง',base:78000,trend:.05,seas:.30,kpi:1,int:1},
          {key:'rev',label:'รายได้จากการท่องเที่ยว',unit:'ล้านบาท',base:210,trend:.06,seas:.32,dec:1},
          {key:'occ',label:'อัตราการเข้าพักเฉลี่ย',unit:'%',base:42,trend:.02,seas:.22,pct:1,dec:1}]}
];

const SECTORS = [
 {id:'fiscal',  name:'การคลังภาครัฐ',       icon:'bank',   color:'#0d9268',weight:.24,datasets:['spend'],
  pitch:'ตัวขับเคลื่อนอันดับหนึ่งของเศรษฐกิจจังหวัด',
  desc:'เม็ดเงินงบประมาณที่รัฐอัดเข้าสู่ระบบเศรษฐกิจจังหวัด'},
 {id:'agri',    name:'ภาคเกษตรและฐานราก',   icon:'leaf',   color:'#66a33a',weight:.24,datasets:['crop'],
  pitch:'ครัวเรือนเกษตรกร 101,836 ครัวเรือน',
  desc:'พืชอายุสั้น ไม้ผล แหล่งน้ำ และสถาบันเกษตรกร'},
 {id:'industry',name:'อุตสาหกรรมและการผลิต',icon:'factory',color:'#356aad',weight:.16,datasets:['factory','power'],
  pitch:'ยืนยันด้วยปริมาณไฟฟ้าที่ใช้จริง',
  desc:'โรงงาน เงินลงทุน การจ้างงาน และการใช้ไฟฟ้า'},
 {id:'trade',   name:'การค้าและค่าครองชีพ', icon:'cart',   color:'#b5851a',weight:.14,datasets:['cpi','credit'],
  pitch:'เงินในกระเป๋าซื้อของได้เท่าเดิมหรือไม่',
  desc:'ดัชนีราคาผู้บริโภคและสินเชื่อเพื่อการลงทุน'},
 {id:'consume', name:'การบริโภคและพลังงาน', icon:'bolt',   color:'#d0563f',weight:.12,datasets:['fuel','car'],
  pitch:'ตัวชี้ที่เห็นผลเร็วที่สุด',
  desc:'การใช้น้ำมันเชื้อเพลิงและรถจดทะเบียนใหม่'},
 {id:'labor',   name:'ตลาดแรงงาน',          icon:'brief',  color:'#7d5b8f',weight:.07,datasets:['labor','social'],
  pitch:'คนมีงานทำ คือกำลังซื้อที่ยั่งยืน',
  desc:'การมีงานทำ การว่างงาน และผู้ประกันตน'},
 {id:'tourism', name:'ภาคการท่องเที่ยว',    icon:'plane',  color:'#12867e',weight:.03,datasets:['tour'],
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

let SET={coverUrl:'',coverOp:34,sideUrl:'',sideOp:22,accent:'#0d9268',kiosk:20,api:''};
(function loadSet(){try{const r=localStorage.getItem(LS.set);if(r)Object.assign(SET,JSON.parse(r))}catch(e){}})();
function saveSet(){try{localStorage.setItem(LS.set,JSON.stringify(SET))}catch(e){alert('บันทึกไม่สำเร็จ — พื้นที่เก็บข้อมูลในเบราว์เซอร์เต็ม (รูปอาจใหญ่เกินไป)')}}
function applySet(){
  const r=document.documentElement;
  if(SET.accent){r.style.setProperty('--brand',SET.accent)}
  r.style.setProperty('--cover-img',SET.coverUrl?`url("${SET.coverUrl}")`:'none');
  r.style.setProperty('--side-img',SET.sideUrl?`url("${SET.sideUrl}")`:'none');
  r.style.setProperty('--side-op',(SET.sideOp||0)/100);
  const cb=document.getElementById('coverBg');if(cb)cb.style.opacity=(SET.coverOp||0)/100;
  CFG.API=SET.api||'';
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
function kpiCard(o){
  const T=o.go?'button':'div';
  return`<${T} class="kpi"${o.go?` data-go="${o.go}"`:''}${o.tip?` data-tip2="${o.tip}"`:''}>
    <div class="h">${o.icon?`<span class="ic" style="background:${o.color}1e"><svg viewBox="0 0 24 24" style="stroke:${o.color}">${IC[o.icon]}</svg></span>`:''}<span>${o.label}</span></div>
    <div class="v n">${o.value}${o.unit?`<small>${o.unit}</small>`:''}</div>
    ${o.spark?`<div class="spark">${o.spark}</div>`:''}
    <div class="f">${o.chip||''}${o.sub?`<span class="sub">${o.sub}</span>`:''}</div></${T}>`}
function gaugeSvg(p,color){
  const R=34,cx=39,cy=41,C=Math.PI*R,v=Math.min(100,p)/100;
  return`<svg viewBox="0 0 78 47"><path d="M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${cv('--line')}" stroke-width="8" stroke-linecap="round"/>
  <path d="M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
   stroke-dasharray="${(C*v).toFixed(1)} ${C.toFixed(1)}"/></svg>`}
/* เซลล์ตารางที่แก้ไขได้ */
function ec(path,val,dec,cls){
  return`<td class="${cls||'r'}" data-path="${path}"${dec!=null?` data-dec="${dec}"`:''}>${val}</td>`}

/* ─────────────── 6) tooltip ─────────────── */
const TIP=()=>document.getElementById('tip');
function initTip(){
  document.addEventListener('mouseover',e=>{
    const el=e.target.closest('[data-tip2]');if(!el)return;
    const parts=String(el.dataset.tip2).split('|');
    TIP().innerHTML=`<div class="tt">${parts[0]}</div>`+(parts[1]?`<div class="td">${parts[1]}</div>`:'')+
      (parts[2]?`<div class="ts">${parts[2]}</div>`:'');
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
  Chart.defaults.font.family="'IBM Plex Sans Thai',system-ui,sans-serif";
  Chart.defaults.font.size=11;Chart.defaults.color=cv('--dim');
  Chart.defaults.plugins.legend.labels.boxWidth=9;
  Chart.defaults.plugins.legend.labels.boxHeight=9;
  Chart.defaults.plugins.legend.labels.usePointStyle=true;
  Chart.defaults.plugins.tooltip.backgroundColor=cv('--ink');
  Chart.defaults.plugins.tooltip.padding=10;
  Chart.defaults.plugins.tooltip.cornerRadius=9;
  Chart.defaults.plugins.tooltip.titleFont={size:12.5,family:"'Anuphan',sans-serif",weight:'600'};
  Chart.defaults.maintainAspectRatio=false;
}
const CH={};
function mk(id,cfg){const el=document.getElementById(id);if(!el)return;if(CH[id])CH[id].destroy();CH[id]=new Chart(el,cfg)}
const ax=(e={})=>({grid:{color:cv('--grid'),drawTicks:false},border:{display:false},
  ticks:{padding:6,maxRotation:0,autoSkipPadding:14},...e});
const PAL=()=>[cv('--brand'),cv('--blue'),cv('--gold'),cv('--coral'),cv('--leaf'),cv('--brand2'),cv('--plum')];

/* ─────────────── 8) router ─────────────── */
const RENDER={cover:renderCover,overview:renderOverview,gpp:renderGpp,fiscal:renderFiscal,agri:renderAgri,
  industry:()=>renderSector('industry'),trade:()=>renderSector('trade'),consume:()=>renderSector('consume'),
  labor:()=>renderSector('labor'),tourism:()=>renderSector('tourism'),
  area:renderArea,report:renderReport,sources:renderSources,settings:renderSettings};
let CUR='overview';
function go(id){
  if(!document.getElementById('v-'+id))id='overview';
  CUR=id;
  $$('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+id));
  $$('.nv[data-go]').forEach(b=>b.classList.toggle('act',b.dataset.go===id));
  document.body.classList.toggle('cover',id==='cover');
  document.body.classList.remove('navopen');
  $('#main').scrollTop=0;
  (RENDER[id]||(()=>{}))();
  location.hash=id;
}

/* ─────────────── 9) หน้าปก ─────────────── */
function cropValue(){return D.crop.rows.reduce((a,r)=>a+(r.price?r.y*r.price:0),0)/1e6}
function renderCover(){
  $('#cvStats').innerHTML=[
    ['93.16%','เบิกจ่ายงบประมาณ<br>อันดับ 1 ของประเทศ'],
    [f(D.fiscal.fn.dis[0].val,0),'ล้านบาท เม็ดเงินภาครัฐ<br>ที่ลงสู่พื้นที่แล้ว'],
    [f(cropValue(),0),'ล้านบาท มูลค่าผลผลิต<br>พืชอายุสั้นทั้งจังหวัด'],
    [f(D.base.pop,0),'ประชากรจังหวัด<br>ใน 6 อำเภอ 59 ตำบล']
  ].map(x=>`<div class="cvst"><b class="n">${x[0]}</b><span>${x[1]}</span></div>`).join('');
  $('#portalGrid').innerHTML=SECTORS.map(s=>{
    const agy=[...new Set(s.datasets.map(id=>DATASETS.find(x=>x.id===id).agency))]
      .map(a=>a.replace('สำนักงาน','สนง.').replace('จังหวัดหนองบัวลำภู','จ.นภ.')).join(' · ');
    const real=s.datasets.some(id=>DATASETS.find(x=>x.id===id).real);
    return`<button class="pcard" data-go="${s.id}">
      <span class="pi" style="background:${s.color}1e"><svg viewBox="0 0 24 24" style="stroke:${s.color}">${IC[s.icon]}</svg></span>
      <h4>${s.name}</h4><p>${s.desc}</p>
      <div class="pm">${real?'<span class="chip real">ข้อมูลจริง</span>':'<span class="chip mock">โครงร่าง</span>'}<span>${agy}</span></div></button>`}).join('')+
    `<button class="pcard" data-go="area">
      <span class="pi" style="background:${cv('--brand2')}1e"><svg viewBox="0 0 24 24" style="stroke:${cv('--brand2')}"><path d="M9 3.5 3.5 6v14.5L9 18l6 2.5 5.5-2.5V3.5L15 6z"/><path d="M9 3.5V18M15 6v14.5"/></svg></span>
      <h4>ข้อมูลเชิงพื้นที่</h4><p>เปรียบเทียบทุกตัวชี้วัดระหว่าง 6 อำเภอ บนแผนที่</p>
      <div class="pm"><span class="chip">แผนที่รายอำเภอ</span></div></button>`;
}

/* ─────────────── 10) ภาพรวม ─────────────── */
function renderOverview(){
  const s=MEI.out,last=s[s.length-1],yo=pctc(last.v,s[s.length-13].v),mo=pctc(last.v,s[s.length-2].v);
  $('#meiVal').textContent=last.v.toFixed(1);
  $('#meiYoY').textContent=(yo>0?'▲ +':'▼ ')+yo.toFixed(1)+'% เทียบปีก่อน';
  $('#meiMoM').textContent=(mo>0?'+':'')+mo.toFixed(1)+'% เทียบเดือนก่อน';
  $('#asof').textContent='ข้อมูล ณ '+CFG.asof;
  $('#heroSay').textContent=last.v>=103?'เศรษฐกิจจังหวัดขยายตัวชัดเจนในเดือนนี้'
    :last.v>=100?'เศรษฐกิจจังหวัดขับเคลื่อนด้วยเงินภาครัฐและภาคเกษตร'
    :last.v>=97?'เศรษฐกิจจังหวัดทรงตัว มีสัญญาณชะลอตัว':'เศรษฐกิจจังหวัดหดตัว ควรเร่งมาตรการกระตุ้น';
  $('#heroPil').innerHTML=[
    ['93.16%','เบิกจ่ายงบประมาณ<br>อันดับ 1 ของประเทศ'],
    [f(D.fiscal.fn.dis[0].val,0),'ล้านบาท เม็ดเงินรัฐ<br>ที่ลงสู่พื้นที่แล้ว'],
    [f(cropValue(),0),'ล้านบาท มูลค่าผลผลิต<br>พืชอายุสั้น']
  ].map(x=>`<div class="pil"><b class="n">${x[0]}</b><span>${x[1]}</span></div>`).join('');
  drawRibbon();

  const pw=DB.power.ind,cp=DB.cpi.yoy,ca=DB.car.moto,lb=DB.labor.emp;
  $('#homeKpi').innerHTML=[
    kpiCard({icon:'bank',color:cv('--brand'),label:'เบิกจ่ายงบประมาณ',value:'93.16',unit:'%',
      chip:'<span class="chip up">อันดับ 1 ของประเทศ</span>',sub:'4,838 จาก 5,194 ลบ.',go:'fiscal',
      tip:'ผลการเบิกจ่ายงบประมาณ|เงินที่ออกจากระบบคลังจริงแล้ว เทียบกับงบที่ได้รับจัดสรร|ที่มา: สนง.คลังจังหวัดหนองบัวลำภู ครั้งที่ 178/2569'}),
    kpiCard({icon:'coin',color:cv('--brand2'),label:'เม็ดเงินรัฐลงพื้นที่',value:f(D.fiscal.fn.dis[0].val,0),unit:'ลบ.',
      chip:'<span class="chip up">สูงกว่าเป้า 6.16%</span>',sub:'ปีงบประมาณ 2569',go:'fiscal',
      tip:'เม็ดเงินภาครัฐ|ยิ่งเบิกจ่ายเร็ว เงินยิ่งหมุนในพื้นที่เร็ว กระทบผู้รับเหมา แรงงาน ร้านวัสดุโดยตรง'}),
    kpiCard({icon:'leaf',color:cv('--leaf'),label:'มูลค่าผลผลิตเกษตร',value:f(cropValue(),0),unit:'ลบ.',
      chip:'<span class="chip">อ้อยโรงงาน 89%</span>',sub:'จาก 949,634 ไร่',go:'agri',
      tip:'มูลค่าผลผลิตพืชอายุสั้น|คำนวณจาก ผลผลิต × ราคาที่เกษตรกรขายได้ ยังไม่รวมข้าวนาปีที่อยู่ระหว่างฤดูกาล|ที่มา: สนง.เกษตรจังหวัด ณ 8 ก.ย. 2569'}),
    kpiCard({icon:'factory',color:cv('--blue'),label:'ไฟฟ้าภาคอุตสาหกรรม',value:f(pw[35].v,2),unit:'ล้านหน่วย',
      chip:chip(pctc(pw[35].v,pw[23].v)),spark:spark(pw.slice(-18).map(x=>x.v),cv('--blue')),go:'industry',
      tip:'การใช้ไฟฟ้าภาคอุตสาหกรรม|ตัวชี้เชิงประจักษ์ที่บอกว่าโรงงานเดินเครื่องจริงหรือไม่'}),
    kpiCard({icon:'chart',color:cv('--gold'),label:'อัตราเงินเฟ้อทั่วไป',value:f(cp[35].v,2),unit:'% YoY',
      chip:'<span class="chip fl">ดัชนี '+f(DB.cpi.idx[35].v,1)+'</span>',
      spark:spark(cp.slice(-18).map(x=>x.v),cv('--gold')),go:'trade',
      tip:'อัตราเงินเฟ้อทั่วไป|บอกว่าเงินเท่าเดิมซื้อของได้น้อยลงแค่ไหน เทียบเดือนเดียวกันปีก่อน'}),
    kpiCard({icon:'people',color:cv('--plum'),label:'ผู้มีงานทำ',value:f(lb[35].v,0),unit:'คน',
      chip:'<span class="chip">ว่างงาน '+f(DB.labor.ur[35].v,2)+'%</span>',
      spark:spark(lb.slice(-18).map(x=>x.v),cv('--plum')),go:'labor',
      tip:'ผู้มีงานทำในจังหวัด|ฐานกำลังซื้อที่แท้จริง ถ้าตัวเลขนี้ลด ยอดขายปลีกจะตามลงในอีก 1–2 เดือน'})
  ].join('');

  $('#sectorTiles').innerHTML=SECTORS.map(sec=>{
    const rows=sec.datasets.map(id=>{const d=DATASETS.find(x=>x.id===id),ss=d.series[0],arr=DB[id][ss.key];
      return`<div class="rw"><span>${ss.label}</span><b>${f(arr[35].v,ss.dec??0)}</b><i>${ss.unit}</i></div>`}).join('');
    const agy=[...new Set(sec.datasets.map(id=>DATASETS.find(x=>x.id===id).agency))]
      .map(a=>a.replace('สำนักงาน','สนง.').replace('จังหวัดหนองบัวลำภู','จ.นภ.')).join(' · ');
    return`<button class="sect" data-go="${sec.id}">
      <div class="sh"><span class="sic" style="background:${sec.color}1e"><svg viewBox="0 0 24 24" style="stroke:${sec.color}">${IC[sec.icon]}</svg></span>
        <div><h4>${sec.name}</h4><div class="ag">${agy}</div></div></div>
      <div style="font-size:11.5px;color:var(--dim)">${sec.pitch}</div>${rows}</button>`}).join('');

  const lag=[{n:'GPP จังหวัด (สศช.)',v:730,c:cv('--coral')},{n:'รายงานคลังจังหวัด',v:60,c:cv('--gold')},
    ...DATASETS.map(d=>({n:d.agency.split(' · ')[0].replace('สำนักงาน','สนง.').replace('จังหวัดหนองบัวลำภู','จ.นภ.'),v:d.lag,c:cv('--blue')})),
    {n:'ดัชนี NBL–MEI',v:15,c:cv('--brand')}].sort((a,b)=>b.v-a.v);
  mk('cLag',{type:'bar',data:{labels:lag.map(x=>x.n),
    datasets:[{data:lag.map(x=>x.v),backgroundColor:lag.map(x=>x.c),borderRadius:4,barThickness:10}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>'ช้าประมาณ '+c.raw+' วัน'}}},
      scales:{x:ax({type:'logarithmic',ticks:{callback:v=>v+' วัน'}}),y:ax({grid:{display:false},ticks:{font:{size:9.5}}})}}});

  $('#feed').innerHTML=DATASETS.slice().sort((a,b)=>a.lag-b.lag).map(d=>{
    const st=d.lag<=25?[cv('--good'),'ส่งแล้ว']:d.lag<=45?[cv('--warn'),'รอยืนยัน']:[cv('--bad'),'ค้างส่ง'];
    return`<div style="display:flex;align-items:center;gap:9px;padding:6px 2px;border-bottom:1px solid var(--line2);font-size:12px">
      <span class="dot" style="background:${st[0]}"></span>
      <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dim)">${d.agency.split(' · ')[0].replace('สำนักงาน','สนง.')}</span>
      <span style="font-size:11px;color:${st[0]}">${st[1]}</span></div>`}).join('');
}
function drawRibbon(){
  const sv=$('#ribbon');if(!sv)return;
  const s=MEI.out,W=460,H=56;sv.setAttribute('viewBox',`0 0 ${W} ${H}`);
  const mn=Math.min(...s.map(x=>x.v))-1,mx=Math.max(...s.map(x=>x.v))+1,r=mx-mn,bw=W/s.length;
  const zy=H-6-((100-mn)/r)*(H-14);
  let g=`<line x1="0" y1="${zy.toFixed(1)}" x2="${W}" y2="${zy.toFixed(1)}" stroke="rgba(255,255,255,.3)" stroke-dasharray="3 4"/>`;
  s.forEach((m,i)=>{const y=H-6-((m.v-mn)/r)*(H-14),h=Math.max(2,Math.abs(zy-y)),top=Math.min(y,zy);
    const col=m.v>=100?'#4fd6a0':m.v>=97?'#e7c667':'#f08a76';
    g+=`<rect x="${(i*bw+bw*.17).toFixed(1)}" y="${top.toFixed(1)}" width="${(bw*.66).toFixed(1)}" height="${h.toFixed(1)}" rx="1.5"
      fill="${col}" opacity="${i===35?1:(.42+.5*i/36).toFixed(2)}"><title>${TH_M[m.m-1]} ${m.y} · ${m.v.toFixed(1)}</title></rect>`});
  sv.innerHTML=g;
}

/* ─────────────── 11) GPP ─────────────── */
function renderGpp(){
  const s=MEI.out,last=s[35],G=D.gpp.rows,n=G.length-1;
  $('#gppKpi').innerHTML=[
    kpiCard({icon:'chart',color:cv('--brand'),label:'ดัชนีเศรษฐกิจรายเดือน',value:last.v.toFixed(1),
      chip:chip(pctc(last.v,s[23].v)),sub:'ฐาน 100 = เฉลี่ยปี 2567',
      tip:'NBL–MEI|ดัชนีที่จังหวัดสร้างเองจากข้อมูลเร็ว 11 ชุด เพื่อไม่ต้องรอ GPP ที่ช้า 2 ปี'}),
    kpiCard({icon:'coin',color:cv('--brand2'),label:`GPP ปี ${G[n].y}`,value:f(G[n].value,0),unit:'ลบ.',
      chip:chip(pctc(G[n].value,G[n-1].value)),sub:'ประกาศช้า 2 ปี'}),
    kpiCard({icon:'people',color:cv('--blue'),label:'GPP ต่อหัว',value:f(G[n].pc,0),unit:'บาท/คน/ปี',
      chip:chip(pctc(G[n].pc,G[n-1].pc)),sub:'ประชากร '+f(D.base.pop,0)+' คน'}),
    kpiCard({icon:'leaf',color:cv('--leaf'),label:'สัดส่วนภาคเกษตรใน GPP',value:'28.4',unit:'%',
      chip:'<span class="chip">ประเทศ 8.7%</span>',sub:'เศรษฐกิจฐานเกษตรชัดเจน',
      tip:'โครงสร้างเศรษฐกิจ|ภาคเกษตรของจังหวัดมีสัดส่วนสูงกว่าค่าเฉลี่ยประเทศกว่า 3 เท่า นโยบายเกษตรจึงมีผลต่อ GPP มากเป็นพิเศษ'})
  ].join('');

  mk('cMei',{type:'line',data:{labels:MONTHS.map(m=>m.label),datasets:[
    {label:'หนองบัวลำภู',data:s.map(x=>x.v),borderColor:cv('--brand'),backgroundColor:cv('--brand')+'20',borderWidth:2.6,pointRadius:0,tension:.32,fill:true},
    {label:'ภาคตะวันออกเฉียงเหนือ',data:NAT.ne,borderColor:cv('--gold'),borderWidth:1.7,pointRadius:0,tension:.32,borderDash:[5,4]},
    {label:'ทั้งประเทศ',data:NAT.th,borderColor:cv('--blue'),borderWidth:1.7,pointRadius:0,tension:.32}]},
    options:{interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom',labels:{padding:12}}},
      scales:{x:ax({grid:{display:false},ticks:{maxTicksLimit:13,font:{size:9.5}}}),y:ax()}}});

  mk('cStruct',{type:'doughnut',data:{labels:D.gpp.struct.map(r=>r[0]),
    datasets:[{data:D.gpp.struct.map(r=>r[1]),backgroundColor:PAL(),borderColor:cv('--card'),borderWidth:3}]},
    options:{cutout:'58%',plugins:{legend:{position:'bottom',labels:{padding:9,font:{size:10.5}}},
      tooltip:{callbacks:{label:c=>c.label+' '+c.raw+'%'}}}}});

  mk('cGpp',{type:'bar',data:{labels:G.map(r=>'ปี '+r.y),datasets:[
    {type:'bar',label:'GPP (ล้านบาท)',data:G.map(r=>r.value),backgroundColor:cv('--brand'),borderRadius:6,barPercentage:.5,yAxisID:'y'},
    {type:'line',label:'GPP ต่อหัว (บาท/ปี)',data:G.map(r=>r.pc),borderColor:cv('--gold'),borderWidth:2.4,pointRadius:4,pointBackgroundColor:cv('--gold'),tension:.25,yAxisID:'y2'}]},
    options:{plugins:{legend:{position:'bottom',labels:{padding:11}}},
      scales:{x:ax({grid:{display:false}}),y:ax({ticks:{callback:v=>f(v,0)}}),
        y2:{position:'right',grid:{display:false},border:{display:false},ticks:{callback:v=>f(v,0),font:{size:9.5}}}}}});

  $('#tGpp').innerHTML=`<thead><tr><th>ปี พ.ศ.</th><th class="r">GPP (ล้านบาท)</th><th class="r">GPP ต่อหัว (บาท)</th><th class="r">%YoY</th></tr></thead><tbody>`+
    G.map((r,i)=>`<tr><td>${r.y}</td>${ec('gpp.rows.'+i+'.value',f(r.value,0),0)}${ec('gpp.rows.'+i+'.pc',f(r.pc,0),0)}
      <td class="r">${i?((r.value-G[i-1].value)/G[i-1].value*100).toFixed(1)+'%':'—'}</td></tr>`).join('')+'</tbody>';
  applyEditMode();

  const drv=MEI.comps.map(c=>({n:c.sec.name,color:c.sec.color,v:+((c.idx[35]-c.idx[23])*c.sec.weight).toFixed(2)})).sort((a,b)=>b.v-a.v);
  mk('cContrib',{type:'bar',data:{labels:drv.map(d=>d.n),
    datasets:[{data:drv.map(d=>d.v),backgroundColor:drv.map(d=>d.v>=0?d.color:cv('--coral')),borderRadius:5,barThickness:15}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>(c.raw>0?'+':'')+c.raw+' จุดดัชนี'}}},
      scales:{x:ax(),y:ax({grid:{display:false},ticks:{font:{size:10.5}}})}}});
}

/* ─────────────── 12) การคลัง ─────────────── */
let fiscalMode='dis';
function renderFiscal(){
  const F=D.fiscal;
  $('#fiscalKpi').innerHTML=[
    kpiCard({icon:'bank',color:cv('--brand'),label:'เบิกจ่ายภาพรวม',value:F.fn.dis[0].pct.toFixed(2),unit:'%',
      chip:'<span class="chip up">อันดับ '+F.fn.dis[0].rank+' ของประเทศ</span>',sub:'สูงกว่าเป้าหมาย '+F.fn.dis[0].over+'%'}),
    kpiCard({icon:'coin',color:cv('--brand2'),label:'ใช้จ่ายภาพรวม',value:F.fn.use[0].pct.toFixed(2),unit:'%',
      chip:'<span class="chip up">อันดับ '+F.fn.use[0].rank+' ของประเทศ</span>',sub:f(F.fn.use[0].val,2)+' ล้านบาท'}),
    kpiCard({icon:'factory',color:cv('--blue'),label:'เบิกจ่ายงบลงทุน',value:F.fn.dis[2].pct.toFixed(2),unit:'%',
      chip:'<span class="chip up">อันดับ '+F.fn.dis[2].rank+' ของประเทศ</span>',sub:'สูงกว่าเป้าหมาย '+F.fn.dis[2].over+'%',
      tip:'งบลงทุน|เป็นงบที่กระตุ้นเศรษฐกิจในพื้นที่ได้มากที่สุด เพราะแปลงเป็นการก่อสร้างและจัดซื้อโดยตรง'}),
    kpiCard({icon:'chart',color:cv('--gold'),label:'งบจัดสรรทั้งจังหวัด',value:f(F.fn.dis[0].alloc,0),unit:'ลบ.',
      chip:'<span class="chip">คงเหลือ '+f(F.fn.dis[0].alloc-F.fn.dis[0].val,0)+' ลบ.</span>',sub:'ปีงบประมาณ 2569'})
  ].join('');
  drawGauges();

  const m=F.mix[fiscalMode];
  mk('cFiscalMix',{type:'doughnut',data:{labels:['รายจ่ายประจำ','รายจ่ายลงทุน'],
    datasets:[{data:[m.cur,m.inv],backgroundColor:[cv('--gold'),cv('--brand')],borderColor:cv('--card'),borderWidth:3}]},
    options:{cutout:'60%',plugins:{legend:{position:'bottom',labels:{padding:12}},
      tooltip:{callbacks:{label:c=>c.label+' '+c.raw+'%'}}}}});

  $('#tFiscalProv').innerHTML=`<thead><tr><th>รายการ</th><th class="r">จัดสรร</th><th class="r">เบิกจ่าย</th>
    <th class="r">%</th><th class="r">ใช้จ่าย</th><th class="r">%</th></tr></thead><tbody>`+
    F.prov.map((r,i)=>`<tr><td>${r.k}</td>${ec('fiscal.prov.'+i+'.alloc',f(r.alloc,2),2)}${ec('fiscal.prov.'+i+'.dis',f(r.dis,2),2)}
      <td class="r" style="color:var(--brand)">${r.dpct.toFixed(2)}<span style="font-size:9px;color:var(--faint)"> #${r.drank}</span></td>
      ${ec('fiscal.prov.'+i+'.use',f(r.use,2),2)}
      <td class="r" style="color:var(--brand2)">${r.upct.toFixed(2)}<span style="font-size:9px;color:var(--faint)"> #${r.urank}</span></td></tr>`).join('')+
    `</tbody><tfoot><tr><td colspan="6" style="font-family:var(--fb);font-weight:400;color:var(--faint);font-size:10.5px">หน่วย: ล้านบาท · #n = อันดับของประเทศ</td></tr></tfoot>`;

  const C=F.carry;
  $('#carryOver').innerHTML=`<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <div><div style="font-size:11px;color:var(--faint)">เบิกจ่ายแล้ว</div><div class="big2" style="color:var(--brand)">${C.pct}%</div></div>
      <div style="flex:1;min-width:150px">
        <div class="bar" style="height:11px"><i style="width:${C.pct}%;background:linear-gradient(90deg,var(--brand),var(--brand2))"></i></div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--faint);margin-top:5px">
          <span>เบิกจ่าย ${f(C.dis,2)} ลบ.</span><span>จัดสรร ${f(C.alloc,2)} ลบ.</span></div></div></div>
    <div class="note">เงินกันไว้เบิกเหลื่อมปี 2568 เหลือรอเบิกอีก ${f(C.left,2)} ล้านบาท เป็นเม็ดเงินที่ผลักลงพื้นที่ได้ทันทีหากเร่งกระบวนการ</div>`;

  mk('cFiscalTrend',{type:'line',data:{labels:MONTHS.map(m=>m.label),datasets:[
    {label:'งบลงทุน (ลบ.)',data:DB.spend.inv.map(x=>x.v),borderColor:cv('--brand'),backgroundColor:cv('--brand')+'22',borderWidth:2.2,pointRadius:0,tension:.3,fill:true},
    {label:'งบประจำ (ลบ.)',data:DB.spend.ope.map(x=>x.v),borderColor:cv('--gold'),borderWidth:1.8,pointRadius:0,tension:.3}]},
    options:{interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom',labels:{padding:11}}},
      scales:{x:ax({grid:{display:false},ticks:{maxTicksLimit:12,font:{size:9.5}}}),y:ax({ticks:{callback:v=>f(v,0)}})}}});
  applyEditMode();
}
function drawGauges(){
  const arr=D.fiscal.fn[fiscalMode],cols=[cv('--brand'),cv('--gold'),cv('--blue')];
  $('#fiscalGauges').innerHTML=arr.map((r,i)=>`<div class="gau">
      <div class="gh"><b>${r.k}</b><span class="rank ${r.rank<=5?'top':''}">อันดับ ${r.rank}</span></div>
      <div class="arc">${gaugeSvg(r.pct,cols[i])}
        <div class="nums"><span class="pc" style="color:${cols[i]}">${r.pct.toFixed(2)}%</span>
          <span><em>${f(r.val,2)}</em> จาก <em>${f(r.alloc,2)}</em> ลบ.</span>
          <span style="color:var(--good)">▲ สูงกว่าเป้าหมาย ${r.over.toFixed(2)}%</span></div></div></div>`).join('');
  $('#fiscalNote').textContent=fiscalMode==='dis'
    ?'การเบิกจ่าย = เงินที่ออกจากระบบคลังแล้วจริง เป็นตัวเลขที่ใช้จัดอันดับจังหวัด หนองบัวลำภูอยู่อันดับ 1 ของประเทศทั้งภาพรวมและงบลงทุน'
    :'การใช้จ่าย = การเบิกจ่ายบวกการก่อหนี้ผูกพันที่ลงนามสัญญาแล้ว สะท้อนเม็ดเงินที่ผูกกับกิจกรรมเศรษฐกิจในพื้นที่ทั้งหมด';
}

/* ─────────────── 13) เกษตร ─────────────── */
function renderAgri(){
  const C=D.crop,B=D.base,val=cropValue();
  $('#agriKpi').innerHTML=[
    kpiCard({icon:'people',color:cv('--leaf'),label:'ครัวเรือนเกษตรกร',value:f(C.hh,0),unit:'ครัวเรือน',
      chip:'<span class="chip">ทะเบียน '+f(B.agriHH,0)+'</span>',sub:'ราว 1 ใน 5 ของประชากร'}),
    kpiCard({icon:'leaf',color:cv('--brand'),label:'เนื้อที่ปลูกพืชอายุสั้น',value:f(C.area,0),unit:'ไร่',
      chip:'<span class="chip">ข้าวนาปี 60.9%</span>',sub:'จากพื้นที่เกษตร 1.55 ล้านไร่'}),
    kpiCard({icon:'drop',color:cv('--brand2'),label:'ผลผลิตรวม',value:f(C.yieldKg/1e6,0),unit:'ล้าน กก.',
      chip:'<span class="chip">อ้อยโรงงาน 95%</span>',sub:'ข้าวนาปีอยู่ระหว่างฤดูกาล'}),
    kpiCard({icon:'coin',color:cv('--gold'),label:'มูลค่าผลผลิต',value:f(val,0),unit:'ล้านบาท',
      chip:'<span class="chip up">คำนวณจากราคาที่ขายได้</span>',sub:'ยังไม่รวมข้าวนาปี',
      tip:'มูลค่าผลผลิตพืชอายุสั้น|ผลรวมของ ผลผลิต × ราคาที่เกษตรกรขายได้ ทุกชนิดพืช|อ้อยโรงงานคิดเป็น 89% ของมูลค่าทั้งหมด'}),
    kpiCard({icon:'plane',color:cv('--plum'),label:'ท่องเที่ยวเชิงเกษตร',value:f(B.tour.total,0),unit:'แห่ง',
      chip:'<span class="chip">แปลงใหญ่ '+B.bigPlot.plots+' แปลง</span>',sub:'กระจายทั้ง 6 อำเภอ'})
  ].join('');

  /* พืชอายุสั้น */
  const mxV=Math.max(...C.rows.map(r=>r.price?r.y*r.price/1e6:0));
  $('#tCrop').innerHTML=`<thead><tr><th>ชนิดพืช</th><th class="r">ครัวเรือน</th><th class="r">เนื้อที่ (ไร่)</th>
    <th class="r">ผลผลิต (กก.)</th><th class="r">กก./ไร่</th><th class="r">ราคา</th><th class="r">มูลค่า (ลบ.)</th><th style="width:66px"></th></tr></thead><tbody>`+
    C.rows.map((r,i)=>{const v=r.price?r.y*r.price/1e6:0;
      return`<tr><td>${r.n}</td>${ec('crop.rows.'+i+'.hh',f(r.hh,0),0)}${ec('crop.rows.'+i+'.area',f(r.area,2),2)}
        ${ec('crop.rows.'+i+'.y',f(r.y,0),0)}<td class="r">${f(r.per,2)}</td>
        ${ec('crop.rows.'+i+'.price',r.price!=null?f(r.price,2):'—',2)}
        <td class="r" style="font-weight:600">${v?f(v,2):'—'}</td>
        <td><div class="bar"><i style="width:${(v/mxV*100).toFixed(1)}%;background:var(--leaf)"></i></div></td></tr>`}).join('')+
    `</tbody><tfoot><tr><td>รวม</td><td class="r">${f(C.hh,0)}</td><td class="r">${f(C.area,2)}</td>
      <td class="r">${f(C.yieldKg,0)}</td><td class="r">—</td><td class="r">—</td><td class="r">${f(val,2)}</td><td></td></tr></tfoot>`;

  mk('cCropArea',{type:'doughnut',data:{labels:C.share.map(r=>r[0]),
    datasets:[{data:C.share.map(r=>r[1]),backgroundColor:[cv('--leaf'),cv('--gold'),cv('--blue'),cv('--coral')],
      borderColor:cv('--card'),borderWidth:3}]},
    options:{cutout:'58%',plugins:{legend:{position:'bottom',labels:{padding:10}},
      tooltip:{callbacks:{label:c=>c.label+' '+c.raw+'%'}}}}});
  const wv=C.rows.filter(r=>r.price).map(r=>({n:r.n,v:+(r.y*r.price/1e6).toFixed(2)})).sort((a,b)=>b.v-a.v);
  mk('cCropValue',{type:'bar',data:{labels:wv.map(r=>r.n),
    datasets:[{data:wv.map(r=>r.v),backgroundColor:cv('--leaf'),borderRadius:5,barThickness:14}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>f(c.raw,2)+' ล้านบาท'}}},
      scales:{x:ax({type:'logarithmic',ticks:{callback:v=>f(v,0)}}),y:ax({grid:{display:false},ticks:{font:{size:10.5}}})}}});
  const yl=C.rows.filter(r=>r.per>0).sort((a,b)=>b.per-a.per);
  mk('cCropYield',{type:'bar',data:{labels:yl.map(r=>r.n),
    datasets:[{data:yl.map(r=>r.per),backgroundColor:cv('--brand2'),borderRadius:5,barThickness:14}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>f(c.raw,2)+' กก./ไร่'}}},
      scales:{x:ax({type:'logarithmic',ticks:{callback:v=>f(v,0)}}),y:ax({grid:{display:false},ticks:{font:{size:10.5}}})}}});

  /* ไม้ผล */
  $('#fruitCards').innerHTML=D.fruit.map((fr,i)=>`<div class="fruit" style="border:1px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card);box-shadow:var(--sh)">
      <div style="padding:9px 13px;color:#fff;font-family:var(--fd);font-weight:600;font-size:14.5px;background:${fr.c}">${fr.n}</div>
      <div style="padding:10px 13px;display:flex;flex-direction:column;gap:6px">
        ${[['เกษตรกร',f(fr.farmers,0),'ราย'],['พื้นที่ปลูก',f(fr.area,2),'ไร่'],
           ['พื้นที่ให้ผล',f(fr.yieldArea,2),'ไร่'],['ผลผลิต',f(fr.kg,0),'กก./ปี']].map(x=>
          `<div style="display:flex;align-items:baseline;font-size:11.5px;color:var(--dim);gap:8px">
            <span>${x[0]}</span><b style="margin-left:auto;font-family:var(--fn);color:var(--ink);font-size:13px">${x[1]}</b>
            <span style="color:var(--faint);font-size:10px">${x[2]}</span></div>`).join('')}
        <div style="display:flex;gap:6px;margin-top:3px;flex-wrap:wrap">
          <span class="chip">${fr.season}</span>${fr.pmin?`<span class="chip fl">${fr.pmin}–${fr.pmax} บ./กก.</span>`:''}</div>
      </div></div>`).join('');
  mk('cFruit',{type:'bar',data:{labels:D.fruit.map(x=>x.n),datasets:[
    {label:'พื้นที่ปลูก (ไร่)',data:D.fruit.map(x=>x.area),backgroundColor:cv('--leaf'),borderRadius:4},
    {label:'พื้นที่ให้ผล (ไร่)',data:D.fruit.map(x=>x.yieldArea),backgroundColor:cv('--gold'),borderRadius:4}]},
    options:{plugins:{legend:{position:'bottom',labels:{padding:11}}},
      scales:{x:ax({grid:{display:false}}),y:ax({ticks:{callback:v=>f(v,0)}})}}});
  $('#tFruit').innerHTML=`<thead><tr><th>ไม้ผล</th><th>ช่วงเก็บเกี่ยว</th><th class="r">ผลผลิต (กก./ปี)</th><th class="r">ราคา (บ./กก.)</th></tr></thead><tbody>`+
    D.fruit.map((x,i)=>`<tr><td><span class="dot" style="background:${x.c};margin-right:7px"></span>${x.n}</td>
      <td>${x.season}</td>${ec('fruit.'+i+'.kg',f(x.kg,0),0)}<td class="r">${x.pmin?x.pmin+'–'+x.pmax:'—'}</td></tr>`).join('')+'</tbody>';

  /* พืชเศรษฐกิจหลัก */
  $('#tMainCrop').innerHTML=`<thead><tr><th>พืช · ฤดูการผลิต</th><th class="r">ครัวเรือน</th><th class="r">พื้นที่ปลูก (ไร่)</th>
    <th class="r">ผลผลิตเฉลี่ย (กก./ไร่)</th><th class="r">ผลผลิตรวม (ตัน)</th></tr></thead><tbody>`+
    B.mainCrop.map((r,i)=>`<tr><td>${r.n}</td>${ec('base.mainCrop.'+i+'.hh',f(r.hh,0),0)}${ec('base.mainCrop.'+i+'.area',f(r.area,0),0)}
      <td class="r">${r.per?f(r.per,2):'—'}</td><td class="r">${r.total?f(r.total,0):'<span style="color:var(--warn)">อยู่ระหว่างฤดูกาล</span>'}</td></tr>`).join('')+'</tbody>';
  mk('cMainCrop',{type:'doughnut',data:{labels:B.mainCrop.map(r=>r.n.split(' ')[0]),
    datasets:[{data:B.mainCrop.map(r=>r.area),backgroundColor:PAL(),borderColor:cv('--card'),borderWidth:3}]},
    options:{cutout:'56%',plugins:{legend:{position:'bottom',labels:{padding:9,font:{size:10.5}}},
      tooltip:{callbacks:{label:c=>f(c.raw,0)+' ไร่'}}}}});
  const my=B.mainCrop.filter(r=>r.per);
  mk('cMainYield',{type:'bar',data:{labels:my.map(r=>r.n.split(' ')[0]),
    datasets:[{data:my.map(r=>r.per),backgroundColor:[cv('--gold'),cv('--blue'),cv('--leaf')],borderRadius:6,barPercentage:.6}]},
    options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>f(c.raw,2)+' กก./ไร่'}}},
      scales:{x:ax({grid:{display:false}}),y:ax({type:'logarithmic',ticks:{callback:v=>f(v,0)}})}}});

  /* แหล่งน้ำ */
  const W=D.water,ok=W.filter(w=>w.ok);
  $('#waterKpi').innerHTML=[
    kpiCard({icon:'bolt',color:cv('--gold'),label:'ระบบสูบน้ำโซลาร์เซลล์',value:f(W[0].cnt,0),unit:'แห่ง',
      chip:'<span class="chip real">ข้อมูลจริง</span>',sub:'พื้นที่รับประโยชน์ '+f(W[0].benefit,0)+' ไร่'}),
    kpiCard({icon:'drop',color:cv('--brand2'),label:'พื้นที่รับประโยชน์ที่ยืนยันแล้ว',value:f(ok.reduce((a,w)=>a+(w.benefit||0),0),0),unit:'ไร่',
      chip:'<span class="chip">คิดเป็น 0.35% ของพื้นที่เกษตร</span>',sub:'จากพื้นที่เกษตร 1.55 ล้านไร่'}),
    kpiCard({icon:'leaf',color:cv('--leaf'),label:'พื้นที่เกษตรทั้งจังหวัด',value:'1.55',unit:'ล้านไร่',
      chip:'<span class="chip fl">ยังพึ่งน้ำฝนเป็นหลัก</span>',sub:'ต้องขยายแหล่งน้ำต้นทุน'}),
    kpiCard({icon:'chart',color:cv('--coral'),label:'รายการที่รอข้อมูล',value:W.filter(w=>!w.ok).length,unit:'ประเภท',
      chip:'<span class="chip mock">ต้องประสานหน่วยงาน</span>',sub:'ชลประทาน · ทรัพยากรน้ำบาดาล'})
  ].join('');
  $('#tWater').innerHTML=`<thead><tr><th>ประเภทแหล่งน้ำ</th><th class="r">จำนวน</th><th>หน่วย</th>
    <th class="r">พื้นที่รับประโยชน์ (ไร่)</th><th style="width:90px">สถานะ</th></tr></thead><tbody>`+
    W.map((w,i)=>`<tr><td>${w.n}</td>${ec('water.'+i+'.cnt',w.cnt!=null?f(w.cnt,0):'—',0)}<td>${w.unit}</td>
      ${ec('water.'+i+'.benefit',w.benefit!=null?f(w.benefit,0):'—',0)}
      <td>${w.ok?'<span class="chip real">ยืนยันแล้ว</span>':'<span class="chip mock">รอข้อมูล</span>'}</td></tr>`).join('')+
    `</tbody><tfoot><tr><td colspan="5" style="font-family:var(--fb);font-weight:400;color:var(--faint);font-size:10.5px">
      ยืนยันจากเอกสาร สนง.เกษตรจังหวัด ณ ก.ค. 2569 เฉพาะระบบสูบน้ำพลังงานแสงอาทิตย์ · รายการอื่นรอหนังสือยืนยันตัวเลข</td></tr></tfoot>`;
  mk('cWater',{type:'bar',data:{labels:W.map(w=>w.n.length>26?w.n.slice(0,25)+'…':w.n),
    datasets:[{data:W.map(w=>w.benefit||0),backgroundColor:W.map(w=>w.ok?cv('--brand'):cv('--line')),borderRadius:5,barThickness:14}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.raw?f(c.raw,0)+' ไร่':'ยังไม่มีข้อมูล'}}},
      scales:{x:ax({ticks:{callback:v=>f(v,0)}}),y:ax({grid:{display:false},ticks:{font:{size:10}}})}}});

  /* แปลงใหญ่ */
  const mxA=Math.max(...B.bigPlot.rows.map(r=>r[3]));
  $('#tBigPlot').innerHTML=`<thead><tr><th>ชนิดสินค้า</th><th class="r">แปลง</th><th class="r">เกษตรกร</th><th class="r">พื้นที่ (ไร่)</th><th style="width:70px"></th></tr></thead><tbody>`+
    B.bigPlot.rows.map((r,i)=>`<tr><td>${r[0]}</td>${ec('base.bigPlot.rows.'+i+'.1',f(r[1],0),0)}${ec('base.bigPlot.rows.'+i+'.2',f(r[2],0),0)}${ec('base.bigPlot.rows.'+i+'.3',f(r[3],0),0)}
      <td><div class="bar"><i style="width:${(r[3]/mxA*100).toFixed(0)}%;background:var(--brand)"></i></div></td></tr>`).join('')+
    `</tbody><tfoot><tr><td>รวม</td><td class="r">${B.bigPlot.plots}</td><td class="r">${f(B.bigPlot.farmers,0)}</td><td class="r">${f(B.bigPlot.area,0)}</td><td></td></tr></tfoot>`;
  const tr=DISTRICTS.map(d=>({n:d.name,v:B.tour.byAmphoe[d.code]||0})).sort((a,b)=>b.v-a.v);
  mk('cAgriTour',{type:'bar',data:{labels:tr.map(x=>x.n),
    datasets:[{data:tr.map(x=>x.v),backgroundColor:cv('--gold'),borderRadius:5,barThickness:17}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>c.raw+' แห่ง'}}},
      scales:{x:ax({ticks:{stepSize:5}}),y:ax({grid:{display:false},ticks:{font:{size:11}}})}}});
  $('#instBox').innerHTML=B.inst.map(x=>`<div style="display:flex;align-items:baseline;gap:9px;font-size:12px;padding:6px 0;border-bottom:1px solid var(--line2)">
    <span style="color:var(--dim);flex:1">${x[0]}</span><b class="n" style="font-size:14px">${f(x[1],0)}</b><span style="font-size:10px;color:var(--faint)">${x[2]}</span></div>`).join('');
  $('#gapBox').innerHTML=`<div class="grid g2" style="gap:9px;margin-bottom:10px">
      <div class="mini"><div class="l">แปลงที่ได้ GAP</div><div class="v">${f(B.gap.total,0)}<small> แปลง</small></div></div>
      <div class="mini"><div class="l">เกษตรอินทรีย์</div><div class="v">${B.organic.farmers}<small> ราย</small></div></div></div>`+
    B.gap.rows.map(x=>`<div style="display:flex;align-items:baseline;gap:9px;font-size:12px;padding:5px 0;border-bottom:1px solid var(--line2)">
      <span style="color:var(--dim);flex:1">${x[0]}</span><b class="n">${f(x[1],0)}</b><span style="font-size:10px;color:var(--faint)">ราย · ${f(x[2],2)} ไร่</span></div>`).join('')+
    `<div class="note">พื้นที่เกษตรอินทรีย์ที่ได้รับการรับรอง ${B.organic.area} ไร่ ยังเป็นสัดส่วนเล็กมากเมื่อเทียบกับพื้นที่เกษตร 1.55 ล้านไร่ เป็นโอกาสสร้างมูลค่าเพิ่ม</div>`;
  $('#vsBox').innerHTML=B.vs.map((v,i)=>`<div style="display:flex;gap:10px;padding:9px 0;border-bottom:1px solid var(--line2)">
    <span class="n" style="color:var(--brand);font-weight:600">${i+1}</span><span style="font-size:12.5px;color:var(--dim);line-height:1.6">${v}</span></div>`).join('')+
    `<div class="note">วิสาหกิจชุมชนที่ยกระดับเป็นแปลงใหญ่ คือกลไกที่ทำให้เกษตรกรรายย่อยมีอำนาจต่อรองราคาและเข้าถึงตลาดได้จริง</div>`;

  /* ฐานข้อมูล */
  $('#baseKpi').innerHTML=[
    kpiCard({icon:'people',color:cv('--blue'),label:'ประชากรจังหวัด',value:f(B.pop,0),unit:'คน',
      chip:'<span class="chip">ชาย 49.67% · หญิง 50.33%</span>',sub:`${B.amphoe} อำเภอ ${B.tambon} ตำบล ${B.muban} หมู่บ้าน`}),
    kpiCard({icon:'leaf',color:cv('--leaf'),label:'พื้นที่ภาคการเกษตร',value:'1.55',unit:'ล้านไร่',
      chip:'<span class="chip">ครัวเรือนเกษตร '+f(B.agriHH,0)+'</span>',sub:'ข้อมูล ณ ก.ค. 2569'}),
    kpiCard({icon:'factory',color:cv('--brand'),label:'แปลงใหญ่',value:f(B.bigPlot.plots,0),unit:'แปลง',
      chip:'<span class="chip">'+f(B.bigPlot.farmers,0)+' ราย</span>',sub:f(B.bigPlot.area,0)+' ไร่'}),
    kpiCard({icon:'brief',color:cv('--plum'),label:'องค์กรปกครองท้องถิ่น',value:B.org.obj+B.org.tessabanMuang+B.org.tessabanTambon+B.org.obt,unit:'แห่ง',
      chip:'<span class="chip">อบต. '+B.org.obt+'</span>',sub:'อบจ. 1 · ทม. 1 · ทต. '+B.org.tessabanTambon})
  ].join('');
  $('#baseInfo').innerHTML=`<div class="grid g4" style="gap:10px">
      ${[['อำเภอ',B.amphoe],['ตำบล',B.tambon],['หมู่บ้าน',B.muban],['ชุมชน',B.chumchon]].map(x=>
        `<div class="mini"><div class="l">${x[0]}</div><div class="v">${f(x[1],0)}</div></div>`).join('')}</div>
    <div class="grid g2" style="gap:10px;margin-top:10px">
      <div class="mini"><div class="l">ประชากรชาย</div><div class="v">${f(B.popM,0)}<small> คน (49.67%)</small></div></div>
      <div class="mini"><div class="l">ประชากรหญิง</div><div class="v">${f(B.popF,0)}<small> คน (50.33%)</small></div></div></div>
    <div class="note">องค์กรปกครองส่วนท้องถิ่น: อบจ. ${B.org.obj} แห่ง · เทศบาลเมือง ${B.org.tessabanMuang} แห่ง · เทศบาลตำบล ${B.org.tessabanTambon} แห่ง · อบต. ${B.org.obt} แห่ง</div>`;
  mk('cAgeBand',{type:'bar',data:{labels:B.ageBand.map(x=>x[0]),
    datasets:[{data:B.ageBand.map(x=>x[1]),
      backgroundColor:B.ageBand.map(x=>x[1]>20000?cv('--brand'):x[1]>9000?cv('--brand2'):cv('--line')),borderRadius:6,barPercentage:.7}]},
    options:{plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>f(c.raw,0)+' คน'}}},
      scales:{x:ax({grid:{display:false}}),y:ax({ticks:{callback:v=>f(v,0)}})}}});
  applyEditMode();
}

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
    <div class="ph"><div class="t"><h2>${M.title}</h2><p>${M.lead}</p></div>
      <div class="r"><span class="chip mock">โครงร่าง รอข้อมูลจริง</span><span class="chip">${agy.replace(/สำนักงาน/g,'สนง.')}</span></div></div>
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
    </div>`;
  $('#k-'+sid).innerHTML=all.slice(0,4).map((o,i)=>{
    const arr=DB[o.d.id][o.s.key];
    return kpiCard({icon:['chart','coin','people','bolt'][i],color:PAL()[i],label:o.s.label,
      value:f(arr[35].v,o.s.dec??0),unit:o.s.unit,chip:chip(pctc(arr[35].v,arr[23].v)),
      spark:spark(arr.slice(-18).map(x=>x.v),PAL()[i]),
      sub:o.d.agency.split(' · ')[0].replace('สำนักงาน','สนง.').replace('จังหวัดหนองบัวลำภู','จ.นภ.')})}).join('');
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

/* ─────────────── 15) เชิงพื้นที่ ─────────────── */
let MAP=null,LAYER=null,GEO=null;
const AREA_OPTS=(()=>{
  const o=[{id:'tour',label:'แหล่งท่องเที่ยวเชิงเกษตร',unit:'แห่ง',dec:0,real:true,
    vals:()=>{const v={};DISTRICTS.forEach(d=>v[d.code]=D.base.tour.byAmphoe[d.code]||0);return v}}];
  DATASETS.forEach(d=>d.series.forEach(s=>o.push({id:d.id+'|'+s.key,label:s.label,unit:s.unit,dec:s.dec??0,
    agency:d.agency,vals:()=>Object.assign({},DBD[d.id][s.key])})));
  return o})();
function ramp(t){const c=[[0,'#e8f5ee'],[.25,'#a9ddc4'],[.5,'#5fbf95'],[.75,'#1f9a6c'],[1,'#0a6247']];
  for(let i=1;i<c.length;i++)if(t<=c[i][0])return c[i][1];return c[c.length-1][1]}
function renderArea(){
  const sel=$('#areaSel');
  if(!sel.options.length){sel.innerHTML=AREA_OPTS.map((o,i)=>
    `<option value="${i}">${o.label}${o.real?' · ข้อมูลจริง':''}</option>`).join('');sel.onchange=renderArea}
  if(!MAP){
    MAP=L.map('map',{zoomControl:true,attributionControl:false,scrollWheelZoom:false}).setView([17.25,102.35],9.2);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',{maxZoom:14,subdomains:'abcd'}).addTo(MAP);
    fetch('https://raw.githubusercontent.com/chingchai/OpenGISData-Thailand/master/amphoes.geojson')
      .then(r=>r.json()).then(j=>{GEO={type:'FeatureCollection',
        features:j.features.filter(ft=>String(ft.properties.pro_code||ft.properties.PROV_CODE||'')==='39')};paintMap()})
      .catch(()=>{GEO=null;paintMap()});
  }else MAP.invalidateSize();
  paintMap();
  const o=AREA_OPTS[+sel.value||0],vals=o.vals();
  const rows=DISTRICTS.map(d=>({n:d.name,v:vals[d.code]})).sort((a,b)=>b.v-a.v);
  const tot=rows.reduce((a,b)=>a+b.v,0)||1,mx=rows[0].v||1;
  $('#areaTitle').textContent=o.label;
  $('#areaUnit').textContent='หน่วย: '+o.unit+(o.agency?' · '+o.agency.split(' · ')[0].replace('สำนักงาน','สนง.'):'');
  $('#tArea').innerHTML=`<thead><tr><th>#</th><th>อำเภอ</th><th class="r">${o.unit}</th><th class="r">%</th><th style="width:80px"></th></tr></thead><tbody>`+
    rows.map((r,i)=>`<tr><td class="r" style="color:var(--faint);width:26px">${i+1}</td><td>${r.n}</td>
      <td class="r">${f(r.v,o.dec)}</td><td class="r">${(r.v/tot*100).toFixed(1)}</td>
      <td><div class="bar"><i style="width:${(r.v/mx*100).toFixed(0)}%;background:var(--brand)"></i></div></td></tr>`).join('')+'</tbody>';
  mk('cAreaShare',{type:'doughnut',data:{labels:rows.map(r=>r.n),
    datasets:[{data:rows.map(r=>r.v),backgroundColor:rows.map((r,i)=>ramp(1-i/(rows.length-1||1))),
      borderColor:cv('--card'),borderWidth:3}]},
    options:{cutout:'56%',plugins:{legend:{position:'right',labels:{padding:8,font:{size:10.5}}}}}});
  const B=D.base;
  $('#areaAdmin').innerHTML=`<div class="grid g3" style="gap:10px">
      ${[['ประชากรรวม',f(B.pop,0),'คน'],['ครัวเรือนเกษตรกร',f(B.agriHH,0),'ครัวเรือน'],['พื้นที่การเกษตร','1.55','ล้านไร่'],
         ['ตำบล',B.tambon,'ตำบล'],['หมู่บ้าน',B.muban,'หมู่บ้าน'],['ชุมชน',B.chumchon,'ชุมชน']].map(x=>
        `<div class="mini"><div class="l">${x[0]}</div><div class="v">${x[1]}<small> ${x[2]}</small></div></div>`).join('')}</div>
    <div class="note">อำเภอเมืองเป็นศูนย์กลางเศรษฐกิจและมีแหล่งท่องเที่ยวเชิงเกษตรมากที่สุด 18 แห่ง รองลงมาคืออำเภอนากลาง 17 แห่ง
    ขณะที่อำเภอโนนสังมีน้อยที่สุด 7 แห่ง ทั้งที่มีเขื่อนอุบลรัตน์เป็นทุนทางธรรมชาติ จึงเป็นพื้นที่ที่มีโอกาสพัฒนามากที่สุด</div>`;
}
function paintMap(){
  if(!MAP)return;
  const o=AREA_OPTS[+($('#areaSel').value||0)],vals=o.vals();
  const arr=Object.values(vals),mn=Math.min(...arr),mx=Math.max(...arr),r=(mx-mn)||1;
  if(LAYER){MAP.removeLayer(LAYER);LAYER=null}
  const pop=dt=>`<b>อ.${dt.name}</b><br>${o.label}<br><b style="font-size:17px">${f(vals[dt.code],o.dec)}</b> ${o.unit}`;
  if(GEO&&GEO.features.length){
    LAYER=L.geoJSON(GEO,{style:ft=>{const nm=(ft.properties.amp_th||ft.properties.AMPHOE_T||'').replace('อ.','').trim();
        const dt=DISTRICTS.find(x=>nm.includes(x.name)||x.name.includes(nm));const v=dt?vals[dt.code]:null;
        return{color:'#ffffff',weight:1.6,fillOpacity:v==null?.2:.88,fillColor:v==null?'#dfe8e3':ramp((v-mn)/r)}},
      onEachFeature:(ft,l)=>{const nm=(ft.properties.amp_th||ft.properties.AMPHOE_T||'').replace('อ.','').trim();
        const dt=DISTRICTS.find(x=>nm.includes(x.name)||x.name.includes(nm));if(dt)l.bindPopup(pop(dt))}}).addTo(MAP);
    try{MAP.fitBounds(LAYER.getBounds(),{padding:[16,16]})}catch(e){}
  }else{
    LAYER=L.layerGroup(DISTRICTS.map(dt=>{const t=(vals[dt.code]-mn)/r;
      return L.circleMarker([dt.lat,dt.lng],{radius:12+t*16,color:'#fff',weight:2,fillColor:ramp(t),fillOpacity:.9}).bindPopup(pop(dt))})).addTo(MAP);
  }
  $('#areaLegend').innerHTML=[0,.25,.5,.75,1].map(t=>`<span><i style="background:${ramp(t)}"></i>${f(mn+t*r,o.dec)}</span>`).join('')+
    (GEO?'':'<span style="color:var(--warn)">แสดงเป็นจุดศูนย์กลางอำเภอ (โหลดขอบเขตไม่สำเร็จ)</span>');
}

/* ─────────────── 16) รายงาน ─────────────── */
const GAPS=[
 ['ภาคเกษตร','ข้อมูลปศุสัตว์และประมงรายอำเภอ','สนง.ปศุสัตว์จังหวัด · สนง.ประมงจังหวัด','สูง'],
 ['ภาคเกษตร','แหล่งน้ำเพื่อการเกษตร (บ่อบาดาล สถานีสูบน้ำ พื้นที่ชลประทาน)','โครงการชลประทานจังหวัด · ทรัพยากรน้ำบาดาล','สูง'],
 ['ภาคเกษตร','ราคาสินค้าเกษตรรายสัปดาห์ ณ จุดรับซื้อ','สนง.พาณิชย์จังหวัด · สศก.','สูง'],
 ['ภาคเกษตร','ต้นทุนการผลิตต่อไร่รายพืช','สำนักงานเศรษฐกิจการเกษตร (สศก.)','กลาง'],
 ['ตลาดแรงงาน','ผลสำรวจภาวะการทำงานของประชากร รายไตรมาส','สนง.สถิติจังหวัดหนองบัวลำภู','สูง'],
 ['ตลาดแรงงาน','ตำแหน่งงานว่างและผู้สมัครงาน','สนง.จัดหางานจังหวัด','กลาง'],
 ['ตลาดแรงงาน','แรงงานย้ายถิ่นและแรงงานคืนถิ่น','สนง.แรงงานจังหวัด','กลาง'],
 ['ท่องเที่ยว','จำนวนผู้เยี่ยมเยือนและรายได้รายเดือน','สนง.การท่องเที่ยวและกีฬาจังหวัด','สูง'],
 ['ท่องเที่ยว','จำนวนห้องพักและอัตราการเข้าพัก','สนง.การท่องเที่ยวและกีฬาจังหวัด','กลาง'],
 ['การค้า','ยอดจดทะเบียนนิติบุคคลตั้งใหม่/เลิกกิจการ','สนง.พาณิชย์จังหวัด','สูง'],
 ['การค้า','ดัชนีราคาผู้บริโภคจังหวัดรายเดือนย้อนหลัง 3 ปี','สนง.พาณิชย์จังหวัด','สูง'],
 ['การเงิน','เงินฝากและสินเชื่อของธนาคารพาณิชย์ในจังหวัด','ธนาคารแห่งประเทศไทย สำนักงานภาคตะวันออกเฉียงเหนือ','กลาง'],
 ['ภาพรวม','GPP รายสาขาย้อนหลัง 5 ปี','สศช. (NESDC)','สูง'],
 ['ภาพรวม','ข้อมูลความยากจนและเส้นความยากจนระดับอำเภอ','สนง.พัฒนาชุมชนจังหวัด (TPMAP)','สูง']
];
function renderReport(){
  const s=MEI.out,last=s[35],yo=pctc(last.v,s[23].v);
  const F=D.fiscal,val=cropValue();
  const drv=MEI.comps.map(c=>({n:c.sec.name,v:(c.idx[35]-c.idx[23])*c.sec.weight})).sort((a,b)=>b.v-a.v);
  $('#briefAsof').textContent='ข้อมูล ณ '+CFG.asof;
  $('#brief').innerHTML=`
    <p><b>ภาพรวม</b> — ดัชนีภาวะเศรษฐกิจจังหวัดหนองบัวลำภู (NBL–MEI) เดือน${TH_M[last.m-1]} ${last.y} อยู่ที่ <b>${last.v.toFixed(1)}</b>
    ${yo>0?'ขยายตัว':'ลดลง'} <b>${Math.abs(yo).toFixed(1)}%</b> เมื่อเทียบกับเดือนเดียวกันปีก่อน
    โดยมี <b>${drv[0].n}</b> เป็นแรงหนุนหลัก และ <b>${drv[drv.length-1].n}</b> เป็นตัวฉุด</p>

    <h4>1. การคลังภาครัฐ — เครื่องยนต์หลักที่ยังทำงานเต็มกำลัง</h4>
    <p>จังหวัดเบิกจ่ายงบประมาณแล้ว <b>${F.fn.dis[0].pct}%</b> (${f(F.fn.dis[0].val,2)} จาก ${f(F.fn.dis[0].alloc,2)} ล้านบาท)
    สูงกว่าเป้าหมาย ${F.fn.dis[0].over}% และเป็น <b>อันดับ ${F.fn.dis[0].rank} ของประเทศ</b>
    งบลงทุนเบิกจ่ายแล้ว ${F.fn.dis[2].pct}% สูงกว่าเป้าหมายถึง ${F.fn.dis[2].over}% ซึ่งเป็นอันดับ ${F.fn.dis[2].rank} ของประเทศเช่นกัน
    ยังมีเงินกันไว้เบิกเหลื่อมปี 2568 คงเหลืออีก ${f(F.carry.left,2)} ล้านบาทที่ผลักลงพื้นที่ได้ทันที</p>

    <h4>2. ภาคเกษตร — ฐานรายได้ของคนส่วนใหญ่</h4>
    <p>ครัวเรือนเกษตรกร <b>${f(D.crop.hh,0)}</b> ครัวเรือน เพาะปลูกพืชอายุสั้นรวม ${f(D.crop.area,0)} ไร่
    ให้ผลผลิต ${f(D.crop.yieldKg/1e6,0)} ล้านกิโลกรัม คิดเป็นมูลค่า <b>${f(val,0)} ล้านบาท</b>
    โดยอ้อยโรงงานสร้างมูลค่าถึง 89% ของทั้งหมด ขณะที่ข้าวนาปีใช้เนื้อที่มากที่สุด 60.9% แต่ยังอยู่ระหว่างฤดูกาล
    ไม้ผลเศรษฐกิจกำลังขยายตัว ทุเรียนมีพื้นที่ปลูก 327 ไร่ แต่ให้ผลเพียง 95 ไร่ แปลว่าผลผลิตอีกกว่า 2 ใน 3 กำลังจะเข้ามาในอีก 2–4 ปี</p>

    <h4>3. ข้อเสนอเชิงนโยบาย</h4>
    <ul>
      <li>เร่งเบิกจ่ายเงินกันเหลื่อมปีที่เหลือ ${f(F.carry.left,2)} ล้านบาท ให้จบภายในไตรมาสนี้</li>
      <li>ขยายแหล่งน้ำเพื่อการเกษตร ปัจจุบันพื้นที่รับประโยชน์จากระบบสูบน้ำโซลาร์เซลล์มีเพียง ${f(D.water[0].benefit,0)} ไร่ จากพื้นที่เกษตร 1.55 ล้านไร่</li>
      <li>วางแผนตลาดและจุดรับซื้อไม้ผลล่วงหน้า เพราะทุเรียนและลำไยออกพร้อมกันในเดือน ก.ค.–ส.ค.</li>
      <li>เชื่อมเส้นทางท่องเที่ยวเชิงเกษตร 73 แห่ง เข้ากับแปลงใหญ่ 73 แปลง เพื่อสร้างรายได้เสริมให้เกษตรกร</li>
      <li>เร่งบูรณาการข้อมูลที่ยังขาด ${GAPS.filter(g=>g[3]==='สูง').length} รายการที่มีความสำคัญสูง ตามตารางด้านล่าง</li>
    </ul>
    <div class="note">รายงานนี้สร้างอัตโนมัติจากข้อมูลล่าสุดในระบบ ตัวเลขบางส่วนยังเป็นโครงร่างระหว่างรอข้อมูลจริงจากหน่วยงาน</div>`;

  let rows='';
  DATASETS.forEach(d=>d.series.forEach(s=>{const a=DB[d.id][s.key];
    rows+=`<tr><td>${SECTORS.find(x=>x.id===d.sector).name}</td><td>${s.label}</td>
      <td class="r">${f(a[35].v,s.dec??0)}</td><td>${s.unit}</td><td class="r">${chip(pctc(a[35].v,a[23].v))}</td></tr>`}));
  $('#tAll').innerHTML=`<thead><tr><th>ภาคส่วน</th><th>ตัวชี้วัด</th><th class="r">ค่าล่าสุด</th><th>หน่วย</th><th class="r">%YoY</th></tr></thead><tbody>${rows}</tbody>`;

  $('#tGap').innerHTML=`<thead><tr><th style="width:120px">ภาคส่วน</th><th>ชุดข้อมูลที่ต้องขอเพิ่ม</th><th>หน่วยงานที่ต้องประสาน</th><th style="width:80px">ความสำคัญ</th></tr></thead><tbody>`+
    GAPS.map(g=>`<tr><td>${g[0]}</td><td>${g[1]}</td><td style="color:var(--dim)">${g[2]}</td>
      <td>${g[3]==='สูง'?'<span class="chip dn">สูง</span>':'<span class="chip fl">กลาง</span>'}</td></tr>`).join('')+'</tbody>';
}
function toCsv(){
  const L=['sector,dataset,indicator,unit,period,value'];
  DATASETS.forEach(d=>d.series.forEach(s=>DB[d.id][s.key].forEach(x=>
    L.push([SECTORS.find(y=>y.id===d.sector).name,d.id,s.label,s.unit,x.key,x.v].map(v=>`"${v}"`).join(',')))));
  return L.join('\n')}
function dl(name,text,type){
  const b=new Blob(['\ufeff'+text],{type:type||'text/plain;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),2000)}

/* ─────────────── 17) แหล่งข้อมูล ─────────────── */
function renderSources(){
  let h=`<thead><tr><th style="width:150px">ภาคส่วน</th><th>ตัวชี้วัด</th><th>หน่วยงานผู้รับผิดชอบ</th>
    <th style="width:66px">รอบส่ง</th><th class="r" style="width:66px">ความช้า</th><th style="width:96px">สถานะ</th></tr></thead><tbody>`;
  SECTORS.forEach(sec=>{let first=true;
    sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id);
      d.series.forEach((s,i)=>{
        const st=d.lag<=25?'<span class="chip up">ทันรอบ</span>':d.lag<=45?'<span class="chip fl">รอยืนยัน</span>':'<span class="chip dn">ล่าช้า</span>';
        h+=`<tr><td>${first?`<span class="dot" style="background:${sec.color};margin-right:7px"></span>${sec.name}`:''}</td>
          <td>${s.label} <span style="color:var(--faint)">(${s.unit})</span>${d.real&&i===0?' <span class="chip real">ข้อมูลจริง</span>':''}</td>
          <td style="color:var(--dim)">${i===0?d.agency:'”'}</td><td>รายเดือน</td>
          <td class="r">${d.lag} วัน</td><td>${st}</td></tr>`;first=false})})});
  h+=`<tr><td><span class="dot" style="background:var(--plum);margin-right:7px"></span>ภาพรวม</td>
    <td>ดัชนี NBL–MEI และการดูแลแดชบอร์ด</td><td style="color:var(--dim)">สนง.สถิติจังหวัด · สนง.จังหวัด</td>
    <td>รายเดือน</td><td class="r">15 วัน</td><td><span class="chip up">ทันรอบ</span></td></tr>
    <tr><td></td><td>ผลิตภัณฑ์มวลรวมจังหวัด (GPP)</td><td style="color:var(--dim)">สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ</td>
    <td>รายปี</td><td class="r">730 วัน</td><td><span class="chip dn">ล่าช้า 2 ปี</span></td></tr></tbody>`;
  $('#tSrc').innerHTML=h;
  mk('cWeight',{type:'bar',data:{labels:SECTORS.map(s=>s.name),
    datasets:[{data:SECTORS.map(s=>+(s.weight*100).toFixed(0)),backgroundColor:SECTORS.map(s=>s.color),borderRadius:4,barThickness:12}]},
    options:{indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>'น้ำหนัก '+c.raw+'%'}}},
      scales:{x:ax({ticks:{callback:v=>v+'%'}}),y:ax({grid:{display:false},ticks:{font:{size:10}}})}}});
}

/* ─────────────── 18) ตั้งค่า ─────────────── */
const ACCENTS=[['#0d9268','เขียวมรกต'],['#12867e','เขียวน้ำทะเล'],['#1d6fb8','น้ำเงินราชการ'],
  ['#b5851a','ทองอ่อน'],['#c2185b','ชมพูบัวหลวง'],['#5b6cc4','ม่วงคราม'],['#c0562f','ส้มอิฐ'],['#3f7d3a','เขียวใบไม้']];
function renderSettings(){
  $('#setCoverUrl').value=SET.coverUrl&&!SET.coverUrl.startsWith('data:')?SET.coverUrl:'';
  $('#setSideUrl').value=SET.sideUrl&&!SET.sideUrl.startsWith('data:')?SET.sideUrl:'';
  $('#setCoverOp').value=SET.coverOp;$('#setCoverOpV').textContent=SET.coverOp;
  $('#setSideOp').value=SET.sideOp;$('#setSideOpV').textContent=SET.sideOp;
  $('#setKiosk').value=SET.kiosk;$('#setKioskV').textContent=SET.kiosk;
  $('#setApi').value=SET.api||'';
  $('#apiStatus').innerHTML=SET.api?'<span class="chip up">ตั้งค่าแล้ว</span>':'<span class="chip mock">ยังไม่ได้เชื่อม ใช้ข้อมูลโครงร่าง</span>';
  $('#accentPick').innerHTML=ACCENTS.map(a=>`<button class="tb" data-accent="${a[0]}" style="justify-content:flex-start;${SET.accent===a[0]?'border-color:'+a[0]+';color:'+a[0]:''}">
    <span style="width:15px;height:15px;border-radius:5px;background:${a[0]};display:inline-block"></span>${a[1]}</button>`).join('');
  $('#editStatus').innerHTML=editCount()
    ?'มีข้อมูลที่แก้ไขไว้ในเบราว์เซอร์นี้ ค่าที่แก้จะถูกใช้แทนค่าเริ่มต้นทุกครั้งที่เปิดหน้า'
    :'ยังไม่มีการแก้ไขข้อมูล กำลังใช้ค่าตั้งต้นจากเอกสารหน่วยงาน';
}
function readImg(file,cb){
  if(file.size>2*1024*1024){alert('ไฟล์ใหญ่เกิน 2 MB กรุณาย่อขนาดก่อน หรือใช้วิธีวางลิงก์ URL แทน');return}
  const r=new FileReader();r.onload=()=>cb(r.result);r.readAsDataURL(file)}

/* ─────────────── 19) โหมดแก้ไขตาราง ─────────────── */
let EDIT=false;
function applyEditMode(){
  $$('td[data-path]').forEach(td=>{
    if(EDIT){td.setAttribute('contenteditable','true')}else{td.removeAttribute('contenteditable')}});
}
function toggleEdit(){
  EDIT=!EDIT;
  document.body.classList.toggle('editing',EDIT);
  $('#btnEdit').classList.toggle('on',EDIT);
  let bar=$('#edbar');
  if(EDIT&&!bar){
    bar=document.createElement('div');bar.id='edbar';bar.className='edbar';
    bar.innerHTML=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h4.5L19 9.5a2.1 2.1 0 0 0-3-3L5.5 17z"/></svg>
      <span><b>โหมดแก้ไขตาราง</b> — คลิกที่ตัวเลขในตารางเพื่อแก้ไข กด Enter หรือคลิกนอกช่องเพื่อบันทึก</span>
      <span class="sp"></span><button class="tb" id="btnEdDone" style="height:26px;font-size:11px">เสร็จสิ้น</button>`;
    $('#main').prepend(bar);
  }else if(!EDIT&&bar)bar.remove();
  applyEditMode();
}
function commitCell(td){
  const path=td.dataset.path,dec=+(td.dataset.dec||0);
  const raw=td.textContent.replace(/[, \s]/g,'').replace('—','');
  const v=raw===''?null:Number(raw);
  if(raw!==''&&isNaN(v)){alert('กรุณากรอกเป็นตัวเลข');return}
  const keys=path.split('.'),lastK=keys.pop();
  const obj=keys.reduce((o,k)=>o[/^\d+$/.test(k)?+k:k],D);
  obj[/^\d+$/.test(lastK)?+lastK:lastK]=v;
  saveEdits();
  (RENDER[CUR]||(()=>{}))();
  applyEditMode();
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
    MEI=buildMei();(RENDER[CUR]||(()=>{}))();
  }catch(e){}
}

/* ─────────────── 21) boot ─────────────── */
function boot(){
  applySet();chDefaults();initTip();

  document.addEventListener('click',e=>{
    const g=e.target.closest('[data-go]');
    if(g&&!e.target.closest('td[data-path]')){go(g.dataset.go);return}
    const ac=e.target.closest('[data-accent]');
    if(ac){SET.accent=ac.dataset.accent;saveSet();applySet();chDefaults();renderSettings();return}
    if(e.target.closest('#btnEdDone')){toggleEdit();return}
    const sg=e.target.closest('.segs button');if(!sg)return;
    const w=sg.parentElement;w.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===sg));
    if(w.id==='fiscalSeg'){fiscalMode=sg.dataset.m;renderFiscal();return}
    if(w.id==='agriSeg'){['crop','fruit','main','water','org','base'].forEach(t=>
      $('#agri-'+t).classList.toggle('hide',t!==sg.dataset.t));return}
    if(w.dataset.dom)drawSectorChart(w.dataset.dom,sg.dataset.mode);
  });
  document.addEventListener('focusout',e=>{
    const td=e.target.closest&&e.target.closest('td[data-path][contenteditable]');
    if(td)commitCell(td)});
  document.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&e.target.matches&&e.target.matches('td[data-path][contenteditable]')){e.preventDefault();e.target.blur()}
    if(e.key==='Escape'&&EDIT)toggleEdit()});

  $('#hamb').onclick=()=>document.body.classList.toggle('navopen');
  $('#btnPrint').onclick=()=>window.print();
  $('#btnPrint2').onclick=()=>window.print();
  $('#btnEdit').onclick=toggleEdit;
  $('#btnGppEdit').onclick=()=>{if(!EDIT)toggleEdit()};
  $('#btnCsv').onclick=()=>dl('nbl-economy-'+CFG.latest.y+'.csv',toCsv(),'text/csv;charset=utf-8');
  $('#btnJson').onclick=()=>dl('nbl-economy-data.json',JSON.stringify({real:D,monthly:DB,district:DBD},null,1),'application/json');
  $('#btnExportEdits').onclick=()=>dl('nbl-econ-edits.json',JSON.stringify(D,null,1),'application/json');
  $('#btnResetEdits').onclick=()=>{if(confirm('คืนค่าข้อมูลทั้งหมดเป็นค่าตั้งต้น? การแก้ไขที่บันทึกไว้จะหายไป')){
    localStorage.removeItem(LS.data);location.reload()}};
  $('#btnTheme').onclick=()=>{
    const t=document.documentElement.dataset.theme==='light'?'dark':'light';
    document.documentElement.dataset.theme=t;try{localStorage.setItem('nblEcon.theme',t)}catch(e){}
    chDefaults();go(CUR)};

  /* settings inputs */
  $('#setCoverOp').oninput=e=>{SET.coverOp=+e.target.value;$('#setCoverOpV').textContent=SET.coverOp;applySet()};
  $('#setSideOp').oninput=e=>{SET.sideOp=+e.target.value;$('#setSideOpV').textContent=SET.sideOp;applySet()};
  $('#setKiosk').oninput=e=>{SET.kiosk=+e.target.value;$('#setKioskV').textContent=SET.kiosk};
  $('#setCoverFile').onchange=e=>{const f0=e.target.files[0];if(f0)readImg(f0,d=>{SET.coverUrl=d;saveSet();applySet()})};
  $('#setSideFile').onchange=e=>{const f0=e.target.files[0];if(f0)readImg(f0,d=>{SET.sideUrl=d;saveSet();applySet()})};
  $('#btnSaveSet').onclick=()=>{
    const cu=$('#setCoverUrl').value.trim(),su=$('#setSideUrl').value.trim();
    if(cu)SET.coverUrl=cu; if(su)SET.sideUrl=su;
    SET.api=$('#setApi').value.trim();
    saveSet();applySet();renderSettings();loadLive();
    $('#apiStatus').innerHTML='<span class="chip up">บันทึกแล้ว</span>'};
  $('#btnTestApi').onclick=async()=>{
    const u=$('#setApi').value.trim();
    if(!u){$('#apiStatus').innerHTML='<span class="chip dn">ยังไม่ได้ใส่ URL</span>';return}
    $('#apiStatus').innerHTML='<span class="chip fl">กำลังทดสอบ…</span>';
    try{const r=await jsonp(u,{action:'meta'});
      $('#apiStatus').innerHTML=r&&r.ok?'<span class="chip up">เชื่อมต่อสำเร็จ</span>':'<span class="chip dn">ตอบกลับผิดรูปแบบ</span>'}
    catch(err){$('#apiStatus').innerHTML='<span class="chip dn">เชื่อมต่อไม่สำเร็จ</span>'}};

  /* kiosk */
  let kt=null;
  $('#btnKiosk').onclick=()=>{
    document.body.classList.toggle('kiosk');$('#btnKiosk').classList.toggle('on');
    if(document.body.classList.contains('kiosk')){
      const ord=['overview','gpp','fiscal','agri','industry','trade','consume','labor','tourism','area'];
      let i=ord.indexOf(CUR);if(i<0)i=0;
      kt=setInterval(()=>{i=(i+1)%ord.length;go(ord[i])},(SET.kiosk||20)*1000);
    }else clearInterval(kt);
    setTimeout(()=>{Object.values(CH).forEach(c=>c.resize());if(MAP)MAP.invalidateSize()},300)};

  window.addEventListener('resize',drawRibbon);
  window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h&&h!==CUR)go(h)});
  try{const t=localStorage.getItem('nblEcon.theme');if(t)document.documentElement.dataset.theme=t}catch(e){}
  go(location.hash.slice(1)||'cover');
  loadLive();
}
document.addEventListener('DOMContentLoaded',boot);
