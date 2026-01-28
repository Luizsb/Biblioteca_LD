var canvas;
var stage;
var fundo;
var conta;
var count=0;
var ordem=0;
var word;
var btinicia;
var tempoPergunta=10000;
var fumacinha;
var relogio;
var tipotween=createjs.Ease.backOut;
var pos=[[450,370],[600,490],[750,610]];
var gui;
var i_acertos=0;
var i_erros=0;
var txt_a;
var txt_e;
var lastWidth;
var id


function quizFrase(idCanvas, questions) {
	id = idCanvas;
	canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);
	
	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;

	criaFundo(0,0,1280,720);
	
	var bolhafundo1 = new createjs.Bitmap("resources/image/bol_fundo.png");
	bolhafundo1.image.onload = function(){};
	stage.addChild(bolhafundo1);
	bolhafundo1.y=0;

	
	conta = new createjs.Container();
	stage.addChild(conta);

	
	btinicia = new createjs.Bitmap("resources/image/bt_iniciar-f1.png");
	btinicia.image.onload = function(){};
	stage.addChild(btinicia);
	btinicia.on("click", function() {
		createjs.Tween.get(bolhafundo1,{loop:true}).wait(100).to({y:-719},10000,createjs.Ease.linear);
		stage.removeChild(this);
		formulaPergunta(questions);
		criaGui();

	});
	var spriteRelogio = new createjs.SpriteSheet({
		framerate: 20,
			"images": ["resources/image/relogio.png"],
			"frames": {"regX": 100, "height": 214, "count": 13, "regY": 107, "width": 200},
			"animations": {
				"idle": 0,
				"idle2": 12,
				"tempo1": [0, 12, "idle2",0.035]
			}
	});
	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
			"images": ["resources/image/fumaca.png"],
			"frames": {"regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200},
			"animations": {
				"idle": 20,
				"fumaca1": [0, 9, "idle"],
				"fumaca2": [10, 19, "idle"]
			}
	});
	fumacinha = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(fumacinha);
	
	relogio = new createjs.Sprite(spriteRelogio, "idle");
	stage.addChild(relogio);
	relogio.x=1160;
	relogio.y=900;
	
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker);
}

function criaGui(){
	gui = new createjs.Container();
	stage.addChild(gui);

	var _gui = new createjs.Bitmap("resources/image/gui.png");
	_gui.image.onload = function(){};
	
	txt_a = new createjs.Text(0, "bold 40px VAG Rounded BT", "#000000");
	txt_a.textAlign = "left";
	txt_a.x=220;
	txt_a.y=25;
	
	txt_e = new createjs.Text(0, "bold 40px VAG Rounded BT", "#b10000");
	txt_e.textAlign = "left";
	txt_e.x=510;
	txt_e.y=25;
	
	gui.addChild(_gui);
	gui.addChild(txt_a);
	gui.addChild(txt_e);
}

