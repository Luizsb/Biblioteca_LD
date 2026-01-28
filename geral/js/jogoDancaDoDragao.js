var AppDragao = function (idCanvas, itens, _fundo, _iniciar, errosMaximo) {
    (function () {
        window.accurateInterval = function (time, fn) {
            var cancel, nextAt, timeout, wrapper, _ref;
            nextAt = new Date().getTime() + time;
            timeout = null;
            if (typeof time === 'function') {
                _ref = [time, fn];
                fn = _ref[0];
                time = _ref[1];
            }
            wrapper = function () {
                nextAt += time;
                timeout = setTimeout(wrapper, nextAt - new Date().getTime());
                return fn();
            };
            cancel = function () {
                return clearTimeout(timeout);
            };
            timeout = setTimeout(wrapper, nextAt - new Date().getTime());
            return {
                cancel: cancel
            };
        };
    }).call(this);
    var KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39, KEYCODE_UP = 38, KEYCODE_DOWN = 40;
    var canvas;
    var stage;
    var content;
    var teclado;
    var tente;
    var contenttext;
    var contentgui;
    var clicavel = false;
    var flechas = [];
    var btsOff = [];
    var btsOn = [];
    var fase = 0;
    var i_acertos = 0;
    var i_erros = 0;
    var posX = [152, 30, 152, 275];
    var posY = [11, 130, 130, 130];
    var sons = ["tambor.mp3", "erro.mp3", "win.mp3", "tentenovamente.mp3", "musica1.mp3", "musica2_maislonga.mp3", "musica3_maislonga.mp3"];
    var caminho = "resources/image/";
    var flechaSombra;
    var subcount = 0;
    var dancarinos;
    var rate;

    function keyPressed(event) {
        switch (event.keyCode) {
            case KEYCODE_LEFT:
                calculaAcerto(1);
                break;
            case KEYCODE_RIGHT:
                calculaAcerto(3);
                break;
            case KEYCODE_UP:
                calculaAcerto(0);
                break;
            case KEYCODE_DOWN:
                calculaAcerto(2);
                break;
        }
        stage.update();
    }

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
        contenttext = new createjs.Container();
        content = new createjs.Container();
        contentgui = new createjs.Container();

        var fundo = new createjs.Bitmap(caminho + _fundo);
        fundo.image.onload = function () { };
        stage.addChild(fundo);
        stage.addChild(content);
        stage.addChild(contenttext);
        stage.addChild(contentgui);

        var spriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "ANI_DRAGAO.png"],
            frames: [[5, 5, 562, 188, 0, 281, 74.75], [572, 5, 558, 195, 0, 279, 82.75], [5, 205, 553, 226, 0, 272, 112.75], [563, 205, 557, 206, 0, 273, 92.75], [5, 436, 545, 193, 0, 264, 79.75], [555, 436, 545, 193, 0, 266, 80.75], [5, 634, 548, 198, 0, 267, 84.75], [558, 634, 566, 196, 0, 282, 82.75], [5, 837, 563, 198, 0, 282, 84.75], [573, 837, 561, 195, 0, 283, 82.75], [5, 1040, 563, 193, 0, 282, 79.75], [573, 1040, 565, 187, 0, 282, 73.75], [5, 1238, 563, 185, 0, 282, 71.75], [573, 1238, 564, 191, 0, 282, 78.75], [5, 1434, 565, 216, 0, 283, 102.75], [575, 1434, 569, 185, 0, 283, 71.75]],
            animations: {
                idle: 0,
                danca: [1, 15, "idle", 0.5]
            }
        });

        dancarinos = new createjs.Sprite(spriteSheet, "idle");
        stage.addChild(dancarinos);
        dancarinos.x = 600;
        dancarinos.y = 550;

        teclado = new createjs.Container();
        stage.addChild(teclado);

        var btinicio = new createjs.Bitmap(caminho + _iniciar);
        btinicio.image.onload = function () { };
        stage.addChild(btinicio);
        btinicio.on("mousedown", function (evt) {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            stage.removeChild(this);
            clicavel = true;

            criaFase();
            criaTeclado();
        });

        this.document.onkeydown = keyPressed;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function criaTeclado() {
        var fundoteclado = new createjs.Bitmap(caminho + "fundo_teclado.png");
        fundoteclado.image.onload = function () { };
        teclado.addChild(fundoteclado);
        teclado.x = 1500;
        teclado.y = 200;
        createjs.Tween.get(teclado).to({ x: 820 }, 250, createjs.Ease.quadOut);

        var i;
        for (i = 0; i < 4; i++) {
            btsOff[i] = new createjs.Bitmap(caminho + "t" + i + ".png");
            btsOff[i].image.onload = function () { };
            teclado.addChild(btsOff[i]);
            btsOff[i].x = posX[i];
            btsOff[i].y = posY[i];
            btsOff[i].id = i;
            btsOff[i].onoff = false;
            btsOn[i] = new createjs.Bitmap(caminho + "u" + i + ".png");
            btsOn[i].image.onload = function () { };
            teclado.addChild(btsOn[i]);
            btsOn[i].x = posX[i];
            btsOn[i].y = posY[i];
            btsOn[i].alpha = 0.01;
            btsOn[i].id = i;
            btsOn[i].idRot = itens[fase].botoes[i];
            btsOn[i].on("mousedown", function () {
                this.alpha = 1;
                calculaAcerto(this.id);
            });
            btsOn[i].on("pressup", function () {
                this.alpha = 0.01;
            });
        }
    }

    function calculaAcerto(idBt) {
        var rotacao = btsOn[idBt].idRot;
        dancarinos.gotoAndPlay("danca");
        dancarinos.scaleX = 1;
        if (idBt == 3) {
            dancarinos.scaleX = -1;
        } 

        var continuar = true;
        flechas.forEach(flecha =>{
            if (flecha.y < 340 && flecha.y > 270 && flecha.pode) {
                if (flecha.rotation == rotacao) {
                    animaIco('certo', 720, flecha.y);
                    i_acertos++;
                    continuar = false;
                    flecha.pode = false;
                }
                if (continuar) {
                    animaIco('errado', 720, 300);
                    i_erros++;
                    sons[1].play();
                }
            }
        });
    }


    function criaFase() {
        content.removeAllChildren();
        sons[itens[fase].idMusica].play();
        animaTitulo(itens[fase].titulo);
        flechas = [];

        flechaSombra = new createjs.Bitmap(caminho + "flecha.png");
        flechaSombra.image.onload = function () { };
        flechaSombra.regX = 112 / 2;
        flechaSombra.regY = 112 / 2;
        flechaSombra.x = 640;
        flechaSombra.y = 305;
        flechaSombra.alpha = 0.3;
        flechaSombra.rotation = itens[fase].sequencia[0];
        content.addChild(flechaSombra);

        var i = 0;
        var timer = accurateInterval(1000 * 60 / itens[fase].tempo, function () {
            if (i < itens[fase].sequencia.length) {
                flechas[i] = new createjs.Bitmap(caminho + "flecha.png");
                flechas[i].image.onload = function () { };
                flechas[i].regX = 112 / 2;
                flechas[i].regY = 112 / 2;
                flechas[i].x = 640;
                flechas[i].y = -100;
                flechas[i].pode = true;
                flechas[i].rotation = itens[fase].sequencia[i];
                createjs.Tween.get(flechaSombra).wait(itens[fase].velocidade / 5).to({ rotation: itens[fase].sequencia[i] }, 100);
                content.addChild(flechas[i]);
                createjs.Tween.get(flechas[i]).to({ y: 650 }, itens[fase].velocidade, createjs.Ease.linear).call(apaga);
                i++;
            }
        });
        createjs.Tween.get(content).wait(itens[fase].velocidade * 7).call(fimMusica);
    }
    function fimMusica() {
        sons[2].play();

        if (fase < itens.length - 1 && i_erros < errosMaximo) {
            fase++;
            createjs.Tween.get(content).wait(1500).call(criaFase);
        } else {
            Fim();
        }
    }
    function apaga() {
        content.removeChild(this);
        if (this.pode) {
            i_erros++;
        }
    }
    function animaTitulo(texto) {
        var tit = new createjs.Container();
        content.addChild(tit);

        var txt = new createjs.Text(texto, "80px VAG Rounded BT", "#000000");
        txt.regY = 60;
        txt.lineWidth = 750;
        txt.textAlign = "center";

        tit.addChild(txt);

        tit.x = -300;
        tit.y = 160;
        createjs.Tween.get(tit).to({ x: 300 }, 300, createjs.Ease.backOut);
    }
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        stage.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 150;
        ico.regY = 150;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut).wait(350).call(deleta);
    }
    function deleta() {
        stage.removeChild(this);
    }
    function ticker(event) {
        stage.update();
    }
    function Fim() {
        var img;
        var bo;
        var continua = false;
        content.removeAllChildren();
        img = caminho + "gui.png";
        continua = true;
        teclado.x = 1500;

        if (continua) {
            inicio1 = false;
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.y = 720;
            content.addChild(bo);
            createjs.Tween.get(bo).wait(100).to({ y: -100 }, 1000, createjs.Ease.quadOut);

            var txt = new createjs.Text('Pontos:' + i_acertos, "42px VAG Rounded BT", "#000000");
            content.addChild(txt);
            txt.x = 500;
            txt.y = 150;

            var txt2 = new createjs.Text('Erros:' + i_erros, "42px VAG Rounded BT", "#000000");
            content.addChild(txt2);
            txt2.x = 500;
            txt2.y = 220;

            bo.on("mousedown", function (evt) {
                teclado.x = 820;
                content.removeAllChildren();
                fase = 0;
                i_acertos = 0;
                i_erros = 0;
                criaFase();
            });
        }
    }
}