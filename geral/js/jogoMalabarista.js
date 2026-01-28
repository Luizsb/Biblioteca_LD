var AppMalabarista = function (idCanvas) {
    var canvas;
    var stage;
    var fundo;
    var palhaco;
    var bolas;

    var count = 0;
    var ordem = 0;
    var offX = 500;
    var offY = 200;
    var word;
    var inicio1 = false;
    var btinicia;
    var tempoPergunta = 20000;
    var fumacinha;
    var relogio;
    var tipotween = createjs.Ease.backOut;

    var gui;
    var i_acertos = 0;
    var i_erros = 0;
    var txt_a;
    var txt_e;
    var braco1;
    var braco2;
    var lado = 1;
    var spriteBraco;
    var b1 = true;
    var b2 = true;
    var nbolas = 0;
    var dir = 0;
    var caminho = "resources/image/";
    var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3", "bensound_littleidea.mp3"];
    var btSom1, btSom2;
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

    criaFundo(0, 0, 1280, 720);
    palhaco = new createjs.Container();
    bolas = new createjs.Container();
    stage.addChild(palhaco);
    stage.addChild(bolas);

    spriteBraco = new createjs.SpriteSheet({
        framerate: 20,
        "images": [caminho + "braco2.png"],
        "frames": { "regX": 0, "height": 313, "count": 10, "regY": 0, "width": 313 },
        "animations": {
            "idle": 0,
            "idle2": 9,
            "velo1": [0, 9, "idle2", 1]
        }

    });

    var f = new createjs.Bitmap(caminho + "palhaco.png");
    f.image.onload = function () { };
    palhaco.addChild(f);

    f.x = 420; //smb://dualla/administrativo/Compartilhamento/Objetos%20Digitais/Digital/PRODUCAO/2018/L3/conteudo/EF1/ART/EF18_1_ART_L3_U3_02/html/od2
    f.y = 118; //smb://dualla/administrativo/Compartilhamento/Objetos%20Digitais/Digital/PRODUCAO/2018/L3/conteudo/EF1/ART/EF18_1_ART_L3_U3_02/html/od2
    braco1 = 245; //smb://dualla/administrativo/Compartilhamento/Objetos%20Digitais/Digital/PRODUCAO/2018/L3/conteudo/EF1/ART/EF18_1_ART_L3_U3_02/html/od2ew 
    braco1 = new createjs.Sprite(spriteBraco, "idle2");
    palhaco.addChild(braco1);
    braco1.x = 670;
    braco1.y = 445;

    braco2 = new createjs.Sprite(spriteBraco, "idle2");
    palhaco.addChild(braco2);
    braco2.scaleX = -1;
    braco2.x = 600;
    braco2.y = 445;

    stage.on("mousedown", function (evt) {

        var continua = true;
        var i;
        for (i = 0; i < bolas.getNumChildren(); i++) {
            var target = bolas.getChildAt(i);
            if (target.y > 400 && target.y < 660) {

                continua = false;
                if (stage.mouseX > 640) {
                    if (target.x > 640) {
                        if (b1) {
                            bola1();

                            apagaBola(target);
                            console.log(nbolas);
                        }
                    }

                } else {
                    if (target.x < 640) {
                        if (b2) {

                            bola2();
                            apagaBola(target);
                            console.log(nbolas);
                        }
                    }
                }
            }
        }
        if (continua) {
            if (stage.mouseX > 640) {
                if (b1) {
                    sons[0].play();
                    bola1();
                    lado = 2;
                }
            } else {
                if (b2) {
                    sons[0].play();
                    bola2();
                    lado = 1;
                }
            }
        }
    });

    var btSom1 = new createjs.Bitmap(caminho + "som_ligado.png");
    btSom1.image.onload = function () { };
    stage.addChild(btSom1);
    btSom1.x = 1100;
    btSom1.y = 15;
    btSom1.visible = false;
    btSom1.on("mousedown", function (evt) {

        this.visible = false;
        btSom2.visible = true;
        sons[4].pause();
    });
    var btSom2 = new createjs.Bitmap(caminho + "som_desligado.png");
    btSom2.image.onload = function () { };
    stage.addChild(btSom2);
    btSom2.x = btSom1.x;
    btSom2.y = btSom1.y;
    btSom2.visible = false;
    btSom2.on("mousedown", function (evt) {
        this.visible = false;
        btSom1.visible = true;
        sons[4].play();
    });

    var bt = new createjs.Bitmap(caminho + "bt_iniciar.png");
    bt.image.onload = function () { };
    stage.addChild(bt);
    bt.on("mousedown", function (evt) {
        btSom1.visible = true;
        sons[4].loop = true;
        sons[4].play();
        sons[4].volume = 0.3;

        bt.visible = false;
        bola1();
    });

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", ticker);
    createjs.MotionGuidePlugin.install();

    function bola1() {
        b1 = false;
        createjs.Tween.get(braco1, { override: true }).wait(245).call(bolaAnima1);
        braco1.gotoAndPlay("velo1");
    }
    function bolaAnima1() {
        b1 = true;
        var bola = new createjs.Bitmap(caminho + "bola.png");
        bola.x = 740;
        bola.y = 850;
        bola.regX = bola.regY = 50;
        bolas.addChild(bola);
        if (nbolas < 5) {
            nbolas += 1;
        }
        createjs.Tween.get(bola).to({ guide: { path: [740, 400, 650, -100 * nbolas, 300, 720] }, rotation: -270 }, 3000).call(apagaBola2);
    }
    function apagaBola(oque) {
        bolas.removeChild(oque);
    }

    function apagaBola2() {
        bolas.removeChild(this);
        if (nbolas > 0) {
            nbolas -= 1;
        }
    }

    function bola2() {
        b2 = false;
        createjs.Tween.get(braco2, { override: true }).wait(245).call(bolaAnima2);
        braco2.gotoAndPlay("velo1");
    }

    function bolaAnima2() {
        b2 = true;
        var bola = new createjs.Bitmap(caminho + "bola.png");
        bola.x = 740;
        bola.y = 850;
        bola.regX = bola.regY = 50;
        bolas.addChild(bola);
        if (nbolas < 5) {
            nbolas += 1;
        }
        createjs.Tween.get(bola).to({ guide: { path: [550, 400, 650, -100 * nbolas, 900, 720] }, rotation: 270 }, 3000).call(apagaBola2);
    }

    function criaFundo(px, py, tamX, tamY) {
        var shape = new createjs.Shape();
        shape.graphics.beginLinearGradientFill(["#ffffff", "#999999"], [0, 1], 0, 0, 0, tamY);
        shape.graphics.drawRoundRect(0, 0, tamX, tamY, 0);
        shape.graphics.endFill();
        stage.addChild(shape);
    }

    function ticker(event) {
        stage.update();
    }
}