var AppJogoOd5 = function (margemPerguntas, margemRespostas, itens) {
    var caminho = "resources/image/";
    var canvas;
    var stage;
    var content;
    var contenthit;
    var sons = ["tambor.mp3", "erro.mp3", "parabens.mp3", "tentenovamente.mp3"];
    var count = 0;
    var i_acertos = 0;
    var hits = [];
    var figuras = [];
    var inicio1 = false;
    var edgeOffsetX = 200;
    var edgeOffsetY = 200;
    var btreseta;
    var btinicia;
    var positivo;
    var i_erro = 0;
    var _enunciado = 'EI_3A_L3_OD5.mp3'

    function montaFase() {
        hits = [];
        figuras = [];
        shuffle(itens);
        var i;
        for (i = 0; i < itens.length; i++) {
            hits[i] = new createjs.Bitmap(caminho + itens[i].resposta);
            hits[i].image.onload = function () { };
            content.addChild(hits[i]);
            hits[i].x = i * itens[i].tamanhoResposta[0] + margemRespostas[0];
            hits[i].y = margemRespostas[1];
            hits[i].nome = itens[i].resposta;
            hits[i].regX = itens[i].tamanhoResposta[0] / 2;
            hits[i].regY = itens[i].tamanhoResposta[1] / 2;
        }
        shuffle(itens);
        for (i = 0; i < itens.length; i++) {
            figuras[i] = new createjs.Bitmap(caminho + itens[i].imagem);
            figuras[i].image.onload = function () { };
            content.addChild(figuras[i]);
            figuras[i].x = figuras[i].px = i * itens[i].tamanhoPergunta[0] + margemPerguntas[0];
            figuras[i].y = figuras[i].py = margemPerguntas[1];
            figuras[i].regX = itens[i].tamanhoPergunta[0] / 2;
            figuras[i].regY = itens[i].tamanhoPergunta[1] / 2;
            figuras[i].pode = true;
            figuras[i].nome = itens[i].resposta;

            figuras[i].scaleX = figuras[i].scaleY = 0.8;
            figuras[i].on("mousedown", function (evt) {
                if (this.pode && inicio1) {
                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                    this.scaleX = this.scaleY = 1;
                }
            });
            figuras[i].on("pressmove", function (evt) {
                if (this.pode && inicio1) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                }
            });
            figuras[i].on("pressup", function (evt) {
                if (this.pode && inicio1) {

                    var volta = true;
                    var i;
                    for (i = 0; i < itens.length; i++) {

                        if (collisionDetect(hits[i], this)) {
                            console.log(hits[i].nome + " " + this.nome);
                            if (hits[i].nome == this.nome) {
                                volta = false;
                                sons[0].play();
                                this.x = hits[i].x;
                                this.y = hits[i].y;
                                count++;
                                if (count >= 3) {
                                    positivo.visible = true;
                                    sons[2].play();
                                }
                                break;
                            }
                        }
                    }
                    if (volta) {
                        this.scaleX = this.scaleY = 0.55;
                        createjs.Tween.get(this).to({ x: this.px, y: this.py }, 500, createjs.Ease.backOut);
                        sons[1].play();
                    }
                }
            });
        }
    }
    function reseta() {
        positivo.visible = false;
        inicio1 = true;
        i_erro = 0;
        count = 0;
        var w = 0;
        content.removeAllChildren();
        contenthit.removeAllChildren();
        montaFase();
    }

    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + edgeOffsetX;
        var ay2 = object1.y + edgeOffsetY;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + edgeOffsetX;
        var by2 = by1 + edgeOffsetY;

        if (object1 == object2) {
            return false;
        }
        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {
            return false;
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
    function ticker(event) {
        stage.update();
    }
    function init5() {
        var enunciado = new Audio(caminho + '');
        enunciado.play();

        var index;
        for (index in sons) {
            var t = sons[index];
            sons[index] = new Audio(caminho + t);
        }

        canvas = document.getElementById("od5");
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        createjs.Touch.enable(stage);
        contenthit = new createjs.Container();
        content = new createjs.Container();
        var fundo = new createjs.Bitmap(caminho + "fundo_od5.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);

        stage.addChild(content);
        stage.addChild(contenthit);

        montaFase();

        positivo = new createjs.Bitmap(caminho + "positivo.png");
        positivo.image.onload = function () { };
        stage.addChild(positivo);
        positivo.x = 950;
        positivo.y = 350;
        positivo.scaleX = positivo.scaleY = 0.8;
        positivo.visible = false;
        positivo.on("click", function () {
            reseta();
        });

        btinicia = new createjs.Bitmap(caminho + "bt_iniciar_od4.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            btinicia.visible = false;
            inicio1 = true;
            if (typeof _enunciado !== 'undefined') {
                var enun = new Audio(caminho + _enunciado);
                enun.play();
            }

        });

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    init5();
};

