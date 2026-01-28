var gameID;
var canvas;
var rel = [];
var stage;
var conta;
var botoes;
var icones_associar;
var count = 0;
var seq = [];
var inicio_associar = false;
var gui;
var podeArrastar=true;
var i_acertos = 0;
var i_erros = 0;
var caminho;
var fig=[];
var figA=[];
var caminhoPossiveis = ["resources/image/", "resources/image/"];
var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];
var delayGeral=1500;
var relationsGeral={};

function gameAssociar(canvasID, relations, delay) {
	gameID	=	canvasID;
	delay	=	delay	?	delay	:	1500;

	rel = relations;
    relationsGeral=relations;
    delayGeral=delay;

	canvas = document.getElementById(canvasID);
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);

	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;

	var fundo = new createjs.Bitmap("bg.jpg");
	fundo.image.onload = function () {};
	stage.addChild(fundo);

	conta = new createjs.Container();
	botoes = new createjs.Container();
	icones_associar = new createjs.Container();

	stage.addChild(conta);
	stage.addChild(botoes);
	stage.addChild(icones_associar);

    caminho = caminhoPossiveis[1];

	var index;
	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}

	criaBts(relations, delay);


	var btinicia = new createjs.Bitmap("bt_iniciar.png");

	btinicia.x = ($('#' + canvasID).width() / 2) - 93;
	btinicia.y = $('#' + canvasID).height() / 2;
	btinicia.image.onload = function () {};
	stage.addChild(btinicia);

	btinicia.on("mousedown", function (evt) {
		stage.removeChild(this);
		formulaPergunta(640, 250);
        inicio_associar=true;

	});


	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker);

	function ticker(event) {
		stage.update();
	}
}

function criaGui() {
	gui = new createjs.Container();
	stage.addChild(gui);
	gui.x = 800;
	gui.y = 270;

	var _gui = new createjs.Bitmap("gui.png");
	_gui.image.onload = function () {
	};


	var txt_a = new createjs.Text(i_acertos, "bold 40px VAG Rounded BT", "#000000");
	txt_a.textAlign = "left";
	txt_a.x = 220;
	txt_a.y = 25;

	var txt_e = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#b10000");
	txt_e.textAlign = "left";
	txt_e.x = 220;
	txt_e.y = 100;

	gui.addChild(_gui);
	gui.addChild(txt_a);
	gui.addChild(txt_e);

}
function criaBts(relations, delay) {
	var bts		= buildRelations(relations);

    var i;
	for(i = 0; i < bts.length; i++){
		var bt = bts[i];
		bt.image.onload = function () {};
		bt.regX = -30;
		bt.regY = 120;

		if(i % 2 === 0){
			bt.x = bt.px = 0;
        }else{
			bt.x = bt.px = 280;
        }

		bt.y = bt.py = Math.floor(i / 2) * 170 + 150;

		bt.pode	=	true;

		botoes.addChild(bt);

		bt.on("mousedown", function (evt) {
			if(inicio_associar){
				this.parent.addChild(this);
				var global = botoes.localToGlobal(this.x, this.y);
				this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
			}
		});

		bt.on("pressmove", function (evt) {
			if(inicio_associar){
				var local = botoes.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
				this.x = local.x;
				this.y = local.y;
			}
		});

		bt.on("pressup", function (evt) {
			if(inicio_associar){
				inicio_associar=false;
				this.x	=	this.px;
				this.y	=	this.py;
				if(this.id == seq[count]){
                    this.visible=false;
					i_acertos++;
					figA[seq[count]].x=880;
					figA[seq[count]].y=400;
					fig[seq[count]].y=-900;
					figA[seq[count]].scaleX=0.7;
					figA[seq[count]].scaleY=0.7;
					createjs.Tween.get(figA[seq[count]]).to({scaleX:1,scaleY:1},300,createjs.Ease.backOut).wait(delay).call(proxima);
					popBolha(880,400);
					animaIco("certo",1100,500);

					sons[0].play();
				} else {
                    animaIcoAssociar("errado",this.x+150,this.y);
					i_erros++;
					animaIco("errado",1100,500);
					sons[1].play();
					createjs.Tween.get(this).wait(delay).call(proxima);
				}
			}
		});
	}
}

