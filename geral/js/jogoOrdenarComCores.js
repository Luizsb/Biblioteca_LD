var AppOrdenarComCores = function (idCanvas, itens) {
    var caminho = 'resources/image/';
    var canvas;
    var stage;
    var content;
    var sons = ["titulo.mp3", "tren.mp3", "casa.mp3", "camion.mp3", "castelo.mp3", "muneca.mp3"];
    var update = false;
    var objetosFundo;
    var fase = 0;
    var hit = [];
    var objs = [];
    var texture = [];
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

    objetosFundo = new createjs.Container();
    content = new createjs.Container();
    contentgui = new createjs.Container();

    var fundo = new createjs.Bitmap(caminho + "fundo.png");
    fundo.image.onload = function () { };
    stage.addChild(fundo);

    stage.addChild(content);
    stage.addChild(objetosFundo);
    stage.addChild(contentgui);

    var btinicio = new createjs.Bitmap(caminho + "bt_iniciar.png");
    stage.addChild(btinicio);
    btinicio.on("mousedown", function (evt) {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        stage.removeChild(this);
        sons[0].play();

        var txt = new createjs.Text('¿VAMOS A USAR LOS BLOQUES DE CONSTRUCCIÓN PARA CONSTRUIR OTROS JUGUETES?', "bold 60px VAG Rounded BT", "#ffffff");
        txt.x = -640;
        txt.y = 250;
        txt.textAlign = "center";
        txt.lineWidth = 1100;
        objetosFundo.addChild(txt);
        createjs.Tween.get(txt).to({ x: 640 }, 500, createjs.Ease.backOut).wait(6000).call(montaFase);
    });

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", ticker);

    function montaFase() {
        objetosFundo.removeAllChildren();
        hit = [];
        objs = [];
        sons[fase + 1].play();

        var txt = new createjs.Text(itens[fase].tit, "bold 60px VAG Rounded BT", "#000000");
        txt.x = -640;
        txt.y = 630;
        txt.textAlign = "center";
        txt.lineWidth = 1100;
        objetosFundo.addChild(txt);
        createjs.Tween.get(txt).to({ x: 640 }, 500, createjs.Ease.backOut);

        var i = 0;
        for (i = 0; i < itens[fase].pecas.length; i++) {
            var cor = Math.floor(Math.random() * cores.length);

            if (itens[fase].pecas[i][0] == 'circulo') {
                hit[i] = new createjs.Container();
                var vetor = new createjs.Shape();
                vetor.graphics.beginFill('#525252').drawCircle(0, 0, itens[fase].pecas[i][1]);

                hit[i].x = itens[fase].posicoes[i][0];
                hit[i].y = itens[fase].posicoes[i][1];
                hit[i].id = i;
                hit[i].name = itens[fase].pecas[i][0];
                hit[i].pode = true;
                hit[i].rotation = itens[fase].posicoes[i][2];

                hit[i].addChild(vetor);
                objetosFundo.addChild(hit[i]);

                texture[i] = new createjs.Container();
                vetor = new createjs.Shape();
                vetor.graphics.beginFill(cores[cor]).drawCircle(0, 0, itens[fase].pecas[i][1]);
                texture[i].addChild(vetor);

                texture[i].x = itens[fase].posInici[i][0];
                texture[i].y = itens[fase].posInici[i][1];
                texture[i].cursor = "pointer";
                texture[i].id = i;
                texture[i].name = itens[fase].pecas[i][0];
                objetosFundo.addChild(texture[i]);
                texture[i].rotation = itens[fase].posicoes[i][2];
                texture[i].tipo = itens[fase].tipo[i];

                texture[i].on("mousedown", function (evt) {

                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                });
                texture[i].on("pressmove", function (evt) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;

                });
                texture[i].on("pressup", function (evt) {
                    verificaColisoes();
                });

            } else if (itens[fase].pecas[i][0] == 'retangulo' || itens[fase].pecas[i][0] == 'quadrado') {
                hit[i] = new createjs.Container();
                var vetor = new createjs.Shape();
                vetor.graphics.beginFill('#525252').drawRect(0, 0, itens[fase].pecas[i][1], itens[fase].pecas[i][2]);

                hit[i].addChild(vetor);
                objetosFundo.addChild(hit[i]);

                hit[i].x = itens[fase].posicoes[i][0];
                hit[i].y = itens[fase].posicoes[i][1];
                hit[i].regX = itens[fase].pecas[i][1] / 2;
                hit[i].regY = itens[fase].pecas[i][2] / 2;
                hit[i].id = i;
                hit[i].name = itens[fase].pecas[i][0];
                hit[i].pode = true;
                hit[i].rotation = itens[fase].posicoes[i][2];
                objetosFundo.addChild(hit[i]);

                texture[i] = new createjs.Container();
                vetor = new createjs.Shape();
                vetor.graphics.beginFill(cores[cor]).drawRect(0, 0, itens[fase].pecas[i][1], itens[fase].pecas[i][2]);

                texture[i].addChild(vetor);
                objetosFundo.addChild(texture[i]);

                texture[i].x = itens[fase].posInici[i][0];
                texture[i].y = itens[fase].posInici[i][1];
                texture[i].cursor = "pointer";
                texture[i].id = i;
                texture[i].name = itens[fase].pecas[i][0];
                texture[i].regX = itens[fase].pecas[i][1] / 2;
                texture[i].regY = itens[fase].pecas[i][2] / 2;
                objetosFundo.addChild(texture[i]);
                texture[i].rotation = itens[fase].posicoes[i][2];
                texture[i].tipo = itens[fase].tipo[i];
                texture[i].on("mousedown", function (evt) {

                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                });
                texture[i].on("pressmove", function (evt) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;

                });
                texture[i].on("pressup", function (evt) {
                    verificaColisoes();
                });

            } else if (itens[fase].pecas[i][0] == 'triangulo') {
                hit[i] = new createjs.Container();
                var vetor = new createjs.Shape();
                vetor.graphics.beginFill("#525252");
                vetor.graphics
                    .moveTo(0, itens[fase].pecas[i][2])
                    .lineTo(itens[fase].pecas[i][1], itens[fase].pecas[i][2])
                    .lineTo(itens[fase].pecas[i][2], 0)
                    .lineTo(0, itens[fase].pecas[i][2]);

                hit[i].addChild(vetor);
                objetosFundo.addChild(hit[i]);
                hit[i].regX = itens[fase].pecas[i][1] / 2;
                hit[i].regY = itens[fase].pecas[i][2] / 2;
                hit[i].x = itens[fase].posicoes[i][0];
                hit[i].y = itens[fase].posicoes[i][1];
                hit[i].rotation = itens[fase].posicoes[i][2];

                hit[i].id = i;
                hit[i].name = itens[fase].pecas[i][0];
                hit[i].pode = true;
                objetosFundo.addChild(hit[i]);

                texture[i] = new createjs.Container();
                vetor = new createjs.Shape();
                vetor.graphics.beginFill(cores[cor]);
                vetor.graphics
                    .moveTo(0, itens[fase].pecas[i][2])
                    .lineTo(itens[fase].pecas[i][1], itens[fase].pecas[i][2])
                    .lineTo(itens[fase].pecas[i][2], 0)
                    .lineTo(0, itens[fase].pecas[i][2]);
                texture[i].addChild(vetor);
                objetosFundo.addChild(texture[i]);
                texture[i].regX = itens[fase].pecas[i][1] / 2;
                texture[i].regY = itens[fase].pecas[i][2] / 2;
                texture[i].x = itens[fase].posInici[i][0];
                texture[i].y = itens[fase].posInici[i][1];
                texture[i].cursor = "pointer";
                texture[i].id = i;
                texture[i].name = itens[fase].pecas[i][0];
                texture[i].rotation = itens[fase].posicoes[i][2];
                objetosFundo.addChild(texture[i]);
                texture[i].tipo = itens[fase].tipo[i];

                texture[i].on("mousedown", function (evt) {
                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                });
                texture[i].on("pressmove", function (evt) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                });
                texture[i].on("pressup", function (evt) {
                    verificaColisoes();
                });
            }
        }
        update = true;
    }
    var matches = 0;
    function verificaColisoes() {
        if (update) {
            var posInici = '[';
            var i = 0;
            var j = 0;
            for (j = 0; j < itens[fase].pecas.length; j++) {
                for (i = 0; i < itens[fase].pecas.length; i++) {
                    if (collisionDetect(texture[j], hit[i])) {
                        var checkName = texture[j].name == hit[i].name;
                        var checkId = texture[j].id == hit[i].id;

                        if (hit[i].pode && (checkId || checkName)) {
                            createjs.Tween.get(texture[j]).to({ x: hit[i].x, y: hit[i].y }, 700, createjs.Ease.backOut);
                            hit[i].pode = false;
                            matches++;
                        }
                        if(texture[j] == hit[i]){
                            console.log('teste')
                        }
                    }
                }
            }

            for (i = 0; i < itens[fase].pecas.length; i++) {
                posInici += '[' + Math.floor(texture[i].x) + ',' + Math.floor(texture[i].y) + ',0],';
            }
            console.log(matches)
            if (matches == itens[fase].pecas.length) {
                update = false;
                matches = 0;
                console.log('pronto');
                animaIco('certo', 950, 360);
            }
            // console.log(posInici + ']');
        }
        else {
            return false;
        }
    }

    function ticker(event) {
        stage.update();
    }
    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + 50;
        var ay2 = object1.y + 50;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + 50;
        var by2 = by1 + 50;

        if (object1 == object2) {
            return false;
        }
        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {
            return false;
        }
    }

    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        objetosFundo.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 155;
        ico.regY = 155;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut).wait(2000).call(proxima);
    }

    function Fim() {
        var img;
        var bo;
        var continua = false;
        img = caminho + "positivo.png";
        continua = true;
        objetosFundo.removeAllChildren();
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
                fase = 0;
                montaFase();
            });
        }
    }
    function proxima() {
        if (fase < itens.length - 1) {
            stage.removeChild(this);
            fase++;
            montaFase();
        } else {
            Fim();
        }
    }
}