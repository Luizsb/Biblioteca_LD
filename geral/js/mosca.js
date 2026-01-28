var AppMosca = function (_canvas) {
    var canvas;
    var stage;
    var content;
    var contenthit;
    var fundo;
    var agua;
    var positivo;
    var inicio1 = false;
    var btinicia;
    var respostas = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var moscas = [];
    var posX = [160, 490, 797, 1100];
    var seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var palavras = [];
    var word_count = 0;
    var hits = [];
    var edgeOffset = 10;
    var count = 1;
    var si = 0;
    var spmosca1;
    var spmosca2;
    var spmao;
    var countTempo = 0;
    var btcontinuar;
    var score = 0;
    var label;
    var score = 0;
    var intervalo = 60;
    var velocidade = 2000;
    var erro = 0;
    var nuvem1;
    var nuvem2;
    var nuvem3;
    var nuvem4;
    var update = true;

    init1();

    function init1() {
        canvas = document.getElementById(_canvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        contenthit = new createjs.Container();
        content = new createjs.Container();

        fundo = new createjs.Bitmap("resources/image/fundo_od1.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);


        stage.addChild(content);
        stage.addChild(contenthit);

        var spriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            "images": ["resources/image/fumaca.png"],
            "frames": { "regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200 },
            "animations": {
                "idle": 20,
                "fumaca1": [0, 9, "idle"],
                "fumaca2": [10, 19, "idle"]
            }
        });
        agua = new createjs.Sprite(spriteSheet, "idle");
        stage.addChild(agua);

        positivo = new createjs.Bitmap("resources/image/positivo.png");
        positivo.image.onload = function () { };
        stage.addChild(positivo);
        positivo.x = 430;
        positivo.y = 100;
        positivo.visible = false;

        nuvem1 = new createjs.Bitmap("resources/image/nuvem1.png");
        nuvem1.image.onload = function () { };
        content.addChild(nuvem1);
        nuvem1.x = 0;
        nuvem1.y = 0;

        nuvem2 = new createjs.Bitmap("resources/image/nuvem1.png");
        nuvem2.image.onload = function () { };
        content.addChild(nuvem2);
        nuvem2.x = 0;
        nuvem2.y = -645;

        nuvem3 = new createjs.Bitmap("resources/image/n1.png");
        nuvem3.image.onload = function () { };
        stage.addChild(nuvem3);
        nuvem3.x = 50;
        nuvem3.y = 0;
        nuvem4 = new createjs.Bitmap("resources/image/n2.png");
        nuvem4.image.onload = function () { };
        stage.addChild(nuvem4);
        nuvem4.x = 600;
        nuvem4.y = -500;

        btcontinuar = new createjs.Bitmap("resources/image/continuar.png");
        btcontinuar.image.onload = function () { };
        stage.addChild(btcontinuar);
        btcontinuar.x = 750;
        btcontinuar.y = 550;
        btcontinuar.alpha = 0.8;
        btcontinuar.visible = false;
        btcontinuar.on("click", function () {
            btcontinuar.visible = false;
            inicio1 = true;
        });

        btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
        btinicia.image.onload = function () { };
        content.addChild(btinicia);
        btinicia.x = 400;
        btinicia.y = 255;
        btinicia.on("click", function () {
            btinicia.visible = false;
            inicio1 = true;
            countTempo = 0;
            score = 0;
            erro = 0;
            word_count = 0;
            nasceMosca();
            count += 1;
        });
        var pause1 = new createjs.Bitmap("resources/image/pause1.png");
        pause1.image.onload = function () { };
        stage.addChild(pause1);
        pause1.x = 1170;
        pause1.y = 620;
        pause1.on("click", function () {
            pause2.visible = true;
            update = true;
        });
        var pause2 = new createjs.Bitmap("resources/image/pause2.png");
        pause2.image.onload = function () { };
        stage.addChild(pause2);
        pause2.x = 1170;
        pause2.y = 620;
        pause2.on("click", function () {
            this.visible = false;
            update = false;
        });
        pause1.visible = false;
        pause2.visible = false;


        shuffle(seq);
        console.log(seq);

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

    function Fim() {
        var img;
        var bo;
        var continua = false;
        contenthit.removeAllChildren();
        if (score >= 7) {
            som2();
            img = "resources/image/positivo.png";
            continua = true;
        } else {
            som3();
            img = "resources/image/tentenovamente.png";
            continua = true;
        }

        if (continua) {
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = 165;
            bo.regY = 280;
            bo.x = 640;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).to({ y: 350 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                inicio1 = true;
                countTempo = 0;
                score = 0;
                erro = 0;
                word_count = 0;
                count = 0;
                nasceMosca();
                count += 1;

            });
        }
    }
    function ticker(event) {
        if (update) {
            stage.update();
            if (inicio1) {
                if (nuvem1.y > 720) {
                    nuvem1.y = -645;
                } else {
                    nuvem1.y += 1;
                }
                if (nuvem2.y > 720) {
                    nuvem2.y = -645;
                } else {
                    nuvem2.y += 1;
                }
                if (nuvem3.y > 720) {
                    nuvem3.y = -645;
                } else {
                    nuvem3.y += 30;
                }
                if (nuvem4.y > 720) {
                    nuvem4.y = -645;
                } else {
                    nuvem4.y += 30;
                }
            }

            countTempo++;
            if (countTempo >= intervalo && inicio1) {
                nasceMosca();
                countTempo = 0;
                count += 1;
                if (count > 20) {
                    inicio1 = false;
                    createjs.Tween.get(this).wait(3000).call(Fim);
                }

            }
        }
    }
    function nasceMosca() {
        var mos;

        mos = new createjs.Bitmap("resources/image/f" + seq[count] + ".png");
        mos.name = seq[count];
        contenthit.addChild(mos);
        mos.regX = mos.regY = 316 / 2;
        var t = Math.round(Math.random() * 3);
        console.log(t);
        mos.x = posX[t];
        mos.y = -320;
        mos.on("mousedown", function (evt) {
            if (this.name < 5) {
                agua.x = stage.mouseX;
                agua.y = stage.mouseY;
                agua.gotoAndPlay("fumaca1");
                console.log(this.name);
                contenthit.removeChild(this);
                animaCerto("certo", this.x, this.y + 120);
                som0();
                score += 1;

            } else {
                animaCerto("errado", this.x, this.y + 120);
                som1();
                erro++;
                if (erro > 3) {
                    inicio1 = false;
                    Fim();
                }
            }
        });
        createjs.Tween.get(mos).to({ y: 360 }, velocidade, createjs.Ease.quadOut).to({ y: 850 }, velocidade, createjs.Ease.quadIn).call(sapoengole);

    }
    function animaCerto(a, b, c) {
        var certo;
        certo = new createjs.Bitmap("resources/image/" + a + ".png");
        contenthit.addChild(certo);
        certo.x = b;
        certo.y = c;
        certo.regX = 160;
        certo.regY = 160;
        certo.scaleX = certo.scaleY = 0.1;
        createjs.Tween.get(certo).to({ scaleX: 0.6, scaleY: 0.6 }, 500, createjs.Ease.quadOut).wait(1500).call(apagaicone);
    }
    function apagaicone(e) {
        contenthit.removeChild(this);
    }
    function sapoengole(e) {
        contenthit.removeChild(this);
    }
    function intersect(obj1, obj2) {
        var objBounds1 = obj1.getBounds().clone();
        var objBounds2 = obj2.getBounds().clone();
        if (obj1.x > (obj2.x - edgeOffset) &&
            obj1.x < (obj2.x + objBounds2.width + edgeOffset) &&
            obj1.y > (obj2.y - edgeOffset) &&
            obj1.y < (obj2.y + objBounds2.height + edgeOffset)
        )
            return true;
        else
            return false;
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
    function som3() {
        document.getElementsByTagName('audio')[3].play();

    }
}