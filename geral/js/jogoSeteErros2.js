var AppJogoSeteErros = function (idCanvas, posX, posY, escalas, names,_modoEdicao,_btinicar,_fundo,_imgErros,_ignoraInicioFim, _imgGui = "gui.png") {
	var canvas1,
	stage,
	caminho = "resources/image/",
	content,
	content2,
	contentGui,
	fase1,
	fundo,
	agua,
	inicio1 = false,
	btinicia,
	hits = [],
	edgeOffset = 10,
	positivo,
	btcontinuar,
	texto,
	texto2,
	texto3,
	imagemCertoErrado,
	gui,
	startTime,
	erro,
	i_erros = 0,
	i_acertos = 0,
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
	index,
	update=false,
	t;

	for (index in sons) {
		t = sons[index];
		sons[index] = new Audio(caminho + t);
	}

	canvas1 = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas1);
	stage.enableMouseOver(10);
	content = new createjs.Container();
	content2 = new createjs.Container();
	contentGui = new createjs.Container();

	fase1 = new createjs.Container();

	if(_fundo){
		fundo = new createjs.Bitmap(caminho+_fundo);
	}else{
		fundo = new createjs.Bitmap(caminho+"fundo_od2.png");
	}
	
	fundo.image.onload = function () { };

	stage.addChild(fundo);
	stage.addChild(fase1);
	stage.addChild(content);
	stage.addChild(content2);
	stage.addChild(contentGui);
	contentGui.visible=false;

	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"fumaca.png"],
		"frames": { "regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200 },
		"animations": {
			"idle": 20,
			"fumaca1": [0, 9, "idle"],
			"fumaca2": [10, 19, "idle"]
		}
	});
	agua = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(agua);

	if(_imgErros){
		imagemCertoErrado = new createjs.Bitmap(caminho+_imgErros);
	}else{
		imagemCertoErrado = new createjs.Bitmap(caminho+"img.png");
	}
	imagemCertoErrado.image.onload = function () { };
	content.addChild(imagemCertoErrado);
	imagemCertoErrado.on("mousedown", function (evt) {
		if (inicio1) {
			if (!_modoEdicao) {
				if (i_acertos<posX.length/2) {
					sons[1].play();
					i_erros += 1;
					agua.x = stage.mouseX;
					agua.y = stage.mouseY;
					agua.gotoAndPlay("fumaca1");
					texto3.text = i_erros + '/5';
					verificaFim();
					popIcon('errado', stage.mouseX, stage.mouseY, true);
				}
			}
		}
	});

	imagemCertoErrado.visible = false;
	gui = new createjs.Bitmap(caminho + _imgGui);

	gui.image.onload = function () { };
	contentGui.addChild(gui);
	gui.x = 25;
	gui.y = 15;

	texto = new createjs.Text("3:00", "bold 40px Arial", "#000000");
	texto.x = 260;
	texto.y = 25;
	texto.textAlign = "center";
	contentGui.addChild(texto);

	texto2 = new createjs.Text("0/"+posX.length/2, "bold 40px Arial", "#5ab00b");
	texto2.x = 720;
	texto2.y = 25;
	texto2.textAlign = "center";
	contentGui.addChild(texto2);

	texto3 = new createjs.Text("0/5", "bold 40px Arial", "#ff0000");
	texto3.x = 1140;
	texto3.y = 25;
	texto3.textAlign = "center";
	contentGui.addChild(texto3);

	var calculaMirror = 0;
	var mirror = 0;
	for (var i = 0; i < posX.length; i++) {
		hits[i] = bolaTexto(mirror,escalas[i]);
		hits[i].scaleY = hits[i].scaleX = escalas[i];
		hits[i].x = posX[i];
		hits[i].y = posY[i];
		hits[i].id = i;
		hits[i].name=mirror;

		if (_modoEdicao) {
			hits[i].alpha = 0.71;
			hits[i].on("mousedown", function (evt) {
				this.parent.addChild(this);
				var global = content2.localToGlobal(this.x, this.y);
				this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
			});
			hits[i].on("pressmove", function (evt) {
				var local = content2.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
				this.x = local.x;
				this.y = local.y;
			});
			hits[i].on("pressup", function (evt) {
				posX[this.id] = Math.floor(this.x);
				posY[this.id] = Math.floor(this.y);
				var _posX = "[";
				var _posY = "[";
				var i;
				for (i = 0; i < posX.length; i++) {
					_posX += String(posX[i]) + ",";
					_posY += String(posY[i]) + ",";
				}
				_posX = _posX.substring(0, _posX.length - 1);
				_posY = _posY.substring(0, _posY.length - 1);
				_posX += "]";
				_posY += "]";
				console.clear();
				console.log("var posX=" + _posX + ";"+" var posY=" + _posY + ";");
			});
		} else {
			hits[i].alpha = 0.01;
			hits[i].on("mousedown", function (evt) {
				if (inicio1) {
					sons[0].play();
					for (var i = 0; i < posX.length; i++) {
						if (hits[i].name == this.name) {
							hits[i].visible = false;
							popIcon('certo', hits[i].x, hits[i].y, true);
							var circulo = new createjs.Shape();
							circulo.graphics.setStrokeStyle(4).beginStroke("#C0C0C0").drawCircle(hits[i].x, hits[i].y, this.scaleX*80);
							content2.addChild(circulo);
						}
					}
					i_acertos += 1;
					texto2.text = i_acertos +"/"+posX.length/2;
					verificaFim();
				}

			});

		}
		if (calculaMirror == 1) {
			calculaMirror = 0;
			mirror++;
		} else {
			calculaMirror++;
		}
		content.addChild(hits[i]);

	}
	if(_ignoraInicioFim){
		comecaJogo();
	}else{
		if(_btinicar){
			btinicia = new createjs.Bitmap(caminho+_btinicar);
		}else{
			btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
		}

		btinicia.image.onload = function () { };
		stage.addChild(btinicia);
		btinicia.x = 200;
		btinicia.y = -50;
		btinicia.on("click", function () {
			var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            /*
            createjs.Ticker.setFPS(30);
            createjs.Ticker.on("tick", ticker);
            */
            createjs.Tween.get(btinicia).to({ y: -700 }, 350, createjs.Ease.backIn).call(comecaJogo);
        });
	}

	btcontinuar = new createjs.Bitmap(caminho+"tentenovamente.png");
	btcontinuar.image.onload = function () { };
	stage.addChild(btcontinuar);
	btcontinuar.x = 650;
	btcontinuar.y = 400;
	btcontinuar.regX = 160;
	btcontinuar.regY = 200;
	btcontinuar.visible = false;
	btcontinuar.on("click", function () {
        //createjs.Ticker.init();
        telainicio();
    });

	positivo = new createjs.Bitmap(caminho+"positivo.png");
	positivo.image.onload = function () { };
	stage.addChild(positivo);
	positivo.x = 620;
	positivo.y = 360;
	positivo.regX = 160;
	positivo.regY = 210;
	positivo.scaleX = positivo.scaleY = 0.8;
	positivo.visible = false;
	positivo.on("click", function () {
        //createjs.Ticker.init();
        telainicio();
    });


	createjs.Ticker.setFPS(30);
	createjs.Ticker.on("tick", ticker);
	if(isScrolledIntoView($('#'+idCanvas)))
	{
		update=true;
	}

	function popIcon(nome, px, py, apagar) {
		var certo = new createjs.Bitmap(caminho + nome + '.png');
		certo.x = px;
		certo.y = py;
		certo.regX = certo.regY = 160;
		certo.scaleX = certo.scaleY = 0.1;
		if (apagar) {
			createjs.Tween.get(certo).to({ scaleX: 0.3, scaleY: 0.3 }, 350, createjs.Ease.backOut).to({ alpha: 0}, 500, createjs.Ease.backOut).call(apagaIcone);
		} else {
			createjs.Tween.get(certo).to({ scaleX: 0.3, scaleY: 0.3 }, 350, createjs.Ease.backOut);
		}
		content2.addChild(certo);
	}
	function apagaIcone() {
		content2.removeChild(this);
	}
	function verificaFim() {
		if(_ignoraInicioFim){
            //remove ticker
            if (i_acertos >= posX.length/2) {
                //createjs.Ticker._inited = false;
                //createjs.Ticker.reset();
            }

        }else{
        	if (i_acertos >= posX.length/2) {
        		sons[2].play();
        		inicio1 = false;
        		positivo.visible = true;
        		positivo.scaleX = positivo.scaleY = 0.1;
        		createjs.Tween.get(positivo).wait(500).to({ scaleX: 0.8, scaleY: 0.8 }, 350, createjs.Ease.backOut).call(removeTicker);
        	}
        	if (i_erros > 4) {
        		btcontinuar.visible = true;
        		inicio1 = false;
        		btcontinuar.scaleX = btcontinuar.scaleY = 0.1;
        		createjs.Tween.get(btcontinuar).wait(500).to({ scaleX: 1, scaleY: 1 }, 350, createjs.Ease.backOut).call(removeTicker);
        	}
        }
    }
    function removeTicker(){
        //createjs.Ticker._inited = false;
        //createjs.Ticker.reset();

    }
    function telainicio() {
    	createjs.Tween.get(btinicia).to({ y: -50 }, 500, createjs.Ease.backOut);
    	i_acertos = 0;
    	i_erros = 0;
    	if(_ignoraInicioFim){
    		contentGui.visible=false;
    	}else{
    		contentGui.visible=true;
    	}
    	imagemCertoErrado.visible = false;
    	positivo.visible = false;
    	btcontinuar.visible = false;
    	content2.removeAllChildren();
    	texto2.text = '0/'+posX.length/2;
    	texto3.text = '0/5';

    }
    function comecaJogo() {
    	inicio1 = true;
    	startTime = Date.now();
    	if(_ignoraInicioFim){
    		contentGui.visible=false;
    	}else{
    		contentGui.visible=true;
    	}
    	imagemCertoErrado.visible = true;
    	for (var i = 0; i < posX.length; i++) {
    		hits[i].visible = true;
    	}
    }
    function isScrolledIntoView(elem)
    {
    	var docViewTop = $(window).scrollTop();
    	var docViewBottom = docViewTop + $(window).height();
    	var elemTop = $(elem).offset().top;
    	var elemBottom = elemTop + $(elem).height();
    	return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    $(window).scroll(function() {    
    	if(isScrolledIntoView($('#'+idCanvas)))
    	{
    		update=true;
    	} else{
    		update=false;
    	}   
    });
    function ticker() {
    	stage.update();
    	if(update){
    		console.log("foco: "+idCanvas);
    	}
    	if(_ignoraInicioFim){

    	}else{
    		if (inicio1) checkTime();
    	}
    }
    
    function checkTime() {
    	var timeDifference = Date.now() - startTime;
    	var formatted = convertTime(timeDifference);
    	if (timeDifference > 180000) {
    		i_erros = 5;
    		verificaFim();
    	}
    	texto.text = '' + formatted;
    }
    function convertTime(miliseconds) {
    	var totalSeconds = Math.floor(miliseconds / 1000);
    	var minutes = Math.floor(totalSeconds / 60);
    	var seconds = totalSeconds - minutes * 60;
    	if (seconds < 10) seconds = '0' + seconds;
    	return minutes + ':' + seconds;
    }
    function bolaTexto(texto) {
    	var txt = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#ffffff");

    	txt.textAlign = "center";

    	var circulo = new createjs.Shape();
    	circulo.graphics.beginFill("#000000").drawCircle(0, 0, 100);

    	var t = new createjs.Container();
    	t.addChild(circulo);
    	t.addChild(txt);

    	return t;

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

}