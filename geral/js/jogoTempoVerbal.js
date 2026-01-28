appTempoVerbal = function (resp, fase1, fase2, fase3, tit) {
    var canvas;
    var stage;
    var fundo;
    var conta;
    var hits = [];
    var mascote;
    var olho;
    var olho2;
    var boca;
    var count = 0;
    var seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    var letras = ['a', 'e', 'i', 'o', 'u'];
    var ordem = 0;
    var ordemFase = [fase1, fase2, fase3];
    var words = [];
    var inicio1 = false;
    var btinicia;
    var tempoPergunta = 10000;
    var fumacinha;
    var relogio;
    var tipotween = createjs.Ease.backOut;
    var pos = [[750, 390], [750, 485], [750, 580]];
    var gui;
    var i_acertos = 0;
    var i_erros = 0;
    var txt_e;
    var piscadarate = 0;

    init1();

    function init1() {
        canvas = document.getElementById("od2");
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;

        criaFundo(0, 0, 1280, 720);

        conta = new createjs.Container();
        stage.addChild(conta);

        shuffle(seq);

        btinicia = new createjs.Bitmap("resources/bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            btinicia.visible = false;
            montaFase();
            criaGui();
            gui.visible = false;
            inicio1 = true;
        });
        var spriteRelogio = new createjs.SpriteSheet({
            framerate: 20,
            "images": ["resources/relogio.png"],
            "frames": { "regX": 100, "height": 214, "count": 13, "regY": 107, "width": 200 },
            "animations": {
                "idle": 0,
                "idle2": 12,
                "tempo1": [0, 12, "idle2", 0.006]
            }
        });
        var spriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            "images": ["resources/fumaca.png"],
            "frames": { "regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200 },
            "animations": {
                "idle": 20,
                "fumaca1": [0, 9, "idle"],
                "fumaca2": [10, 19, "idle"]
            }
        });
        fumacinha = new createjs.Sprite(spriteSheet, "idle");
        stage.addChild(fumacinha);

        relogio = new createjs.Sprite(spriteRelogio, "idle");
        stage.addChild(relogio);
        relogio.x = 1160;
        relogio.y = 900;

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function ativaTempo() {
        relogio.gotoAndPlay("tempo1");
        relogio.visible = true;
        relogio.scaleX = relogio.scaleY = 0.4;
        createjs.Tween.get(relogio, { override: true }).to({ y: 600, scaleX: 0.8, scaleY: 0.8, rotation: 10 }, 250, tipotween).wait(350).to({ rotation: -5 }, 250, tipotween);
        createjs.Tween.get(btinicia, { override: true }).wait(60000).call(tempoFim);

    }
    function montaFase() {
        ativaTempo();
        conta.removeAllChildren();
        inicio1 = true;
        var t = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 6; j++) {
                var palavras = ordemFase[ordem];
                var s = seq[t];
                words[t] = caixaTexto(palavras[s], 33, "#ffffff", "#e5e5e5");
                words[t].x = words[t].px = i * 300 + 250;
                words[t].y = words[t].py = j * 90 + 200;
                words[t].name = s;
                words[t].pode = true;
                shuffle(pos);

                words[t].scaleX = words[t].scaleY = 0.01;
                createjs.Tween.get(words[t]).wait(t * 50).to({ scaleX: 1, scaleY: 1 }, 600, tipotween);
                conta.addChild(words[t]);
                words[t].on("click", function () {
                    if (inicio1 && this.pode) {
                        this.scaleX = this.scaleY = 0.4;
                        this.rotation = 20;
                        this.pode = false;
                        createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1, rotation: 0 }, 600, tipotween);
                        if (this.name < 9) {
                            console.log('ok');
                            animaIco('certo', this.x, this.y);
                            i_acertos++;
                            count++;
                            som0();
                        } else {
                            animaIco('errado', this.x, this.y);
                            i_erros++;
                            som1();
                        }
                        if (count >= 9) {
                            verificaFim();
                        }
                    }
                });
                t++;
            }
        }
        var frase = textoContorno(tit[ordem]);
        frase.x = -550;
        frase.y = 50;
        conta.addChild(frase);
        createjs.Tween.get(frase).to({ x: 550 }, 1000, tipotween);
    }
    function criaGui() {
        gui = new createjs.Container();
        stage.addChild(gui);

        var _gui = new createjs.Bitmap("resources/erros.png");
        _gui.image.onload = function () { };

        txt_e = new createjs.Text(0, "bold 120px VAG Rounded BT", "#000000");
        txt_e.textAlign = "center";
        txt_e.x = 150;
        txt_e.y = 130;


        gui.addChild(_gui);
        gui.addChild(txt_e);
        gui.x = 200;
        gui.y = 200;

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
    function tempoFim() {
        i_erros += 2;
        verificaFim();
    }
    function verificaFim() {
        var img;
        var bo;
        var continua = false;
        inicio1 = false;
        var fase = ordemFase[ordem];
        createjs.Tween.removeTweens(btinicia);
        relogio.y = 900;

        if (ordem < 2) {
            ordem += 1;
            count = 0;
            createjs.Tween.get(this).wait(3000).call(montaFase);
        } else {
            if (i_erros > 3) {
                img = "resources/tentenovamente.png";
                continua = true;
                som3();
            } else {
                img = "resources/positivo.png";
                continua = true;
                som2();
            }
        }
        if (continua) {
            conta.removeAllChildren();
            inicio1 = false;
            gui.visible = true;
            txt_e.text = i_erros;
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = bo.regY = 210;
            bo.x = 840;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).wait(1000).to({ y: 350 }, 1000, tipotween);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                conta.removeAllChildren();
                count = 0;
                ordem = 0;
                i_acertos = 0;
                i_erros = 0;
                gui.visible = false;
                montaFase();
            });


        }
    }
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap("resources/" + qual + ".png");
        conta.addChild(ico);
        ico.x = b + 120;
        ico.y = c;
        ico.regX = 315 / 2;
        ico.regY = 315 / 2;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.3, scaleY: 0.3 }, 200, createjs.Ease.quadOut).wait(1000);
    }
    function deleta() {
        stage.removeChild(this);
    }
    function criaFundo(px, py, tamX, tamY) {
        var shape = new createjs.Shape();
        shape.graphics.beginLinearGradientFill(["#a1cadf", "#52819a"], [0, 1], 0, 0, 0, tamY);
        shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
        shape.graphics.endFill();
        stage.addChild(shape);

    }
    function caixaTexto(texto, tam, cor1, cor2) {

        var txt = new createjs.Text(texto, "bold " + tam + "px VAG Rounded BT", "#000000");

        var tamX = txt.getBounds().width + 80;
        var tamY = txt.getBounds().height + 30;

        txt.regY = tamY / 2 - 25;
        txt.textAlign = "center";

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill([cor1, cor2], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.regX = tamX / 2;
        button.regY = tamY / 2;

        var t = new createjs.Container();
        t.addChild(button);
        t.addChild(txt);

        return t;

    }
    function textoContorno(texto) {
        var txt = new createjs.Text(texto, "bold 70px VAG Rounded BT", "#fff995");
        txt.textAlign = "center";

        var contorno = new createjs.Text(texto, "bold 70px VAG Rounded BT", "#000000");
        contorno.textAlign = "center";
        contorno.outline = 15;

        var t = new createjs.Container();
        t.addChild(contorno);
        t.addChild(txt);

        return t;

    }
    function ticker(event) {
        stage.update();

    }
    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + 100;
        var ay2 = object1.y + 65;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + 100;
        var by2 = by1 + 65;

        if (object1 == object2) {
            return false;
        }
        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {

            return false;
        }
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