 var AppAtirador=function(idCanvas,_itens,tamanhoBt,margemBt,margemPergunta,espacamento,ativaTempo,_tempoPergunta,tamanhoTextoBotao,tamanhoTextoPergunta,errosMaximos,mostraTutorial,personagem, _btiniciar){
    var caminho="resources/image/",
    canvas,
    stage,
    fundo,
    content,
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
    arqueiro=0,
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
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3","flecha.mp3","atiraFlecha.mp3"];


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
            frase.y=margemPergunta[1];

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
            
            frase.y=200;
        }
        perguntas.addChild(frase);
        frase.x=-1280;
        createjs.Tween.get(frase).wait(tempoDelay).to({x:0},250,createjs.Ease.backOut);
        if(ativaTempo){
            createjs.Tween.get(content).wait(tempoPergunta+tempoDelay).call(limpaSegue);
        }

        shuffle(_itens[count].opcoes);

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
            bt.x=-200;
            bt.y=margemBt[1];
            bt.alpha=0.75;
            bt.px=i*(tamanhoBt[0]+espacamento)+margemBt[0];
            bt.py=margemBt[1];
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
                        createjs.Tween.get(content).wait(tempoDelay).call(atira,[true,timerPrecisao]);
                    }else{
                        sons[1].play();
                        i_erros++;
                        this.alpha=0.25;
                        animaIco("errado",this.px,this.py);
                        createjs.Tween.get(content).wait(tempoDelay).call(atira,[false,timerPrecisao]);
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
    function atira(acertou,calculaPrecisao){
        perguntas.removeAllChildren();
        arqueiro.gotoAndPlay("atira");
        sons[5].play();
        var flecha;
        flecha = new createjs.Bitmap(caminho+"flecha.png");
        content.addChild(flecha);
        flecha.x=986;
        flecha.y=276;

        var distx=Math.random()*150;
        console.log('timerPrecisao2 '+calculaPrecisao);
        var posNeg;
        if(calculaPrecisao>100){
            calculaPrecisao=100;
        }
        posNeg=Math.round(Math.random()) * 2 - 1;
        var randY=posNeg*calculaPrecisao;

        var px=165;
        var py=315-randY;



        if(acertou){
            i_acertos+=100-calculaPrecisao;
            createjs.Tween.get(flecha).to({x:px,y:py},300,createjs.Ease.linear).call(apagaFlecha,[px,py,false]);
        }else{
            createjs.Tween.get(flecha).to({rotation:-65,guide:{ path:[986,276, 800,50,300+distx,546]}},1000).call(apagaFlecha,[300+distx,546,true]);

        }


    }
    function apagaFlecha(px,py,rotaciona){
        content.removeChild(this);
        sons[4].play();
        var ico = new createjs.Bitmap(caminho+"flecha2.png");
        content.addChild(ico);
        ico.x = px;
        ico.y = py;
        ico.regY=9;
        if(rotaciona){
            ico.rotation=-60-Math.random()*20;
        }else{
            ico.rotation=10-Math.random()*20;
        }
        ico.scaleX=ico.scaleY=0.7;

        if(i_erros>=errosMaximos){
            Fim();
        }else{
            createjs.Tween.get(ico).to({scaleX:1,scaleY:1},200,createjs.Ease.backOut).call(limpaSegue);
        }
    }
    function limpaSegue(){
        arqueiro.gotoAndPlay("arma");

        if(count<_itens.length-1){
           count++;
           montaFase();
       }else{
        Fim();
    }

}
function Fim(){

    var txt = new createjs.Text("pontos: "+Math.floor(i_acertos), "60px VAG Rounded BT", "#000000");
    txt.textAlign = "center";
    txt.x=600;
    txt.y=50;
    content.addChild(txt);

    if(i_erros<errosMaximos){
       sons[2].play();
       positivo.visible=true;
       positivo.y=720;
       createjs.Tween.get(positivo).wait(500).to({y:150},750,createjs.Ease.quadOut);
       sons[2].play();
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
    txt.textAlign = "center";
    txt.lineWidth = tamanhoBt[0];
    
    var tamX=txt.getBounds().width+80;
    var tamY=txt.getBounds().height+50;
    txt.regY=tamY/2-35;

    var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
    button.graphics.drawRoundRect(0,0,tamanhoBt[0],tamanhoBt[1],20);
    button.graphics.endFill();
    button.regX=tamanhoBt[0]/2;
    button.regY=tamanhoBt[1]/2-10;

    var t = new createjs.Container();
    t.addChild(button);
    t.addChild(txt);

    return t;

}
function reseta(){
    arqueiro.gotoAndStop("idle");
    content.removeAllChildren();
    tente.visible=false;
    positivo.visible=false;
    count=0;
    i_erros=0;
    i_acertos=0;
    montaFase();
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


    var fundo = new createjs.Bitmap(caminho+"fundo.png");
    fundo.image.onload = function(){};
    stage.addChild(fundo);


    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    var spriteSheet;
    var spriteSheet1 = new createjs.SpriteSheet({
      framerate: 20,
      images: [caminho+"arqueiro.png"],
      frames: [[5,5,317,275,0,149.05,212.5],[327,5,290,275,0,122.05000000000001,212.5],[622,5,290,275,0,122.05000000000001,212.5],[5,285,290,275,0,122.05000000000001,212.5],[300,285,290,275,0,122.05000000000001,212.5],[595,285,290,275,0,122.05000000000001,212.5],[5,565,290,275,0,122.05000000000001,212.5],[300,565,290,275,0,122.05000000000001,212.5],[595,565,294,275,0,122.05000000000001,212.5],[5,845,290,275,0,122.05000000000001,212.5],[300,845,290,275,0,122.05000000000001,212.5],[595,845,317,275,0,149.05,212.5]],
      animations: {
        idle: 0,
        idle2: 5,
        idle3: 11,
        atira: [1, 5, "idle2",0.5],
        arma: [6, 11, "idle3",0.5]
    }
});

    var spriteSheet2 = new createjs.SpriteSheet({
      framerate: 20,
      images: [caminho+"macacoarqueiro.png"],
      frames: [[0,0,317,419,0,149.05,212.5],[319,0,290,419,0,122.05000000000001,212.5],[611,0,290,419,0,122.05000000000001,212.5],[0,421,290,419,0,122.05000000000001,212.5],[292,421,290,419,0,122.05000000000001,212.5],[584,421,290,419,0,122.05000000000001,212.5],[0,842,290,419,0,122.05000000000001,212.5],[292,842,290,419,0,122.05000000000001,212.5],[584,842,294,419,0,122.05000000000001,212.5],[0,1263,290,419,0,122.05000000000001,212.5],[292,1263,290,419,0,122.05000000000001,212.5],[584,1263,317,419,0,149.05,212.5]],
      animations: {
        idle: 0,
        idle2: 5,
        idle3: 11,
        atira: [1, 5, "idle2",0.5],
        arma: [6, 11, "idle3",0.5]
    }
});	
    if(personagem=="macaco"){
        spriteSheet=spriteSheet2;
    }else{
        spriteSheet=spriteSheet1;
    }
    
    arqueiro = new createjs.Sprite(spriteSheet, "idle");
    stage.addChild(arqueiro);
    arqueiro.x=1010;
    arqueiro.y=360;

    perguntas = new createjs.Container();

    stage.addChild(content);
    stage.addChild(perguntas);
    stage.addChild(telaEscolha);

    if (_btiniciar != null) {
        btinicia = new createjs.Bitmap(caminho + _btiniciar);
    } else {
        btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
    }
    btinicia.image.onload = function(){};
    stage.addChild(btinicia);
    btinicia.on("click", function() {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        btinicia.visible=false;
        inicio1=true;
        montaFase();

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
