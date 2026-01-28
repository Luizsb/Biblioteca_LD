	var AppClothing = function (__canvas){
	var canvas;
		var stage;
		var content;
		var contenthit;
		var contentprato;
		var fundo;
		var respostas1 = [1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1];
		var posX = [187, 149, 319, 1100, 1147, 982];
		var posY = [176, 466, 605, 147, 423, 615];
		var posX2 = [394, 0, 0, 597, 466, 372, 624, 379, 0, 0, 170];
		var posY2 = [161, 0, 0, 165, 303, 269, 306, 280, 0, 0, 155];
		var seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
		var count = 0;
		var update = false;
		var hit;
		var palavras = [];
		var figuras = [];
		var inicio1 = false;
		var edgeOffsetX = 200;
		var edgeOffsetY = 200;
		var btreseta;
		var btinicia;
		var positivo;
		var i_erros = 0;
		var i_acertos = 0;
		var texto_certo;
		var texto_errado;
		var texto_tempo;
		var startTime;
		var positivo;
		var frase;
		var gui;
		init1();
		function init1() {
			canvas = document.getElementById(__canvas);
			stage = new createjs.Stage(canvas);
			stage.enableMouseOver(10);
			contenthit = new createjs.Container();
			content = new createjs.Container();
			contentgui = new createjs.Container();
			contentprato = new createjs.Container();

			shuffle(seq);
			criaFundo(0, 0, 1280, 720);
			stage.addChild(contenthit);
			stage.addChild(content);
			stage.addChild(contentgui);
			contentgui.visible = false;

			btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
			btinicia.image.onload = function () { };
			stage.addChild(btinicia);
			btinicia.on("click", function () {
				btinicia.visible = false;
				startTime = Date.now();
				montaFase();
				update = true;
			});
			gui = new createjs.Bitmap("resources/image/gui.png");
			gui.image.onload = function () { };
			contentgui.addChild(gui);
			gui.x = 25;
			gui.y = 15;

			texto_tempo = new createjs.Text("0:00", "bold 40px VAG Rounded BT", "#000000");
			texto_tempo.x = 285;
			texto_tempo.y = 30;
			texto_tempo.textAlign = "center";
			contentgui.addChild(texto_tempo);

			texto_errado = new createjs.Text("0", "bold 40px VAG Rounded BT", "#ff0000");
			texto_errado.x = 277;
			texto_errado.y = 100;
			texto_errado.textAlign = "center";
			contentgui.addChild(texto_errado);

			texto_certo = new createjs.Text("0", "bold 40px VAG Rounded BT", "#5ab00b");
			texto_certo.x = 280;
			texto_certo.y = 167;
			texto_certo.textAlign = "center";
			contentgui.addChild(texto_certo);

			contentgui.x = 200;
			contentgui.y = 250;

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

		function montaFase() {
			var w = 0;
			for (var i = 0; i < 6; i++) {
				for (var j = 0; j < 4; j++) {
					figuras[w] = new createjs.Bitmap("resources/image/f" + seq[w] + ".png");
					figuras[w].image.onload = function () { };
					contenthit.addChild(figuras[w]);
					figuras[w].x = i * 180 + 180;
					figuras[w].y = j * 160 + 120;
					figuras[w].regX = 316 / 2;
					figuras[w].regY = 287 / 2;
					figuras[w].pode = true;
					figuras[w].id = seq[w];
					figuras[w].alpha = 0;
					figuras[w].scaleX = figuras[w].scaleY = 0.01;
					createjs.Tween.get(figuras[w]).wait(w * 50).to({ scaleX: 0.55, scaleY: 0.55, alpha: 1 }, 300, createjs.Ease.backOut);
					figuras[w].on("mousedown", function (evt) {
						if (this.pode) {
							this.pode = false;
							this.scaleX = this.scaleY = 0.1;
							createjs.Tween.get(this).to({ scaleX: 0.5, scaleY: 0.5 }, 300, createjs.Ease.backOut);
							if (this.id < 13) {
								animaIco('certo', this.x, this.y);
								som0();
								i_acertos++;
								texto_certo.text = i_acertos;
								if (i_acertos >= 13) {
									contenthit.removeAllChildren();
									update = false;
									Fim();
								}
							} else {
								animaIco('errado', this.x, this.y);
								som1();
								i_erros++;
								texto_errado.text = i_erros;
								this.alpha = 0.3;
							}
						}
					});
					w++;
				}
			}

		}
		function reseta() {
			btreseta.visible = false;
			positivo.visible = false;
			inicio1 = true;
			i_erros = 0;
			count = 0;
			var w = 0;
			content.removeAllChildren();
			contenthit.removeAllChildren();
			montaFase();
			proximo();
		}
		function Fim() {
			var img;
			var bo;
			var continua = false;
			contentgui.visible = true;
			if (i_erros > 0) {
				som3();
				img = "resources/image/tentenovamente.png";
				continua = true;
			} else {
				som2();
				img = "resources/image/positivo.png";
				continua = true;
			}
			if (continua) {
				bo = new createjs.Bitmap(img);
				bo.image.onload = function () { };
				bo.regX = bo.regY = 210;
				bo.x = 850;
				bo.y = 1000;
				stage.addChild(bo);
				createjs.Tween.get(bo).wait(100).to({ y: 350 }, 1000, createjs.Ease.backOut);
				bo.on("mousedown", function (evt) {
					stage.removeChild(this);
					i_erros = 0;
					i_acertos = 0;
					texto_errado.text = 0;
					texto_certo.text = 0;
					update = true;
					inicio1 = true;
					startTime = Date.now();
					montaFase();
					contentgui.visible = false;
				});
			}
		}
		function collisionDetect(object1, object2) {
			var ax1 = object1.x;
			var ay1 = object1.y;
			var ax2 = object1.x + edgeOffsetX;
			var ay2 = object1.y + edgeOffsetY;

			var bx1 = object2.x;
			var by1 = object2.y;
			var bx2 = bx1 + edgeOffsetX;
			var by2 = by1 + edgeOffsetY;

			if (object1 == object2) {
				return false;
			}
			if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
				return true;
			} else {
				return false;
			}
		}
		function animaIco(qual, b, c) {
			var ico;
			ico = new createjs.Bitmap("resources/image/" + qual + ".png");
			contenthit.addChild(ico);
			ico.x = b;
			ico.y = c;
			ico.regX = 160;
			ico.regY = 160;
			ico.scaleX = ico.scaleY = 0.01;
			createjs.Tween.get(ico).wait(100).to({ scaleX: 0.3, scaleY: 0.3 }, 200, createjs.Ease.quadOut).wait(1000);
		}
		function verificaFim() {

		}
		function apagaicone(e) {
			stage.removeChild(this);
		}
		function ticker(event) {
			stage.update();
			if (update) checkTime();
		}
		function checkTime() {
			var timeDifference = Date.now() - startTime;
			var formatted = convertTime(timeDifference);
			texto_tempo.text = '' + formatted;
		}
		function convertTime(miliseconds) {
			var totalSeconds = Math.floor(miliseconds / 1000);
			var minutes = Math.floor(totalSeconds / 60);
			var seconds = totalSeconds - minutes * 60;
			if (seconds < 10) seconds = '0' + seconds;
			return minutes + ':' + seconds;
		}
		function intersect(obj1, obj2) {

			var objBounds1 = obj1.getBounds().clone();
			var objBounds2 = obj2.getBounds().clone();
			if (obj1.x > (obj2.x - edgeOffset) &&
				obj1.x < (obj2.x + objBounds2.width + edgeOffset) &&
				obj1.y > (obj2.y - edgeOffset) &&
				obj1.y < (obj2.y + objBounds2.height + edgeOffset)
			)
				return true;
			else
				return false;
		}
		function criaFundo(px, py, tamX, tamY) {
			var shape = new createjs.Shape();
			shape.graphics.beginLinearGradientFill(["#ffffff", "#e5e5e5"], [0, 1], 0, 0, 0, tamY);
			shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
			shape.graphics.endFill();
			stage.addChild(shape);
		}
		function som0() {
			document.getElementsByTagName('audio')[0].play();
		}
		function som1() {
			document.getElementsByTagName('audio')[1].play();
		}
		function som2() {
			document.getElementsByTagName('audio')[2].play();
		}
		function som3() {
			document.getElementsByTagName('audio')[3].play();
		}	
}