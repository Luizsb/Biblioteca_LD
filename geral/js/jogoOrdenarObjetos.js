/*
v1.8
-incluida uma tela parada com o nome perguntaParada, pra usar como feedback

v1.7
editado 21/10/2019
-rollover nos bts

v1.66
adicionado posicao do scroll da pagina pra rodar o jogo

v1.65
editado 6/2/2019
-unificado com o script de rotacao

editado 27/11/2018
-correcao do som que nao tocava mais

-imgGui
-adicionado player som
*/
var AppJogoOrndearObjetos = function (modoEdicao, 
    idCanvas, 
    idFundo,
    _itensTemp, 
    _parametros, 
    _btiniciar, 
    _enunciado, 
    _idioma, 
    contaPontos/*contagem certa de cada fase*/, 
    _escondeHits, 
    _colisaoBox,
    _imgGui,
    _rollOverHit,
    _rolloverPergunta,
    _hitFalseHidden=true) {
    var caminho = "resources/image/",
    canvas,
    stage,
    content,
    contentFundo,
    fundoAtual,
    contenthit,
    contentFixado,
    audioIngredientes,
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
    count = 0,
    cliqueAnterior = -1,
    fase = 0,
    hits = [],
    hitsPause = [],
    figuras = [],
    inicio1 = false,
    edgeOffsetX = 200,
    edgeOffsetY = 200,
    btreseta,
    btinicia,
    positivo,
    i_erros = 0,
    i_acertos = 0,
    mostraLinha = false,
    audioOn, audioOff,
    line,
    pontosNecessarios = 0,
    tempArray = [],
    txt_a, txt_e,
    index,
    texto_tempo,
    calculaTempo = false,
    countTempo = 0,
    rate = 0,
    sonsHits = [],
    selecionado,
    _itens,
    sonsTocados = [],
    somFase,
    btSomFasePlay,
    btSomFasePause,
    update=false,
    tempOver,
    t;

    for (index in sons) {
        t = sons[index];
        sons[index] = new Audio(caminho + t);
    }

    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    stage.mouseMoveOutside = true;
    createjs.Touch.enable(stage);
    contenthit = new createjs.Container();
    contentFixado = new createjs.Container();
    contentFundo = new createjs.Container();
    content = new createjs.Container();

    console.log(_itensTemp);

    stage.addChild(contentFundo);

    stage.addChild(contenthit);
    stage.addChild(contentFixado);
    stage.addChild(content);

    if (_parametros[9] != null) {
        fase = _parametros[9];
        _itens = _itensTemp[fase];
        fundoAtual = idFundo[fase];
        console.log('SIM tem fases');
    } else {
        _itens = _itensTemp;
        fundoAtual = idFundo;
        console.log('NAO tem fases');
    }

    console.log("2018");

    if (_parametros[7]) {
        criaGui();
    }

    if (_parametros[13]) {
        for (index in _itens) {
            sonsTocados.push(false);
        }
    }

    montaFase();

    if (!modoEdicao) {
        if (_btiniciar != null) {
            btinicia = new createjs.Bitmap(caminho + _btiniciar);
        } else {
            btinicia = new createjs.Bitmap(caminho + "bt_iniciar_od4.png");
        }

        btinicia.image.onload = function () { };
        stage.addChild(btinicia);
        btinicia.on("click", function () {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();

            btinicia.visible = false;
            inicio1 = true;
            criaRelogio();
            if (typeof _enunciado !== 'undefined') {
                var enun = new Audio(caminho + _enunciado);
                enun.play();

            }
            if (_parametros[15] != null) {
                /*toca som no inicio da fase*/
                console.log("play musica_");
                tocaSom(fase, true);
                btSomFasePlay.visible = true;
                btSomFasePause.visible = true;
            }
        });
    }
    if (modoEdicao) {

        var imgEditMode = new createjs.Bitmap(caminho + "modoEdicao.png");
        imgEditMode.image.onload = function () { };
        stage.addChild(imgEditMode);
        setInterval(function () { stage.removeChild(imgEditMode); }, 3000);

        var bt1 = new createjs.Bitmap(caminho + "modoEdicao_bt1.png");
        bt1.image.onload = function () { };
        stage.addChild(bt1);
        bt1.on("click", function () {
            if (fase > 0) {
                fase--;
                count = 0;
                _itens = _itensTemp[fase];
                fundoAtual = idFundo[fase];
                montaFase();
            }
        });

        var bt2 = new createjs.Bitmap(caminho + "modoEdicao_bt2.png");
        bt2.image.onload = function () { };
        stage.addChild(bt2);
        bt2.x = 1180;
        bt2.on("click", function () {
            if (fase < _itensTemp.length - 1) {
                fase++;
                count = 0;
                _itens = _itensTemp[fase];
                fundoAtual = idFundo[fase];
                montaFase();
            }
        });
    }

    createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", ticker);
    if(isScrolledIntoView($('#'+idCanvas)))
    {
    }
    update=true;

    function criaRelogio() {
        if (_parametros[11] != null) {
            if (_parametros[11][0] > 0) {
                countTempo = _parametros[11][0];
                texto_tempo = new createjs.Text(countTempo + "s", "bold " + _parametros[11][2] + "px VAG Rounded BT", _parametros[11][1]);
                texto_tempo.x = _parametros[11][3];
                texto_tempo.y = _parametros[11][4];
                texto_tempo.textAlign = "center";
                stage.addChild(texto_tempo);
                calculaTempo = true;
            }
        }
    }
    function criaGui() {
        var gui = new createjs.Container();
        stage.addChild(gui);
        var _gui;

        if (_imgGui != null) {
            _gui = new createjs.Bitmap(caminho + _imgGui);
        } else {
            _gui = new createjs.Bitmap(caminho + "gui.png");
        }
        _gui.image.onload = function () {};

        txt_a = new createjs.Text(i_acertos, "bold 40px VAG Rounded BT", "#000000");
        txt_a.textAlign = "left";
        txt_a.x = 220;
        txt_a.y = 25;

        txt_e = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#b10000");
        txt_e.textAlign = "left";
        txt_e.x = 510;
        txt_e.y = 25;

        gui.addChild(_gui);
        gui.addChild(txt_a);
        gui.addChild(txt_e);

    }
    function atualizaGui() {
        if (_parametros[7]) {
            txt_a.text = i_acertos;
            txt_e.text = i_erros;
        }
    }
    function montaFase() {
        inicio1 = true;
        content.removeAllChildren();
        contenthit.removeAllChildren();
        if (_parametros[10] != null) {
            if (_parametros[10]) {
                contentFixado.removeAllChildren();
            }
        } else {
            contentFixado.removeAllChildren();
        }
        if (_parametros[15] != null) {
            console.log("monta play audiuo")
            /*monta botao de som no inicio da fase*/
            btSomFasePlay = new createjs.Bitmap(caminho + "play_" + _parametros[15][0] +count +".png");
            btSomFasePlay.image.onload = function () { };
            contenthit.addChild(btSomFasePlay);
            btSomFasePlay.x = -500;
            btSomFasePlay.y = _parametros[15][2];
            btSomFasePlay.visible = true;
            createjs.Tween.get(btSomFasePlay).to({ x: _parametros[15][1] }, 550, createjs.Ease.backOut);

            btSomFasePause = new createjs.Bitmap(caminho + "pause_" + _parametros[15][0] + count+".png");
            btSomFasePause.image.onload = function () { };
            contenthit.addChild(btSomFasePause);
            btSomFasePause.x = -500;
            btSomFasePause.y = _parametros[15][2];
            btSomFasePause.visible = false;
            createjs.Tween.get(btSomFasePause).to({ x: _parametros[15][1] }, 550, createjs.Ease.backOut);



            btSomFasePlay.on("mousedown", function (evt) {
                tocaSom(fase, true);
                this.visible = false;
                btSomFasePause.visible = true;

            });
            btSomFasePause.on("mousedown", function (evt) {
                paraTodosSons();
                this.visible = false;
                btSomFasePlay.visible = true;
            });
            if (fase > 0) {
                tocaSom(fase, true);
                btSomFasePlay.visible = false;
                btSomFasePause.visible = true;
            }
        }

        contentFundo.removeAllChildren();
        var fundo = new createjs.Bitmap(caminho + fundoAtual);
        fundo.image.onload = function () { };
        fundo.alpha = 0;
        contentFundo.addChild(fundo);
        createjs.Tween.get(fundo).to({ alpha: 1 }, 1000);

        pontosNecessarios = 0;
        tempArray = [];
        hits = [];
        figuras = [];
        var i;
        var margemX = _parametros[0];
        var margemY = _parametros[1];
        for (i = 0; i < _itens.length; i++) {
            if (contaPontos) {
                pontosNecessarios = contaPontos[fase];

            } else {
                if (_itens[i].respondivel) {
                    pontosNecessarios++;
                }
            }
            if (_parametros[8] && tempArray.indexOf(_itens[i].resposta) > -1) {
                /*resposta unica*/
                continue;
            } else {

                var caminhoTemp = caminho;
                if (_parametros[13] != null) {
                    caminhoTemp = caminho + "play_";
                }
                var hit;
                if(_itens[i].resposta){
                    console.log("carrega hit sonoro:"+caminhoTemp + _itens[i].resposta);
                    hit = new createjs.Bitmap(caminhoTemp + _itens[i].resposta);
                    hit.image.onload = function () { };
                    contenthit.addChild(hit);
                    hit.x = _itens[i].posicaoResposta[0];
                    hit.y = _itens[i].posicaoResposta[1];
                    hit.nome = _itens[i].resposta;
                    hit.id = i;
                    hit.cursor = "pointer";
                    hit.pode = true;
                    if (_escondeHits) {
                        hit.visible = false;
                    }
                    if (_itens[i].posicaoResposta[2]) {
                        hit.rotation = _itens[i].posicaoResposta[2];
                    }
                    hit.on('mouseover', function() {
                        if(_rollOverHit){
                            var tname=_itens[this.id].resposta;
                            tname=tname.substring(0,tname.length-4);
                            console.log(tname);
                            tempOver = new createjs.Bitmap(caminho + tname+"_over.png");
                            tempOver.image.onload = function () { };
                            tempOver.x = _itens[this.id].posicaoResposta[0];
                            tempOver.y = _itens[this.id].posicaoResposta[1];
                            tempOver.regX = _itens[this.id].tamanhoResposta[0] / 2;
                            tempOver.regY = _itens[this.id].tamanhoResposta[1] / 2;
                            contenthit.addChild(tempOver);
                        }

                    });
                    hit.on('mouseout', function() {
                        if(_rollOverHit){
                            contenthit.removeChild(tempOver);
                        }

                    });

                    hit.regX = _itens[i].tamanhoResposta[0] / 2;
                    hit.regY = _itens[i].tamanhoResposta[1] / 2;
                    tempArray.push(_itens[i].resposta);

                    if (_parametros[13] != null) {

                        if (!modoEdicao) {
                            hitsPause[i] = new createjs.Bitmap(caminho + "pause_" + _itens[i].resposta);
                            hitsPause[i].image.onload = function () { };
                            contenthit.addChild(hitsPause[i]);
                            hitsPause[i].x = _itens[i].posicaoResposta[0];
                            hitsPause[i].y = _itens[i].posicaoResposta[1];
                            hitsPause[i].nome = _itens[i].resposta;
                            hitsPause[i].id = i;
                            hitsPause[i].pode = true;
                            hitsPause[i].visible = false;
                            hitsPause[i].regX = _itens[i].tamanhoResposta[0] / 2;
                            hitsPause[i].regY = _itens[i].tamanhoResposta[1] / 2;

                            hit.on("mousedown", function (evt) {
                                tocaSomRetorno(this.id, true);
                                cliqueAnterior = this.id;
                                console.log(this.id);

                            });

                            hitsPause[i].on("mousedown", function (evt) {
                                cliqueAnterior = -1;
                                tocaSomRetorno(this.id, false);
                            });
                        }
                    }
                }else{
                    /*se o botao nao é arrastavel adiciona um elemento vazio pra nao quebrar a contagem*/
                    hit=null;
                }
                hits.push(hit);
                if(_hitFalseHidden){
                    if (_itens[i].respondivel==false) {
                        hit.visible=false;
                    }
                }
            }
            if (modoEdicao) {
                if (_itens[i].respondivel) {
                    /*verifica se tem resposta senao nao faz o objeto nao ser arrastado*/
                    if (_itens[i].resposta.length > 0) {
                        hit.on("mousedown", function (evt) {
                            this.parent.addChild(this);
                            var global = content.localToGlobal(this.x, this.y);
                            this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                            this.regX = this.getBounds().width / 2;
                            this.regY = this.getBounds().height / 2;
                            criaLinha(this, figuras[this.id]);
                            selecionado = this;
                        });
                        hit.on("pressmove", function (evt) {
                            var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                            this.x = Math.floor(local.x);
                            this.y = Math.floor(local.y);
                            criaLinha(this, figuras[this.id]);
                        });
                        hit.on("pressup", function (evt) {
                            _itensTemp[fase][this.id].posicaoResposta[0] = this.x;
                            _itensTemp[fase][this.id].posicaoResposta[1] = this.y;
                            _itensTemp[fase][this.id].tamanhoResposta[0] = this.getBounds().width;
                            _itensTemp[fase][this.id].tamanhoResposta[1] = this.getBounds().height;
                            criaDebug();
                            console.log(this.id);
                        });

                    }
                }
            }
        }

        for (i = 0; i < _itens.length; i++) {
            if(_itens[i].perguntaParada){
                figuras[i] = new createjs.Bitmap(caminho + _itens[i].perguntaParada);
                figuras[i].perguntaParada = true;
                figuras[i].nome = _itens[i].perguntaParada;
            }else{
                figuras[i] = new createjs.Bitmap(caminho + _itens[i].pergunta);
                figuras[i].perguntaParada = false;
                figuras[i].nome = _itens[i].pergunta;
            }

            figuras[i].image.onload = function () { };
            content.addChild(figuras[i]);
            figuras[i].cursor = "pointer";
            figuras[i].x = 1500;
            figuras[i].y = 0;
            createjs.Tween.get(figuras[i]).to({ x: _itens[i].posicaoPergunta[0], y: _itens[i].posicaoPergunta[1] }, 500 + i * 80, createjs.Ease.backOut);
            figuras[i].px = _itens[i].posicaoPergunta[0];
            figuras[i].py = _itens[i].posicaoPergunta[1];
            figuras[i].id = i;
            figuras[i].pode = _itens[i].respondivel;
            figuras[i].respondivel = _itens[i].respondivel;
            figuras[i].arrastavel = false;
            figuras[i].nome = _itens[i].pergunta;
            figuras[i].resposta = _itens[i].resposta;
            figuras[i].regX = _itens[i].tamanhoPergunta[0] / 2;
            figuras[i].regY = _itens[i].tamanhoPergunta[1] / 2;

            if (_parametros[16] != null) {
                figuras[i].scaleX = _parametros[16];
                figuras[i].scaleY = _parametros[16];

                if (_itens[i].posicaoPergunta[2]) {
                    figuras[i].rotation = _itens[i].posicaoPergunta[2];
                }
                
            }
            /*verifica se tem resposta senao nao faz o objeto nao ser arrastado*/

            figuras[i].arrastavel = true;

            margemX += _itens[i].tamanhoPergunta[0] + 10;
            if (margemX > 1150) {
                margemX = _parametros[0];
                margemY += _itens[i].tamanhoPergunta[1] + 10;
            }

            if (modoEdicao) {
                figuras[i].on("mousedown", function (evt) {
                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                    this.regX = this.getBounds().width / 2;
                    this.regY = this.getBounds().height / 2;
                    if (this.pode) {
                        if (_parametros[8]) {
                            criaLinha(this, hits[0]);
                        } else {
                            criaLinha(this, hits[this.id]);
                        }
                    }
                    selecionado = this;
                });
                figuras[i].on("pressmove", function (evt) {
                    var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                    this.x = Math.floor(local.x);
                    this.y = Math.floor(local.y);
                    if (this.pode) {
                        if (_parametros[8]) {
                            criaLinha(this, hits[0]);
                        } else {
                            criaLinha(this, hits[this.id]);
                        }
                    }
                });
                figuras[i].on("pressup", function (evt) {
                    _itensTemp[fase][this.id].posicaoPergunta[0] = this.x;
                    _itensTemp[fase][this.id].posicaoPergunta[1] = this.y;
                    _itensTemp[fase][this.id].tamanhoPergunta[0] = this.getBounds().width;
                    _itensTemp[fase][this.id].tamanhoPergunta[1] = this.getBounds().height;
                    criaDebug();
                });
            } else {
                figuras[i].on("mousedown", function (evt) {
                    if (this.arrastavel && inicio1) {
                        this.parent.setChildIndex(this, this.parent.getNumChildren() - 1);
                        var global = content.localToGlobal(this.x, this.y);
                        this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
                        if (_parametros[14] != null) {
                            this.scaleX = _parametros[14];
                            this.scaleY = _parametros[14];
                        } else {
                            this.scaleX = 1;
                            this.scaleY = 1;
                        }
                    }

                    if (inicio1 && _parametros[13] == null) {
                        tocaSom(this.id, false);
                    }
                });

                figuras[i].on("pressmove", function (evt) {
                    if(this.perguntaParada==false){
                        if (this.arrastavel && inicio1) {
                            var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
                            this.x = local.x;
                            this.y = local.y;
                        }
                    }
                });
                figuras[i].on("pressup", function (evt) {
                    /*se for sonoro para o som*/
                    if(this.perguntaParada){
                        inicio1 = false;
                        proximaFase();
                    }else if (this.arrastavel && inicio1) {
                        var volta = true;
                        var colidiu = false;
                        var checkSom = true;
                        if (_parametros[13] == true) {
                            checkSom = false;
                        }
                        console.log(hits.length);
                        var i;
                        var colisao;
                        for (i = 0; i < hits.length; i++) {
                            if (_colisaoBox) {
                                colisao = ndgmr.checkRectCollision(hits[i], this);
                            } else {
                                colisao = ndgmr.checkPixelCollision(hits[i], this, 0.1, true);
                            }

                            if (colisao) {
                                if (sonsTocados[i] == true) {
                                    checkSom = true;
                                }
                                colidiu = true;

                                if (hits[i].pode && this.pode) {
                                    if (hits[i].nome == this.resposta) {
                                        if (checkSom == true) {
                                            volta = false;
                                            sons[0].play();
                                            this.pode = false;
                                            this.arrastavel = false;
                                            if (!_parametros[8]) {
                                                hits[i].pode = false;
                                            }
                                            /* troca imagem*/
                                            if (_parametros[12] != null) {
                                                var imgTemp = new createjs.Bitmap(caminho + _parametros[12] + this.nome);
                                                console.log("nome da imagem nova:" + caminho + _parametros[12] + this.nome)

                                                imgTemp.image.onload = function () { };
                                                contentFixado.addChild(imgTemp);
                                                contentFixado.setChildIndex(imgTemp, this.id);
                                                console.log("layer=" + this.id);
                                                imgTemp.x = hits[i].x;
                                                imgTemp.y = hits[i].y;
                                                imgTemp.regX = hits[i].regX;
                                                imgTemp.regY = hits[i].regY;
                                                content.removeChild(this);
                                                if (_itens[i].posicaoResposta[2]) {
                                                    imgTemp.rotation = _itens[i].posicaoResposta[2];
                                                }
                                            } else {
                                                this.x = hits[i].x;
                                                this.y = hits[i].y;
                                                this.scaleX = 1;
                                                this.scaleY = 1;
                                                if (_itens[i].posicaoResposta[2]) {
                                                    this.rotation = _itens[i].posicaoResposta[2];
                                                }
                                                contentFixado.addChild(this);
                                            }
                                            /*remove o hit*/
                                            if (_parametros[8] == false) {
                                                contenthit.removeChild(hits[i]);
                                            }

                                            /*se for sonoro para o som*/
                                            if (_parametros[13] == true) {
                                                cliqueAnterior = -1;
                                                tocaSomRetorno(this.id, false);

                                            }
                                            i_acertos++;
                                            animaIco('certo', this.x, this.y);
                                            atualizaGui();
                                            count++;
                                            if (count >= pontosNecessarios) {
                                                inicio1 = false;
                                                proximaFase();
                                            }
                                            break;
                                        }
                                    }
                                }
                            }

                        }
                        if (volta) {
                            if (_parametros[16] != null) {
                                this.scaleX = _parametros[16];
                                this.scaleY = _parametros[16];
                            } else {
                                this.scaleX = 1;
                                this.scaleY = 1;
                            }


                            createjs.Tween.get(this).to({ x: this.px, y: this.py }, 500, createjs.Ease.backOut);
                            if (colidiu) {
                                i_erros++;
                                if (checkSom == false) {
                                    animaIco('erradoToqueSom', this.x, this.y);
                                } else {
                                    animaIco('errado', this.x, this.y);
                                }

                                atualizaGui();
                                sons[1].play();
                                if (i_erros > _parametros[6]+1) {
                                    Fim();
                                }
                            }
                        }
                    }
                });

}
}
}
function tocaSom(id, somInicio) {

    if (somInicio) {
        var sonzinho = new Audio(caminho + _parametros[15][0] + id + ".mp3");
        sonsHits.push(sonzinho);
        sonzinho.play();
        sonzinho.onended = function () {
            btSomFasePlay.visible = true;
            btSomFasePause.visible = false;
        }
    } else {
        if (_itens[id].som.length > 1) {
            var sonzinho = new Audio(caminho + _itens[id].som);
            sonsHits.push(sonzinho);
            sonzinho.play();
            sonsTocados[id] = true;
        }
    }
}
function tocaSomRetorno(id, toca) {
    if (toca) {
        paraTodosSons();
        if (cliqueAnterior >= 0) {
            console.log("clique anterior " + cliqueAnterior);
            hitsPause[cliqueAnterior].visible = false;
            hits[cliqueAnterior].visible = true;

        }

        hits[id].visible = false;
        hitsPause[id].visible = true;
        if (_itens[id].som.length > 1) {
            var sonzinho = new Audio(caminho + _itens[id].som);
            sonsHits.push(sonzinho);
            sonzinho.play();

            sonsTocados[id] = true;
            sonzinho.onended = function () {
                hits[id].visible = true;
                hitsPause[id].visible = false;
            }
        };
    } else {
        hits[id].visible = true;
        hitsPause[id].visible = false;
        paraTodosSons();

    }
}
function paraTodosSons() {
    for (var i = 0, len = sonsHits.length; i < len; i++) {
        sonsHits[i].pause();
    }
}
function criaLinha(obj1, obj2) {
    if (obj1 && obj2) {
        stage.removeChild(line);
        line = new createjs.Shape();
        stage.addChild(line);
        line.graphics.setStrokeStyle(2);
        line.graphics.beginStroke('red');
        line.graphics.moveTo(obj1.x, obj1.y);
        line.graphics.lineTo(obj2.x, obj2.y);
        line.graphics.endStroke();
    }
}
function criaDebug() {
    console.clear();

    var debugador = '';
    var i;
    var t;
    var j;

        //_itensTemp[fase][this.id].posicaoResposta[0]=this.x;

        if (_itensTemp.length > 1) {
            for (j = 0; j < _itensTemp.length; j++) {
                debugador += '\n';
                debugador += 'var itens' + (j + 1) + '=[';
                subItens(j);
            }
            debugador += '\n';
            debugador += 'var fases_' + idCanvas + '=[';
            for (j = 0; j < _itensTemp.length; j++) {
                debugador += 'itens' + (j + 1);
                if (j < _itensTemp.length - 1) {
                    debugador += ',';

                }
            }
            debugador += '];';

            debugador += '\n';
            debugador += 'var fundos_' + idCanvas + '=[';
            for (j = 0; j < idFundo.length; j++) {
                debugador += '"' + idFundo[j] + '"';
                if (j < idFundo.length - 1) {
                    debugador += ',';

                }
            }
            debugador += '];';

        } else {
            debugador = 'var itens' + (fase + 1) + '=[';
            debugador += '\n';
            subItens(fase);

            debugador += '\n';
            debugador += 'var fases=[itens' + (fase + 1);
            debugador += '];';
            debugador += '\n';
            debugador += 'var fundos=["' + idFundo;
            debugador += '"];';
        }

        function subItens(queFase) {
            for (i = 0; i < _itensTemp[queFase].length; i++) {
                debugador += '{pergunta:"' + _itensTemp[queFase][i].pergunta + '",tamanhoPergunta:[' + _itensTemp[queFase][i].tamanhoPergunta[0] + ',' + _itensTemp[queFase][i].tamanhoPergunta[1] + '],';
                debugador += 'resposta:"' + _itensTemp[queFase][i].resposta + '",respondivel:' + _itensTemp[queFase][i].respondivel + ',tamanhoResposta:[' + _itensTemp[queFase][i].tamanhoResposta[0] + ',' + _itensTemp[queFase][i].tamanhoResposta[1] + '],';
                debugador += 'posicaoResposta:[' + _itensTemp[queFase][i].posicaoResposta[0] + ',' + _itensTemp[queFase][i].posicaoResposta[1] + '],';
                debugador += 'posicaoPergunta:[' + _itensTemp[queFase][i].posicaoPergunta[0] + ',' + _itensTemp[queFase][i].posicaoPergunta[1] + '],';
                debugador += 'som:"' + _itensTemp[queFase][i].som + '"}';
                if (i < _itens.length - 1) {
                    debugador += ',';
                    debugador += '\n';
                } else {
                    debugador += '];';
                }
            }
        }
        console.log(debugador);
        /*
        pergunta:'bt1.png',
        tamanhoPergunta:[321,53],
        resposta:'hit1.png',
        tamanhoResposta:[321,53],
        posicaoResposta:[160,200]

        var fases=[itens1_od1,itens2_od1,itens3_od1,itens4_od1,itens5_od1,itens6_od1];
        var fundos=["f1.png","f2.png","f3.png","f4.png","f5.png","f6.png"];

        */
    }
    function reseta() {
        if (_parametros[9] != null) {
            fase = 0
            _itens = _itensTemp[fase];
            fundoAtual = idFundo[fase];
        }
        inicio1 = true;
        i_erros = 0;
        i_acertos = 0;
        count = 0;
        var w = 0;
        content.removeAllChildren();
        contenthit.removeAllChildren();
        contentFixado.removeAllChildren();
        montaFase();
        atualizaGui();
        stage.removeChild(texto_tempo);
        criaRelogio();
    }
    function animaTitulo(texto) {
        var tit = new createjs.Container();
        stage.addChild(tit);

        var txt = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#ffffff");
        txt.regY = 60;
        txt.textAlign = "center";

        var contorno = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#000000");
        contorno.regY = 60;
        contorno.textAlign = "center";
        contorno.outline = 7;


        tit.addChild(contorno);
        tit.addChild(txt);

        tit.x = -640;
        tit.y = 620;
        createjs.Tween.get(tit).to({ x: 640 }, 300, createjs.Ease.backOut).wait(2000).call(apagaTitulo);
    }
    function apagaTitulo() {
        stage.removeChild(this);
    }
    function animaIco(qual, b, c) {
        var ico;
        ico = new createjs.Bitmap(caminho + qual + ".png");
        console.log(caminho + qual + ".png");
        stage.addChild(ico);
        ico.x = b;
        ico.y = c;
        ico.regX = 155;
        ico.regY = 155;
        ico.scaleX = ico.scaleY = 0.1;
        createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut).wait(600).call(deleta);
    }
    function deleta() {
        stage.removeChild(this);
    }
    function proximaFase() {
        paraTodosSons();
        if (_parametros[9] != null) {
            if (fase < _itensTemp.length - 1) {
                fase++;
                count = 0;
                _itens = _itensTemp[fase];
                fundoAtual = idFundo[fase];
                if (_idioma == "espanhol") {
                    var mensagens = ["¡MUY BIEN!"];
                } else if (_idioma == "ingles") {
                    var mensagens = ["CONGRATULATIONS"];
                } else {
                    var mensagens = ["PARABÉNS"];
                }

                var msg = Math.floor(Math.random() * mensagens.length);
                animaTitulo(mensagens[msg]);
                createjs.Tween.get(content).wait(2000).call(montaFase);
            } else {
                Fim();
            }

        } else {
            Fim();
        }
    }
    function Fim() {

        calculaTempo = false;
        /*se for sonoro para o som*/
        if (_parametros[13] == true || _parametros[15] != null) {
            paraTodosSons();
        }

        var img;
        var bo;
        var continua = false;

        if (i_erros > _parametros[6]) {
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
            bo.regX = 292 / 2;
            bo.regY = 400 / 2;
            bo.x = _parametros[2];
            bo.y = 1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).wait(200).to({ y: _parametros[3] }, 1000, createjs.Ease.bounceOut);
            bo.on("mousedown", function (evt) {
                content.removeAllChildren();
                contenthit.removeAllChildren();
                contentFixado.removeAllChildren();
                stage.removeChild(this);
                reseta();
            });
        }
    }

    function collisionDetect(object1, object2) {
        var ax1 = object1.x;
        var ay1 = object1.y;
        var ax2 = object1.x + _parametros[4];
        var ay2 = object1.y + _parametros[5];

        var bx1 = object2.x;
        var by1 = object2.y;
        var bx2 = bx1 + _parametros[4];
        var by2 = by1 + _parametros[5];

        if (object1 == object2) {
            return false;
        }
        if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
            return true;
        } else {
            return false;
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
    function isScrolledIntoView(elem)
    {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();
        return ((elemBottom >= docViewTop) && (elemTop <= docViewBottom) && (elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    $(window).scroll(function() {    
        if(isScrolledIntoView($('#'+idCanvas)))
        {
            //update=true;
        } else{
            //update=false;
        }   
    });
    function ticker(event) {
        if(update){
            stage.update();
            if (calculaTempo) {
                if (rate > 60) {
                    rate = 0;
                    countTempo -= 1;
                    texto_tempo.text = countTempo + "s";
                    rate = 0;
                    if (countTempo < 1) {
                        calculaTempo = false;
                        stage.removeChild(texto_tempo);
                        i_erros = _parametros[6]+1;
                        Fim();
                    }
                }
                rate++;
            }
        }
    }
    function detectKeys() {
    }
    document.addEventListener("keydown", function (e) {
        console.log(e.keyCode);
        if (selecionado) {
            if (e.keyCode == 39) {
                selecionado.x += 1;
            }
            if (e.keyCode == 40) {
                selecionado.y += 1;
            }
            if (e.keyCode == 37) {
                selecionado.x -= 1;
            }
            if (e.keyCode == 38) {
                selecionado.y -= 1;
            }
        }

    });

};
