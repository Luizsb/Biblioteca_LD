  var AppLinhadoTempo=function(idCanvas,_itens, _quadrado, _linha,_fundos,_btiniciar,_distancia,_velocidadeX){
    var canvas,
    stage,
    content,
    content2,
    contentPlayer,
    jogoPausado=true,
    sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3","woosh.mp3"],
    caminho="resources/image/",
    player,
    playerCol,
    firstKey,
    velocidadeX=5,
    moveDirection,
    paredes,
    btInicio,
    iniciar=true,
    botoes=[],
    calculaTempo=false,
    erros,
    fase=0,
    obj=[],
    hit=[],
    pop=[],
    img=[],
    faixas=[],
    i_anterior=1,
    offsetTextos=80,
    botoesPos=[[540,640],[730,640]],
    fps,
    index;
    for (index in sons) {
      var t = sons[index];
      sons[index] = new Audio(caminho + t);
    }
    if(_velocidadeX){
      velocidadeX=_velocidadeX;
    }
    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage);
    contenttext = new createjs.Container();
    content = new createjs.Container();
    content2 = new createjs.Container();
    contentPlayer = new createjs.Container();

    stage.addChild(content);
    stage.addChild(content2);
    stage.addChild(contentPlayer);


    for(i=0;i<_fundos.length;i++){
      var fundo = new createjs.Bitmap(caminho+_fundos[i].fundoImg);
      fundo.image.onload = function(){};
      fundo.x=i*1280;

      content.addChild(fundo);

    }


    var linha = new createjs.Bitmap(caminho+_linha[0].linha);
    linha.image.onload = function(){};
    content2.addChild(linha);

    var playerSheet = new createjs.SpriteSheet({
      animations: {
        stand: [0],
        walk: [1, 12]
      },
      images: [caminho+"boneco.png"],
      frames: [[0,0,170,256,0,95,222],[172,0,188,256,0,104,222],[362,0,188,256,0,104,222],[552,0,188,256,0,104,222],[742,0,188,256,0,104,222],[0,258,188,256,0,104,222],[190,258,188,256,0,104,222],[380,258,188,256,0,104,222],[570,258,188,256,0,104,222],[760,258,188,256,0,104,222],[0,516,188,256,0,104,222],[190,516,188,256,0,104,222],[380,516,188,256,0,104,222],[172,0,188,256,0,104,222]]
    });
    player = new createjs.Sprite(playerSheet, "stand");


    contentPlayer.addChild(player);
    contentPlayer.x=-100;
    contentPlayer.y=560;
    contentPlayer.scaleX=-1;

    playerCol = new createjs.Bitmap(caminho+"quad.png");
    playerCol.image.onload = function(){};
    playerCol.regX=41;
    playerCol.regY=41;
    playerCol.scaleX=0.5;
    playerCol.scaleY=0.5;
    playerCol.visible=false;
    contentPlayer.addChild(playerCol);

    for(i=0;i<2;i++){
      botoes[i] = new createjs.Bitmap(caminho+"botao_flecha"+(i+1)+".png");
      botoes[i].image.onload = function(){};
      botoes[i].regX=80;
      botoes[i].regY=80;
      botoes[i].scaleX=0.75;
      botoes[i].scaleY=0.75;
      botoes[i].id=i+1;
      botoes[i].x=botoesPos[i][0];
      botoes[i].y=900;
      stage.addChild(botoes[i]);
      botoes[i].on("mousedown", function() {
        this.scaleX=0.75;
        this.scaleY=0.75;
        this.alpha=0.5;
        moveDirection=this.id;

      });
      botoes[i].on("pressup", function() {
        createjs.Tween.get(this).to({alpha:1,scaleX:0.75,scaleY:0.75},250,createjs.Ease.backOut);
        moveDirection=0;
      });
    }

    for(i=0;i<_itens.length;i++){
      hit[i] = new createjs.Bitmap(caminho+_quadrado[0].quadrado2);
      hit[i].image.onload = function(){};
        //hit[i].regX=110;
        hit[i].scaleX=0.5;
        hit[i].id=i+1;
        hit[i].colide=true;
        hit[i].visible=false;
        hit[i].x=_itens[i].posicaoImagem[0]+50;
        hit[i].y=0;

        faixas[i] = new createjs.Bitmap(caminho+_quadrado[0].quadrado2);
        faixas[i].image.onload = function(){};
         //faixas[i].regX=110;
         faixas[i].scaleX=0.01;
         faixas[i].alpha=0.01;
         faixas[i].id=i+1;
         faixas[i].colide=true;
         faixas[i].x=_itens[i].posicaoImagem[0]+50;
         faixas[i].y=0;
         console.log(_quadrado[0].quadrado2);

         content2.addChild(hit[i]);
         content2.addChild(faixas[i]);
       }

       for(i=0;i<_itens.length;i++){

         img[i] = new createjs.Bitmap(caminho+_itens[i].imagem);
         img[i].image.onload = function(){};
         img[i].colide=true;
         img[i].x=_itens[i].posicaoImagem[0];
         img[i].y=_itens[i].posicaoImagem[1];

         content2.addChild(img[i]);

       }
       for(i=0;i<_itens.length;i++){

         pop[i] = new createjs.Bitmap(caminho+_itens[i].imagemPopUp);
         pop[i].image.onload = function(){};
         pop[i].regX=80;
         pop[i].regY=280;
         pop[i].scaleX=0.01;
         pop[i].scaleY=0.01;
         pop[i].alpha=0.01;
         pop[i].id=i+1;
         pop[i].colide=true;
         pop[i].visible=true;
         pop[i].x=_itens[i].posicaoPopup[0];
         pop[i].y=_itens[i].posicaoPopup[1];

         content2.addChild(pop[i]);
       }

       var btinicio = new createjs.Bitmap(caminho+_btiniciar);
       btinicio.image.onload = function(){};
       stage.addChild(btinicio);
       btinicio.on("mousedown", function() {
        createjs.Ticker.setFPS(50);
        createjs.Ticker.addEventListener("tick", ticker);
        stage.removeChild(this);
        calculaTempo=false;
        jogoPausado=false;
        createjs.Tween.get(contentPlayer).to({x:100},400,createjs.Ease.linear).call(paradeAndar);
        player.gotoAndPlay("walk");

        for(i=0;i<2;i++){

          createjs.Tween.get(botoes[i]).wait(i*250).to({y:botoesPos[i][1]},400,createjs.Ease.backOut);


        }
      });
       fps = new createjs.Text("fps", "30px arial", "#000000");



       stage.update();
       setTimeout(function(){stage.update();}, 2000);

       function paradeAndar(){
        player.gotoAndPlay("stand");
      }
      function ticker(event){
        fps.text=Math.floor(createjs.Ticker.getMeasuredFPS());
        stage.update();

        if(!jogoPausado){

          if(moveDirection==1 && contentPlayer.x>90){
            if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
            contentPlayer.scaleX=1;
            contentPlayer.x-=velocidadeX;
            content.x+=velocidadeX/5;
            content2.x+=velocidadeX/_distancia;

          }else if(moveDirection==2 && contentPlayer.x<1280){
            if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
            contentPlayer.scaleX=-1;
            contentPlayer.x+=velocidadeX;
            content.x-=velocidadeX/5;
            content2.x-=velocidadeX/_distancia;
          }
          if(moveDirection==0){
            player.gotoAndStop("stand");

          }

          var i;
          for(i=0;i<hit.length;i++){

            var collision = ndgmr.checkRectCollision(playerCol,hit[i]);
            if(collision && hit[i].colide){
             console.log("teste"+i);
             hit[i].colide=false;
             sons[0].play();
             hit[i_anterior].colide=true;
             createjs.Tween.get(faixas[i],{override:true}).to({scaleX:1,alpha:0.75},800,createjs.Ease.backOut);
             createjs.Tween.get(faixas[i_anterior],{override:true}).to({scaleX:0.01,alpha:0.01},200,createjs.Ease.backOut);

             createjs.Tween.get(pop[i],{override:true}).to({scaleX:1,scaleY:1,alpha:1},150,createjs.Ease.backOut);
             createjs.Tween.get(pop[i_anterior],{override:true}).to({scaleX:0.01,scaleY:0.01,alpha:0.01},100,createjs.Ease.backOut);
             i_anterior=i;

           }
         }

       }

     }
   }
