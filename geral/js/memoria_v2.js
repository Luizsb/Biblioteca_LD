/*
modelo de jogo de memória com tempo, som melhorado, cartas voltam depois de errar...

*/
var canvas;
var stage;
var contentgui;
var bottomLabel;
var cardsRevealed = [];
var cardBack = [];
var position = [];
var allRevealed = [];
var clickedPosition;
var cardClicked;
var clickCount = 0;
var firstPosition;
var secondPosition;
var content;
var cartas;
var btinicia;
var remainingPairs;
var bottomLabel;
var allRevealed=[];
var posX=[];
var posY=[];
var textos=[];
var fumacinha;
var relogio;
var relogio_c;
var rastro;
var positivo;
var inicio=false;
var tipotween=createjs.Ease.backOut;
var i_acertos=0;
var texto_certo;
var i_erros=0;
var texto_errado;
var update=false;
var meme;
var cards=[];
var caminho="resources/image/";
var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "whoosh.mp3"]; 
function gameMemoria2(idCanvas,imgcartas) {
    var index;
    for (index in sons) {
        var t = sons[index];
        sons[index] = new Audio(caminho + t);
    }
    cards=imgcartas;
    stage = new createjs.Stage(document.getElementById(idCanvas));
    stage.enableMouseOver(10);
	createjs.Touch.enable(stage);
	stage.mouseMoveOutside = true;
	content = new createjs.Container();
	contentgui = new createjs.Container();
	cartas = new createjs.Container();
	relogio_c = new createjs.Container();
	criaFundo(0,0,1280,720);
	
	stage.addChild(content);
	stage.addChild(cartas);
	
	
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker);

    remainingPairs = cards.length/2;

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
	var spriteRelogio = new createjs.SpriteSheet({
		framerate: 20,
			"images": [caminho+"hourglasses2.png"],
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
	stage.addChild(relogio_c);
	relogio = new createjs.Sprite(spriteRelogio, "idle");
	relogio_c.addChild(relogio);
	relogio_c.x=-400;
	relogio_c.y=320;
	relogio.gotoAndPlay("tempo1");
	relogio_c.visible=false;
	
	rastro = new createjs.Sprite(spriteRastro, "idle");
	relogio_c.addChild(rastro);
	rastro.gotoAndPlay("fumaca1");
	rastro.x=-80;
	rastro.y=330;
	
	positivo = new createjs.Bitmap(caminho+"positivo.png");
	positivo.image.onload = function(){};
    stage.addChild(positivo);
	positivo.x=1085;
	positivo.y=460;
	positivo.scaleX=positivo.scaleY=0.4;
	positivo.visible=false;
	
	btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
	btinicia.image.onload = function(){};
    stage.addChild(btinicia);
    
    meme = new createjs.Bitmap(caminho+"meme.png");
	meme.image.onload = function(){};
    stage.addChild(meme);
    meme.x=100;
    meme.y=900;

	btinicia.on("click", function() {
        btinicia.visible=false;
		relogio.gotoAndPlay("tempo1");
		relogio_c.visible=true;
		relogio_c.x=-400;
		createjs.Tween.get(relogio_c).to({x:1000}, tempoCartasAbertas).call(someRelogio);
		createjs.Tween.get(this).wait(tempoCartasAbertas).call(podeiniciar);
		for (i = 0; i < cards.length; i++) {
		    createjs.Tween.get(allRevealed[i]).wait(i*15).to({alpha: 1, scaleX:escala}, 150);
			createjs.Tween.get(cardBack[i]).wait(i*15).to({alpha: 0, scaleX:0}, 150);
		}
		
		
    });
	stage.addChild(contentgui);
	gui = new createjs.Bitmap(caminho+"gui.png");
	gui.image.onload = function(){};
    contentgui.addChild(gui);
	gui.on("click", function() {
		createjs.Tween.get(contentgui).to({x: 1300}, 600,tipotween);
		i_erros=0;
		texto_errado.text=0;
		cardsRevealedA.length=0;
		cartas.removeAllChildren();
		criaFase();
		remainingPairs = cards.length/2;
		clickCount = 0;

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
	
	
	contentgui.x=-800;
	contentgui.y=160;
	
}
function someRelogio(){
    relogio_c.visible=false;
    fumacinha.gotoAndPlay("fumaca1");	
    fumacinha.x = relogio_c.x;
	fumacinha.y = relogio_c.y+80;
}
function podeiniciar(){
    sons[3].play();
    createjs.Tween.get(meme).to({y: 410}, 600,createjs.Ease.backOut).wait(1000).to({y: 900}, 600,createjs.Ease.backOut);
	update=true;
	startTime = Date.now();
    inicio=true;
	for (i = 0; i < cards.length; i++) {
		createjs.Tween.get(allRevealed[i]).wait(i*15).to({alpha: 0, scaleX:0}, 150); 
		createjs.Tween.get(cardBack[i]).wait(i*15).to({alpha: 1, scaleX:escala}, 150); 
    }

}
function criaFase(){
    var si=0;
	var margem=0;
    for (i=0; i <linhas; i++) {
        for (j=0; j < colunas; j++) {
            if(si<cards.length){
                posX[si]=j*((larguraImg*escala)/1+espacamento)+margemX;
                posY[si]=i*((alturaImg*escala)/1+espacamento)+margemY;
                si++;
                
            }
            
       }
    }
    for (i = 0; i < cards.length; i++) {
        cardBack[i] = new createjs.Bitmap(caminho+"ctras.png");
		cardBack[i].x = posX[i];
        cardBack[i].y = posY[i];
        cardBack[i].scaleX = cardBack[i].scaleY = escala;
        cardBack[i].identity = i;
        cardBack[i].on("click", function() {
		    if(inicio){
		        clickedPosition = this.identity; 
                animateCards(); 
		    }
        });
        position[i] = new Array();
        position[i].xpos = cardBack[i].x;
        position[i].ypos = cardBack[i].y;
        cartas.addChild(cardBack[i]); 
    }
    cardsRevealedA = new Array();
    for (i = 0; i < cards.length; i++) {
        cardsRevealedA[i] = new createjs.Bitmap(cards[i]);
        cardsRevealedA[i].name = i;
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
        allRevealed[i].scaleY = escala;
        allRevealed[i].regX = larguraImg  / 2;
        allRevealed[i].regY = alturaImg / 2;
        allRevealed[i].alpha = 0; 
        cartas.addChild(allRevealed[i]); 
        cardBack[i].regX = larguraImg  / 2;
        cardBack[i].regY = alturaImg / 2;
        
    }


    function animateCards() {
        createjs.Tween.get(cardBack[clickedPosition]).to({scaleX:0}, 150);
        createjs.Tween.get(allRevealed[clickedPosition]).wait(150).to({alpha: 1, scaleX:escala}, 150); 
        cardClicked = allRevealed[clickedPosition]; 
        checkCards(); 
    }

    function checkCards() {
         console.log(remainingPairs);
        if (clickCount == 0) {                           
            firstPosition = clickedPosition;             
            firstClick = cardClicked.name;               
            clickCount++;			

        } else if (clickCount == 1) {                   
            secondPosition = clickedPosition;           
            secondClick = cardClicked.name;             
            clickCount++;                               
            if (isOdd(secondClick) && firstClick == secondClick-1) {
                remainingPairs--;
                acerto();
                if (remainingPairs == 0) {
                    acerto();
					createjs.Tween.get(btinicia).wait(1000).call(memoriaFim);
                }
                clickCount = 0; 
			}else if (isOdd(firstClick) && firstClick == secondClick+1) {
                remainingPairs--;
                acerto();
                if (remainingPairs == 0) {              
					createjs.Tween.get(btinicia).wait(1000).call(memoriaFim);
                }
                clickCount = 0; 
            } else {
                inicio=false;
				i_erros++;
				texto_errado.text=i_erros;
                sons[1].play();
				clickCount = 0;
                createjs.Tween.get(btinicia).to({alpha: 1}, 1000).call(voltacarta);							
            };

        }
    }

}
function memoriaFim(){
    createjs.Tween.get(contentgui).to({x: 300}, 1000,tipotween);
    update=false;
    sons[2].play();
    
}
function voltacarta(){
    inicio=true;                           
    createjs.Tween.get(allRevealed[firstPosition]).to({alpha: 0, scaleX:0}, 150); 
    createjs.Tween.get(allRevealed[secondPosition]).to({alpha: 0, scaleX:0}, 150); 
    createjs.Tween.get(cardBack[firstPosition]).wait(150).to({scaleX:escala}, 150);  
    createjs.Tween.get(cardBack[secondPosition]).wait(150).to({scaleX:escala}, 150);

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
	
	var fundo = new createjs.Bitmap(caminho+"fundo_od1.png");
	fundo.image.onload = function(){};
    stage.addChild(fundo);
}
function isOdd(num) {
    return (num % 2) == 1;
} 
function ticker(event){
	stage.update();
	if(update){
        checkTime();
    }
}
function checkTime(){
    var timeDifference = Date.now() - startTime;
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