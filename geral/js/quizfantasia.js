var caminho;
var caminhoPossiveis = ["resources/", "resources/image/"];
var canvas;
var stage;
var content;
var contenthit;
var contentgui;
var gui;
var fundo;
var wave;
var positivo;
var inicio1=false;
var btinicia;
var respostas=[0,1,0,0,1,1,0,1,0,0];
var moscas=[];
var posX=[690,830,999,1000];
var seq=[0,1,2,3,4,5,6];
var word_count=0;
var hits=[];
var palavras=[];
var figuras=[];
var letras=[];
var edgeOffset = 10;
var count=0;
var si=0;
var countTempo=0;
var btcontinuar;
var bt1;
var bt2;
var score=0;
var label;
var intervalo=500;
var velocidade=15000;
var erro=0;
var update=true;
var clicavel=false;
var i_foto;
var texto;
var texto2;
var texto3;
var i_erros=0;
var i_acertos=0;
var sons = [
    "tambor.mp3",
    "erro.mp3",
    "PARABENS.mp3",
    "tentenovamente.mp3",
    "fantasia_de_que_audio_01.mp3",
    "fantasia_de_que_audio_02.mp3",
    "fantasia_de_que_audio_03.mp3",
    "fantasia_de_que_audio_04.mp3",
    "fantasia_de_que_audio_05.mp3",
    "fantasia_de_que_audio_06.mp3",
    "fantasia_de_que_audio_07.mp3"
];
var KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39,KEYCODE_UP = 38, KEYCODE_DOWN = 40;
var moveObj;
var msgClique;
var msgs=[];

