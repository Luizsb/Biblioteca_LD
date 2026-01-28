var caminho="resources/image/";
var canvas, stage;
var content;
var conta;
var contentLinhas;
var contentTemp;
var scrollquiz;
var hero;
var img		=	new Image();
var fundo	=	new createjs.Container();
var charac;
var cha_c;
var ponte1;
var ponte2;
var elevador;
var seq=[0,1,2,3,4,5,6];
var count=0;
var fase;

var ordem=0;
var offX=500;
var offY=200;
var word;
var inicio1=false;
var btinicia;
var tempoPergunta=20000;
var tipotween=createjs.Ease.backOut;
var pos=[[640,270],[640,380]];

var	actualStage;

var gui;
var i_acertos=0;
var i_erros=0;
var txt_a;
var txt_e;
var n_vida=3;
var vidas=[];
var update=false;
var startTime;
var formatted;
var contentgui;

var gQuestions, cID;

function gameQuizPlataforma(idCanvas, questions) {
	gQuestions	=	questions;
	cID			=	idCanvas;
	shuffle(questions);
    canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	content = new createjs.Container();
	conta = new createjs.Container();
	contentTemp = new createjs.Container();
	cha_c = new createjs.Container();
	scrollquiz = new createjs.Container();
	contentgui = new createjs.Container();

    createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; 
	
	stage.addChild(scrollquiz);
	scrollquiz.addChild(fundo);
	scrollquiz.addChild(content);
	scrollquiz.addChild(contentTemp);
	stage.addChild(conta);
	stage.addChild(contentgui);
	var i;
	for(i=0;i<n_vida;i++){
		vidas[i] = new createjs.Bitmap(caminho+"coracao.png");
		vidas[i].image.onload = function(){};
		contentgui.addChild(vidas[i]);
		vidas[i].x=i*65+75;
		vidas[i].y=640;
	}
	
	var spriteChar = new createjs.SpriteSheet({
		framerate: 20,
			images: ["resources/image/char.png"],
			frames: [[5,5,216,241,0,0,0],[226,5,216,241,0,0,0],[447,5,216,241,0,0,0],[668,5,216,241,0,0,0],[5,251,216,241,0,0,0],[226,251,216,241,0,0,0],[447,251,216,241,0,0,0],[668,251,216,241,0,0,0],[5,497,216,241,0,0,0]],
			animations: {
				"idle": 0,
				"pula": 1,
				"corre": [1, 8, "corre",1]
			}
	});
	
	stage.addChild(cha_c);
	charac = new createjs.Sprite(spriteChar, "corre");
	cha_c.addChild(charac);
	cha_c.x=-200;
	cha_c.y=430;
	cha_c.scaleX=cha_c.scaleY=0.8;
	
	var btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
	btinicia.image.onload = function(){};
    stage.addChild(btinicia);
	btinicia.on("click", function() {
        stage.removeChild(this);
		update=true;
		startTime = Date.now();			
		loadBG(questions);
		loadFase(questions);
	});
	
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(30);
	createjs.MotionGuidePlugin.install();
}

function loadFase(questions) {
	count++;
	switch (fase) {
		case 1:
			createjs.Tween.get(cha_c).to({x: 340}, 2000,createjs.Ease.linear).call(fase1, [questions]);
			break;
		case 2:
			createjs.Tween.get(cha_c).to({x: 340}, 2000,createjs.Ease.linear).call(fase2, [questions]);
			break;
		case 3:
			createjs.Tween.get(cha_c).to({x: 290}, 2000,createjs.Ease.linear).call(fase3, [questions]);
			break;
		case 4:
			createjs.Tween.get(cha_c).to({x: 200}, 2000,createjs.Ease.linear).call(fase4, [questions]);
			break;
		case 5:
			createjs.Tween.get(cha_c).to({x: 200}, 2000,createjs.Ease.linear).call(fase5, [questions]);
			break;
		case 6:
			createjs.Tween.get(cha_c).to({x: 200}, 2000,createjs.Ease.linear).call(fase6, [questions]);
			break;
		case 7:
			createjs.Tween.get(cha_c).to({x: 460}, 2000,createjs.Ease.linear).call(fase7, [questions]);
			break;
	}
}

function crono(questions){
	switch (fase) {
		case 1:
			fase1ini(questions);
			break;
		case 2:
			fase2ini(questions);	
			break;
		case 3:
			fase3ini(questions);	
			break;
		case 4:
			fase4ini(questions);	
			break;
		case 5:
			fase5ini(questions);	
			break;
		case 6:
			fase6ini(questions);
			break;
		case 7:
			fase7ini(questions);
			break;
	}
}

