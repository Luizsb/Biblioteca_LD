
var canvas;
var stage;
var content;
var contenthit;
var contentgui;
var fundo;
var agua;
var score;
var inicio1 = false;
var btinicia;
var respostas = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 0, 1, 2, 3, 4];
var moscas = [];
var posX = [690, 830, 999, 1000];
var nomes = ['f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12', 'f13', 'f14', 'f15', 'f16', 'f17', 'f18', 'f19', 'f20', 'f21', 'f22', 'f23', 'f24', 'f25', 'f26'];
var nomes2 = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20', 'p21', 'p22', 'p23', 'p24', 'p25', 'p26'];
var seq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
var word_count = 0;
var hits = [];
var palavras = [];
var figuras = [];
var letras = [];
var edgeOffset = 60;
var count = 0;
var si = 0;
var countTempo = 0;
var btcontinuar;
var bt1;
var bt2;
var label;
var intervalo = 500;
var velocidade = 15000;
var erro = 0;
var update = true;
var clicavel = true;
var i_foto;
var texto;
var texto2;
var texto3;
var i_erros = 0;
var i_acertos = 0;
var bt_dicas;
var dicas;


function init2() {
    canvas = document.getElementById("od2");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage);
    contenthit = new createjs.Container();
    content = new createjs.Container();
    contentgui = new createjs.Container();
    fundo = new createjs.Bitmap("resources/image/fundo_od2.png");
    fundo.image.onload = function () { };
    stage.addChild(fundo);

    shuffle(seq);
    stage.addChild(contenthit);
    stage.addChild(content);
    stage.addChild(contentgui);

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
    stage.addChild(agua);

    console.log(seq);
    for (var i = 0; i < 5; i++) {
        hits[i] = new createjs.Bitmap("resources/image/bt" + i + ".png");
        hits[i].image.onload = function () { };
        contenthit.addChild(hits[i]);
        hits[i].x = i * 200 + 240;
        hits[i].y = 560;
        hits[i].regX = 184 / 2;
        hits[i].regY = 290 / 2;
        hits[i].id = i;
    }

    btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
    btinicia.image.onload = function () { };
    stage.addChild(btinicia);
    btinicia.on("click", function () {
        btinicia.visible = false;
        inicio1 = true;
        countTempo = 0;
        word_count = 0;
        nasceMosca();
    });

    score = new createjs.Bitmap("resources/image/score.png");
    score.image.onload = function () { };
    contentgui.addChild(score);
    score.on("mousedown", function (evt) {
        i_acertos = 0;
        i_erros = 0;
        texto2.text = "0";
        texto3.text = "0";
        contentgui.visible = false;
        inicio1 = true;
        count = 0;
        content.removeAllChildren();
        nasceMosca();

    });

    bt_dicas = new createjs.Bitmap("resources/image/bt_dicas.png");
    bt_dicas.image.onload = function () { };
    stage.addChild(bt_dicas);
    bt_dicas.x = 1210;
    bt_dicas.y = 30;
    bt_dicas.on("click", function () {
        dicas.visible = true;
    });
    dicas = new createjs.Bitmap("resources/image/dicas.png");
    dicas.image.onload = function () { };
    stage.addChild(dicas);
    dicas.visible = false;
    dicas.on("click", function () {
        dicas.visible = false;
    });

    texto2 = new createjs.Text("0", "bold 40px Arial", "#5ab00b");
    texto2.x = 290;
    texto2.y = 100;
    texto2.textAlign = "center";
    contentgui.addChild(texto2);

    texto3 = new createjs.Text("0", "bold 40px Arial", "#ff0000");
    texto3.x = 260;
    texto3.y = 14;
    texto3.textAlign = "center";
    contentgui.addChild(texto3);

    contentgui.x = 300;
    contentgui.y = 100;
    contentgui.visible = false;

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", ticker);
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
function verificaFim(e) {
    contenthit.removeChild(this);
    if (count > 8) {
        contentgui.visible = true;
    } else {
        count += 1;
        nasceMosca();
    }
    if (i_acertos > 9) {
        som2();

    }
}
function ticker(event) {
    if (update) {
        stage.update();

    }
}
function nasceMosca() {
    if (count > 14) {
        Fim();
    } else {
        var mos;
        var resposta = respostas[seq[count]];
        mos = new createjs.Bitmap("resources/image/c" + seq[count] + ".png");
        clicavel = true;
        content.addChild(mos);
        mos.x = -700;
        mos.y = 220;
        mos.regX = 374 / 2;
        mos.regY = 214;
        mos.pode = true;
        mos.rotation = -360;
        createjs.Tween.get(mos).to({ x: 620, rotation: 0 }, 1000, createjs.Ease.backOut);
        clicavel = true;
        mos.on("mousedown", function (evt) {
            if (this.pode && inicio1) {
                this.parent.addChild(this);
                var global = content.localToGlobal(this.x, this.y);
                this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
            }
        });
        mos.on("pressmove", function (evt) {
            if (this.pode && inicio1) {
                var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                this.x = local.x;
                this.y = local.y;
            }
        });
        mos.on("pressup", function (evt) {
            if (this.pode && inicio1) {
                var volta = true;
                content.removeChild(this);
                var i;
                for (i = 0; i < 5; i++) {
                    if (intersect(hits[i], this)) {
                        hits[i].scaleX = hits[i].scaleY = 0.1;
                        createjs.Tween.get(hits[i]).to({ scaleX: 1, scaleY: 1 }, 300, createjs.Ease.backOut);

                        if (hits[i].id == resposta) {
                            volta = false;
                            createjs.Tween.get(mos).wait(1000).call(nasceMosca);
                            animaIco("certo", hits[i].x, hits[i].y);
                            som0();
                            i_acertos++;
                            texto2.text = i_acertos;
                        }

                        break;
                    }
                }
                if (volta) {
                    animaIco("errado", hits[i].x, hits[i].y);
                    som1();
                    i_erros++;
                    texto3.text = i_erros;
                    if (i_erros >= 3) {
                        Fim();
                        som3();
                    } else {
                        createjs.Tween.get(mos).wait(1000).call(nasceMosca);
                    }
                }
            }
        });
        count++;
    }
}
function animaIco(qual, b, c) {
    var ico;
    ico = new createjs.Bitmap("resources/image/" + qual + ".png");
    stage.addChild(ico);
    ico.x = b;
    ico.y = c;
    ico.regX = 315 / 2;
    ico.regY = 315 / 2;
    ico.scaleX = ico.scaleY = 0.1;
    createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5, y: 330 }, 200, createjs.Ease.backOut).wait(1000).call(apagaicone);
}
function Fim() {
    var img;
    var bo;
    var continua = false;
    contentgui.visible = true;
    content.removeAllChildren();
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
        bo.regX = 165;
        bo.regY = 280;
        bo.x = 850;
        bo.y = 1000;
        content.addChild(bo);
        createjs.Tween.get(bo).to({ y: 350 }, 1000, createjs.Ease.backOut);


    }

}
function apagaicone(e) {
    stage.removeChild(this);
}
function intersect(obj1, obj2) {

    var objBounds1 = obj1.getBounds().clone();
    var objBounds2 = obj2.getBounds().clone();
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
function som3() {
    document.getElementsByTagName('audio')[3].play();
}