 /*
v1

Jogo sequencia certa


*/



var AppJogoSequenciaCerta=function(idCanvas,idFundo,_itens,_btiniciar,_enunciado,_idioma,_trilhaSonora,_trilha){
 'use strict';

 var caminho="resources/image/",
 stage,
 canvas,
 context,
 content,
 contentHud,
 contentObj,
 contentPlayer,
 hud,
 mouseCount=0,
 loopCount=0,
 i_acertos=0,
 i_erros=0,
 txt_score,
 txt_seq1,
 txt_seq2,
 txt_tempo,
 objsFase=[],
 objsGabarito=[],
 fase=0,
 count=0,
 rate=0,
 musica,
 bmpVolume,
 bmpVolume2,
 jogoAtivo=false,
 jogoFim=false,
 maozinha,
 player,
 player2,
 centro=1,
 hitVzio,
 pulando=false,
 trilha,
 temporizador,
 fumacinha,
 fundo,
 startTime,
 sons=["tambor.mp3","erro.mp3","somFinal.mp3","tentenovamente.mp3","clap.mp3","PARABENS.mp3"];



 setTimeout(render,100);


 function render(){

  var index;
  for (index in sons) {
    var t = sons[index];
    sons[index] = new Audio(caminho + t);
  }
  trilha=new Audio(caminho+_trilhaSonora);


  canvas = document.getElementById(idCanvas);
  stage = new createjs.Stage(canvas);
  stage.enableMouseOver(10);
  createjs.Touch.enable(stage);
  content = new createjs.Container();
  contentObj = new createjs.Container();
  contentPlayer = new createjs.Container();
  contentHud = new createjs.Container();


  fundo = new createjs.Bitmap(caminho+idFundo);
  fundo.image.onload = function(){};
  stage.addChild(fundo);




  stage.addChild(content);
  stage.addChild(contentObj);
  stage.addChild(contentHud);



  var btiniciar = new createjs.Bitmap(caminho+_btiniciar);
  btiniciar.image.onload = function(){};
  stage.addChild(btiniciar);
  btiniciar.on("mousedown", function (evt) {
    var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
    stage.removeChild(this);
    startTime = Date.now();
    montaFase();
    montaMusica();
    trilha.currentTime=0;
    trilha.play();
    trilha.volume=0.15;
    if(_trilha == true){
      trilha.loop = true;
    }

  });


  var playerSprite = new createjs.SpriteSheet({
    framerate: 20,
    images: [caminho+"mao.png"],
    frames: [[0,0,324,302,0,156.25,144.2],[326,0,304,277,0,150.25,133.2],[632,0,285,257,0,145.25,141.2],[0,304,198,227,0,89.25,117.19999999999999],[200,304,216,227,0,109.25,115.19999999999999],[418,304,249,230,0,137.25,123.19999999999999],[669,304,263,252,0,148.25,142.2],[0,558,271,257,0,151.25,142.2],[273,558,288,274,0,159.25,149.2],[632,0,285,257,0,145.25,141.2],[326,0,304,277,0,150.25,133.2]],
    animations: {
      "idle": 0,
      "tapa": [0, 10, "idle",1]
    }
  });

  player = new createjs.Sprite(playerSprite, "idle");
  player.scaleX=0.75;
  player.scaleY=0.75;

  contentPlayer.addChild(player);
  contentPlayer.x=640;
  contentPlayer.y=1200;
  stage.addChild(contentPlayer);


  var circle = new createjs.Shape();
  circle.graphics.beginFill("red").drawCircle(0, 0, 20);
  circle.alpha=0.01;
  contentPlayer.addChild(circle);


  stage.on("mousedown", function (evt) {
    if(jogoAtivo){
      player.gotoAndPlay("tapa");

      var local = contentPlayer.localToGlobal(circle.x, circle.y);
      console.log(local.x);
      console.log(local.y);
      if(contentObj.getObjectUnderPoint(local.x,local.y,0)){
        var t=contentObj.getObjectUnderPoint(local.x,local.y,0);

        t.visible=false;
        if(t.parent.nome==_itens[fase].sequenciaCerta[mouseCount]){
          console.log("acerto miseravi");
          animaIco("certo",objsGabarito[mouseCount].x+_itens[fase].offsetAcerto[0],objsGabarito[mouseCount].y+_itens[fase].offsetAcerto[1]);
          i_acertos++;
          txt_score.text=i_acertos*150;
          txt_seq1.text=i_acertos+" de "+_itens[fase].sequenciaCerta.length;
          sons[4].currentTime=0;
          sons[4].play();
        }else{
          animaIco("errado",objsGabarito[mouseCount].x+_itens[fase].offsetAcerto[0],objsGabarito[mouseCount].y+_itens[fase].offsetAcerto[1]);
          sons[1].currentTime=0;
          i_erros++;
          txt_seq2.text=i_erros+" de "+_itens[fase].errosPermitidos;
          sons[1].play();
        }
        mouseCount++;

        if(mouseCount>=_itens[fase].sequenciaCerta.length){
          jogoAtivo=false;
          temporizador=setTimeout(proximaFase, 800);
          contentPlayer.y=1200;
        }else if(i_erros==_itens[fase].errosPermitidos){
          jogoAtivo=false;
          temporizador=setTimeout(proximaFasePerdeu, 800);
          contentPlayer.y=1200;
        }
      }
    }
  });

  var spriteSheet = new createjs.SpriteSheet({
    framerate: 20,
    "images": [caminho+"fumaca.png"],
    "frames": {"regX": 0, "height": 200, "count": 20, "regY": 0, "width": 200},
    "animations": {
      "idle": 20,
      "fumaca1": [0, 9, "idle"],
      "fumaca2": [10, 19, "idle"]
    }
  });
  txt_tempo = new createjs.Text(" ", "bold 40px VAG Rounded BT", "#ffffff");
  txt_tempo.textAlign = "center";
  txt_tempo.x=490;
  txt_tempo.y=265;


  fumacinha = new createjs.Sprite(spriteSheet, "idle");
  stage.addChild(fumacinha);
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", ticker);
}
function montaMusica(){
  var btstop = new createjs.Bitmap(caminho+"bt_stop.png");
  btstop.image.onload = function(){};
  contentHud.addChild(btstop);
  btstop.x=640;
  btstop.y=5;

  var btplay = new createjs.Bitmap(caminho+"bt_play.png");
  btplay.image.onload = function(){};
  contentHud.addChild(btplay);
  btplay.x=640;
  btplay.y=5;
  btplay.onoff=false;
  btplay.on("mousedown", function (evt) {
    if(this.onoff){
      this.alpha=1;
      this.onoff=false;
      trilha.play();
    }else{
      this.onoff=true;
      this.alpha=0.01;
      trilha.pause();
    }
  });

}
function montaFase(){
  content.removeAllChildren();
  contentHud.removeAllChildren();
  mouseCount=0;
  i_erros=0;
  var somFase=new Audio(caminho+_itens[fase].som);
  somFase.play();


  jogoAtivo=true;
  createjs.Tween.get(contentPlayer).to({y:600},800,createjs.Ease.backOut);

  var fundo2 = new createjs.Bitmap(caminho+_itens[fase].fundo);
  fundo2.image.onload = function(){};
  content.addChild(fundo2);

  var hud = new createjs.Bitmap(caminho+"sequencer_hud.png");
  hud.image.onload = function(){};
  contentHud.addChild(hud);
  txt_score = new createjs.Text(i_acertos*150, "bold 30px VAG Rounded BT", "#ffffff");
  txt_score.textAlign = "center";
  txt_score.x=180;
  txt_score.y=50;
  contentHud.addChild(txt_score);

  txt_seq1 = new createjs.Text("0 de "+_itens[fase].sequenciaCerta.length, "30px VAG Rounded BT", "#ffffff");
  txt_seq1.textAlign = "center";
  txt_seq1.x=490;
  txt_seq1.y=20;
  contentHud.addChild(txt_seq1);

  txt_seq2 = new createjs.Text("0 de "+_itens[fase].errosPermitidos, "30px VAG Rounded BT", "#ffffff");
  txt_seq2.textAlign = "center";
  txt_seq2.x=490;
  txt_seq2.y=60;
  contentHud.addChild(txt_seq2);

  montaMusica();

  var fundoGabarito = new createjs.Bitmap(caminho+"sequencer_fundoGabarito.png");
  fundoGabarito.image.onload = function(){};
  content.addChild(fundoGabarito);
  fundoGabarito.x=1200;
  createjs.Tween.get(fundoGabarito).to({x:870},800,createjs.Ease.backOut);

  var i=0;
  objsGabarito=[];
  for(i=0;i<_itens[fase].sequenciaCerta.length;i++){
    objsGabarito[i] = new createjs.Bitmap(caminho+"seq_"+_itens[fase].sequenciaCerta[i]);
    objsGabarito[i].x =1200;
    createjs.Tween.get(objsGabarito[i]).wait(150*i).to({x:_itens[fase].offsetSequencia[0]},500,createjs.Ease.backOut);
    objsGabarito[i].y = _itens[fase].offsetSequencia[1]+i*_itens[fase].offsetSequencia[2];

    objsGabarito[i].scaleX = _itens[fase].offsetSequencia[3];
    objsGabarito[i].scaleY = _itens[fase].offsetSequencia[3];
    content.addChild(objsGabarito[i]);
  }
}
function proximaFase(){
  content.removeAllChildren();
  contentObj.removeAllChildren();
  contentHud.removeAllChildren();

  var fundoGabarito;
  var fundoGabarito2;

  fundoGabarito = new createjs.Bitmap(caminho+"sequencer_estrelinhas.png");
  fundoGabarito.image.onload = function(){};
  content.addChild(fundoGabarito);
  fundoGabarito.x=-1280;

  fundoGabarito2 = new createjs.Bitmap(caminho+"sequencer_reiniciar.png");
  fundoGabarito2.image.onload = function(){};
  content.addChild(fundoGabarito2);
  fundoGabarito2.x=-1280;
  fundoGabarito2.on("mousedown", function (evt) {
    fase=0;
    i_acertos=0;
    i_erros=0;
    count=0;
    montaFase();
    startTime = Date.now();
    trilha.currentTime=0;
    trilha.play();
    trilha.volume=0.15;

  });


  var txt_a = new createjs.Text(i_acertos*150, "bold 40px VAG Rounded BT", "#ffffff");
  txt_a.textAlign = "center";

  sons[2].play();
  if(fase<_itens.length-1){
    /*verifica se nao é o fim do jogo*/
    txt_a.x=630;
    txt_a.y=420;
    content.addChild(txt_a);

    var postemp=[[523,304],[630,265],[732,300]];
    var dif=_itens[fase].sequenciaCerta.length-mouseCount;

    var total=3-i_erros-dif;
    if(i_erros<0){
      total=0;
    }

    var i=0;
    for(i=0;i<total;i++){
      var star = new createjs.Bitmap(caminho+"s"+(i+1)+".png");
      star.image.onload = function(){};
      content.addChild(star);
      star.x=postemp[i][0];
      star.y=postemp[i][1];
      star.regX=65;
      star.regY=65;
      star.scaleX=0.01;
      star.scaleY=0.01;
      star.alpha=0.5;
      createjs.Tween.get(star).wait(800+i*100).to({scaleX:1,scaleY:1,alpha:1},350,createjs.Ease.backOut);

    }
    fase++;
    temporizador=setTimeout(montaFase, 4000);
    createjs.Tween.get(fundoGabarito).to({x:0},250,createjs.Ease.backOut);
  }else{
    /* fim do jogo*/
    if(_trilha == true){
      trilha.volume=0;
    }
    sons[5].play();
    txt_a.x=490;
    txt_a.y=420;
    contentHud.addChild(txt_tempo);
    content.addChild(txt_a);
    createjs.Tween.get(fundoGabarito2).to({x:0},250,createjs.Ease.backOut);
  }

}
function proximaFasePerdeu(){
  content.removeAllChildren();
  contentObj.removeAllChildren();
  contentHud.removeAllChildren();

  var fundoGabarito2;

  fundoGabarito2 = new createjs.Bitmap(caminho+"sequencer_tentenovamente.png");
  fundoGabarito2.image.onload = function(){};
  content.addChild(fundoGabarito2);
  fundoGabarito2.x=-1280;
  fundoGabarito2.on("mousedown", function (evt) {
    fase=0;
    i_acertos=0;
    i_erros=0;
    count=0;
    startTime = Date.now();
    montaFase();
    trilha.currentTime=0;
    trilha.play();
    trilha.volume=0.15;

  });
  createjs.Tween.get(fundoGabarito2).to({x:0},250,createjs.Ease.backOut);
  sons[3].play();
}
function criaLayer(qual){


  var i=0;
  for(i=0;i<_itens[fase].mapa[qual].length;i++){
    var t=parseInt(_itens[fase].mapa[qual][i]);



    if(t>0){
      var cont = new createjs.Container();
      var faixa = new createjs.Bitmap(caminho+_itens[fase].figuras[t-1][0]);
      faixa.regX=_itens[fase].figuras[t-1][1]/2;
      faixa.regY=_itens[fase].figuras[t-1][2]/2;
      cont.x = _itens[fase].posTiles[i];
      cont.y = 0;
      cont.addChild(faixa);
      cont.nome=_itens[fase].figuras[t-1][0];
      contentObj.addChild(cont);
      objsFase.push(cont);
    }
  }



}
function animaIco(qual,b,c){
  var ico;
  ico = new createjs.Bitmap(caminho+qual+".png");
  content.addChild(ico);
  ico.x = b;
  ico.y = c;
  ico.regX=155;
  ico.regY=155;
  ico.scaleX=ico.scaleY=0.1;
  createjs.Tween.get(ico).to({scaleX:0.35,scaleY:0.35},200,createjs.Ease.quadOut);
}

function ticker(){
  stage.update();
  if(jogoAtivo){
    contentPlayer.x+=(stage.mouseX-contentPlayer.x)/8;
    if(rate>_itens[fase].frequencia){
      rate=0;
      criaLayer(count);

      if(count==_itens[fase].mapa.length-1){
        count=0;
        if(_itens[fase].mapaLoopings>loopCount){
          loopCount=0;
          jogoAtivo=false;
          clearTimeout(temporizador);
          proximaFase();
          contentPlayer.y=1200;
        }else{
          loopCount++;
        }
      }else{
        count++;
      }


    }else{
      rate++;
    }
    if(objsFase.length>0){
      for (i = 0; i < objsFase.length; i++) {
        objsFase[i].y+=_itens[fase].velocidade;
        if(objsFase[i].y>800){
          removeLayerArvore(i);
        }
      }

    }
    checkTime();
  }

}
function removeLayerArvore(i) {
  contentObj.removeChild(objsFase[i]);
  objsFase.splice(i, 1);


}function removeLayers() {
  for (i = 0; i < objsFase.length; i++) {
    contentObj.removeChild(objsFase[i]);
    objsFase.splice(i, 1);
  }


}

function checkTime(){
  var timeDifference = Date.now() - startTime;
  var formatted = convertTime(timeDifference);
  txt_tempo.text = '' + formatted;
}
function convertTime(miliseconds) {
  var totalSeconds = Math.floor(miliseconds/1000);
  var minutes = Math.floor(totalSeconds/60);
  var seconds = totalSeconds - minutes * 60;
  if(seconds<10){
    seconds='0'+seconds;
  }
  return minutes + ':' + seconds;
}
}
