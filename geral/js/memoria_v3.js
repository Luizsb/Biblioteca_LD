var gameMemoria2 = function (idCanvas) {
    var canvas;
    var stage;
    var contentgui;
    var bottomLabel;
    var memoryDetails;
    var cardsRevealed = [];
    var cardBack = [];
    var position = [];
    var allRevealed = [];
    var clickedPosition;
    var cardClicked;
    var clickCount = 0;
    var firstPosition;
    var secondPosition;
    var memoryDetails = {
        'noOfPairs': 8,
        'dimension-width': 200,
        'dimension-height': 200,
        'scale': 100
    };
    var content;
    var cartas;
    var fundo;
    var btreca;
    var btinicia;
    var xTop;
    var xBottom;
    var remainingPairs;
    var bottomLabel;
    var allRevealed = [];
    var visibleScale = memoryDetails['scale'] / 100;
    var posX = [];
    var posY = [];
    var textos = [];
    var fumacinha;
    var relogio;
    var positivo;
    var inicio = false;
    var tipotween = createjs.Ease.backOut;
    var i_acertos = 0;
    var texto_certo;
    var i_erros = 0;
    var texto_errado;
    var update = false;

    init1();

    function init1() {
        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        createjs.Touch.enable(stage);
        stage.mouseMoveOutside = true;
        content = new createjs.Container();
        contentgui = new createjs.Container();
        cartas = new createjs.Container();

        stage.addChild(content);
        stage.addChild(cartas);


        fundo = new createjs.Bitmap("resources/image/fundo_od1.png");
        fundo.image.onload = function () { };
        content.addChild(fundo);

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);

        remainingPairs = memoryDetails['noOfPairs'];

        criaFase();

        var spriteRelogio = new createjs.SpriteSheet({
            framerate: 20,
            "images": ["resources/image/relogio.png"],
            "frames": { "regX": 100, "height": 214, "count": 13, "regY": 107, "width": 200 },
            "animations": {
                "idle": 0,
                "idle2": 12,
                "tempo1": [0, 12, "idle2", 0.1]
            }
        });

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
        fumacinha = new createjs.Sprite(spriteSheet, "idle");
        stage.addChild(fumacinha);

        relogio = new createjs.Sprite(spriteRelogio, "idle");
        stage.addChild(relogio);
        relogio.x = 1160;
        relogio.y = 600;
        relogio.visible = false;


        positivo = new createjs.Bitmap("resources/image/positivo.png");
        positivo.image.onload = function () { };
        stage.addChild(positivo);
        positivo.x = 1085;
        positivo.y = 460;
        positivo.scaleX = positivo.scaleY = 0.4;
        positivo.visible = false;

        btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.x = 400;
        btinicia.y = 250;
        btinicia.on("click", function () {
            btinicia.visible = false;
            relogio.gotoAndPlay("tempo1");
            relogio.visible = true;
            relogio.scaleX = relogio.scaleY = 0.4;
            createjs.Tween.get(relogio).to({ scaleX: 1, scaleY: 1, rotation: 10 }, 250, tipotween).wait(350).to({ rotation: -5 }, 250, tipotween);
            for (i = 0; i < memoryDetails['noOfPairs'] * 2; i++) {
                createjs.Tween.get(allRevealed[i]).to({ alpha: 1, scaleX: visibleScale }, 150);
                createjs.Tween.get(cardBack[i]).to({ alpha: 0, scaleX: 0 }, 150);
            }
            createjs.Tween.get(btinicia).to({ alpha: 1 }, 6000).call(podeiniciar);


        });
        stage.addChild(contentgui);
        gui = new createjs.Bitmap("resources/image/gui.png");
        gui.image.onload = function () { };
        contentgui.addChild(gui);
        gui.on("click", function () {
            createjs.Tween.get(contentgui).to({ x: 1300 }, 600, tipotween);
            i_erros = 0;
            texto_errado.text = 0;
            cardsRevealedA.length = 0;
            cartas.removeAllChildren();
            criaFase();
            remainingPairs = memoryDetails['noOfPairs'];
            clickCount = 0;

        });


        texto_tempo = new createjs.Text("0:00", "bold 40px VAG Rounded BT", "#000000");
        texto_tempo.x = 295;
        texto_tempo.y = 140;
        texto_tempo.textAlign = "center";
        contentgui.addChild(texto_tempo);

        texto_errado = new createjs.Text("0", "bold 40px VAG Rounded BT", "#000000");
        texto_errado.x = 295;
        texto_errado.y = 210;
        texto_errado.textAlign = "center";
        contentgui.addChild(texto_errado);


        contentgui.x = -800;
        contentgui.y = 160;

    }
    function podeiniciar() {
        update = true;
        startTime = Date.now();
        relogio.visible = false;
        fumacinha.gotoAndPlay("fumaca1");
        fumacinha.x = relogio.x;
        fumacinha.y = relogio.y;
        inicio = true;
        for (i = 0; i < memoryDetails['noOfPairs'] * 2; i++) {
            createjs.Tween.get(allRevealed[i]).to({ alpha: 0, scaleX: 0 }, 150);
            createjs.Tween.get(cardBack[i]).to({ alpha: 1, scaleX: visibleScale }, 150);
        }

    }
    function criaFase() {
        var si = 0;
        var margem = 0;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 4; j++) {
                posX[si] = j * 285 + 160;
                posY[si] = i * 160 + 150;
                si++;
            }
        }
        for (i = 0; i < memoryDetails['noOfPairs'] * 2; i++) {
            cardBack[i] = new createjs.Bitmap("resources/image/ctras.png");
            cardBack[i].x = posX[i];
            cardBack[i].y = posY[i];
            cardBack[i].scaleX = cardBack[i].scaleY = visibleScale;
            cardBack[i].identity = i;
            cardBack[i].on("click", function () {
                if (inicio) {
                    clickedPosition = this.identity;
                    animateCards();
                }
            });
            position[i] = new Array;
            position[i].xpos = cardBack[i].x;
            position[i].ypos = cardBack[i].y;
            cartas.addChild(cardBack[i]);
        }
        cardsRevealedA = new Array;
        for (i = 0; i < memoryDetails['noOfPairs'] * 2; i++) {
            cardsRevealedA[i] = new createjs.Bitmap("resources/image/c" + i + ".png");
            cardsRevealedA[i].name = i;
        }
        allRevealed = cardsRevealedA;
        var n = allRevealed.length;
        var tempArray = [];
        for (var i = 0; i < n - 1; i++) {
            tempArray.push(allRevealed.splice(Math.floor(Math.random() * allRevealed.length), 1)[0]);
        }
        tempArray.push(allRevealed[0]);
        allRevealed = tempArray;
        for (i = 0; i < allRevealed.length; i++) {

            allRevealed[i].x = position[i].xpos;
            allRevealed[i].y = position[i].ypos;

            allRevealed[i].scaleX = 0;
            allRevealed[i].scaleY = visibleScale;
            allRevealed[i].regY = memoryDetails['dimension-width'] / 2;
            allRevealed[i].regX = memoryDetails['dimension-height'] / 2;
            allRevealed[i].alpha = 0;
            cartas.addChild(allRevealed[i]);

            cardBack[i].regX = memoryDetails['dimension-height'] / 2;
            cardBack[i].regY = memoryDetails['dimension-width'] / 2;
        }


        function animateCards() {
            createjs.Tween.get(cardBack[clickedPosition]).to({ scaleX: 0 }, 150);
            createjs.Tween.get(allRevealed[clickedPosition]).wait(150).to({ alpha: 1, scaleX: visibleScale }, 150);
            cardClicked = allRevealed[clickedPosition];
            checkCards();
        }

        function checkCards() {
            if (clickCount == 0) {
                firstPosition = clickedPosition;
                firstClick = cardClicked.name;
                clickCount++;

            } else if (clickCount == 1) {
                secondPosition = clickedPosition;
                secondClick = cardClicked.name;
                clickCount++;
                if (isOdd(secondClick) && firstClick == secondClick - 1) {
                    remainingPairs--;
                    if (remainingPairs == 0) {
                        createjs.Tween.get(contentgui).to({ x: 300 }, 1000, tipotween);
                        update = false;
                        som2();
                    } else {
                        acerto();
                    }
                    clickCount = 0;
                } else if (isOdd(firstClick) && firstClick == secondClick + 1) {
                    remainingPairs--;

                    if (remainingPairs == 0) {
                        createjs.Tween.get(contentgui).to({ x: 300 }, 1000, tipotween);
                        update = false;
                        som2();
                    } else {
                        acerto();
                    }
                    clickCount = 0;
                } else {
                    inicio = false;
                    i_erros++;
                    texto_errado.text = i_erros;
                    som1();
                    clickCount = 0;
                    createjs.Tween.get(btinicia).to({ alpha: 1 }, 1000).call(voltacarta);
                };

            }
        }

    }
    function voltacarta() {
        inicio = true;
        createjs.Tween.get(allRevealed[firstPosition]).to({ alpha: 0, scaleX: 0 }, 150);
        createjs.Tween.get(allRevealed[secondPosition]).to({ alpha: 0, scaleX: 0 }, 150);
        createjs.Tween.get(cardBack[firstPosition]).wait(150).to({ scaleX: visibleScale }, 150);
        createjs.Tween.get(cardBack[secondPosition]).wait(150).to({ scaleX: visibleScale }, 150);

    }
    function acerto() {
        fumacinha.gotoAndPlay("fumaca1");
        fumacinha.x = posX[clickedPosition] - 20;
        fumacinha.y = posY[clickedPosition] - 10;
        var t = allRevealed[clickedPosition].name + 1;
        console.log(t);
        som0();
    }
    function isOdd(num) {
        return (num % 2) == 1;
    }
    function ticker(event) {
        stage.update();
        if (update) checkTime();
    }
    function checkTime() {
        var timeDifference = Date.now() - startTime;
        var formatted = convertTime(timeDifference);
        texto_tempo.text = '' + formatted;
    }
    function convertTime(miliseconds) {
        var totalSeconds = Math.floor(miliseconds / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds - minutes * 60;
        if (seconds < 10) seconds = '0' + seconds;
        return minutes + ':' + seconds;
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