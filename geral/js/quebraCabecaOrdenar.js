var appQuebracabeca = function (posX, posY, idCanvas) {
    var canvas2;
    var stage2;
    var content;
    var telainicio;
    var contenthit1;
    var fase1;
    var fundo;
    var agua;
    var inicio2 = false;
    var btinicia;
    var pecas1 = [];
    var hits1 = [];
    var inicio2;
    var edgeOffset = 10;
    var count = 0;
    var wordcount = 0;
    var positivo;
    var btcontinuar;
    var tit;

    init2();

    function init2() {
        canvas2 = document.getElementById(idCanvas);
        stage2 = new createjs.Stage(canvas2);
        stage2.enableMouseOver(10);
        createjs.Touch.enable(stage2);
        content = new createjs.Container();
        contenthit1 = new createjs.Container();

        fase1 = new createjs.Container();

        telainicio = new createjs.Container();

        fundo = new createjs.Bitmap("resources/image/fundo_od1.png");
        fundo.image.onload = function () { };
        stage2.addChild(fundo);

        stage2.addChild(contenthit1);
        stage2.addChild(fase1);

        stage2.addChild(telainicio);
        stage2.addChild(content);

        var spriteSheet = new createjs.SpriteSheet({
            framerate: 20,
            "images": ["resources/image/fumaca.png"],
            "frames": { "regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200 },
            "animations": {
                "idle": 20,
                "fumaca1": [0, 9, "idle"],
                "fumaca2": [10, 19, "idle"]
            }
        });
        agua = new createjs.Sprite(spriteSheet, "idle");
        content.addChild(agua);

        btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
        btinicia.image.onload = function () { };
        telainicio.addChild(btinicia);
        btinicia.x = 930;
        btinicia.y = 300;
        btinicia.scaleX = btinicia.scaleY = 0.7;
        btinicia.on("click", function () {
            btinicia.visible = false;
            inicio2 = true;
            f1();
        });
        btcontinuar = new createjs.Bitmap("resources/image/continuar.png");
        btcontinuar.image.onload = function () { };
        content.addChild(btcontinuar);
        btcontinuar.x = 900;
        btcontinuar.y = 440;
        btcontinuar.visible = false;
        btcontinuar.on("click", function () {
            btcontinuar.visible = false;
            positivo.visible = false;
            var l = fase1.getNumChildren();
            for (var i = 0; i < l; i++) {
                fase1.removeChild(pecas1[i]);
                contenthit1.removeChild(hits1[i]);
            }
            count = 0;
            wordcount += 1;
            console.log(l);
            f1();
        });

        positivo = new createjs.Bitmap("resources/image/positivo.png");
        positivo.image.onload = function () { };
        content.addChild(positivo);
        positivo.x = 960;
        positivo.y = 200;
        positivo.scaleX = positivo.scaleY = 0.7;
        positivo.visible = false;

        createjs.Ticker.setFPS(30);
        createjs.Ticker.on("tick", stage2);
    }
    function f1() {

        hits1 = [];
        pecas1 = [];

        for (var i = 0; i < 20; i++) {
            hits1[i] = new createjs.Bitmap("resources/image/c" + i + ".png");
            hits1[i].image.onload = function () { };
            contenthit1.addChild(hits1[i]);
            hits1[i].x = posX[i];
            hits1[i].y = posY[i];
            hits1[i].pode = true;
            hits1[i].alpha = 0.01;
            hits1[i].name = i;

            pecas1[i] = new createjs.Bitmap("resources/image/c" + i + ".png");
            pecas1[i].image.onload = function () { };
            fase1.addChild(pecas1[i]);
            pecas1[i].pode = false;
            pecas1[i].name = i;
            pecas1[i].x = posX[i];
            pecas1[i].y = posY[i];
            createjs.Tween.get(pecas1[i]).wait(i * 100 + 1000).to({ x: Math.random() * 200 + 900, y: Math.random() * 600, scaleX: 0.7, scaleY: 0.7 }, 300, createjs.Ease.backOut).call(habilita);

            pecas1[i].on("mousedown", function (evt) {
                if (this.pode && inicio2) {
                    this.parent.addChild(this);
                    var global = fase1.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                    this.scaleY = this.scaleX = 1;
                }
            });
            pecas1[i].on("pressmove", function (evt) {
                if (this.pode && inicio2) {
                    var local = fase1.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                }
            });
            pecas1[i].on("pressup", function (evt) {
                if (this.pode && inicio2) {
                    var volta = true;
                    var l = contenthit1.getNumChildren();
                    for (var i = 0; i < l; i++) {
                        var child = contenthit1.getChildAt(i);
                        var pt = child.globalToLocal(this.x, this.y);
                        if (intersect(this, child)) {
                            if (child.pode) {
                                if (child.name == this.name) {
                                    volta = false;
                                    this.pode = false;
                                    this.x = child.x;
                                    this.y = child.y;
                                    som0();
                                    agua.x = child.x + 70;
                                    agua.y = child.y + 100;
                                    agua.gotoAndPlay("fumaca1");
                                    count++;
                                    if (count >= 20) {
                                        positivo.visible = true;
                                        som2();
                                    }
                                }
                            }
                        }
                    }
                    if (volta) {
                        som1();
                        var tx = Math.random() * 250 + 850;
                        var ty = Math.random() * 500;
                        createjs.Tween.get(this).to({ x: tx, y: ty }, 200, createjs.Ease.backIn);
                        this.scaleY = this.scaleX = 0.7;
                    }
                }
            });
        }
    }
    function habilita(e) {
        e.target.pode = true;
    }
    function troca() {

    }
    function intersect(obj1, obj2) {

        var objBounds1 = obj1.getBounds().clone();
        var objBounds2 = obj2.getBounds().clone();
        console.log(obj1.y);
        console.log(obj2.y);
        if (obj1.x > (obj2.x - edgeOffset) &&
            obj1.x < (obj2.x + objBounds2.width + edgeOffset) &&
            obj1.y > (obj2.y - edgeOffset) &&
            obj1.y < (obj2.y + objBounds2.height + edgeOffset)
        )
            return true;
        else
            return false;
    }
    function som0() {
        document.getElementsByTagName('audio')[0].play();
    }
    function som1() {
        document.getElementsByTagName('audio')[1].play();
    }
    function som2() {
        document.getElementsByTagName('audio')[2].play();
    }
}