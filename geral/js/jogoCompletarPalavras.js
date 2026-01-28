var AppCompletarPalavras = function (idCanvas, palavrasA, palavraCompleta, palavrasB, resp) {
    var caminho = 'resources/image/';
    var canvas2;
    var stage2;
    var content;
    var hits = [];
    var mascote;
    var olho;
    var olho2;
    var boca;
    var count2 = 0;
    
    
    var words2 = [];
    var inicio2 = false;

    var tipotween = createjs.Ease.backOut;

    var gui2;

    var i_erros2 = 0;
    var txt_a2;
    var piscadarate = 0;

    init2();

    function init2() {
        canvas2 = document.getElementById(idCanvas);
        stage2 = new createjs.Stage(canvas2);
        stage2.enableMouseOver(10);

        createjs.Touch.enable(stage2);
        stage2.enableMouseOver(10);
        stage2.mouseMoveOutside = true;

        criaFundo2(0, 0, 1280, 720);

        content = new createjs.Container();
        stage2.addChild(content);

        montaFase2();

        var btinicia = new createjs.Bitmap(caminho + "bt_iniciar2.png");
        btinicia.image.onload = function () { };
        stage2.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            btinicia.visible = false;
            criaGui2();
            gui2.visible = false;
            for (var i = 0; i < words2.length; i++) {
                createjs.Tween.get(words2[i]).to({ scaleX: 1, scaleY: 1 }, 500, tipotween);
            }

        });
        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker2);
    }
    function montaFase2() {
        var t = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 5; j++) {
                words2[t] = caixaTexto(palavrasA[t], 33, "#ffe400", "#ffae00");
                words2[t].x = words2[t].px = i * 300 + 460;
                words2[t].y = words2[t].py = j * 110 + 130;
                words2[t].name = t;
                words2[t].id = resp[t];
                words2[t].pode = true;
                words2[t].scaleX = words2[t].scaleY = 0.7;
                content.addChild(words2[t]);

                t++;
            }
        }

        for (var i = 0; i < 2; i++) {
            var bt = caixaTexto(palavrasB[i], 50, "#ffffff", "#d3d3d3");
            bt.x = bt.px = 175;
            bt.y = bt.py = i * 150 + 300;
            bt.pode = true;
            bt.id = i;
            content.addChild(bt);
            bt.on("mousedown", function (evt) {
                if (this.pode) {
                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                    this.alpha = 1;

                }
            });
            bt.on("pressmove", function (evt) {
                if (this.pode) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                }
            });
            bt.on("pressup", function (evt) {
                if (this.pode) {
                    var volta = true;
                    for (var i = 0; i < words2.length; i++) {
                        var answer = palavrasA+palavrasB;
                        if (collisionDetect2(this, words2[i])) {
                            if (this.id == words2[i].id && words2[i].pode) {
                                var volta = false;
                                som0();
                                this.x = this.px;
                                this.y = this.py;
                                words2[i].pode = false;
                                console.log(words2[i].id);
                                animaIco2("certo", words2[i].px, words2[i].py);

                                var word = caixaTexto(palavraCompleta[words2[i].name], 33, "#ffffff", "#d3d3d3");
                                word.x = -200;
                                word.y = words2[i].py;
                                content.addChild(word);
                                createjs.Tween.get(word).to({ x: words2[i].px }, 500, tipotween);
                                content.removeChild(words2[i]);
                                this.alpha = 0;
                                createjs.Tween.get(this).to({ alpha: 1 }, 1000, createjs.Ease.backOut);

                                count2++;
                                if (count2 >= palavrasA.length) {
                                    verificaFim2();
                                }
                            }
                        }
                    }
                    if (volta) {
                        createjs.Tween.get(this).to({ x: this.px, y: this.py }, 500, createjs.Ease.backOut);
                        som1();
                        this.alpha = 1;
                        animaIco2("errado", this.x, this.y);
                        i_erros2++;
                        txt_a2.text = i_erros2;
                    }
                }

            });
        }
    }
    function criaGui2() {
        gui2 = new createjs.Container();
        stage2.addChild(gui2);

        var _gui = new createjs.Bitmap(caminho + "gui2.png");
        _gui.image.onload = function () { };

        txt_a2 = new createjs.Text(0, "bold 120px VAG Rounded BT", "#000000");
        txt_a2.textAlign = "center";
        txt_a2.x = 150;
        txt_a2.y = 130;


        gui2.addChild(_gui);
        gui2.addChild(txt_a2);
        gui2.x = 300;
        gui2.y = 200;

    }
    function verificaFim2() {
        var img;
        var bo;
        var continua = false;
        gui2.visible = true;
        if (i_erros2 > 0) {
            img = caminho + "tentenovamente.png";
            continua = true;
            som3();
        } else {
            img = caminho + "positivo.png";
            continua = true;
            som2();
        }
        if (continua) {
            inicio2 = false;
            content.removeAllChildren();

            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = bo.regY = 210;
            bo.x = 900;
            bo.y = 1000;
            stage2.addChild(bo);
            createjs.Tween.get(bo).to({ y: 350 }, 1000, tipotween);
            bo.on("mousedown", function (evt) {
                stage2.removeChild(this);
                count2 = 0;
                gui2.visible = false;
                i_erros2 = 0;
                txt_a2.text = i_erros2;
                montaFase2();
                for (var i = 0; i < words2.length; i++) {
                    createjs.Tween.get(words2[i]).to({ scaleX: 1, scaleY: 1 }, 500, tipotween);
                }
            });


        }

    }
    function animaIco2(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        stage2.addChild(ico);
        ico.x = b + 140;
        ico.y = c;
        ico.regX = 315 / 2;
        ico.regY = 315 / 2;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut).wait(1000).call(deleta2);
    }
    function deleta2() {
        stage2.removeChild(this);
    }
    function criaFundo2(px, py, tamX, tamY) {
        var shape = new createjs.Shape();
        shape.graphics.beginLinearGradientFill(["#5aac24", "#376618"], [0, 1], 0, 0, 0, tamY);
        shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
        shape.graphics.endFill();
        stage2.addChild(shape);

    }
    function caixaTexto(texto, tam, cor1, cor2) {

        var txt = new createjs.Text(texto, "bold " + tam + "px VAG Rounded BT", "#000000");

        var tamX = txt.getBounds().width + 80;
        var tamY = txt.getBounds().height + 50;

        txt.regY = tamY / 2 - 35;
        txt.textAlign = "center";

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill([cor1, cor2], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.regX = tamX / 2;
        button.regY = tamY / 2;

        var resp = new createjs.Container();
        resp.addChild(button);
        resp.addChild(txt);

        return resp;

    }
    function ticker2(event) {
        stage2.update();

    }
    function collisionDetect2(object1, object2) {
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
        var som = new Audio(caminho + 'pop.mp3');
        som.play();

    }
    function som1() {
        var som = new Audio(caminho + 'blip.mp3');
        som.play();

    }
    function som2() {
        var som = new Audio(caminho + 'PARABENS.mp3');
        som.play();

    }
    function som3() {
        var som = new Audio(caminho + 'tentenovamente.mp3');
        som.play();

    }
}