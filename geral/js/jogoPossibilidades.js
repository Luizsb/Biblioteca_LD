var appPossibilidades = function (idCanvas, itens) {
    var canvas,
    stage,
    content,
    contenthit,
    contentgui,
    fundo,
    inicio1 = false,
    btinicia,
    edgeOffset = 60,
    count = 0,
    subCount = 0,
    erro = 0,
    update = true,
    i_erros = 0,
    i_acertos = 0,
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
    caminho = "resources/image/",
    _resposta = [],
    itemArraste,
    ingredientes = [];

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
        contenthit = new createjs.Container();
        content = new createjs.Container();
        contentgui = new createjs.Container();
        fundo = new createjs.Bitmap(caminho + "fundo.jpg");
        fundo.image.onload = function () { };
        stage.addChild(fundo);

        stage.addChild(content);
        stage.addChild(contenthit);
        stage.addChild(contentgui);

        btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            btinicia.visible = false;
            inicio1 = true;
            configuraIngredientes();
        });

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function animaTitulo(texto) {
        var tit = new createjs.Container();
        content.addChild(tit);

        var txt = new createjs.Text(texto, "42px VAG Rounded BT", "#ffc000");
        txt.regY = 60;
        txt.lineWidth = 750;
        txt.textAlign = "center";

        var contorno = new createjs.Text(texto, "42px VAG Rounded BT", "#000000");
        contorno.regY = 60;
        contorno.lineWidth = 750;
        contorno.textAlign = "center";
        contorno.outline = 12;

        tit.addChild(contorno);
        tit.addChild(txt);

        tit.x = -300;
        tit.y = 100;
        createjs.Tween.get(tit).to({ x: 850 }, 300, createjs.Ease.backOut);
    }
    function configuraIngredientes() {
        content.removeAllChildren();
        contenthit.removeAllChildren();
        subCount = 0;
        ingredientes = [];
        _resposta = [];
        animaTitulo(itens[count].pergunta);
        inicio1 = true;
        var i;
        for (i = 0; i < itens[count].ingredientes.length; i++) {
            ingredientes[i] = new createjs.Bitmap(caminho + itens[count].ingredientes[i]);
            ingredientes[i].image.onload = function () { };
            ingredientes[i].nome = itens[count].ingredientes[i];
            ingredientes[i].regX = 293 / 2;
            ingredientes[i].regY = 209 / 2;
            ingredientes[i].x = ingredientes[i].px = itens[count].posicoes[i][0];
            ingredientes[i].y = ingredientes[i].py = itens[count].posicoes[i][1];
            ingredientes[i].scaleX = ingredientes[i].scaleY = 0.5;
            content.addChild(ingredientes[i]);
            ingredientes[i].on("mousedown", function (evt) {
                if (inicio1) {
                    itemArraste = new createjs.Bitmap(caminho + this.nome);
                    itemArraste.image.onload = function () { };
                    contenthit.addChild(itemArraste);
                    itemArraste.x = evt.stageX;
                    itemArraste.y = evt.stageY;
                    itemArraste.regX = 293 / 2;
                    itemArraste.regY = 209 / 2;
                    itemArraste.nome = this.nome;
                    var global = content.localToGlobal(itemArraste.x, itemArraste.y);
                    itemArraste.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                    itemArraste.alpha = 0.85;

                }
            });
            ingredientes[i].on("pressmove", function (evt) {
                if (inicio1) {
                    var local = content.globalToLocal(evt.stageX + itemArraste.offset.x, evt.stageY + itemArraste.offset.y);
                    itemArraste.x = local.x;
                    itemArraste.y = local.y;
                }
            });
            ingredientes[i].on("pressup", function (evt) {
                if (inicio1) {
                    if (itemArraste.x > 300) {
                        if (this.nome == itens[count].resposta[subCount]) {
                            itemArraste.x = 850;
                            itemArraste.y = 383 - subCount * 15;
                            itemArraste.alpha = 1;
                            subCount++;
                            _resposta.push(this.nome);
                            sons[0].play();
                            if (String(_resposta) == String(itens[count].resposta)) {
                                animaIco('certo', 1100, 150);
                                var ultimoItem = new createjs.Bitmap(caminho + String(itens[count].resposta[0]));
                                ultimoItem.image.onload = function () { };
                                contenthit.addChild(ultimoItem);
                                ultimoItem.regX = 293 / 2;
                                ultimoItem.regY = 209 / 2;
                                createjs.Tween.get(ultimoItem).to({ x: 850, y: 383 - subCount * 30 }, 150).wait(2000).call(proxima);
                                inicio1 = false;
                                i_acertos++;

                            } else {

                            }

                        } else {
                            contenthit.removeChild(itemArraste);
                            animaIco('errado', stage.mouseX, stage.mouseY, true);
                            sons[1].play();
                            i_erros++;
                        }
                    } else {
                        contenthit.removeChild(itemArraste);
                        animaIco('errado', stage.mouseX, stage.mouseY, true);
                        sons[1].play();
                        i_erros++;
                    }
                }
            });

        }

    }
    function proxima() {
        if (count < itens.length - 1) {
            count++;
            configuraIngredientes();
        } else {
            Fim();
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
    function verificaFim(e) {
        contenthit.removeChild(this);
        if (count > 8) {
            contentgui.visible = true;
        } else {
            count += 1;
            nasceMosca();
        }
        if (i_acertos > 9) {
            sons[2].play();

        }
    }
    function ticker(event) {
        if (update) {
            stage.update();

        }
    }
    function animaIco(qual, b, c, apagar) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        contenthit.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 315 / 2;
        ico.regY = 315 / 2;
        ico.scaleX = ico.scaleY = 0.1;
        if (apagar) {
            createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5, y: 330 }, 200, createjs.Ease.backOut).wait(200).call(apagaicone);
        } else {
            createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5, y: 330 }, 200, createjs.Ease.backOut);
        }
    }
    function apagaicone(e) {
        contenthit.removeChild(this);
    }
    function Fim() {
        var img;
        var bo;
        var continua = false;
        contentgui.visible = true;
        content.removeAllChildren();

        sons[2].play();
        img = caminho + "positivo.png";
        continua = true;

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
                stage.removeChild(this);
                inicio1 = true;
                i_acertos = 0;
                i_erros = 0;
                count = 0;
                configuraIngredientes();
            });
        }
    }

    function intersect(obj1, obj2) {

        var objBounds1 = obj1.getBounds().clone();
        var objBounds2 = obj2.getBounds().clone();
        if (obj1.x > (obj2.x - edgeOffset) && obj1.x < (obj2.x + objBounds2.width + edgeOffset) && obj1.y > (obj2.y - edgeOffset) && obj1.y < (obj2.y + objBounds2.height + edgeOffset)) {
            return true;
        } else {
            return false;
        }
    }
}
