var AppFigurasGeo = function (idCanvas, palavras, certas, _btIniciar) {
    var caminho = "resources/image/";
    var canvas;
    var stage;
    var fundo;
    var conta;
    var hit;
    var freq = 80;
    var count = 0;
    var inicio1 = false;
    var gui;
    var i_acertos = 0;
    var i_erros = 0;
    var txt_a;
    var txt_e;
    var btinicia;
    var sons = ["bubble.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];

    init1();

    function init1() {
        var index;
        for (index in sons) {
            var t = sons[index];
            sons[index] = new Audio(caminho + t);
        }
        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        shuffle(palavras);

        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;

        criaFundo(0, 0, 1280, 720);

        var bolhafundo1 = new createjs.Bitmap(caminho + "bol_fundo.png");
        bolhafundo1.image.onload = function () { };
        stage.addChild(bolhafundo1);
        bolhafundo1.y = 0;

        conta = new createjs.Container();
        stage.addChild(conta);


        btinicia = new createjs.Bitmap(caminho + _btIniciar);
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.x = 400;
        btinicia.y = 250;
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            createjs.Tween.get(bolhafundo1, { loop: true }).wait(100).to({ y: -719 }, 10000, createjs.Ease.linear);
            btinicia.visible = false;
            criaGui();
            inicio1 = true;
        });


        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function criaGui() {
        gui = new createjs.Container();
        stage.addChild(gui);

        var _gui = new createjs.Bitmap(caminho + "gui.png");
        _gui.image.onload = function () { };


        txt_a = new createjs.Text(0, "bold 40px VAG Rounded BT", "#000000");
        txt_a.textAlign = "left";
        txt_a.x = 220;
        txt_a.y = 25;

        txt_e = new createjs.Text(0, "bold 40px VAG Rounded BT", "#b10000");
        txt_e.textAlign = "left";
        txt_e.x = 180;
        txt_e.y = 100;

        gui.addChild(_gui);
        gui.addChild(txt_a);
        gui.addChild(txt_e);

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
    function formaBolha(texto) {

        var bo = new createjs.Bitmap(caminho + texto);
        bo.image.onload = function () { };
        bo.regX = bo.regY = 512 / 2;


        var resp = new createjs.Container();
        resp.name = texto;
        resp.id = 0;
        resp.addChild(bo);
        var escala = 0.4 + (Math.random() * 30) / 100;
        resp.scaleX = resp.scaleY = 0.2;
        stage.addChild(resp);
        resp.y = 700;

        resp.x = Math.floor(Math.random() * 800 + 200);
        createjs.Tween.get(resp).to({ scaleX: escala, scaleY: escala, y: 650 }, 500, createjs.Ease.backOut).to({ y: -300 }, 10000 + Math.random() * 5000, createjs.Ease.linear).call(deleta);
        resp.on("mousedown", function (evt) {

            if (certas.indexOf(this.name) > -1) {
                popIco('certo.png', this.x, this.y);
                popBolha(this.x, this.y);
                i_acertos++;
                txt_a.text = i_acertos;
                stage.removeChild(this);
                sons[0].play();
            } else {
                popIco('errado.png', this.x, this.y);
                popBolha(this.x, this.y);
                i_erros++;
                txt_e.text = i_erros;
                stage.removeChild(this);
                sons[1].play();
            }
        });

    }
    function verificaFim() {
        var img;
        var bo;
        var continua = false;
        if (i_acertos >= certas.length && i_erros < 5) {
            inicio1 = false;
            img = caminho + "positivo.png";
            continua = true;
            sons[2].play();
        } else {
            inicio1 = false;
            img = caminho + "tentenovamente.png";
            continua = true;
            sons[3].play();

        }
        if (continua) {
            inicio1 = false;
            conta.removeAllChildren();
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = bo.regY = 210;
            bo.x = 640;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).to({ y: 350 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                count = 0;
                i_acertos = 0;
                txt_a.text = i_acertos;
                i_erros = 0;
                txt_e.text = i_erros;
                inicio1 = true;
            });


        }

    }
    function popBolha(px, py) {
        var bo = new createjs.Bitmap(caminho + "bolha_pop.png");
        bo.image.onload = function () { };
        bo.regX = bo.regY = 155;
        bo.scaleX = bo.scaleY = 0.5;
        bo.x = px;
        bo.y = py;
        stage.addChild(bo);
        createjs.Tween.get(bo).to({ scaleX: 1, scaleY: 1 }, 150, createjs.Ease.linear).call(deleta);
    }
    function popIco(qual, px, py) {
        var ico = new createjs.Bitmap(caminho + qual);
        ico.image.onload = function () { };
        ico.regX = ico.regY = 155;
        ico.scaleX = ico.scaleY = 0.01;
        ico.x = px;
        ico.y = py;
        stage.addChild(ico);
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 150, createjs.Ease.linear).wait(1000).call(deleta);
    }
    function deleta() {
        stage.removeChild(this);
    }
    function criaFundo(px, py, tamX, tamY) {
        var shape = new createjs.Shape();
        shape.graphics.beginLinearGradientFill(["#75bdb7", "#5caca5"], [0, 1], 0, 0, 0, tamY);
        shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
        shape.graphics.endFill();
        stage.addChild(shape);
    }
    function textoContorno(texto) {

        var txt = new createjs.Text(texto, "bold 120px VAG Rounded BT", "#ffffff");
        txt.regY = 60;
        txt.textAlign = "center";

        var contorno = new createjs.Text(texto, "bold 120px VAG Rounded BT", "#000000");
        contorno.regY = 60;
        contorno.textAlign = "center";
        contorno.outline = 15;

        var resp = new createjs.Container();

        resp.addChild(contorno);
        resp.addChild(txt);

        return resp;

    }
    function ticker(event) {
        stage.update();
        if (inicio1) {
            if (freq > 150) {
                if (count == palavras.length) {
                    inicio1 = false;
                    createjs.Tween.get(conta).wait(5000).call(verificaFim);
                }
                freq = 0;
                formaBolha(palavras[count]);
                count++;
            } else {
                freq++;
            }
        }
    }
    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + 100;
        var ay2 = object1.y + 100;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + 100;
        var by2 = by1 + 100;

        if (object1 == object2) {
            return false;
        }

        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {
            return false;
        }

    }
}