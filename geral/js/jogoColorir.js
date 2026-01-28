var jogoColorir=function(idCanvas,_itens,_configuracaoMenu){

var canvas4,
    caminho='resources/image/',
    stage4,
	content,
	contentBotoes,
	contentFiguras4,
	contentTemp,
	camadas=[],
	count4=0,
    fase=0,
	cor=0,
	bmp4=[],
	botoes=[],
	seta4;

	canvas4 = document.getElementById(idCanvas);
	stage4 = new createjs.Stage(canvas4);
    content = new createjs.Container();
	contentBotoes = new createjs.Container();
	contentFiguras4 = new createjs.Container();
	contentTemp = new createjs.Container();
    
	
	stage4.addChild(content);
	stage4.addChild(contentBotoes);
	createjs.Touch.enable(stage4);
	stage4.enableMouseOver(10);

    var btiniciar = new createjs.Bitmap(caminho+"bt_iniciar4.png");
    btiniciar.image.onload = function(){};
    stage4.addChild(btiniciar);
    btiniciar.on("mousedown", function (evt) {
    	var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        btiniciar.visible=false;
        if(_itens.length>1){
            criaMenu();
        }else{
            criaFase();
        }	
    });
    var seta4 = new createjs.Bitmap(caminho+"arrow.png");
	seta4.image.onload = function(){};
    stage4.addChild(seta4);
	seta4.regX=128/2;
	seta4.regY=131/2;
	seta4.scaleX=seta4.scaleY=0.5;
	seta4.y=-400;
	seta4.x=1200;
	seta4.rotation=230;
    createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", ticker4);
    
function criaMenu(){
    content.removeAllChildren();
    contentBotoes.removeAllChildren();
    
    var fundo = new createjs.Bitmap(caminho+_configuracaoMenu[0].fundo);
	fundo.image.onload = function(){};
    content.addChild(fundo);
    
    var w=0;
    for(w=0;w<_configuracaoMenu[0].imagens.length;w++){
        botoes[w] = new createjs.Bitmap(caminho+_configuracaoMenu[0].imagens[w]);
        botoes[w].image.onload = function(){};
        contentBotoes.addChild(botoes[w]);
        botoes[w].x=_configuracaoMenu[0].posicoes[w][0];
        botoes[w].y=1000;
        createjs.Tween.get(botoes[w]).wait(100*w).to({y:_configuracaoMenu[0].posicoes[w][1]},500,createjs.Ease.backOut); 
        botoes[w].id=w;
        botoes[w].on("mousedown", function (evt) {
            contentBotoes.removeAllChildren();
            fase=this.id;
            criaFase();
        });	
    }
    
    
}
function criaFase(){
    content.removeAllChildren();
    contentBotoes.removeAllChildren();
    
    cor=0;
    var fundo = new createjs.Bitmap(caminho+_itens[fase].fundo);
	fundo.image.onload = function(){};
    content.addChild(fundo);
    
    camadas=[];
    botoes=[];
    var i;
			for(i=0;i<_itens[fase].camadas.length;i++){
			    camadas[i] = new createjs.Container();
			    content.addChild(camadas[i]);
				var image4 = new Image();
                image4.crossOrigin = "Anonymous";
                image4.src = caminho+_itens[fase].camadas[i];
                image4.onload = handleLoad;
				image4.id=i;
				bmp4[i] = new createjs.Bitmap(image4);
				bmp4[i].id=i;
				bmp4[i].on("mousedown", function (evt) {
					pinta(this);
	            });
			
			}
			
    var contorno = new createjs.Bitmap(caminho+_itens[fase].contorno);
    contorno.image.onload = function(){};
    content.addChild(contorno);
    contorno.x=_itens[fase].margemDesenho[0];
    contorno.y=_itens[fase].margemDesenho[1];
    
    var margemX=1200;
    var margemY=55;
			var w=0;
			for(w=0;w<_itens[fase].btCores.length;w++){
			        botoes[w] = new createjs.Bitmap(caminho+_itens[fase].btCores[w]);
	                botoes[w].image.onload = function(){};
                    contentBotoes.addChild(botoes[w]);
					botoes[w].x=margemX;
					botoes[w].y=margemY;
					botoes[w].regX=75;
					botoes[w].regY=55;
					botoes[w].id=w+1;
					margemY+=138;
                    if(margemY>720){
                        margemX-=127;
                        margemY=55;
                    }
                    
			        botoes[w].on("mousedown", function (evt) {
					    cor=this.id;
						this.scaleX=this.scaleY=0.3;
						createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut); 
						createjs.Tween.get(seta4).to({x:this.x+40,y:this.y-40},500,createjs.Ease.backOut);
	                });
			
			}
    if(_itens.length>1){
    var btVoltar = new createjs.Bitmap(caminho+"btmenu.png");
	        btVoltar.image.onload = function(){};
	        btVoltar.x=10;
	        btVoltar.y=640;
            contentBotoes.addChild(btVoltar);
			btVoltar.on("mousedown", function (evt) {
                seta4.y=-400;
                seta4.x=1200;
				criaMenu();
	        });
    }
			
}
		function ticker4(event){
	        stage4.update();
        }
        function pinta(qual) {
		    var t=qual.id;
			camadas[t].removeAllChildren();
            var filter = new createjs.ColorFilter(0,0,0,1,_itens[fase].cores[cor][0],_itens[fase].cores[cor][1],_itens[fase].cores[cor][2]);
            qual.filters = [filter];
			qual.cache(0, 0, 1280, 720);
			camadas[t].addChild(qual);
            stage4.update();
        }
		 function handleLoad(event) {
		    var t=event.currentTarget.id;
		    var image = event.target;
            var filter = new createjs.ColorFilter(0,0,0,1,_itens[fase].cores[cor][0],_itens[fase].cores[cor][1],_itens[fase].cores[cor][2]);
             bmp4[t].x=_itens[fase].margemDesenho[0];
             bmp4[t].y=_itens[fase].margemDesenho[1];
            bmp4[t].filters = [filter];
            bmp4[t].cache(0, 0, 1280, 720);
            camadas[t].addChild(bmp4[t]);
             
            stage4.update();
        }
}
		