function loadBG(questions){
	var fases	=	[1,2,3,4,5,6],
		fundo;

	if(count !== (questions.length - 1)){
		fase	=	fases.randomItem();
	} else {
		fase	=	7;
	}


	fundo	=	new createjs.Bitmap(caminho+"f" + (fase - 1) + ".png");
	fundo.image.onload = function(){};
	scrollquiz.addChild(fundo);


	fundo.x	=	count * 1280;
}


function criaGui(g){
	update=false;
	var gui = new createjs.Bitmap(caminho+g+".png");
	gui.image.onload = function(){};
    contentgui.addChild(gui);
	conta.removeAllChildren();
	gui.x=325;
	gui.y=170;
	
	var texto_tempo = new createjs.Text(formatted, "bold 40px VAG Rounded BT", "#000000");
	texto_tempo.x=295+325;
	texto_tempo.y=140+170;
	texto_tempo.textAlign = "center";
	contentgui.addChild(texto_tempo);
	
	var texto_errado = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#000000");
	texto_errado.x=295+325;
	texto_errado.y=210+170;
	texto_errado.textAlign = "center";
	contentgui.addChild(texto_errado);

	gui.on("click", function() {
		stage.enableDOMEvents(false);

		resetAll();

		gameQuizPlataforma(cID, gQuestions);
    });
}

function fase1(questions){
	charPara();
	
	ponte1 = new createjs.Bitmap(caminho+"ponte.png");
	ponte1.image.onload = function(){};
    scrollquiz.addChild(ponte1);
	ponte1.regX=18;
	ponte1.regY=18;
	ponte1.x	=	((count - 1) * 1280) + 552;
	ponte1.y	=	640;
	ponte1.rotation=-75;
	
	ponte2 = new createjs.Bitmap(caminho+"ponte.png");
	ponte2.image.onload = function(){};
    scrollquiz.addChild(ponte2);
	ponte2.regX=18;
	ponte2.regY=18;
	ponte2.x	=	((count - 1) * 1280) + 875;
	ponte2.y	=	640;
	ponte2.rotation=-105;


	formulaPergunta(questions, fase);
}
function fase1ini(questions){
	conta.removeAllChildren();	
	createjs.Tween.get(cha_c).wait(1000).call(fase1fim, [questions]);

	createjs.Tween.get(ponte1).to({rotation: 0}, 800,createjs.Ease.backOut);
	createjs.Tween.get(ponte2).to({rotation: -180}, 800,createjs.Ease.backOut);
}
function fase1fim(questions){
	charCorre();
	createjs.Tween.get(scrollquiz).to({x: count * -1280}, 2000,createjs.Ease.linear);
	loadBG(questions);
	loadFase(questions);
}

function fase2(questions){
	charPara();

	var bolha = new createjs.Bitmap(caminho+"bolhas.png");
	bolha.image.onload = function(){};
    scrollquiz.addChild(bolha);
	bolha.x	=	((count - 1) * 1280) + 484;
	bolha.y	=	670;
	bolha.alpha=0;
	createjs.Tween.get(bolha,{loop:true}).to({y:610,alpha:1}, 1000).to({y:470,alpha:0}, 1000);
	
	formulaPergunta(questions);
}
function fase2ini(questions){
	conta.removeAllChildren();
	charPula();	
	createjs.Tween.get(cha_c).to({guide:{ path:[340,430, 487,90,630,170]}},500).call(charPara).wait(1000).call(charPula).to({guide:{ path:[630,170, 789,90,945,430]}},500).call(fase2fim, [questions]);
}
function fase2fim(questions){
	charCorre();
	createjs.Tween.get(scrollquiz).to({x: count * -1280}, 2000,createjs.Ease.linear);
	loadBG(questions);
	loadFase(questions);
}

function fase3(questions){
	charPara();
	formulaPergunta(questions, fase);
}
function fase3ini(questions){
	charPula();
	conta.removeAllChildren();
	createjs.Tween.get(cha_c).to({guide:{ path:[290,430, 640,200,930,430]}},800).call(fase3fim, [questions]);
}
function fase3fim(questions){
	charCorre();
	createjs.Tween.get(scrollquiz).to({x: count * -1280}, 2000,createjs.Ease.linear);
	loadBG(questions);
	loadFase(questions);
}

