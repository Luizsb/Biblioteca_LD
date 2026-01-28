var appFrase = function (seq, letras, resp, fase, fase2, fase3, tit, cores, idCanvas) {

    var canvas;
    var stage;
    var fundo;
    var conta;
    var foto;
    var count = 0;
    var ordem = 0;
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
        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;

        criaFundo(0, 0, 1280, 720);
        foto = new createjs.Container();
        conta = new createjs.Container();
        stage.addChild(foto);
        stage.addChild(conta);

        shuffle(seq);
        criaGui();
        gui.visible = false;
        montaFoto();

        btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            btinicia.visible = false;
            inicio1 = true;
            montaFase();

        });
        var spriteRelogio = new createjs.SpriteSheet({
            framerate: 20,
            "images": ["resources/image/relogio.png"],
            "frames": { "regX": 100, "height": 214, "count": 13, "regY": 107, "width": 200 },
            "animations": {
                "idle": 0,
                "idle2": 12,
                "tempo1": [0, 12, "idle2", 0.006]
            }
        });
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
        fumacinha = new createjs.Sprite(spriteSheet, "idle");
        stage.addChild(fumacinha);

        relogio = new createjs.Sprite(spriteRelogio, "idle");
        stage.addChild(relogio);
        relogio.x = 1160;
        relogio.y = 900;

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function montaFoto() {
        foto.removeAllChildren();
        var nome;
        var arquivo;
        if (ordem < 6) {
            nome = 'Johannes Althusius';
            arquivo = "resources/image/foto1.png";
        } else {
            nome = 'John Locke';
            arquivo = "resources/image/foto2.png";
        }

        var frase = new createjs.Bitmap(arquivo);
        frase.image.onload = function () { };
        frase.x = -550;
        foto.addChild(frase);
        createjs.Tween.get(frase).to({ x: 0 }, 1000, tipotween);

        var tit = textoContorno(nome);
        tit.x = -550;
        tit.y = 650;
        foto.addChild(tit);
        createjs.Tween.get(tit).to({ x: 280 }, 1200, tipotween);
    }
    function montaFase() {
        conta.removeAllChildren();
        inicio1 = true;
        words = [];
        for (var i = 0; i < 3; i++) {
            words[i] = caixaTexto(fase[ordem][i], 33, 682, 219, cores[i][0], cores[i][1]);
            words[i].x = 925;
            words[i].y = i * 230 + 130;
            words[i].name = i;
            words[i].pode = true;

            words[i].scaleX = words[i].scaleY = 0.01;
            createjs.Tween.get(words[i]).wait(i * 50).to({ scaleX: 1, scaleY: 1 }, 600, tipotween);
            conta.addChild(words[i]);
            words[i].on("click", function () {
                if (inicio1) {
                    inicio1 = false;
                    this.scaleX = this.scaleY = 0.4;
                    this.rotation = 20;
                    createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1, rotation: 0 }, 600, tipotween);
                    if (this.name == resp[ordem]) {
                        som0();
                        animaIco('certo', this.x, this.y);

                    } else {
                        som1();
                        animaIco('errado', this.x, this.y);
                        i_erros++;
                    }
                }
            });
        }
    }
    function proxima() {
        if ((ordem + 1) == fase.length) {
            verificaFim();
        } else {
            ordem++;
            montaFase();
            montaFoto();
        }
    }
    function criaGui() {
        gui = new createjs.Container();
        stage.addChild(gui);

        var _gui = new createjs.Bitmap("resources/image/erros.png");
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
    function verificaFim() {
        var img;
        var bo;
        var continua = false;
        inicio1 = false;

        createjs.Tween.removeTweens(btinicia);
        relogio.y = 900;

        if (i_erros > 3) {
            img = "resources/image/tentenovamente.png";
            continua = true;
            som3();
        } else {
            img = "resources/image/positivo.png";
            continua = true;
            som2();
        }
        if (continua) {
            conta.removeAllChildren();
            foto.removeAllChildren();
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
                montaFoto();
            });
        }
    }
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap("resources/image/" + qual + ".png");
        conta.addChild(ico);
        ico.x = b + 220;
        ico.y = c;
        ico.regX = 315 / 2;
        ico.regY = 315 / 2;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.6, scaleY: 0.6 }, 200, createjs.Ease.quadOut).wait(2000).call(proxima);
    }
    function deleta() {
        stage.removeChild(this);
    }
    function criaFundo(px, py, tamX, tamY) {
        var shape = new createjs.Shape();
        shape.graphics.beginLinearGradientFill(["#ffffff", "#e0e0e0"], [0, 1], 0, 0, 0, tamY);
        shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
        shape.graphics.endFill();
        stage.addChild(shape);
    }
    function caixaTexto(texto, letra, tamX, tamY, cor1, cor2) {

        var txt = new createjs.Text(texto, "bold " + letra + "px VAG Rounded BT", "#ffffff");
        txt.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 5, 5, 10);
        txt.lineWidth = 660;
        txt.textAlign = "center";

        var tamX2 = txt.getBounds().width;
        var tamY2 = txt.getBounds().height;
        txt.regY = tamY2 / 2;

        var rect = new createjs.Shape();
        rect.graphics.beginLinearGradientFill([cor1, cor2], [0, 1], 0, 0, 0, tamY);
        rect.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        rect.graphics.endFill();
        rect.regX = tamX / 2;
        rect.regY = tamY / 2;

        var t = new createjs.Container();
        t.addChild(rect);
        t.addChild(txt);

        return t;
    }
    function textoContorno(texto) {
        var txt = new createjs.Text(texto, "bold 33px VAG Rounded BT", "#ffffff");
        txt.textAlign = "center";

        var contorno = new createjs.Text(texto, "bold 33px VAG Rounded BT", "#000000");
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
        var som = new Audio("resources/image/pop.mp3");
        som.play();

    }
    function som1() {
        var som = new Audio("resources/image/blip.mp3");
        som.play();

    }
    function som2() {
        var som = new Audio("resources/image/PARABENS.mp3");
        som.play();

    }
    function som3() {
        var som = new Audio("resources/image/tentenovamente.mp3");
        som.play();

    }
}