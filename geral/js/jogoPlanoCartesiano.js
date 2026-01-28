var AppSeleciona = function (idCanvas, itens, matrix, _bt_iniciar) {
    'use strict';
    var caminho = "resources/image/",
    canvas,
    stage,
    contentIso,
    contentReto,
    icones,
    count = 0,
    subCount = 0,
    mapaIso = [],
    mapaReto = [],
    clicavel = true,
    desenhando = false,
    circuloTemp,
    circulo,
    pos = [],
    modoEdicao = false,
    mostraBolinhas = false,
    offsetX = 400,
    offsetY = 200,
    sizeQuad = 45,
    tileW=80,
    tileH=40,
    i_erros = 0,
    i_acertos = 0,
    tileSheet,
    tiles,
    fumacinha,
    agua,
    acertou=false,
    pontosRequeridos=0,
    txtGui,
    respostaAtual,
    perguntaAtual,
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
    perguntasAnteriores=[],
    mira;

    var index;
    for (index in sons) {
        var t = sons[index];
        sons[index] = new Audio(caminho + t);
    }

    canvas = document.getElementById("od1");
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    contentIso = new createjs.Container();
    contentReto = new createjs.Container();
    icones = new createjs.Container();

    var fundo = new createjs.Bitmap(caminho + "fundo.png");
    fundo.image.onload = function () {};

    stage.addChild(fundo);

    mira = new createjs.Bitmap(caminho + "grid.png");
    mira.image.onload = function () {};
    stage.addChild(mira);

    stage.addChild(contentIso);
    stage.addChild(contentReto);
    stage.addChild(icones);

    var btinicia = new createjs.Bitmap(caminho + _bt_iniciar);
    btinicia.image.onload = function () {};
    stage.addChild(btinicia);
    btinicia.on("click", function () {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        btinicia.visible = false;

        montaMapaReto();

    });

    createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", ticker);
    createjs.MotionGuidePlugin.install();


    function montaMapaReto() {
        clicavel=true;
        contentReto.removeAllChildren();
        icones.removeAllChildren();

        var rand=Math.floor(Math.random()*itens[count].pergunta.length);
        var i, j, w = 0, z = 0;
        for(i=0;i<10;i++){
            if(perguntasAnteriores.indexOf(itens[count].pergunta[rand])<0){
                perguntasAnteriores.push(itens[count].pergunta[rand]);
                break;
            }else{
                rand=Math.floor(Math.random()*itens[count].pergunta.length);
            }
        }

        perguntaAtual = new createjs.Text(itens[count].pergunta[rand], "bold 80px VAG Rounded BT", "#ffffff");
        perguntaAtual.textAlign='center';
        contentReto.addChild(perguntaAtual);
        perguntaAtual.x=-300;
        createjs.Tween.get(perguntaAtual).to({x: 640}, 1000, createjs.Ease.backOut);
        perguntaAtual.y=80;
        respostaAtual=itens[count].pergunta[rand];

        for (i = 0; i < matrix.length; i++) {
            for (j = 0; j < matrix[0].length; j++) {
                var bt = new createjs.Bitmap(caminho + "bolinha.png");
                bt.image.onload = function () {};

                if(matrix[i][j] !='(F,F)'){
                    contentReto.addChild(bt);
                }

                bt.resposta=matrix[i][j];
                bt.px=bt.x=j * sizeQuad + offsetX;
                bt.py=bt.y=i * sizeQuad + offsetY;
                bt.alpha=0.01;


                bt.on("mousedown", function () {
                    if(clicavel){
                        console.log(this.resposta);

                        this.alpha=1;
                        if(respostaAtual==this.resposta){
                            clicavel=false;
                            i_acertos++;
                            sons[0].play();
                            animaIco('certo',this.px+20,this.py-10,0.25);
                            createjs.Tween.get(contentReto).wait(1500).call(proxima);
                        }else{
                            i_erros++;
                            sons[1].play();
                            animaIco('errado',this.px+20,this.py-10,0.25);
                        }
                    }

                });




            }
        }
    }
    function proxima(){

        count++;
        if(count>itens.length-1){
            Fim();
        }else{
            montaMapaReto();
        }
    }

    function criaTexto(texto, largura, tamanhoFonte) {

        var txt = new createjs.Text(texto, "bold " + tamanhoFonte + "px VAG Rounded BT", "#000000");
        txt.lineWidth = largura;

        var tamX = txt.getBounds().width;
        var tamY = txt.getBounds().height;

        txt.regY = tamY / 2;
        txt.textAlign = "center";

        var t = new createjs.Container();
        t.addChild(txt);

        return t;

    }

    function animaIco(qual, b, c, escala) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        icones.addChild(ico);
        ico.x = b + 10;
        ico.y = c;
        ico.regX = 150;
        ico.regY = 150;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({
            scaleX: escala,
            scaleY: escala
        }, 350, createjs.Ease.backOut);
    }

    function Fim() {
        var img;
        var bo;
        var continua = false;

        contentReto.removeAllChildren();
        icones.removeAllChildren();
        var score = new createjs.Text('Pontos:'+i_acertos, "bold 60px VAG Rounded BT", "#ffffff");
        score.textAlign='center';
        contentReto.addChild(score);
        score.x=640;
        score.y=50;
        score = new createjs.Text('Erros:'+i_erros, "bold 60px VAG Rounded BT", "#ffffff");
        score.textAlign='center';
        contentReto.addChild(score);
        score.x=640;
        score.y=120;

        if(i_erros>=9){
            img=caminho+"tentenovamente.png";
            continua=true;
            sons[2].play();

        }else{
            img=caminho+"positivo.png";
            continua=true;
            sons[3].play();

        }

        if (continua) {

            bo = new createjs.Bitmap(img);
            bo.image.onload = function () {};
            bo.regX = 269 / 2;
            bo.regY = 450 / 2;
            bo.x = 640;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).wait(1000).to({y: 470}, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                clicavel=true;
                count=0;
                i_acertos=0;
                i_erros=0;
                perguntasAnteriores=[];
                montaMapaReto();

            });
        }

    }

    function ticker() {
        stage.update();

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
};