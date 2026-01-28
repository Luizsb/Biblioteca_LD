var AppJogo = function (idCanvas, _itens, tamanhoQuad, posicaoIniPergunta, posicaoTextoPergunta) {
    var canvas,
        stage,
        content,
        contenthit,
        contentgui,
        fundo,
        fumaca,
        positivo,
        inicio1 = false,
        btinicia,
        moscas = [],
        caminho = "resources/image/",
        perguntaAtual = [],
        perguntaString = '',
        letrasTemplate = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        word_count = 0,
        hits = [],
        bts = [],
        figuras = [],
        letras = [],
        edgeOffset = 60,
        count = 0,
        si = 0,
        countTempo = 0,
        btcontinuar,
        score = 0,
        label,
        update = true,
        clicavel = true,
        inicio1 = true,
        sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];

    function formaPergunta() {
        hits = [];
        perguntaString = '';
        contenthit.removeAllChildren();

        for (i = 0; i < perguntaAtual.length; i++) {
            perguntaString += perguntaAtual[i];
            hits[i] = criaLetra(perguntaAtual[i], 40, tamanhoQuad, tamanhoQuad);
            hits[i].x = tamanhoQuad * i + posicaoIniPergunta[0];
            hits[i].y = posicaoIniPergunta[1];
            hits[i].name = _itens[count].resposta[i];
            hits[i].id = i;
            hits[i].pode = true;
            contenthit.addChild(hits[i]);
        }
    }
    function montaFase() {
        inicio1 = true;
        countTempo = 0;
        var margemY = 100;
        var margemX = 120;
        var tamanhoLetra = 70;
        content.removeAllChildren();

        perguntaAtual = [];
        for (i = 0; i < _itens[count].letrasVisiveis.length; i++) {
            perguntaAtual[i] = _itens[count].letrasVisiveis[i];
        }
        formaPergunta();

        var txt = new createjs.Text(_itens[count].pergunta, 35 + "px VAG Rounded BT", "#000000");

        txt.textAlign = "center";
        txt.lineWidth = 800;
        txt.x = posicaoTextoPergunta[0];
        txt.y = -200;
        createjs.Tween.get(txt).to({ y: posicaoTextoPergunta[1] }, 1000, createjs.Ease.bounceOut);
        content.addChild(txt);

        for (var i = 0; i < letrasTemplate.length; i++) {
            letras[i] = criaLetra(letrasTemplate[i], 30, tamanhoLetra, tamanhoLetra);

            content.addChild(letras[i]);

            if (margemY > 670) {
                margemX += tamanhoLetra;
                margemY = 100;
            }
            letras[i].x = -100;
            letras[i].y = margemY;
            letras[i].px = margemX;
            letras[i].py = margemY;
            letras[i].regX = tamanhoLetra / 2;
            letras[i].regY = tamanhoLetra / 2;
            letras[i].pode = true;
            letras[i].name = letrasTemplate[i];
            createjs.Tween.get(letras[i]).wait(i * 10).to({ x: margemX }, 300, createjs.Ease.bounceOut);

            margemY += tamanhoLetra;

            letras[i].on("mousedown", function (evt) {
                if (this.pode && inicio1) {
                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                }
            });
            letras[i].on("pressmove", function (evt) {
                if (this.pode && inicio1) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                }
            });
            letras[i].on("pressup", function (evt) {
                if (this.pode && inicio1) {
                    var volta = true;
                    var l = contenthit.getNumChildren();
                    for (var i = 0; i < hits.length; i++) {
                        if (intersect(this, hits[i])) {

                            if (hits[i].pode && this.name == hits[i].name) {
                                volta = false;
                                this.x = this.px;
                                this.y = this.py;
                                perguntaAtual.splice(hits[i].id, 1);
                                perguntaAtual.splice(hits[i].id, 0, this.name);

                                formaPergunta();
                                fumaca.x = hits[i].x;
                                fumaca.y = hits[i].y;
                                fumaca.gotoAndPlay("fumaca1");

                                if (perguntaString == String(_itens[count].resposta)) {
                                    animaIco('certo', posicaoIniPergunta[0] - 150, posicaoIniPergunta[1]);
                                    createjs.Tween.get(this).wait(1500).call(proxima);
                                }
                                console.log(perguntaString + " " + String(_itens[count].resposta));
                                sons[0].play();
                                break;
                            }
                        }
                    }
                    if (volta) {
                        sons[1].play();
                        createjs.Tween.get(this).to({ x: this.px, y: this.py }, 200, createjs.Ease.backIn);

                    }
                }
            });
        }
    }
    function proxima() {
        count++;
        if (count < _itens.length) {
            montaFase();
            formaPergunta();
        } else {
            console.log("fim");
            verificaFim();
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
        if (update) {
            stage.update();
        }
    }
    function criaLetra(texto, tam, tamX, tamY) {

        var txt = new createjs.Text(texto, tam + "px VAG Rounded BT", "#000000");
        txt.textAlign = "center";
        txt.regY = txt.getBounds().height / 2;

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#dbdbdb"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRect(0, 0, tamX, tamY);
        button.graphics.endFill();

        var border = new createjs.Shape();
        border.graphics.beginStroke("#196eb6");
        border.graphics.setStrokeStyle(2);
        border.graphics.drawRect(0, 0, tamX, tamY);

        button.regX = tamanhoQuad / 2;
        button.regY = tamanhoQuad / 2;
        border.regX = tamanhoQuad / 2;
        border.regY = tamanhoQuad / 2;

        var resp = new createjs.Container();
        resp.addChild(button);
        resp.addChild(txt);
        resp.addChild(border);

        return resp;
    }
    function verificaFim() {
        var img;
        var bo;
        var continua = false;

        img = caminho + "positivo.png";
        continua = true;
        sons[2].play();

        if (continua) {
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = 269 / 2;
            bo.regY = 450 / 2;
            bo.x = 950;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).wait(1000).to({ y: 350 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                count = 0;

                montaFase();
                formaPergunta();
            });
        }
    }
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        contenthit.addChild(ico);
        ico.x = b + 220;
        ico.y = c - 80;
        ico.regX = 150;
        ico.regY = 150;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut);
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
    function init1() {
        var index;
        for (index in sons) {
            var t = sons[index];
            sons[index] = new Audio(caminho + t);
        }

        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        contenthit = new createjs.Container();
        content = new createjs.Container();
        contentgui = new createjs.Container();
        fundo = new createjs.Bitmap(caminho + "fundo_od1.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);
        stage.addChild(contenthit);
        stage.addChild(content);
        stage.addChild(contentgui);

        shuffle(_itens);

        montaFase();
        btinicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
        btinicia.image.onload = function () { };
        content.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            btinicia.visible = false;
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
        fumaca = new createjs.Sprite(spriteSheet, "idle");
        stage.addChild(fumaca);

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    init1();
}