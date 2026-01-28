/*
alterado dia 9/8/2020
-adicionado pergunta com imagem

alterado dia 9/8/2019
-acrescentado shape de fundo na pergunta e centralizado pra qualquer tamanho de canvas_od2
*/
var AppRevelaImagem = function (idCanvas, _itens, tamanhoTextoPergunta, tamanhoTextoBotao, modoEdicao, imagemGui, imgFundo) {
    var canvas_od2,
    stage_od2,
    descobreImagem,
    caminho_od2 = "resources/image/",
    gabarito_od2 = [3, 2, 2, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0],
    qual_od2, fundo_revela,
    clique_od2 = true,
    subclique_od2 = true,
    i_acertos_od2 = 0,
    i_erros_od2 = 0,
    sons_od2 = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];


    function criaGui2() {
        var gui = new createjs.Container();
        stage_od2.addChild(gui);
        gui.name = "gui";

        var img;
        if (imagemGui) {
            img = imagemGui;
        } else {
            img = "gui.png";
        }

        var _gui = new createjs.Bitmap(caminho_od2 + img);
        _gui.image.onload = function () { };

        txt_a = new createjs.Text(i_acertos_od2, "bold 40px VAG Rounded BT", "#000000");
        txt_a.textAlign = "left";
        txt_a.x = 220;
        txt_a.y = 25;

        txt_e = new createjs.Text(i_erros_od2, "bold 40px VAG Rounded BT", "#b10000");
        txt_e.textAlign = "left";
        txt_e.x = 510;
        txt_e.y = 25;

        gui.addChild(_gui);
        gui.addChild(txt_a);
        gui.addChild(txt_e);

    }
    function criaBotoes2() {
        var i, j, w = 0;
        for (i = 0; i < _itens.length; i++) {
            var bt = new createjs.Bitmap(caminho_od2 + _itens[i].quadrado);
            bt.image.onload = function () { };
            descobreImagem.addChild(bt);
            bt.x = _itens[i].posicao[0];
            bt.y = _itens[i].posicao[1];
            bt.id = w;
            bt.name = "quad" + w;

            if (modoEdicao) {

                bt.on("mousedown", function (evt) {
                    this.parent.addChild(this);
                    var global = descobreImagem.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                });
                bt.on("pressmove", function (evt) {
                    var local = descobreImagem.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = local.x;
                    this.y = local.y;
                });
                bt.on("pressup", function (evt) {
                    ;

                    console.log("var pos=" + this.x, +" " + this.y);
                });
            } else {

                bt.on("mousedown", function (evt) {
                    if (clique_od2) {
                        clique_od2 = false;
                        qual_od2 = this.id;

                        var popup = new createjs.Container();

                        var popShape = new createjs.Shape();
                        popShape.graphics.beginLinearGradientFill(["#006f9b", "#006f9b"], [0, 1], 0, 0, 0, canvas_od2.height);
                        popShape.graphics.beginLinearGradientFill(["#212121", "#000000"], [0, 1], 0, 0, 0, canvas_od2.height);
                        popShape.graphics.drawRoundRect(0, 0, canvas_od2.width - 50, canvas_od2.height - 50, 20);
                        popShape.graphics.endFill();
                        popShape.regX = (canvas_od2.width - 50) / 2;
                        popShape.y = 25;
                        popShape.alpha = 0.75;


                        btFechar = new createjs.Bitmap(caminho_od2 + "popup_fechar.png");
                        btFechar.image.onload = function () { };
                        popup.addChild(popShape);
                        stage_od2.addChild(popup);
                        btFechar.regX = 640;
                        popup.setTransform(this.x, this.y, 0, 0);
                        formulaPerguntaBalao2(popup, this.id,0);
                        createjs.Tween.get(popup).wait(100).to({ x: canvas_od2.width / 2, y: -15, scaleX: 1, scaleY: 1 }, 1000, createjs.Ease.backOut);
                        // btFechar.graphics.beginFill("#000000").drawCircle(0, 0, 50);
                        // btFechar.x = 510;
                        // btFechar.y = 80;
                        // btFechar.alpha = 0.01;
                        btFechar.on("mousedown", function (evt) {
                            stage_od2.removeChild(popup);
                            clique_od2 = true;
                            subclique_od2 = true;
                        });
                        popup.addChild(btFechar);
                    }
                });
            }


            w++;

        }

    }
    function formulaPerguntaBalao2(c, identidade,offsetPergunta) {
        if (_itens[qual_od2].offSetPerguntaY) {
            offsetPergunta += _itens[qual_od2].offSetPerguntaY;
        }
        var word;
        var extensao=_itens[qual_od2].pergunta.split('.').pop();
        if(extensao=='jpg' || extensao=='png'){
          word = new createjs.Bitmap(caminho_od2+_itens[qual_od2].pergunta);
          word.image.onload = function () {
            var tamX=word.getBounds().width;
            var tamY=word.getBounds().height;
            word.regX=tamX/2;
            word.altura=tamY;
            continuaPergunta(word,c,identidade,30,0,offsetPergunta);
        };

    }else{
        if (_itens[qual_od2].pergunta.length > 0) {
            word = textoContorno2(_itens[qual_od2].pergunta);
        } else {
            word = new createjs.Shape();
            word.altura = 0;
        }
        continuaPergunta(word,c,identidade,0,100,offsetPergunta);
    }

    
}
function continuaPergunta(word,c,identidade,correcao,correcao2,offsetPergunta){
    word.x = 0;
    word.y = correcao2+offsetPergunta;

    c.addChild(word);
    var off = 0;
    var i;
    for (i = 0; i < _itens[identidade].opcoes.length; i++) {
        var bt = caixaTexto2(_itens[qual_od2].opcoes[i]);
        c.addChild(bt);
        bt.x = 0;
        console.log(word.altura);
        bt.y = off + word.altura +correcao+(offsetPergunta+word.y);
        bt.alpha = 0.8;
        bt.pode = true;
        bt.name = i;
        /*verifica se tem mais de uma opcao de resposta*/
        console.log("var trigResposta=" + _itens[qual_od2].resposta.length);
        if (_itens[qual_od2].resposta.length > 1) {
            bt.respostaComplementar = true;
        } else {
            bt.respostaComplementar = false;
        }
        bt.resposta = _itens[qual_od2].resposta;
        off += bt.altura + 10;
        bt.cursor = 'pointer';

        bt.on("mousedown", function (evt) {
            if (subclique_od2) {
                subclique_od2 = false;
                var global = this.parent.localToGlobal(this.x, this.y);

                var trigResposta = false;
                if (this.respostaComplementar) {
                    var index;
                    for (index in this.resposta) {
                        if (this.resposta[index] == this.name + 1) {
                            trigResposta = true;
                            console.log("var trigResposta=" + trigResposta);
                        }
                    }

                } else {
                    if (this.resposta == this.name + 1) {
                        trigResposta = true;
                    }
                }


                if (trigResposta) {
                    animaIco2("certo", global.x, global.y + 150);
                    i_acertos_od2++;
                    sons_od2[0].play();
                    this.alpha = 0.6;
                    var quadrado = descobreImagem.getChildByName("quad" + qual_od2);
                    if (quadrado != null) {
                        descobreImagem.removeChild(quadrado);
                    }
                } else {
                    animaIco2("errado", global.x, global.y + 150);
                    i_erros_od2++;
                    sons_od2[1].play();
                }
                createjs.Tween.get(this).wait(1000).call(fechaPop2);
            }
        });


    }
}
function fechaPop2() {
    stage_od2.removeChild(this.parent);
    clique_od2 = true;
    subclique_od2 = true;
}
function verificaFim2() {
    if (i_acertos_od2 >= _itens.length) {
        criaGui2();
        var img;
        var bo;
        var continua = false;
        descobreImagem.removeAllChildren();

        if (i_erros_od2 > 5) {
            img = caminho_od2 + "tentenovamente.png";
            continua = true;
            sons_od2[3].play();
        } else {
            img = caminho_od2 + "positivo.png";
            continua = true;
            sons_od2[2].play();
        }


        if (continua) {
            bo = new createjs.Bitmap(img);
            bo.image.onload = function () { };
            bo.regX = 135;
            bo.regY = 210;
            bo.x = canvas_od2.width / 2;
            bo.y = -800;
            stage_od2.addChild(bo);
            createjs.Tween.get(bo).wait(1000).to({ y: canvas_od2.height / 2 }, 1000, createjs.Ease.backOut);
            bo.on("mousedown", function (evt) {
                stage_od2.removeChild(this);
                var gui = stage_od2.getChildByName("gui");
                stage_od2.removeChild(gui);
                qual_od2 = 0;
                i_acertos_od2 = 0;
                i_erros_od2 = 0;
                criaBotoes2();
            });


        }
    }
}
function animaIco2(qual, b, c) {
    var ico;
    ico = new createjs.Bitmap(caminho_od2 + qual + ".png");
    stage_od2.addChild(ico);
    ico.x = b - 30;
    ico.y = c - 150;
    ico.regX = 98;
    ico.regY = 98;
    ico.scaleX = ico.scaleY = 0.1;
    createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.backOut).wait(800).call(deletaVerifica2);
}
function deletaVerifica2() {
    stage_od2.removeChild(this);
    verificaFim2();
}
function textoContorno2(texto) {
    var txt = new createjs.Text(texto, tamanhoTextoPergunta + "px VAG Rounded BT", "#ffffff");
    txt.textAlign = "center";
    txt.shadow = new createjs.Shadow("#000000", 5, 5, 10);
    txt.lineWidth = 900;

    var tamX = txt.getBounds().width;
    var tamY = txt.getBounds().height;

    var t = new createjs.Container();
    t.altura = tamY;

    t.addChild(txt);

    return t;

}

