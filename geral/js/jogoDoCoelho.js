
var AppJogoDoCoelho = function (idCanvas, _btiniciar, _fundo, _itens, _audioEnunciado, _imagemGui, _idioma, _modoEdicao) {
  var canvas2,
    caminho = "resources/image/",
    stage2,
    fundo2,
    content2,
    telaEscolha2,
    perguntas2,
    dif2,
    cont_carro2 = [],
    contentgui,
    fumaca2 = [],

    update = false,
    btinicia2,
    seq = [0, 1, 2, 3, 4, 5, 6],
    respostas = [0, 1, 0, 1, 1, 0, 1],
    respX = [[990, 866], [920, null], [874, 875], [953, null], [806, null]],
    respY = [[460, 338], [218, null], [326, 362], [417, null], [132, null]],
    respR = [[135, 45], [45, null], [0, -90], [-45, null], [0, null]],
    posX = [226, 226, 428, 360, 229, 363, 294],
    posY = [95, 95, 95, 161, 295, 230, 228],
    count = 0,
    edgeOffset = 80,
    distanciaCoelho = 1280,
    coelho1,
    coelho2,
    bt = [],
    spriteSheet,
    spriteSheet2,
    i_acertos = 0,
    texto_certo,
    i_erros = 0,
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
    texto_errado;


  for (index in sons) {
    t = sons[index];
    sons[index] = new Audio(caminho + t);
  }

  canvas2 = document.getElementById(idCanvas);
  stage2 = new createjs.Stage(canvas2);
  fundo2 = new createjs.Container();
  content2 = new createjs.Container();
  contentgui = new createjs.Container();
  telaEscolha2 = new createjs.Container();

  createjs.Touch.enable(stage2);
  stage2.enableMouseOver(10);
  stage2.mouseMoveOutside = true;

  shuffle(seq);
  perguntas2 = new createjs.Container();

  stage2.addChild(fundo2);
  stage2.addChild(perguntas2);
  stage2.addChild(content2);
  stage2.addChild(contentgui);
  contentgui.visible = false;

  stage2.addChild(telaEscolha2);

  var btinicia = new createjs.Bitmap(caminho + _btiniciar);
  btinicia.image.onload = function () { };
  stage2.addChild(btinicia);
  btinicia.on("mousedown", function (evt) {
    var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
    stage2.removeChild(this);
    inicia2();
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", ticker2);
  });

  var cenario = new createjs.Bitmap(caminho + _fundo);
  cenario.image.onload = function () { };
  fundo2.addChild(cenario);

  gui = new createjs.Bitmap(caminho + _imagemGui);
  gui.image.onload = function () { };
  contentgui.addChild(gui);
  gui.x = 25;
  gui.y = 15;

  texto_tempo = new createjs.Text("0:00", "bold 40px VAG Rounded BT", "#000000");
  texto_tempo.x = 285;
  texto_tempo.y = 30;
  texto_tempo.textAlign = "center";
  contentgui.addChild(texto_tempo);

  texto_errado = new createjs.Text("0", "bold 40px VAG Rounded BT", "#ff0000");
  texto_errado.x = 277;
  texto_errado.y = 100;
  texto_errado.textAlign = "center";
  contentgui.addChild(texto_errado);

  texto_certo = new createjs.Text("0", "bold 40px VAG Rounded BT", "#5ab00b");
  texto_certo.x = 280;
  texto_certo.y = 167;
  texto_certo.textAlign = "center";
  contentgui.addChild(texto_certo);

  contentgui.x = 240;
  contentgui.y = 150;

  distanciaCoelho = distanciaCoelho / _itens.length;


  if (_modoEdicao) {


    var imgEditMode = new createjs.Bitmap(caminho + "modoEdicao.png");
    imgEditMode.image.onload = function () { };
    stage2.addChild(imgEditMode);
    setTimeout(function () { stage2.removeChild(imgEditMode); }, 3000);


    var bt1 = new createjs.Bitmap(caminho + "modoEdicao_bt1.png");
    bt1.image.onload = function () { };
    stage2.addChild(bt1);
    bt1.on("click", function () {
      if (count > 0) {
        count--;
        montaFase();
      }

    });

    var bt2 = new createjs.Bitmap(caminho + "modoEdicao_bt2.png");
    bt2.image.onload = function () { };
    stage2.addChild(bt2);
    bt2.x = 1180;
    bt2.on("click", function () {
      if (count < _itens.length - 1) {
        count++;
        montaFase();
      }
    });


  }



  stage2.update();
  setTimeout(function () { stage2.update(); }, 1000);


  function inicia2() {
    startTime = Date.now();
    spriteSheet = new createjs.SpriteSheet({
      framerate: 20,
      "images": ["resources/image/co1.png"],
      "frames": { "regX": 210, "height": 284, "count": 6, "regY": 142, "width": 425 },
      "animations": {
        "idle": 0,
        "pulaLoop": [0, 5, "pulaLoop", 0.5],
        "pula": [0, 5, "idle", 0.5]
      }
    });
    spriteSheet2 = new createjs.SpriteSheet({
      framerate: 20,
      "images": ["resources/image/co2.png"],
      "frames": { "regX": 210, "height": 284, "count": 6, "regY": 142, "width": 425 },
      "animations": {
        "idle": 0,
        "pulaLoop": [0, 5, "pulaLoop", 0.5],
        "pula": [0, 5, "idle", 0.5]
      }
    });
    coelho2 = new createjs.Sprite(spriteSheet2, "pulaLoop");
    coelho1 = new createjs.Sprite(spriteSheet, "pulaLoop");
    content2.addChild(coelho2);
    content2.addChild(coelho1);

    coelho2.x = -400;
    coelho2.y = 600;
    coelho2.scaleX = -0.75;
    coelho2.scaleY = 0.75;
    createjs.Tween.get(coelho2).to({ x: 650 }, 4000, createjs.Ease.linear).call(paraCoelho);

    coelho1.x = -400;
    coelho1.y = 610;
    coelho1.scaleX = -0.75;
    coelho1.scaleY = 0.75;
    createjs.Tween.get(coelho1).wait(1000).to({ x: 120 }, 2000, createjs.Ease.linear).call(paraCoelho);

    var balao = new createjs.Bitmap("resources/image/balaozinho.png");
    balao.image.onload = function () { };
    stage2.addChild(balao);

    balao.regX = 152;
    balao.regY = 300;
    balao.x = 800;
    balao.y = 550;
    balao.scaleX = balao.scaleY = 0;
    createjs.Tween.get(balao).wait(4000).to({ scaleX: 0.6, scaleY: 0.6 }, 500, createjs.Ease.backOut).wait(2000).call(apagaBalao);
    montaFase();
    update = true;
  }
  function montaFase() {
    var t = seq[count];
    perguntas2.removeAllChildren();

    var fig = new createjs.Bitmap(caminho + _itens[count].pergunta[0]);
    fig.image.onload = function () { };
    perguntas2.addChild(fig);
    fig.x = -500;
    fig.y = 250;
    fig.regX = _itens[count].pergunta[3] / 2;
    fig.regY = _itens[count].pergunta[4] / 2;
    createjs.Tween.get(fig).to({ x: _itens[count].pergunta[1], y: _itens[count].pergunta[2] }, 700, createjs.Ease.backOut);
    var w = 0;
    for (var i = 0; i < _itens[count].botoes.length; i++) {
      var extensao = _itens[count].botoes[i][0].split('.').pop();
      if (extensao == 'jpg' || extensao == 'png') {
        bt[w] = new createjs.Bitmap(caminho + _itens[count].botoes[i][0]);
        bt[w].image.onload = function () { };
      } else {
        bt[w] = textoContorno(_itens[count].botoes[i][0], _itens[count].botoes[i][3], _itens[count].botoes[i][4], _itens[count].botoes[i][6]);
        bt[w].tipoTexto = true;
      }

      perguntas2.addChild(bt[w]);
      bt[w].x = _itens[count].botoes[i][1];
      bt[w].y = _itens[count].botoes[i][2];
      bt[w].px = _itens[count].botoes[i][1];
      bt[w].py = _itens[count].botoes[i][2];
      bt[w].regX = _itens[count].botoes[i][3] / 2;
      bt[w].regY = _itens[count].botoes[i][4] / 2;
      bt[w].pode = true;
      bt[w].id = i;
      bt[w].alpha = 0;
      bt[w].resp = _itens[count].botoes[i][5];
      bt[w].scaleX = bt[w].scaleY = 0.01;
      createjs.Tween.get(bt[w]).wait(w * 50 + 600).to({ scaleX: 1, scaleY: 1, alpha: 1 }, 300, createjs.Ease.backOut);


      if (_modoEdicao) {
        /*verifica se tem resposta senao nao faz o objeto nao ser arrastado*/

        fig.on("mousedown", function (evt) {

          var global = content2.localToGlobal(this.x, this.y);
          this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
          this.regX = this.getBounds().width / 2;
          this.regY = this.getBounds().height / 2;
        });
        fig.on("pressmove", function (evt) {
          var local = content2.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
          this.x = Math.floor(local.x);
          this.y = Math.floor(local.y);
        });
        fig.on("pressup", function (evt) {
          _itens[count].pergunta[1] = this.x;
          _itens[count].pergunta[2] = this.y;
          _itens[count].pergunta[3] = this.getBounds().width;
          _itens[count].pergunta[4] = this.getBounds().height;
          criaDebug();

        });

        bt[w].on("mousedown", function (evt) {

          var global = content2.localToGlobal(this.x, this.y);
          this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
          this.regX = this.getBounds().width / 2;
          this.regY = this.getBounds().height / 2;
        });
        bt[w].on("pressmove", function (evt) {
          var local = content2.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
          this.x = Math.floor(local.x);
          this.y = Math.floor(local.y);
        });
        bt[w].on("pressup", function (evt) {
          _itens[count].botoes[this.id][1] = this.x;
          _itens[count].botoes[this.id][2] = this.y;
          _itens[count].botoes[this.id][3] = this.getBounds().width;
          _itens[count].botoes[this.id][4] = this.getBounds().height;
          criaDebug();
          console.log(this.id);
        });



      } else {

        bt[w].on("mousedown", function (evt) {
          if (update) {
            this.scaleX = this.scaleY = 0.1;
            createjs.Tween.get(this).to({ scaleX: 0.85, scaleY: 0.85 }, 300, createjs.Ease.backOut);
            if (this.resp) {
              animaIco('certo', this.px - 150, this.py);
              sons[0].play();
              i_acertos++;
              texto_certo.text = i_acertos;
              createjs.Tween.get(this).wait(1500).call(proxima1);
            } else {
              animaIco('errado', this.px - 150, this.py);
              sons[1].play();
              i_erros++;
              
              this.alpha = 0.3;
              createjs.Tween.get(this).wait(1500).call(proxima2);
            }
            update = false;
          }
        });
      }
      w++;
    }

  }
  function textoContorno(texto, tamanhoX, tamanhoY, _tamanhoFonte) {

    var txt = new createjs.Text(texto, "bold " + _tamanhoFonte + "px VAG Rounded BT", "#ffffff");
    txt.regY = 60;
    txt.textAlign = "center";
    txt.lineWidth = tamanhoX;

    var contorno = new createjs.Text(texto, "bold " + _tamanhoFonte + "px VAG Rounded BT", "#000000");
    contorno.regY = 60;
    contorno.textAlign = "center";
    contorno.outline = 10;
    contorno.lineWidth = tamanhoX;

    var resp = new createjs.Container();

    resp.addChild(contorno);
    resp.addChild(txt);

    return resp;

  }
  function criaDebug() {
    console.clear();

    var debugador = '';
    var i;
    var t;
    var j;


    if (_itens.length > 1) {
      debugador += '\n';
      debugador += 'var itens=[';
      for (j = 0; j < _itens.length; j++) {
        debugador += '\n';
        debugador += '{botoes:[';
        subItens(j);
        if (j < _itens.length - 1) {
          debugador += '},';
          debugador += '\n';
        } else {
          debugador += '}';
        }
      }
      debugador += '\n';
      debugador += '];';


    } else {
      debugador = 'var itens=[{botoes:[';
      debugador += '\n';
      subItens(count);
      debugador += '}];';


    }


    function subItens(queFase) {
      for (i = 0; i < _itens[queFase].botoes.length; i++) {


        debugador += '["' + _itens[queFase].botoes[i][0] + '",' + _itens[queFase].botoes[i][1] + ',' + _itens[queFase].botoes[i][2] + ',' + _itens[queFase].botoes[i][3] + ',' + _itens[queFase].botoes[i][4] + ',' + _itens[queFase].botoes[i][5] + ']';
        if (i < _itens[queFase].botoes.length - 1) {
          debugador += ',';
          debugador += '\n';
        } else {
          debugador += '],';
        }
      }
      debugador += '\n';
      debugador += 'pergunta:["' + _itens[queFase].pergunta[0] + '",' + _itens[queFase].pergunta[1] + ',' + _itens[queFase].pergunta[2] + ',' + _itens[queFase].pergunta[3] + ',' + _itens[queFase].pergunta[4] + ']';
    }

    console.log(debugador);

  }


  function proxima1() {
    coelho1.gotoAndPlay("pula");
    createjs.Tween.get(coelho1).to({ x: coelho1.x + 100 }, 500, createjs.Ease.quadOut);
    count++;
    if (count >= _itens.length) {
      Fim2();
    } else {
      montaFase();
      habilita();
    }
  }
  function proxima2() {
    count++;
    if (count >= _itens.length) {
      Fim2();
    } else {
      coelho2.gotoAndPlay("pula");
      createjs.Tween.get(coelho2).to({ x: coelho2.x + 100 }, 500, createjs.Ease.quadOut).call(habilita);
      montaFase();
      habilita();
    }
  }
  function habilita() {
    update = true;
  }
  function paraCoelho() {
    this.gotoAndStop("idle");
  }
  function apagaBalao() {
    stage2.removeChild(this);

  }
  function randomiza() {
    var n = Math.floor(Math.random() * 500) + 500;
    return n;
  }

  function animaIco(qual, b, c) {
    var ico;
    ico = new createjs.Bitmap(caminho + qual + ".png");
    stage2.addChild(ico);
    ico.x = b;
    ico.y = c;
    ico.regX = 155;
    ico.regY = 155;
    ico.scaleX = ico.scaleY = 0.1;
    createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.backOut).wait(1500).call(apaga);
  }
  function apaga() {
    stage2.removeChild(this);
  }
  function Fim2() {
    texto_errado.text = i_erros;
    var img;
    var bo;
    var continua = false;
    perguntas2.removeAllChildren();
    contentgui.visible = true;
    if (i_erros > 0) {
      sons[3].play();
      img = caminho + "tentenovamente.png";
      continua = true;
    } else {
      sons[2].play();
      img = caminho + "positivo.png";
      continua = true;
    }
    if (continua) {
      bo = new createjs.Bitmap(img);
      bo.image.onload = function () { };
      bo.regX = bo.regY = 210;
      bo.x = 950;
      bo.y = 1000;
      stage2.addChild(bo);
      createjs.Tween.get(bo).wait(1000).to({ y: 250 }, 1000, createjs.Ease.backOut);
      bo.on("mousedown", function (evt) {
        stage2.removeChild(this);
        contentgui.visible = false;
        content2.removeAllChildren();
        count = 0;
        i_erros = 0;
        i_acertos = 0;
        inicia2();
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
  function ticker2(event) {
    stage2.update();
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
  function collisionDetect(object1, object2) {
    var ax1 = object1.x;
    var ay1 = object1.y;
    var ax2 = object1.x + edgeOffset;
    var ay2 = object1.y + edgeOffset;

    var bx1 = object2.x;
    var by1 = object2.y;
    var bx2 = bx1 + edgeOffset;
    var by2 = by1 + edgeOffset;

    if (object1 == object2) {
      return false;
    }
    if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1) {
      return true;
    } else {
      return false;
    }
  }

}