function versao_od1(){
	stage.on("mousedown", function (evt) {
		if (evt.stageX > stage.canvas.width-50 && evt.stageY > stage.canvas.height-50) {
			var txtversao = stage.getChildByName("versao");
			if(txtversao!=null){
				stage.removeChild(txtversao);
			}else{
				txtversao = new createjs.Text("v1", "bold 20px VAG Rounded BT", "#000000");
				txtversao.textAlign = "center";
				txtversao.x=stage.canvas.width-25;
				txtversao.y=stage.canvas.height-30;
				txtversao.name="versao";
				stage.addChild(txtversao);
			}
		}
	});
}
function quizFantasia(idCanvas) {
     if ($(".enunciadoNumero")[0]) {
        caminho = caminhoPossiveis[1];
    } else {
        caminho = caminhoPossiveis[0];
    }
    var index;
    for (index in sons) {
        var t = sons[index];
        sons[index] = new Audio(caminho + t);
    }
    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
	contenthit = new createjs.Container();
	content = new createjs.Container();
	contentgui = new createjs.Container();
	fundo = new createjs.Bitmap(caminho+"fundo.png");
	fundo.image.onload = function(){};
    stage.addChild(fundo);

	stage.addChild(content);
	stage.addChild(contenthit);
	stage.addChild(contentgui);
	versao_od1();
	shuffle(seq);

    msgClique = new createjs.Bitmap(caminho+"msgClique.png");
	msgClique.image.onload = function(){};
    contentgui.addChild(msgClique);
    msgClique.visible=false;
    var i;
    for(i=0;i<7;i++){
        msgs[i] = new createjs.Bitmap(caminho+"msg"+i+".png");
        msgs[i].image.onload = function(){};
        contentgui.addChild(msgs[i]);
        msgs[i].visible=false;
    }

	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
			images: [caminho+"wavesprite.png"],
			frames: [[0,0,240,240,0,0.25,0.4],[242,0,240,240,0,0.25,0.4],[484,0,240,240,0,0.25,0.4],[726,0,240,240,0,0.25,0.4],[0,242,240,240,0,0.25,0.4],[242,242,240,240,0,0.25,0.4],[484,242,240,240,0,0.25,0.4],[726,242,240,240,0,0.25,0.4],[0,484,240,240,0,0.25,0.4],[242,484,240,240,0,0.25,0.4],[484,484,240,240,0,0.25,0.4],[726,484,240,240,0,0.25,0.4],[0,726,240,240,0,0.25,0.4],[242,726,240,240,0,0.25,0.4],[484,726,240,240,0,0.25,0.4],[726,726,240,240,0,0.25,0.4],[0,968,240,240,0,0.25,0.4],[242,968,240,240,0,0.25,0.4],[484,968,240,240,0,0.25,0.4],[726,968,240,240,0,0.25,0.4],[0,1210,240,240,0,0.25,0.4],[242,1210,240,240,0,0.25,0.4],[484,1210,240,240,0,0.25,0.4],[726,1210,240,240,0,0.25,0.4],[0,1452,240,240,0,0.25,0.4],[242,1452,240,240,0,0.25,0.4],[484,1452,240,240,0,0.25,0.4],[726,1452,240,240,0,0.25,0.4],[0,1694,240,240,0,0.25,0.4],[242,1694,240,240,0,0.25,0.4],[484,1694,240,240,0,0.25,0.4]],
			animations: {
				idle: 20,
				toca: [0, 30, "toca"]
			}
	});
	wave = new createjs.Sprite(spriteSheet, "toca");
	stage.addChild(wave);
    wave.visible=false;
    wave.x=500;
    wave.y=200;

	for(i=0;i<7;i++){
		figuras[i] = new createjs.Bitmap(caminho+"b"+seq[i]+".png");
		content.addChild(figuras[i]);
		figuras[i].x = i*175+120;
		figuras[i].y = 475;
		figuras[i].regX=237/2;
		figuras[i].regY=455/2;
		figuras[i].id=seq[i];
        figuras[i].cursor = "pointer";
        figuras[i].on("mousedown", function (evt) {
			if(clicavel){
                clicavel=false;
                msgClique.visible=false;
			    this.scaleY=this.scaleX=0.7;
                createjs.Tween.get(this).to({scaleX:1,scaleY:1},300,createjs.Ease.bounceOut);
                if(count==this.id){
                    animaCerto("certo",this.x,this.y);
                    sons[0].play();
                    i_acertos++;
                }else{
                    animaCerto("errado",this.x,this.y);
                    sons[1].play();
                    i_erros++;

                }

            }
        });
	}

	btinicia = new createjs.Bitmap(caminho+"bt_inicio.png");
	btinicia.image.onload = function(){};
    stage.addChild(btinicia);
	btinicia.on("click", function() {
        btinicia.visible=false;
		inicio1=true;
        countTempo=0;
        tocaMusica(count+4,count);


    });


    this.document.onkeydown = keyPressed;
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker);
}
function criaGui() {
    gui = new createjs.Container();
    stage.addChild(gui);
            gui.x = 960;

            var _gui = new createjs.Bitmap(caminho+"gui.png");
            _gui.image.onload = function () {
            };


            txt_a = new createjs.Text(i_acertos, "bold 40px VAG Rounded BT", "#000000");
            txt_a.textAlign = "left";
            txt_a.x = 220;
            txt_a.y = 25;

            txt_e = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#b10000");
            txt_e.textAlign = "left";
            txt_e.x = 220;
            txt_e.y = 100;

            gui.addChild(_gui);
            gui.addChild(txt_a);
            gui.addChild(txt_e);

}
function tocaMusica(s,j){
    wave.visible=true;
    sons[s].play();
    sons[s].onended = function() {
        msgs[j].visible=false;
        msgClique.visible=true;
        wave.visible=false;
        clicavel=true;
    };
    msgs[j].visible=true;

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
function animaCerto(a,px,py){
    var certo;
	certo = new createjs.Bitmap(caminho+a+".png");
    contenthit.addChild(certo);
	certo.x = px;
	certo.y = py;
	certo.regX=160;
	certo.regY=160;
	certo.scaleX=certo.scaleY=0.1;
	createjs.Tween.get(certo).to({scaleX:0.7,scaleY:0.7},500,createjs.Ease.quadOut).wait(1500).call(proxima);

}
function proxima(e){
	contenthit.removeChild(this);
	if(count>5){
        verificaFim();
	}else{
	    count+=1;
	    tocaMusica(count+4,count);
	}
}

function verificaFim() {
            criaGui();
            var img;
            var bo;
            var continua = false;
            if(i_acertos>=5){
                img = caminho+"positivo.png";
                continua = true;
                sons[2].play();
            } else {
                img = caminho+"tentenovamente.png";
                continua = true;

            }
            if (continua) {
                inicio1 = false;

                bo = new createjs.Bitmap(img);
                bo.image.onload = function () {};
                bo.regX = bo.regY = 210;
                bo.x = 700;
                bo.y = 1000;
                stage.addChild(bo);
                createjs.Tween.get(bo).wait(100).to({y: 350}, 1000, createjs.Ease.backOut);
                bo.on("mousedown", function (evt) {
                    stage.removeChild(this);
                    count = 0;
                    i_acertos = 0;
                    i_erros = 0;
                    tocaMusica(count+4,count);
                    stage.removeChild(gui);

                });


            }

        }
function ticker(event){
    if(update){
	    stage.update();

	}
}
function keyPressed(event) {
    console.log(moveObj.x+" "+moveObj.y);
	switch(event.keyCode) {
		case KEYCODE_LEFT:
            moveObj.x-=1;
			break;
		case KEYCODE_RIGHT:
			moveObj.x+=1;
			break;
		case KEYCODE_UP:
			moveObj.y-=1;
			break;
		case KEYCODE_DOWN:
			moveObj.y+=1;
			break;
	}
	stage.update();
}
function nasceMosca(){
    createjs.Tween.get(figuras[count]).to({x:590},1000,createjs.Ease.quadOut);
	clicavel=true;
}

function intersect(obj1, obj2){

    var objBounds1 = obj1.getBounds().clone();
    var objBounds2 = obj2.getBounds().clone();
	if(obj1.x > (obj2.x - edgeOffset) && obj1.x < (obj2.x + objBounds2.width + edgeOffset) && obj1.y > (obj2.y - edgeOffset) &&	obj1.y < (obj2.y + objBounds2.height + edgeOffset)){
		return true;
	}else{
		return false;
	}
}