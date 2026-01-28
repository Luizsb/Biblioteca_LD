var AppSonoplastia = function (_canvas, _fundo, _iniciar) {

    var caminho = "resources/image/";
    var canvas;
    var stage;
    var content;
    var contenthit;
    var contentprato;
    var c0;
    var c1;
    var c2;
    var c3;
    var c4;
    var c5;
    var camadas = [];
    var fundo;
    var seq = [0, 1, 2, 3, 4, 5, 6];
    var posX = [163, 480, 799, 1116, 320, 640, 960];
    var posY = [163, 163, 163, 163, 447, 447, 447];
    var count = 0;
    var i_acertos = 0;
    var hits = [];
    var palavras = [];
    var figuras = [];
    var inicio1 = false;
    var edgeOffsetX = 200;
    var edgeOffsetY = 200;
    var btsom;
    var btinicia;
    var positivo;
    var i_erro = 0;
    var escuro;
    var frase;
    var word_count = 0;

    init2();

    function init2() {
        canvas = document.getElementById(_canvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        contenthit = new createjs.Container();
        content = new createjs.Container();
        fundo = new createjs.Bitmap(caminho + _fundo);
        fundo.image.onload = function () { };
        stage.addChild(fundo);

        stage.addChild(content);
        stage.addChild(contenthit);

        shuffle(seq);
        montaFase();

        positivo = new createjs.Bitmap(caminho + "positivo.png");
        positivo.image.onload = function () { };
        stage.addChild(positivo);
        positivo.x = 450;
        positivo.y = 100;
        positivo.visible = false;
        positivo.on("click", function () {
            reseta();
        });

        btsom = new createjs.Bitmap(caminho + "btsom.png");
        btsom.image.onload = function () { };
        stage.addChild(btsom);
        btsom.y = 565;
        btsom.on("click", function () {
            if (inicio1) {
                inicio1 = false;
                stage.removeChild(frase);
                montafrase();
            }
        });
        btinicia = new createjs.Bitmap(caminho + _iniciar);
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            btinicia.visible = false;
            montafrase();
        });

        escuro = new createjs.Bitmap(caminho + "escuro.png");
        escuro.image.onload = function () { };
        stage.addChild(escuro);
        escuro.visible = false;

        var spriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            "images": [caminho + "spritesheet.png"],
            "frames": { "regX": 0, "height": 200, "count": 7, "regY": 0, "width": 500 },
            "animations": {
                "idle": 0,
                "wave": [0, 6, "wave"]
            }
        });

        wave = new createjs.Sprite(spriteSheet, "idle");
        stage.addChild(wave);
        wave.x = 380;
        wave.y = 250;
        wave.visible = false;

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

    function volta() {
        stage.removeChild(frase);
        inicio1 = true;
        wave.visible = false;
        wave.gotoAndStop("idle");
        escuro.visible = false;
    }

    function montafrase() {
        if (word_count < 7) {
            som3(word_count + 3);
            console.log(word_count);
            wave.gotoAndPlay("wave");
            wave.visible = true;
            escuro.visible = true;

            frase = caixaTexto("Som " + (word_count + 1), 33);
            stage.addChild(frase);
            frase.x = -1280;
            frase.y = 150;
            createjs.Tween.get(frase).to({ x: 640 }, 600, createjs.Ease.backOut).wait(6000).call(volta);
        } else {
            positivo.visible = true;
            som2();
            inicio1 = false;
        }
    }
    function montaFase() {
        var w = 0;
        var j;
        for (j = 0; j < 7; j++) {

            figuras[w] = new createjs.Bitmap(caminho + "f" + seq[w] + ".png");
            figuras[w].image.onload = function () { };
            content.addChild(figuras[w]);
            figuras[w].x = figuras[w].px = posX[w];
            figuras[w].y = figuras[w].py = posY[w];
            figuras[w].regX = 300 / 2;
            figuras[w].regY = 288 / 2;
            figuras[w].pode = true;
            figuras[w].n = seq[w];
            var tit = caixaTexto("Figura " + (w + 1), 20);

            tit.x = posX[w];
            tit.y = posY[w] + 90;
            figuras[w].on("mousedown", function (evt) {
                if (this.pode && inicio1) {
                    console.log(this.n + "   " + word_count);
                    inicio1 = false;
                    if (this.n == word_count) {
                        this.scaleX = this.scaleY = 0.5;
                        som0();
                        word_count++;
                        this.pode = false;
                        createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut).wait(1000).call(montafrase);
                        animaCerto(this.x, this.y);
                    } else {
                        som1();
                        animaErrado(this.x, this.y);
                    }
                }
            });
            w++;
        }
    }
    function caixaTexto(texto, tam) {

        var txt = new createjs.Text(texto, "bold " + tam + "px VAG Rounded BT", "#000000");

        var tamX = txt.getBounds().width + 80;
        var tamY = txt.getBounds().height + 50;

        txt.regY = tamY / 2 - 30;
        txt.textAlign = "center";

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#a3a7b1"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.regX = tamX / 2;
        button.regY = tamY / 2;

        var resp = new createjs.Container();
        resp.addChild(button);
        resp.addChild(txt);

        return resp;
    }
    function reseta() {
        positivo.visible = false;
        inicio1 = true;
        i_erro = 0;
        count = 0;
        word_count = 0;
        content.removeAllChildren();
        contenthit.removeAllChildren();
        shuffle(seq);
        montaFase();
        montafrase();
    }
    function animaCerto(b, c) {
        var certo;
        certo = new createjs.Bitmap(caminho + "certo.png");
        contenthit.addChild(certo);
        certo.x = b;
        certo.y = c + 50;
        certo.regX = 160;
        certo.regY = 160;
        certo.scaleX = certo.scaleY = 0.1;
        createjs.Tween.get(certo).to({ scaleX: 0.6, scaleY: 0.6 }, 300, createjs.Ease.backOut).wait(700);
    }
    function animaErrado(b, c) {
        var err;
        err = new createjs.Bitmap(caminho + "errado.png");
        contenthit.addChild(err);
        err.x = b;
        err.y = c + 50;
        err.regX = 160;
        err.regY = 160;
        err.scaleX = err.scaleY = 0.01;
        createjs.Tween.get(err).to({ scaleX: 0.6, scaleY: 0.6 }, 300, createjs.Ease.backOut).wait(600).call(apagaicone);
    }
    function apagaicone(e) {
        inicio1 = true;
        console.log(inicio1);
        contenthit.removeChild(this);
    }
    function ticker(event) {
        stage.update();
    }
    function som0() {
        document.getElementsByTagName('audio')[0].play();
    }
    function som1() {
        document.getElementsByTagName('audio')[1].play();
    }
    function som2() {
        document.getElementsByTagName('audio')[2].play();
    }
    function som3(i) {
        document.getElementsByTagName('audio')[i].play();
    }
}