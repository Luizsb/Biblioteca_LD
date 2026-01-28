var AppCacaPalavras = function (primeiraLetra, ultimaLetra, mapa, mapaLetras, respostas, pos, idCanvas) {
    var canvas, stage;
    var content;
    var dica_c;
    var telaFinal;
    var contentLinhas;
    var contenthit;
    var letras = [];
    var fundo;
    var img_re;
    var bt_recarrega;
    var i = 0;
    var count = 0;
    var si = 0;
    var shapes = [];
    var hits = [];
    var dicasTextos = [];
    var acertos = [];
    var edgeOffset = 40;
    var priLetra = false;
    var words;
    var btcontinuar;
    var btinicia;
    var contentgui;
    var bt_dicas;
    var dicas;
    var margemX = 110;
    var margemY = 50;
    var btreiniciar;
    var g;
    var c1;
    var c2;
    var line;
    var dica = true;
    var update = false;
    var startTime;
    var formatted;
    var i_erros = 0;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZÃÔÓÁ*";
    var caminho = "resources/image/";

    init2();

    function init2() {
        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);
        content = new createjs.Container();
        contentLinhas = new createjs.Container();
        contenthit = new createjs.Container();
        dica_c = new createjs.Container();
        telaFinal = new createjs.Container();
        contentgui = new createjs.Container();

        words = primeiraLetra.length;

        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;

        criaFundo(0, 0, 1280, 720);
        stage.addChild(content);
        stage.addChild(contenthit);
        stage.addChild(contentLinhas);

        bt_dicas = new createjs.Bitmap(caminho + "bt_dicas.png");
        bt_dicas.image.onload = function () { };
        stage.addChild(bt_dicas);
        bt_dicas.x = 1210;
        bt_dicas.y = 30;
        bt_dicas.on("click", function () {
            abreRecolhe();
        });
        dicas = new createjs.Bitmap(caminho + "dicas.png");
        dicas.image.onload = function () { };
        dica_c.addChild(dicas);
        dica_c.x = 1150;
        dica_c.y = 30;
        dica_c.scaleX = 0.1;
        dica_c.scaleY = 0.1;
        dica_c.alpha = 0;
        dica_c.on("click", function () {
            abreRecolhe();
        });

        stage.addChild(telaFinal);
        stage.addChild(contentgui);
        stage.addChild(dica_c);
        var i;
        for (i = 0; i < respostas.length; i++) {
            dicasTextos[i] = criaTexto(respostas[i], 25);
            dicasTextos[i].x = pos[i][0];
            dicasTextos[i].y = pos[i][1];
            dica_c.addChild(dicasTextos[i]);
            dicasTextos[i].visible = false;
        }

        btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            btinicia.visible = false;
            createjs.Tween.get(this).wait(1200).call(abreRecolhe);
            update = true;
            startTime = Date.now();
            si = 0;
            var j, i;
            for (j = 0; j < mapa.length; j++) {
                for (i = 0; i < mapa[0].length; i++) {
                    nu = possible.charAt(Math.floor(Math.random() * possible.length));
                    if (mapa[j][i] > 0) {
                        nu = mapaLetras[j][i];
                    }
                    letras[si] = criaLetra(nu, 40, 59, 59);
                    content.addChild(letras[si]);
                    letras[si].px = i * 57 + margemX;
                    letras[si].x = -50;
                    letras[si].y = j * 57 + margemY;
                    letras[si].scaleX = letras[si].scaleY = 0.0;

                    if (mapa[j][i] > 0) {
                        hits[si] = criaBt(59, 59, mapa[j][i], i, j);
                        contenthit.addChild(hits[si]);
                        hits[si].x = i * 57 + margemX;
                        hits[si].y = j * 57 + margemY;
                        hits[si].alpha = 0.05;
                        hits[si].name = mapa[j][i];
                        hits[si].pode2 = true;
                        hits[si].fila = j;
                        hits[si].coluna = i;

                        hits[si].on("mousedown", function (evt) {
                            var n = this.name - 1;
                            console.log("[" + this.fila + "," + this.coluna + "]" + ',');
                            if (this.pode2 && primeiraLetra[n][0] == this.fila && primeiraLetra[n][1] == this.coluna) {
                                priLetra = true;
                            }
                            c1.x = this.x + 28;
                            c1.y = this.y + 28;
                            c2.x = this.x + 28;
                            c2.y = this.y + 28;
                            line.visible = true;
                        });
                        hits[si].on("pressup", function (evt) {
                            var volta = true;

                            var n = this.name - 1;
                            var t = contenthit.getObjectUnderPoint(evt.stageX, evt.stageY);
                            if (t != null) {
                                if (priLetra && t.parent.pode2 && ultimaLetra[n][0] == t.parent.fila && ultimaLetra[n][1] == t.parent.coluna) {
                                    t.parent.pode2 = false;
                                    volta = false;
                                    count++;
                                    som0();
                                    animaIco('certo', t.parent.x, t.parent.y);
                                    verificaFim();

                                    novalinha = new createjs.Shape();
                                    novalinha.alpha = 0.3;
                                    novalinha.graphics.beginStroke("blue").setStrokeStyle(35, "round");
                                    novalinha.pos1 = novalinha.graphics.moveTo(c1.x, c1.y).command;
                                    novalinha.pos2 = novalinha.graphics.lineTo(c2.x, c2.y).command;
                                    contentLinhas.addChild(novalinha);

                                    dicasTextos[n].visible = true;
                                }
                            }
                            if (volta) {
                                som1();
                                i_erros++;
                            }
                            line.visible = false;
                            priLetra = false;
                        });
                        hits[si].on("pressmove", function (evt) {
                            var n = this.name - 1;
                            var t = contenthit.getObjectUnderPoint(evt.stageX, evt.stageY);
                            c2.x = evt.stageX;
                            c2.y = evt.stageY;

                        });

                    }
                    si++;
                }
            }

            shuffle(letras);
            for (j = 0; j < letras.length; j++) {
                if (letras[j] != null) {
                    letras[j].rotation = -Math.random() * 360;
                    createjs.Tween.get(letras[j]).wait(j * 5).to({ rotation: 0, x: letras[j].px, scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
                }
            }

        });

        g = new createjs.Graphics().f("red").dc(0, 0, 0);
        c1 = new createjs.Shape(g);
        c2 = new createjs.Shape(g);

        line = new createjs.Shape();
        line.alpha = 0.3;
        line.graphics.beginStroke("red").setStrokeStyle(35, "round");
        line.pos1 = line.graphics.moveTo(0, 10).command;
        line.pos2 = line.graphics.lineTo(10, 10).command;
        stage.addChild(c1, c2, line);
        line.visible = false;

        createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setFPS(60);
    }
    function abreRecolhe() {
        if (dica) {
            dica_c.alpha = 0;
            createjs.Tween.get(dica_c, { override: true }).to({ x: 0, y: 0, scaleX: 1, scaleY: 1, alpha: 1 }, 500, createjs.Ease.backOut);
            dica = false;
        } else {
            dica_c.alpha = 1;
            createjs.Tween.get(dica_c, { override: true }).to({ x: 1150, y: 30, scaleX: 0.1, scaleY: 0.1, alpha: 0 }, 500, createjs.Ease.backOut);
            dica = true;
        }
    }
    function criaGui() {
        update = false;
        var gui = new createjs.Bitmap(caminho + "gui.png");
        gui.image.onload = function () { };
        contentgui.addChild(gui);
        gui.on("click", function () {
            stage.removeChild(contentgui);
            count = 0;
            i_erros = 0;
            update = true;
            startTime = Date.now();
            contentLinhas.removeAllChildren();
            var j, i;
            for (j = 0; j < hits.length; j++) {
                if (hits[j] != null) {
                    hits[j].alpha = 0.05;
                    hits[j].pode2 = true;
                }
            }
            for (i = 0; i < respostas.length; i++) {
                dicasTextos[i].visible = false;
            }
        });

        var texto_tempo = new createjs.Text(formatted, "bold 40px VAG Rounded BT", "#000000");
        texto_tempo.x = 295;
        texto_tempo.y = 140;
        texto_tempo.textAlign = "center";
        contentgui.addChild(texto_tempo);

        var texto_errado = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#000000");
        texto_errado.x = 295;
        texto_errado.y = 210;
        texto_errado.textAlign = "center";
        contentgui.addChild(texto_errado);

        contentgui.x = -800;
        contentgui.y = 160;
        createjs.Tween.get(contentgui).to({ x: 300 }, 600, createjs.Ease.backOut);
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
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        stage.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 98;
        ico.regY = 98;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut).wait(500).call(deletaIco);
    }
    function deletaIco() {
        stage.removeChild(this);
        abreRecolhe();
    }
    function apaga(e) {
        content.removeChild(this);
    }
    function verificaFim() {

        if (count == words) {
            criaGui();
            som2();
        }
    }
    function tick(event) {
        line.pos1.x = c1.x;
        line.pos1.y = c1.y;
        line.pos2.x = c2.x;
        line.pos2.y = c2.y;
        stage.update(event);
        if (update) {
            checkTime();
        }
    }
    function checkTime() {
        var timeDifference = Date.now() - startTime;
        formatted = convertTime(timeDifference);
    }
    function convertTime(miliseconds) {
        var totalSeconds = Math.floor(miliseconds / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds - minutes * 60;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }
    function criaFundo(px, py, tamX, tamY) {
        var shape = new createjs.Shape();
        shape.graphics.beginRadialGradientFill(["#ececed", "#a6a6a6"], [0, 1], 640, 360, 0, 640, 360, 600).drawCircle(100, 100, 50);
        shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
        shape.graphics.endFill();
        stage.addChild(shape);
        var fundo = new createjs.Bitmap(caminho + "fundo_od1.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);
    }
    function criaLetra(texto, tam, tamX, tamY) {

        var txt = new createjs.Text(texto, "bold " + tam + "px VAG Rounded BT", "#000000");

        txt.y = 10;
        txt.x = 28;
        txt.textAlign = "center";

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#dbdbdb"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRect(0, 0, tamX, tamY);
        button.graphics.endFill();

        var border = new createjs.Shape();
        border.graphics.beginStroke("#E87D0C");
        border.graphics.setStrokeStyle(2);
        border.graphics.drawRect(0, 0, tamX, tamY);

        var resp = new createjs.Container();
        resp.addChild(button);
        resp.addChild(txt);
        resp.addChild(border);

        return resp;
    }
    function criaBt(tamX, tamY, n, c, f) {

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#a3a7b1"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRect(0, 0, tamX, tamY);
        button.graphics.endFill();
        button.name = n;
        button.coluna = c;
        button.fila = f;

        var resp = new createjs.Container();
        resp.addChild(button);

        return resp;
    }
    function criaTexto(texto, tam) {

        var txt = new createjs.Text(texto, "bold " + tam + "px VAG Rounded BT", "#1b39a6");

        txt.textAlign = "center";

        var resp = new createjs.Container();
        resp.addChild(txt);

        return resp;
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
}