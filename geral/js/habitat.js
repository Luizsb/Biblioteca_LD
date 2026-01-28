var canvas;
var stage;
var fundo;
var conta;
var hit;
var n_resp=6;
var freq=0;
var freq2=0;
var quefase=0;
var count=11;
var seq=[[0,1,2,3,4,5,6,7,8,9,10,11],
[0,1,2,3,4,5,6,7,8,9,10,11,3,4,5,6,7,8],
[0,1,2,3,4,5,6,7,8,9,10,11,1,4,5,9,7,8],
[0,1,2,3,4,5,6,7,8,9,10,11,0,1,2,3,4,5,6,7,8,9,10,11]];
var clicavel=true;
var respostas=[[2,4,3],[7,6,5],[9,1,8],[0,11,10]];
var letras=['a','e','i','o','u'];
var gabarito=["geladeira","gelo","gibi","geleia","giz","mágico","gigante","girassol","gema","gelatina"];
var word;
var inicio1=false;
var btinicia;
var tempoPergunta=10000;
var fumacinha;
var relogio;
var tipotween=createjs.Ease.quadOut;
var tipotween2=createjs.Ease.quadIn;
var pos=[[450,370],[600,490],[750,610]];

var gui;
var i_acertos=0;
var i_erros=0;
var txt_a;
var txt_e;
var cartas=[];
var ca_img=[];
var sombracarta;
var figuras=[];
var tempoCarta=5000;

