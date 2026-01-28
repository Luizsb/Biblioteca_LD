var appCompras = function (itens, idCanvas, _btIniciar) {
    var canvas;
    var stage;
    var content;
    var contenttext;
    var contentgui;
    var clicavel = false;
    var fundos = [];
    var count = 0;
    var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3", "cash.mp3"];
    var caminho = "resources/image/";
    var ingredientes = [];
    var subcountX = 855;
    var subcountY = 173;
    var hit;
    var fumacinha;
    var valor = 0; 

    var index;
    for (index in sons) {
        var t = sons[index];
        sons[index] = new Audio(caminho + t);
    }

    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;
    contenttext = new createjs.Container();
    content = new createjs.Container();
    contentgui = new createjs.Container();

    var fundo = new createjs.Bitmap(caminho + "fundo.png");
    fundo.image.onload = function () { };
    stage.addChild(fundo);

    hit = new createjs.Bitmap(caminho + "hit.png");
    hit.image.onload = function () { };
    stage.addChild(hit);
    hit.x = 1500;
    hit.y = 30;
    hit.alpha = 0.75;

    stage.addChild(content);
    stage.addChild(contenttext);
    stage.addChild(contentgui);

    var btinicio = new createjs.Bitmap(caminho + _btIniciar);
    btinicio.image.onload = function () { };
    content.addChild(btinicio);
    btinicio.on("mousedown", function (evt) {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        content.removeChild(this);
        clicavel = true;
        montaFase();
        createjs.Tween.get(hit).to({ x: 820 }, 500, createjs.Ease.backOut);
        mostraDica();

    });

    var spriteSheet = new createjs.SpriteSheet({
        framerate: 20,
        "images": [caminho + "fumaca.png"],
        "frames": { "regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200 },
        "animations": {
            "idle": 20,
            "fumaca1": [0, 9, "idle", 0.5],
            "fumaca2": [10, 19, "idle"]
        }
    });
    fumacinha = new createjs.Sprite(spriteSheet, "idle");
    stage.addChild(fumacinha);

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", ticker);

    function montaFase() {
        content.removeAllChildren();
        contenttext.removeAllChildren();
        valor = 0;
        subcountX = 855;
        subcountY = 173;
        clicavel = true;
        var pergunta = new createjs.Bitmap(caminho + itens[count].pergunta);
        pergunta.image.onload = function () { };
        pergunta.y = -500;
        pergunta.x = 20;
        createjs.Tween.get(pergunta).to({ y: 50 }, 500, createjs.Ease.backOut);
        content.addChild(pergunta);

        var offX = itens[count].margemBt[0];
        var i;
        for (i = 0; i < itens[count].botoes.length; i++) {
            var bt = new createjs.Bitmap(caminho + itens[count].botoes[i][0]);
            bt.image.onload = function () { };
            bt.nome = itens[count].botoes[i][0];
            bt.valor = itens[count].botoes[i][1];
            bt.x = offX;
            bt.px = offX;
            bt.sub = 3;
            bt.y = itens[count].margemBt[1] + itens[count].botoes[i][3];
            bt.py = itens[count].margemBt[1] + itens[count].botoes[i][3];

            offX += itens[count].botoes[i][2];
            content.addChild(bt);
            bt.on("mousedown", function (evt) {
                if (clicavel) {
                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                }
            });
            bt.on("pressmove", function (evt) {
                if (clicavel) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                }
            });
            bt.on("pressup", function (evt) {
                if (clicavel) {
                    if (collisionDetect(this, hit)) {
                        valor += this.valor;
                        verificaPreco(valor);
                        console.log('teste');
                        this.sub -= 1;
                        criaClone(this.nome);

                        if (this.sub <= 0) {
                            fumacinha.x = this.px + 150;
                            fumacinha.y = this.py + 80;
                            fumacinha.gotoAndPlay('fumaca1');
                            content.removeChild(this);
                        } else {
                            this.x = this.px;
                            this.y = 900;
                            createjs.Tween.get(this).to({ y: this.py }, 300, createjs.Ease.backOut);
                        }
                    } else {
                        createjs.Tween.get(this).to({ x: this.px, y: this.py }, 300, createjs.Ease.backOut);
                    }
                }
            });
        }
    }
    function criaClone(nome) {
        var bt = new createjs.Bitmap(caminho + nome);
        bt.image.onload = function () { };
        content.addChild(bt);
        bt.x = subcountX - 150;
        bt.y = subcountY;
        bt.scaleX = bt.scaleY = 1.3;
        createjs.Tween.get(bt).to({ x: subcountX, scaleX: 0.3, scaleY: 0.3 }, 200, createjs.Ease.backOut);

        subcountX += 70;
        if (subcountX > 1100) {
            subcountX = 855;
            subcountY += 45;
        }
    }
    function mostraDica() {
        var imagem = new createjs.Bitmap(caminho + "dica.png");
        imagem.image.onload = function () { };
        stage.addChild(imagem);
        createjs.Tween.get(imagem).to({ alpha: 0.25 }, 300).to({ alpha: 1 }, 300).to({ alpha: 0.25 }, 300).to({ alpha: 1 }, 300).wait(2000).call(apagaDica);
    }
    function apagaDica() {
        stage.removeChild(this);
    }
    function ticker(event) {
        stage.update();
    }
    function verificaPreco(texto) {
        sons[4].play();
        var t = '';
        var t1 = '';
        var t2 = '';
        if (texto < 10) {
            t = '005';
            t1 = t.substring(0, 1);
            t2 = t.substring(1, 3);
        } else if (texto >= 10 && texto < 100) {
            t = '0';
            t += String(texto);
            t1 = t.substring(0, 1);
            t2 = t.substring(1, 3);
        } else if (texto >= 100 && texto < 1000) {
            t = String(texto);
            t1 = t.substring(0, 1);
            t2 = t.substring(1, 3);
        } else {
            t = String(texto);
            t1 = t.substring(0, 2);
            t2 = t.substring(2, 4);
        }

        contenttext.removeAllChildren();
        var txt = new createjs.Text('R$' + t1 + ',' + t2, "90px VAG Rounded BT", "#000000");
        txt.textAlign = "center";

        txt.x = 1020;
        txt.y = 50;
        txt.scaleX = txt.scaleY = 0.7;
        createjs.Tween.get(txt).to({ scaleX: 1, scaleY: 1 }, 350, createjs.Ease.backOut);

        contenttext.addChild(txt);
        var final = false;

        if (texto > itens[count].resposta) {
            animaIco('errado', 750, 150);
            sons[1].play();
            clicavel = false;
            final = true;
        } else if (texto == itens[count].resposta) {
            count++;
            animaIco('certo', 750, 150);
            sons[0].play();
            clicavel = false;
            final = true;
        }
        if (final) {
            if (count < itens.length) {
                createjs.Tween.get(content).wait(2000).call(montaFase);
            } else {
                Fim();
            }
        }
    }
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        content.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 155;
        ico.regY = 155;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut);
    }
    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + 200;
        var ay2 = object1.y + 250;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + 200;
        var by2 = by1 + 250;

        if (object1 == object2) {
            return false;
        }
        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {
            return false;
        }
    }
    function Fim() {
        var img;
        var bo;
        var continua = false;
        img = caminho + "positivo.png";
        continua = true;
        if (continua) {
            inicio1 = false;
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = 269 / 2;
            bo.regY = 450 / 2;
            bo.x = 640;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).wait(500).to({ y: 350 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                count = 0;
                montaFase();
            });
        }
    }
}