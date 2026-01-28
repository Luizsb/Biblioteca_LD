var AppRoupas = function (itens) {
    var caminho = "resources/image/";
    var canvas;
    var stage;
    var fundo;
    var content;
    var personagem;
    var corpo;
    var calca;
    var tenis;
    var camisa;
    var jaqueta;
    var cabelo;
    var olho;
    var nariz;
    var boca;
    var offX = 450;

    var reco;
    var tomPele = 0;

    canvas = document.getElementById("od1");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);

    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;

    var fundo = new createjs.Bitmap(caminho + "fundo.png");
    fundo.image.onload = function () { };
    stage.addChild(fundo);

    content = new createjs.Container();
    personagem = new createjs.Container();
    corpo = new createjs.Container();
    calca = new createjs.Container();
    tenis = new createjs.Container();
    camisa = new createjs.Container();
    jaqueta = new createjs.Container();
    cabeca = new createjs.Container();
    cabelo = new createjs.Container();
    olho = new createjs.Container();
    nariz = new createjs.Container();
    boca = new createjs.Container();
    stage.addChild(content);
    stage.addChild(personagem);
    personagem.addChild(corpo);
    personagem.addChild(calca);
    personagem.addChild(tenis);
    personagem.addChild(camisa);
    personagem.addChild(jaqueta);
    personagem.addChild(cabeca);
    personagem.addChild(cabelo);
    personagem.addChild(olho);
    personagem.addChild(nariz);
    personagem.addChild(boca);

    primeiraEtapa();

    reco = new createjs.Bitmap(caminho + 'bt_recomecar.png');
    reco.image.onload = function () { };
    reco.x = 1400;
    reco.y = 560;
    stage.addChild(reco);
    reco.on("mousedown", function (evt) {
        primeiraEtapa();
        btContinuar.visible = false;
    });

    var btinicio = new createjs.Bitmap(caminho + 'bt_iniciar.png');
    btinicio.image.onload = function () { };
    stage.addChild(btinicio);
    btinicio.on("mousedown", function (evt) {
        stage.removeChild(this);
    });

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", ticker);

    function primeiraEtapa() {
        content.removeAllChildren();
        corpo.removeAllChildren();
        cabelo.removeAllChildren();
        calca.removeAllChildren();
        tenis.removeAllChildren();
        camisa.removeAllChildren();
        jaqueta.removeAllChildren();
        olho.removeAllChildren();
        nariz.removeAllChildren();
        boca.removeAllChildren();
        var img1 = new createjs.Bitmap(caminho + itens[0].corpos[0][0]);
        img1.image.onload = function () { };
        img1.x = 250;
        img1.scaleX = img1.scaleY = 0.425;
        content.addChild(img1);
        img1.on("mousedown", function (evt) {
            etapa1(0);
        });

        var img2 = new createjs.Bitmap(caminho + itens[1].corpos[0][0]);
        img2.image.onload = function () { };
        img2.x = 650;
        img2.scaleX = img2.scaleY = 0.425;
        content.addChild(img2);
        img2.on("mousedown", function (evt) {
            etapa1(1);
        });
    }

    function etapa1(sexo) {
        createjs.Tween.get(reco).to({ x: 1120 }, 500, createjs.Ease.backOut);

        tomPele = 0;
        content.removeAllChildren();
        createjs.Tween.get(corpo).to({ x: 0 }, 500, createjs.Ease.backOut);
        var i;
        for (i = 0; i < itens[sexo].corpos.length; i++) {
            var bt = new createjs.Bitmap(caminho + itens[sexo].corpos[i][0]);
            bt.image.onload = function () { };
            content.addChild(bt);
            bt.x = 150 + i * 310;
            bt.y = 100;
            bt.alpha = 0;
            bt.scaleX = bt.scaleY = 0.425;
            createjs.Tween.get(bt).wait(i * 100).to({ y: 0, alpha: 1 }, 500, createjs.Ease.backOut);
            bt.id = i;
            bt.on("mousedown", function (evt) {
                etapa2tons(sexo, this.id);
            });
        }
    }

    function etapa2tons(sexo, body) {
        content.removeAllChildren();
        animaTitulo('Escolha o tom de pele:');
        var img1 = new createjs.Bitmap(caminho + itens[sexo].corpos[body][tomPele]);
        img1.image.onload = function () { };
        corpo.addChild(img1);
        personagem.x = -450;
        personagem.scaleX = personagem.scaleY = 0.425;
        createjs.Tween.get(personagem).to({ x: 100 }, 500, createjs.Ease.backOut);
        createjs.Tween.get(corpo).to({ rotation: -10 }, 500, createjs.Ease.quadOut).to({ rotation: 5 }, 350, createjs.Ease.quadOut).to({ rotation: -2 }, 200, createjs.Ease.quadOut).to({ rotation: 0 }, 200);
        var i;
        var offsetx = offX;
        var offsety = 80;
        for (i = 0; i < itens[sexo].tonsCorpo.length; i++) {
            var bt = new createjs.Bitmap(caminho + itens[sexo].tonsCorpo[i]);
            bt.image.onload = function () { };
            content.addChild(bt);
            bt.id = i;
            bt.body = body;
            bt.sexo = sexo;
            bt.x = offsetx;
            bt.y = -150;
            createjs.Tween.get(bt).wait(i * 100).to({ y: offsety }, 250, createjs.Ease.backOut);
            if (offsetx > 800) {
                offsetx = offX;
                offsety += 150;
            } else {
                offsetx += 150;
            }
            bt.on("mousedown", function (evt) {
                corpo.removeAllChildren();
                var img1 = new createjs.Bitmap(caminho + itens[this.sexo].corpos[this.body][this.id]);
                img1.image.onload = function () { };
                corpo.addChild(img1);
                tomPele = this.id;
                this.scaleX = this.scaleY = 0.5;
                createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
            });
        }

        var btContinuar = new createjs.Bitmap(caminho + 'bt_continuar.png');
        btContinuar.image.onload = function () { };
        btContinuar.x = 1400;
        btContinuar.y = 400;
        content.addChild(btContinuar);

        createjs.Tween.get(btContinuar).to({ x: 1120 }, 500, createjs.Ease.backOut);
        btContinuar.on("mousedown", function (evt) {
            etapa3cabelos(sexo, body);
        });
    }

    function etapa3cabelos(sexo, body) {
        content.removeAllChildren();
        animaTitulo('Escolha o cabelo:');
        createjs.Tween.get(personagem, { override: true }).to({ x: -100, scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
        var i;
        var offsetx = offX;
        var offsety = 80;
        for (i = 0; i < itens[sexo].cabelos.length; i++) {
            var bt = new createjs.Bitmap(caminho + 'bt_' + itens[sexo].cabelos[i]);
            bt.image.onload = function () { };
            content.addChild(bt);
            bt.id = i;
            bt.x = offsetx;
            bt.y = -150;
            createjs.Tween.get(bt).wait(i * 100).to({ y: offsety }, 250, createjs.Ease.backOut);
            if (offsetx > 800) {
                offsetx = offX;
                offsety += 150;
            } else {
                offsetx += 150;
            }
            bt.on("mousedown", function (evt) {
                cabelo.removeAllChildren();
                var img1 = new createjs.Bitmap(caminho + itens[sexo].cabelos[this.id]);
                img1.image.onload = function () { };
                cabelo.addChild(img1);
                this.scaleX = this.scaleY = 0.5;
                createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
            });
        }
        criabotaoLimpa(offsetx, offsety, cabelo);

        var btContinuar = new createjs.Bitmap(caminho + 'bt_continuar.png');
        btContinuar.image.onload = function () { };
        btContinuar.x = 1400;
        btContinuar.y = 400;
        content.addChild(btContinuar);
        createjs.Tween.get(btContinuar).to({ x: 1120 }, 500, createjs.Ease.backOut);
        btContinuar.on("mousedown", function (evt) {
            etapaRosto(sexo, body);
        });
    }
    function etapaRosto(sexo, body) {
        content.removeAllChildren();
        animaTitulo('Escolha o rosto:');
        createjs.Tween.get(personagem, { override: true }).to({ x: -100, scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
        var i;
        var offsetx = offX;
        var offsety = 80;
        for (i = 0; i < itens[sexo].rostos[0].length; i++) {
            var bt = new createjs.Bitmap(caminho + 'bt_' + itens[sexo].rostos[i][0]);
            bt.image.onload = function () { };
            content.addChild(bt);
            bt.id = i;
            bt.x = offsetx;
            bt.y = -150;
            createjs.Tween.get(bt).wait(i * 100).to({ y: offsety }, 250, createjs.Ease.backOut);
            if (offsetx > 800) {
                offsetx = offX;
                offsety += 150;
            } else {
                offsetx += 150;
            }
            bt.on("mousedown", function (evt) {
                olho.removeAllChildren();
                var img1 = new createjs.Bitmap(caminho + itens[sexo].rostos[tomPele][this.id]);
                img1.image.onload = function () { };
                olho.addChild(img1);
                this.scaleX = this.scaleY = 0.5;
                createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
            });
        }

        var btContinuar = new createjs.Bitmap(caminho + 'bt_continuar.png');
        btContinuar.image.onload = function () { };
        btContinuar.x = 1400;
        btContinuar.y = 400;
        content.addChild(btContinuar);
        createjs.Tween.get(btContinuar).to({ x: 1120 }, 500, createjs.Ease.backOut);
        btContinuar.on("mousedown", function (evt) {
            etapaRoupas(sexo, body);
        });
    }
    function etapaRoupas(sexo, body) {
        content.removeAllChildren();
        animaTitulo('Escolha a roupa:');
        createjs.Tween.get(personagem, { override: true }).to({ x: 100, scaleX: 0.425, scaleY: 0.425 }, 500, createjs.Ease.backOut);
        var i;
        var offsetx = offX;
        var offsety = 80;
        for (i = 0; i < itens[sexo].camisas[0].length; i++) {
            var bt = new createjs.Bitmap(caminho + 'bt_' + itens[sexo].camisas[0][i]);
            bt.image.onload = function () { };
            content.addChild(bt);
            bt.id = i;
            bt.x = offsetx;
            bt.y = -150;
            createjs.Tween.get(bt).wait(i * 100).to({ y: offsety }, 250, createjs.Ease.backOut);
            if (offsetx > 1000) {
                offsetx = offX;
                offsety += 150;
            } else {
                offsetx += 150;
            }
            bt.on("mousedown", function (evt) {
                camisa.removeAllChildren();
                var img1 = new createjs.Bitmap(caminho + itens[sexo].camisas[body][this.id]);
                img1.image.onload = function () { };
                camisa.addChild(img1);
                this.scaleX = this.scaleY = 0.5;
                createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
            });
        }
        criabotaoLimpa(offsetx, offsety, camisa);

        offsetx = offX;
        if (itens[sexo].jaquetas[0].length > 0) {
            offsety += 150;

            for (i = 0; i < itens[sexo].jaquetas[0].length; i++) {
                var bt = new createjs.Bitmap(caminho + 'bt_' + itens[sexo].jaquetas[0][i]);
                bt.image.onload = function () { };
                content.addChild(bt);
                bt.id = i;
                bt.x = offsetx;
                bt.y = -150;
                createjs.Tween.get(bt).wait(i * 100).to({ y: offsety }, 250, createjs.Ease.backOut);
                if (offsetx > 1000) {
                    offsetx = offX;
                    offsety += 150;
                } else {
                    offsetx += 150;
                }
                bt.on("mousedown", function (evt) {
                    jaqueta.removeAllChildren();
                    var img1 = new createjs.Bitmap(caminho + itens[sexo].jaquetas[body][this.id]);
                    img1.image.onload = function () { };
                    jaqueta.addChild(img1);
                    this.scaleX = this.scaleY = 0.5;
                    createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
                });
            }
            criabotaoLimpa(offsetx, offsety, jaqueta);
        }

        offsetx = offX;
        if (itens[sexo].calcas[0].length > 0) {
            offsety += 150;

            for (i = 0; i < itens[sexo].calcas[0].length; i++) {
                var bt = new createjs.Bitmap(caminho + 'bt_' + itens[sexo].calcas[0][i]);
                bt.image.onload = function () { };
                content.addChild(bt);
                bt.id = i;
                bt.x = offsetx;
                bt.y = -150;
                createjs.Tween.get(bt).wait(i * 100).to({ y: offsety }, 250, createjs.Ease.backOut);
                if (offsetx > 1000) {
                    offsetx = offX;
                    offsety += 150;
                } else {
                    offsetx += 150;
                }
                bt.on("mousedown", function (evt) {
                    calca.removeAllChildren();
                    var img1 = new createjs.Bitmap(caminho + itens[sexo].calcas[body][this.id]);
                    console.log(caminho + itens[sexo].calcas[body][this.id]);
                    img1.image.onload = function () { };
                    calca.addChild(img1);
                    this.scaleX = this.scaleY = 0.5;
                    createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
                });
            }
            criabotaoLimpa(offsetx, offsety, calca);
        }

        offsetx = offX;
        if (itens[sexo].calcas[0].length > 0) {
            offsety += 150;

            for (i = 0; i < itens[sexo].tenis.length; i++) {
                var bt = new createjs.Bitmap(caminho + 'bt_' + itens[sexo].tenis[i]);
                bt.image.onload = function () { };
                content.addChild(bt);
                bt.id = i;
                bt.x = offsetx;
                bt.y = -150;
                createjs.Tween.get(bt).wait(i * 100).to({ y: offsety }, 250, createjs.Ease.backOut);
                if (offsetx > 1000) {
                    offsetx = offX;
                    offsety += 150;
                } else {
                    offsetx += 150;
                }
                bt.on("mousedown", function (evt) {
                    tenis.removeAllChildren();
                    var img1 = new createjs.Bitmap(caminho + itens[sexo].tenis[this.id]);
                    console.log(caminho + itens[sexo].calcas[body][this.id]);
                    img1.image.onload = function () { };
                    tenis.addChild(img1);
                    this.scaleX = this.scaleY = 0.5;
                    createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
                });
            }
            criabotaoLimpa(offsetx, offsety, tenis);
        }

        var btContinuar = new createjs.Bitmap(caminho + 'bt_continuar.png');
        btContinuar.image.onload = function () { };
        btContinuar.x = 1400;
        btContinuar.y = 400;
        content.addChild(btContinuar);
        createjs.Tween.get(btContinuar).to({ x: 1120 }, 500, createjs.Ease.backOut);
        btContinuar.on("mousedown", function (evt) {
            etapaFim();
        });
    }
    function etapaFim() {
        content.removeAllChildren();
        createjs.Tween.get(personagem, { override: true }).to({ x: 450, scaleX: 0.425, scaleY: 0.425 }, 500, createjs.Ease.backOut);
    }

    function criabotaoLimpa(px, py, qual_container) {
        var bt = new createjs.Bitmap(caminho + 'bt_limpa.png');
        bt.image.onload = function () { };
        content.addChild(bt);
        bt.x = px;
        bt.y = py;
        bt.on("mousedown", function (evt) {
            qual_container.removeAllChildren();
            this.scaleX = this.scaleY = 0.5;
            createjs.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.backOut);
        });
    }
    function animaTitulo(texto) {
        var tit = new createjs.Container();
        content.addChild(tit);
        var txt = new createjs.Text(texto, "40px VAG Rounded BT", "#00000");
        txt.regY = 60;
        txt.lineWidth = 900;
        tit.addChild(txt);
        tit.x = -350;
        tit.y = 85;
        createjs.Tween.get(tit).to({ x: 450 }, 300, createjs.Ease.backOut);
    }

    function popIco(qual, px, py) {
        var ico = new createjs.Bitmap(caminho + qual);
        ico.image.onload = function () { };
        ico.regX = ico.regY = 155;
        ico.scaleX = ico.scaleY = 0.01;
        ico.x = px;
        ico.y = py;
        content.addChild(ico);
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 150, createjs.Ease.linear);
    }

    function ticker(event) {
        stage.update();
    }
}