function fase4(questions){
	charPara();
    var i;
	for(i=0;i<3;i++){
		var eng = new createjs.Bitmap(caminho+"engrenagem.png");
		eng.image.onload = function(){};
		scrollquiz.addChild(eng);
		eng.x	=	(((count - 1) * 1280 ) + 470) + (150	*	i);
		eng.y	=	525;
		eng.regX=136/2;
		eng.regY=140/2;
		createjs.Tween.get(eng,{loop:true}).to({rotation:360}, 2000);
	}
	var supeng = new createjs.Bitmap(caminho+"eng_suporte.png");
	supeng.image.onload = function(){};
    scrollquiz.addChild(supeng);
	supeng.x	=	(((count - 1) * 1280)) + 455;
	supeng.y	=	430;
	
	actualStage	=	4;
	formulaPergunta(questions);
}
function fase4ini(questions){
	conta.removeAllChildren();	
	createjs.Tween.get(cha_c).to({guide:{ path:[200,430, 340,20,530,190]}},500).wait(1000).to({guide:{ path:[530,190, 735,20,850,430]}},500).call(fase4fim, [questions]);
}
function fase4fim(questions){
	charCorre();
	createjs.Tween.get(scrollquiz).to({x: count * -1280}, 2000,createjs.Ease.linear);
	loadBG(questions);
	loadFase(questions);
}

function fase5(questions){
	charPara();
	elevador = new createjs.Bitmap(caminho+"elevador.png");
	elevador.image.onload = function(){};
    scrollquiz.addChild(elevador);
	elevador.x	=	((count - 1) * 1280) + 400;
	elevador.y	=	475;
	
	formulaPergunta(questions);
}
function fase5ini(questions){
	conta.removeAllChildren();	
	createjs.Tween.get(cha_c).to({guide:{ path:[200,430, 290,90,379,288]}},500).to({x: 675}, 2000).to({guide:{ path:[675,288, 815,90,860,430]}},500).call(fase5fim, [questions]);
	createjs.Tween.get(elevador).wait(500).to({x: ((count - 1) * 1280) + 700}, 2000);
}
function fase5fim(questions){
	charCorre();
	createjs.Tween.get(scrollquiz).to({x: count * -1280}, 2000,createjs.Ease.linear);
	loadBG(questions);
	loadFase(questions);
}

function fase6(questions){
	charPara();
    var i;
	for(i=0;i<2;i++){
		var eng = new createjs.Bitmap(caminho+"braco.png");
		eng.image.onload = function(){};
		scrollquiz.addChild(eng);
		eng.x	=	((count - 1) * 1280) + 550 + (200	*	i);
		eng.y	=	435;
		eng.regX=30;
		createjs.Tween.get(eng,{loop:true}).to({rotation:-20}, 800).to({rotation:20}, 800).to({rotation:0}, 400);
	}
	actualStage	=	6;
	formulaPergunta(questions);
}
function fase6ini(questions){
	conta.removeAllChildren();	
	createjs.Tween.get(cha_c).to({guide:{ path:[200,430, 340,20,530,190]}},500).wait(1000).to({guide:{ path:[530,190, 735,20,850,430]}},500).call(fase6fim, [questions]);
}
function fase6fim(questions){
	charCorre();
	createjs.Tween.get(scrollquiz).to({x: count * -1280}, 2000,createjs.Ease.linear);
	loadBG(questions);
	loadFase(questions);
}

function fase7(questions){
	charPara();
	actualStage	=	7;
	formulaPergunta(questions);
}
function fase7ini(){
	conta.removeAllChildren();	
	charCorre();
	createjs.Tween.get(cha_c).to({guide:{ path:[460,430, 700,90,920,312]}},800).to({x:1280},500);

	if(i_erros>2){
		criaGui('gui2');
		som3();
	}else{
		criaGui('gui');
		som2();
	}
}


function charCorre(){
	charac.gotoAndPlay("corre");
}
function charPula(){
	charac.gotoAndStop("pula");
}
function charPara(){
	charac.gotoAndStop("idle");
}

function formulaPergunta(questions){
    inicio1=true;
	var	alternativePos;
    var t=seq[count];
    inicio1=true;
    word=textoContorno(questions[count - 1].q);
	word.x=-900;
	word.y=80;
    conta.addChild(word);

	createjs.Tween.get(word).wait(2000).to({x:640},300,tipotween);
	
	alternativePos	=	word.getBounds().height + 150;

	shuffle(questions[count - 1].a);
    var i;
	for(i = 0; i < questions[count - 1].a.length; i++){
	    var bt = caixaTexto(questions[count - 1].a[i][0]);

        conta.addChild(bt);
		bt.y		=	alternativePos;
		bt.x		=	-900;
		bt.alpha	=	0.8;
		bt.pode		=	true;
		bt.isAnswer	=	questions[count - 1].a[i][1];
		createjs.Tween.get(bt).wait(2200+i*20).to({x: 640}, 300, tipotween);
		alternativePos	+=	bt.getBounds().height + 55;

	    bt.on("click", function (evt) {
            if(inicio1){
                inicio1=false;
                console.log("nao poode2");
			this.scaleX=this.scaleY=0.5;
			createjs.Tween.get(this).to({scaleX:1,scaleY:1},700,createjs.Ease.backOut);
            if(this.isAnswer){
                volta=false;
                som0();
                i_acertos++;
                animaIco("certo", this.x+470, this.y, questions);
                inicio1=false;
            } else {
                som1();
                i_erros++;
                
                inicio1=false;
                n_vida--;
                vidas[n_vida].visible=false;
                if(i_erros>2){
                    setTimeout(criaGui,2000,'gui2');
                    som3();
                }else{
                    animaIco("errado",this.x+470,this.y, questions);
                }
            }
            }
	    });
	}
}
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function animaIco(qual,b,c, questions){
    var ico;
	ico = new createjs.Bitmap(caminho+qual+".png");
    conta.addChild(ico);
	ico.x = b;
	ico.y = c;
	ico.regX=150;
	ico.regY=150;
	ico.scaleX=ico.scaleY=0.1;
	createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut).wait(1000).call(deleta, [questions]);

}

