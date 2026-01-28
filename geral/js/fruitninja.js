var canvas;
var stage;
var content;
var contenthit;
var fundo;
var agua;
var positivo;
var inicio1=false;
var btinicia;
var respostas=[5,1,1,1,1,1,1,1,1,1];
var moscas=[];
var posX=[160,390,597,700];
var palavras=[];
var word_count=0;
var hits=[];
var edgeOffset = 10;
var count=0;
var si=0;
var spsapos;
var spmosca1;
var spmosca2;
var spmao;
var countTempo=0;
var btcontinuar;
var label;
var score=0;
var intervalo=120;
var velocidade=1500;
var tempoEspera=2000;
var erro=0;
var nuvem1;
var nuvem2;
var nuvem3;
var nuvem4;
var update=true;
var tQuestoes;
var tScoreNeeded;
var fase = 0;
var totalScore = 0;
var totalScoreNeeded = 0;
var enunciado;
var faseAnterior = -1;

function gameFruitNinja(canvasID, questoes) {
	var scoreNeeded = [];
	shuffle(questoes);
    var i,j;

	for(i = 0; i < questoes.length; i++){
		shuffle(questoes[i].alts);
		
		scoreNeeded.push(0);

		for(j = 0; j < questoes[i].alts.length; j++){
			if (questoes[i].alts[j][1]) {
				scoreNeeded[i]++;
			}
		}
	}

	totalScoreNeeded = scoreNeeded.reduce(function(previousValue, currentValue) {
	  return previousValue + currentValue;
	});

	tQuestoes = questoes;
	tScoreNeeded = scoreNeeded;

    canvas = document.getElementById(canvasID);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
	contenthit = new createjs.Container();
	content = new createjs.Container();
	
	fundo = new createjs.Bitmap("resources/image/fundo_od1.png");
	fundo.image.onload = function(){};
    stage.addChild(fundo);
	
	
	stage.addChild(content);
	stage.addChild(contenthit);
	
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
	positivo.x=430;
	positivo.y=100;
	positivo.visible=false;
	
	nuvem1 = new createjs.Bitmap("resources/image/nuvem1.png");
	nuvem1.image.onload = function(){};
    content.addChild(nuvem1);
	nuvem1.x=0;
	nuvem1.y=0;
	
	nuvem2 = new createjs.Bitmap("resources/image/nuvem1.png");
	nuvem2.image.onload = function(){};
    content.addChild(nuvem2);
	nuvem2.x=0;
	nuvem2.y=-645;
	
	nuvem3 = new createjs.Bitmap("resources/image/n1.png");
	nuvem3.image.onload = function(){};
    stage.addChild(nuvem3);
	nuvem3.x=50;
	nuvem3.y=0;
	nuvem4 = new createjs.Bitmap("resources/image/n2.png");
	nuvem4.image.onload = function(){};
    stage.addChild(nuvem4);
	nuvem4.x=600;
	nuvem4.y=-500;
	
	btcontinuar = new createjs.Bitmap("resources/image/continuar.png");
	btcontinuar.image.onload = function(){};
    stage.addChild(btcontinuar);
	btcontinuar.x=750;
	btcontinuar.y=550;
	btcontinuar.alpha=0.8;
	btcontinuar.visible=false;
	btcontinuar.on("click", function() {
	    btcontinuar.visible=false;
		inicio1=true;
		clicavel=true;
	});
	
	btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
	btinicia.image.onload = function(){};
    content.addChild(btinicia);
	btinicia.x=400;
	btinicia.y=255;
	btinicia.on("click", function() {
        btinicia.visible=false;
		inicio1=true;
		clicavel=true;
        countTempo=0;
		score=0;
        erro=0;
		word_count=0; 
		nasceMosca(questoes, scoreNeeded);
		count+=1;
    });
	var pause1 = new createjs.Bitmap("resources/image/pause1.png");
	pause1.image.onload = function(){};
    stage.addChild(pause1);
	pause1.x=1170;
	pause1.y=620;
	pause1.on("click", function() {
        pause2.visible=true;
		update=true;
    });
	var pause2 = new createjs.Bitmap("resources/image/pause2.png");
	pause2.image.onload = function(){};
    stage.addChild(pause2);
	pause2.x=1170;
	pause2.y=620;
	pause2.on("click", function() {
        this.visible=false;
		update=false;
    });
	pause1.visible=false;
	pause2.visible=false;
    	
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

function Fim(questoes, scoreNeeded){
    var img;
    var bo;
	var continua=false;
	contenthit.removeAllChildren();
clicavel=false;
	if (erro > 3) {
		som3();
		img="resources/image/tentenovamente.png";
		continua=true;
	} else {
		if (count > questoes[fase].alts.length - 1) {
			count = 0;
		}

		fase++;
		totalScore += score;
        clicavel=true;

		if (fase < questoes.length) {
			score = 0;
			erro = 0;
			console.log('caiu no if');
			nasceMosca(questoes, scoreNeeded);
		} else {
			console.log('totalScore: ' + totalScore);
			console.log('totalScoreNeeded: ' + totalScoreNeeded);
			if(totalScore >= totalScoreNeeded ){
				som2();
			    img="resources/image/positivo.png";
				continua=true;
			}else{
				som3();
				img="resources/image/tentenovamente.png";
				continua=true;
			}
		}
	}


	
	if(continua){
	    bo = new createjs.Bitmap(img);
	    bo.image.onload = function(){};
	    bo.regX=165;
		bo.regY=280;
	    bo.x=640;
	    bo.y=1000;
	    stage.addChild(bo);
		createjs.Tween.get(bo).to({y:350},1000,createjs.Ease.backOut);
	    bo.on("mousedown", function (evt) {
		    stage.removeChild(this);
		    inicio1=true;
		    clicavel=true;
			countTempo=0;
			score=0;
			erro=0;
			fase = 0;
			word_count=0; 
			count=0;
			nasceMosca(questoes, scoreNeeded);
			count+=1;
        });
	
	
	}
    
}
function ticker(event){
    if(update){
	    stage.update();
	    if(inicio1){
	        if(nuvem1.y>720){
                nuvem1.y=-645;
            }else{
                nuvem1.y+=1;
            }
            if(nuvem2.y>720){
                nuvem2.y=-645;
            }else{
                nuvem2.y+=1;
            }
            if(nuvem3.y>720){
                nuvem3.y=-645;
            }else{
                nuvem3.y+=30;
            }
            if(nuvem4.y>720){
                nuvem4.y=-645;
            }else{
                nuvem4.y+=30;
            }
        }
	    countTempo++;
        if(countTempo>=intervalo && inicio1){
            nasceMosca(tQuestoes, tScoreNeeded);
            countTempo=0;
            count+=1;
            if(count > tQuestoes[fase].alts.length - 1){
                count = 0;
            }
        
	    }
	}
}
function nasceMosca(questoes, scoreNeeded){
	var mos = new createjs.Container(),
		mosCont;

    if(questoes[fase].alts[count][2] == 'img'){
        mosCont = new createjs.Bitmap(questoes[fase].alts[count][0]);
    } else if (questoes[fase].alts[count][2] == 'txt') {
		mosCont = criaTexto(questoes[fase].alts[count][0]);
    }

	if (faseAnterior !== fase) {
		stage.removeChild(enunciado);
		enunciado = criaTexto(questoes[fase].q, 25, 20, 1000);
		stage.addChild(enunciado);
		faseAnterior = fase;
	}

	mos.addChild(mosCont);

	mos.isAnswer = questoes[fase].alts[count][1];

    contenthit.addChild(mos);
	mos.regX=mos.regY=316/2;
	var t=Math.round(Math.random()*3);

	mos.x = posX[t];
	mos.y = -320;

	mos.on("mousedown", function (evt) {
        if(clicavel){
		if(this.isAnswer){
		    agua.x=stage.mouseX;
		    agua.y=stage.mouseY;
		    agua.gotoAndPlay("fumaca1");
			contenthit.removeChild(this);
			animaIco("certo",this.x,this.y,stage,true);
		    som0();
			score+=1;
			if (score >= scoreNeeded[fase]) {
				Fim(questoes, scoreNeeded);
                console.log("fim");
			}
		} else {
		    animaIco("errado",0,0,mos,false);
			som1();
			erro++;
			if(erro>3){
				Fim(questoes, scoreNeeded);
			}
		}
        }
	});
	createjs.Tween.get(mos).to({y:400},velocidade,createjs.Ease.quadOut).wait(tempoEspera).to({y:850},velocidade,createjs.Ease.quadIn).call(sapoengole); 
 
}
function animaIco(qual,b,c,qual_c,apagar){
    var ico;
    ico = new createjs.Bitmap("resources/image/"+qual+".png");
    
    ico.x = b;
    ico.y = c;
    ico.regX=155;
    ico.regY=155;
    ico.scaleX=ico.scaleY=0.1;
    if(apagar){
        stage.addChild(ico);
        createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut).wait(600).call(apagaicone);
        
    }else{
        qual_c.addChild(ico);
        createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut);
    }
    
    
}
function apagaicone(e){
    stage.removeChild(this);
}
function sapoengole(e){
    contenthit.removeChild(this);
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
function som3(){
    document.getElementsByTagName('audio')[3].play();
}

function criaTexto(texto, x, y, lineWidth){
	lineWidth		=	lineWidth	?	lineWidth	:	500;
	x				=	x			?	x			:	0;
	y				=	y			?	y			:	0;

	var txt			=	new createjs.Text(texto, "bold 40px VAG Rounded BT", "#ffffff"),
		button		=	new createjs.Shape(),
		t			=	new createjs.Container();

	txt.shadow		=	new createjs.Shadow("#000000", 3, 3, 6);
	txt.textAlign	=	"left";
	txt.lineWidth	=	lineWidth;
	
	txt.x			=	15;
	txt.y			=	10;
	button.alpha 	=	0.6;
	

	button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, txt.getBounds().height + 20);
	button.graphics.drawRoundRect(0,0,txt.getBounds().width + 30, txt.getBounds().height + 20,20);
	button.graphics.endFill();

    t.addChild(button);
	t.addChild(txt);
	t.x		=	x;
	t.y		=	y;

	return t;
}