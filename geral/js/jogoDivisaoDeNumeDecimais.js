var AppDivisao = function (perg, opcoes, idCanvas) {
    var canvas;
    var stage;
    var conta;
    var agua;
    var sapo;
    var i_erros = 0;
    var inicio = true;
    var n_resp = 3;
    var count = 0;
    var posSapo;
    var posAgua;
  
    init2();

    function init2() {
        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);

        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;

        var fundo = new createjs.Bitmap("resources/image/fundo_od2.png");
        fundo.image.onload = function () { };
        stage.addChild(fundo);

        agua = new createjs.Bitmap("resources/image/agua.png");
        agua.image.onload = function () { };
        stage.addChild(agua);
        agua.regY = 343;
        agua.x = 826;
        agua.y = 609;
        agua.scaleY = 0.08;

        sapo = new createjs.Bitmap("resources/image/sapo.png");
        sapo.image.onload = function () { };
        stage.addChild(sapo);
        sapo.regY = 169;
        sapo.x = 877;
        sapo.y = 590;

        var topo = new createjs.Bitmap("resources/image/jarra_topo.png");
        topo.image.onload = function () { };
        stage.addChild(topo);

        conta = new createjs.Container();
        stage.addChild(conta);

        var bt_iniciar = new createjs.Bitmap("resources/image/bt_iniciar2.png");
        bt_iniciar.image.onload = function () { };
        stage.addChild(bt_iniciar);
        bt_iniciar.on("mousedown", function (evt) {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            bt_iniciar.visible = false;
            formulaPergunta();
        });

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function formulaPergunta() {
        conta.removeAllChildren();

        sinal = "÷";

        textoContorno(perg[count][0], 200, 250, 150, 150);
        textoContorno(sinal, 400, 250, 150, 150);
        textoContorno(perg[count][1], 600, 250, 150, 150);

        var _seq = [];
        for (var i = 0; i < n_resp; i++) {
            _seq[i] = i;
        }
        shuffle(_seq);
        console.log(_seq);

        for (var i = 0; i < n_resp; i++) {
            var t = opcoes[count][i];

            var bt = caixaTexto(t, 200, 150);
            conta.addChild(bt);
            bt.x = -200;
            bt.y = 480;
            var mx = 390 - n_resp * 80;
            bt.px = _seq[i] * 189 + mx;
            bt.py = 600;
            bt.name = i;
            createjs.Tween.get(bt).wait(500).to({ x: _seq[i] * 250 + mx }, 250, createjs.Ease.backOut);
            bt.on("mousedown", function (evt) {
                if (inicio) {
                    inicio = false;
                    this.scaleX = this.scaleY = 0.3;
                    createjs.Tween.get(this).to({scaleX:1,scaleY:1},350,createjs.Ease.backOut).wait(2000);
                        if(this.name==0){
                            posSapo=sapo.y-80;
                            posAgua=agua.scaleY+0.23;
                            animaIco('certo',this.x,this.y);
                            som0();
                            setTimeout(function(){
                                proxima(true);
                            },2000);
                        }else{
                            animaIco('errado',this.x,this.y);
                            som1();
                            i_erros++;
                            setTimeout(function(){
                                proxima(false);
                            },2000);
                    }
                }
            });

        }

    }
    function proxima(_podemover) {

       if(_podemover){
                createjs.Tween.get(sapo).to({y:posSapo},500,createjs.Ease.backOut);
                createjs.Tween.get(agua).to({scaleY:posAgua},500,createjs.Ease.backOut);
            }
        console.log(count + "<" + (perg.length - 1));
        if (count < (perg.length - 1)) {
            inicio = true;
            count++;
            formulaPergunta();
        } else {

            Fim();
        }

    }
    function Fim() {
        var img;
        var bo;
        var continua = false;
        conta.removeAllChildren();
        if (i_erros > 0) {
            som3();
            img = "resources/image/tentenovamente.png";
            continua = true;
        } else {
            som2();
            img = "resources/image/positivo.png";
            continua = true;
        }
        if (continua) {
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = bo.regY = 210;
            bo.x = 450;
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).wait(1000).to({ y: 350 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                count = 0;
                i_erros = 0;
                i_acertos = 0;
                inicio = true;
                posSapo = 590;
                posAgua = 0.08;
                createjs.Tween.get(sapo).to({ y: posSapo }, 500, createjs.Ease.backOut);
                createjs.Tween.get(agua).to({ scaleY: posAgua }, 500, createjs.Ease.backOut);
                formulaPergunta();
            });
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
    function caixaTexto(texto, tamX, tamY) {
        var button = new createjs.Shape();
        button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.regX = tamX / 2;
        button.regY = tamY / 2;

        var txt = new createjs.Text(texto, "bold 90px VAG Rounded BT", "#000000");
        txt.y = 30;
        txt.regY = tamY / 2;
        txt.textAlign = "center";

        var resp = new createjs.Container();
        resp.addChild(button);
        resp.addChild(txt);

        return resp;

    }
    function criaCaixa(px, py, tamX, tamY) {
        var button = new createjs.Shape();

        button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
        button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
        button.graphics.endFill();
        button.x = px;
        button.y = py;
        button.regX = tamX / 2;
        button.regY = tamY / 2;
        stage.addChild(button);
    }
    function textoContorno(texto, px, py, tamX, tamY) {
        var txt = new createjs.Text(texto, "bold 120px VAG Rounded BT", "#ffffff");
        txt.x = px - 500;
        txt.y = py;
        txt.regY = tamY / 2;
        txt.textAlign = "center";

        var contorno = new createjs.Text(texto, "bold 120px VAG Rounded BT", "#000000");
        contorno.x = px - 500;
        contorno.y = py;
        contorno.regY = tamY / 2;
        contorno.textAlign = "center";
        contorno.outline = 15;

        conta.addChild(contorno);
        conta.addChild(txt);

        createjs.Tween.get(contorno).to({ x: px }, 500, createjs.Ease.backOut);
        createjs.Tween.get(txt).to({ x: px }, 500, createjs.Ease.backOut);

    }
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap("resources/image/" + qual + ".png");
        stage.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 160;
        ico.regY = 160;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut).wait(500).call(apaga);
    }
    function apaga() {
        stage.removeChild(this);
    }
    function ticker(event) {
        stage.update();
    }
    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + 100;
        var ay2 = object1.y + 100;

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + 100;
        var by2 = by1 + 100;

        if (object1 == object2) {
            return false;
        }

        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {

            return false;
        }

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
    function som3() {
        document.getElementsByTagName('audio')[3].play();
    }
}