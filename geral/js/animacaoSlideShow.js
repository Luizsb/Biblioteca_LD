/*versao 1.2 com spritesheets*/
var AppSlide=function(idCanvas,itens,_locucao,_musica,_fundos,_slideFinal,_btiniciar){
var canvas,
 stage,
 content,
 contentOver,
 contentFundo,
 contentPlayer,
 caminho="resources/image/",
 count=0,
  fundos=[],                             
   bt1,              
   bt2,              
   bt3,
 locucao,
efeitos=[],
bts=[],
somPausado=-1,
 musica;
       
    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage);
	contenttext = new createjs.Container();
	content = new createjs.Container();
	contentFundo = new createjs.Container();
	contentOver = new createjs.Container();

	stage.addChild(contentFundo);
                    contentFundo.x=640;
                    contentFundo.y=360;
                    
    var img = new createjs.Bitmap(caminho+_fundos[0].img[0]);
    img.image.onload = function(evt){};
    contentFundo.addChild(img);
    img.x=-640;
    img.y=-360;
                               
	stage.addChild(content);
	stage.addChild(contentOver);
    contentOver.x=640;
    contentOver.y=360;
    
    var btiniciar;
    if(_btiniciar){
        btiniciar = new createjs.Bitmap(caminho+_btiniciar);
    }else{
        btiniciar = new createjs.Bitmap(caminho+'bt_iniciar.png');
    }

    btiniciar.image.onload = function(evt){};
    btiniciar.on("mousedown", function (evt) {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        stage.removeChild(this);
        montaAnimacao();

    }); 
    stage.addChild(btiniciar); 
       

	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker);
 function montaAnimacao(){
     
    montaSlide();
    var i;
    for(i=0;i<_fundos[0].img.length;i++){
        createjs.Tween.get(content).wait(i*_fundos[0].tempo).call(montaFundo,[i]);
    }    
    for(i=0;i<_fundos[0].imgOverlay.length;i++){
        createjs.Tween.get(contentOver).wait(i*_fundos[0].tempoOverlay).call(montaOverlay,[i]);
    }

    musica=new Audio(caminho+_musica);
    musica.play(); 
     
    locucao=new Audio(caminho+_locucao);
    locucao.play();
                         
    bt1 = new createjs.Bitmap(caminho+'btControle2.png');
    bt1.image.onload = function(evt){};
    bt1.on("mousedown", function (evt) {
        if(stage.mouseX>1260){
            console.log('pula slide');
            removeTweens(content);
            content.removeAllChildren();
            console.log('limpezaOK');
            proximoSlide();
            
        }else{
            this.alpha=0.3;
            if(bt2.visible==false){
                createjs.Ticker.paused = true;
                musica.pause();
                locucao.pause();
                bt2.visible=true;

                
                /*pausa spritesheet*/
                if(bts.length>0){
                    bts[0].gotoAndStop(bts[0].currentFrame);

                }
                var i;
                somPausado=-1;
                for(i=0; i<efeitos.length; i++){
                    if(!efeitos[i].paused){
                        efeitos[i].pause();
                        somPausado=i;
                    }
                   
                }
                
                
            }else{
                bt2.visible=false;
                createjs.Ticker.paused = false;
                musica.play();
                musica.volume=1;
                locucao.play();
                locucao.volume=1;
                /*pausa spritesheet*/
                if(bts.length>0){
                    bts[0].gotoAndPlay(bts[0].currentFrame);
                }
                if(somPausado>-1){
                    efeitos[somPausado].play();
                }
            }
        }
    });
    bt1.on("pressup", function (evt) {
        this.alpha=1;
    });

    bt2 = new createjs.Bitmap(caminho+'btControle1.png');
    bt2.image.onload = function(evt){};
    bt2.visible=false;

    stage.addChild(bt1);                
    stage.addChild(bt2);  
     
 }
