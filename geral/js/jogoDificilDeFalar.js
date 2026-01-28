    var AppDificilDeFalar = function (idCanvas, seq, fase1, resp1, resposta, _fundo, _iniciar) {
    var canvas,
    caminho="resources/image/",
    stage,
    fundo,
    conta,
    count = 0,
    ordem = 0,
    offX = 500,
    offY = 200,
    word,
    inicio1 = false,
    btinicia,
    tempoPergunta = 20000,
    fumacinha,
    relogio,
    tipotween = createjs.Ease.backOut,
    pos = [[136, 610], [335, 610], [548, 610], [760, 610], [928, 603], [1120, 603]],
    poshit = [[573, 277], [842, 317], [845, 299], [727, 374], [480, 300], [1080, 283]],
    gui,
    i_acertos = 0,
    i_erros = 0,
    txt_a,
    txt_e;

    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);

    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;

    criaFundo(0, 0, 1280, 720);

    conta = new createjs.Container();
    stage.addChild(conta);

    btinicia = new createjs.Bitmap(_iniciar);
    btinicia.image.onload = function () { };
    stage.addChild(btinicia);
    btinicia.on("click", function () {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        stage.removeChild(this);
        formulaPergunta();
    });

    var spriteRelogio = new createjs.SpriteSheet({
        framerate: 20,
        "images": [caminho+"relogio.png"],
        "frames": { "regX": 100, "height": 214, "count": 13, "regY": 107, "width": 200 },
        "animations": {
            "idle": 0,
            "idle2": 12,
            "tempo1": [0, 12, "idle2", 0.018]
        }
    });

    var spriteSheet = new createjs.SpriteSheet({
        framerate: 20,
        "images": [caminho+"fumaca.png"],
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
    relogio.y = -400;

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", ticker);

    function criaGui() {
        gui = new createjs.Container();
        stage.addChild(gui);

        var _gui = new createjs.Bitmap(caminho+"gui.png");
        _gui.image.onload = function () { };

        txt_a = new createjs.Text(0, "bold 40px VAG Rounded BT", "#000000");
        txt_a.textAlign = "left";
        txt_a.x = 220;
        txt_a.y = 30;

        txt_e = new createjs.Text(0, "bold 40px VAG Rounded BT", "#b10000");
        txt_e.textAlign = "left";
        txt_e.x = 180;
        txt_e.y = 105;

        gui.addChild(_gui);
        gui.addChild(txt_a);
        gui.addChild(txt_e);
    }

    function formulaPergunta() {
        var t = seq[count];
        conta.removeAllChildren();
        inicio1 = true;
        sons(count);

        word = new createjs.Bitmap(caminho+'f' + count + '.png');
        word.image.onload = function () { };
        word.x = -1280;

        conta.addChild(word);
        createjs.Tween.get(word).to({ x: 0 }, 300, tipotween).wait(tempoPergunta);
        for (var i = 0; i < 6; i++) {
            var bt = new createjs.Bitmap(caminho+'bt' + i + '.png');
            bt.image.onload = function () { };
            conta.addChild(bt);
            bt.x = -900;
            bt.regX = 195 / 2;
            bt.regY = 195 / 2;
            bt.px = pos[i][0];
            bt.y = bt.py = pos[i][1];
            bt.pode = true;
            bt.name = i;
            createjs.Tween.get(bt).wait(i * 50).to({ x: pos[i][0] }, 300, tipotween);
            bt.on("mousedown", function (evt) {
                if (this.pode) {
                    this.parent.addChild(this);
                    var global = conta.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                    this.alpha = 1;
                }
            });
            bt.on("pressmove", function (evt) {
                if (this.pode) {
                    var local = conta.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                }
            });
            bt.on("pressup", function (evt) {
                if (this.pode) {
                    var volta = true;

                    if (this.y < 470) {
                        if (this.name == resposta[count]) {
                            acerto = true;
                            volta = false;
                            this.pode = false;
                            som0();
                            this.x = poshit[count][0];
                            this.y = poshit[count][1];
                            this.scaleX = this.scaleY = 0.7;
                            i_acertos++;
                            animaIco("certo", this.x + 100, this.y - 100);

                            createjs.Tween.removeTweens(word);
                            relogio.y = -400;
                            fumacinha.gotoAndPlay("fumaca1");
                            fumacinha.x = this.x;
                            fumacinha.y = this.y;

                            createjs.Tween.get(this).wait(5000).call(proxima);
                        }
                    }
                    if (volta) {
                        createjs.Tween.get(this).to({ x: this.px, y: this.py }, 500, createjs.Ease.backOut);
                        som1();
                        i_erros++;
                    }
                }

            });
        }
    }

    function proximaErro() {
        i_erros++;
        proxima();
    }

    function proxima() {
        if (count < (resposta.length - 1)) {
            count++;
            formulaPergunta();
        } else {
            verificaFim();
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

    function verificaFim() {
        var img;
        var bo;
        var continua = false;
        createjs.Tween.removeTweens(word);
        conta.removeAllChildren();
        relogio.y = -400;

        img = caminho+"positivo.png";
        continua = true;
        som2();

        if (continua) {
            inicio1 = false;

            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = bo.regY = 210;
            bo.x = 640;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).to({ y: 250 }, 1000, tipotween);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                conta.removeAllChildren();
                count = 0;
                i_acertos = 0;
                i_erros = 0;
                formulaPergunta();
            });
        }
    }

    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        conta.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 150;
        ico.regY = 150;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut);
    }

    function deleta() {
        stage.removeChild(this);
    }

    function criaFundo(px, py, tamX, tamY) {
        var shape = new createjs.Shape();
        shape.graphics.beginLinearGradientFill(["#3b6ca8", "#163d66"], [0, 1], 0, 0, 0, tamY);
        shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
        shape.graphics.endFill();
        stage.addChild(shape);
        var f = new createjs.Bitmap(_fundo);
        f.image.onload = function () { };
        stage.addChild(f);
    }
    function textoContorno(texto) {

        var txt = new createjs.Text(texto, "bold 40px VAG Rounded BT", "#ffffff");

        txt.textAlign = "center";
        txt.shadow = new createjs.Shadow("#000000", 5, 5, 10);
        txt.lineWidth = 800;

        var tamX = txt.getBounds().width + 120;
        var tamY = txt.getBounds().height + 80;
        txt.regY = tamY / 2 - 40;

        offX = tamX / 2;
        offY = tamY / 2;

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.regX = tamX / 2;
        button.regY = tamY / 2;
        button.alpha = 0.2;

        var t = new createjs.Container();

        t.addChild(button);
        t.addChild(txt);

        return t;
    }

    function caixaTexto(texto) {
        var txt = new createjs.Text(texto, "bold 40px VAG Rounded BT", "#000000");
        var tamX = txt.getBounds().width + 80;
        var tamY = txt.getBounds().height + 50;

        txt.regY = tamY / 2 - 35;
        txt.textAlign = "center";

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.regX = tamX / 2;
        button.regY = tamY / 2;

        var t = new createjs.Container();
        t.addChild(button);
        t.addChild(txt);

        return t;
    }

    function ticker(event) {
        stage.update();
    }

    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + offX;
        var ay2 = object1.y + offY;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + offX;
        var by2 = by1 + offY;

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
    function sons(i) {
        document.getElementsByTagName('audio')[i + 3].muted = true;
        document.getElementsByTagName('audio')[i + 4].muted = false;
        document.getElementsByTagName('audio')[i + 4].play();
    }
}