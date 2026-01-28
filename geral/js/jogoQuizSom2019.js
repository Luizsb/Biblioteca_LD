/*
var posicaoTitulo=[640,-500];
var posicaoBolaSonora=[510,250];
var imgLargura=[552,621];
var offsetX=40;
*/
var AppQuizSom2019=function(idCanvas,idFundo,idBtInicio,posicaoTitulo,posicaoBolaSonora,imgAlturaLargura,offsetX,itens,offsetY,_enunciado,_imgGui,_embaralha){
   'use strict';
   var canvas,
   caminho="resources/image/",
   stage,
   content,
   contenthit,
   inicio1=false,
   btsom,
   btinicia,
   positivo,
   i_erros=0,
   i_acertos=0,
   escuro,
   clicavel=false,
   frase,
   wave,
   count=0,
   sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
   gui,
   resposta,
   index;
   var ttt;
   for (index in sons) {
    ttt = sons[index];
    sons[index] = new Audio(caminho + ttt);
}

canvas = document.getElementById(idCanvas);
stage = new createjs.Stage(canvas);
stage.enableMouseOver(10);
contenthit = new createjs.Container();
content = new createjs.Container();

var fundo = new createjs.Bitmap(caminho+idFundo);
fundo.image.onload = function(){};
stage.addChild(fundo);

stage.addChild(content);
stage.addChild(contenthit);
if(_embaralha == true){
    shuffle(itens);
}

positivo = new createjs.Bitmap(caminho+"positivo.png");
positivo.image.onload = function(){};
stage.addChild(positivo);
positivo.x=450;
positivo.y=100;
positivo.visible=false;
positivo.on("click", function() {
    reseta();
});

btsom = new createjs.Bitmap(caminho+"btsom.png");
btsom.image.onload = function(){};
stage.addChild(btsom);
btsom.y=565;
btsom.on("click", function() {
   if(clicavel){
      clicavel=false;
      stage.removeChild(frase);
      tocaSom();
  }
});
if(idBtInicio == null){
    idBtInicio="bt_iniciar_od6.png";

}


btinicia = new createjs.Bitmap(caminho+idBtInicio);
btinicia.image.onload = function(){};
stage.addChild(btinicia);
btinicia.on("click", function() {
    var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", ticker);
    if(_enunciado !== null){
        btinicia.visible=false;
        var enun=new Audio(caminho+_enunciado);
        console.log("Iniciei");
        enun.play();
        enun.onended = function() {
            tocaSom();
        };

    }else{
        btinicia.visible=false;
        console.log("toca o som");
        tocaSom();

    }
});
escuro = new createjs.Bitmap(caminho+"escuro.png");
escuro.image.onload = function(){};
stage.addChild(escuro);
escuro.visible=false;

var spriteSheet = new createjs.SpriteSheet({
  framerate: 20,
  images: [caminho+"wavesprite.png"],
  frames: [[0,0,240,240,0,0.25,0.4],[242,0,240,240,0,0.25,0.4],[484,0,240,240,0,0.25,0.4],[726,0,240,240,0,0.25,0.4],[0,242,240,240,0,0.25,0.4],[242,242,240,240,0,0.25,0.4],[484,242,240,240,0,0.25,0.4],[726,242,240,240,0,0.25,0.4],[0,484,240,240,0,0.25,0.4],[242,484,240,240,0,0.25,0.4],[484,484,240,240,0,0.25,0.4],[726,484,240,240,0,0.25,0.4],[0,726,240,240,0,0.25,0.4],[242,726,240,240,0,0.25,0.4],[484,726,240,240,0,0.25,0.4],[726,726,240,240,0,0.25,0.4],[0,968,240,240,0,0.25,0.4],[242,968,240,240,0,0.25,0.4],[484,968,240,240,0,0.25,0.4],[726,968,240,240,0,0.25,0.4],[0,1210,240,240,0,0.25,0.4],[242,1210,240,240,0,0.25,0.4],[484,1210,240,240,0,0.25,0.4],[726,1210,240,240,0,0.25,0.4],[0,1452,240,240,0,0.25,0.4],[242,1452,240,240,0,0.25,0.4],[484,1452,240,240,0,0.25,0.4],[726,1452,240,240,0,0.25,0.4],[0,1694,240,240,0,0.25,0.4],[242,1694,240,240,0,0.25,0.4],[484,1694,240,240,0,0.25,0.4]],
  animations: {
    idle: 20,
    toca: [0, 30, "toca"]
}
});
wave = new createjs.Sprite(spriteSheet, "toca");
stage.addChild(wave);
wave.visible=false;
wave.x=posicaoBolaSonora[0];
wave.y=posicaoBolaSonora[1];

stage.update();
setTimeout(function(){stage.update();},1000);


function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
function criaGui() {
    gui = new createjs.Container();
    stage.addChild(gui);
    gui.x = 960;
    var _gui;
    if (_imgGui != null) {
        _gui = new createjs.Bitmap(caminho + _imgGui);
    } else {
        _gui = new createjs.Bitmap(caminho + "gui.png");
    }
    _gui.image.onload = function () { };

    var txt_a = new createjs.Text(i_acertos, "bold 40px VAG Rounded BT", "#000000");
    txt_a.textAlign = "left";
    txt_a.x = 220;
    txt_a.y = 25;

    var txt_e = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#b10000");
    txt_e.textAlign = "left";
    txt_e.x = 220;
    txt_e.y = 100;

    gui.addChild(_gui);
    gui.addChild(txt_a);
    gui.addChild(txt_e);

}
function tocaSom(){
    content.removeAllChildren();
    if(count<itens.length){
        var mus= new Audio(caminho + itens[count].musica);

        clicavel=false;
        wave.visible=true;
        escuro.visible=true;
        mus.play();
        console.log(caminho + itens[count].musica);
        mus.onended = function() {
            stage.removeChild(frase);
            wave.visible=false;
            escuro.visible=false;
            clicavel=true;
            montaFase();
        };
        resposta=itens[count].certa;
        frase = criaTitulo(itens[count].titulo,33);
        stage.addChild(frase);
        frase.x = -1280;
        frase.y = posicaoTitulo[1];
        createjs.Tween.get(frase).to({x:posicaoTitulo[0]},600,createjs.Ease.backOut);
    }else{
       verificaFim();
   }
}

function montaFase(){

    var w=0;
    var j,r,i;
    var index;

    /*
    Para sortear em repetir util

    var sequencia=[];
    if(itens.length>3){
    sequencia.push(count);
    while(sequencia.length < 3){
        var randomnumber = Math.floor(Math.random()*itens.length);
        if(sequencia.indexOf(randomnumber) > -1) {
            continue;
        }
        sequencia[sequencia.length] = randomnumber;
    }
    }else{
        sequencia=[0,1,2];
    }


    */
    if(_embaralha == true){
        shuffle(itens[count].opcoes);
    }
    for(j=0;j<itens[count].opcoes.length;j++){
        var t=itens[count].opcoes[j];

        var bt = new createjs.Bitmap(caminho+t);

        content.addChild(bt);
        bt.x=bt.px=(1280/itens[count].opcoes.length)*j+imgAlturaLargura[0]/2+offsetX;
        bt.y=bt.py=950;
        bt.pode=true;
        bt.n=t;
        bt.regX=imgAlturaLargura[0]/2;
        bt.regY=imgAlturaLargura[1]/2;

        bt.image.onload = function(){};
        createjs.Tween.get(bt).wait(j*100).to({y:320},500,createjs.Ease.backOut);

        bt.on("mousedown", function (evt) {
            if(this.pode && clicavel){
                clicavel=false;
                this.pode=false;
                count++;
                this.scaleX=this.scaleY=0.5;
                createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut).wait(1000).call(tocaSom);
                if(this.n==resposta){
                    i_acertos++;
                    sons[0].play();
                    animaIco('certo.png',this.x,this.y+50);
                }else{
                    i_erros++;
                    sons[1].play();
                    animaIco('errado.png',this.x,this.y+50);
                }
            }
        });

        w++;

    }

}

