var AppQuebracopos = function (idCanvas) {
    var caminho = "resources/image/";
    var canvas;
    var stage;
    var fundo;
    var conta;
    var btinicia;
    var tenor;
    var ondaSonora;
    var inicio = false;
    var copos = [];
    var tenorAtivado = false;
    var indiceBarra = 0;
    var barrinha, barrinhaFundo;
    var voztenor;
    var positivo;
    var tente;
    var tempo = 0;
    var relogio;

    init1();

    function init1() {
        voztenor = new Audio(caminho + "cantotenor.mp3");

        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;

        var fundo = new createjs.Bitmap(caminho + "fundo.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);

        conta = new createjs.Container();
        stage.addChild(conta);

        var spriteRelogio = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "relogio3.png"],
            frames: [[0, 0, 200, 214, 0, 100, 107], [202, 0, 200, 214, 0, 100, 107], [404, 0, 200, 214, 0, 100, 107], [606, 0, 200, 214, 0, 100, 107], [808, 0, 200, 214, 0, 100, 107], [0, 216, 200, 214, 0, 100, 107], [202, 216, 200, 214, 0, 100, 107], [404, 216, 200, 214, 0, 100, 107], [606, 216, 200, 214, 0, 100, 107], [808, 216, 200, 214, 0, 100, 107], [0, 432, 200, 214, 0, 100, 107], [202, 432, 200, 214, 0, 100, 107], [404, 432, 200, 214, 0, 100, 107], [606, 432, 200, 214, 0, 100, 107], [808, 432, 200, 214, 0, 100, 107], [0, 648, 200, 214, 0, 100, 107], [202, 648, 200, 214, 0, 100, 107], [404, 648, 200, 214, 0, 100, 107], [606, 648, 200, 214, 0, 100, 107], [808, 648, 200, 214, 0, 100, 107], [0, 864, 200, 214, 0, 100, 107], [202, 864, 200, 214, 0, 100, 107], [404, 864, 200, 214, 0, 100, 107], [606, 864, 200, 214, 0, 100, 107], [808, 864, 200, 214, 0, 100, 107], [0, 1080, 200, 214, 0, 100, 107], [202, 1080, 200, 214, 0, 100, 107], [404, 1080, 200, 214, 0, 100, 107], [606, 1080, 200, 214, 0, 100, 107], [808, 1080, 200, 214, 0, 100, 107], [0, 1296, 200, 214, 0, 100, 107], [202, 1296, 200, 214, 0, 100, 107], [404, 1296, 200, 214, 0, 100, 107], [606, 1296, 200, 214, 0, 100, 107], [808, 1296, 200, 214, 0, 100, 107], [0, 1512, 200, 214, 0, 100, 107], [202, 1512, 200, 214, 0, 100, 107]],
            animations: {
                "idle": 0,
                "idle2": 36,
                "tempo1": [0, 36, "idle2", 0.17]
            }
        });
        var spriteTenor = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "tenor.png"],
            frames: [[5, 5, 173, 471, 0, -97.9, 219.45], [183, 5, 174, 472, 0, -102.9, 220.45], [362, 5, 176, 473, 0, -117.9, 221.45], [543, 5, 243, 474, 0, -89.9, 222.45], [791, 5, 330, 474, 0, -47.9, 222.45], [5, 484, 327, 474, 0, -48.9, 222.45], [337, 484, 322, 474, 0, -51.9, 222.45]],
            animations: {
                idle: 0,
                idle2: 6,
                paraCantar: [6, 5, 4, 3, 2, 1, 0, "idle", 0.7],
                canta: [0, 6, "idle2", 0.7]
            }
        });
        var spriteOnda = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "ondaSonora.png"],
            frames: [[5, 5, 321, 325, 0, 4.05, 163.55], [331, 5, 263, 293, 0, -19.95, 147.55], [599, 5, 267, 309, 0, -32.95, 155.55], [871, 5, 252, 261, 0, 4.05, 131.55], [1128, 5, 257, 277, 0, -7.95, 139.55], [5, 335, 267, 309, 0, -32.95, 155.55], [277, 335, 272, 325, 0, -44.95, 163.55], [554, 335, 257, 277, 0, -7.95, 139.55], [816, 335, 263, 293, 0, -19.95, 147.55], [1084, 335, 272, 325, 0, -44.95, 163.55], [5, 665, 252, 261, 0, 4.05, 131.55], [262, 665, 263, 293, 0, -19.95, 147.55], [530, 665, 267, 309, 0, -32.95, 155.55]],
            animations: {
                idle: 0,
                idle2: 6,
                canta: [0, 6, "canta", 0.7]
            }
        });

        var spriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            "images": [caminho + "fumaca.png"],
            "frames": { "regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200 },
            "animations": {
                "idle": 20,
                "fumaca1": [0, 9, "idle"],
                "fumaca2": [10, 19, "idle"]
            }
        });
        montaCopos();

        ondaSonora = new createjs.Sprite(spriteOnda, "canta");
        stage.addChild(ondaSonora);
        ondaSonora.x = 410;
        ondaSonora.y = 315;
        ondaSonora.visible = false;

        tenor = new createjs.Sprite(spriteTenor, "idle");
        stage.addChild(tenor);
        tenor.scaleX = -1;
        tenor.x = 550;
        tenor.y = 390;
        tenor.on("click", function () {
            if (inicio) {
                if (!tenorAtivado) {
                    tenor.gotoAndPlay('canta');
                    tenorAtivado = true;
                    ondaSonora.visible = true;
                    voztenor.play();
                    voztenor.looping = true;
                }
                if (indiceBarra == 1) {
                    tenor.gotoAndStop('idle');
                    ondaSonora.visible = false;
                    barrinhaFundo.visible = false;
                    barrinha.visible = false;
                    positivo.visible = true;
                    positivo.y = 900;
                    createjs.Tween.get(positivo).wait(800).to({ y: 100 }, 500, createjs.Ease.backOut);
                    inicio = false;
                    relogio.y = 900;
                }
                if (indiceBarra > 0 && indiceBarra < 1) {
                    voztenor.play();
                }
                indiceBarra += 0.05;
                var calculoDoido = 10 - Math.floor(indiceBarra * 10);
                if (!copos[calculoDoido].quebrado) {
                    copos[calculoDoido].gotoAndPlay("quebra");
                    var vidro = new Audio(caminho + "vidro.mp3");
                    vidro.play();
                    vidro.volume = 0.25;
                    copos[calculoDoido].quebrado = true;
                }
            }
        });

        barrinhaFundo = new createjs.Bitmap(caminho + "barrinha_fundo.png");
        barrinhaFundo.image.onload = function () { };
        stage.addChild(barrinhaFundo);
        barrinhaFundo.x = 600;
        barrinhaFundo.y = 100;

        barrinha = new createjs.Bitmap(caminho + "barrinha.png");
        barrinha.image.onload = function () { };
        stage.addChild(barrinha);
        barrinha.x = 622;
        barrinha.y = 109;
        barrinha.scaleX = 0;

        positivo = new createjs.Bitmap(caminho + "positivo.png");
        stage.addChild(positivo);
        positivo.x = 750;
        positivo.y = 100;
        positivo.visible = false;
        positivo.on("click", function () {
            reseta();
        });

        tente = new createjs.Bitmap(caminho + "tentenovamente.png");
        stage.addChild(tente);
        tente.x = 750;
        tente.y = 100;
        tente.visible = false;
        tente.on("click", function () {
            reseta();
        });

        relogio = new createjs.Sprite(spriteRelogio, "idle");
        stage.addChild(relogio);
        relogio.x = 1160;
        relogio.y = 900;

        btinicia = new createjs.Bitmap(caminho + "bt_inicio.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            this.visible = false;
            inicio = true;

            relogio.gotoAndPlay("tempo1");
            relogio.y = 900;
            relogio.scaleX = relogio.scaleY = 0.7;
            createjs.Tween.get(relogio).to({ y: 600, rotation: 10 }, 250, createjs.Ease.backOut).wait(350).to({ rotation: -5 }, 250, createjs.Ease.backOut);
        });
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function reseta() {
        positivo.visible = false;
        tente.visible = false;
        conta.removeAllChildren();
        montaCopos();
        indiceBarra = 0;
        tenorAtivado = false;
        barrinhaFundo.visible = true;
        barrinha.visible = true;
        tempo = 0;
        inicio = true;
        relogio.gotoAndPlay("tempo1");
        relogio.y = 900;
        relogio.scaleX = relogio.scaleY = 0.7;
        createjs.Tween.get(relogio).to({ y: 600, rotation: 10 }, 250, createjs.Ease.backOut).wait(350).to({ rotation: -5 }, 250, createjs.Ease.backOut);
    }
    function montaCopos() {
        var spriteCup = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "cupglass.png"],
            frames: [[5, 5, 78, 131, 0, -3.799999999999997, 1.6999999999999993], [88, 5, 79, 131, 0, -0.7999999999999972, 1.6999999999999993], [172, 5, 79, 131, 0, -7.799999999999997, 1.6999999999999993], [256, 5, 79, 131, 0, -3.799999999999997, 1.6999999999999993], [340, 5, 78, 131, 0, -3.799999999999997, 1.6999999999999993], [423, 5, 78, 131, 0, -3.799999999999997, 1.6999999999999993], [5, 141, 93, 129, 0, 7.200000000000003, 2.6999999999999993], [103, 141, 127, 139, 0, 21.200000000000003, 14.7], [235, 141, 162, 137, 0, 35.2, 17.7], [5, 285, 213, 117, 0, 66.2, -17.3], [223, 285, 209, 93, 0, 57.2, -45.3], [437, 285, 0, 0, 0, 0.20000000000000284, 0.6999999999999993]],
            animations: {
                idle: 0,
                idle2: 11,
                quebra: [0, 11, "idle2", 0.7]
            }
        });

        copos = [];
        var i;
        var j = 0;
        var margemX = 660;
        var margemY = 370;
        for (i = 0; i < 11; i++) {
            copos[i] = new createjs.Sprite(spriteCup, 'idle');
            conta.addChild(copos[i]);
            copos[i].x = margemX + j * 80;
            copos[i].y = margemY;
            copos[i].quebrado = false;
            if (i == 5) {
                j = 0;
                margemX = 615;
                margemY = 245;
            }
            j++;
        }
    }
    function ticker(event) {
        stage.update();

        if (inicio) {
            if (tempo < 220) {
                if (indiceBarra > 0 && indiceBarra < 1) {
                    indiceBarra -= 0.005;

                } else if (indiceBarra >= 1) {
                    indiceBarra = 1;
                    voztenor.pause();
                    ondaSonora.visible = false;
                } else {
                    indiceBarra = 0;
                    voztenor.pause();
                    tenorAtivado = false;
                    tenor.gotoAndStop('idle');
                    ondaSonora.visible = false;
                }
                barrinha.scaleX = indiceBarra;
                if ((indiceBarra + 0.25) < 1) {
                    voztenor.volume = indiceBarra + 0.25;
                }
            } else {
                inicio = false;
                tente.visible = true;
                tente.y = 900;
                createjs.Tween.get(tente).wait(800).to({ y: 100 }, 500, createjs.Ease.backOut);
            }
            tempo += 1;
        }
    }
}