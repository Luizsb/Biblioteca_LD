/*
V2.5
Adicionado som no final da resposta

Aumentei numero de erros pra 4

Adicionado var som para caso tenha enunciado em mp3
Adicionada opção pra sequencia de botoes unica pra cada pergunta(opcional)
Adicionada resposta imagem para pergunta texto

*/
var AppQuiz=function(idCanvas,
  fundoID,
  tamanhoBotao,
  margem,
  espacamento,
  areaParaBotoes,
  posicaoIconeCertoErrado,
  posicaoPergunta,
  tempoLeituraResposta,
  larguraPergunta,
  tamanhoTextoPergunta,
  tamanhoTextoBotao,
  respostaCerta,
  mostraFeedback,
  _itens,
  arrayBotoes,
  escondePontosFinais,
  imagemGui,
  _naoEmbaralhar,
  _enunciado,
  _btiniciar,
  _naoEmbaralharPergunta
  ){
  var gameID,
  btdicas,
  dicas,
  caminho="resources/image/",
  canvas,
  rel = [],
  stage,
  conta,
  botoes,
  icones_associar,
  count = 0,
  seq = [],
  inicio_associar = false,
  gui,
  podeArrastar=true,
  i_acertos = 0,
  i_erros = 0,
  fig=[],
  figA=[],
  sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3", "pop.mp3"],
  delayGeral=1500,
  tempBts=[],
  margemX=margem[0],
  margemY=margem[1],
  relationsGeral={};
  var enunParado;
  var audioEnunciado;


  function ticker(event) {
    stage.update();
  }
  function criaGui() {
    gui = new createjs.Container();
    stage.addChild(gui);
    gui.x = 800;
    gui.y = 270;

    var img;
    if(imagemGui){
      img=imagemGui;
    }else{
      img="gui.png";
    }


    var _gui = new createjs.Bitmap(caminho+img);
    _gui.image.onload = function () {};


    var txt_a = new createjs.Text(i_acertos, "40px VAG Rounded BT", "#000000");
    txt_a.textAlign = "left";
    txt_a.x = 215;
    txt_a.y = 25;

    var txt_e = new createjs.Text(i_erros, "40px VAG Rounded BT", "#b10000");
    txt_e.textAlign = "left";
    txt_e.x = 220;
    txt_e.y = 100;

    gui.addChild(_gui);
    gui.addChild(txt_a);
    gui.addChild(txt_e);

  }
  function criaBts() {

    botoes.removeAllChildren();

    var i;
    tempBts=[];
    margemX=margem[0];
    margemY=margem[1];

    if(arrayBotoes){
      if(_naoEmbaralhar){

      }else{
        shuffle(_itens[count].botao);
      }

      for(i = 0; i < _itens[count].botao.length; i++){
        console.log("qual"+i);
        configuraBts(i,_itens[count].botao[i]);
      }

    }else{
      shuffle(_itens);
      for(i = 0; i < _itens.length; i++){
        if(tempBts.indexOf(_itens[i].botao)>-1){
          continue;
        }
        configuraBts(i,_itens[i].botao);
      }
    }




  }
  function configuraBts(i,nome){
    var extensao=nome.split('.').pop();

    var bt;
    if(extensao=='jpg' || extensao=='png'){
      bt = new createjs.Bitmap(caminho+nome);
      bt.image.onload = function () {};
      bt.tipo="imagem";
      bt.regX=tamanhoBotao[0]/2;
      bt.regY=tamanhoBotao[1]/2;
    }else{
      bt = caixaTexto(nome);
      bt.tipo="texto";
    }

    bt.x = bt.px = margemX;
    bt.y = 900;
    bt.py = margemY;

    createjs.Tween.get(bt).wait(i*100).to({y:margemY},300,createjs.Ease.backOut);


    margemX+=tamanhoBotao[0]+espacamento;
    if(margemX>margem[0]+areaParaBotoes){
      margemX=margem[0];
      margemY+=tamanhoBotao[1]+espacamento;
    }


    bt.pode=true;
    bt.id=caminho+nome;
    bt.name=nome;
    botoes.addChild(bt);
    tempBts.push(nome);

    bt.on("mousedown", function (evt) {
      if(inicio_associar){
        this.parent.addChild(this);
        var global = botoes.localToGlobal(this.x, this.y);
        this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
      }
    });

    bt.on("pressmove", function (evt) {
      if(inicio_associar){
        var local = botoes.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
        /*this.x = local.x;
        this.y = local.y;*/
      }
    });

    bt.on("pressup", function (evt) {
      if(inicio_associar){
        inicio_associar=false;
        var somparado=true;


        if(this.id == fig[count].certa){

          this.visible=false;
          var botaoTemp;
          /*cria outro botao, o certo no meio*/
          if(this.tipo=="imagem"){
            botaoTemp = new createjs.Bitmap(this.id);
            botaoTemp.image.onload = function () {};
            botaoTemp.regX=tamanhoBotao[0]/2;
            botaoTemp.regY=tamanhoBotao[1]/2;
          }else{
            botaoTemp = caixaTexto(this.name);
          }
          botaoTemp.x=this.x;
          botaoTemp.y=this.y;

          botoes.removeAllChildren();
          botoes.addChild(botaoTemp)

          i_acertos++;
          
          if(mostraFeedback){
            console.log("toca som de feedback: "+figA[count].resposta);
            
            /*ve se tem som no pra tocar*/
            var extensao=figA[count].resposta.split('.').pop();
            if(extensao=='mp3' || extensao=='wav'){
              var sompratocar=new Audio(figA[count].resposta);
              sompratocar.play();
              somparado=false;
              sompratocar.onended=function(){
                proxima();
                
              }

            }
            console.log('mostra feed');
            figA[count].x=fig[count].x;
            figA[count].y=fig[count].y;
            figA[count].scaleX=0.7;
            figA[count].scaleY=0.7;
            createjs.Tween.get(figA[count]).to({scaleX:1,scaleY:1},300,createjs.Ease.backOut);
            
            fig[count].y=-900;
            botoes.removeAllChildren();
          }
          if(this.tipo=='imagem'){
           popBolha(this.x+tamanhoBotao[0]/2,this.y+tamanhoBotao[1]/2);
         }else{
           popBolha(this.x,this.y);
         }
         if(somparado){
          createjs.Tween.get(this).wait(tempoLeituraResposta).call(proxima);
        }
        
        animaIco("certo",this.x,this.y-tamanhoBotao[1]/2);
        sons[0].play();
      } else {
       if(respostaCerta){
         figA[count].x=fig[count].x;
         figA[count].y=fig[count].y;
         figA[count].scaleX=0.7;
         figA[count].scaleY=0.7;
         if(somparado){
          createjs.Tween.get(figA[count]).to({scaleX:1,scaleY:1},300,createjs.Ease.backOut).wait(tempoLeituraResposta).call(proxima);
        }
        if(this.tipo=='imagem'){
         popBolha(this.x+tamanhoBotao[0]/2,this.y+tamanhoBotao[1]/2);
       }else{
         popBolha(this.x,this.y);
       }
       fig[count].y=-900;
     }else{
      if(somparado){
        createjs.Tween.get(this).wait(1500).call(proxima);
      }
      
    }

    i_erros++;
    sons[1].play();

    this.x=this.px;
    this.y=this.py;
    if(this.tipo=="imagem"){
      animaIco("errado",this.x,this.y-tamanhoBotao[1]/2);
    }else{
      animaIco("errado",this.x,this.y);
    }

  }
}
});
  }
  function formulaPergunta() {

    
    if(_itens[count].som){
      createjs.Tween.get(fig[count]).wait(200).to({y: posicaoPergunta[1], rotation: 0}, 400, createjs.Ease.backOut);
      audioEnunciado=new Audio(caminho+_itens[count].som);
      audioEnunciado.play();
      audioEnunciado.onended = function(){
        createjs.Tween.get(fig[count]).to({y: posicaoPergunta[1], rotation: 0}, 400, createjs.Ease.backOut).call(habilitaCliques);
      };
    }else{
      createjs.Tween.get(fig[count]).to({y: posicaoPergunta[1], rotation: 0}, 400, createjs.Ease.backOut).call(habilitaCliques);
    }

    if(typeof _itens[count].dica !== 'undefined'){

      btdicas = new createjs.Shape();
      btdicas.graphics.beginFill("black").drawCircle(0, 0, 40);
      btdicas.x = 1220;
      btdicas.y = 60;
      btdicas.aberto=false;
      stage.addChild(btdicas);

      btdicas.on("mousedown", function (evt) {
        if(!this.aberto){
          this.aberto=true;
          dicas = new createjs.Bitmap(caminho+_itens[count].dica);
          dicas.image.onload = function () {};
          dicas.regX = 640;
          dicas.regY = 360;
          dicas.scaleX = dicas.scaleY = 0.5;
          dicas.x = 1280;
          dicas.y = 0;
          stage.addChild(dicas);
          createjs.Tween.get(dicas).to({scaleX: 1, scaleY: 1,x:640,y:360}, 300, createjs.Ease.backOut);
          dicas.on("mousedown", function (evt) {
           stage.removeChild(this);
           btdicas.aberto=false;

         });
        }

      });


      var txt = new createjs.Text("?", "60px VAG Rounded BT", "#ffffff");
      txt.x=1205;
      txt.y=35;
      stage.addChild(txt);
    }
  }
  function habilitaCliques(){
    inicio_associar = true;
  }
  function proxima() {
    icones_associar.removeAllChildren();
    fig[count].y=-720;
    if(mostraFeedback || respostaCerta){
     figA[count].y=-900;
   }
   if (count < _itens.length-1) {
    count++;
    criaBts();
    formulaPergunta();
  } else {
    verificaFim();
  }

}

function textoContorno(texto){

  var txt = new createjs.Text(texto, tamanhoTextoPergunta+"px VAG Rounded BT", "#ffffff");

  txt.textAlign = "center";
  txt.lineWidth = larguraPergunta;

  var tamX=txt.getBounds().width+120;
  var tamY=txt.getBounds().height+80;
  txt.regY=tamY/2-40;

  offX=tamX/2;
  offY=tamY/2;

  var button = new createjs.Shape();
  button.graphics.beginLinearGradientFill(["#000000", "#000000"], [0, 1], 0, 0, 0, tamY);
  button.graphics.drawRoundRect(0,0,tamX,tamY,20);
  button.graphics.endFill();
  button.regX=tamX/2;
  button.regY=tamY/2;
  button.alpha=0.7;

  var t = new createjs.Container();

  t.addChild(button);
  t.addChild(txt);

  return t;

}

function caixaTexto(texto){

  var txt = new createjs.Text(texto, tamanhoTextoBotao+"px VAG Rounded BT", "#000000");
  txt.lineWidth=tamanhoBotao[0];
  var tamX=txt.getBounds().width;
  var tamY=txt.getBounds().height;


  txt.regY=tamY/2;

  txt.textAlign = "center";

  var button = new createjs.Shape();
  button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
  button.graphics.drawRoundRect(0,0,tamanhoBotao[0],tamanhoBotao[1],20);
  button.graphics.endFill();
  button.regX=tamanhoBotao[0]/2;
  button.regY=tamanhoBotao[1]/2;

  var t = new createjs.Container();
  t.addChild(button);
  t.addChild(txt);

  return t;

}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function verificaFim(rel) {
  var img;
  var bo;
  var continua = false;
  if(escondePontosFinais){
   /*esconde os pontos*/
 }else{
  criaGui();
}

if (i_erros >_itens.length/3) {
  img = caminho+"tentenovamente.png";
  continua = true;
  sons[3].play();

} else {
  img = caminho+"positivo.png";
  continua = true;
  sons[2].play();
}
if (continua) {
  inicio_associar = false;
  var i=0;
  botoes.removeAllChildren();
  bo = new createjs.Bitmap(img);
  bo.image.onload = function () {};
  bo.regX = bo.regY = 210;
  bo.x = 700;
  bo.y = 1000;
  stage.addChild(bo);
  createjs.Tween.get(bo).wait(100).to({y: 350}, 1000, createjs.Ease.backOut);
  bo.on("mousedown", function (evt) {
    stage.removeChild(gui);
    stage.removeChild(this);
    seq = [];
    inicio_associar = false;
    podeArrastar=true;
    count = 0;
    i_acertos = 0;
    i_erros = 0;
    criaBts(relationsGeral, delayGeral);
    formulaPergunta();
  });
}
}
function popBolha(px, py) {
  var bo = new createjs.Bitmap(caminho+"bolha_pop.png");
  bo.image.onload = function () {};
  bo.regX = bo.regY = 155;
  bo.scaleX = bo.scaleY = 0.5;
  bo.x = px;
  bo.y = py;
  stage.addChild(bo);
  createjs.Tween.get(bo).to({scaleX: 1, scaleY: 1}, 150, createjs.Ease.linear).call(deleta);
}
function animaIco(qual, b, c) {
  var ico;
  ico = new createjs.Bitmap(caminho + qual + ".png");
  stage.addChild(ico);
  ico.x = b;
  if(c<100){
    c=85;
  }
  ico.y = c;
  ico.regX = 315 / 2;
  ico.regY = 315 / 2;
  ico.scaleX = ico.scaleY = 0.1;
  createjs.Tween.get(ico).to({scaleX: 0.6, scaleY: 0.6}, 200, createjs.Ease.backOut).wait(1500).call(deleta);
}
function deleta() {
  stage.removeChild(this);
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

  return !!(ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1);
}
function deletaDica(){

}
canvas = document.getElementById(idCanvas);
stage = new createjs.Stage(canvas);
stage.enableMouseOver(10);

createjs.Touch.enable(stage);
stage.enableMouseOver(10);
stage.mouseMoveOutside = true;

var fundo = new createjs.Bitmap(caminho+fundoID);
fundo.image.onload = function () {};
stage.addChild(fundo);

conta = new createjs.Container();
botoes = new createjs.Container();
icones_associar = new createjs.Container();

stage.addChild(conta);
stage.addChild(botoes);
stage.addChild(icones_associar);


var index;
for (index in sons) {
  var t = sons[index];
  sons[index] = new Audio(caminho + t);
}

if(_naoEmbaralharPergunta){
 /*nao embaralha*/
 console.log("nao embaralhou");
}else{
  shuffle(_itens);

}


var i;
for(i = 0; i < _itens.length; i++){
  var extensao=_itens[i].pergunta.split('.').pop();


  if(extensao=='jpg' || extensao=='png'){
    fig[i] = new createjs.Bitmap(caminho+_itens[i].pergunta);
    fig[i].image.onload = function () {};
    fig[i].regX=1280/2;
    fig[i].regY=720/2;
  }else{
    fig[i] = textoContorno(_itens[i].pergunta);
  }
  if(mostraFeedback || respostaCerta){
    var extensao_resp=_itens[i].resposta.split('.').pop();
    if(extensao_resp=='jpg' || extensao_resp=='png'){
      figA[i]= new createjs.Bitmap(caminho+_itens[i].resposta);
      figA[i].image.onload = function () {};
      figA[i].regX=1280/2;
      figA[i].regY=720/2;
      figA[i].y = -900;
      figA[i].resposta = caminho+_itens[i].resposta;
    }else if(extensao_resp=='mp3' || extensao_resp=='wav'){
      var extensao_bt=_itens[i].botaoCerto.split('.').pop();
      if(extensao_bt=='jpg' || extensao_bt=='png'){
        figA[i]= new createjs.Bitmap(caminho+_itens[i].botaoCerto);
        figA[i].image.onload = function () {};
        figA[i].regX=tamanhoBotao[0]/2;
        figA[i].regY=tamanhoBotao[0]/2;
        figA[i].y = -900;
      }else{
        figA[i] = textoContorno(_itens[i].botaoCerto);
      }
      
      figA[i].y = -900;
      figA[i].resposta = caminho+_itens[i].resposta;
    }else{
      figA[i] = textoContorno(_itens[i].resposta);
      figA[i].y = -900;
      figA[i].resposta = caminho+_itens[i].resposta;

    }
  }


  fig[i].x = posicaoPergunta[0];
  fig[i].y = -900;
  if(arrayBotoes){
    fig[i].certa = caminho+_itens[i].botaoCerto;
  }else{
    fig[i].certa = caminho+_itens[i].botao;
  }

  fig[i].resposta = caminho+_itens[i].resposta;
  conta.addChild(fig[i]);
  conta.addChild(figA[i]);


}
var btinicia;
if(_btiniciar!=null){
  btinicia = new createjs.Bitmap(caminho+_btiniciar);
}else{
  btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
}

btinicia.image.onload = function () {};
stage.addChild(btinicia);

btinicia.on("mousedown", function (evt) {
  var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
  stage.removeChild(this);
  criaBts();
  formulaPergunta();
  if(_enunciado!=null){
    var somenunciado=new Audio(caminho+_enunciado);
    somenunciado.play();
  }


});





createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", ticker);


}
