var AppRodasComATurma = function(itens_od1, _fundo, _bt_iniciar){
		var canvas;
		var stage;
		var content;
		var contenthit;
		var camadas=[];
		var inicio1=false;
		var btsom;
		var btinicia;
		var positivo;
		var resposta;
		var i_erros=0;
		var i_acertos=0;
		var escuro;
		var clicavel=true;
		var frase;
		var count=0;
		var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];
		var caminho="resources/image/";
		var gui;

		 quizSomInicio();
		function quizSomInicio() {
			var index;
			var t;
			for (index in sons) {
				t = sons[index];
				sons[index] = new Audio(caminho + t);
			}

			canvas = document.getElementById("od1");
			stage = new createjs.Stage(canvas);
			stage.enableMouseOver(10);
			contenthit = new createjs.Container();
			content = new createjs.Container();
			var fundo = new createjs.Bitmap(caminho+_fundo);
			fundo.image.onload = function(){};
			stage.addChild(fundo);

			stage.addChild(content);
			stage.addChild(contenthit);

			shuffle(itens_od1);

			positivo = new createjs.Bitmap(caminho+"positivo.png");
			positivo.image.onload = function(){};
			stage.addChild(positivo);
			positivo.x=450;
			positivo.y=100;
			positivo.visible=false;
			positivo.on("click", function() {
				reseta();
			});

			btinicia = new createjs.Bitmap(caminho+_bt_iniciar);
			btinicia.image.onload = function(){};
			stage.addChild(btinicia);
			btinicia.on("click", function() {
				btinicia.visible=false;
				tocaSom();

			});

			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener("tick", ticker);
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
		function criaGui() {
			gui = new createjs.Container();
			stage.addChild(gui);
			gui.x = 960;
			var _gui = new createjs.Bitmap(caminho+"gui.png");
			_gui.image.onload = function () {};

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

		function tocaSom(){
			content.removeAllChildren();
			clicavel=true;
			if(count<itens_od1.length){

				frase = new createjs.Bitmap(caminho+itens_od1[count].titulo);
				console.log(caminho+itens_od1[count].titulo);
				content.addChild(frase);
				frase.x = -1280;
				frase.y = 0;
				createjs.Tween.get(frase).to({x:20},600,createjs.Ease.backOut);
				resposta=itens_od1[count].certa;
				montaFase();
			}else{
				verificaFim();
			}
		}

		function montaFase(){
			var w=0;
			var j,r,i;
			var index;

			shuffle(itens_od1[count].opcoes);

			for(j=0;j<itens_od1[count].opcoes.length;j++){

				var bt = new createjs.Bitmap(caminho+itens_od1[count].opcoes[j]);

				content.addChild(bt);
				bt.x=1500;
				createjs.Tween.get(bt).wait(j*250).to({x:760},500,createjs.Ease.backOut);
				bt.y=j*230+20;
				bt.pode=true;
				bt.n=itens_od1[count].opcoes[j];

				bt.image.onload = function(){};
				console.log(caminho+itens_od1[count].opcoes[j]);
				bt.on("mousedown", function (evt) {
					if(this.pode && clicavel){
						this.scaleX=this.scaleY=0.5;
						createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut).wait(1000).call(tocaSom);
						clicavel=false;
						count++;
						if(this.n==resposta){
							i_acertos++;
							sons[0].play();
							animaIco('certo.png',this.x,this.y+50);
						}else{
							i_erros++;
							sons[1].play();
							animaIco('errado.png',this.x,this.y+50);
						}
					}
				});
				w++;
			}
		}

		function reseta(){
			clicavel=false;
			i_acertos = 0;
			i_erros = 0;
			count=0;
			content.removeAllChildren();
			contenthit.removeAllChildren();
			shuffle(itens_od1);
			montaFase();
			tocaSom();
		}

		function animaIco(qual,b,c){
			var err;
			err = new createjs.Bitmap(caminho+qual);
			contenthit.addChild(err);
			err.x = b;
			err.y = c+50;
			err.regX=160;
			err.regY=160;
			err.scaleX=err.scaleY=0.01;
			createjs.Tween.get(err).to({scaleX:0.6,scaleY:0.6},300,createjs.Ease.backOut).wait(600).call(apagaicone);
		}

		function apagaicone(e){
			inicio1=true;
			contenthit.removeChild(this);

		}

		function verificaFim() {
			criaGui();
			var img;
			var bo;
			var continua = false;

			img = caminho+"positivo.png";
			continua = true;
			sons[2].play();

			if (continua) {
				inicio1 = false;

				bo = new createjs.Bitmap(img);
				bo.image.onload = function () {};
				bo.regX = bo.regY = 210;
				bo.x = 700;
				bo.y = 1000;
				stage.addChild(bo);
				createjs.Tween.get(bo).wait(100).to({y: 300}, 1000, createjs.Ease.backOut);
				bo.on("mousedown", function (evt) {
					stage.removeChild(this);
					stage.removeChild(gui);
					reseta();
				});
			}
		}

		function ticker(event){
			stage.update();
		}
	}