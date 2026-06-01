curUser=null;users={};
try{users=JSON.parse(localStorage.getItem("cr_users")||"{}");}catch(e){}
function saveUsers(){localStorage.setItem("cr_users",JSON.stringify(users));}
function hsh(p){var h=0;for(var i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h|=0;}return h.toString(36);}
function $(id){return document.getElementById(id);}
function showScr(id){document.querySelectorAll(".scr").forEach(function(s){s.classList.remove("act");});$(id).classList.add("act");}
function amsg(m,t){var e=$("amsg");e.textContent=m;e.className="msg "+(t||"");}
$("alogin").onclick=function(){var u=$("au").value.trim(),p=$("ap").value;if(!u||!p){amsg("Заполни все поля","err");return;}if(!users[u]){amsg("Пользователь не найден","err");return;}if(users[u].pass!==hsh(p)){amsg("Неверный пароль","err");return;}curUser=u;users[u].lastLogin=Date.now();saveUsers();loadGame();showScr("game-scr");};
$("areg").onclick=function(){var u=$("au").value.trim(),p=$("ap").value;if(!u||!p){amsg("Заполни все поля","err");return;}if(u.length<3){amsg("Минимум 3 символа","err");return;}if(p.length<4){amsg("Минимум 4 символа пароля","err");return;}if(users[u]){amsг("Имя занято","err");return;}users[u]={pass:hsh(p),created:Date.now(),lastLogin:Date.now()};saveUsers();curUser=u;initNewGame();showScr("game-scr");amsg("Аккаунт создан!","ok");};
$("lout").onclick=function(){saveGame();curUser=null;showScr("login-scr");};
$("cback").onclick=function(){showScr("game-scr");};
S={c:0,ct:0,n:0,d:0,e:0,g:0,cl:0,bs:0,pr:0,pp:0,cp:1,ps:0,ns:0,ds:0,es:0,gm:1,dm:1,rl:1,rp:0,rg:100,up:{},ac:[],cb:null,bh:0,lastSave:Date.now()};
RN=["Цифровой Нексус","Неоновая Сетка","Квантовое Ядро","Кибер-Улей","Тёмная Матрица","Пустотный Сектор","Бесконечный Цикл","Омега-Царство","Альфа-Сингулярность","Кибер-Эдем","Нейросеть","Фантомная Зона","Бинарный Шторм","Хромовая Пустота","Океан Данных","Пустотное Ядро"];
UPG=[{n:"Нейро-Связь",d:"+1 тап",cb:10,fn:function(){S.cp+=1},mx:100},{n:"Лазерный Фокус",d:"+5 тапов",cb:100,fn:function(){S.cp+=5},mx:50},{n:"ИИ-Ядро",d:"+10/с",cb:1000,fn:function(){S.ps+=10},mx:20}];
BS=[{n:"Глитч-Фантом",hp:100,cr:50,ic:"👻"},{n:"Фаервол-Голем",hp:500,cr:200,ic:"🗿"}];
ACHS=[{id:"a1",n:"Первый Тап",i:"👆",ck:function(){return S.cl>=1}}];
function getCPS(){return S.ps*S.gm;}
function fmt(n){if(n>=1e6)return(n/1e6).toFixed(1)+"M";if(n>=1e3)return(n/1e3).toFixed(1)+"K";return Math.floor(n);}
tpBtn=$("tpbtn");
function doTap(){var v=Math.floor(S.cp*S.gm);S.c+=v;S.ct+=v;S.cl++;S.rp+=v;$("tpinfo").textContent="+"+fmt(v)+" 💎";tpBtn.classList.add("active");setTimeout(function(){tpBtn.classList.remove("active");},120);draw();}
tpBtn.addEventListener("touchstart",function(e){e.preventDefault();doTap();},{passive:false});
tpBtn.addEventListener("mousedown",function(e){e.preventDefault();doTap();});
function draw(){$("rc").textContent=fmt(S.c);$("rn").textContent=fmt(S.n);$("uname").textContent=curUser||"";}
var chatTab="g",chatMsgs=[];
function addMsg(author,text){chatMsgs.push({a:author,t:text,ts:Date.now()});renderChat();}
function owlReply(text){var r="✅ Принято: "+text+"\n\n📤 Задача передана разработчику.";addMsg("🦉 OWL",r,false);}
function renderChat(){var e=$("chmsgs");e.innerHTML="";for(var i=0;i<chatMsgs.length;i++){var m=chatMsgs[i];e.innerHTML+='<div class="chmsg"><div class="auth">'+m.a+'</div><div class="txt">'+m.t+'</div></div>';}}
function sendChat(){var text=$("chin").value.trim();if(!text)return;$("chin").value="";addMsg(curUser,text);if(chatTab==="o"){$("chowli").style.display="block";setTimeout(function(){$("chowli").style.display="false";owlReply(text);},500);}}
$("chsend").onclick=sendChat;
$("chin").addEventListener("keydown",function(e){if(e.key==="Enter")sendChat();});
$("chtabs").addEventListener("click",function(e){var t=e.target.closest(".chtab");if(!t)return;$(".chtab").forEach(function(x){x.classList.remove("on");});t.classList.add("on");chatTab=t.dataset.tab;});
document.querySelectorAll("footer .tab").forEach(function(ft){ft.onclick=function(){document.querySelectorAll("footer .tab").forEach(function(x){x.classList.remove("on");});ft.classList.add("on");showScr("game-scr");};});
function save(){if(!curUser)return;localStorage.setItem("cr_lastUser",curUser);}
function loadGame(){}
function initNewGame(){}
var lastUser=localStorage.getItem("cr_lastUser");if(lastUser&&users[lastUser]){curUser=lastUser;showScr("game-scr");}
draw();