function caixaTexto2(texto) {
    var txt = new createjs.Text(texto, tamanhoTextoBotao + "px VAG Rounded BT", "#000000");

    txt.regY = tamY / 2 - 35;
    txt.textAlign = "center";
    txt.lineWidth = 900;
    var tamX = txt.getBounds().width + 80;
    var tamY = txt.getBounds().height + 50;

    var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
    button.graphics.drawRoundRect(0, 0, tamX, tamY, 20);
    button.graphics.endFill();
    button.regX = tamX / 2;
    button.y = -30;

    var t = new createjs.Container();
    t.addChild(button);
    t.addChild(txt);
    t.altura = tamY;
    return t;

}
function ticker2(event) {
    stage_od2.update();
}

function init2() {


    var index;
    for (index in sons_od2) {
        var t = sons_od2[index];
        sons_od2[index] = new Audio(caminho_od2 + t);
    }

    canvas_od2 = document.getElementById(idCanvas);
    stage_od2 = new createjs.Stage(canvas_od2);
    stage_od2.enableMouseOver(10);

    createjs.Touch.enable(stage_od2);
    stage_od2.enableMouseOver(10);
    stage_od2.mouseMoveOutside = true;


    if (imgFundo != null) {
        fundo_revela = new createjs.Bitmap(caminho_od2 + imgFundo);
    } else {
        fundo_revela = new createjs.Bitmap(caminho_od2 + "fundo_od2.png");
    }

    fundo_revela.image.onload = function () { };
    stage_od2.addChild(fundo_revela);

    descobreImagem = new createjs.Container();
    stage_od2.addChild(descobreImagem);
    criaBotoes2();

    var btinicia = new createjs.Bitmap(caminho_od2 + "bt_iniciar.png");
    btinicia.image.onload = function () { };
    stage_od2.addChild(btinicia);
    btinicia.on("click", function () {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        this.visible = false;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", ticker2);
    });
    stage_od2.update();
    setTimeout(function () { stage_od2.update(); }, 1000);

}
init2();
}