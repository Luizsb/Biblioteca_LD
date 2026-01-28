var appOD2=function(idCanvas, itens, _fundo){
	
	var caminho="resources/image/";

	var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];
	var canvas1;
	var stage;
	var content;
	var content2;
	var fase1;
	var agua;
	var inicio1=false;
	var btinicia;
	var hits=[];
	var positivo;
	var btcontinuar;
	var texto;
	var texto2;
	var texto3;
	//var idGui = ["gui.png", "gui_od1.png", "gui_od2.png"];
	var imagens;
	var gui;
	var gui1;
	var gui2;
	var startTime;
	var erro;
	var i_erros=0;
	var i_acertos=0;

	var index;
	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}
	canvas1 = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas1);
	stage.enableMouseOver(10);
	content = new createjs.Container();
	content2 = new createjs.Container();

	var fundo = new createjs.Bitmap(caminho+_fundo);
	fundo.image.onload = function(){};

	stage.addChild(fundo);
	stage.addChild(content);
	stage.addChild(content2);

	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"fumaca.png"],
		"frames": {"regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200},
		"animations": {
			"idle": 20,
			"fumaca1": [0, 9, "idle"],
			"fumaca2": [10, 19, "idle"]
		}
	});

	agua = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(agua);

	gui = new createjs.Bitmap(caminho+"gui.png");
	gui.image.onload = function(){};
	content2.addChild(gui);
	gui.x=25;
	gui.y=580;

	texto2 = new createjs.Text("0", "bold 40px Arial", "#5ab00b");
	texto2.x=240;
	texto2.y=590;
	texto2.textAlign = "center";
	content2.addChild(texto2);

	texto3 = new createjs.Text("0", "bold 40px Arial", "#ff0000");
	texto3.x=205;
	texto3.y=670;
	texto3.textAlign = "center";
	content2.addChild(texto3);

	content2.visible=false;

	erro = new createjs.Bitmap(caminho+"erro.png");
	erro.image.onload = function(){};
	content.addChild(erro);
	erro.alpha=0.01;
	erro.on("mousedown", function (evt) {
		if(inicio1){
			sons[1].play();
			i_erros+=1;
			texto3.text=i_erros;
			errado(evt.stageX,evt.stageY);
			verificaFim();
		}
	});
	montaFase();

	btinicia = new createjs.Bitmap(caminho+"bt_iniciar_od3.png");
	btinicia.image.onload = function(){};
	stage.addChild(btinicia);
	btinicia.on("click", function() {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		inicio1=true;
		btinicia.visible=false;
		content2.visible=true;
		content2.x=-600;
		createjs.Tween.get(content2).to({x:25},1000,createjs.Ease.backOut);
		var som=new Audio(caminho+"enunciado.mp3");
		som.play();
	});

	btcontinuar = new createjs.Bitmap(caminho+"tentenovamente.png");
	btcontinuar.image.onload = function(){};
	stage.addChild(btcontinuar);
	btcontinuar.x=400;
	btcontinuar.y=300;
	btcontinuar.regX=160;
	btcontinuar.regY=200;
	btcontinuar.visible=false;
	btcontinuar.on("click", function() {
		inicio1=true;
		btcontinuar.visible=false;
		montaFase();
		i_erros=0;
		texto3.text=i_erros;
		i_acertos=0;
		texto2.text=i_acertos;
	});


	positivo = new createjs.Bitmap(caminho+"positivo.png");
	positivo.image.onload = function(){};
	stage.addChild(positivo);
	positivo.x=400;
	positivo.y=300;
	positivo.regX=160;
	positivo.regY=210;
	positivo.scaleX=positivo.scaleY=0.8;
	positivo.visible=false;
	positivo.on("click", function() {
		inicio1=true;
		positivo.visible=false;
		montaFase();
		i_erros=0;
		texto3.text=i_erros;
		i_acertos=0;
		texto2.text=i_acertos;
	});

	createjs.Ticker.setFPS(30);
	createjs.Ticker.on("tick", ticker);

	function montaFase(){
		hits=[];
		for(var i=0;i<itens[0].layers.length;i++){
			hits[i] = new createjs.Bitmap(caminho+itens[0].layers[i]);
			content.addChild(hits[i]);
			hits[i].pode=true;
			hits[i].on("mousedown", function (evt) {
				if(inicio1 && this.pode){
					createjs.Tween.get(this).to({alpha:0},1000,createjs.Ease.linear).call(apaga);
					sons[0].play();
					this.pode=false;
					agua.x=stage.mouseX+30;
					agua.y=stage.mouseY;
					agua.gotoAndPlay("fumaca1");

				}

			});
		}
	}

	function errado(a,b){
		var certo = new createjs.Bitmap(caminho+"errado.png");
		certo.scaleX=certo.scaleY=0.1;
		content.addChild(certo);
		certo.x=a;
		certo.y=b;
		certo.regX=155;
		certo.regY=155;
		certo.alpha=0;
		createjs.Tween.get(certo).to({scaleX:0.3,scaleY:0.3,alpha:1},500,createjs.Ease.backOut).wait(1000).call(apaga2);

	}
	function apaga(){
		content.removeChild(this);
		i_acertos+=1;
		texto2.text=i_acertos;
		verificaFim();
	}
	function apaga2(){
		content.removeChild(this);
	}
	function verificaFim(){
		if(i_acertos>=7 && i_erros<3){
			positivo.visible=true;
			inicio1=false;
			sons[2].play();
		}else if(i_acertos>=7 && i_erros>=3){
			btcontinuar.visible=true;
			inicio1=false;
			sons[3].play();
		}

	}

	function ticker(){
		stage.update();

	}
}