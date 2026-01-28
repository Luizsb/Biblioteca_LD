var AppCartas = function (botoes, itensm, idCanvas) {
    var caminho = "resources/image/";
    var canvas;
    var stage;
    var fundo;
    var conta;
    var deck;
    var hit;
    var count = 0;
    var clicavel = true;
    var inicio1 = false;
    var btinicia;
    var fumacinha;
    var relogio;
    var tipotween = createjs.Ease.quadOut;
    var tipotween2 = createjs.Ease.quadIn;
    var posAbertaX = 1100;
    var posAbertaY = 450;
    var tamanhoCartaW = 314;
    var tamanhoCartaH = 225;
    var botoesArray = [];
    var gui;
    var i_acertos = 0;
    var i_erros = 0;
    var txt_a;
    var txt_e;
    var cartas = [];
    var ca_img = [];
    var sombracarta;
    var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];

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

        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;

        var fundo = new createjs.Bitmap(caminho + "fundo_pokermat.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);

        conta = new createjs.Container();
        stage.addChild(conta);

        deck = new createjs.Container();
        stage.addChild(deck);

        shuffle(itens);

        btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.x = 400;
        btinicia.y = 250;
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            btinicia.visible = false;
            fase();
            criaGui();
        });
        var spriteRelogio = new createjs.SpriteSheet({
            framerate: 20,
            "images": [caminho + "relogio.png"],
            "frames": { "regX": 100, "height": 214, "count": 13, "regY": 107, "width": 200 },
            "animations": {
                "idle": 0,
                "idle2": 12,
                "tempo1": [0, 12, "idle2", 0.035]
            }
        });
        var spriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            "images": [caminho + "fumaca.png"],
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

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function fase(qual) {
        var i;
        for (i = 0; i < botoes.length; i++) {
            botoesArray[i] = new createjs.Bitmap(caminho + botoes[i].imagem);
            botoesArray[i].image.onload = function () { };
            conta.addChild(botoesArray[i]);
            botoesArray[i].x = tamanhoCartaW * i * 1.03 + 190;
            botoesArray[i].y = -450;
            createjs.Tween.get(botoesArray[i]).wait(i * 100).to({ y: 150 }, 300, tipotween);
            botoesArray[i].regX = tamanhoCartaW / 2;
            botoesArray[i].regY = tamanhoCartaH / 2;
            botoesArray[i].name = botoes[i].imagem;
            botoesArray[i].sobreposicao = 215;
        }

        sombracarta = new createjs.Bitmap(caminho + "sombra.png");
        sombracarta.image.onload = function () { };
        deck.addChild(sombracarta);
        sombracarta.x = 900;
        sombracarta.y = 530;
        sombracarta.alpha = 0;

        count = itens.length - 1;
        for (i = 0; i < itens.length; i++) {
            cartas[i] = new createjs.Container();
            deck.addChild(cartas[i]);
            ca_img[i] = new createjs.Bitmap(caminho + "carta.png");
            ca_img[i].image.onload = function () { };
            cartas[i].addChild(ca_img[i]);

            ca_img[i].regX = 314 / 2;
            ca_img[i].regY = 225 / 2;
            ca_img[i].rotation = -45;
            cartas[i].x = posAbertaX;
            cartas[i].y = -600;
            cartas[i].scaleX = 0.8;
            cartas[i].scaleY = 0.4;

            createjs.Tween.get(ca_img[i]).wait(i * 100).to({ rotation: 45 }, 1000, tipotween);
            createjs.Tween.get(cartas[i]).wait(i * 100).to({ y: 630 - i * 8 }, 1000, tipotween);
        }
        createjs.Tween.get(sombracarta).to({ alpha: 0.5 }, 222 * itens.length, tipotween).call(compraCarta);

        var arraste = new createjs.Bitmap(caminho + "arraste.png");
        arraste.image.onload = function () { };
        stage.addChild(arraste);
        createjs.Tween.get(arraste).to({ alpha: 0.5 }, 500, tipotween).to({ alpha: 1 }, 500, tipotween).to({ alpha: 0.5 }, 500, tipotween).to({ alpha: 1 }, 500, tipotween).wait(500).call(deletaArraste);
    }
    function deletaArraste() {
        stage.removeChild(this);
    }

    function compraCarta() {
        clicavel = false;
        createjs.Tween.get(ca_img[count]).to({ rotation: 0 }, 1000, createjs.Ease.backOut);
        createjs.Tween.get(cartas[count]).to({ scaleY: 1, scaleX: 1, y: posAbertaY }, 1000, createjs.Ease.backOut).to({ scaleX: 0.1 }, 300, tipotween2).call(deletaCarta);
        var carta = new createjs.Bitmap(caminho + itens[count].carta);
        carta.image.onload = function () { };
        stage.addChild(carta);
        carta.scaleX = 0;
        carta.regX = 314 / 2;
        carta.regY = 225 / 2;
        carta.x = posAbertaX;
        carta.y = posAbertaY;
        carta.name = itens[count].resposta;
        createjs.Tween.get(carta).wait(1300).to({ scaleX: 1 }, 300, tipotween);

        carta.on("mousedown", function (evt) {
            if (clicavel) {
                this.parent.addChild(this);
                var global = conta.localToGlobal(this.x, this.y);
                this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
            }
        });
        carta.on("pressmove", function (evt) {
            if (clicavel) {
                var local = conta.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                this.x = local.x;
                this.y = local.y;
            }
        });
        carta.on("pressup", function (evt) {
            if (clicavel) {
                var volta = true;
                for (index in botoesArray) {
                    if (collisionDetect(this, botoesArray[index])) {
                        if (this.name == botoesArray[index].name) {
                            volta = false;
                            console.log(this.name);
                            conta.addChild(this);
                            this.x = botoesArray[index].x;
                            this.y = botoesArray[index].sobreposicao;
                            botoesArray[index].sobreposicao += 80;
                            animaIco('certo', this.x + tamanhoCartaW / 2, this.y + 30, false);
                            proxima();
                            sons[0].play();
                            i_acertos++;
                            txt_a.text = i_acertos;
                            break;
                        }
                    }
                }

                if (volta) {
                    i_erros++;
                    txt_e.text = i_erros;
                    sons[1].play();
                    animaIco('errado', this.x + tamanhoCartaW / 2, this.y, true);
                    createjs.Tween.get(this).to({ x: posAbertaX, y: posAbertaY }, 200, createjs.Ease.backOut);
                }
            }
        });
    }
    function proxima() {
        clicavel = false;
        if (count > 0) {
            count--;
            compraCarta();

        } else {
            verificaFim();
        }
    }
    function trocaFase() {
        if (count > 0) {
            conta.removeAllChildren();
            count--;
            fase();
        } else {
            verificaFim();
        }
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
        txt_e.x = 510;
        txt_e.y = 25;

        gui.addChild(_gui);
        gui.addChild(txt_a);
        gui.addChild(txt_e);
        gui.y = 630;
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
        deck.removeAllChildren();

        if (i_erros > 2) {
            img = caminho + "tentenovamente.png";
            continua = true;
            sons[3].play();

        } else {
            img = caminho + "positivo.png";
            continua = true;
            sons[2].play();
        }
        if (continua) {
            inicio1 = false;
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = bo.regY = 269 / 2;
            bo.x = 1100;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).to({ y: 350 }, 1000, tipotween);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                conta.removeAllChildren();
                gui.y = 630;
                gui.x = 0;
                i_acertos = 0;
                txt_a.text = i_acertos;
                i_erros = 0;
                txt_e.text = i_erros;
                fase();
            });
        }
    }
    function animaIco(qual, b, c, apagar) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        conta.addChild(ico);
        ico.x = b - 30;
        ico.y = c - 150;
        ico.regX = 98;
        ico.regY = 98;
        ico.scaleX = ico.scaleY = 0.1;
        if (apagar) {
            createjs.Tween.get(ico).to({ scaleX: 0.3, scaleY: 0.3 }, 200, createjs.Ease.quadOut).wait(500).call(sodeleta);
        } else {
            createjs.Tween.get(ico).to({ scaleX: 0.3, scaleY: 0.3 }, 200, createjs.Ease.quadOut);
        }
    }
    function sodeleta() {
        conta.removeChild(this);
    }
    function deletaCarta() {
        clicavel = true;
        deck.removeChild(this);
    }
    function textoContorno(texto) {
        var tit = new createjs.Container();
        stage.addChild(tit);

        var txt = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#ffffff");
        txt.regY = 60;
        txt.textAlign = "center";

        var contorno = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#000000");
        contorno.regY = 60;
        contorno.textAlign = "center";
        contorno.outline = 12;

        tit.addChild(contorno);
        tit.addChild(txt);

        tit.x = -300;
        tit.y = 100;
        createjs.Tween.get(tit).to({ x: 640 }, 300, createjs.Ease.backOut).wait(1500).to({ x: 1500 }, 300, createjs.Ease.backOut);
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

        var resp = new createjs.Container();
        resp.addChild(button);
        resp.addChild(txt);

        return resp;
    }
    function ticker(event) {
        stage.update();
    }
    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + 100;
        var ay2 = object1.y + 700;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + 100;
        var by2 = by1 + 700;

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