 var AppAtirador=function(idCanvas,idFundo,idBtInicio,_itens,tamanhoBt,margemBt,margemPergunta,espacamento,ativaTempo,_tempoPergunta,tamanhoTextoBotao,tamanhoTextoPergunta,errosMaximos,mostraTutorial){
    var caminho="resources/image/",
    canvas,
    stage,
    fundo,
    content,
    dragao,
    telaEscolha,
    perguntas,
    dif,
    cont_carro=[],
    fumaca=[],
    positivo,
    tente,
    inicio1=false,
    btinicia,
    count=0,
    i_erros=0,
    i_acertos=0,
    edgeOffset=80,
    cabeca_dragao,
    corpo_dragao,
    fogo,
    heroi,
    coracoes=[],
    vidas=3,
    frase,
    hit,
    help,
    escolha=1,
    acerto=false,
    tutorial,
    n_resp=6,
    check,
    tempoPergunta=5000,
    tempoPista=3000,
    tempoDelay=800,
    distancia=20,
    pistaWidth=1280,
    timerPrecisao=0,
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3","espada2.mp3","dragao1.mp3","dragao2.mp3"]; 


    function randomiza(){
        var n=Math.floor(Math.random()*500)+500;
        return n;
    }
    function montaFase(){
        inicia=true;
        timerPrecisao=0;

        var frase = new createjs.Container();
        var extensao=_itens[count].pergunta.split('.').pop();
        if(extensao=='jpg' || extensao=='png'){
            img = new createjs.Bitmap(caminho+_itens[count].pergunta);
            img.image.onload = function(){};
            frase.addChild(img);

        }else{
            var txt = new createjs.Text(_itens[count].pergunta, tamanhoTextoPergunta+"px VAG Rounded BT", "#ffffff");
            txt.lineWidth=1000;
            txt.textAlign = "center";

            var contorno = new createjs.Text(_itens[count].pergunta, tamanhoTextoPergunta+"px VAG Rounded BT", "#000000");
            contorno.lineWidth=1000;
            contorno.textAlign = "center";
            contorno.outline = 8;

            contorno.x=margemPergunta[0];
            txt.x=margemPergunta[0];
            contorno.y=margemPergunta[1];
            txt.y=margemPergunta[1];
            frase.addChild(contorno);
            frase.addChild(txt);
        }
        perguntas.addChild(frase);
        frase.x=-1280;
        frase.y=200;
        createjs.Tween.get(frase).wait(tempoDelay).to({x:0},250,createjs.Ease.backOut);
        if(ativaTempo){
            createjs.Tween.get(content).wait(tempoPergunta+tempoDelay).call(limpaSegue);
        }

        shuffle(_itens[count].opcoes);
        var j=0;
        var offsetx=margemBt[0];
        var offsety=margemBt[1];
        for(var i=0;i<_itens[count].opcoes.length;i++){

            var extensao=_itens[count].opcoes[i].split('.').pop();
            var bt;
            if(extensao=='jpg' || extensao=='png'){
                bt = new createjs.Bitmap(caminho+_itens[count].opcoes[i]);
                bt.image.onload = function () {};
                bt.tipo="imagem";
            }else{
                bt = caixaTexto(_itens[count].opcoes[i]);
                bt.tipo="texto";
            }
            perguntas.addChild(bt);  
            bt.alpha=0.75;
            bt.x=-200;
            bt.px=j*(tamanhoBt[0]+espacamento)+offsetx;
            if(bt.px>1280){
                j=1;
                offsety+=tamanhoBt[1]+15;
                bt.px=offsetx;
                bt.py=offsety;
                bt.y=offsety;
            }else{            
                bt.y=offsety;
                bt.py=offsety;
                bt.px=j*(tamanhoBt[0]+espacamento)+offsetx;
                j++;
            }

            bt.name=_itens[count].opcoes[i];
            bt.certa=_itens[count].certa;
            bt.regX=tamanhoBt[0]/2;
            bt.regY=tamanhoBt[1]/2;
            createjs.Tween.get(bt).wait(tempoDelay).to({x:bt.px},250,createjs.Ease.backOut);
            bt.on("mousedown", function (evt) {
                if(inicia){
                    inicia=false;
                    if(this.name==this.certa){
                        acerto=true;
                        volta=false;
                        sons[0].play();
                        animaIco("certo",this.px,this.py);
                        console.log('timerPrecisao1 '+timerPrecisao);
                        createjs.Tween.get(content).wait(tempoDelay).call(heroiAtaca,[true,timerPrecisao]);
                    }else{
                        sons[1].play();
                        i_erros++;
                        this.alpha=0.25;
                        animaIco("errado",this.px,this.py);
                        createjs.Tween.get(content).wait(tempoDelay).call(dragaoAtaca,[false,timerPrecisao]);
                        vidas--;
                        content.removeChild(coracoes[vidas]);
                    }

                }
            }); 

        }

    }
    function animaIco(qual,b,c){
        var ico;
        ico = new createjs.Bitmap(caminho+qual+".png");
        perguntas.addChild(ico);
        ico.x = b-30;
        ico.y = c-150;
        ico.regX=98;
        ico.regY=98;
        ico.scaleX=ico.scaleY=0.1;
        createjs.Tween.get(ico).to({scaleX:0.3,scaleY:0.3},200,createjs.Ease.quadOut);
    }
    function dragaoAtaca(acertou,calculaPrecisao){
        perguntas.removeAllChildren();
        cabeca_dragao.gotoAndPlay("atira");
        fogo.gotoAndPlay("atira");
        sons[6].play();
        createjs.Tween.get(content).wait(1000).call(limpaSegue);

    }
    function heroiAtaca(acertou,calculaPrecisao){
        perguntas.removeAllChildren();
        heroi.gotoAndPlay("atira");

        sons[4].play();
        var i;
        for(i=0;i<5;i++){
            var golpe;
            golpe = new createjs.Bitmap(caminho+"espadada.png");
            stage.addChild(golpe);
            golpe.rotation=-10;
            golpe.alpha=0.2;
            golpe.scaleX=golpe.scaleY=0.2;
            golpe.x=400;
            golpe.y=480;
            golpe.regX=75;
            golpe.regY=200;
            createjs.Tween.get(golpe).wait(i*100).to({alpha:0.8,scaleX:2,scaleY:2,x:1300,y:150},1200,createjs.Ease.linear).call(apagagolte);
        }
        createjs.Tween.get(content).wait(1000).call(limpaSegue);
        createjs.Tween.get(dragao).wait(800).to({x:50},50).to({x:0},50).to({x:50},50).to({x:0},50).to({x:25},50).to({x:0},50).to({x:10},50).to({x:0},50);

    }
    function apagagolte(){
        stage.removeChild(this);
    }
    function limpaSegue(){

        if(vidas<=0){
            Fim();
        }else{ 
            if(count<_itens.length-1){
                count++;
                montaFase();
            }else{
                Fim();
            }
        }

    }
    function Fim(){

       if(i_erros<errosMaximos){
           sons[2].play();
           positivo.visible=true;
           positivo.y=720;
           createjs.Tween.get(positivo).wait(500).to({y:150},750,createjs.Ease.quadOut);
           sons[2].play();
           createjs.Tween.get(dragao).to({x:640},1000,createjs.Ease.quadIn);
       }else{
           tente.visible=true;
           tente.y=720;
           createjs.Tween.get(tente).wait(500).to({y:150},750,createjs.Ease.quadOut);
           sons[3].play();
       }

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

function ticker(event){
   stage.update();
   timerPrecisao+=0.18;
}
function apaga(){
    stage.removeChild(this);

}
function caixaTexto(texto){

	var txt = new createjs.Text(texto, tamanhoTextoBotao+"px VAG Rounded BT", "#000000");
    txt.lineWidth = tamanhoBt[0];

    var tamX=txt.getBounds().width+80;
    var tamY=txt.getBounds().height+50;

    txt.regY=tamY/2-35;
    txt.textAlign = "center";

    var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
    button.graphics.drawRoundRect(0,0,tamanhoBt[0],tamanhoBt[1],20);
    button.graphics.endFill();
    button.regX=tamanhoBt[0]/2;
    button.regY=tamanhoBt[1]/2;

    var t = new createjs.Container();
    t.addChild(button);
    t.addChild(txt);

    return t;

}
function reseta(){
    cabeca_dragao.gotoAndStop("idle");
    content.removeAllChildren();
    tente.visible=false;
    positivo.visible=false;
    count=0;
    i_erros=0;
    i_acertos=0;
    vidas=3;
    montaFase();
    montaCoracoes();
    createjs.Tween.get(dragao).to({x:0},1000,createjs.Ease.quadOut);
}
function montaCoracoes(){
    coracoes=[];
    var i;
    for(i=0;i<3;i++){
        coracoes[i] = new createjs.Bitmap(caminho+"coracao.png");
        content.addChild(coracoes[i]);
        coracoes[i].scaleX=coracoes[i].scaleY=0.2;
        coracoes[i].x=530+i*95;
        coracoes[i].y=670;
        coracoes[i].regX=45;
        coracoes[i].regY=35;
        createjs.Tween.get(coracoes[i]).wait(i*100).to({scaleX:1,scaleY:1},300,createjs.Ease.backOut);
    }
}
function init2() {
    var index;
    for (index in sons) {
        var t = sons[index];
        sons[index] = new Audio(caminho + t);
    }
    shuffle(_itens);
    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
    fundo = new createjs.Container();
    content = new createjs.Container();
    telaEscolha = new createjs.Container();
    dragao = new createjs.Container();
    
    
    var fundo = new createjs.Bitmap(caminho+idFundo);
    fundo.image.onload = function(){};
    stage.addChild(fundo);

    
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true; 
    
    stage.addChild(dragao);
    
    corpo_dragao = new createjs.Bitmap(caminho+'dragao.png');
    corpo_dragao.image.onload = function(){};
    dragao.addChild(corpo_dragao);
    corpo_dragao.x=550;
    corpo_dragao.y=-60;
    
    var spriteSheet = new createjs.SpriteSheet({
      framerate: 20,
      images: [caminho+"dragao_cabeca.png"],
      frames: [[5,5,327,382,0,135.1,224.7],[337,5,355,413,0,169.1,221.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[5,423,369,445,0,184.1,222.7],[337,5,355,413,0,169.1,221.7],[5,5,327,382,0,135.1,224.7]],
      animations: {
        idle: 0,
        atira: [1,16, "idle",0.5]
    }
});	
    var spriteSheet2 = new createjs.SpriteSheet({
      framerate: 20,
      images: [caminho+"fogo.png"],
      frames: [[5,5,219,65,0,20,12],[229,5,443,193,0,248,39],[5,203,452,187,0,258,17],[462,203,453,176,0,261,26],[5,395,440,178,0,252,32],[229,5,443,193,0,248,39],[5,203,452,187,0,258,17],[462,203,453,176,0,261,26],[5,395,440,178,0,252,32],[229,5,443,193,0,248,39],[5,203,452,187,0,258,17],[462,203,453,176,0,261,26],[450,395,440,178,0,252,32],[5,578,394,135,0,250,-9],[404,578,310,104,0,236,-26],[719,578,80,40,0,230,-78]],
      animations: {
        idle: 15,
        atira: [1,15, "idle",0.5]
    }
});    
    var spriteSheet3 = new createjs.SpriteSheet({
      framerate: 20,
      images: [caminho+"heroi.png"],
      frames: [[5,5,297,275,0,148.2,137],[307,5,257,265,0,108.19999999999999,127],[569,5,278,302,0,129.2,164],[5,312,275,395,0,64.19999999999999,257],[285,312,290,351,0,64.19999999999999,213],[580,312,295,351,0,64.19999999999999,213],[5,712,213,242,0,64.19999999999999,104]],
      animations: {
        idle: 0,
        atira: [1,6, "idle",0.5]
    }
});
    
    cabeca_dragao = new createjs.Sprite(spriteSheet, "idle");
    dragao.addChild(cabeca_dragao);
    cabeca_dragao.x=820;
    cabeca_dragao.y=315; 
    
    heroi = new createjs.Sprite(spriteSheet3, "idle");
    stage.addChild(heroi);
    heroi.x=350;
    heroi.y=500;
    
    fogo = new createjs.Sprite(spriteSheet2, "idle");
    stage.addChild(fogo);
    fogo.x=630;
    fogo.y=365;
    
    
    
    perguntas = new createjs.Container();

    stage.addChild(content);
    stage.addChild(perguntas);
    stage.addChild(telaEscolha);
    
    
    btinicia = new createjs.Bitmap(caminho+idBtInicio);
    btinicia.image.onload = function(){};
    stage.addChild(btinicia);
    btinicia.on("click", function() {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        btinicia.visible=false;
        inicio1=true;
        montaFase();
        montaCoracoes();

    });
    positivo = new createjs.Bitmap(caminho+"positivo.png");
    positivo.image.onload = function(){};
    stage.addChild(positivo);
    positivo.x=460;
    positivo.y=150;
    positivo.visible=false;
    positivo.on("click", function() {
        reseta();

    });

    tente = new createjs.Bitmap(caminho+"tentenovamente.png");
    tente.image.onload = function(){};
    stage.addChild(tente);
    tente.x=470;
    tente.y=150;
    tente.visible=false;
    tente.on("click", function() {
        reseta();

    });

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", ticker);
    createjs.MotionGuidePlugin.install();
}
init2();
}