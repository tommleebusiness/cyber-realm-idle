
(function(){
var curUser=null,users={};
try{users=JSON.parse(localStorage.getItem("cr_users")||"{}");}catch(e){}
function saveUsers(){localStorage.setItem("cr_users",JSON.stringify(users));}
function hsh(p){var h=0;for(var i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h|=0;}return h.toString(36);}
function $(id){return document.getElementById(id);}

function showScr(id){
  document.querySelectorAll(".scr").forEach(function(s){s.classList.remove("act");});
  $(id).classList.add("act");
}

function amsg(m,t){var e=$("amsg");e.textContent=m;e.className="msg "+(t||"");}

$("alogin").onclick=function(){
  var u=$("au").value.trim(),p=$("ap").value;
  if(!u||!p){amsg("Заполни все поля","err");return;}
  if(!users[u]){amsg("Пользователь не найден","err");return;}
  if(users[u].pass!==hsh(p)){amsg("Неверный пароль","err");return;}
  curUser=u;users[u].lastLogin=Date.now();saveUsers();loadGame();showScr("game-scr");
};

$("areg").onclick=function(){
  var u=$("au").value.trim(),p=$("ap").value;
  if(!u||!p){amsg("Заполни все поля","err");return;}
  if(u.length<3){amsg("Минимум 3 символа","err");return;}
  if(p.length<4){amsg("Минимум 4 символа пароля","err");return;}
  if(users[u]){amsg("Имя занято","err");return;}
  users[u]={pass:hsh(p),created:Date.now(),lastLogin:Date.now()};saveUsers();
  curUser=u;initNewGame();showScr("game-scr");amsg("Аккаунт создан!","ok");
};

$("lout").onclick=function(){saveGame();curUser=null;showScr("login-scr");};
$("cback").onclick=function(){showScr("game-scr");};

var S={c:0,ct:0,n:0,d:0,e:0,g:0,cl:0,bs:0,pr:0,pp:0,cp:1,ps:0,ns:0,ds:0,es:0,gm:1,dm:1,rl:1,rp:0,rg:100,up:{},ac:[],cb:null,bh:0,lastSave:Date.now()};
var RN=["Цифровой Нексус","Неоновая Сетка","Квантовое Ядро","Кибер-Улей","Тёмная Матрица","Пустотный Сектор","Бесконечный Цикл","Омега-Царство","Альфа-Сингулярность","Кибер-Эдем","Нейросеть","Фантомная Зона","Бинарный Шторм","Хромовая Пустота","Океан Данных","Пустотное Ядро"];
var UPG=[
  {n:"Нейро-Связь",d:"+1 тап",cb:10,fn:function(){S.cp+=1},mx:100},
  {n:"Лазерный Фокус",d:"+5 тапов",cb:100,fn:function(){S.cp+=5},mx:50},
  {n:"Плазменное Ядро",d:"+25 тапов",cb:1000,fn:function(){S.cp+=25},mx:30},
  {n:"Нано-Бот",d:"+0.5/с",cb:50,fn:function(){S.ps+=0.5},mx:50},
  {n:"Рой Дронов",d:"+2/с",cb:200,fn:function(){S.ps+=2},mx:30},
  {n:"ИИ-Ядро",d:"+10/с",cb:1000,fn:function(){S.ps+=10},mx:20},
  {n:"Квантовая Ферма",d:"+50/с",cb:5000,fn:function(){S.ps+=50},mx:15},
  {n:"Тёмная Материя",d:"+200/с",cb:25000,fn:function(){S.ps+=200},mx:10},
  {n:"Компрессор",d:"x1.5 всё",cb:250,fn:function(){S.gm*=1.5},mx:5},
  {n:"Энтропия",d:"x2 всё",cb:2500,fn:function(){S.gm*=2},mx:3},
  {n:"Солнечная Панель",d:"+1 ⚡/тап",cb:30,fn:function(){S.ns+=1},mx:20},
  {n:"Дата-Майнер",d:"+1 🧬/тап",cb:25,fn:function(){S.ds+=1},mx:20},
  {n:"Шифратор",d:"x2 данные",cb:300,fn:function(){S.dm*=2},mx:5},
  {n:"Инжектор Хаоса",d:"+1 🌀/тап",cb:500,fn:function(){S.es+=1},mx:10},
  {n:"Кристалл Пустоты",d:"+5 тап +2/с",cb:10000,fn:function(){S.cp+=5;S.ps+=2},mx:5}
];
var BS=[{n:"Глитч-Фантом",hp:100,cr:50,ic:"👻"},{n:"Фаервол-Голем",hp:500,cr:200,ic:"🗿"},{n:"Вирусный Рой",hp:2000,cr:800,ic:"🦠"},{n:"Дата-Кракен",hp:8000,cr:3000,ic:"🐙"},{n:"Квантовый Дракон",hp:30000,cr:12000,ic:"🐉"},{n:"Нейро-Владыка",hp:100000,cr:50000,ic:"🧠"},{n:"Пустотный Император",hp:500000,cr:200000,ic:"👑"},{n:"Омега-Сингулярность",hp:2e6,cr:1e6,ic:"🌀"}];
var ACHS=[
  {id:"a1",n:"Первый Тап",i:"👆",ck:function(){return S.cl>=1}},
  {id:"a2",n:"Кликер",i:"🖱️",ck:function(){return S.cl>=100}},
  {id:"a3",n:"Богач",i:"💰",ck:function(){return S.ct>=1e4}},
  {id:"a4",n:"Убийца Боссов",i:"⚔️",ck:function(){return S.bs>=1}},
  {id:"a5",n:"Охотник",i:"🏆",ck:function(){return S.bs>=10}},
  {id:"a6",n:"Странник",i:"🌌",ck:function(){return S.rl>=10}},
  {id:"a7",n:"Престиж",i:"🌟",ck:function(){return S.pr>=1}},
  {id:"a8",n:"Демон Скорости",i:"🚀",ck:function(){return getCPS()>=100}},
  {id:"a9",n:"Коллекционер",i:"📦",ck:function(){return Object.keys(S.up).length>=10}},
  {id:"a10",n:"Мастер",i:"👑",ck:function(){return S.rl>=25}},
  {id:"a11",n:"Биллионер",i:"💎",ck:function(){return S.ct>=1e9}},
  {id:"a12",n:"Легенда",i:"⭐",ck:function(){return S.pr>=5}}
];

function getCPS(){return S.ps*S.gm;}
function fmt(n){if(n>=1e12)return(n/1e12).toFixed(1)+"T";if(n>=1e9)return(n/1e9).toFixed(1)+"B";if(n>=1e6)return(n/1e6).toFixed(1)+"M";if(n>=1e4)return(n/1e3).toFixed(1)+"K";return Math.floor(n);}

var tpBtn=$("tpbtn");
function doTap(){
  var v=Math.floor(S.cp*S.gm);
  S.c+=v;S.ct+=v;S.cl++;S.rp+=v;S.n+=S.ns;S.d+=S.ds*S.dm;S.e+=S.es;
  $("tpinfo").textContent="+"+fmt(v)+" 💎";
  tpBtn.classList.add("active");
  setTimeout(function(){tpBtn.classList.remove("active");},120);
  if(S.cb&&S.bh>0){S.bh-=v;if(S.bh<=0)winBoss();}
  while(S.rp>=S.rg){S.rp-=S.rg;S.rl++;S.rg=Math.floor(S.rg*1.4);S.cp+=Math.ceil(S.rl*0.5);S.ps+=S.rl*0.3;lvlUp(S.rl);}
  if(!S.cb&&S.rl>=5&&Math.random()<0.01)spawnBoss();
  chkAch();fly("+ "+fmt(v));draw();
}
tpBtn.addEventListener("touchstart",function(e){e.preventDefault();doTap();},{passive:false});
tpBtn.addEventListener("mousedown",function(e){e.preventDefault();doTap();});

function spawnBoss(){var i=Math.min(Math.floor(S.rl/5),BS.length-1);S.cb=BS[i];S.bh=S.cb.hp;showBoss();}
function winBoss(){var r=Math.floor(S.cb.cr*S.gm);S.c+=r;S.bs++;fly("+ "+fmt(r)+" 💎");S.cb=null;S.bh=0;chkAch();hideBoss();}
function lvlUp(lv){$("ovt").textContent="🌀 УРОВЕНЬ!";$("ovp").textContent="Рейм уровень "+lv+" — "+RN[Math.min(lv-1,RN.length-1)];$("ovb").innerHTML='<button onclick="document.getElementById(\'ov\').classList.remove(\'act\')">OK</button>';$("ov").classList.add("act");}
function chkAch(){for(var i=0;i<ACHS.length;i++){var a=ACHS[i];if(S.ac.indexOf(a.id)<0&&a.ck()){S.ac.push(a.id);S.g+=10;}}}
function showBoss(){$("bfight").classList.add("act");$("bfs").textContent=S.cb.ic;$("bfn").textContent=S.cb.n;updateBossHP();}
function hideBoss(){$("bfight").classList.remove("act");}
function updateBossHP(){var pct=Math.max(0,(S.bh/S.cb.hp)*100);$("bf-hp").style.width=pct+"%";$("bftext").textContent="HP: "+fmt(S.bh)+" / "+fmt(S.cb.hp);}
$("bfatk").onclick=function(){var v=Math.floor(S.cp*S.gm);S.bh-=v;S.rp+=v;S.c+=v;S.ct+=v;S.n+=S.ns;S.d+=S.ds*S.dm;S.e+=S.es;var d=document.createElement("div");d.className="fdmg";d.textContent="-"+fmt(v);d.style.left=(30+Math.random()*40)+"%";d.style.top="30%";$("bfight").appendChild(d);setTimeout(function(){d.remove();},800);if(S.bh<=0)winBoss();else updateBossHP();while(S.rp>=S.rg){S.rp-=S.rg;S.rl++;S.rg=Math.floor(S.rg*1.4);S.cp+=Math.ceil(S.rl*0.5);S.ps+=S.rl*0.3;}draw();};

function draw(){
  $("rc").textContent=fmt(S.c);$("rn").textContent=fmt(S.n);
  $("rd").textContent=fmt(S.d);$("re").textContent=fmt(S.e);
  $("rcR").textContent=getCPS()>0?"+"+fmt(getCPS())+"/с":"";
  $("tcps").textContent="в сек: "+fmt(getCPS())+" | тапов: "+fmt(S.cl);
  $("prog-fi").style.width=Math.min(100,(S.rp/S.rg)*100)+"%";
  $("prog-t").textContent="Рейм ур."+S.rl+" — "+RN[Math.min(S.rl-1,RN.length-1)];
  $("uname").textContent=curUser||"";
}
function fly(t){var p=document.createElement("div");p.className="pt";p.textContent=t;p.style.left=(30+Math.random()*40)+"%";p.style.top="40%";$("parts").appendChild(p);setTimeout(function(){p.remove();},800);}

var curTab="up";
$("pcan").onclick=function(){$("panel").classList.remove("act");};
$("ptabs").addEventListener("click",function(e){var t=e.target.closest(".ptab");if(!t)return;$(".ptab").forEach(function(x){x.classList.remove("on");});t.classList.add("on");curTab=t.dataset.tab;renderP();});

function renderP(){
  var p=$("pc");p.innerHTML="";
  if(curTab==="up")renderUp(p);
  else if(curTab==="bo")renderBossPanel(p);
  else if(curTab==="ac")renderAch(p);
  else if(curTab==="qu")renderQuest(p);
  else if(curTab==="sh")renderShop(p);
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
  if(!S.cb){
    p.innerHTML='<div class="sec">👹 Боссы</div><div style="color:#777;font-size:11px;margin:8px 0">Доберись до Рейм ур.5+</div><button class="atk-btn" id="sb">⚔️ Призвать босса</button>';
    $("sb").onclick=function(){spawnBoss();};
  } else {
    var pct=Math.max(0,(S.bh/S.cb.hp)*100);
    p.innerHTML='<div class="sec">👹 '+S.cb.ic+' '+S.cb.n+'</div><div class="boss hp"><div class="boss hp-f" style="width:'+pct+'%"></div></div><div class="boss st"><span>HP: '+fmt(S.bh)+' / '+fmt(S.cb.hp)+'</span><span>'+pct.toFixed(0)+'%</span></div><div class="boss rw">Награда: '+fmt(S.cb.cr)+' 💎</div><button class="atk-btn" id="abtn">⚔️ АТАКОВАТЬ</button>';
    $("abtn").onclick=function(){var v=Math.floor(S.cp*S.gm);S.bh-=v;S.rp+=v;S.c+=v;S.ct+=v;S.n+=S.ns;S.d+=S.ds*S.dm;S.e+=S.es;if(S.bh<=0)winBoss();else renderBossPanel($("pc"));draw();};
  }
}

function renderAch(p){
  p.innerHTML='<div class="sec">🏆 Достижения ('+S.ac.length+'/'+ACHS.length+')</div>';
  for(var i=0;i<ACHS.length;i++){var a=ACHS[i],done=S.ac.indexOf(a.id)>=0;p.innerHTML+='<div class="ach'+(done?' do':'')+'"><span class="ic">'+(done?'✅':a.i)+'</span><div class="inf"><div class="an">'+a.n+'</div><div class="ad">'+a.d+'</div></div>'+(done?'<span class="ar">Получено</span>':'<span class="ar">💎10</span>')+'</div>';}
}

function renderQuest(p){
  if(!S.quests||!S.quests.length){S.quests=[{id:"q1",n:"Нажми 50 раз",ck:function(){return S.cl>=50},rw:5},{id:"q2",n:"Заработай 5K",ck:function(){return S.ct>=5000},rw:10},{id:"q3",n:"Победи 3 босса",ck:function(){return S.bs>=3},rw:15}];}
  p.innerHTML='<div class="sec">📜 Задания</div>';
  for(var i=0;i<S.quests.length;i++){var q=S.quests[i],done=q.ck();p.innerHTML+='<div class="up"><div class="h"><span class="nm">'+q.n+'</span>'+(done?'<span class="lv">✅</span>':'')+'</div><div class="d">'+q.d+'</div>'+(done?'<button data-qid="'+q.id+'" style="margin-top:4px;width:100%;background:#a0f;border:none;color:#fff;padding:6px;border-radius:3px;cursor:pointer">Забрать '+q.rw+' 💎</button>':'')+'</div>';}
  p.querySelectorAll("[data-qid]").forEach(function(b){b.onclick=function(){var q=S.quests.find(function(x){return x.id===b.dataset.qid});if(!q||!q.ck())return;S.g+=q.rw;S.quests=S.quests.filter(function(x){return x.id!==q.id;});renderP();draw();};});
}

function renderShop(p){
  p.innerHTML='<div class="sec">🛒 Магазин</div>';
  var items=[{n:"Стартовый",d:"100 Гемов",p:"$0.99",g:100},{n:"Про",d:"500 Гемов + x2/ч",p:"$2.99",g:500},{n:"Мега",d:"2000 Гемов + x3/ч",p:"$9.99",g:2000},{n:"VIP",d:"x1.5 навсегда + 1000💎",p:"$19.99",g:1000}];
  for(var i=0;i<items.length;i++){var it=items[i];p.innerHTML+='<div class="shop"><div class="si">💎</div><div class="sn">'+it.n+'</div><div class="sd">'+it.d+'</div><div class="sp">'+it.p+'</div><button data-g="'+it.g+'">Купить</button></div>';}
  p.querySelectorAll("[data-g]").forEach(function(b){b.onclick=function(){S.g+=parseInt(b.dataset.g);fly("+ "+fmt(parseInt(b.dataset.g))+" гемов");draw();};});
}

function renderSettings(){
  $("ptitle").textContent="⚙️ Ещё";$("ptabs").style.display="none";
  var p=$("pc");
  var h='<div class="sec">⚙️ Настройки</div>';
  [["Пользователь",curUser],["Тапов",fmt(S.cl)],["Всего кредитов",fmt(S.ct)],["Рейм уровень",S.rl],["Боссов убито",S.bs],["Престиж",S.pr],["Гемы",S.g]].forEach(function(r){h+='<div class="strow"><span class="sl">'+r[0]+'</span><span class="sv">'+r[1]+'</span></div>';});
  h+='<button class="btn" id="prBtn" style="background:linear-gradient(135deg,#ffd700,#ff8c00);color:#000;cursor:pointer">🌟 Престиж</button>';
  h+='<button class="btn" style="margin-top:6px;background:rgba(0,255,255,.1);border:1px solid #0ff3;color:#0ff;cursor:pointer" id="exBtn">📤 Экспорт</button>';
  h+='<button class="btn" style="margin-top:6px;background:rgba(0,255,255,.1);border:1px solid #0ff3;color:#0ff;cursor:pointer" id="imBtn">📥 Импорт</button>';
  h+='<button class="danger" id="dlBtn" style="margin-top:6px">🗑️ Удалить всё</button>';
  p.innerHTML=h;
  $("prBtn").onclick=function(){var pts=Math.floor(Math.sqrt(S.ct/1e6)+S.rl*0.5);if(pts<1)return;dlg("🌟 Престиж","Сбросить за "+pts+" очков?\nБонус: +"+Math.floor(pts*10)+"% к тапу",[{t:"Отмена",f:function(){cdlg();}},{t:"Престиж!",f:function(){doPres();}}]);};
  $("exBtn").onclick=function(){prompt("Скопируй код:",btoa(JSON.stringify(S)));};
  $("imBtn").onclick=function(){var d=prompt("Вставь код:");if(!d)return;try{Object.assign(S,JSON.parse(atob(d)));save();$("panel").classList.remove("act");draw();}catch(e){alert("Неверный код");}};
  $("dlBtn").onclick=function(){dlg("Удалить ВСЁ?","Нельзя отменить!",[{t:"Отмена",f:function(){cdlg();}},{t:"УДАЛИТЬ",f:function(){localStorage.clear();location.reload();}}]);};
}

function doPres(){
  var pts=Math.floor(Math.sqrt(S.ct/1e6)+S.rl*0.5);
  if(pts<1){cdlg();return;}
  S.pr++;S.pp+=pts;S.c=0;S.ct=0;S.n=0;S.d=0;S.e=0;S.cl=0;
  S.cp=1+S.pp*0.1;S.ps=0;S.gm=1;S.dm=1;S.ns=0;S.ds=0;S.es=0;
  S.rl=1;S.rp=0;S.rg=100;S.up={};S.cb=null;S.bh=0;
  cdlg();$("panel").classList.remove("act");draw();
}

function dlg(t,p,bs){$("ovt").textContent=t;$("ovp").textContent=p;$("ovb").innerHTML="";for(var i=0;i<bs.length;i++){var b=document.createElement("button");b.textContent=bs[i].t;b.onclick=bs[i].f;$("ovb").appendChild(b);}$("ov").classList.add("act");}
function cdlg(){$("ov").classList.remove("act");}

// CHAT
var chatTab="g",chatMsgs=[];
try{chatMsgs=JSON.parse(localStorage.getItem("cr_chat")||"[]");}catch(e){}
function saveChat(){localStorage.setItem("cr_chat",JSON.stringify(chatMsgs.slice(-200)));}
function addMsg(author,text){chatMsgs.push({a:author,t:text,ts:Date.now()});saveChat();renderChat();}

function owlReply(text){
  var L=text.toLowerCase(),r="";
  if(L.indexOf("босс")>=0){var bn=["Пустотный","Небулярный","Квазаровый","Пульсарный","Тёмный","Фантомный"];var bi=["🌌","🌠","⚡","🔮","💫","👁️"];var i=Math.floor(Math.random()*bn.length);var hp=Math.floor(5e4*Math.pow(1.8,BS.length));BS.push({n:bn[i]+" Владыка",hp:hp,cr:Math.floor(hp*.4),ic:bi[i]});r="✅ Босс создан!\n👹 "+bn[i]+" Владыка\n❤️ HP: "+fmt(hp)+"\n💰 Награда: "+fmt(Math.floor(hp*.4))+"💎\nВсего боссов: "+BS.length;}
  else if(L.indexOf("улучшен")>=0||L.indexOf("апгрейд")>=0){var un=["Квантовый Ускоритель","Нейро-Усилитель","Плазменный Инжектор","Вакуумный Насос"];var i=Math.floor(Math.random()*un.length);var c=Math.floor(100*Math.pow(2,UPG.length));UPG.push({n:un[i],d:"+10% доход",cb:c,fn:function(){S.gm*=1.1},mx:3});r="✅ Улучшение добавлено!\n⚡ "+un[i]+"\nЦена: "+fmt(c)+"💎\nУлучшений: "+UPG.length;}
  else if(L.indexOf("кредит")>=0||L.indexOf("монет")>=0||L.indexOf("денег")>=0){var a=500+Math.floor(Math.random()*2000);S.c+=a;S.ct+=a;r="💰 Начислено "+fmt(a)+" кредитов!\nБаланс: "+fmt(S.c)+"💎";}
  else if(L.indexOf("уровень")>=0||L.indexOf("рейм")>=0){var lv=1+Math.floor(Math.random()*3);S.rl+=lv;r="🌀 Рейм повышен на "+lv+"!\nУровень: "+S.rl+"\nДо следующего: "+fmt(S.rg-S.rp)+"💎";}
  else if(L.indexOf("гем")>=0||L.indexOf("премиум")>=0){var g=20+Math.floor(Math.random()*80);S.g+=g;r="💎 Начислено "+g+" гемов!\nБаланс: "+S.g+"💎";}
  else if(L.indexOf("баг")>=0||L.indexOf("ошибк")>=0||L.indexOf("не работа")>=0){S.c+=1e3;S.g+=50;S.cp+=5;r="🐛 Баги исправлены!\n\nПатчи:\n✅ Кнопки на мобильных\n✅ Панель улучшений\n✅ Чат OWL\n✅ Сохранение при выходе\n\nБонус: +1000💎 +50💎гемов +5 тап";}
  else if(L.indexOf("привет")>=0||L.indexOf("хай")>=0||L.indexOf("hello")>=0){r="👋 Привет, "+curUser+"!\n\nЯ — OWL 🦉, ИИ-разработчик этой игры.\n\n📌 Команды:\n• Добавь босса\n• Добавь улучшение\n• Дай кредитов/гемов\n• Повысь уровень\n• Исправь баги\n• Баланс (снизить цены)\n\nКаждая команда = бонус! 🎁";}
  else if(L.indexOf("баланс")>=0||L.indexOf("цен")>=0||L.indexOf("дорого")>=0){var disc=0.85-Math.floor(UPG.length/10)*0.05,totalSaved=0;for(var i=0;i<UPG.length;i++){var old=UPG[i].cb;UPG[i].cb=Math.floor(UPG[i].cb*disc);totalSaved+=old-UPG[i].cb;}r="⚖️ Баланс обновлён!\n\nЦены снижены на "+Math.floor((1-disc)*100)+"%\nОбщая экономия: "+fmt(totalSaved)+"💎";}
  else{S.c+=300;S.g+=10;r="✅ Задача принята!\n\nБонус: +300💎 +10💎гемов\n\nБаланс: "+fmt(S.c)+"💎 | Гемы: "+S.g;}
  addMsg("🦉 OWL",r,false);draw();
}

function renderChat(){
  var e=$("chmsgs");e.innerHTML="";
  var msgs=chatTab==="g"?chatMsgs:chatMsgs.filter(function(m){return m.a==="🦉 OWL"||m.a===curUser;});
  for(var i=0;i<msgs.length;i++){
    var m=msgs[i],d=new Date(m.ts),t=d.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"});
    var isOwl=m.a==="🦉 OWL";
    e.innerHTML+='<div class="chmsg'+(isOwl?"":" me")+'"><div class="auth">'+m.a+'</div><div class="txt" style="white-space:pre-wrap">'+m.t+'</div><div class="time">'+t+'</div></div>';
  }
  if(!msgs.length)e.innerHTML='<div style="text-align:center;color:#555;padding:20px">Сообщений пока нет</div>';
  e.scrollTop=e.scrollHeight;
}

function sendChat(){
  var text=$("chin").value.trim();
  if(!text)return;$("chin").value="";
  addMsg(curUser,text);
  if(chatTab==="o"){
    $("chowli").style.display="block";
    setTimeout(function(){$("chowli").style.display="false";owlReply(text);},500+Math.random()*1000);
  }
}

$("chsend").onclick=sendChat;
$("chin").addEventListener("keydown",function(e){if(e.key==="Enter")sendChat();});
$("chtabs").addEventListener("click",function(e){var t=e.target.closest(".chtab");if(!t)return;$(".chtab").forEach(function(x){x.classList.remove("on");});t.classList.add("on");chatTab=t.dataset.tab;$("chin").placeholder=chatTab==="o"?"Задание для OWL...":"Сообщение...";renderChat();});

// NAV
document.querySelectorAll("footer .tab").forEach(function(ft){
  ft.onclick=function(){
    document.querySelectorAll("footer .tab").forEach(function(x){x.classList.remove("on");});
    ft.classList.add("on");
    var scr=ft.dataset.scr;
    if(scr==="game"){showScr("game-scr");$("panel").classList.remove("act");}
    else if(scr==="chat"){showScr("chat-scr");renderChat();}
    else if(scr==="settings"){showScr("game-scr");$("ptitle").textContent="⚙️ Ещё";$("ptabs").style.display="none";$("panel").classList.add("act");renderSettings();}
    else {showScr("game-scr");$("ptabs").style.display="";$("panel").classList.add("act");curTab=scr;$(".ptab").forEach(function(t){t.classList.toggle("on",t.dataset.tab===scr);});renderP();}
  };
});

function save(){
  if(!curUser)return;S.lastSave=Date.now();
  var saves={};try{saves=JSON.parse(localStorage.getItem("cr_saves")||"{}");}catch(e){}
  saves[curUser]=JSON.stringify(S);localStorage.setItem("cr_saves",JSON.stringify(saves));
  localStorage.setItem("cr_lastUser",curUser);
}
function loadGame(){
  if(!curUser)return;
  try{var saves=JSON.parse(localStorage.getItem("cr_saves")||"{}");var d=saves[curUser];if(d){var v=JSON.parse(d);for(var k in v)S[k]=v[k];}}catch(e){}
}
function initNewGame(){S={c:0,ct:0,n:0,d:0,e:0,g:0,cl:0,bs:0,pr:0,pp:0,cp:1,ps:0,ns:0,ds:0,es:0,gm:1,dm:1,rl:1,rp:0,rg:100,up:{},ac:[],cb:null,bh:0,lastSave:Date.now()};}

window.addEventListener("beforeunload",function(){save();});
window.addEventListener("visibilitychange",function(){if(document.hidden)save();});
setInterval(function(){save();},10000);
setInterval(function(){if(getCPS()>0){var inc=getCPS()*0.3;S.c+=inc;S.ct+=inc;S.rp+=inc;}while(S.rp>=S.rg){S.rp-=S.rg;S.rl++;S.rg=Math.floor(S.rg*1.4);S.cp+=Math.ceil(S.rl*0.5);S.ps+=S.rl*0.3;}draw();},300);

var lastUser=localStorage.getItem("cr_lastUser");
if(lastUser&&users[lastUser]){curUser=lastUser;loadGame();showScr("game-scr");}else{showScr("login-scr");}
draw();
})();
