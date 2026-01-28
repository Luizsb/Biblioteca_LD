
var caminho = "resources/image/";
var canvas1;
var stage;
var content;
var content2;
var fumaca;
var inicio1 = false;
var btinicia;

var hits = [];
var texto;
var texto2;
var texto3;
var imagens;
var gui;
var startTime;
var erro;
var i_erros = 0;
var i_acertos = 0;
var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];
function jogoSeteErrosIni(idCanvas) {
    var index;
    var t;
    for (index in sons) {
        t = sons[index];
        sons[index] = new Audio(caminho + t);
    }

    console.log(idCanvas)

    canvas1 = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas1);
    stage.enableMouseOver(10);
    content = new createjs.Container();
    content2 = new createjs.Container();
    btinicia = new createjs.Container();

    var fundo = new createjs.Bitmap(caminho + "fundo_od2.png");
    fundo.image.onload = function () { };

    stage.addChild(fundo);
    stage.addChild(content);
    stage.addChild(content2);
    stage.addChild(btinicia);

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

    imagens = new createjs.Bitmap(caminho + "img.png");
    imagens.image.onload = function () { };
    content.addChild(imagens);
    imagens.visible = false;

    gui = new createjs.Bitmap(caminho + "gui.png");
    gui.image.onload = function () { };
    content.addChild(gui);

    gui.visible = false;

    texto = new createjs.Text("3:00", "bold 40px Arial", "#000000");
    texto.x = 300;
    texto.y = 18;
    texto.textAlign = "center";
    content.addChild(texto);

    texto2 = new createjs.Text('0/' + quantidadeErros, "bold 40px Arial", "#5ab00b");
    texto2.x = 695;
    texto2.y = 18;
    texto2.textAlign = "center";
    content.addChild(texto2);

    texto3 = new createjs.Text('0/' + quantidadeErros, "bold 40px Arial", "#ff0000");
    texto3.x = 1180;
    texto3.y = 18;
    texto3.textAlign = "center";
    content.addChild(texto3);

    texto.visible = false;
    texto2.visible = false;
    texto3.visible = false;

    erro = new createjs.Bitmap(caminho + "erro.png");
    erro.image.onload = function () { };
    content.addChild(erro);
    erro.alpha = 0.01;
    erro.on("mousedown", function (evt) {
        if (inicio1) {

            i_erros += 1;
            fumaca.x = stage.mouseX;
            fumaca.y = stage.mouseY;
            fumaca.gotoAndPlay("fumaca1");
            texto3.text = i_erros + '/' + quantidadeErros;
            if (i_erros == quantidadeErros) {
                verificaFim(false);
            }
            sons[1].play();
            animaIco("errado", stage.mouseX, stage.mouseY);
        }
    });

    montaErros();

    var txtinicia = new createjs.Text(enunciado, "bold " + tamanhoTextoEnunciado + "px VAG Rounded BT", "#000000");
    txtinicia.lineWidth = 700;
    txtinicia.rotation = -5;
    txtinicia.textAlign = "center";
    txtinicia.regY = txtinicia.getBounds().height / 2;

    var imginicia = new createjs.Bitmap(caminho + "bt_iniciar.png");
    imginicia.image.onload = function () { };
    imginicia.regX = 770 / 2;
    imginicia.regY = 715 / 2;
    imginicia.x = 10;

    btinicia.addChild(imginicia);
    btinicia.addChild(txtinicia);

    btinicia.x = 640;
    btinicia.y = 300;
    btinicia.on("click", function () {
        var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        createjs.Tween.get(btinicia).to({ y: -700 }, 350, createjs.Ease.backIn).call(comecaJogo);
    });

    createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", ticker);
}
function comecaJogo() {
    inicio1 = true;
    startTime = Date.now();
    gui.visible = true;
    imagens.visible = true;
    texto.visible = true;
    texto2.visible = true;
    texto3.visible = true;
}
function montaErros() {
    hits = [];
    content2.removeAllChildren();
    var calculaMirror = 0;
    var mirror = 0;
    var i;
    for (i = 0; i < quantidadeErros * 2; i++) {
        hits[i] = bolaTexto(mirror);

        content2.addChild(hits[i]);
        hits[i].alpha = 0.01;
        hits[i].name = mirror;
        hits[i].id = i;

        if (calculaMirror == 1) {
            calculaMirror = 0;
            mirror++;
        } else {
            calculaMirror++;
        }

        if (modoEdicao) {
            hits[i].alpha = 0.71;
            hits[i].x = 100;
            hits[i].y = 100;
            pos[i] = [];

            hits[i].on("mousedown", function (evt) {
                this.parent.addChild(this);
                var global = content2.localToGlobal(this.x, this.y);
                this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
            });
            hits[i].on("pressmove", function (evt) {
                var local = content2.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                this.x = local.x;
                this.y = local.y;
            });
            hits[i].on("pressup", function (evt) {
                pos[this.id][0] = Math.floor(this.x);
                pos[this.id][1] = Math.floor(this.y);
                var _pos = "[[";
                var i;
                for (i = 0; i < hits.length; i++) {
                    _pos += String(pos[i]) + "],[";
                }
                _pos = _pos.substring(0, _pos.length - 2);
                _pos += "]";
                console.clear();
                console.log("var pos=" + _pos + ";");
            });
        } else {
            hits[i].x = pos[i][0];
            hits[i].y = pos[i][1];
            hits[i].on("mousedown", function (evt) {
                if (inicio1) {
                    var i;
                    for (i = 0; i < hits.length; i++) {
                        if (hits[i].name == this.name) {
                            hits[i].visible = false;
                            animaIco("certo", hits[i].x, hits[i].y);
                        }

                    }
                    sons[0].play();
                    i_acertos += 1;
                    texto2.text = i_acertos + '/' + quantidadeErros;
                    if (i_acertos == quantidadeErros) {
                        verificaFim(true);
                    }
                }

            });

        }
    }
}
function verificaFim(vencedor) {
    var img;
    var bo;
    var continua = false;

    if (!vencedor) {
        img = caminho + "tentenovamente.png";
        continua = true;
        sons[3].play();

    } else {
        img = caminho + "positivo.png";
        continua = true;
        sons[2].play();
    }

    if (continua) {
        inicio1 = false;

        bo = new createjs.Bitmap(img);
        bo.image.onload = function () { };
        bo.regX = bo.regY = 135;
        bo.x = 640;
        bo.y = 1000;
        stage.addChild(bo);
        createjs.Tween.get(bo).wait(1000).to({ y: 300 }, 1000, createjs.Ease.quadOut);
        bo.on("mousedown", function (evt) {
            startTime = Date.now();
            stage.removeChild(this);
            count = 0;
            ordem = 0;
            inicio1 = true;
            i_acertos = 0;
            i_erros = 0;
            content2.removeAllChildren();
            texto2.text = i_acertos + '/' + quantidadeErros;
            texto3.text = i_erros + '/' + quantidadeErros;
            montaErros();

        });


    }

}
function animaIco(qual, b, c) {
    var ico;
    ico = new createjs.Bitmap(caminho + qual + ".png");
    content2.addChild(ico);
    ico.x = b;
    ico.y = c;
    ico.regX = 155;
    ico.regY = 155;
    ico.scaleX = ico.scaleY = 0.1;
    if (qual == "errado") {
        createjs.Tween.get(ico).to({ scaleX: 0.3, scaleY: 0.3 }, 200, createjs.Ease.quadOut).wait(600).call(deleta);
    } else {
        createjs.Tween.get(ico).to({ scaleX: 0.3, scaleY: 0.3 }, 200, createjs.Ease.quadOut);
    }
}
function deleta() {
    content2.removeChild(this);
}
function bolaTexto(texto) {
    var txt = new createjs.Text(texto, "bold 30px VAG Rounded BT", "#ffffff");

    txt.textAlign = "center";

    var circulo = new createjs.Shape();
    circulo.graphics.beginFill("#000000").drawCircle(0, 0, tamanhoAreaErro);

    var t = new createjs.Container();
    t.addChild(circulo);
    t.addChild(txt);

    return t;

}

function ticker() {
    stage.update();
    if (inicio1) {
        checkTime();
    }

}
function checkTime() {
    var timeDifference = Date.now() - startTime;
    var formatted = convertTime(timeDifference);
    if (timeDifference > tempoJogoSegundos * 1000) {
        i_erros = quantidadeErros;
        verificaFim();
    }
    texto.text = '' + formatted;
}
function convertTime(miliseconds) {
    var totalSeconds = Math.floor(miliseconds / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds - minutes * 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
}
