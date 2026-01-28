/*
21/12/2018
-quando mais de um jogo no mesmo modulo nao contava o tempo

-mostra dias das cartas novamente apos recomecar
-modelo de jogo de memória com tempo, som melhorado, cartas voltam depois de errar...

*/

var AppJogoMemoria=function(idCanvas,imgcartas,_fundo,_btiniciar,_parametros,_titulosFases,_enunciado,_cartaTraseira,_imgGui,_audios){
	"use strict";
	var canvas,
	stage,
	contentgui,
	bottomLabel,
	cardsRevealed = [],
	cardsRevealedA=[],
	cardBack = [],
	position = [],
	allRevealed = [],
	clickedPosition,
	cardClicked,
	clickCount = 0,
	cartasNecessarias,
	abertasTemp=[],
	clicadas=[],
	firstPosition,
	secondPosition,
	content,
	cartas,
	btinicia,
	remainingPairs,
	bottomLabel,
	allRevealed=[],
	posX=[],
	posY=[],
	textos=[],
	fumacinha,
	relogio,
	relogio_c,
	rastro,
	positivo,
	inicio=false,
	tipotween=createjs.Ease.backOut,
	i_acertos=0,
	texto_certo,
	i_erros=0,
	texto_errado,
	texto_tempo,
	startTime,
	update=false,
	meme,
	spriteRelogio,
	spriteRelogio2,
	fase=0,
	cards=[],
	caminho="resources/image/",
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "whoosh.mp3"], 
	index;
	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}



	stage = new createjs.Stage(document.getElementById(idCanvas));
	stage.enableMouseOver(10);
	createjs.Touch.enable(stage);
	stage.mouseMoveOutside = true;
	content = new createjs.Container();
	contentgui = new createjs.Container();
	cartas = new createjs.Container();
	
	criaFundo(0,0,1280,720);
	
	stage.addChild(content);
	stage.addChild(cartas);
	
	

	criaFase();
	var spriteRastro = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"rastro.png"],
		"frames": {"regX": 0, "height": 113, "count": 6, "regY": 0, "width": 180},
		"animations": {
			"idle": 0,
			"fumaca1": [0, 5, "fumaca1",0.5]
		}
	});
	spriteRelogio = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"hourglasses2.png"],
		frames: [[5,5,354,400,0,0,0],[364,5,354,400,0,0,0],[723,5,354,400,0,0,0],[1082,5,354,400,0,0,0],[1441,5,354,400,0,0,0],[5,410,354,400,0,0,0],[364,410,354,400,0,0,0],[723,410,354,400,0,0,0],[1082,410,354,400,0,0,0],[1441,410,354,400,0,0,0],[5,815,354,400,0,0,0],[364,815,354,400,0,0,0]],
		"animations": {
			"idle": 0,
			"idle2": 11,
			"tempo1": [0, 11, "tempo1",1]
		}
	});	
	spriteRelogio2 = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"hourglasses_d.png"],
		frames: [[5,5,354,400,0,0,0],[364,5,354,400,0,0,0],[723,5,354,400,0,0,0],[1082,5,354,400,0,0,0],[1441,5,354,400,0,0,0],[5,410,354,400,0,0,0],[364,410,354,400,0,0,0],[723,410,354,400,0,0,0],[1082,410,354,400,0,0,0],[1441,410,354,400,0,0,0],[5,815,354,400,0,0,0],[364,815,354,400,0,0,0]],
		"animations": {
			"idle": 0,
			"idle2": 11,
			"tempo1": [0, 11, "tempo1",1]
		}
	});
	
	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"fumaca.png"],
		"frames": {"regX": 0, "height": 200, "count": 20, "regY": 0, "width": 200},
		"animations": {
			"idle": 20,
			"fumaca1": [0, 9, "idle"],
			"fumaca2": [10, 19, "idle"]
		}
	});
	fumacinha = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(fumacinha);
	

	
	
	positivo = new createjs.Bitmap(caminho+"positivo.png");
	positivo.image.onload = function(){};
	stage.addChild(positivo);
	positivo.x=1085;
	positivo.y=460;
	positivo.scaleX=positivo.scaleY=0.4;
	positivo.visible=false;
	
	btinicia = new createjs.Bitmap(caminho+_btiniciar);
	btinicia.image.onload = function(){};
	stage.addChild(btinicia);

	meme = new createjs.Bitmap(caminho+"meme.png");
	meme.image.onload = function(){};
	stage.addChild(meme);
	meme.x=100;
	meme.y=900;

	btinicia.on("click", function() {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		btinicia.visible=false;
		if(stage.mouseX>1200 && stage.mouseY>700){
			iniciaTimerCartas('duds');
		}else{
			iniciaTimerCartas(null);
		}

		animaTitulo(_titulosFases[fase]);
		startTime = Date.now();
		if(typeof _enunciado !== 'undefined'){
			var enun=new Audio(caminho+_enunciado);
			enun.play();

		}
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", ticker_memoria);
		
	});
	var gui;
	if(_imgGui){
		gui = new createjs.Bitmap(caminho+_imgGui);
	}else{
		gui = new createjs.Bitmap(caminho+"gui.png");
	}

	stage.addChild(contentgui);
	
	gui.image.onload = function(){};
	contentgui.addChild(gui);
	gui.on("click", function() {
		createjs.Tween.get(contentgui).to({x: 1300}, 600,tipotween);
		i_erros=0;
		fase=0;
		texto_errado.text=0;
		cardsRevealedA.length=0;
		cartas.removeAllChildren();
		criaFase();
		setTimeout(iniciaTimerCartas,100);
		startTime = Date.now();


	});
	
	
	texto_tempo = new createjs.Text("0:00", "bold 40px VAG Rounded BT", "#000000");
	texto_tempo.x=295;
	texto_tempo.y=140;
	texto_tempo.textAlign = "center";
	contentgui.addChild(texto_tempo);
	
	texto_errado = new createjs.Text("0", "bold 40px VAG Rounded BT", "#000000");
	texto_errado.x=295;
	texto_errado.y=210;
	texto_errado.textAlign = "center";
	contentgui.addChild(texto_errado);
	
	
	contentgui.x=-1600;
	contentgui.y=160;

	stage.update();
	setTimeout(function () { stage.update(); }, 1000);
	setTimeout(function () { stage.update(); }, 2000);

	function iniciaTimerCartas(opcao){
		rastro = new createjs.Sprite(spriteRastro, "idle");
		relogio_c = new createjs.Container();
		stage.addChild(relogio_c);
		relogio_c.addChild(rastro);
		rastro.gotoAndPlay("fumaca1");
		rastro.x=-80;
		rastro.y=330;
		if(opcao=='duds'){
			relogio = new createjs.Sprite(spriteRelogio2, "idle");
		}else{
			relogio = new createjs.Sprite(spriteRelogio, "idle");
		}

		relogio_c.addChild(relogio);
		relogio_c.x=-400;
		relogio_c.y=stage.canvas.height-400;
		relogio.gotoAndPlay("tempo1");
		relogio_c.visible=true;
		relogio_c.x=-400;
		createjs.Tween.get(relogio_c).to({x:1000}, _parametros[0][fase]).call(someRelogio);
		createjs.Tween.get(this).wait(_parametros[0][fase]).call(podeiniciar);
		for (i = 0; i < cards.length; i++) {
			createjs.Tween.get(allRevealed[i]).wait(i*15).to({alpha: 1, scaleX:_parametros[5]}, 150);
			createjs.Tween.get(cardBack[i]).wait(i*15).to({alpha: 0, scaleX:0}, 150);
		}
	}
	function someRelogio(){
		relogio_c.visible=false;
		stage.removeChild(relogio_c);

		fumacinha.gotoAndPlay("fumaca1");	
		fumacinha.x = relogio_c.x;
		fumacinha.y = relogio_c.y+80;
		relogio_c=null;
	}
	function podeiniciar(){
		sons[3].play();
		createjs.Tween.get(meme).to({y: 410}, 600,createjs.Ease.backOut).wait(1000).to({y: 900}, 600,createjs.Ease.backOut);
		update=true;

		inicio=true;
		for (i = 0; i < cards.length; i++) {
			createjs.Tween.get(allRevealed[i]).wait(i*15).to({alpha: 0, scaleX:0}, 150); 
			createjs.Tween.get(cardBack[i]).wait(i*15).to({alpha: 1, scaleX:_parametros[5]}, 150); 
		}

	}
	function animaTitulo(texto){
		var tit = new createjs.Container();
		cartas.addChild(tit);

		var txt = new createjs.Text(texto, "bold 30px VAG Rounded BT", "#ffffff");
		txt.regY=60;
		txt.textAlign = "center";
		txt.lineWidth = 1100;

		var contorno = new createjs.Text(texto, "bold 30px VAG Rounded BT", "#000000");
		contorno.regY=60;
		contorno.textAlign = "center";
		contorno.lineWidth = 1100;
		contorno.outline = 7;


		tit.addChild(contorno);
		tit.addChild(txt);

		tit.x=-300;
		tit.y=80;
		createjs.Tween.get(tit).to({x:640},300,createjs.Ease.backOut).wait(_parametros[0][fase]);
	}  
	function apagaTitulo(){
		cartas.removeChild(this);
	}
	function criaFase(){
		if(_parametros[9]!=null){
			cartasNecessarias=_parametros[9][fase];
		}else{
			cartasNecessarias=2;
		}
		clickCount = 0;
		cards=imgcartas[fase];
		remainingPairs = cards.length/cartasNecessarias;

		var si=0;
		var margem=0;
		for (i=0; i <_parametros[1]; i++) {
			for (j=0; j < _parametros[2]; j++) {
				if(si<cards.length){
					posX[si]=j*((_parametros[3]*_parametros[5])/1+_parametros[6])+_parametros[7][fase];
					posY[si]=i*((_parametros[4]*_parametros[5])/1+_parametros[6])+_parametros[8][fase];
					si++;

				}

			}
		}
		for (i = 0; i < cards.length; i++) {
			if(typeof _cartaTraseira !== 'undefined'){
				cardBack[i] = new createjs.Bitmap(caminho+_cartaTraseira);

			}else{
				cardBack[i] = new createjs.Bitmap(caminho+"ctras.png");
			}

			cardBack[i].x = posX[i];
			cardBack[i].y = posY[i];
			cardBack[i].scaleX = cardBack[i].scaleY = _parametros[5];
			cardBack[i].identity = i;
			cardBack[i].on("click", function() {
				if(inicio){
					clickedPosition = this.identity; 
					console.log("Estou aqui " + this.identity);
					animateCards(); 
				}
			});
			position[i] = new Array();
			position[i].xpos = cardBack[i].x;
			position[i].ypos = cardBack[i].y;
			cartas.addChild(cardBack[i]); 
		}
		var j=0;
		var w=0;
		cardsRevealedA = new Array();
		for (i = 0; i < cards.length; i++) {
			cardsRevealedA[i] = new createjs.Bitmap(cards[i]);
			cardsRevealedA[i].name = i;

			if(j>cartasNecessarias-1){
				j=0;
				w++;
			}
			cardsRevealedA[i].par = w;
			var txt = new createjs.Text(w, "bold 60px VAG Rounded BT", "#0000");
			txt.x=posX[i];
			txt.y=posY[i];



			j++;
		}
		allRevealed = cardsRevealedA; 
		var n = allRevealed.length;
		var tempArray = [];
		var i;
		for (i = 0; i < n - 1; i++) {
			tempArray.push(allRevealed.splice(Math.floor(Math.random() * allRevealed.length), 1)[0]);
		}
		tempArray.push(allRevealed[0]);
		allRevealed = tempArray;
		for (i = 0; i < allRevealed.length; i++) {

			allRevealed[i].x = position[i].xpos;
			allRevealed[i].y = position[i].ypos;

			allRevealed[i].scaleX = 0;
			allRevealed[i].scaleY = _parametros[5];
			allRevealed[i].regX = _parametros[3]  / 2;
			allRevealed[i].regY = _parametros[4] / 2;
			allRevealed[i].alpha = 0; 
			cartas.addChild(allRevealed[i]); 
			cardBack[i].regX = _parametros[3]  / 2;
			cardBack[i].regY = _parametros[4] / 2;

		}


		function animateCards() {
			createjs.Tween.get(cardBack[clickedPosition]).to({scaleX:0}, 150);
			createjs.Tween.get(allRevealed[clickedPosition]).wait(150).to({alpha: 1, scaleX:_parametros[5]}, 150); 
			cardClicked = allRevealed[clickedPosition]; 
			var posicaoCarta = allRevealed[clickedPosition].name;
			if (_audios){
				console.log(_audios[fase][posicaoCarta]);
				if(_audios[fase][posicaoCarta]){
					var audio = new Audio(_audios[fase][posicaoCarta]);
					audio.play();
				};
			}
			checkCards(); 
		}

		function checkCards() {
			clickCount++;
			abertasTemp.push(cardClicked.par);

			clicadas.push(clickedPosition);
			if(clickCount==cartasNecessarias){

				if(checaIgualdade(abertasTemp)){
					remainingPairs--;
					acerto();
					clickCount = 0;
					abertasTemp=[];
					clicadas=[];
					if (remainingPairs == 0) {              
						setTimeout(memoriaFim, 1000);
					}
				} else {
					inicio=false;
					i_erros++;
					texto_errado.text=i_erros;
					sons[1].play();
					clickCount = 0;
					abertasTemp=[];
					setTimeout(voltacarta, 1000);


				};

			}
		}

	}
	function checaIgualdade(conjunto){
		var i;
		for(i = 1; i < conjunto.length; i++)
		{
			if(conjunto[i] !== conjunto[0])
				return false;
		}

		return true;
	}
	function memoriaFim(){
		if(imgcartas.length>1 && fase<imgcartas.length-1){
			fase++;
			texto_errado.text=0;
			cardsRevealedA.length=0;
			cartas.removeAllChildren();
			criaFase();
			iniciaTimerCartas(null);
			animaTitulo(_titulosFases[fase]);
		}else{
			createjs.Tween.get(contentgui).to({x: 300}, 1000,tipotween);
			update=false;
			sons[2].play();
		}

	}
	function voltacarta(){
		inicio=true;
		var index;
		for(index in clicadas){
			createjs.Tween.get(allRevealed[clicadas[index]]).to({alpha: 0, scaleX:0}, 150);   
			createjs.Tween.get(cardBack[clicadas[index]]).wait(150).to({scaleX:_parametros[5]}, 150);
		}



		clicadas=[];

	}
	function acerto(){
		fumacinha.gotoAndPlay("fumaca1");	
		fumacinha.x = posX[clickedPosition]-100;
		fumacinha.y = posY[clickedPosition]-80;
		var t=allRevealed[clickedPosition].name+1;
		sons[0].play();
	}
	function criaFundo(px,py,tamX,tamY){
		var shape = new createjs.Shape();
		shape.graphics.beginLinearGradientFill(["#343434", "#4f4f50"], [0, 1], 0, 0, 0, tamY);
		shape.graphics.drawRoundRect(0,0,tamX,tamY,0);
		shape.graphics.endFill();
		stage.addChild(shape);

		var fundo = new createjs.Bitmap(caminho+_fundo);
		fundo.image.onload = function(){};
		stage.addChild(fundo);
	}

	function ticker_memoria(event){
		stage.update();
		if(update){
			checkTime();
		}
	}
	function checkTime(){
		var timeDifference = Date.now() - startTime-_parametros[0][0];
		var formatted = convertTime(timeDifference);
		texto_tempo.text = '' + formatted;
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
}