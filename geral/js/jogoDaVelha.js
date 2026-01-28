var AppJogoOd2 = function (itens, idCanvas) {
    var canvas,
        stage,
        content,
        contenthit,
        contentgui,
        count = 0,
        i_acertos = 0,
        hits = [],
        figuras = [],
        inicio1 = false,
        edgeOffset = 40,
        corSelecionada = '',
        sqr1,
        sqr2,
        sqr3,
        sqr4,
        sqr5,
        sqr6,
        sqr7,
        sqr8,
        sqr9,
        sqr1T = 0,
        sqr2T = 0,
        sqr3T = 0,
        sqr4T = 0,
        sqr5T = 0,
        sqr6T = 0,
        sqr7T = 0,
        sqr8T = 0,
        sqr9T = 0,
        moveCount = 0,
        turn = 0,
        areaArray = [],
        btcontinuar,
        btinicia,
        positivo,
        caminho = "resources/image/";

    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
    contenthit = new createjs.Container();
    content = new createjs.Container();
    contentgui = new createjs.Container();
    var fundo = new createjs.Bitmap(caminho + "fundo.png");
    fundo.image.onload = function () { };
    stage.addChild(fundo);


    stage.addChild(contenthit);
    stage.addChild(content);
    stage.addChild(contentgui);

    var xoCanvas = new createjs.Shape();
    stage.addChild(xoCanvas);
    inicio1 = true;

    var w = 0;
    var j, i;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 3; j++) {
            areaArray[w] = Object();
            areaArray[w].diameter = 130;
            areaArray[w].value = "";
            figuras[w] = new createjs.Bitmap(caminho + itens[w].img);
            figuras[w].image.onload = function () { };
            content.addChild(figuras[w]);
            figuras[w].x = figuras[w].px = j * 175 + 100;
            figuras[w].y = figuras[w].py = i * 175 + 100;
            figuras[w].scaleX = figuras[w].scaleY = 0.5;
            figuras[w].regX = 172;
            figuras[w].regY = 172;
            figuras[w].pode = true;
            figuras[w].cor = itens[w].cor;
            figuras[w].n = w;
            figuras[w].on("mousedown", function (evt) {
                if (corSelecionada == '') {
                    corSelecionada = this.cor;
                    if (this.cor == 'roxa') {
                        moveCount += 6;
                    }
                    var i;
                    for (i = 0; i < figuras.length; i++) {
                        console.log(corSelecionada);
                        if (figuras[i].cor != corSelecionada) {
                            figuras[i].alpha = 0.5;

                        }

                    }
                }
                if (corSelecionada == this.cor && inicio1) {
                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                }
            });
            figuras[w].on("pressmove", function (evt) {
                if (corSelecionada == this.cor && inicio1) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                }
            });
            figuras[w].on("pressup", function (evt) {
                if (corSelecionada == this.cor && inicio1) {
                    var volta = true;
                    var i;
                    for (i = 0; i < hits.length; i++) {
                        if (collisionDetect(hits[i], this) && hits[i].value == "") {
                            volta = false;
                            this.x = hits[i].x;
                            this.y = hits[i].y;
                            hits[i].value = "x";
                            hits[i].soma = this.n + 1;
                            this.pode = false;

                            count++;
                            if (checkWin('x')) {
                                console.log("player win?");
                                positivo.visible = true;
                                positivo.scaleX = positivo.scaleY = 0.2;
                                createjs.Tween.get(positivo).to({ scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.backOut);

                            } else {
                                computerMove();
                            }
                            break;
                        }
                    }
                    if (volta) {
                        createjs.Tween.get(this).to({ x: this.px, y: this.py }, 500, createjs.Ease.backOut);
                    }
                }
            });

            hits[w] = new createjs.Bitmap(caminho + "hit.png");
            hits[w].image.onload = function () { };
            content.addChild(hits[w]);
            hits[w].x = i * 200 + 735;
            hits[w].y = j * 200 + 150;
            hits[w].regX = 98;
            hits[w].regY = 98;
            hits[w].alpha = 0.01;
            hits[w].pode = true;
            hits[w].scaleX = hits[w].scaleY = 0.3;
            hits[w].n = w;
            hits[w].soma = 0;
            hits[w].value = "";
            hits[w].on("mousedown", function (evt) {
            });
            w++;
        }
    }
    btcontinuar = new createjs.Bitmap(caminho + "tentenovamente.png");
    btcontinuar.image.onload = function () { };
    stage.addChild(btcontinuar);
    btcontinuar.x = 190;
    btcontinuar.y = 170;
    btcontinuar.scaleX = btcontinuar.scaleY = 1;
    btcontinuar.visible = false;
    btcontinuar.on("click", function () {
        reseta();

    });
    positivo = new createjs.Bitmap(caminho + "positivo.png");
    positivo.image.onload = function () { };
    stage.addChild(positivo);
    positivo.x = 190;
    positivo.y = 170;
    positivo.visible = false;
    positivo.on("click", function () {
        reseta();
    });

    areaArray[0].x = 38; areaArray[0].y = 61;
    areaArray[1].x = 228; areaArray[1].y = 61;
    areaArray[2].x = 420; areaArray[2].y = 61;

    areaArray[3].x = 38; areaArray[3].y = 227;
    areaArray[4].x = 228; areaArray[4].y = 227;
    areaArray[5].x = 420; areaArray[5].y = 227;

    areaArray[6].x = 38; areaArray[6].y = 401;
    areaArray[7].x = 228; areaArray[7].y = 401;
    areaArray[8].x = 420; areaArray[8].y = 401;

    var playerTurn = 2;
    var hitdetected = false;
    var gameOver = false;
    var colorPlayer = "#75CAF4";
    var colorComputer = "#49FF3F";

    btinicia = new createjs.Bitmap(caminho + "btiniciar.png");
    btinicia.image.onload = function () { };
    content.addChild(btinicia);
    btinicia.on("click", function () {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        btinicia.visible = false;
        inicio1 = true;
    });


    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", ticker);

    function reseta() {
        btcontinuar.visible = false;
        positivo.visible = false;
        inicio1 = true;
        i_acertos = 0;
        moveCount = 0;
        corSelecionada = '';
        count = 0;
        var w = 0;
        var i;
        for (i = 0; i < figuras.length; i++) {
            createjs.Tween.get(figuras[w]).to({ x: figuras[w].px, y: figuras[w].py }, 500, createjs.Ease.backOut);
            figuras[w].pode = true;
            figuras[w].alpha = 1;
            hits[w].value = "";
            hits[w].soma = 0;
            contenthit.removeAllChildren();
            w++;
        }

    }
    function check3(a, b, c, winChar, drawit) {
        if (hits[a].value == winChar && hits[b].value == winChar
            && hits[c].value == winChar) {
            return true;
        }

        return false;
    }

    function checkWin(winChar, drawit) {

        if (check3(0, 1, 2, winChar, drawit)) { return true; }
        if (check3(3, 4, 5, winChar, drawit)) { return true; }
        if (check3(6, 7, 8, winChar, drawit)) { return true; }

        if (check3(0, 3, 6, winChar, drawit)) { return true; }
        if (check3(1, 4, 7, winChar, drawit)) { return true; }
        if (check3(2, 5, 8, winChar, drawit)) { return true; }

        if (check3(0, 4, 8, winChar, drawit)) { return true; }
        if (check3(2, 4, 6, winChar, drawit)) { return true; }

        return false;
    }
    function check3_2(a, b, c, teste) {
        var somatudo = hits[a].soma + hits[b].soma + hits[c].soma;
        console.log(somatudo);
        if (somatudo == teste && hits[a].soma > 0 && hits[b].soma > 0 && hits[c].soma > 0) {
            return true;
        }
        return false;
    }

    function checkWin2(teste) {
        console.log("verifica");
        if (check3_2(0, 1, 2, teste)) { return true; }
        if (check3_2(3, 4, 5, teste)) { return true; }
        if (check3_2(6, 7, 8, teste)) { return true; }

        if (check3_2(0, 3, 6, teste)) { return true; }
        if (check3_2(1, 4, 7, teste)) { return true; }
        if (check3_2(2, 5, 8, teste)) { return true; }

        if (check3_2(0, 4, 8, teste)) { return true; }
        if (check3_2(2, 4, 6, teste)) { return true; }
        return false;
    }
    function computerMove() {
        console.log("my turn...");
        playerTurn = 2;
        hitdetected = false;
        if (count == 5) {
            btcontinuar.visible = true;
            inicio1 = false;
        }
        var i;
        for (i = 0; i < hits.length; i++) {
            if (hits[i].value == "") {
                hits[i].value = "o";
                if (checkWin("o", false)) {
                    hits[i].value = "o";
                    console.log("Found a win at ", i);

                    createjs.Tween.get(figuras[moveCount]).to({ x: hits[i].x, y: hits[i].y }, 300, createjs.Ease.backOut);
                    figuras[moveCount].alpha = 1;
                    moveCount++;
                    /*animaCerto("peca2",hits[i].x,hits[i].y);*/

                    btcontinuar.visible = true;

                    inicio1 = false;
                    return;
                } else {
                    hits[i].value = "";
                }
            }
        }

        console.log("no win conditions");
        for (i = 0; i < hits.length; i++) {
            if (hits[i].value == "") {
                hits[i].value = "x";
                if (checkWin("x", false)) {
                    console.log("Found a block at ", i);
                    hits[i].value = "o";
                    createjs.Tween.get(figuras[moveCount]).to({ x: hits[i].x, y: hits[i].y }, 300, createjs.Ease.backOut);
                    figuras[moveCount].alpha = 1;
                    moveCount++;
                    /*
                    animaCerto("peca2",hits[i].x,hits[i].y);
                    */
                    return;
                } else {
                    hits[i].value = "";
                }
            }
        }

        console.log("no block conditions");

        if (hits[4].value == "") {
            console.log("Taking middle block.", 4);
            hits[4].value = "o";

            createjs.Tween.get(figuras[moveCount]).to({ x: hits[4].x, y: hits[4].y }, 300, createjs.Ease.backOut);
            figuras[moveCount].alpha = 1;
            moveCount++;
            /*
            animaCerto("peca2",hits[4].x,hits[4].y);
            */
            return;
        }

        for (i = 0; i < hits.length; i++) {
            if (hits[i].value == "") {
                console.log("I choose ", i);
                hits[i].value = "o";

                createjs.Tween.get(figuras[moveCount]).to({ x: hits[i].x, y: hits[i].y }, 300, createjs.Ease.backOut);
                figuras[moveCount].alpha = 1;
                moveCount++;
                /*
                animaCerto("peca2",hits[i].x,hits[i].y);
                */
                break;
            }
        }

    }

    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + edgeOffset;
        var ay2 = object1.y + edgeOffset;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + edgeOffset;
        var by2 = by1 + edgeOffset;

        if (object1 == object2) {
            return false;
        }

        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {

            return false;
        }
    }
    function animaCerto(a, b, c) {
        var certo;
        certo = new createjs.Bitmap(caminho + a + ".png");
        contenthit.addChild(certo);
        certo.x = b;
        certo.y = c;
        certo.regX = 98;
        certo.regY = 98;
        certo.scaleX = certo.scaleY = 0.1;
        createjs.Tween.get(certo).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.quadOut).wait(1500);

    }
    function apagaicone(e) {
        contenthit.removeChild(this);
    }
    function ticker(event) {
        stage.update();
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