
(function(){
"use strict";

// ═══ AUTH ═══
var curUser=null;
var users={};
try{users=JSON.parse(localStorage.getItem("cr_users")||"{}");}catch(e){}
function saveUsers(){localStorage.setItem("cr_users",JSON.stringify(users));}
function hsh(p){var h=0;for(var i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h|=0;}return h.toString(36);}
function $(id){return document.getElementById(id);}

function showScr(id){$("login-scr").classList.remove("act");$("game-scr").classList.remove("act");$("chat-scr").classList.remove("act");$(id+"-scr").classList.add("act");}

function amsg(m,t){var e=$("amsg");e.textContent=m;e.className="msg "+(t||"");}

$("alogin").onclick=function(){
  var u=$("au").value.trim(),p=$("ap").value;
  if(!u||!p){amsg("Заполни все поля","err");return;}
  if(!users[u]){amsg("Пользователь не найден","err");return;}
  if(users[u].pass!==hsh(p)){amsg("Неверный пароль","err");return;}
  curUser=u;users[u].lastLogin=Date.now();saveUsers();
  loadGame();showScr("game");amsg("","");
};
$("areg").onclick=function(){
  var u=$("au").value.trim(),p=$("ap").value;
  if(!u||!p){amsg("Заполни все поля","err");return;}
  if(u.length<3){amsg("Минимум 3 символа","err");return;}
  if(p.length<4){amsg("Минимум 4 символа пароля","err");return;}
  if(users[u]){amsg("Имя занято","err");return;}
  users[u]={pass:hsh(p),created:Date.now(),lastLogin:Date.now()};saveUsers();
  curUser=u;initNewGame();showScr("game");amsg("Аккаунт создан!","ok");
};
$("lout").onclick=function(){saveGame();curUser=null;showScr("login");};
$("cback").onclick=function(){showScr("game");};

// ═══ GAME STATE ═══
var S={c:0,ct:0,n:0,d:0,e:0,g:0,cl:0,bs:0,pr:0,pp:0,cp:1,ps:0,ns:0,ds:0,es:0,gm:1,dm:1,rl:1,rp:0,rg:100,up:{},ac:[],cb:null,bh:0,lastSave:Date.now()};

var RN=["Цифровой Нексус","Неоновая Сетка","Квантовое Ядро","Кибер-Улей","Тёмная Матрица","Пустотный Сектор","Бесконечный Цикл","Омега-Царство","Альфа-Сингулярность","Кибер-Эдем","Нейросеть","Фантомная Зона","Бинарный Шторм","Хромовая Пустота","Океан Данных","Пустотное Ядро","Мультивселенная","Тёмная Энергия","Сингулярность"];

var UPG=[
  {n:"Нейро-Связь",d:"➕1 тап",cb:10,fn:function(){S.cp+=1},mx:100},
  {n:"Лазерный Фокус",d:"➕5 тапов",cb:100,fn:function(){S.cp+=5},mx:50},
  {n:"Плазменное Ядро",d:"➕25 тапов",cb:1000,fn:function(){S.cp+=25},mx:30},
  {n:"Нано-Бот",d:"+0.5/с",cb:50,fn:function(){S.ps+=0.5},mx:50},
  {n:"Рой Дронов",d:"+2/с",cb:200,fn:function(){S.ps+=2},mx:30},
  {n:"ИИ-Ядро",d:"+10/с",cb:1000,fn:function(){S.ps+=10},mx:20},
  {n:"Квантовая Ферма",d:"+50/с",cb:5000,fn:function(){S.ps+=50},mx:15},
  {n:"Матрица",d:"+200/с",cb:25000,fn:function(){S.ps+=200},mx:10},
  {n:"Компрессор",d:"×1.5 всё",cb:250,fn:function(){S.gm*=1.5},mx:5},
  {n:"Двигатель Энтропии",d:"×2 всё",cb:2500,fn:function(){S.gm*=2},mx:3},
  {n:"Солнечная Панель",d:"+1 ⚡/тап",cb:30,fn:function(){S.ns+=1},mx:20},
  {n:"Дата-Майнер",d:"+1 🧬/тап",cb:25,fn:function(){S.ds+=1},mx:20},
  {n:"Шифратор",d:"×2 данные",cb:300,fn:function(){S.dm*=2},mx:5},
  {n:"Инжектор Хаоса",d:"+1 🌀/тап",cb:500,fn:function(){S.es+=1},mx:10},
];

var BS=[
  {n:"Глитч-Фантом",hp:100,cr:50,ic:"👻"},
  {n:"Фаервол-Голем",hp:500,cr:200,ic:"🗿"},
  {n:"Вирусный Рой",hp:2000,cr:800,ic:"🦠"},
  {n:"Дата-Кракен",hp:8000,cr:3000,ic:"🐙"},
  {n:"Квантовый Дракон",hp:30000,cr:12000,ic:"🐉"},
  {n:"Нейро-Владыка",hp:100000,cr:50000,ic:"🧠"},
  {n:"Пустотный Император",hp:500000,cr:200000,ic:"👑"},
  {n:"Омега-Сингулярность",hp:2e6,cr:1e6,ic:"🌀"},
  {n:"Тёмная Материя",hp:5e6,cr:2e6,ic:"💫"},
  {n:"Чёрная Дыра",hp:2e7,cr:5e6,ic:"🕳️"},
];

var ACHS=[
  {id:"a1",n:"Первый Тап",d:"Нажми один раз",i:"👆",ck:function(){return S.cl>=1}},
  {id:"a2",n:"Кликер",d:"Нажми 100 раз",i:"🖱️",ck:function(){return S.cl>=100}},
  {id:"a3",n:"Богач",d:"Заработай 10 000",i:"💰",ck:function(){return S.ct>=1e4}},
  {id:"a4",n:"Убийца Боссов",d:"Победи 1 босса",i:"⚔️",ck:function(){return S.bs>=1}},
  {id:"a5",n:"Охотник",d:"Победи 10 боссов",i:"🏆",ck:function(){return S.bs>=10}},
  {id:"a6",n:"Странник",d:"Рейм ур.10",i:"🌌",ck:function(){return S.rl>=10}},
  {id:"a7",n:"Престиж",d:"Престиж 1 раз",i:"🌟",ck:function(){return S.pr>=1}},
  {id:"a8",n:"Демон Скорости",d:"100/с доход",i:"🚀",ck:function(){return getCPS()>=100}},
  {id:"a9",n:"Коллекционер",d:"10 улучшений",i:"📦",ck:function(){return Object.keys(S.up).length>=10}},
  {id:"a10",n:"Мастер",d:"Рейм ур.25",i:"👑",ck:function(){return S.rl>=25}},
];

function getCPS(){return S.ps*S.gm;}
function fmt(n){if(n>=1e12)return(n/1e12).toFixed(1)+"T";if(n>=1e9)return(n/1e9).toFixed(1)+"B";if(n>=1e6)return(n/1e6).toFixed(1)+"M";if(n>=1e4)return(n/1e3).toFixed(1)+"K";return Math.floor(n);}
function showPact(){document.getElementById("panel").classList.add("act");}
function showPdis(){document.getElementById("panel").classList.remove("act");}

// ═══ TAP ═══
var tpBtn=$("tpbtn");
function doTap(){
  var v=Math.floor(S.cp*S.gm);
  S.c+=v;S.ct+=v;S.cl++;S.rp+=v;S.n+=S.ns;S.d+=S.ds*S.dm;S.e+=S.es;
  $("tpinfo").textContent="+"+fmt(v)+" 💎";
  tpBtn.classList.add("active");setTimeout(function(){tpBtn.classList.remove("active");},120);
  var rip=document.createElement("div");rip.className="ripple";tpBtn.appendChild(rip);setTimeout(function(){rip.remove();},600);
  if(S.cb&&S.bh>0){S.bh-=v;if(S.bh<=0)winBoss();}
  while(S.rp>=S.rg){S.rp-=S.rg;S.rl++;S.rg=Math.floor(S.rg*1.4);S.cp+=Math.ceil(S.rl*0.5);S.ps+=S.rl*0.3;lvlUp(S.rl);}
  if(!S.cb&&S.rl>=5&&Math.random()<0.01)spawnBoss();
  chkAch();fly("+ "+fmt(v));draw();
}
tpBtn.addEventListener("touchstart",function(e){e.preventDefault();doTap();},{passive:false});
tpBtn.addEventListener("mousedown",function(e){e.preventDefault();doTap();});

function spawnBoss(){var i=Math.min(Math.floor(S.rl/5),BS.length-1);S.cb={...BS[i]};S.bh=S.cb.hp;showBoss();}
function winBoss(){var r=Math.floor(S.cb.cr*S.gm);S.c+=r;S.bs++;fly("+ "+fmt(r)+" 💎");S.cb=null;S.bh=0;chkAch();hideBoss();}
function lvlUp(lv){$("ovt").textContent="🌀 УРОВЕНЬ!";$("ovp").textContent="Рейм уровень "+lv+" — "+RN[Math.min(lv-1,RN.length-1)];$("ovb").innerHTML='<button onclick="document.getElementById(\'ov\').classList.remove(\'act\');">OK</button>';$("ov").classList.add("act");}
function chkAch(){for(var i=0;i<ACHS.length;i++){var a=ACHS[i];if(S.ac.indexOf(a.id)<0&&a.ck()){S.ac.push(a.id);S.g+=10;}}}

function showBoss(){$("bfight").classList.add("act");$("bfs").textContent=S.cb.ic;$("bfn").textContent=S.cb.n;updateBossHP();}
function hideBoss(){$("bfight").classList.remove("act");}
function updateBossHP(){var pct=Math.max(0,(S.bh/S.cb.hp)*100);var hpEl=document.querySelector("#bfight .hp-f");if(hpEl)hpEl.style.width=pct+"%";$("bftext").textContent="HP: "+fmt(S.bh)+" / "+fmt(S.cb.hp);}

$("bfatk").onclick=function(){
  var v=Math.floor(S.cp*S.gm);S.bh-=v;S.rp+=v;S.c+=v;S.ct+=v;S.n+=S.ns;S.d+=S.ds*S.dm;S.e+=S.es;
  var dmg=document.createElement("div");dmg.className="fdmg";dmg.textContent="-"+fmt(v);dmg.style.left=(30+Math.random()*40)+"%";dmg.style.top="30%";document.getElementById("bfight").appendChild(dmg);setTimeout(function(){dmg.remove();},800);
  if(S.bh<=0)winBoss();else updateBossHP();
  while(S.rp>=S.rg){S.rp-=S.rg;S.rl++;S.rg=Math.floor(S.rg*1.4);S.cp+=Math.ceil(S.rl*0.5);S.ps+=S.rl*0.3;}
  draw();
};

// ═══ DRAW ═══
function draw(){
  $("rc").textContent=fmt(S.c);$("rn").textContent=fmt(S.n);$("rd").textContent=fmt(S.d);$("re").textContent=fmt(S.e);
  $("rcR").textContent=getCPS()>0?"+"+fmt(getCPS())+"/с":"";
  $("tcps").textContent="в сек: "+fmt(getCPS())+" | тапов: "+fmt(S.cl);
  $("prog-fi").style.width=Math.min(100,(S.rp/S.rg)*100)+"%";
  $("prog-t").textContent="Рейм ур."+S.rl+" — "+RN[Math.min(S.rl-1,RN.length-1)];
  $("uname").textContent=curUser||"";
}
function fly(t){var p=document.createElement("div");p.className="pt";p.textContent=t;p.style.left=(30+Math.random()*40)+"%";p.style.top="40%";$("pts").appendChild(p);setTimeout(function(){p.remove();},800);}

// ═══ PANEL ═══
var curTab="up";
$("pcan").onclick=function(){showPdis();};
$("ptabs").addEventListener("click",function(e){var t=e.target.closest(".ptab");if(!t)return;$("ptabs").querySelectorAll(".ptab").forEach(function(x){x.classList.remove("on");});t.classList.add("on");curTab=t.dataset.t;renderP();});

function renderP(){
  var p=$("pc");p.innerHTML="";
  if(curTab==="up")renderUp(p);else if(curTab==="bo")renderBossPanel(p);else if(curTab==="ac")renderAch(p);
  else if(curTab==="qu")renderQuest(p);else if(curTab==="sh")renderShop(p);
}

function renderUp(p){
  p.innerHTML='<div class="sec">⬆️ Улучшения</div>';
  for(var i=0;i<UPG.length;i++){
    var u=UPG[i],o=S.up[i]||0,mx=o>=u.mx,cost=Math.floor(u.cb*Math.pow(1.15,o)),ok=S.c>=cost&&!mx;
    p.innerHTML+='<div class="up'+(mx?' m':'')+'" data-i="'+i+'"><div class="h"><span class="nm">'+u.n+'</span><span class="lv">'+o+'/'+u.mx+'</span></div><div class="d">'+u.d+'</div><div class="c'+(ok?' ok':'')+'">'+(mx?'МАКС':fmt(cost)+' 💎')+'</div></div>';
  }
  p.querySelectorAll(".up").forEach(function(el){
    el.onclick=function(){if(el.classList.contains("m"))return;var i=parseInt(el.dataset.i),u=UPG[i],o=S.up[i]||0,cost=Math.floor(u.cb*Math.pow(1.15,o));if(S.c<cost)return;S.c-=cost;S.up[i]=o+1;u.fn();chkAch();renderP();draw();};
  });
}

function renderBossPanel(p){
  if(!S.cb){p.innerHTML='<div class="sec">👹 Боссы</div><div style="color:#777;font-size:11px;margin:8px 0">Доберись до Рейм ур.5+ чтобы встретить боссов!</div><button class="atk-btn" id="sb">⚔️ Призвать босса</button>';$("sb").onclick=function(){spawnBoss();};}
  else{var pct=Math.max(0,(S.bh/S.cb.hp)*100);p.innerHTML='<div class="sec">👹 '+S.cb.ic+' '+S.cb.n+'</div><div class="boss hp"><div class="boss hp-f" style="width:'+pct+'%"></div></div><div class="boss st"><span>HP: '+fmt(S.bh)+' / '+fmt(S.cb.hp)+'</span><span>'+pct.toFixed(0)+'%</span></div><div class="boss rw">Награда: '+fmt(S.cb.cr)+' 💎</div><button class="atk-btn" id="abtn">⚔️ АТАКОВАТЬ ('+fmt(Math.floor(S.cp*S.gm))+' урона)</button>';
  $("abtn").onclick=function(){var v=Math.floor(S.cp*S.gm);S.bh-=v;S.rp+=v;S.c+=v;S.ct+=v;S.n+=S.ns;S.d+=S.ds*S.dm;S.e+=S.es;if(S.bh<=0)winBoss();else renderBossPanel($("pc"));draw();};}
}

function renderAch(p){
  p.innerHTML='<div class="sec">🏆 Достижения ('+S.ac.length+'/'+ACHS.length+')</div>';
  for(var i=0;i<ACHS.length;i++){var a=ACHS[i],done=S.ac.indexOf(a.id)>=0;p.innerHTML+='<div class="ach'+(done?' do':'')+'"><span class="ic">'+(done?'✅':a.i)+'</span><div class="inf"><div class="an">'+a.n+'</div><div class="ad">'+a.d+'</div></div>'+(done?'<span class="ar">Получено</span>':'<span class="ar">💎10</span>')+'</div>';}
}

function renderQuest(p){
  if(!S.quests||!S.quests.length){S.quests=[{id:"q1",n:"Нажми 50 раз",d:"Сделай 50 тапов",ck:function(){return S.cl>=50},rw:5},{id:"q2",n:"Заработай 5K",d:"Собери 5000 кредитов",ck:function(){return S.ct>=5000},rw:10},{id:"q3",n:"Победи 3 босса",d:"Убей 3 боссов",ck:function(){return S.bs>=3},rw:15}];}
  p.innerHTML='<div class="sec">📜 Задания</div>';
  for(var i=0;i<S.quests.length;i++){var q=S.quests[i],done=q.ck();p.innerHTML+='<div class="up"><div class="h"><span class="nm">'+q.n+'</span>'+(done?'<span class="lv">✅</span>':'')+'</div><div class="d">'+q.d+'</div>'+(done?'<button data-qid="'+q.id+'" style="margin-top:4px;width:100%;background:#a0f;border:none;color:#fff;padding:6px;border-radius:3px;cursor:pointer">Забрать '+q.rw+' 💎</button>':'')+'</div>';}
  p.querySelectorAll("[data-qid]").forEach(function(b){
    b.onclick=function(){var q=S.quests.find(function(x){return x.id===b.dataset.qid});if(!q||!q.ck())return;S.g+=q.rw;S.quests=S.quests.filter(function(x){return x.id!==q.id;});renderP();draw();};
  });
}

function renderShop(p){
  p.innerHTML='<div class="sec">🛒 Магазин</div><div class="shop"><div class="si">💎</div><div class="sn">Стартовый набор</div><div class="sd">100 Гемов — для начинающих</div><div class="sp">$0.99</div><button data-g="100">Купить</button></div><div class="shop"><div class="si">💎</div><div class="sn">Про-набор</div><div class="sd">500 Гемов + ×2/час</div><div class="sp">$2.99</div><button data-g="500">Купить</button></div><div class="shop"><div class="si">💎</div><div class="sn">Мега-набор</div><div class="sd">2000 Гемов + ×3/час</div><div class="sp">$9.99</div><button data-g="2000">Купить</button></div><div class="shop"><div class="si">👑</div><div class="sn">VIP-пропуск</div><div class="sd">×1.5 навсегда + 1000 Гемов</div><div class="sp">$19.99</div><button data-g="1000">Купить</button></div>';
  p.querySelectorAll("[data-g]").forEach(function(b){b.onclick=function(){S.g+=parseInt(b.dataset.g);fly("+ "+fmt(parseInt(b.dataset.g))+" гемов");draw();};});
}

function renderSettings(){
  $("ptitle").textContent="⚙️ Ещё";document.getElementById("ptabs").style.display="none";
  var p=$("pc");
  var h='<div class="sec">⚙️ Настройки</div>';
  h+='<div class="strow"><span class="sl">Пользователь</span><span class="sv">'+curUser+'</span></div>';
  h+='<div class="strow"><span class="sl">Тапов</span><span class="sv">'+fmt(S.cl)+'</span></div>';
  h+='<div class="strow"><span class="sl">Всего кредитов</span><span class="sv">'+fmt(S.ct)+'</span></div>';
  h+='<div class="strow"><span class="sl">Рейм уровень</span><span class="sv">'+S.rl+'</span></div>';
  h+='<div class="strow"><span class="sl">Боссов убито</span><span class="sv">'+S.bs+'</span></div>';

  h+='<div class="sec" style="margin-top:12px">🌟 Престиж ('+Math.floor(Math.sqrt(S.ct/1e6)+S.rl*0.5)+' очков)</div>';
  h+='<button class="btn" id="prBtn" style="background:linear-gradient(135deg,#ffd700,#ff8c00);color:#000;cursor:pointer">Престиж</button>';
  h+='<button class="btn" style="margin-top:6px;background:rgba(0,255,255,.1);border:1px solid #0ff3;color:#0ff;cursor:pointer" id="exBtn">📤 Экспорт</button>';
  h+='<button class="btn" style="margin-top:6px;background:rgba(0,255,255,.1);border:1px solid #0ff3;color:#0ff;cursor:pointer" id="imBtn">📥 Импорт</button>';
  h+='<button class="danger" id="dlBtn" style="margin-top:6px">🗑️ Удалить всё</button>';
  p.innerHTML=h;
  $("prBtn").onclick=function(){var pts=Math.floor(Math.sqrt(S.ct/1e6)+S.rl*0.5);if(pts<1)return;dlg("🌟 Престиж","Сбросить прогресс за "+pts+" очков?\nПостоянный бонус: +"+Math.floor(pts*10)+"% к тапу",[{t:"Отмена",f:function(){cdlg();}},{t:"Престиж!",f:function(){doPres();}}]);};
  $("exBtn").onclick=function(){prompt("Скопируй код сохранения:",btoa(JSON.stringify(S)));};
  $("imBtn").onclick=function(){var d=prompt("Вставь код сохранения:");if(!d)return;try{Object.assign(S,JSON.parse(atob(d)));save();showPdis();draw();}catch(e){alert("Неверный код");}};
  $("dlBtn").onclick=function(){dlg("Удалить ВСЁ?","Это нельзя отменить!",[{t:"Отмена",f:function(){cdlg();}},{t:"УДАЛИТЬ",f:function(){localStorage.removeItem("cr_save");localStorage.removeItem("cr_saves");location.reload();}}]);};
}

function doPres(){
  var pts=Math.floor(Math.sqrt(S.ct/1e6)+S.rl*0.5);
  if(pts<1){cdlg();return;}
  S.pr++;S.pp+=pts;S.c=0;S.ct=0;S.n=0;S.d=0;S.e=0;S.cl=0;
  S.cp=1+S.pp*0.1;S.ps=0;S.gm=1;S.dm=1;S.ns=0;S.ds=0;S.es=0;
  S.rl=1;S.rp=0;S.rg=100;S.up={};S.cb=null;S.bh=0;
  cdlg();showPdis();draw();
}

// ═══ CHAT + ТИКЕТЫ ═══
var chatTab="g";
// ═══ CHAT + OWL ═══
var chatTab="g";
var chatMsgs=[];
try{chatMsgs=JSON.parse(localStorage.getItem("cr_chat")||"[]");}catch(e){}
function saveChat(){localStorage.setItem("cr_chat",JSON.stringify(chatMsgs.slice(-200)));}
function addMsg(author,text){chatMsgs.push({a:author,t:text,ts:Date.now()});saveChat();renderChat();}

function owlReply(text){
  var L=text.toLowerCase(),r="";
  if(L.indexOf("босс")>=0){var bn=["Пустотный","Небулярный","Квазаровый","Пульсарный","Тёмный"];var bi=["🌌","🌠","⚡","🔮","💫"];var i=Math.floor(Math.random()*bn.length);var hp=Math.floor(5e4*Math.pow(1.8,BS.length));BS.push({n:bn[i]+" Владыка",hp:hp,cr:Math.floor(hp*.4),ic:bi[i]});r="✅ Босс создан!\n👹 "+bn[i]+" Владыка\n❤️ HP: "+fmt(hp)+"\n💰 Награда: "+fmt(Math.floor(hp*.4))+"💎\nВсего боссов: "+BS.length;}
  else if(L.indexOf("улучшен")>=0||L.indexOf("апгрейд")>=0){var un=["Квантовый Ускоритель","Нейро-Усилитель","Плазменный Инжектор"];var i=Math.floor(Math.random()*un.length);var c=Math.floor(100*Math.pow(2,UPG.length));UPG.push({n:un[i],d:"+10% доход",cb:c,fn:function(){S.gm*=1.1},mx:3});r="✅ Улучшение добавлено!\n⚡ "+un[i]+"\nЦена: "+fmt(c)+"💎\nУлучшений: "+UPG.length;}
  else if(L.indexOf("кредит")>=0||L.indexOf("монет")>=0||L.indexOf("денег")>=0){var a=500+Math.floor(Math.random()*2000);S.c+=a;S.ct+=a;r="💰 Начислено "+fmt(a)+" кредитов!\nБаланс: "+fmt(S.c)+"💎";}
  else if(L.indexOf("уровень")>=0||L.indexOf("рейм")>=0){var lv=1+Math.floor(Math.random()*3);S.rl+=lv;r="🌀 Рейм повышен на "+lv+"!\nУровень: "+S.rl+"\nДо следующего: "+fmt(S.rg-S.rp)+"💎";}
  else if(L.indexOf("гем")>=0||L.indexOf("премиум")>=0){var g=20+Math.floor(Math.random()*80);S.g+=g;r="💎 Начислено "+g+" гемов!\nБаланс: "+S.g+"💎";}
  else if(L.indexOf("баг")>=0||L.indexOf("ошибк")>=0||L.indexOf("не работа")>=0){S.c+=1e3;S.g+=50;S.cp+=5;r="🐛 Баги исправлены!\n\nПатчи:\n✅ Кнопки на мобильных\n✅ Панель улучшений\n✅ Чат OWL\n✅ Сохранение при выходе\n\nБонус: +1000💎 +50💎гемов +5 тап";}
  else if(L.indexOf("привет")>=0||L.indexOf("хай")>=0){r="👋 Привет, "+currentUser+"!\nЯ — OWL 🦉, ИИ-разработчик.\n\n📌 Команды:\n• Добавь босса\n• Добавь улучшение\n• Дай кредитов/гемов\n• Повысь уровень\n• Исправь баги\n\nКаждая команда = бонус! 🎁";}
  else{S.c+=300;S.g+=10;r="✅ Принято! Бонус: +300💎 +10💎гемов\n\nБаланс: "+fmt(S.c)+"💎 | Гемы: "+S.g;}
  addMsg("🦉 OWL",r,false);draw();
}

function renderChat(){
  var e=$("chmsgs");e.innerHTML="";
  for(var i=0;i<chatMsgs.length;i++){
    var m=chatMsgs[i],d=new Date(m.ts),t=d.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"});
    var isOwl=(m.a==="🦉 OWL");
    var html='<div class="chmsg'+(isOwl?'':' me')+'">';
    html+='<div class="auth">'+m.a+'</div>';
    html+='<div class="txt" style="white-space:pre-wrap">'+m.t+'</div>';
    html+='<div class="time">'+t+'</div></div>';
    e.innerHTML+=html;
  }
  if(!chatMsgs.length){
    e.innerHTML='<div style="text-align:center;color:#555;padding:20px">Сообщений пока нет</div>';
  }
  e.scrollTop=e.scrollHeight;
}

function sendChat(){
  var text=$("chin").value.trim();
  if(!text)return;$("chin").value="";
  addMsg(curUser,text);
  if(chatTab==="o"){$("chowli").style.display="block";setTimeout(function(){$("chowli").style.display="false";owlReply(text);},800+Math.random()*1200);}
}

$("chsend").onclick=sendChat;
$("chin").addEventListener("keydown",function(e){if(e.key==="Enter")sendChat();});
$("chtabs").addEventListener("click",function(e){
  var t=e.target.closest(".chtab");if(!t)return;$("chtabs").querySelectorAll(".chtab").forEach(function(x){x.classList.remove("on");});
  t.classList.add("on");chatTab=t.dataset.ct;$("chin").placeholder=chatTab==="o"?"Задание для OWL...":"Сообщение...";renderChat();
});

function sendChat(){
  var text=$("chin").value.trim();
  if(!text)return;$("chin").value="";
  addMsg(curUser,text);
  if(chatTab==="o"){$("chowli").style.display="block";setTimeout(function(){$("chowli").style.display="false";owlReply(text);},800+Math.random()*1200);}
}

$("chsend").onclick=sendChat;
$("chin").addEventListener("keydown",function(e){if(e.key==="Enter")sendChat();});
$("chtabs").addEventListener("click",function(e){var t=e.target.closest(".chtab");if(!t)return;$("chtabs").querySelectorAll(".chtab").forEach(function(x){x.classList.remove("on");});t.classList.add("on");chatTab=t.dataset.ct;renderChat();});

// ═══ SAVE/LOAD ═══
function save(){
  if(!curUser)return;
  S.lastSave=Date.now();
  var saves={};try{saves=JSON.parse(localStorage.getItem("cr_saves")||"{}");}catch(e){}
  saves[curUser]=JSON.stringify(S);
  localStorage.setItem("cr_saves",JSON.stringify(saves));
  localStorage.setItem("cr_lastUser",curUser);
}
function loadGame(){
  if(!curUser)return;
  try{var saves=JSON.parse(localStorage.getItem("cr_saves")||"{}");var d=saves[curUser];if(d){var v=JSON.parse(d);for(var k in v)S[k]=v[k];}}catch(e){}
}
function initNewGame(){S={c:0,ct:0,n:0,d:0,e:0,g:0,cl:0,bs:0,pr:0,pp:0,cp:1,ps:0,ns:0,ds:0,es:0,gm:1,dm:1,rl:1,rp:0,rg:100,up:{},ac:[],cb:null,bh:0,lastSave:Date.now()};}

// ═══ AUTO SAVE ON EXIT ═══
window.addEventListener("beforeunload",function(){save();});
window.addEventListener("visibilitychange",function(){if(document.hidden)save();});

// ═══ LOOP ═══
setInterval(function(){
  if(getCPS()>0){var inc=getCPS()*0.3;S.c+=inc;S.ct+=inc;S.rp+=inc;}
  while(S.rp>=S.rg){S.rp-=S.rg;S.rl++;S.rg=Math.floor(S.rg*1.4);S.cp+=Math.ceil(S.rl*0.5);S.ps+=S.rl*0.3;}
  draw();
},300);
setInterval(function(){save();},10000);

// ═══ TICKET SYSTEM → GitHub Issues ═══
var GITHUB_TOKEN="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";
var GITHUB_REPO="tommleebusiness/cyber-realm-idle";

function sendTicketToGitHub(title,body){
  var url="https://api.github.com/repos/"+GITHUB_REPO+"/issues";
  var data={title:"[Игрок: "+curUser+"] "+title,body:"**От:** "+curUser+"\n**Время:** "+new Date().toLocaleString("ru")+"\n\n"+body+"\n\n---\n*Автоматически создано из Cyber Realm Idle*",labels:["player-request"]};
  fetch(url,{
    method:"POST",
    headers:{"Authorization":"token "+GITHUB_TOKEN,"Content-Type":"application/json","Accept":"application/vnd.github+json"},
    body:JSON.stringify(data)
  }).then(function(r){return r.json()}).then(function(d){
    if(d.number){
      addMsg("🦉 OWL","✅ Задача #"+d.number+" отправлена разработчику!\n\n📋 "+title+"\n\n🔗 "+d.html_url+"\n\nЯ прочитаю её и внесу правки в ближайшем обновлении.",false);
      // Mark all pending tasks as submitted
      for(var i=0;i<owlTasks.length;i++){if(!owlTasks[i].submitted){owlTasks[i].submitted=true;}}
      saveTasks();renderChat();
    }else{
      addMsg("🦉 OWL","❌ Ошибка отправки: "+(d.message||"неизвестная ошибка")+"\n\nПопробуй позже или напиши напрямую.",false);
    }
  }).catch(function(e){
    addMsg("🦉 OWL","❌ Ошибка сети: "+e.message+"\n\nПроверь подключение к интернету.",false);
  });
}

// Show ticket panel when on OWL tab
var origSendChat=sendChat;
$("chtabs").addEventListener("click",function(e){
  var t=e.target.closest(".chtab");if(!t)return;
  $("chtabs").querySelectorAll(".chtab").forEach(function(x){x.classList.remove("on");});
  t.classList.add("on");chatTab=t.dataset.ct;
  $("chin").placeholder=chatTab==="o"?"Задание для OWL...":"Сообщение...";
  $("chticket").style.display=(chatTab==="o"&&owlTasks.length>0)?"block":"none";
  renderChat();
});

function sendChat(){
  var text=$("chin").value.trim();
  if(!text)return;$("chin").value="";
  addMsg(curUser,text);
  if(chatTab==="o"){$("chowli").style.display="block";setTimeout(function(){$("chowli").style.display="false";owlReply(text);},800+Math.random()*1200);}
}

$("chsend").onclick=sendChat;
$("chin").addEventListener("keydown",function(e){if(e.key==="Enter")sendChat();});

// ═══ INIT ═══
var lastUser=localStorage.getItem("cr_lastUser");
if(lastUser&&users[lastUser]){curUser=lastUser;loadGame();showScr("game");}else{showScr("login");}
draw();

})();
