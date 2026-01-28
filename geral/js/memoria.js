var stage, firstPosition, secondPosition, content, cartas,
	c_textos, fundo, btreca, btinicia, xTop, xBottom,
	bottomLabel, cardBackImg, clickedPosition, cardClicked,
	remainingPairs, bottomLabel, visibleScale, agua, positivo,
	cardsRevealed	=	[],
	cardBack		=	[],
	position		=	[],
	allRevealed		=	[],
	clickCount		=	0,
	allRevealed		=	[],
	posX			=	[],
	posY			=	[],
	textos			=	[],
	inicio			=	false;

function gameMemoria(idCanvas, cards, width, height, scale) {
	// -- Valores default de parametros opcionais --------------------------------
	visibleScale	=	scale	?	scale	:	1;
	width			=	width	?	width	:	195;
	height			=	height	?	height	:	225;
	// -------------------------------  Valores default de parametros opcionais --
	var	noOfPairs	=	cards.length	/	2;

	stage = new createjs.Stage(document.getElementById(idCanvas));

	stage.enableMouseOver(10);
	content = new createjs.Container();
	cartas = new createjs.Container();
	c_textos = new createjs.Container();
	stage.addChild(content);
	stage.addChild(cartas);
	stage.addChild(c_textos);


	fundo = new createjs.Bitmap('resources/image/memoria_bg.png'); // define background

	fundo.image.onload = function(){};
	content.addChild(fundo);

	createjs.Ticker.setFPS(30);
	createjs.Ticker.on("tick", stage);

	remainingPairs = noOfPairs;

	criaFase(width, height, cards, idCanvas);

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
	agua = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(agua);

	positivo = new createjs.Bitmap("resources/image/positivo.png");
	positivo.image.onload = function(){};
	stage.addChild(positivo);


	positivo.x			=	1085;
	positivo.y			=	$('#' + idCanvas).height() - 500;
	positivo.scaleX		=	positivo.scaleY	=	0.4;
	positivo.visible	=	false;

	btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
	btinicia.image.onload = function(){};
	stage.addChild(btinicia);
	btinicia.x	=	400;
	btinicia.y	=	$('#' + idCanvas).height() - (0.65 * $('#' + idCanvas).height())-80 ;
	btinicia.on("click", function() {
		btinicia.visible=false;
		for (i = 0; i < (noOfPairs * 2); i++) {
			createjs.Tween.get(allRevealed[i]).to({alpha: 1, scaleX:visibleScale}, 150);
			createjs.Tween.get(cardBack[i]).to({alpha: 0, scaleX:0}, 150);
		}
		createjs.Tween.get(btinicia).to({alpha: 1}, 3000).call(podeiniciar);
	});

	btreca = new createjs.Bitmap("resources/image/recarregar.png");
	btreca.image.onload = function(){};
	stage.addChild(btreca);
	btreca.scaleX = btreca.scaleY = 0.4;
	btreca.x	=	1060;
	btreca.y	=	$('#' + idCanvas).height() - 140;
	btreca.visible=false;
	btreca.on("click", function() {
		btreca.visible=false;
		positivo.visible=false;
		cardsRevealedA.length=0;
		cartas.removeAllChildren();
		criaFase(width, height, cards, idCanvas);
		remainingPairs = noOfPairs;
		clickCount = 0;
	});
}

function podeiniciar(){
	inicio=true;
	for (i = 0; i < (remainingPairs * 2); i++) {
		createjs.Tween.get(allRevealed[i]).to({alpha: 0, scaleX:0}, 150);
		createjs.Tween.get(cardBack[i]).to({alpha: 1, scaleX:visibleScale}, 150);
	}

}
function criaFase(width, height, cards, idCanvas, cardMargin){
	var canvasWidth		=	1280;
		pairs			=	cards.length	/	2;
		si				=	0;
		cardMargin		=	cardMargin	?	cardMargin	:	10;

	width	=	width	+	cardMargin;
	height	=	height	+	cardMargin;

	var	maxCardsPerRow	=	Math.floor(canvasWidth	/	width),
		cardColumns		=	Math.ceil((pairs	*	2)	/	maxCardsPerRow),
		canvasMargin	=	(canvasWidth	%	width)	/	2;

	$('#' + idCanvas).attr('height', ((height * cardColumns) + 60));
    
    console.log(  );

	for (i = 0; i < cardColumns; i++) {
		for (j = 0 ; j < maxCardsPerRow; j++) {
			posX[si]	=	15 + ((canvasWidth - (maxCardsPerRow * width)) / 2) + (width / 2) + (j * width);
			posY[si]	=	30 + (height / 2) + (i * height);

			si++;
	   }
	}

	for (i = 0; i < (pairs * 2); i++) {
		cardBack[i] = new createjs.Bitmap('resources/image/memoria_card-back.png');

		cardBack[i].x = posX[i];
		cardBack[i].y = posY[i];

		cardBack[i].scaleX = cardBack[i].scaleY = visibleScale;

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
	for (i = 0; i < pairs * 2; i++) {
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
		allRevealed[i].scaleY = visibleScale;
		allRevealed[i].regY = width / 2;
		allRevealed[i].regX = height / 2;
		allRevealed[i].alpha = 0;
		cartas.addChild(allRevealed[i]);

		cardBack[i].regX = height / 2;
		cardBack[i].regY = width  / 2;
	}


    function animateCards() {
        createjs.Tween.get(cardBack[clickedPosition]).to({scaleX:0}, 150);
        createjs.Tween.get(allRevealed[clickedPosition]).wait(150).to({alpha: 1, scaleX:visibleScale}, 150); 
        cardClicked = allRevealed[clickedPosition]; 
        checkCards(); 
    }

	function checkCards() {
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

				if (remainingPairs == 0) {
					positivo.visible=true;
					btreca.visible=true;
					som2();
				} else {
					acerto();
				}
				clickCount = 0;
			}else if (isOdd(firstClick) && firstClick == secondClick+1) {
				remainingPairs--;

				if (remainingPairs == 0) {
					positivo.visible=true;
					btreca.visible=true;
					som2();
				} else {
					acerto();
				}
				clickCount = 0;
			} else {
                inicio=false;
				som1();
                clickCount = 0;
                createjs.Tween.get(btinicia).to({alpha: 1}, 1000).call(voltacarta);	
			};

		} 
	}
}
function voltacarta(){
                              
    createjs.Tween.get(allRevealed[firstPosition]).to({alpha: 0, scaleX:0}, 150); 
    createjs.Tween.get(allRevealed[secondPosition]).to({alpha: 0, scaleX:0}, 150); 
    createjs.Tween.get(cardBack[firstPosition]).wait(150).to({scaleX:visibleScale}, 150);  
    createjs.Tween.get(cardBack[secondPosition]).wait(150).to({scaleX:visibleScale}, 150);
    inicio=true; 

}
function acerto(){
	agua.gotoAndPlay("fumaca1");
	agua.x = posX[clickedPosition];
	agua.y = posY[clickedPosition]+50;
	var t=allRevealed[clickedPosition].name+1;
	console.log(t);
	som0();
}
function isOdd(num) {
	return (num % 2) == 1;
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