function gameHabitat(canvasID) {
    canvas = document.getElementById(canvasID);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);

	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;

	criaFundo(0,0,1280,720);

	shuffle(seq[0]);
	shuffle(seq[1]);
	shuffle(seq[2]);
	shuffle(seq[3]);

	btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
	btinicia.image.onload = function(){};
    stage.addChild(btinicia);
	btinicia.x=400;
	btinicia.y=250;
	btinicia.on("click", function() {
        btinicia.visible=false;
		for(var i=0;i<4;i++){
		   figuras[i] = new createjs.Bitmap("resources/image/fig"+i+".png");
	       figuras[i].image.onload = function(){};
           stage.addChild(figuras[i]);
		}
		conta = new createjs.Container();
	    stage.addChild(conta);
		fase(seq[quefase]);
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
function fase(qual){
    sombracarta = new createjs.Bitmap("resources/image/sombra.png");
	sombracarta.image.onload = function(){};
    conta.addChild(sombracarta);
	sombracarta.x=720;
	sombracarta.y=390;
	sombracarta.alpha=0;

	count=qual.length-1;
	for(var i=0;i<qual.length;i++){
		cartas[i] = new createjs.Container();
	    conta.addChild(cartas[i]);
		ca_img[i] = new createjs.Bitmap("resources/image/carta.png");
	    ca_img[i].image.onload = function(){};
        cartas[i].addChild(ca_img[i]);

		ca_img[i].regX=335/2;
		ca_img[i].regY=468/2;
		ca_img[i].rotation=-45;
		cartas[i].x=1000;
	    cartas[i].y=-600;
		cartas[i].scaleX=0.8;
		cartas[i].scaleY=0.4;

		createjs.Tween.get(ca_img[i]).wait(i*100).to({rotation:45},1000,tipotween);
		createjs.Tween.get(cartas[i]).wait(i*100).to({y:550-i*8},1000,tipotween);

	}
	createjs.Tween.get(sombracarta).to({alpha:0.5},222*count,tipotween).call(compraCarta);
	for(var i=0;i<4;i++){
		figuras[i].alpha=0;
	}
	createjs.Tween.get(figuras[quefase]).to({alpha:1},2000,tipotween);
    textoContorno("Etapa "+(quefase+1));
}



function compraCarta(){
    createjs.Tween.get(ca_img[count]).to({rotation:0},1000,createjs.Ease.backOut);
	createjs.Tween.get(cartas[count]).to({scaleY:1,scaleX:1,y:280},1000,createjs.Ease.backOut).to({scaleX:0.1},300,tipotween2).call(deleta);


	var carta = new createjs.Bitmap("resources/image/carta"+seq[quefase][count]+".png");
	carta.image.onload = function(){};
    conta.addChild(carta);
	carta.scaleX=0;
	carta.regX=335/2;
    carta.regY=468/2;
	carta.x=1000;
	carta.y=280;
	carta.id=seq[quefase][count];
	createjs.Tween.get(carta).wait(1300).to({scaleX:1},300,tipotween).wait(tempoCarta).call(proxima).to({x:1800,rotation:90},1000,createjs.Ease.backIn);
    carta.on("mousedown", function (evt) {
	    if(clicavel){
		if(respostas[quefase].indexOf(this.id) >= 0){
			console.log('??????????');
		    createjs.Tween.get(carta,{override:true}).to({scaleX:0.2,scaleY:0.2,x:350,y:350},1000,createjs.Ease.backInOut).call(deleta);
			animaIco("certo",this.x,this.y+100);
			i_acertos++;
			txt_a.text=i_acertos;
			console.log('acertos: '+i_acertos);
	        proxima();
			som0();
		}else{
		    som1();
			animaIco("errado",this.x,this.y+100);
			i_erros++;
			txt_e.text=i_erros;
			if(i_erros>5){
			    i_acertos=0;
				createjs.Tween.removeTweens(this);
		        verificaFim();
            }
		}
	    }
    });
}
function proxima(){
    clicavel=false;
    if(count>0){
        count--;
        compraCarta();

    }else{
		createjs.Tween.get(sombracarta).to({alpha:0},1000,tipotween).call(trocaFase);
	}
}
function trocaFase(){
    if(quefase<3){
	    conta.removeAllChildren();
        quefase++;
	    fase(seq[quefase]);
	}else{

		verificaFim();

	}
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
	gui.y=630;

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

function verificaFim(){
    console.log("verificaFim "+quefase);
    var img;
    var bo;
	var continua=false;
	conta.removeAllChildren();
	for(var i=0;i<4;i++){
		figuras[i].alpha=0;
	}
	gui.y=0;
	gui.x=320;
    if(i_acertos>=18){
	    img="resources/image/positivo.png";
		continua=true;
		som2();
	}else{
	    img="resources/image/tentenovamente.png";
		continua=true;
	    som3();
	}
	if(continua){
	    inicio1=false;
		conta.removeAllChildren();

	    bo = new createjs.Bitmap(img);
	    bo.image.onload = function(){};
	    bo.regX=bo.regY=210;
	    bo.x=700;
	    bo.y=1000;
	    stage.addChild(bo);
		createjs.Tween.get(bo).to({y:350},1000,tipotween);
	    bo.on("mousedown", function (evt) {
	        stage.removeChild(this);
			gui.y=630;
		    gui.x=0;
			count=0;
			i_acertos=0;
			txt_a.text=i_acertos;
			i_erros=0;
			txt_e.text=i_erros;
	        quefase=0;
	        fase(seq[quefase]);

        });


	}

}
function animaIco(qual,b,c){
    var ico;
	ico = new createjs.Bitmap("resources/image/"+qual+".png");
    conta.addChild(ico);
	ico.x = b-30;
	ico.y = c-150;
	ico.regX=98;
	ico.regY=98;
	ico.scaleX=ico.scaleY=0.1;
	createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut).wait(500).call(sodeleta);
}
function sodeleta(){
    conta.removeChild(this);
}
function deleta(){
    clicavel=true;
    conta.removeChild(this);
}
function criaFundo(px,py,tamX,tamY){
    var shape = new createjs.Shape();
	shape.graphics.beginLinearGradientFill(["#ffffff", "#e5e5e5"], [0, 1], 0, 0, 0, tamY);
    shape.graphics.drawRoundRect(0,0,tamX,tamY,0);
    shape.graphics.endFill();
	stage.addChild(shape);
}
function textoContorno(texto){
    var tit = new createjs.Container();
	stage.addChild(tit);

	var txt = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#ffffff");
	txt.regY=60;
    txt.textAlign = "center";

	var contorno = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#000000");
	contorno.regY=60;
    contorno.textAlign = "center";
    contorno.outline = 12;

    tit.addChild(contorno);
	tit.addChild(txt);

	tit.x=-300;
	tit.y=100;
    createjs.Tween.get(tit).to({x:640},300,createjs.Ease.backOut).wait(1500).to({x:1500},300,createjs.Ease.backOut);
}

function caixaTexto(texto){

	var txt = new createjs.Text(texto, "bold 40px VAG Rounded BT", "#000000");

	var tamX=txt.getBounds().width+80;
	var tamY=txt.getBounds().height+50;

	txt.regY=tamY/2-35;
    txt.textAlign = "center";

	var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
    button.graphics.drawRoundRect(0,0,tamX,tamY,20);
    button.graphics.endFill();
	button.regX=tamX/2;
	button.regY=tamY/2;

	var resp = new createjs.Container();
	resp.addChild(button);
	resp.addChild(txt);

	return resp;

}
function ticker(event){
	stage.update();
}
function collisionDetect(object1, object2){
    var ax1 = object1.x;
    var ay1 = object1.y;
    var ax2 = object1.x + 100;
    var ay2 = object1.y + 100;

    var bx1 = object2.x;
    var by1= object2.y;
    var bx2= bx1 + 100;
    var by2= by1 + 100;

    if(object1 == object2)
    {
        return false;
    }
    if (ax1 <= bx2 && ax2 >= bx1 &&
            ay1 <= by2 && ay2 >= by1)
    {
        return true;
    } else {

        return false;
    }
}
function som0(){
	if( /Android/i.test(navigator.userAgent) || /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
		document.getElementsByTagName('audio')[0].play();
	}else{
		UWK.sendMessage("UnityMessage", { "audio": "pop"});
	}
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