function formulaPergunta() {
	inicio_associar = true;
	createjs.Tween.get(fig[seq[count]]).wait(200).to({y: 400, rotation: 0}, 1000, createjs.Ease.backOut);
}
function proxima() {
    icones_associar.removeAllChildren();
	figA[seq[count]].y=-900;
	fig[seq[count]].y=-900;
	inicio_associar=true;
	if (count < (seq.length - 1)) {
		count++;
		formulaPergunta();
	} else {
		verificaFim(rel);
	}

}
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function verificaFim(rel) {
	var img;
	var bo;
	var continua = false;
	criaGui();
	if (i_acertos >= seq.length) {
		img = "positivo.png";
		continua = true;
		sons[2].play();
	} else {
		img = "tentenovamente.png";
		continua = true;
		sons[3].play();
	}
	if (continua) {
		inicio_associar = false;
		var i=0;
		botoes.removeAllChildren();
		bo = new createjs.Bitmap(img);
		bo.image.onload = function () {};
		bo.regX = bo.regY = 210;
		bo.x = 700;
		bo.y = 1000;
		stage.addChild(bo);
		createjs.Tween.get(bo).wait(100).to({y: 350}, 1000, createjs.Ease.backOut);
		bo.on("mousedown", function (evt) {
            stage.removeChild(gui);
            stage.removeChild(this);
			seq = [];
			inicio_associar = false;
			podeArrastar=true;
			count = 0;
			i_acertos = 0;
			i_erros = 0;
            criaBts(relationsGeral, delayGeral);
            formulaPergunta();
		});
	}
}
function popBolha(px, py) {
	var bo = new createjs.Bitmap("bolha_pop.png");
	bo.image.onload = function () {};
	bo.regX = bo.regY = 155;
	bo.scaleX = bo.scaleY = 0.5;
	bo.x = px;
	bo.y = py;
	stage.addChild(bo);
	createjs.Tween.get(bo).to({scaleX: 1, scaleY: 1}, 150, createjs.Ease.linear).call(deleta);
}
function animaIcoAssociar(qual, b, c) {
	var ico;
	ico = new createjs.Bitmap("" + qual + ".png");
	icones_associar.addChild(ico);
	ico.x = b;
	ico.y = c;
	ico.regX = 315 / 2;
	ico.regY = 315 / 2;
	ico.scaleX = ico.scaleY = 0.1;
	createjs.Tween.get(ico).to({scaleX: 0.3, scaleY: 0.3}, 200, createjs.Ease.backOut);
}
function animaIco(qual, b, c) {
	var ico;
	ico = new createjs.Bitmap("" + qual + ".png");
	stage.addChild(ico);
	ico.x = b;
	ico.y = c;
	ico.regX = 315 / 2;
	ico.regY = 315 / 2;
	ico.scaleX = ico.scaleY = 0.1;
	createjs.Tween.get(ico).to({scaleX: 0.8, scaleY: 0.8}, 200, createjs.Ease.backOut).wait(600).call(deleta);
}
function deleta() {
	stage.removeChild(this);
}


function collisionDetect(object1, object2) {
	var ax1 = object1.x;
	var ay1 = object1.y;
	var ax2 = object1.x + 100;
	var ay2 = object1.y + 100;

	var bx1 = object2.x;
	var by1 = object2.y;
	var bx2 = bx1 + 100;
	var by2 = by1 + 100;

	if (object1 == object2) {
		return false;
	}

	return !!(ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1);
}

function textoContorno(texto,px,py){
	var txt = new createjs.Text(texto, "bold 50px VAG Rounded BT", "#ffffff");
	txt.x = px;
	txt.y = py;
	txt.textAlign = "center";

	var contorno = new createjs.Text(texto, "bold 50px VAG Rounded BT", "#000000");
	contorno.x = px;
	contorno.y = py;
	contorno.textAlign = "center";
	contorno.outline = 10;

	conta.addChild(contorno);
	conta.addChild(txt);
}

function buildRelations(relations){
	var bts = [];
	shuffle(relations);

	relations.splice(0, relations.length - 8);
    var i;
	for(i = 0; i < relations.length; i++){
		bts.push(new createjs.Bitmap(relations[i].a));
		bts[i].id = i;
		seq.push(parseInt(i));

		fig[i] = new createjs.Bitmap(relations[i].b);
		fig[i].image.onload = function () {};
		conta.addChild(fig[i]);
		fig[i].regX = 555 / 2;
		fig[i].regY = 602 / 2;
		fig[i].x = 880;
		fig[i].y = -600;

		figA[i] = new createjs.Bitmap(relations[i].c);
		figA[i].image.onload = function () {};
		conta.addChild(figA[i]);
		figA[i].regX = 555 / 2;
		figA[i].regY = 602 / 2;
		figA[i].x = 880;
		figA[i].y = -600;
	}

	shuffle(seq);

	return bts;
}