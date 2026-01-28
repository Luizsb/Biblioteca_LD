var AppIngredientes = function (idCanvas) {
    var canvas1,
    stage,
    content,
    content2,
    listaIngredientes,
    fundo,
    agua,
    inicio1 = false,
    btinicia,
    fig = [],
    copos = [],
    edgeOffset = 10,
    seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    equivalente = [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 3, 3, 3, 3, 1, 3, 5],
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
    mostraTuto = true,
    count = 0,
    caminho = "resources/image/",
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];


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
        content2 = new createjs.Container();

        listaIngredientes = new createjs.Container();

        fundo = new createjs.Bitmap(caminho + "fundo_od1.png");
        fundo.image.onload = function () { };

        stage.addChild(fundo);

        stage.addChild(content);
        stage.addChild(content2);

        shuffle(seq);

        montaFase();

        btinicia = new createjs.Bitmap(caminho + "bt_iniciar_od1.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            this.visible = false;
            if (mostraTuto) {
                tutorial();
            } else {
                inicio1 = true;
            }
            createjs.Ticker.setFPS(30);
        createjs.Ticker.on("tick", ticker);
        });

    stage.update();
        setTimeout(function(){stage.update();},400);
    
    function montaFase() {
        fig = [];
        copos = [];
        pos = 360;
        listaIngredientes.y = pos;
        content.addChild(listaIngredientes);
        var i;
        for (i = 0; i < 7; i++) {
            copos[i] = new createjs.Bitmap(caminho + "copo" + i + ".png");
            copos[i].image.onload = function () { };
            copos[i].y = 253;
            copos[i].x = 968;
            copos[i].visible = false;
            content2.addChild(copos[i]);
        }
        copos[0].visible = true;

        for (i = 0; i < 25; i++) {
            fig[i] = new createjs.Bitmap(caminho + "f" + seq[i] + ".png");
            fig[i].image.onload = function () { };
            fig[i].regX = 260;
            fig[i].regY = 210;
            fig[i].y = 720 * i;
            fig[i].py = 720 * i;
            fig[i].x = 340;
            fig[i].px = 340;
            fig[i].name = seq[i];
            fig[i].pode = true;
            listaIngredientes.addChild(fig[i]);

            fig[i].on("mousedown", function (evt) {
                if (inicio1 && this.pode) {
                    var global = listaIngredientes.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                    this.alpha = 1;

                }
            });
            fig[i].on("pressmove", function (evt) {
                if (inicio1 && this.pode) {
                    var local = listaIngredientes.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                }
            });
            fig[i].on("pressup", function (evt) {
                if (inicio1 && this.pode) {
                    if (this.x > 850) {
                        respostas[count] = this.name;
                        count++;
                        copoframe = equivalente[this.name];
                        this.pode = false;
                        this.alpha = 0.75;
                        sons[0].play();

                        particulas1(1072, 440);

                        if (copoframe == 1) {
                            po += 1;
                        } else if (copoframe == 3) {
                            vinagre += 1;
                        } else if (copoframe == 5) {
                            agua += 1;
                        }

                        var i;
                        for (i = 0; i < 7; i++) {
                            copos[i].visible = false;
                        }
                        if (po == 1) {
                            copoframe = 1;
                        } else if (po > 1) {
                            copoframe = 2;
                        }
                        if (agua == 1) {
                            copoframe = 5;
                        } else if (agua > 1) {
                            copoframe = 6;
                        }
                        if (vinagre == 1) {
                            copoframe = 3;
                        } else if (vinagre > 1) {
                            copoframe = 4;
                        }
                        copos[copoframe].visible = true;

                        if (count == 3) {
                            content.removeAllChildren();
                            fim();
                        }
                    }
                    this.x = this.px;
                    this.y = this.py;

                }
            });
        }
        var bt1 = new createjs.Container();
        bt1 = new createjs.Bitmap(caminho + "flecha1.png");
        bt1.image.onload = function () { };
        content.addChild(bt1);
        bt1.x = 330;
        bt1.y = 80;
        bt1.regX = 80;
        bt1.regY = 75;
        bt1.on("click", function () {
            if (inicio1) {
                this.scaleX = this.scaleY = 0.5;
                createjs.Tween.get(this, { override: true }).to({ scaleX: 1, scaleY: 1 }, 600, createjs.Ease.backOut);
                if (pos < 360) {
                    pos += 720;
                    createjs.Tween.get(listaIngredientes, { override: true }).to({ y: pos }, 350, createjs.Ease.quadOut);
                }
            }
        });
        var bt2 = new createjs.Container();
        bt2 = new createjs.Bitmap(caminho + "flecha2.png");
        bt2.image.onload = function () { };
        content.addChild(bt2);
        bt2.x = 330;
        bt2.y = 645;
        bt2.regX = 80;
        bt2.regY = 75;
        bt2.on("click", function () {
            if (inicio1) {
                this.scaleX = this.scaleY = 0.5;
                createjs.Tween.get(this, { override: true }).to({ scaleX: 1, scaleY: 1 }, 600, createjs.Ease.backOut);
                if (pos > (-720 * 23)) {
                    pos -= 720;
                    console.log("vai" + pos);
                    createjs.Tween.get(listaIngredientes, { override: true }).to({ y: pos }, 350, createjs.Ease.quadOut);
                }
            }
        });
    }
    function fim() {
        fig = [];
        var i;
        for (i = 0; i < 3; i++) {
            fig[i] = new createjs.Bitmap(caminho + "f" + respostas[i] + ".png");
            fig[i].image.onload = function () { };
            fig[i].regX = 260;
            fig[i].regY = 210;
            fig[i].y = 210;
            fig[i].x = 280 * i + 180;
            fig[i].scaleX = fig[i].scaleY = 0.5;
            createjs.Tween.get(fig[i]).to({ scaleX: 0.6, scaleY: 0.6 }, 600, createjs.Ease.backOut);
            content.addChild(fig[i]);

            if (respostas[i] < 3) {
                animaIco('certo', 280 * i + 180, 70);
            } else {
                i_erros++;
                animaIco('errado', 280 * i + 180, 70);
            }
        }
        btFim();
    }
    function btFim() {
        var img;
        var bo;
        var continua = false;

        if (i_erros > 0) {
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
            bo.regX = 160;
            bo.regY = 220;
            bo.x = 450;
            bo.y = 1000;
            bo.scaleX = bo.scaleY = 0.75;
            stage.addChild(bo);
            createjs.Tween.get(bo).to({ y: 500 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                count = 0;
                i_erros = 0;
                copoframe = 0;
                agua = 0;
                vinagre = 0;
                listaIngredientes.removeAllChildren();
                content.removeAllChildren();
                content2.removeAllChildren();
                montaFase();
                iniciar = true;
            });
        }

    }
    function tutorial() {
        var mao = new createjs.Container();
        mao = new createjs.Bitmap(caminho + "hand.png");
        mao.image.onload = function () { };
        mao.regX = 50;
        mao.regY = 37;
        content.addChild(mao);
        mao.x = mao.y = -200;
        createjs.Tween.get(mao).to({ x: 350, y: 640, rotation: -90 }, 1500, createjs.Ease.quadOut).wait(1500).to({ x: 350, y: 55, rotation: 0 }, 1500, createjs.Ease.quadOut).wait(1500).to({ alpha: 0 }, 500).call(deleta);

        createjs.Tween.get(listaIngredientes).wait(1500).to({ y: -360 }, 350, createjs.Ease.quadOut).wait(350).to({ y: -360 * 3 }, 350, createjs.Ease.quadOut).wait(350).to({ y: -360 * 5 }, 350, createjs.Ease.quadOut).wait(1000).to({ y: -360 * 3 }, 350, createjs.Ease.quadOut).wait(350).to({ y: -360 }, 350, createjs.Ease.quadOut);
        pos = -360;
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
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        content.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 150;
        ico.regY = 150;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.35, scaleY: 0.35 }, 200, createjs.Ease.quadOut).wait(500);
    }
    function deletaIco() {
        content.removeChild(this);
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
    function ticker() {
        stage.update();
    }
}
