var AppSeleciona = function (idCanvas, itens) {
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
        offsetX = 380,
        offsetY = 180,
        sizeQuad = 45,
        tileW = 80,
        tileH = 40,
        i_erros = 0,
        i_acertos = 0,
        tileSheet,
        tiles,
        fumacinha,
        agua,
        acertou = false,
        pontosRequeridos = 0,
        txtGui,
        respostaAtual,
        perguntaAtual,
        sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
        perguntasAnteriores = [],
        mira;

    function montaMapaReto() {
        clicavel = true;
        contentReto.removeAllChildren();
        icones.removeAllChildren();

        var rand = Math.floor(Math.random() * itens[count].pergunta.length);
        var i, j, w = 0, z = 0;
        for (i = 0; i < 10; i++) {
            if (perguntasAnteriores.indexOf(itens[count].pergunta[rand]) < 0) {
                perguntasAnteriores.push(itens[count].pergunta[rand]);
                break;
            } else {
                rand = Math.floor(Math.random() * itens[count].pergunta.length);
            }
        }

        perguntaAtual = new createjs.Text(itens[count].pergunta[rand], "bold 80px VAG Rounded BT", "#ffffff");
        perguntaAtual.textAlign = 'center';
        contentReto.addChild(perguntaAtual);
        perguntaAtual.x = -300;
        createjs.Tween.get(perguntaAtual).to({ x: 640 }, 1000, createjs.Ease.backOut);
        perguntaAtual.y = 80;
        respostaAtual = itens[count].resposta[rand];

        for (i = 0; i < itens[count].cores.length; i++) {
            for (j = 0; j < itens[count].cores[0].length; j++) {
                if (typeof itens[count].cores[i][j] === "string") {
                    var txt = new createjs.Text(itens[count].cores[i][j], "bold 30px VAG Rounded BT", "#FFA002");
                    txt.textAlign = 'center';
                    contentReto.addChild(txt);
                    txt.x = j * sizeQuad + offsetX + 20;
                    txt.y = i * sizeQuad + offsetY + 10;
                } else if (itens[count].cores[i][j] >= 0) {
                    var bt = new createjs.Shape();
                    bt.graphics.setStrokeStyle(1).beginStroke("#000000").beginFill('#ffffff').drawRect(j * sizeQuad + offsetX, i * sizeQuad + offsetY, sizeQuad, sizeQuad);
                    contentReto.addChild(bt);
                    bt.resposta = j * i;
                    bt.px = j * sizeQuad + offsetX;
                    bt.py = i * sizeQuad + offsetY;

                    var txt = new createjs.Text(j * i, "bold 20px VAG Rounded BT", "#000000");
                    txt.textAlign = 'center';
                    contentReto.addChild(txt);
                    txt.x = j * sizeQuad + offsetX + 20;
                    txt.y = i * sizeQuad + offsetY + 10;

                    bt.on("mouseover", function () {
                        this.alpha = 0.7;

                    });
                    bt.on("mouseout", function () {
                        this.alpha = 1;
                    });
                    bt.on("mousedown", function () {
                        if (clicavel) {

                            this.alpha = 0.3;
                            if (respostaAtual == this.resposta) {
                                clicavel = false;
                                i_acertos++;
                                sons[0].play();
                                animaIco('certo', this.px + 10, this.py + 10, 0.25);
                                perguntaAtual.text = perguntaAtual.text + ' = ' + this.resposta;
                                createjs.Tween.get(contentReto).wait(1500).call(proxima);
                            } else {
                                i_erros++;
                                sons[1].play();
                                animaIco('errado', this.px + 10, this.py + 10, 0.25);
                            }
                        }
                    });
                    bt.on("pressup", function () {
                        this.alpha = 1;
                    });
                }
            }
        }
    }
    function proxima() {
        subCount++;
        if (subCount >= itens[count].quantidade) {
            subCount = 0;
            count++;
            if (count > itens.length - 1) {
                Fim();
            } else {
                montaMapaReto();
            }

        } else {
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
        var score = new createjs.Text('Pontos:' + i_acertos, "bold 60px VAG Rounded BT", "#ffffff");
        score.textAlign = 'center';
        contentReto.addChild(score);
        score.x = 640;
        score.y = 100;
        score = new createjs.Text('Erros:' + i_erros, "bold 60px VAG Rounded BT", "#ffffff");
        score.textAlign = 'center';
        contentReto.addChild(score);
        score.x = 640;
        score.y = 170;

        if (i_erros >= 9) {
            img = caminho + "tentenovamente.png";
            continua = true;
            sons[3].play();

        } else {
            img = caminho + "positivo.png";
            continua = true;
            sons[2].play();
        }

        if (continua) {
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = 269 / 2;
            bo.regY = 450 / 2;
            bo.x = 640;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).wait(1000).to({ y: 470 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                clicavel = true;
                count = 0;
                i_acertos = 0;
                i_erros = 0;
                perguntasAnteriores = [];
                montaMapaReto();
            });
        }
    }

    function ticker() {
        stage.update();
        mira.x = stage.mouseX;
        mira.y = stage.mouseY;

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

    var index;
    for (index in sons) {
        var t = sons[index];
        sons[index] = new Audio(caminho + t);
    }

    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    contentIso = new createjs.Container();
    contentReto = new createjs.Container();
    icones = new createjs.Container();

    var fundo = new createjs.Bitmap(caminho + "fundo_od1.png");
    fundo.image.onload = function () { };

    stage.addChild(fundo);
    stage.addChild(contentIso);
    stage.addChild(contentReto);
    stage.addChild(icones);

    var spriteSheet = new createjs.SpriteSheet({
        framerate: 20,
        "images": [caminho + "fumaca.png"],
        "frames": { "regX": 0, "height": 200, "count": 20, "regY": 0, "width": 200 },
        "animations": {
            "idle": 20,
            "fumaca1": [0, 9, "idle", 0.5],
            "fumaca2": [10, 19, "idle", 0.5]
        }
    });

    tileSheet = new createjs.SpriteSheet({
        images: [caminho + "isoTiles.png"],
        frames: {
            height: 40,
            width: 80,
            regX: 0,
            regY: 0,
            count: 10
        }
    });

    var spriteAgua = new createjs.SpriteSheet({
        framerate: 20,
        images: [caminho + "agua.png"],
        frames: [[5, 5, 126, 80, 0, 69.85, 19.049999999999997], [136, 5, 164, 86, 0, 84.85, 21.049999999999997], [305, 5, 199, 118, 0, 110.85, 41.05], [5, 128, 222, 134, 0, 125.85, 45.05], [232, 128, 231, 130, 0, 129.85, 51.05], [5, 267, 250, 118, 0, 137.85, 54.05], [5, 390, 261, 139, 0, 140.85, 78.05], [5, 534, 278, 121, 0, 143.85, 63.05], [5, 660, 305, 121, 0, 154.85, 63.05], [5, 786, 353, 110, 0, 177.85, 44.05], [5, 901, 403, 102, 0, 199.85, 33.05], [413, 901, 0, 0, 0, 0.8499999999999943, 0.04999999999999716]],
        animations: {
            "idle": 11,
            "anima": [0, 10, "idle"]
        }
    });
    agua = new createjs.Sprite(spriteAgua, "idle");
    agua.x = 300;
    agua.y = 532;
    stage.addChild(agua);
    agua.scaleX = agua.scaleY = 0.75;

    tiles = new createjs.Sprite(tileSheet);
    fumacinha = new createjs.Sprite(spriteSheet, "idle");
    stage.addChild(fumacinha);

    var btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
    btinicia.image.onload = function () { };
    stage.addChild(btinicia);
    btinicia.on("click", function () {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        btinicia.visible = false;
        montaMapaReto();
    });
    mira = new createjs.Bitmap(caminho + "mira.png");
    mira.image.onload = function () { };
    mira.regX = 1280 / 2;
    mira.regY = 720 / 2;
    mira.scaleX = mira.scaleY = 2;
    createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", ticker);
    createjs.MotionGuidePlugin.install();
};