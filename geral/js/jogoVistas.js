var AppSeleciona = function (idCanvas) {
    var caminho = "resources/image/",
        canvas,
        stage,
        content2,
        pergunta,
        icones,
        areaDesenho,
        count = 0,
        cubos = [],
        hitMe = [],
        hitMeNot = [],
        nPerguntas = 0,
        corDispo = ['#b5e51d', '#880016', '#ff7f26', '#ff216a', '#00a3e8', '#a349a3', '#fef200', '#ffffff'],
        clicavel = true,
        desenhando = false,
        circuloTemp,
        circulo,
        pos = [],
        modoEdicao = false,
        mostraBolinhas = false,
        offsetX = 600,
        offsetY = 100,
        i_erros = 0,
        gabarito = [0, 0, 0],
        confere = [true, true, true],
        i_acertos = 0,
        sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];

    var itens = [
        {
            quantidade: 16,
            perguntas: [6, 6, 4],
            cores: ['#b5e51d', '#880016', '#ff7f26'],
            pecas: ["verde.png", "rosa.png", "amarelo.png", "azul.png", "laranja.png", "amarelo.png", "azul.png", "roxo.png"],
            pos: [
                [[588, 200], [590, 241], [591, 284], [587, 320], [630, 321], [630, 283]],
                [[751, 120], [753, 160], [755, 198], [794, 200], [832, 197], [874, 201]],
                [[998, 241], [998, 281], [998, 321], [1039, 322]]]
        }];

    function montaCubos() {
        cubos = [];
        content2.removeAllChildren();
        var calculaMirror = 0;
        var mirror = 0;
        var i, j;
        for (j = 0; j < itens[count].perguntas.length; j++) {
            for (i = 0; i < itens[count].perguntas[j]; i++) {
                var bt = new createjs.Shape();
                bt.graphics.beginFill(itens[count].cores[j]).drawCircle(0, 0, 20);

                content2.addChild(bt);
                bt.qual = j;
                bt.id = i;
                bt.alpha = 0.01;


                bt.x = itens[count].pos[j][i][0];
                bt.y = itens[count].pos[j][i][1];
                bt.on("mousedown", function (evt) {
                    if (clicavel) {
                        this.visible = false;
                        animaIco('certo', this.x, this.y);
                        gabarito[this.qual]++;
                        i_acertos++;
                        sons[0].play();

                        if (gabarito[0] == itens[count].perguntas[0] && confere[0]) {
                            animaIco('certo', 546, 544);

                            confere[0] = false;
                        }
                        if (gabarito[1] == itens[count].perguntas[1] && confere[1]) {
                            animaIco('certo', 546, 600);
                            confere[1] = false;
                        }
                        if (gabarito[2] == itens[count].perguntas[2] && confere[2]) {
                            animaIco('certo', 546, 660);

                            confere[2] = false;
                        }
                        var somaTudo = itens[count].perguntas[0] + itens[count].perguntas[1] + itens[count].perguntas[2];
                        if (i_acertos >= somaTudo) {
                            fim();
                        }
                        console.log(somaTudo + " " + i_acertos);
                    }
                });
            }
        }
    }

    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        icones.addChild(ico);
        ico.x = b + 10;
        ico.y = c;
        ico.regX = 150;
        ico.regY = 150;
        ico.scaleX = ico.scaleY = 0.1;
        if (qual == 'certo') {
            createjs.Tween.get(ico).to({ scaleX: 0.2, scaleY: 0.2 }, 350, createjs.Ease.backOut);
        } else {
            createjs.Tween.get(ico).to({ scaleX: 0.2, scaleY: 0.2 }, 350, createjs.Ease.backOut).wait(800).call(deletaIco);
        }
    }
    function deletaIco() {
        icones.removeChild(this);
    }
    function fim() {
        clicavel = false;
        var img;
        var bo;
        var continua = false;

        if (i_erros > 3) {
            img = caminho + "tentenovamente.png";
            continua = true;
            sons[3].play();
        } else {

            img = caminho + "positivo.png";
            continua = true;
            sons[2].play();
        }
        if (continua) {
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = 269 / 2;
            bo.regY = 450 / 2;
            bo.x = 300;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).wait(1000).to({ y: 350 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                pergunta.removeAllChildren();
                content2.removeAllChildren();
                icones.removeAllChildren();
                i_erros = 0;
                i_acertos = 0;
                count = 0;
                gabarito = [0, 0, 0];
                confere = [true, true, true];
                clicavel = true;
                montaCubos();
            });
        }
    }

    function ticker() {
        stage.update();
    }

    function init() {
        var index;
        var t;
        for (index in sons) {
            t = sons[index];
            sons[index] = new Audio(caminho + t);
        }
        canvas = document.getElementById("od1");
        stage = new createjs.Stage(canvas);
        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;
        content2 = new createjs.Container();
        pergunta = new createjs.Container();
        icones = new createjs.Container();

        var fundo = new createjs.Bitmap(caminho + "fundo_od2.png");
        fundo.image.onload = function () { };
        fundo.on("mousedown", function (evt) {
            if (clicavel) {
                sons[1].play();
                animaIco('errado', stage.mouseX, stage.mouseY);
                i_erros++;
                if (i_erros > 3) {
                    fim();
                }
            }
        });

        stage.addChild(fundo);
        stage.addChild(content2);
        stage.addChild(pergunta);
        stage.addChild(icones);

        var btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            btinicia.visible = false;
            montaCubos();

        });
        if (modoEdicao) {
            fundo.on("click", function () {
                console.log("[" + Math.floor(stage.mouseX) + "," + Math.floor(stage.mouseY) + "],");
            });
        }

        createjs.Ticker.setFPS(30);
        createjs.Ticker.on("tick", ticker);
    }
    init();
};