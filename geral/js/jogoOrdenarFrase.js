var AppOrdenarFrase=function(idCanvas,idFundo,_itens,posicaoBotoesY,posicaoFraseY,tamanhoFonte1,espacamentoFonte,tamanhoFonteBt,textoCorrige,trocaGui){

    'use strict';
    var canvas2,
    stage2,
    botoes2,
    conta2,
    count2=0,
    subCount=0,


    palavraFormada2='',



    inicio2=false,
    btinicia2,
    fumacinha2,

    gui2,
    i_acertos2=0,
    i_erros2=0,
    sons2 = ["tambor.mp3","pop.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
    caminho= "resources/image/";


    function criaGui2(){
        var gui2 = new createjs.Container();
        conta2.addChild(gui2);
        if(trocaGui != undefined){
            console.log(trocaGui);
            var _gui = new createjs.Bitmap(caminho+trocaGui);
            _gui.image.onload = function(){};
        }else{
            var _gui = new createjs.Bitmap(caminho+"gui.png");
            _gui.image.onload = function(){};
        }

        var txt_a = new createjs.Text(i_acertos2, "bold 40px VAG Rounded BT", "#000000");
        txt_a.textAlign = "left";
        txt_a.x=220;
        txt_a.y=25;

        var txt_e = new createjs.Text(i_erros2, "bold 40px VAG Rounded BT", "#b10000");
        txt_e.textAlign = "left";
        txt_e.x=510;
        txt_e.y=25;

        gui2.addChild(_gui);
        gui2.addChild(txt_a);
        gui2.addChild(txt_e);

    }
    function montabotoes2(){
        shuffle(_itens[count2].palavras);
        inicio2=true;
        botoes2.removeAllChildren();
        var offset=0;
        var coluna=0;
        for(i=0;i<_itens[count2].palavras.length;i++){
            if(offset>1000){
                offset=0;
                coluna++;
            }

            var bt=caixaTexto2(_itens[count2].palavras[i].toUpperCase());
            botoes2.addChild(bt);
            bt.name=_itens[count2].palavras[i];
            offset+=bt.tx/2;
            bt.x=offset+30;


            bt.y=900;
            createjs.Tween.get(bt).wait(50*i).to({y:posicaoBotoesY-100*coluna},150,createjs.Ease.backOut);
            offset+=bt.tx/2+20;

            bt.on("mousedown", function() {
                if(inicio2){
                    subCount++;

                    sons2[0].play();
                    fumacinha2.gotoAndPlay("fumaca1");
                    fumacinha2.x = this.x;
                    fumacinha2.y = this.y;
                    palavraFormada2+=this.name+" ";
                    botoes2.removeChild(this);
                    formulaPergunta2("nova");
                    if(subCount>=_itens[count2].palavrasCertas.length){
                        corrigir();
                    }
                }
            });

        }
    }
    function formulaPergunta2(modo){
        conta2.removeAllChildren();

        var i;
        var px;
        var correcao=0;
        var hifens=0;
        var posicaoX=0;
        for(i=0;i<palavraFormada2.length;i++){
            var txt = new createjs.Text(palavraFormada2[i], tamanhoFonte1+" VAG Rounded BT", "#ffffff");
            txt.regY=60;
            txt.regX=txt.getBounds().width/2;
            txt.textAlign = "center";
            txt.shadow = new createjs.Shadow("#06464e", 5, 5, 0);

            conta2.addChild(txt);

            if(modo=="nova"){
                txt.y=100;
                createjs.Tween.get(txt).wait(5*i).to({y:posicaoFraseY},50,createjs.Ease.backOut);
            }else{
                txt.y=posicaoFraseY;
            }
            var sizeLet=txt.getBounds().width;
            posicaoX+=sizeLet;

            px=posicaoX+640-(palavraFormada2.length/2)*espacamentoFonte;
            txt.x=px;

        }


        var btcorrige=caixaTexto2(textoCorrige);
        conta2.addChild(btcorrige);
        btcorrige.x=1100;
        btcorrige.y=50;
        btcorrige.on("mousedown", function() {
            corrigir();
        });


    }
    function corrigir(){
        subCount=0;
        inicio2=false;
        var i;
        var verificaFrase='';
        conta2.removeChild(this);
        for(i=0;i<_itens[count2].palavrasCertas.length;i++){
            verificaFrase+=_itens[count2].palavrasCertas[i]+" ";
        }
        var resultado=false;
        if(palavraFormada2==verificaFrase){
            resultado=true;
        }
        var meio=640+(palavraFormada2.length/2)*espacamentoFonte;
        if(resultado){
            animaIco2("certo",meio, posicaoFraseY);
            sons2[1].play();
            i_acertos2++;
            particulas2(640,200);
            count2++;
        }else{
            animaIco2("errado",meio, posicaoFraseY);
            sons2[2].play();
            i_erros2++;
        }
        createjs.Tween.get(this).wait(2000).call(proxima2);
    }
    function explode2(a,b){
        sons2[0].play();
        fumacinha2.gotoAndPlay("fumaca1");
        fumacinha2.x = a;
        fumacinha2.y = b;
        fumacinha2.scaleX=fumacinha2.scaleY=1;
    }
    function proxima2(){
        if(count2<_itens.length){
            conta2.removeAllChildren();
            palavraFormada2='';
            montabotoes2();
            if(i_erros2>2){
                verificaFim2();
            }
        }else{
          verificaFim2();
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

function verificaFim2(){
    var img;
    var bo;
    var continua=false;
    conta2.removeAllChildren();
    botoes2.removeAllChildren();
    criaGui2();
    if(i_erros2>2){
        img=caminho+"tentenovamente.png";
        continua=true;
        sons2[2].play();
    }else{
        img=caminho+"positivo.png";
        continua=true;
        sons2[3].play();
    }
    if(continua){
       inicio2=false;
       bo = new createjs.Bitmap(img);
       bo.image.onload = function(){};
       bo.regX=269/2;
       bo.regY=450/2;
       bo.x=700;
       bo.y=1100;
       stage2.addChild(bo);
       createjs.Tween.get(bo).wait(100).to({y:posicaoFraseY},1000,createjs.Ease.backOut);
       bo.on("mousedown", function (evt) {
           stage2.removeChild(this);
           stage2.removeChild(gui2);
           conta2.removeAllChildren();
           palavraFormada2='';
           count2=0;
           i_acertos2=0;
           i_erros2=0;
           montabotoes2();
       });


   }

}
function animaIco2(qual,b,c){
    var ico;
    ico = new createjs.Bitmap(caminho+qual+".png");
    stage2.addChild(ico);
    ico.x = b;
    ico.y = c;
    ico.regX=315/2;
    ico.regY=315/2;
    ico.scaleX=ico.scaleY=0.1;
    createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut).wait(750).call(deleta);
}
function deleta(){
    stage2.removeChild(this);
}
function caixaTexto2(texto){

	var txt = new createjs.Text(texto, tamanhoFonteBt+" VAG Rounded BT", "#000000");

	var tamX=txt.getBounds().width+80;
	var tamY=txt.getBounds().height+50;

	txt.regY=tamY/2-35;
    txt.textAlign = "center";

    var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
    button.graphics.drawRoundRect(0,0,tamX,tamY,20);
    button.graphics.endFill();
    button.regX=tamX/2;
    button.regY=tamY/2;

    var t = new createjs.Container();
    t.addChild(button);
    t.addChild(txt);
    t.tx=tamX;

    return t;

}
function particulas2(tx,ty){
	var cont = new createjs.Container();
	var rotations=[0,90,120,180,270];
    var i;
    for(i=0;i<5;i++){
      var b = new createjs.Bitmap(caminho+"brilho2.png");
      b.image.onload = function(){};
      b.regX=575;
      b.regY=55;
      b.rotation=rotations[i];
      b.scaleX=b.scaleY=0.1;
      createjs.Tween.get(b).wait(i*60).to({scaleX:1,scaleY:1},800,createjs.Ease.quadOut).wait(500+i*120).to({alpha:0},1000,createjs.Ease.linear);
      cont.addChild(b);
  }
  var b = new createjs.Bitmap(caminho+"brilho1.png");
  b.image.onload = function(){};
  b.regX=107;
  b.regY=107;
  b.scaleX=b.scaleY=0.1;
  createjs.Tween.get(b).wait(60).to({scaleX:1,scaleY:1},800,createjs.Ease.backOut).wait(600).to({alpha:0},2000,createjs.Ease.linear);
  cont.addChild(b);

  var r=Math.random()*360;
  cont.rotation=r;
  createjs.Tween.get(cont).to({rotation:r+45},3000,createjs.Ease.linear).call(apaga2);
  stage2.addChild(cont);
  cont.alpha=0.5;
  cont.x=tx;
  cont.y=ty;
}
function apaga2(){
	stage2.removeChild(this);
}

function ticker2(event){
	stage2.update();
}

function init() {

    var index;
    for (index in sons2) {
        var t = sons2[index];
        sons2[index] = new Audio(caminho + t);
    }

    canvas2 = document.getElementById(idCanvas);
    stage2 = new createjs.Stage(canvas2);
    stage2.enableMouseOver(10);

    createjs.Touch.enable(stage2);
    stage2.enableMouseOver(10);
    stage2.mouseMoveOutside = true;

    var fundo = new createjs.Bitmap(caminho+idFundo);
    fundo.image.onload = function(){};
    stage2.addChild(fundo);

    botoes2 = new createjs.Container();
    stage2.addChild(botoes2);

    conta2 = new createjs.Container();
    stage2.addChild(conta2);

    btinicia2 = new createjs.Bitmap(caminho+"bt_iniciar.png");
    btinicia2.image.onload = function(){};
    stage2.addChild(btinicia2);
    btinicia2.on("click", function() {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
      this.visible=false;
      montabotoes2();

  });
    var spriteSheet = new createjs.SpriteSheet({
      framerate: 20,
      "images": [caminho+"fumaca.png"],
      "frames": {"regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200},
      "animations": {
        "idle": 20,
        "fumaca1": [0, 9, "idle"],
        "fumaca2": [10, 19, "idle",0.5]
    }
});
    fumacinha2 = new createjs.Sprite(spriteSheet, "idle");
    stage2.addChild(fumacinha2);

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", ticker2);
}
init();

}