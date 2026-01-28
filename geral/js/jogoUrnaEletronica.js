var AppUrnaEletronica = function (itens) {
    var canvas;
    var stage;
    var content;
    var contenttext;
    var contentgui;
    var clicavel = false;
    var fundos = [];
    var count = 0;
    var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3", "inter.mp3", "urna.mp3"];
    var caminho = "resources/image/";
    var ingredientes = [];
    var subcount = 0;
    var painel;
    var votopartido = false;
    var votobranco = false;
    var voto = '';

    init2();

    function init2() {
        var index;
        for (index in sons) {
            var t = sons[index];
            sons[index] = new Audio(caminho + t);
        }

        canvas = document.getElementById("od2");
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(10);
        contenttext = new createjs.Container();
        content = new createjs.Container();
        contentgui = new createjs.Container();

        fundos[0] = new createjs.Bitmap(caminho + "fundo2.png");
        fundos[0].image.onload = function () { };
        content.addChild(fundos[0]);

        fundos[1] = new createjs.Bitmap(caminho + "fundo3.png");
        fundos[1].image.onload = function () { };
        content.addChild(fundos[1]);
        fundos[1].visible = false;

        fundos[2] = new createjs.Bitmap(caminho + "fundo4.png");
        fundos[2].image.onload = function () { };
        content.addChild(fundos[2]);
        fundos[2].visible = false;

        fundos[3] = new createjs.Bitmap(caminho + "fundo5.png");
        fundos[3].image.onload = function () { };
        content.addChild(fundos[3]);
        fundos[3].visible = false;

        fundos[4] = new createjs.Bitmap(caminho + "fundo6.png");
        fundos[4].image.onload = function () { };
        content.addChild(fundos[4]);
        fundos[4].visible = false;

        stage.addChild(content);
        stage.addChild(contenttext);
        stage.addChild(contentgui);

        var btinicio = new createjs.Bitmap(caminho + "btinicio.png");
        btinicio.image.onload = function () { };
        btinicio.x = 81;
        btinicio.y = 160;
        content.addChild(btinicio);
        btinicio.on("mousedown", function (evt) {
            content.removeChild(this);
            clicavel = true;
            createjs.Tween.get(painel, { override: true }).to({ x: 1150 }, 300, createjs.Ease.backOut);

        });

        painel = new createjs.Bitmap(caminho + "partidos.png");
        painel.image.onload = function () { };
        painel.x = 640;
        stage.addChild(painel);
        painel.on("mousedown", function (evt) {
            if (this.x == 1150) {
                createjs.Tween.get(this, { override: true }).to({ x: 640 }, 300, createjs.Ease.backOut);
            } else {
                createjs.Tween.get(this, { override: true }).to({ x: 1150 }, 300, createjs.Ease.backOut);
            }

        });

        configuraIngredientes();

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", ticker);
    }
    function animaTitulo(texto) {
        var tit = new createjs.Container();
        contenttext.addChild(tit);

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
        for (i = 0; i < itens[count].bts.length; i++) {
            var bt = new createjs.Bitmap(caminho + itens[count].bts[i]);
            bt.image.onload = function () { };
            bt.nome = itens[count].bts[i];
            bt.id = i;
            bt.x = bt.px = itens[count].posX[i];
            bt.y = bt.py = itens[count].posY[i];
            content.addChild(bt);
            bt.on("mousedown", function (evt) {
                if (clicavel) {
                    this.visible = false;
                    if (this.id == 10) {
                        /*voto em branco*/
                        votopartido = false;
                        votobranco = true;
                        fundos[1].visible = true;
                        contenttext.removeAllChildren();
                        var txtPart = new createjs.Text("Voto em Branco", "60px Arial", "#000000");
                        contenttext.addChild(txtPart);
                        txtPart.x = 100;
                        txtPart.y = 350;

                    } else if (this.id == 11) {
                        /*corrige voto*/
                        votopartido = false;
                        votobranco = false;
                        contenttext.removeAllChildren();
                        subcount = 0;
                        voto = '';

                    } else if (this.id == 12) {
                        /*confirma*/
                        if (voto.length > 1 || votobranco) {
                            var somFim = new Audio(caminho + itens[count].som);
                            somFim.play();
                            votopartido = false;
                            votobranco = false;
                            contenttext.removeAllChildren();
                            subcount = 0;
                            voto = '';
                            count++;

                            if (count == itens.length) {
                                fundos[4].visible = true;
                                var button = new createjs.Shape();
                                button.graphics.beginFill("#ffffff").drawRect(250, 380, 300, 100);
                                stage.addChild(button);
                                button.alpha = 0.01;
                                button.on("mousedown", function (evt) {
                                    stage.removeChild(this);
                                    count = 0;
                                    fundos[1].visible = false;
                                    fundos[2].visible = false;
                                    fundos[3].visible = false;
                                    fundos[4].visible = false;
                                });
                            } else {
                                fundos[2].visible = true;
                            }
                        } else {
                            sons[1].play();
                        }
                    } else if (subcount < itens[count].digitos) {
                        sons[0].play();
                        voto += String(this.id);

                        var numero = new createjs.Text(this.id, "35px Arial", "#000000");
                        contenttext.addChild(numero);
                        numero.x = 215 + 37 * subcount;
                        numero.y = 285;

                        var loc = itens[count].partido.indexOf(voto);
                        var loc2 = itens[count].numero.indexOf(voto);

                        if (subcount == 1) {
                            fundos[1].visible = true;
                            if (loc > -1) {
                                var txtPart = new createjs.Text(itens[count].partidoNome[loc], "30px Arial", "#000000");
                                contenttext.addChild(txtPart);
                                txtPart.x = 100;
                                txtPart.y = 340;
                                votopartido = true;
                                if (count > 0) {
                                    var imagem = new createjs.Bitmap(caminho + itens[count].imagens[loc]);
                                    imagem.image.onload = function () { };
                                    imagem.x = 425;
                                    imagem.y = 180;
                                    contenttext.addChild(imagem);
                                    console.log(caminho + itens[count].imagens[loc]);
                                }
                            } else {
                                var txtPart = new createjs.Text("Voto Nulo", "60px Arial", "#000000");
                                contenttext.addChild(txtPart);
                                txtPart.x = 100;
                                txtPart.y = 340;
                            }
                        }
                        if (loc2 > -1) {
                            var txtPart2 = new createjs.Text(itens[count].vereadores[loc2], "30px Arial", "#000000");
                            contenttext.addChild(txtPart2);
                            txtPart2.x = 100;
                            txtPart2.y = 390;
                            var imagem = new createjs.Bitmap(caminho + itens[count].imagens[loc2]);
                            imagem.image.onload = function () { };
                            imagem.x = 425;
                            imagem.y = 180;
                            contenttext.addChild(imagem);
                            console.log(caminho + itens[count].imagens[loc2]);
                        } else {
                            if (subcount == 4 && votopartido) {
                                var txtPart = new createjs.Text("Candidato Inexistente      Voto de legenda", "30px Arial", "#000000");
                                contenttext.addChild(txtPart);
                                txtPart.x = 100;
                                txtPart.y = 390;
                                mostraDica();
                            }
                        }
                        subcount++;
                    }

                }
            });
            bt.on("pressup", function (evt) {
                if (clicavel) {
                    this.visible = true;
                }
            });
        }
    }
    function mostraDica() {
        var imagem = new createjs.Bitmap(caminho + "dica.png");
        imagem.image.onload = function () { };
        imagem.x = 900;
        imagem.y = 173;
        stage.addChild(imagem);
        createjs.Tween.get(imagem).to({ alpha: 0.25 }, 300).to({ alpha: 1 }, 300).to({ alpha: 0.25 }, 300).to({ alpha: 1 }, 300).wait(2000).call(apagaDica);

    }
    function apagaDica() {
        stage.removeChild(this);
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