var AppPlanificacoes = function (idCanvas) {
    var canvas2;
    var stage2;
    var fundo2;
    var content2;
    var telaEscolha2;
    var perguntas2;
    var dif2;
    var cont_carro2 = [];
    var contentgui;
    var fumaca2 = [];

    var update = false;
    var btinicia2;
    var seq = [0, 1, 2, 3, 4, 5, 6];
    var respostas = [0, 1, 0, 1, 1, 0, 1];
    var respX = [[990, 866], [920, null], [874, 875], [953, null], [806, null]];
    var respY = [[460, 338], [218, null], [326, 362], [417, null], [132, null]];
    var respR = [[135, 45], [45, null], [0, -90], [-45, null], [0, null]];
    var posX = [226, 226, 428, 360, 229, 363, 294];
    var posY = [95, 95, 95, 161, 295, 230, 228];
    var count = 0;
    var edgeOffset = 80;

    var coelho1;
    var coelho2;
    var bt = [];
    var spriteSheet;
    var spriteSheet2;
    var i_acertos = 0;
    var texto_certo;
    var i_erros = 0;
    var texto_errado;

    init2();

    function init2() {

        canvas2 = document.getElementById(idCanvas);
        stage2 = new createjs.Stage(canvas2);
        fundo2 = new createjs.Container();
        content2 = new createjs.Container();
        contentgui = new createjs.Container();
        telaEscolha2 = new createjs.Container();

        createjs.Touch.enable(stage2);
        stage2.enableMouseOver(10);
        stage2.mouseMoveOutside = true;

        shuffle(seq);
        perguntas2 = new createjs.Container();

        stage2.addChild(fundo2);
        stage2.addChild(perguntas2);
        stage2.addChild(content2);
        stage2.addChild(contentgui);
        contentgui.visible = false;

        stage2.addChild(telaEscolha2);

        var btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage2.addChild(btinicia);
        btinicia.on("mousedown", function (evt) {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            stage2.removeChild(this);
            inicia2();
        });

        var cenario = new createjs.Bitmap("resources/image/cenario.png");
        cenario.image.onload = function () { };
        fundo2.addChild(cenario);

        gui = new createjs.Bitmap("resources/image/gui.png");
        gui.image.onload = function () { };
        contentgui.addChild(gui);
        gui.x = 25;
        gui.y = 15;

        texto_tempo = new createjs.Text("0:00", "bold 40px VAG Rounded BT", "#000000");
        texto_tempo.x = 285;
        texto_tempo.y = 30;
        texto_tempo.textAlign = "center";
        contentgui.addChild(texto_tempo);

        texto_errado = new createjs.Text("0", "bold 40px VAG Rounded BT", "#ff0000");
        texto_errado.x = 277;
        texto_errado.y = 100;
        texto_errado.textAlign = "center";
        contentgui.addChild(texto_errado);

        texto_certo = new createjs.Text("0", "bold 40px VAG Rounded BT", "#5ab00b");
        texto_certo.x = 280;
        texto_certo.y = 167;
        texto_certo.textAlign = "center";
        contentgui.addChild(texto_certo);

        contentgui.x = 240;
        contentgui.y = 150;

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker2);
    }

    function inicia2() {
        startTime = Date.now();
        spriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            "images": ["resources/image/co1.png"],
            "frames": { "regX": 210, "height": 284, "count": 6, "regY": 142, "width": 425 },
            "animations": {
                "idle": 0,
                "pulaLoop": [0, 5, "pulaLoop", 0.5],
                "pula": [0, 5, "idle", 0.5]
            }
        });
        coelho1 = new createjs.Sprite(spriteSheet, "pulaLoop");
        content2.addChild(coelho1);

        coelho1.x = -400;
        coelho1.y = 600;
        coelho1.scaleX = -0.75;
        coelho1.scaleY = 0.75;
        createjs.Tween.get(coelho1).to({ x: 200 }, 2000, createjs.Ease.linear).call(paraCoelho);
        montaFase();
        update = true;
    }
    function montaFase() {
        var t = seq[count];
        perguntas2.removeAllChildren();

        var fig = new createjs.Bitmap("resources/image/f" + t + ".png");
        fig.image.onload = function () { };
        perguntas2.addChild(fig);
        fig.x = -500;
        fig.y = 250;
        fig.regX = 571 / 2;
        fig.regY = 488 / 2;
        createjs.Tween.get(fig).to({ x: 350 }, 2000, createjs.Ease.backOut);
        var w = 0;
        for (var i = 0; i < 2; i++) {
            bt[w] = new createjs.Bitmap("resources/image/bt" + i + ".png");
            bt[w].image.onload = function () { };
            perguntas2.addChild(bt[w]);
            bt[w].x = 1000;
            bt[w].regX = 450 / 2;
            bt[w].regY = 177 / 2;
            bt[w].pode = true;
            bt[w].id = i;
            bt[w].alpha = 0;
            bt[w].scaleX = bt[w].scaleY = 0.01;
            createjs.Tween.get(bt[w]).wait(w * 50 + 1000).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, createjs.Ease.backOut);
            bt[w].on("mousedown", function (evt) {

                if (update) {
                    this.scaleX = this.scaleY = 0.1;
                    createjs.Tween.get(this).to({ scaleX: 0.85, scaleY: 0.85 }, 300, createjs.Ease.backOut);
                    if (this.id == respostas[t]) {
                        animaIco('certo', this.x - 150, this.y);
                        som0();
                        i_acertos++;
                        texto_certo.text = i_acertos;
                        createjs.Tween.get(this).wait(1500).call(proxima1);
                    } else {
                        animaIco('errado', this.x - 150, this.y);
                        som1();
                        i_erros++;
                        texto_errado.text = i_erros;
                        this.alpha = 0.3;
                        createjs.Tween.get(this).wait(1500).call(proxima2);
                    }
                    update = false;
                }
            });
            w++;
        }
        if (Math.random() * 1 < 0.5) {
            bt[0].y = 150;
            bt[1].y = 350;
        } else {
            bt[1].y = 150;
            bt[0].y = 350;
        }
    }
    function proxima1() {
        coelho1.gotoAndPlay("pula");
        createjs.Tween.get(coelho1).to({ x: coelho1.x + 135 }, 500, createjs.Ease.quadOut);
        count++;
        if (count >= 7) {
            Fim2();
        } else {
            montaFase();
            habilita();
        }
    }
    function proxima2() {
        count++;
        if (count >= 7) {
            Fim2();
        } else {
            montaFase();
            habilita();
        }
    }
    function habilita() {
        update = true;
    }
    function paraCoelho() {
        this.gotoAndStop("idle");
    }
    function apagaBalao() {
        stage2.removeChild(this);
        montaFase();
        habilita();
    }
    function randomiza() {
        var n = Math.floor(Math.random() * 500) + 500;
        return n;
    }

    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap("resources/image/" + qual + ".png");
        stage2.addChild(ico);
        ico.x = b + 25;
        ico.y = c + 25;
        ico.regX = 155;
        ico.regY = 155;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.backOut).wait(1500).call(apaga);
    }
    function apaga() {
        stage2.removeChild(this);
    }
    function Fim2() {
        var img;
        var bo;
        var continua = false;
        perguntas2.removeAllChildren();
        contentgui.visible = true;
        if (i_erros > 0) {
            som3();
            img = "resources/image/tentenovamente.png";
            continua = true;
        } else {
            som2();
            img = "resources/image/positivo.png";
            continua = true;
        }
        if (continua) {
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = bo.regY = 210;
            bo.x = 950;
            bo.y = 1000;
            stage2.addChild(bo);
            createjs.Tween.get(bo).wait(1000).to({ y: 250 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage2.removeChild(this);
                contentgui.visible = false;
                content2.removeAllChildren();
                count = 0;
                i_erros = 0;
                i_acertos = 0;
                inicia2();
                texto_errado.text = i_erros;
            });
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
    function ticker2(event) {
        stage2.update();
        if (update) checkTime();
    }
    function checkTime() {
        var timeDifference = Date.now() - startTime;
        var formatted = convertTime(timeDifference);
        texto_tempo.text = '' + formatted;
    }
    function convertTime(miliseconds) {
        var totalSeconds = Math.floor(miliseconds / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds - minutes * 60;
        if (seconds < 10) seconds = '0' + seconds;
        return minutes + ':' + seconds;
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
    function somCavalo() {
        document.getElementsByTagName('audio')[4].play();
    }
}