function criaTitulo(texto,tam){
    var resp = new createjs.Container();

    var extensao=texto.split('.').pop();

    if(extensao=='jpg' || extensao=='png'){
        var img = new createjs.Bitmap(caminho+texto);
        img.image.onload = function(){
            img.regX=img.getBounds().width/2;
        };
        resp.addChild(img);

    }else{

        var txt = new createjs.Text(texto, "bold "+tam+"px VAG Rounded BT", "#000000");


        var tamX=txt.getBounds().width+150;
        var tamY=txt.getBounds().height+50;

        txt.regY=tamY/2-30;
        txt.textAlign = "center";

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#a3a7b1"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0,0,tamX,tamY,20);
        button.graphics.endFill();
        button.regX=tamX/2;
        button.regY=tamY/2;

        resp.addChild(button);
        resp.addChild(txt);
    }

    return resp;

}
function reseta(){
	clicavel=false;
    i_acertos = 0;
    i_erros = 0;
    count=0;
    content.removeAllChildren();
    contenthit.removeAllChildren();
    shuffle(itens);
    montaFase();
    tocaSom();
}

function animaIco(qual,b,c){
    var err;
    err = new createjs.Bitmap(caminho+qual);
    contenthit.addChild(err);
    err.x = b;
    err.y = c+50;
    err.regX=160;
    err.regY=160;
    err.scaleX=err.scaleY=0.01;
    createjs.Tween.get(err).to({scaleX:0.6,scaleY:0.6},300,createjs.Ease.backOut).wait(600).call(apagaicone);
}
function apagaicone(e){
    inicio1=true;
    contenthit.removeChild(this);

}

function verificaFim() {
    criaGui();
    var img;
    var bo;
    var continua = false;

    if(i_erros<Math.floor(itens.length/2)){
        img = caminho+"positivo.png";
        continua = true;
        sons[2].play();
    }else{
        img = caminho+"tentenovamente.png";
        continua = true;
        sons[3].play();
    }

    if (continua) {
        inicio1 = false;

        bo = new createjs.Bitmap(img);
        bo.image.onload = function () {};
        bo.regX = bo.regY = 210;
        bo.x = 700;
        bo.y = 1000;
        stage.addChild(bo);
        createjs.Tween.get(bo).wait(100).to({y: 300}, 1000, createjs.Ease.backOut);
        bo.on("mousedown", function (evt) {
            stage.removeChild(this);
            stage.removeChild(gui);
            reseta();
        });
    }

}

function ticker(event){
	stage.update();
}
}
