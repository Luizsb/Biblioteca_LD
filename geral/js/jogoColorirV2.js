var jogoColorir=function(idCanvas,_itens,_configuracaoMenu,_menuCor,_enunciado){

var canvas4,
    caminho='resources/image/',
    stage,
	content,
	contentBotoes,
	contentFiguras4,
	contentColors,
	camadas=[],
	count4=0,
    fase=0,
	cor=0,
	bmp4=[],
	botoes=[],
    menuCor,
    colorSample,
    rgba_data,
    cores=[0,0,0],
    menuStatus=false,
	icone1,
    icone2,
    icone2img,
    icone2img2,
    jogoAtivo=false;

	canvas4 = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas4);
    content = new createjs.Container();
	contentBotoes = new createjs.Container();
	contentFiguras4 = new createjs.Container();
	contentColors = new createjs.Container();
    icone2 = new createjs.Container();
    
	
	stage.addChild(content);
	
    stage.addChild(contentColors);
    stage.addChild(contentBotoes);
    stage.addChild(icone2);
	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);

    var btiniciar = new createjs.Bitmap(caminho+"bt_iniciar4.png");
    btiniciar.image.onload = function(){};
    stage.addChild(btiniciar);
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
    icone1 = new createjs.Bitmap(caminho+"picker.png");
	icone1.image.onload = function(){};
    stage.addChild(icone1);
	icone1.y=-300;
	icone1.x=-600;

    icone2img = new createjs.Bitmap(caminho+"bucket_bot.png");
    icone1.image.onload = function(){};
    icone2.addChild(icone2img);
    icone2img2 = new createjs.Bitmap(caminho+"bucket_paint.png");
    icone1.image.onload = function(){};
    icone2.addChild(icone2img2);
    icone2.y=-300;
    icone2.x=-600;
    icone1.visible=false;
    icone2.visible=false;


contentColors.x=1280;
    menuCor = new createjs.Bitmap(caminho+_menuCor[0]);
    menuCor.image.onload = function(){};
    contentColors.addChild(menuCor);
    menuCor.on("pressmove", function (evt) {
        console.log(rgba_data[0]);
        cores=rgba_data;
        pintaSample(colorSample);
        pintaSample(icone2img2);
  
    });
    menuCor.on("mousedown", function (evt) {
        console.log(rgba_data[0]);
        cores=rgba_data;
        pintaSample(colorSample);
        pintaSample(icone2img2);

  
    });
    menuCor.on("pressup", function (evt) {
        icone1.x=-200;
        icone1.y=-500;

    });


    createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", ticker4);


var ctx = canvas4.getContext('2d');

function pick(event) {
	if(jogoAtivo){
	  var x = event.layerX;
	  var y = event.layerY;
	  var pixel = ctx.getImageData(stage.mouseX, stage.mouseY, 1, 1);
	  rgba_data = pixel.data;
	  icone1.x=stage.mouseX;
	  icone1.y=stage.mouseY-96;
	    icone2.x=stage.mouseX;
	  icone2.y=stage.mouseY-96;
	  if(stage.mouseX>_menuCor[2]){
	    /*abre menu*/
	    menuStatus=true;
	    icone1.visible=true;
	    icone2.visible=false;
	    createjs.Tween.get(contentColors).to({x:_menuCor[1]},400,createjs.Ease.backOut);

	  }
	if(stage.mouseX<700){
	    /*abre menu*/
	    if(menuStatus){
	        icone1.visible=false;
	        icone2.visible=true;
	        createjs.Tween.get(contentColors).to({x:_menuCor[2]},400,createjs.Ease.backOut);
	    }
	    menuStatus=false;
	    

	  }
	}
}
canvas4.addEventListener('mousemove', pick);
                $('html').bind('touchmove', function(e) {
                    pick();
                });
                $('html').bind('touchend', function(e) {
                    pick();
                });
    
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
	jogoAtivo=true;
    content.removeAllChildren();
    contentBotoes.removeAllChildren();
    contentColors.x=_menuCor[2]; 

    colorSample = new createjs.Bitmap(caminho+"jogoColorir_fundopaleta.png");
    colorSample.image.onload = function(){};
    contentBotoes.addChild(colorSample);
    colorSample.x=1030;
    colorSample.y=500;
    
    colorSample = new createjs.Bitmap(caminho+"jogoColorir_sample.png");
    colorSample.image.onload = function(){};
    contentBotoes.addChild(colorSample);
    colorSample.x=1030;
    colorSample.y=500;
    
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


    if(_itens.length>1){
    var btVoltar = new createjs.Bitmap(caminho+"btmenu.png");
	        btVoltar.image.onload = function(){};
	        btVoltar.x=10;
	        btVoltar.y=640;
            contentBotoes.addChild(btVoltar);
			btVoltar.on("mousedown", function (evt) {
				jogoAtivo=false;
                icone1.y=-400;
                icone1.x=1200;
                icone1.visible=false;
                icone2.visible=false;
                contentColors.x=1280;
				criaMenu();
	        });
    }
			
}
		function ticker4(event){
	        stage.update();
        }

        function pintaSample(qual) {
            var t=qual.id;
            var filter = new createjs.ColorFilter(0,0,0,1,cores[0],cores[1],cores[2]);
            qual.filters = [filter];
            qual.cache(0, 0, 1280, 720);
            stage.update();
        }
        function pinta(qual) {
		    var t=qual.id;
			camadas[t].removeAllChildren();
            var filter = new createjs.ColorFilter(0,0,0,1,cores[0],cores[1],cores[2]);
            qual.filters = [filter];
			qual.cache(0, 0, 1280, 720);
			camadas[t].addChild(qual);
            stage.update();
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
             
            stage.update();
        }
}
		