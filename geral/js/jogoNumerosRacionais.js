var appRacionais = function (posX, posY, seq, frac, idCanvas) {
    var canvas;
    var stage;
    var content;
    var contentHit;
    var hits = [];
    var tick = 0;
    var xP = 50;
    var yP = 50;
    var xT = 200;
    var yT = 200;
    var dirX = 1;
    var dirY = 1;
    var count = 0;
    var gui;
    var txt_a;
    var inicio1 = false;
    var move = false;
    var drop = 0;
    var obj = [];
    var xps = [];
    var yps = [];
    var xts = [];
    var yts = [];
    var frase;
    var score = 0;
    var edgeOffset = 20;
    var ordem = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];
    var caminho = "resources/image/";

    init2();

    function init2() {
        var index;
        for (index in sons) {
            var t = sons[index];
            sons[index] = new Audio(caminho + t);
        }

        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);

        stage.enableMouseOver(10);
        createjs.Touch.enable(stage);
        stage.mouseMoveOutside = true;
        content = new createjs.Container();
        contentHit = new createjs.Container();
        criaFundo(0, 0, 1280, 720);
        stage.addChild(contentHit);
        stage.addChild(content);

        shuffle(ordem);

        var btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            btinicia.visible = false;
            criaGui();
            montaFase();
            inicio1 = true;

        });

        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", handleTick);
    }
    function montaFase() {
        var i = 0;
        for (var w = 0; w < 29; w++) {
            if (seq[count][w] == 1) {
                hits[i] = new createjs.Bitmap(caminho + "hit.png");
                hits[i].image.onload = function () { };
                contentHit.addChild(hits[i]);
                hits[i].x = w * 39.4 + 90;
                hits[i].y = 850;
                createjs.Tween.get(hits[i]).wait(w * 50).to({ y: 515 }, 1000, createjs.Ease.backOut);
                hits[i].name = w;
                hits[i].regX = 30;
                hits[i].regY = 55;
                hits[i].pode = true;
                i++;
            }
        }
        var i = 0;
        obj = [];
        for (var w = 0; w < seq[count].length; w++) {
            if (seq[count][w] == 1) {
                obj[i] = caixaTexto(frac[w][0], frac[w][1], 100, 150);
                obj[i].x = Math.random() * 500;
                obj[i].y = -100;
                obj[i].pode = true;
                obj[i].move = true;
                obj[i].name = w;
                content.addChild(obj[i]);
                xts[i] = 200;
                yts[i] = 200;
                xps[i] = obj[i].x;
                yps[i] = obj[i].y;

                obj[i].on("mousedown", function (evt) {
                    if (this.pode && inicio1) {
                        this.move = false;
                        this.parent.addChild(this);
                        var global = content.localToGlobal(this.x, this.y);
                        this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                        this.scaleY = this.scaleX = 0.5;
                    }
                });
                obj[i].on("pressmove", function (evt) {
                    if (this.pode && inicio1) {
                        var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                        this.x = local.x;
                        this.y = local.y;
                    }
                });
                obj[i].on("pressup", function (evt) {

                    if (this.pode && inicio1) {
                        var volta = true;
                        for (var i = 0; i < hits.length; i++) {
                            if (collisionDetect(this, hits[i]) && hits[i].pode) {
                                drop++;
                                this.pode = false;
                                this.move = false;
                                hits[i].pode = false;
                                this.x = hits[i].x;
                                this.y = hits[i].y;
                                sons[0].play();
                                volta = false;
                                if (drop >= 10) {
                                    verifica();
                                }
                            }
                        }
                        if (volta) {
                            this.move = true;
                            this.pode = true;
                            this.scaleY = this.scaleX = 1;
                            sons[1].play();
                            createjs.Tween.get(this).to({ x: this.px, y: this.py }, 200, createjs.Ease.backIn);
                        }
                    }
                });

                i++;
            }
        }
        tick = 99;

        frase = caixaFrase("Fase " + (count + 1), 33);
        stage.addChild(frase);
        frase.x = -1280;
        frase.y = 150;
        createjs.Tween.get(frase).to({ x: 640 }, 600, createjs.Ease.backOut).wait(3000).call(volta);
    }

    function volta() {
        stage.removeChild(frase);
    }
    function verifica() {
        for (var i = 0; i < hits.length; i++) {
            for (var j = 0; j < obj.length; j++) {
                if (collisionDetect(obj[j], hits[i])) {
                    if (obj[j].name == hits[i].name) {
                        score++;
                        txt_a.text = score;
                        animaIco("certo", hits[i].x, hits[i].y - 120);
                    } else {
                        animaIco("errado", hits[i].x, hits[i].y - 120);
                    }
                }
            }
        }
        createjs.Tween.get(stage).wait(6000).call(proxima);
    }
    function proxima() {
        content.removeAllChildren();
        contentHit.removeAllChildren();
        if (count < (seq.length - 1)) {
            count++;
            drop = 0;
            montaFase();
        } else {
            fim();

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

    function caixaTexto(texto, texto2, tamX, tamY) {
        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#ffffff"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.regX = tamX / 2;
        button.regY = tamY / 2;
        button.alpha = 0.4;

        var txt = new createjs.Text(texto, "bold 80px VAG Rounded BT", "#000000");
        var txt2 = new createjs.Text('_', "bold 80px VAG Rounded BT", "#000000");
        var txt3 = new createjs.Text(texto2, "bold 80px VAG Rounded BT", "#000000");

        txt.regY = tamY / 2;
        txt.textAlign = "center";
        txt2.regY = tamY / 2;
        txt2.textAlign = "center";
        txt3.regY = tamY / 2;
        txt3.textAlign = "center";

        txt3.y = 80;

        var resp = new createjs.Container();
        resp.addChild(button);
        resp.addChild(txt);
        resp.addChild(txt2);
        resp.addChild(txt3);

        return resp;
    }
    function criaCaixa(px, py, tamX, tamY) {
        var button = new createjs.Shape();

        button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.x = px;
        button.y = py;
        button.regX = tamX / 2;
        button.regY = tamY / 2;
        stage.addChild(button);
    }
    function caixaFrase(texto, tam) {
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
    function textoContorno(texto, px, py, tamX, tamY) {
        var txt = new createjs.Text(texto, "bold 120px VAG Rounded BT", "#ffffff");
        txt.x = px;
        txt.y = py;
        txt.regY = tamY / 2;
        txt.textAlign = "center";

        var contorno = new createjs.Text(texto, "bold 120px VAG Rounded BT", "#000000");
        contorno.x = px;
        contorno.y = py;
        contorno.regY = tamY / 2;
        contorno.textAlign = "center";
        contorno.outline = 15;

        conta.addChild(contorno);
        conta.addChild(txt);

    }
    function criaFundo(px, py, tamX, tamY) {
        var shape = new createjs.Shape();
        shape.graphics.beginLinearGradientFill(["#343434", "#4f4f50"], [0, 1], 0, 0, 0, tamY);
        shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
        shape.graphics.endFill();
        stage.addChild(shape);
        var fundo = new createjs.Bitmap(caminho + "fundo_od2.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);

    }
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        content.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 150;
        ico.regY = 150;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.25, scaleY: 0.25 }, 350, createjs.Ease.backOut);
    }
    function deletaIco() {
        content.removeChild(this);
    }
    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + edgeOffset;
        var ay2 = object1.y + edgeOffset;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + edgeOffset;
        var by2 = by1 + edgeOffset;
        if (object1 == object2) {
            return false;
        }
        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {
            return false;
        }
    }
    function criaGui() {
        gui = new createjs.Container();
        stage.addChild(gui);

        var _gui = new createjs.Bitmap(caminho + "acertos.png");
        _gui.image.onload = function () { };

        txt_a = new createjs.Text(0, "bold 120px VAG Rounded BT", "#000000");
        txt_a.textAlign = "center";
        txt_a.x = 150;
        txt_a.y = 130;

        gui.addChild(_gui);
        gui.addChild(txt_a);
        gui.x = 220;
        gui.y = 150;
        gui.visible = false;
    }
    function handleTick() {
        if (inicio1) {
            if (tick > 100) {
                for (var i = 0; i < obj.length; i++) {
                    var t = ordem[i];
                    xts[i] = Math.ceil(Math.random() * 100) + posX[t];
                    yts[i] = Math.ceil(Math.random() * 100) + posY[t];
                }
                tick = 0;
            }
            tick++;

            for (var i = 0; i < obj.length; i++) {
                xps[i] += (xts[i] - xps[i]) / 15;
                yps[i] += (yts[i] - yps[i]) / 15;

                if (obj[i].move) {
                    obj[i].x += ((xps[i] - obj[i].x) / 60);
                    obj[i].y += ((yps[i] - obj[i].y) / 60);
                    obj[i].px = obj[i].x;
                    obj[i].py = obj[i].y;
                }

            }
        }
        stage.update();
    }
    function fim() {
        var img;
        var bo;
        var continua = false;
        gui.visible = true;
        if (score >= 30) {
            img = caminho + "positivo.png";
            continua = true;
            sons[2].play();
        } else {
            img = caminho + "tentenovamente.png";
            continua = true;
            sons[3].play();
        }
        if (continua) {
            inicio1 = false;
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = bo.regY = 210;
            bo.x = 900;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).to({ y: 350 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                count = 0;
                score = 0;
                drop = 0;
                gui.visible = false;
                txt_a.text = score;
                montaFase();
                inicio1 = true;
            });
        }
    }
}