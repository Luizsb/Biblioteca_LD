appIngredienteComSom = function (itens, _gabaritoCorreto, _gabaritoCorreto2, idCanvas) {
    var canvas1,
    caminho = "resources/image/",
    stage,
    content,
    tripa,
    fundo1,
    fundo2,
    agua,
    inicio1 = false,
    btinicia,
    gabarito=[],
    ingredientes = [],
    animacoes = [],
    edgeOffset = 10,
    respostas = [0, 0, 0],
    copoframe = 0,
    agua = 0,
    vinagre = 0,
    po = 0,
    positivo,
    btcontinuar,
    imagens,
    gui,
    startTime,
    erro,
    i_erros = 0,
    i_acertos = 0,
    pos = 360,
    mostraTutorial = true,
    count = 0,
    sprites = [],
    tigela,
    sptigela,
    forma,
    spForma,
    forno,
    spForno,
    itemArraste,
    bt1, bt2,
    audioOn, audioOff,
    relogio,
    relogioPonteiro,
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
    audioIngredientes;

    init2();

    function init2() {
        criaSheets();
        var index;
        for (index in sons) {
            var t = sons[index];
            sons[index] = new Audio(caminho + t);
        }

        canvas1 = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas1);
        stage.enableMouseOver(10);
        createjs.Touch.enable(stage);
        content = new createjs.Container();
        tripa = new createjs.Container();
        fundo1 = new createjs.Bitmap(caminho + "fundo_parte1.png");
        fundo1.image.onload = function () { };
        stage.addChild(fundo1);

        fundo2 = new createjs.Bitmap(caminho + "fundo_parte2.png");
        fundo2.image.onload = function () { };
        fundo2.alpha = 0;
        stage.addChild(fundo2);

        stage.addChild(content);
        stage.addChild(tripa);
        forno = new createjs.Sprite(spForno, "idle");
        content.addChild(forno);
        forno.x = 883;
        forno.y = 536;
        forno.alpha = 0;
        forno.visible = false;

        relogio = new createjs.Bitmap(caminho + "relogio.png");
        relogio.image.onload = function () { };
        relogio.x = 190;
        relogio.y = 190;

        relogioPonteiro = new createjs.Bitmap(caminho + "ponteiro.png");
        relogioPonteiro.image.onload = function () { };
        relogioPonteiro.x = 382;
        relogioPonteiro.y = 394;
        relogioPonteiro.regX = 24;
        relogioPonteiro.regY = 102;

        montaEtapa1();

        audioIngredientes = new Audio(caminho + "intrucoes.mp3");

        btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            this.visible = false;
            if (mostraTutorial) {
                tutorial();
            } else {
                inicio1 = true;
            }
            botaoAudio();
        });
        audioIngredientes.onended = function () {
            audioIngredientes.currentTime = 0;
            audioOn.visible = true;
            audioOff.visible = false;
        };
        createjs.Ticker.setFPS(30);
        createjs.Ticker.on("tick", ticker);
    }
    function tutorial() {
        var mao = new createjs.Container();
        mao = new createjs.Bitmap(caminho + "hand.png");
        mao.image.onload = function () { };
        mao.regX = 50;
        mao.regY = 37;
        stage.addChild(mao);
        mao.x = mao.y = -200;
        createjs.Tween.get(mao).to({ x: 250, y: 640, rotation: -90 }, 1500, createjs.Ease.quadOut).wait(1500).to({ x: 200, y: 55, rotation: 0 }, 1500, createjs.Ease.quadOut).wait(1500).to({ x: 1200, y: 130, rotation: 90 }, 1500, createjs.Ease.quadOut).wait(1000).to({ alpha: 0 }, 500).call(terminaTutorial);
        createjs.Tween.get(tripa).wait(1500).to({ y: -360 }, 350, createjs.Ease.quadOut).wait(350).to({ y: -360 * 3 }, 350, createjs.Ease.quadOut).wait(350).to({ y: -360 * 5 }, 350, createjs.Ease.quadOut).wait(1000).to({ y: -360 * 3 }, 350, createjs.Ease.quadOut).wait(350).to({ y: -360 }, 350, createjs.Ease.quadOut);
        pos = -360;
    }
    function terminaTutorial() {
        animaTitulo("Vamos lá!");
        stage.removeChild(this);
        audioIngredientes.currentTime = 0;
        audioIngredientes.play();
        audioOn.visible = false;
        audioOff.visible = true;
        inicio1 = true;
    }
    function botaoAudio() {
        audioOn = new createjs.Bitmap(caminho + "btaudioOn.png");
        audioOn.image.onload = function () { };
        stage.addChild(audioOn);
        audioOn.x = 1000;
        audioOn.y = 18;
        audioOn.on("click", function () {
            if (inicio1) {
                this.visible = false;
                audioOff.visible = true;
                audioIngredientes.play();
            }
        });

        audioOff = new createjs.Bitmap(caminho + "btaudioOff.png");
        audioOff.image.onload = function () { };
        stage.addChild(audioOff);
        audioOff.x = 1000;
        audioOff.y = 18;
        audioOff.on("click", function () {
            if (inicio1) {
                this.visible = false;
                audioOn.visible = true;
                audioIngredientes.pause();
            }
        });
        audioOn.visible = true;
        audioOff.visible = false;
    }

    function montaEtapa1() {
        tripa.removeAllChildren();
        tripa.visible = true;
        pos = 360;
        tripa.y = pos;
        ingredientes = [];
        animacoes = [];
        fundo1.x = fundo1.y = 0;
        fundo1.scaleX = fundo1.scaleY = 1;

        forma = new createjs.Sprite(spForma, "idle");
        content.addChild(forma);
        forma.x = 1700;
        forma.y = 450;

        tigela = new createjs.Sprite(sptigela, "idle");
        content.addChild(tigela);
        tigela.x = 850;
        tigela.y = 466;

        var i;
        for (i = 0; i < itens.length; i++) {
            ingredientes[i] = new createjs.Container();

            animacoes[i] = new createjs.Sprite(sprites[itens[i].idSprite], "idle");
            animacoes[i].y = 40;

            ingredientes[i].y = 720 * i;
            ingredientes[i].py = 720 * i;
            ingredientes[i].x = ingredientes[i].px = 240;
            ingredientes[i].id = i;
            ingredientes[i].sp = itens[i].idSprite;
            ingredientes[i].pode = true;
            ingredientes[i].nome = itens[i].nome;

            ingredientes[i].addChild(animacoes[i]);
            tripa.addChild(ingredientes[i]);

            var txt = new createjs.Text(itens[i].nome, "bold 40px VAG Rounded BT", "#000000");
            txt.textAlign = "center";
            txt.y = -90;
            txt.name = "texto";
            txt.lineWidth = 250;
            txt.regY = txt.getBounds().height;
            ingredientes[i].addChild(txt);

            var txt2 = new createjs.Text(itens[i].porcao, "bold 60px VAG Rounded BT", "#000000");
            txt2.textAlign = "center";
            txt2.y = 35;
            txt2.x = -20;
            ingredientes[i].addChild(txt2);
            ingredientes[i].on("mousedown", function (evt) {
                if (inicio1) {
                    itemArraste = new createjs.Sprite(sprites[this.sp], "idle");
                    stage.addChild(itemArraste);
                    itemArraste.x = evt.stageX;
                    itemArraste.y = evt.stageY;
                    itemArraste.nome = this.nome;
                    var global = stage.localToGlobal(itemArraste.x, itemArraste.y);
                    itemArraste.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                    itemArraste.alpha = 0.85;
                }
            });
            ingredientes[i].on("pressmove", function (evt) {
                if (inicio1) {
                    var local = stage.globalToLocal(evt.stageX + itemArraste.offset.x, evt.stageY + itemArraste.offset.y);
                    itemArraste.x = local.x;
                    itemArraste.y = local.y;
                }
            });
            ingredientes[i].on("pressup", function (evt) {
                if (inicio1) {
                    if (itemArraste.x > 300) {
                        itemArraste.gotoAndPlay("anima");
                        itemArraste.alpha = 1;
                        createjs.Tween.get(itemArraste).to({ x: 870, y: 197 }, 150);
                        console.log("teste: "+_gabaritoCorreto[count] +" "+itemArraste.nome);
                        gabarito.push(itemArraste.nome);
                        createjs.Tween.get(itemArraste).wait(1200).to({ alpha: 0 }, 800).call(escondeIngrediente);
                        if(_gabaritoCorreto[count]==itemArraste.nome){
                            animaIco("certo", 1100, 200);
                            sons[0].play();
                            if (gabarito.length == _gabaritoCorreto.length) {
                                tripa.visible = false;
                                bt1.visible = false;
                                bt2.visible = false;
                                createjs.Tween.get(tripa).wait(2000).call(montaEtapa2);
                            }
                            count++;
                        }else{
                            animaIco("errado", 1100, 200);
                            audioIngredientes.pause();
                            sons[1].play();
                            inicio1 = false;
                            i_erros = 10;
                            fimMesmo();
                        }

                    } else {
                        stage.removeChild(itemArraste);

                    }
                }
            });
        }
        bt1 = new createjs.Container();
        bt1 = new createjs.Bitmap(caminho + "flecha.png");
        bt1.image.onload = function () { };
        stage.addChild(bt1);
        bt1.x = 245;
        bt1.y = 60;
        bt1.scaleY = -1;
        bt1.regX = 455 / 2;
        bt1.regY = 85 / 2;
        bt1.alpha = 0.45;
        bt1.on("mousedown", function () {
            bt2.visible = true;
            if (inicio1) {
                this.scaleX = 0.5;
                this.scaleY = -0.5;
                createjs.Tween.get(this, { override: true }).to({ scaleX: 1, scaleY: -1 }, 600, createjs.Ease.backOut);
                if (pos < 360) {
                    pos += 720;
                    createjs.Tween.get(tripa, { override: true }).to({ y: pos }, 350, createjs.Ease.quadOut);
                } else {
                    bt1.visible = false;
                }

            }
        });

        bt2 = new createjs.Container();
        bt2 = new createjs.Bitmap(caminho + "flecha.png");
        bt2.image.onload = function () { };
        stage.addChild(bt2);
        bt2.x = 245;
        bt2.y = 665;
        bt2.regX = 455 / 2;
        bt2.regY = 85 / 2;
        bt2.alpha = 0.45;
        bt2.on("mousedown", function () {
            bt1.visible = true;
            if (inicio1) {
                this.scaleX = this.scaleY = 0.5;
                createjs.Tween.get(this, { override: true }).to({ scaleX: 1, scaleY: 1 }, 600, createjs.Ease.backOut);
                if (pos > (-720 * (itens.length - 2))) {
                    pos -= 720;
                    createjs.Tween.get(tripa, { override: true }).to({ y: pos }, 350, createjs.Ease.quadOut);
                } else {
                    bt2.visible = false;
                }
            }
        });
    }
    function montaEtapa2() {
        stage.removeChild(bt1);
        stage.removeChild(bt2);
        particulas1(640, 360);
        tigela.gotoAndStop('idle2');
        createjs.Tween.get(fundo1, { override: true }).to({ x: -250 }, 300, createjs.Ease.quadOut);
        createjs.Tween.get(tigela, { override: true }).to({ x: 640 }, 300, createjs.Ease.quadOut).wait(1200).call(montaEtapa3);
    }
    function montaEtapa3() {
        animaTitulo("Misture bem!");
        tigela.gotoAndPlay('anima');
        createjs.Tween.get(tigela).wait(2000).call(montaEtapa4);
    }
    function montaEtapa4() {
        animaTitulo("Coloque na forma");
        tigela.gotoAndStop('idle2');
        createjs.Tween.get(fundo1).to({ scaleX: 0.75, scaleY: 0.75 }, 1000, createjs.Ease.quadOut);
        createjs.Tween.get(tigela).to({ x: 300, y: 350, scaleX: 0.75, scaleY: 0.75 }, 1000, createjs.Ease.quadOut);
        createjs.Tween.get(forma).to({ x: 900, scaleX: 0.75, scaleY: 0.75 }, 1000, createjs.Ease.quadOut);
        tigela.on("mousedown", function (evt) {
            var global = stage.localToGlobal(this.x, this.y);
            this.ox = 300;
            this.oy = 350;
            this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };

        });
        tigela.on("pressmove", function (evt) {
            if (evt.stageX > this.ox) {
                this.rotation = (evt.stageX - this.ox) / 10;
            }
            var local = stage.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
            this.x = local.x;
            this.y = local.y;
        });
        tigela.on("pressup", function (evt) {
            if (this.x > 600) {
                content.removeChild(this);
                forma.gotoAndStop('idle2');
                animaIco('certo', forma.x, forma.y - 200);
                sons[0].play();
                createjs.Tween.get(forma).wait(2500).call(montaEtapa5);
            } else {
                createjs.Tween.get(this).to({ x: this.ox, y: this.oy, rotation: 0 }, 200, createjs.Ease.quadOut);
            }

        });
    }
    function montaEtapa5() {
        animaTitulo("Coloque no forno a 180 graus");
        forno.visible = true;
        createjs.Tween.get(forno).to({ alpha: 1 }, 1500, createjs.Ease.quadOut);
        createjs.Tween.get(fundo2).to({ alpha: 1 }, 1500, createjs.Ease.quadOut);
        createjs.Tween.get(forma).to({ x: 520, y: 272, scaleX: 0.35, scaleY: 0.35 }, 1500, createjs.Ease.quadOut).call(montaEtapa6);

    }
    function montaEtapa6() {
        forma.on("mousedown", function (evt) {
            var global = stage.localToGlobal(this.x, this.y);
            this.ox = 520;
            this.oy = 272;
            this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
            forno.gotoAndPlay('animaAbre');

        });
        forma.on("pressmove", function (evt) {
            var local = stage.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
            this.x = local.x;
            this.y = local.y;
            if (this.x > 700 && this.y > 370) {
            }
        });
        forma.on("pressup", function (evt) {
            if (this.x > 700 && this.y > 370) {
                content.removeChild(this);
                forno.gotoAndPlay('animaFecha');
                animaIco('certo', forma.x, forma.y - 200);
                sons[0].play();
                stage.addChild(relogio);
                stage.addChild(relogioPonteiro);
                createjs.Tween.get(relogioPonteiro).to({ rotation: 180 }, 5000).call(fim);
                var somdahora = new Audio(caminho + "somrelogio.mp3");
                somdahora.play();
            } else {
                createjs.Tween.get(this).to({ x: this.ox, y: this.oy, rotation: 0 }, 200, createjs.Ease.quadOut);
            }

        });
    }
    function escondeIngrediente() {
        tripa.removeChild(this);
    }
    function fim() {
        var somdahora = new Audio(caminho + "ding.mp3");
        somdahora.play();
        createjs.Tween.get(relogioPonteiro).wait(1000).call(fimMesmo);
    }
    function fimMesmo() {
        var img;
        var bo;
        var continua = false;
        tripa.removeAllChildren();

        stage.removeChild(relogio);
        stage.removeChild(relogioPonteiro);

        if (i_erros > 0) {
            img = caminho + "tentenovamente.png";
            continua = true;
            stage.removeChild(bt1);
            stage.removeChild(bt2);
        } else {
            img = caminho + "positivo.png";
            continua = true;
            animaIco('certo', 850, 220);
            forno.gotoAndPlay('animaAbre2');
        }

        if (continua) {
            inicio1 = false;
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = 160;
            bo.regY = 220;
            bo.x = 250;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).to({ y: 360 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                content.removeChild(forma);
                content.removeChild(tigela);
                stage.removeChild(this);
                gabarito = [];
                inicio1 = true;
                i_erros = 0;
                forno.alpha = 0;
                forno.visible = false;
                fundo2.alpha = 0;
                count=0;
                montaEtapa1();

                audioIngredientes.currentTime = 0;
                audioIngredientes.play();
                audioOn.visible = false;
                audioOff.visible = true;

            });
        }
    }

    function particulas1(tx, ty) {
        var cont = new createjs.Container();
        var rotations = [0, 90, 120, 180, 270];
        var i;
        for (i = 0; i < 5; i++) {
            var b = new createjs.Bitmap(caminho + "brilho2.png");
            b.image.onload = function () { };
            b.regX = 575;
            b.regY = 55;
            b.rotation = rotations[i];
            b.scaleX = b.scaleY = 0.1;
            createjs.Tween.get(b).wait(i * 60).to({ scaleX: 1, scaleY: 1 }, 800, createjs.Ease.quadOut).wait(500 + i * 120).to({ alpha: 0 }, 1000, createjs.Ease.linear);
            cont.addChild(b);
        }
        var b = new createjs.Bitmap(caminho + "brilho1.png");
        b.image.onload = function () { };
        b.regX = 107;
        b.regY = 107;
        b.scaleX = b.scaleY = 0.1;
        createjs.Tween.get(b).wait(60).to({ scaleX: 1, scaleY: 1 }, 800, createjs.Ease.backOut).wait(600).to({ alpha: 0 }, 2000, createjs.Ease.linear);
        cont.addChild(b);

        var r = Math.random() * 360;
        cont.rotation = r;
        createjs.Tween.get(cont).to({ rotation: r + 45 }, 3000, createjs.Ease.linear).call(deleta);
        stage.addChild(cont);
        cont.x = tx;
        cont.y = ty;
    }
    function animaTitulo(texto) {
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
        tit.y = 600;
        createjs.Tween.get(tit).to({ x: 640 }, 300, createjs.Ease.backOut).wait(1500).call(deletaIco);
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
        createjs.Tween.get(ico).to({ scaleX: 0.35, scaleY: 0.35 }, 200, createjs.Ease.quadOut).wait(800).call(deletaIco);
    }
    function deletaIco() {
        stage.removeChild(this);
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
    function deleta() {
        content.removeChild(this);
        inicio1 = true;
    }
    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + 300;
        var ay2 = object1.y + 200;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + 300;
        var by2 = by1 + 200;

        if (object1 == object2) {
            return false;
        }
        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {
            return false;
        }
    }
    function criaSheets() {
        sptigela = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "tigela.png"],
            frames: [[5, 5, 588, 300, 0, 294.65, 149.89999999999998], [598, 5, 588, 300, 0, 294.65, 149.89999999999998], [1191, 5, 588, 460, 0, 294.65, 309.9], [5, 470, 588, 465, 0, 294.65, 314.9], [598, 470, 588, 443, 0, 294.65, 292.9], [1191, 470, 588, 417, 0, 294.65, 266.9], [5, 940, 588, 412, 0, 294.65, 261.9], [598, 940, 611, 436, 0, 317.65, 285.9], [1214, 940, 588, 460, 0, 294.65, 309.9]],
            animations: {
                "idle": 0,
                "idle2": 1,
                "anima": [2, 8, "anima", 0.8]
            }
        });
        spForno = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "forno.png"],
            frames: [[5, 5, 341, 273, 0, 170.95, 136.5], [351, 5, 445, 273, 0, 172.95, 136.5], [801, 5, 537, 274, 0, 170.95, 136.5], [1343, 5, 544, 354, 0, 170.95, 136.5], [5, 364, 544, 354, 0, 170.95, 136.5], [554, 364, 537, 274, 0, 170.95, 136.5], [1096, 364, 445, 273, 0, 172.95, 136.5], [1546, 364, 341, 273, 0, 170.95, 136.5], [5, 723, 341, 273, 0, 170.95, 136.5], [351, 723, 341, 273, 0, 170.95, 136.5], [697, 723, 445, 273, 0, 172.95, 136.5], [1147, 723, 537, 274, 0, 170.95, 136.5], [5, 1002, 544, 354, 0, 170.95, 136.5]],
            animations: {
                "idle": 0,
                "idle2": 3,
                "idle3": 7,
                "idle4": 12,
                "animaFecha": [4, 7, "idle3", 0.5],
                "animaAbre": [1, 3, "idle2", 0.5],
                "animaAbre2": [8, 12, "idle4", 0.5]
            }
        });
        spForma = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "forma.png"],
            frames: [[5, 5, 689, 206, 0, 354.5, 172.85], [5, 216, 689, 206, 0, 354.5, 172.85], [5, 427, 689, 232, 0, 354.5, 198.85]],
            animations: {
                "idle": 0,
                "idle2": 1,
                "idle3": 2,
                "anima": [2, 8, "anima", 0.8]
            }
        });
        sprites[0] = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "ovo.png"],
            frames: [[5, 5, 258, 258, 0, 123.5, 124.19999999999999], [268, 5, 258, 258, 0, 123.5, 124.19999999999999], [531, 5, 280, 289, 0, 123.5, 129.2], [5, 299, 309, 323, 0, 123.5, 140.2], [319, 299, 310, 359, 0, 123.5, 141.2], [634, 299, 311, 356, 0, 123.5, 143.2], [5, 663, 313, 360, 0, 123.5, 144.2], [323, 663, 314, 362, 0, 123.5, 146.2], [642, 663, 315, 362, 0, 123.5, 147.2], [5, 1030, 317, 363, 0, 123.5, 149.2], [327, 1030, 318, 303, 0, 123.5, 151.2]],
            animations: {
                "idle": 0,
                "idle2": 10,
                "anima": [0, 10, "idle2", 0.8]
            }
        });
        sprites[1] = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "xicaraAcucar.png"],
            frames: [[5, 5, 301, 225, 0, 150.75, 112.19999999999999], [311, 5, 308, 238, 0, 166.75, 114.19999999999999], [624, 5, 281, 250, 0, 162.75, 121.19999999999999], [5, 260, 286, 287, 0, 186.75, 142.2], [296, 260, 294, 365, 0, 184.75, 150.2], [595, 260, 274, 359, 0, 152.75, 144.2], [5, 630, 234, 359, 0, 112.75, 144.2], [244, 630, 234, 359, 0, 112.75, 144.2], [483, 630, 234, 359, 0, 112.75, 144.2], [722, 630, 234, 359, 0, 112.75, 144.2], [5, 994, 234, 309, 0, 112.75, 144.2]],
            animations: {
                "idle": 0,
                "idle2": 10,
                "anima": [0, 10, "idle2", 0.8]
            }
        });
        sprites[2] = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "xicaraAgua.png"],
            frames: [[5, 5, 305, 229, 0, 152.15, 114.15], [315, 5, 312, 242, 0, 168.15, 116.15], [632, 5, 286, 254, 0, 164.15, 123.15], [5, 264, 245, 273, 0, 143.15, 143.15], [255, 264, 267, 367, 0, 155.15, 152.15], [527, 264, 257, 362, 0, 134.15, 147.15], [5, 636, 253, 362, 0, 130.15, 147.15], [263, 636, 251, 362, 0, 128.15, 147.15], [519, 636, 238, 362, 0, 115.15, 147.15], [762, 636, 237, 362, 0, 114.15, 147.15], [5, 1003, 237, 313, 0, 114.15, 147.15]],
            animations: {
                "idle": 0,
                "idle2": 10,
                "anima": [0, 10, "idle2", 0.8]
            }
        });
        sprites[3] = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "xicaraChocolate.png"],
            frames: [[5, 5, 301, 228, 0, 150.8, 115.19999999999999], [311, 5, 308, 238, 0, 166.8, 114.19999999999999], [624, 5, 305, 250, 0, 186.8, 121.19999999999999], [5, 260, 288, 279, 0, 188.8, 142.2], [298, 260, 293, 365, 0, 183.8, 150.2], [596, 260, 245, 359, 0, 123.80000000000001, 144.2], [5, 630, 247, 359, 0, 125.80000000000001, 144.2], [257, 630, 255, 359, 0, 133.8, 144.2], [517, 630, 234, 359, 0, 112.80000000000001, 144.2], [756, 630, 234, 359, 0, 112.80000000000001, 144.2], [5, 994, 234, 309, 0, 112.80000000000001, 144.2], [244, 994, 234, 309, 0, 112.80000000000001, 144.2]],
            animations: {
                "idle": 0,
                "idle2": 10,
                "anima": [0, 10, "idle2", 0.8]
            }
        });
        sprites[4] = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "xicaraFarinha.png"],
            frames: [[5, 5, 301, 228, 0, 150.8, 115.19999999999999], [311, 5, 308, 238, 0, 166.8, 114.19999999999999], [624, 5, 305, 250, 0, 186.8, 121.19999999999999], [5, 260, 288, 279, 0, 188.8, 142.2], [298, 260, 293, 362, 0, 183.8, 150.2], [596, 260, 245, 359, 0, 123.80000000000001, 144.2], [5, 627, 247, 359, 0, 125.80000000000001, 144.2], [257, 627, 255, 359, 0, 133.8, 144.2], [517, 627, 234, 359, 0, 112.80000000000001, 144.2], [756, 627, 234, 359, 0, 112.80000000000001, 144.2], [5, 991, 234, 309, 0, 112.80000000000001, 144.2], [244, 991, 234, 309, 0, 112.80000000000001, 144.2]],
            animations: {
                "idle": 0,
                "idle2": 10,
                "anima": [0, 10, "idle2", 0.8]
            }
        });
        sprites[5] = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "xicaraOleo.png"],
            frames: [[5, 5, 305, 229, 0, 152.15, 114.15], [315, 5, 312, 242, 0, 168.15, 116.15], [632, 5, 286, 254, 0, 164.15, 123.15], [5, 264, 245, 273, 0, 143.15, 143.15], [255, 264, 267, 367, 0, 155.15, 152.15], [527, 264, 257, 362, 0, 134.15, 147.15], [5, 636, 253, 362, 0, 130.15, 147.15], [263, 636, 251, 362, 0, 128.15, 147.15], [519, 636, 238, 362, 0, 115.15, 147.15], [762, 636, 237, 362, 0, 114.15, 147.15], [5, 1003, 237, 313, 0, 114.15, 147.15]],
            animations: {
                "idle": 0,
                "idle2": 10,
                "anima": [0, 10, "idle2", 0.8]
            }
        });
        sprites[6] = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "colher.png"],
            frames: [[5, 5, 327, 258, 0, 163, 119.1], [337, 5, 322, 258, 0, 157, 119.1], [664, 5, 310, 266, 0, 147, 119.1], [5, 276, 303, 304, 0, 134, 119.1], [313, 276, 279, 329, 0, 120, 119.1], [597, 276, 275, 331, 0, 120, 123.1], [5, 612, 258, 346, 0, 120, 137.1], [268, 612, 258, 291, 0, 120, 137.1]],
            animations: {
                "idle": 0,
                "idle2": 7,
                "anima": [0, 7, "idle2", 0.8]
            }
        });
        sprites[7] = new createjs.SpriteSheet({
            framerate: 20,
            images: [caminho + "pitada.png"],
            frames: [[5, 5, 327, 258, 0, 163, 119.1], [337, 5, 322, 258, 0, 157, 119.1], [664, 5, 310, 266, 0, 147, 119.1], [5, 276, 303, 304, 0, 134, 119.1], [313, 276, 279, 329, 0, 120, 119.1], [597, 276, 275, 331, 0, 120, 123.1], [5, 612, 258, 346, 0, 120, 137.1], [268, 612, 258, 291, 0, 120, 137.1]],
            animations: {
                "idle": 0,
                "idle2": 7,
                "anima": [0, 7, "idle2", 0.8]
            }
        });
    }
    function ticker() {
        stage.update();

    }
}