function formulaPergunta(questions, fase){
	fase = fase ? fase : 0;
	lastWidth	=	0;

	if (count == 0) {
		shuffle(questions[fase]);
	}

	shuffle(questions[fase][count].alts);

	conta.removeAllChildren();

	word=criaTexto(questions[fase][count].q, 1000); // questions[fase] nesse caso é = à fase atual
	word.x=-1200;
	word.y=100;

	conta.addChild(word);
	createjs.Tween.get(word).wait(1200).to({x:150},300,tipotween).wait(tempoPergunta).call(proxima, [questions, fase]);

	for(var i = 0; i < questions[fase][count].alts.length; i++){ // questions[fase] nesse caso é = à fase atual
		var bt = criaTexto(questions[fase][count].alts[i][0], 100);// questions[fase] nesse caso é = à fase atual
		conta.addChild(bt);

		bt.y		=	300;
		bt.x		=	-900;

		bt.py		=	300;
		bt.px		=	100 + lastWidth;


		bt.alpha	=	0.8;
		bt.pode		=	true;
		bt.isAnswer	=	questions[fase][count].alts[i][1];// questions[fase] nesse caso é = à fase atual

		createjs.Tween.get(bt).wait(1400+i*20).to({x: bt.px},300,tipotween);

		lastWidth	+=	bt.getBounds().width + 40;

		bt.on("mousedown", function (evt) {
			if(this.pode){
				this.parent.addChild(this);
				var global = conta.localToGlobal(this.x, this.y);
				this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
				this.alpha=1;
				
			}
		});

		bt.on("pressmove", function (evt) {
			var local = conta.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
			this.x = local.x;
			this.y = local.y;
		});
		
		bt.on("pressup", function (evt) {
			if(collisionDetect(this,word)){
				if(this.isAnswer){
					acerto=true;
					volta=false;
					this.pode=false;
					som0();
					conta.removeChild(this);
					i_acertos++;
					txt_a.text=i_acertos;
					
					createjs.Tween.removeTweens(word);
					conta.removeChild(word);
					word=criaTexto(questions[fase][count].a, 1000);
					word.x=150;
					word.y=100;
					word.scaleX=0.8;
					word.scaleY=0.8;

					animaIco("certo",word.getBounds().width, word.getBounds().height);
					conta.addChild(word);
					createjs.Tween.get(word).to({x:150, y: 100, scaleX: 1, scaleY: 1},300,tipotween).wait(3000).call(proxima, [questions, fase]);
				} else {
					createjs.Tween.get(this).to({x:this.px, y:this.py},500,createjs.Ease.backOut);
					som1();
					i_erros++;
					txt_e.text=i_erros;
					this.alpha=0.8;
				}
			}
		});
	}
	
	relogio.gotoAndPlay("tempo1");
		relogio.y=900;
		relogio.scaleX=relogio.scaleY=0.4;
		createjs.Tween.get(relogio).wait(1200).to({y:600,scaleX:1,scaleY:1,rotation:10}, 250,tipotween).wait(350).to({rotation:-5}, 250,tipotween);
	
}
function proxima(questions, fase){
	if(count >= questions[fase].length - 1){
		count = 0;

		verificaFim(questions, fase);
	} else {
		count++;

		formulaPergunta(questions, fase);
		relogio.y=900;
		fumacinha.gotoAndPlay("fumaca1");	
		fumacinha.x = 1160;
		fumacinha.y = 600;
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

function verificaFim(questions, fase){
	var img;
	var bo;
	var continua=false;

	createjs.Tween.removeTweens(word);
	conta.removeAllChildren();
	relogio.y=900;

	if(fase !== questions.length - 1){
		fase++

		btinicia = new createjs.Bitmap("resources/image/bt_iniciar-f" + (fase + 1) + ".png");
		btinicia.image.onload = function(){};
		stage.addChild(btinicia);
		btinicia.on("click", function() {
			stage.removeChild(this);
			formulaPergunta(questions, fase);
		});
	} else {
		if(i_acertos > i_erros * 2){
			img="resources/image/positivo.png";
			continua=true;
			som2();
		} else {
			img="resources/image/tentenovamente.png";
			continua=true;
			som3();
		}
	}

	if(continua){		
		bo = new createjs.Bitmap(img);
		bo.image.onload = function(){};
		bo.regX=bo.regY=210;
		bo.x=640;
		bo.y=1000;
		stage.addChild(bo);
		createjs.Tween.get(bo).wait(1000).to({y:350},1000,tipotween);
		bo.on("mousedown", function (evt) {
			stage.removeChild(this);
			conta.removeAllChildren();
			count=0;
			i_acertos=0;
			txt_a.text=i_acertos;
			i_erros=0;
			txt_e.text=i_erros;
			formulaPergunta(questions);
		});
	}
}

function animaIco(qual,b,c){
	var ico;
	ico = new createjs.Bitmap("resources/image/"+qual+".png");

	ico.x = b + 180;
	ico.y = (c / 2) + 60;

	conta.addChild(ico);
	ico.scaleX=ico.scaleY=0.1;
	createjs.Tween.get(ico).to({scaleX:0.3,scaleY:0.3},200,createjs.Ease.quadOut);
}
function deleta(){
	stage.removeChild(this);
}
function criaFundo(px,py,tamX,tamY){
	var shape = new createjs.Shape();
	shape.graphics.beginLinearGradientFill(["#3b6ca8", "#163d66"], [0, 1], 0, 0, 0, tamY);
	shape.graphics.drawRoundRect(0,0,tamX,tamY,0);
	shape.graphics.endFill();
	stage.addChild(shape);
}

function criaTexto(texto, lineWidth){
	lineWidth		=	lineWidth ? lineWidth : 500;

	var txt			=	new createjs.Text(texto, "bold 40px VAG Rounded BT", "#ffffff"),
		button		=	new createjs.Shape(),
		t			=	new createjs.Container();

	txt.shadow		=	new createjs.Shadow("#000000", 3, 3, 6);
	txt.textAlign	=	"left";
	txt.lineWidth	=	lineWidth;
	
	txt.x			=	15;
	txt.y			=	10;
	button.alpha 	=	0.6;
	

	button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, txt.getBounds().height + 20);
	button.graphics.drawRoundRect(0,0,txt.getBounds().width + 30, txt.getBounds().height + 20,20);
	button.graphics.endFill();

    t.addChild(button);
	t.addChild(txt);
	
	return t;
}


function ticker(event){
	stage.update();
}
function collisionDetect(object1, object2){
	var ax1 = object1.x;
	var ay1 = object1.y;
	var ax2 = object1.x + object1.getBounds().width;
	var ay2 = object1.y + object1.getBounds().height;

	var bx1 = object2.x;
	var by1= object2.y;
	var bx2= bx1 + object2.getBounds().width;
	var by2= by1 + object2.getBounds().height;

	if(object1 == object2) 
	{
		return false;
	}
	if (
		ax1 <= bx2 && ax2 >= bx1 &&
		ay1 <= by2 && ay2 >= by1
	) {
		return true;
	} else {
		return false;
	}
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