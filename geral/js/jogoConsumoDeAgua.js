var AppConsumoAgua = function (itens) {
    var canvas;
    var stage;
    var content;
    var contenthit;
    var contentgui;
    var fundo;
    var count = 0;
    var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];
    var caminho = "resources/image/";
    var ingredientes = [];

    init2();
    function init2() {
        var index;
        for (index in sons) {
            var t = sons[index];
            sons[index] = new Audio(caminho + t);
        }

        canvas = document.getElementById("od1");
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        contenthit = new createjs.Container();
        content = new createjs.Container();
        contentgui = new createjs.Container();
        fundo = new createjs.Bitmap(caminho + "fundo.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);

        stage.addChild(content);
        stage.addChild(contenthit);
        stage.addChild(contentgui);

        barra = new createjs.Bitmap(caminho + "bar.png");
        barra.image.onload = function () { };
        stage.addChild(barra);
        barra.x = 771;
        barra.y = 590;
        barra.regY = 100;
        barra.scaleY = 0;

        topo = new createjs.Bitmap(caminho + "topo_agua.png");
        topo.image.onload = function () { };
        stage.addChild(topo);
        topo.x = 773;
        topo.y = 590;
        topo.regY = 31;

        var tubo = new createjs.Bitmap(caminho + "tubo.png");
        tubo.image.onload = function () { };
        stage.addChild(tubo);
        tubo.x = 745;
        tubo.y = 155;

        configuraIngredientes();

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function animaTitulo(texto) {
        var tit = new createjs.Container();
        contenthit.addChild(tit);

        var txt = new createjs.Text(texto, "42px VAG Rounded BT", "#000000");
        txt.regY = 60;
        txt.lineWidth = 750;
        txt.textAlign = "center";

        tit.addChild(txt);

        tit.x = -300;
        tit.y = 100;
        createjs.Tween.get(tit).to({ x: 850 }, 300, createjs.Ease.backOut);
    }
    function configuraIngredientes() {
        var i;
        for (i = 0; i < itens[count].ingredientes.length; i++) {
            var bt = caixaTexto(itens[count].ingredientes[i], 350, 80);
            bt.nome = itens[count].bt;
            bt.regX = 350 / 2;
            bt.regY = 80 / 2;
            bt.id = i;
            bt.x = bt.px = 400;
            bt.y = bt.py = i * 95 + 200;
            content.addChild(bt);
            bt.on("mousedown", function (evt) {
                sons[0].play();
                contenthit.removeAllChildren();
                this.scaleX = this.scaleY = 0.5;
                createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 400, createjs.Ease.backOut);
                createjs.Tween.get(topo, { override: true }).to({ y: itens[this.id].posY }, 1000, createjs.Ease.backOut);
                createjs.Tween.get(barra, { override: true }).to({ scaleY: itens[this.id].escala }, 1000, createjs.Ease.backOut);
                animaTitulo(itens[this.id].pergunta);
            });
        }

    }
    function ticker(event) {
        stage.update();
    }
    function caixaTexto(texto, larguraBotao, alturaBotao) {

        var txt = new createjs.Text(texto, "40px VAG Rounded BT", "#000000");

        var tamX = txt.getBounds().width + 80;
        var tamY = txt.getBounds().height + 50;

        txt.regY = tamY / 2 - 35;
        txt.textAlign = "center";

        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, larguraBotao, alturaBotao, 20);
        button.graphics.endFill();
        button.regX = larguraBotao / 2;
        button.regY = alturaBotao / 2;

        var t = new createjs.Container();
        t.addChild(button);
        t.addChild(txt);

        return t;

    }
}