function montaFundo(i){
    console.log('monta');

    img = new createjs.Bitmap(caminho+_fundos[0].img[i]);
    img.image.onload = function(evt){};

    contentFundo.addChild(img);

    img.x=-640;
    img.y=-360;
    img.alpha=0;

    createjs.Tween.get(img,{loop:true}).to({alpha:1},_fundos[0].tempo,createjs.Ease.linear).to({alpha:0},_fundos[0].tempo,createjs.Ease.linear).wait((_fundos[0].img.length-1)*_fundos[0].tempo);
      
}
function montaOverlay(i){
    console.log('montaOver');

    img = new createjs.Bitmap(caminho+_fundos[0].imgOverlay[i]);
    img.image.onload = function(evt){};

    contentOver.addChild(img);

    img.x=-640;
    img.y=-360;
    img.alpha=0;

    createjs.Tween.get(img,{loop:true}).to({alpha:1},_fundos[0].tempoOverlay,createjs.Ease.linear).to({alpha:0},_fundos[0].tempoOverlay,createjs.Ease.linear).wait((_fundos[0].img.length-1)*_fundos[0].tempoOverlay);
      
}
function montaSlide(){
    
    if(itens[count].efeitoSonoro){
        var efeito=new Audio(caminho+itens[count].efeitoSonoro);
        efeito.play();
        efeitos.push(efeito);
    }

    var img = new createjs.Bitmap(caminho+itens[count].foto);
    img.image.onload = function(){
        content.addChild(img);
        var tamX=img.getBounds().width;
        var tamY=img.getBounds().height;
        img.regX=tamX/2;
        img.regY=tamY/2;
        img.id=count;
        img.x=640;
        img.y=360;
        /*sombra pesado
        img.shadow = new createjs.Shadow("#000000", 0, 0, 30);
        */
        
        /*largura maior que altura?*/
        var dif;
        if(tamY>700){
            dif=6500/tamY;
            img.scaleX=dif/10;
            img.scaleY=dif/10;
            img.oriScaleX=dif/10;
            img.oriScaleY=dif/10;
        }else if(tamX>1200){
            dif=12000/tamX;
            img.scaleX=dif/10;
            img.scaleY=dif/10;
            img.oriScaleX=dif/10;
            img.oriScaleY=dif/10;
        }else{
            img.scaleX=1;
            img.scaleY=1;
            img.oriScaleX=1;
            img.oriScaleY=1;
        }
/*presetings da foto
direitaParaEsquerda
zoom
fadeIn
mascara1
mascara2
*/
        if(itens[count].tipoTransicao=='direitaParaEsquerda'){
            img.x=1800;
            img.rotation=10;
            createjs.Tween.get(img)
                .to({x:700,rotation:2},itens[img.id].transicaoSlide,createjs.Ease.quadOut)
                .to({x:600,rotation:-2},itens[img.id].duracaoSlide,createjs.Ease.linear)
                .to({x:-640,rotation:-30,alpha:0.1},itens[img.id].transicaoSlide,createjs.Ease.quadIn).call(removeObjeto);
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide-itens[img.id].transicaoSlide/1.2).call(proximoSlide);
            
        }else if(itens[count].tipoTransicao=='direitaParaEsquerdaLinear'){
            img.x=1800;
            createjs.Tween.get(img)
                .to({x:700},itens[img.id].transicaoSlide,createjs.Ease.quadOut)
                .to({x:600},itens[img.id].duracaoSlide,createjs.Ease.linear)
                .to({x:-640,alpha:0.1},itens[img.id].transicaoSlide,createjs.Ease.quadIn).call(removeObjeto);
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide-itens[img.id].transicaoSlide/1.2).call(proximoSlide);
            
        }else if(itens[count].tipoTransicao=='zoom'){
            img.x=640;
            img.alpha=0;
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            var rotacao = Math.random()*10;
            img.rotation=rotacao*plusOrMinus;
            img.rotacao=rotacao*plusOrMinus;
            img.scaleX=0.1;
            img.scaleY=0.1;
            createjs.Tween.get(img)
                .to({scaleX:img.oriScaleX,scaleY:img.oriScaleY,alpha:1,rotation:0},itens[img.id].transicaoSlide,createjs.Ease.sineOut)
                .to({scaleX:img.oriScaleX*1.2,scaleY:img.oriScaleY*1.2,alpha:1,rotation:-1*img.rotacao,x:640+itens[img.id].offsetX,y:360+itens[img.id].offsetY},itens[img.id].duracaoSlide,createjs.Ease.linear)
                .to({scaleX:img.oriScaleX*2,scaleY:img.oriScaleY*2,alpha:0,rotation:-1.7*img.rotacao},itens[img.id].transicaoSlide,createjs.Ease.sineIn).call(removeObjeto);
            
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide-itens[img.id].transicaoSlide/1.2).call(proximoSlide);
            
        }else if(itens[count].tipoTransicao=='zoomSimples'){
            img.x=640;
            img.alpha=0;
            var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
            var rotacao = Math.random()*10;
            img.rotacao=rotacao*plusOrMinus;
            img.scaleX=0.1;
            img.scaleY=0.1;
            createjs.Tween.get(img)
                .to({scaleX:img.oriScaleX,scaleY:img.oriScaleY,alpha:1},itens[img.id].transicaoSlide,createjs.Ease.sineOut)
                .to({scaleX:img.oriScaleX*1.2,scaleY:img.oriScaleY*1.2,alpha:1,x:640+itens[img.id].offsetX,y:360+itens[img.id].offsetY},itens[img.id].duracaoSlide,createjs.Ease.linear)
                .to({scaleX:img.oriScaleX*2,scaleY:img.oriScaleY*2,alpha:0},itens[img.id].transicaoSlide,createjs.Ease.sineIn).call(removeObjeto);
            
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide-itens[img.id].transicaoSlide/1.2).call(proximoSlide);
            
        }else if(itens[count].tipoTransicao=='zoomSequencia'){
            img.x=640;
            img.alpha=0;
            img.scaleX=1;
            img.scaleY=1;
            createjs.Tween.get(img)
                .to({scaleX:1.05,scaleY:1.05,alpha:1},itens[img.id].transicaoSlide,createjs.Ease.linear)
                .to({scaleX:1.25,scaleY:1.25,alpha:1,x:640+itens[img.id].offsetX,y:360+itens[img.id].offsetY},itens[img.id].duracaoSlide+itens[img.id].transicaoSlide,createjs.Ease.linear)
                .to({scaleX:1.30,scaleY:1.30,alpha:0},itens[img.id].transicaoSlide,createjs.Ease.linear).call(removeObjeto);
            
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide).call(proximoSlide);
            
        }else if(itens[count].tipoTransicao=='fadeIn'){
            img.x=640;
            img.alpha=0;
            img.scaleX=img.oriScaleX*0.9;
            img.scaleY=img.oriScaleY*0.9;
            createjs.Tween.get(img)
                .to({alpha:1,scaleX:img.oriScaleX,scaleY:img.oriScaleY},itens[img.id].transicaoSlide,createjs.Ease.sineOut)
                .to({scaleX:img.oriScaleX*1.1,scaleY:img.oriScaleY*1.1},itens[img.id].duracaoSlide,createjs.Ease.linear)
                .to({alpha:0,scaleX:img.oriScaleX*1.3,scaleY:img.oriScaleY*1.3},itens[img.id].transicaoSlide,createjs.Ease.sineIn).call(removeObjeto);
            
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide-itens[img.id].transicaoSlide/1.2).call(proximoSlide);
            
        }else if(itens[count].tipoTransicao=='fadeInSequencia'){
            img.x=640;
            img.alpha=0;
            img.scaleX=1;
            img.scaleY=1;
            createjs.Tween.get(img)
                .to({alpha:1},itens[img.id].transicaoSlide,createjs.Ease.sineOut)
                .wait(itens[img.id].duracaoSlide+itens[img.id].transicaoSlide)
                .to({alpha:0},itens[img.id].transicaoSlide,createjs.Ease.sineIn).call(removeObjeto);
            
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide).call(proximoSlide);
            
        }else if(itens[count].tipoTransicao=='mascara1'){
            var imgClone = new createjs.Bitmap(caminho+itens[count].foto);
            imgClone.image.onload = function(){};
            content.addChild(imgClone);
            imgClone.regX=img.regX;
            imgClone.regY=img.regY;
            imgClone.x=640;
            imgClone.y=360;
            imgClone.scaleX=img.scaleX*1.1;
            imgClone.scaleY=img.scaleY*1.1;
            // bg
            // shape that acts as moving mask
            var orb = new createjs.Shape();
            orb.graphics.beginFill("black").drawRect(0,0, 200, 900);
            orb.x = -100;
            orb.y = -100;
            orb.rotation = -5;
            content.addChild(orb);
            orb.visible=false;
            
            createjs.Tween.get(orb)
                .to({x:200},itens[img.id].transicaoSlide,createjs.Ease.sineOut)
                .to({x:600,scaleX:4,rotation:10},itens[img.id].duracaoSlide,createjs.Ease.linear)
                .to({x:1500,scaleX:2,rotation:20},itens[img.id].transicaoSlide,createjs.Ease.sineIn).call(removeObjeto);
            
            createjs.Tween.get(imgClone).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide).call(removeObjeto);
            
            imgClone.mask = orb;
            
            
            img.x=640;
            img.alpha=0;
            img.scaleX=img.scaleX/1.2;
            img.scaleY=img.scaleY/1.2;
            createjs.Tween.get(img)
                .to({scaleX:img.oriScaleX,scaleY:img.oriScaleY,alpha:0.75},itens[img.id].transicaoSlide,createjs.Ease.sineOut)
                .to({scaleX:img.oriScaleX*1.2,scaleY:img.oriScaleY*1.2,alpha:0.9},itens[img.id].duracaoSlide,createjs.Ease.linear)
                .to({scaleX:img.oriScaleX*1.8,scaleY:img.oriScaleY*1.8,alpha:0},itens[img.id].transicaoSlide,createjs.Ease.sineIn).call(removeObjeto);
            
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide-itens[img.id].transicaoSlide/1.2).call(proximoSlide);
            
        }else if(itens[count].tipoTransicao=='mascara2'){
            var imgClone = new createjs.Bitmap(caminho+itens[count].foto);
            imgClone.image.onload = function(){};
            content.addChild(imgClone);
            imgClone.regX=img.regX;
            imgClone.regY=img.regY;
            imgClone.x=640;
            imgClone.y=360;
            imgClone.scaleX=img.scaleX*1.1;
            imgClone.scaleY=img.scaleY*1.1;
            
            /*mascara*/

            var orb = new createjs.Shape();
            orb.graphics.beginFill("black").drawRect(0,0, 200, 900);
            orb.x = 1280;
            orb.y = -100;
            orb.rotation = -10;
            content.addChild(orb);
            orb.visible=false;
            
            createjs.Tween.get(orb)
                .to({x:200,scaleX:4,rotation:5},itens[img.id].transicaoSlide+itens[img.id].duracaoSlide,createjs.Ease.sineOut)
                .to({x:-1000,scaleX:0.5,rotation:20},itens[img.id].transicaoSlide,createjs.Ease.sineIn).call(removeObjeto);
            
            createjs.Tween.get(imgClone).to({scaleX:imgClone.scaleX*1.5,scaleY:imgClone.scaleY*1.5,y:360+itens[img.id].offsetY},itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide).call(removeObjeto);
            
            imgClone.mask = orb;
            
            img.x=1800;
            img.rotation=10;
            img.alpha=0.5;
            createjs.Tween.get(img)
                .to({x:700,rotation:2,alpha:0.8},itens[img.id].transicaoSlide,createjs.Ease.quadOut)
                .to({x:600,rotation:-2,alpha:0.95},itens[img.id].duracaoSlide,createjs.Ease.linear)
                .to({x:-640,rotation:-30,alpha:0.1},itens[img.id].transicaoSlide,createjs.Ease.quadIn).call(removeObjeto);
            createjs.Tween.get(content).wait(itens[img.id].transicaoSlide*2+itens[img.id].duracaoSlide-itens[img.id].transicaoSlide/1.2).call(proximoSlide);
            
        }
        
        
         /*presetings do texto
         direitaParaEsquerda
         fadeIn
         zoom
         */
         bts=[];
        if(itens[count].textos.length>0){
            var i;
            for(i=0;i<itens[count].textos.length;i++){
                /*verifica se é spritesheet primeiro se nao continua virificacao se é txt ou imagem*/
                if(itens[count].textos[i][0].currentFrame){
                    var bt=itens[count].textos[i][0];
                    content.addChild(bt);
                    bt.x=itens[count].textos[i][4];
                    bt.y=itens[count].textos[i][5];
                     bt.alpha=0;
                    createjs.Tween.get(bt)
                            .wait(itens[count].textos[i][2])
                            .to({alpha:1},itens[count].textos[i][1],createjs.Ease.quadOut)
                            .wait(itens[count].textos[i][3])
                            .to({alpha:0.1},itens[count].textos[i][1],createjs.Ease.quadIn).call(removeObjeto);
                    bts.push(bt);
                }else{
                    var extensao=itens[count].textos[i][0].split('.').pop();
                    var tempDividido=itens[count].duracaoSlide/itens[count].textos.length;
                    if(extensao=='jpg' || extensao=='png'){
                        var bt;
                        bt = new createjs.Bitmap(caminho+itens[count].textos[i][0]);
                        bt.image.onload = function () {};
                        content.addChild(bt);
                        bt.x=itens[count].textos[i][4];
                        bt.y=itens[count].textos[i][5];

                        bt.alpha=0;
                        createjs.Tween.get(bt)
                            .wait(itens[count].textos[i][2])
                            .to({alpha:1},itens[count].textos[i][1],createjs.Ease.quadOut)
                            .wait(itens[count].textos[i][3])
                            .to({alpha:0.1},itens[count].textos[i][1],createjs.Ease.quadIn).call(removeObjeto);
                    }else{
                        var texto=textoContorno(itens[count].textos[i][0]);
                        content.addChild(texto);
                        texto.x=1800;
                        if(itens[count].textosFormatacao[6]!='center'){
                            texto.regX = itens[count].textosFormatacao[5]/2; 
                        }
                        texto.id=count;
                        texto.y=itens[count].textos[i][5];
                        if(itens[count].animacaoTexto=='direitaParaEsquerda'){
                            createjs.Tween.get(texto)
                                .wait(itens[count].textos[i][2])
                                .to({x:itens[count].textos[i][4]},itens[count].textos[i][1],createjs.Ease.quadOut)
                                .to({x:itens[count].textos[i][4]-50},itens[count].textos[i][3],createjs.Ease.linear)
                                .to({x:-640,alpha:0.1},itens[count].textos[i][1]/1.5,createjs.Ease.quadIn).call(removeObjeto);

                        }else if(itens[count].animacaoTexto=='fadeIn'){
                            texto.x=itens[count].textos[i][4];
                            texto.alpha=0;
                            createjs.Tween.get(texto)
                                .wait(itens[count].textos[i][2])
                                .to({alpha:1},itens[count].textos[i][1],createjs.Ease.quadOut)
                                .wait(itens[count].textos[i][3])
                                .to({alpha:0.1},itens[count].textos[i][1]/1.5,createjs.Ease.quadIn).call(removeObjeto);

                        }else if(itens[count].animacaoTexto=='zoom'){
                            texto.x=itens[count].textos[i][4];
                            texto.alpha=0;
                            texto.scaleX=0.2;
                            texto.scaleY=0.2;
                            createjs.Tween.get(texto)
                                .wait(itens[count].textos[i][2])
                                .to({alpha:1,scaleX:1,scaleY:1},itens[count].textos[i][1],createjs.Ease.quadOut)
                                .to({scaleX:1.2,scaleY:1.2},itens[count].textos[i][3],createjs.Ease.linear)
                                .to({alpha:0.1,scaleX:1.3,scaleY:1.3},itens[count].textos[i][1]/1.5,createjs.Ease.quadIn).call(removeObjeto);

                        }
                    }
                }
            }
    }
    }
}
function removeObjeto(){
    content.removeChild(this);
}
function removeTweens(thisContainer)
{
    var i;
    for(i=0; i<efeitos.length; i++){
        efeitos[i].pause();
    }
    
    console.log("recur()");
    var containerLength = content.getNumChildren();
    var thisChild;
    for(var i=0; i<containerLength; i++)
    {
        thisChild = thisContainer.getChildAt(i);
        createjs.Tween.removeTweens(thisChild);
        console.log(thisChild);
    }
    createjs.Tween.removeTweens(thisContainer);
}
function proximoSlide(){
    count++;
    if(count>=itens.length){
         fade();
        console.log("fim");
        var btFim = new createjs.Bitmap(caminho+_slideFinal);
        btFim.image.onload = function(evt){};
        stage.addChild(btFim);
        btFim.alpha=0;
        createjs.Tween.get(btFim).to({alpha:1},2500,createjs.Ease.linear);
        btFim.on("mousedown", function (evt) {
            stage.removeChild(this);
            efeitos=[];
            count=0;
            montaSlide();
            musica.currentTime=0;
            musica.volume=1;
            musica.play();
            locucao.currentTime=0;
            locucao.volume=1;
            locucao.play();
            
        });
    }else{
        montaSlide();
       

    }
    
}
function fade(){
    if(musica.volume > 0){
        musica.volume -= 0.1;
        setTimeout(fade, 250);
    }else{
        musica.pause();
    }
}
function textoContorno(texto){
	var txt = new createjs.Text(texto, itens[count].textosFormatacao[0]+"px "+itens[count].textosFormatacao[4], itens[count].textosFormatacao[1]);
	
    txt.textAlign = itens[count].textosFormatacao[6];
    txt.lineWidth = itens[count].textosFormatacao[5];
    txt.lineHeight = itens[count].textosFormatacao[7];
   
	var contorno = new createjs.Text(texto, itens[count].textosFormatacao[0]+"px "+itens[count].textosFormatacao[4], itens[count].textosFormatacao[3]);
    contorno.textAlign = itens[count].textosFormatacao[6];
    contorno.outline = 10;
    contorno.lineWidth = itens[count].textosFormatacao[5];
    contorno.lineHeight = itens[count].textosFormatacao[7];

	var resp = new createjs.Container();
    if(itens[count].textosFormatacao[2]){
        resp.addChild(contorno);
    }

    
	resp.addChild(txt);
	return resp;
}
function ticker(event){
    stage.update();

}
}