function deleta(questions){
    stage.removeChild(this);
	crono(questions);
}

function textoContorno(texto){

	var txt = new createjs.Text(texto, "bold 40px VAG Rounded BT", "#ffffff");
	
    txt.textAlign = "center";
	txt.shadow = new createjs.Shadow("#000000", 5, 5, 10);
	txt.lineWidth = 1200; 
	
	var tamX=txt.getBounds().width+120;
	var tamY=txt.getBounds().height+80;
	txt.regY=tamY/2-40;
	
	offX=tamX/2;
	offY=tamY/2;
	
	var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
    button.graphics.drawRoundRect(0,0,tamX,tamY,20);
    button.graphics.endFill();
	button.regX=tamX/2;
	button.regY=tamY/2;
	button.alpha=0.2;
    
	var t = new createjs.Container();
	
    t.addChild(button);
	t.addChild(txt);
	
	return t;

}

function caixaTexto(texto){
	var txt = new createjs.Text(texto, "bold 40px VAG Rounded BT", "#000000");

	var tamX=txt.getBounds().width+130;
	var tamY=txt.getBounds().height+50;
	
	txt.regY=tamY/2-35;
    txt.textAlign = "center";
	
	var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
    button.graphics.drawRoundRect(0,0,tamX,tamY,20);
    button.graphics.endFill();
	button.regX=tamX/2;
	button.regY=tamY/2;
	
	var t = new createjs.Container();
	t.addChild(button);
	t.addChild(txt);
	
	return t;

}
function onImageLoaded(e) {

    stage.addChild(hero);
    createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(30);
}
function tick(event) {
	stage.update(event);
	if(update){
        checkTime();
    }
}
function checkTime(){
    var timeDifference = Date.now() - startTime;
    formatted = convertTime(timeDifference);
}
function convertTime(miliseconds) {
  var totalSeconds = Math.floor(miliseconds/1000);
  var minutes = Math.floor(totalSeconds/60);
  var seconds = totalSeconds - minutes * 60;
  if(seconds<10){
      seconds='0'+seconds;
  }
  return minutes + ':' + seconds;
}

function som0(){
	document.getElementsByTagName('audio')[0].play();
}
function som1(){
	document.getElementsByTagName('audio')[1].play();
}
function som2(){
	document.getElementsByTagName('audio')[2].play();
}
function som3(){
	document.getElementsByTagName('audio')[3].play();
}

Array.prototype.randomItem = function () {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.randomIndex = function () {
	return Math.floor(Math.random() * this.length);
};

function resetAll(){
	canvas			=	{};
	stage			=	{};
	content			=	{};
	conta			=	{};
	contentLinhas	=	{};
	contentTemp		=	{};
	scrollquiz			=	{};
	hero			=	{};
	img				=	new Image();
	fundo			=	new createjs.Container();
	charac			=	{};
	cha_c			=	{};
	ponte1			=	{};
	ponte2			=	{};
	elevador		=	{};
	seq				=	[0,1,2,3,4,5,6];
	count			=	0;
	fase			=	0;
	ordem			=	0;
	offX			=	500;
	offY			=	200;
	word			=	{};
	inicio1			=	false;
	btinicia		=	{};
	tempoPergunta	=	20000;
	tipotween		=	createjs.Ease.backOut;
	pos				=	[[640,270],[640,380]];
	actualStage		=	{};
	gui				=	{};
	i_acertos		=	0;
	i_erros			=	0;
	txt_a			=	{};
	txt_e			=	{};
	n_vida			=	3;
	vidas			=	[];
	update			=	false;
	startTime		=	{};
	formatted		=	{};
	contentgui		=	{};
}