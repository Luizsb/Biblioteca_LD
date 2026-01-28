/*v2 com imagens*/
var AppJogoOd1=function(itens, idCanvas, idFundo, idBtiniciar,_btImg,_audioBt,_audioTit,_tamanhoTxtPergunta=30,_tamanhoTxtbt=30,_embaralha=true){
	var caminho="resources/image/",
	canvas, stage,
	content,
	c_balao,
	c_peao,
	count=0,
	ordem=0,
	itens,
	movimento=[[205,118],[307,132],[407,156],[380,258],[290,350],[230,466],[328,540],[430,520],[522,433],[600,350],[683,267],[760,186],[870,125],[966,183],[940,281],[882,370],[812,455],[790,560],[899,600],[999,600],[1113,590],[1141,494],[1140,388]],
	inicio1=true,
	clicavel=true,
	btinicia,
	resposta,
	gui,
	i_acertos=0,
	i_erros=0,
	facesPossiveis,
	piao,
	piaoSombra,
	moveCasas=0,
	dado,
	sombra,
	dica,
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];




	function paraDado(){
		var rand=Math.floor(Math.random()*facesPossiveis.length);
		dado.gotoAndStop(facesPossiveis[rand]+5);
		moveCasas=facesPossiveis[rand];
		movimentaPiao();

	}
	function voltaPeao(){

		if(moveCasas>1){

			moveCasas--;
			if(count>0){
				movimentaPiaoVolta();
			}
			if(ordem==0 || count==0){
				moveCasas=0;
				verificaFim();
				console.log(count);
			}

		}
	}
	function proximoMovimento(){
		console.log(count+ "movlengt:"+movimento.length);

		if(count>=movimento.length-1){
			console.log("fim");
			verificaFim();
		}else{
			if(moveCasas>1){

				moveCasas--;
				movimentaPiao();
			}else{
				if(ordem<itens.length){
					resposta=itens[ordem].certa;
					var tocaenunciado=new Audio(caminho+itens[ordem].pergunta[3]);
					tocaenunciado.play();


					if(_btImg){

						var balao = new createjs.Bitmap(caminho+"balao_tab_img.png");
						balao.image.onload = function(){};
						c_balao.addChild(balao);
						c_balao.y=720;
						c_balao.scaleX=c_balao.scaleY=0.15;
						createjs.Tween.get(c_balao).to({y:0},500,createjs.Ease.backOut).to({scaleX:1,scaleY:1},2000,createjs.Ease.backOut);

						var tit = new createjs.Bitmap(caminho+itens[ordem].pergunta[0]);
						tit.image.onload = function(){};
						tit.x=itens[ordem].pergunta[1];
						tit.y=itens[ordem].pergunta[2];
						c_balao.addChild(tit);
						if(_audioTit && itens[ordem].pergunta[3]){
							var btPlayTit=new createjs.Bitmap(play1);
							btPlayTit.image.onload = function(){};
							btPlayTit.x=itens[ordem].pergunta[1]-70;
							btPlayTit.y=itens[ordem].pergunta[2]+10;
							btPlayTit.musica=itens[ordem].pergunta[3];
							c_balao.addChild(btPlayTit);

							btPlayTit.on("mousedown", function() {
								this.image=play2;

								var sonzinho = new Audio(caminho+this.musica);
								sonzinho.play();
								sonzinho.obj=this;
								sonzinho.onended = function () {
									this.obj.image=play1;
								}

							});
						}

						var i;
						for(i=0;i<itens[ordem].opcoes.length;i++){
							console.log("quant");
							var bt=new createjs.Bitmap(caminho+itens[ordem].opcoes[i][0]);
							bt.image.onload = function(){};
							bt.x=itens[ordem].opcoes[i][1];
							bt.y=itens[ordem].opcoes[i][2];
							bt.n=itens[ordem].opcoes[i][0];

							if(_audioBt && itens[ordem].opcoes[i][3]){
								var btPlayBt=new createjs.Bitmap(play1);
								btPlayBt.image.onload = function(){};
								btPlayBt.musica=itens[ordem].opcoes[i][3];
								btPlayBt.x=itens[ordem].opcoes[i][1]-50;
								btPlayBt.y=itens[ordem].opcoes[i][2]+10;
								c_balao.addChild(btPlayBt);
								btPlayBt.on("mousedown", function() {
									this.image=play2;

									var sonzinho = new Audio(caminho+this.musica);
									sonzinho.play();
									sonzinho.obj=this;
									sonzinho.onended = function () {
										this.obj.image=play1;
									}

								});
							}
							

							c_balao.addChild(bt);
							bt.on("mousedown", function() {
								if(clicavel){
									clicavel=false;
									this.scaleX=this.scaleY=0.5;
									if(this.n==resposta){
										animaIco("certo",this.x+this.getBounds().width/2+50,this.y);
										sons[0].play();
										i_acertos++;
										createjs.Tween.get(this).to({scaleX:1,scaleY:1},400,createjs.Ease.backOut).wait(1000).call(
											function(){
												fecha_balao(false);
											}
											);
									}else{
										animaIco("errado",this.x+this.getBounds().width/2+50,this.y);
										sons[1].play();
									//moveCasas=3;
									i_erros++;
									if(i_erros>=itens.length){
										createjs.Tween.get(this).to({scaleX:1,scaleY:1},400,createjs.Ease.backOut).wait(1000).call(
											function(){
												fecha_balao(true);
											}
											);
									}else{
										createjs.Tween.get(this).to({scaleX:1,scaleY:1},400,createjs.Ease.backOut).wait(1000).call(
											function(){
												voltaPeao();
												fecha_balao(true);
											}
											);
									}
								}
							}
						});
						}



					}else{
						var balao = new createjs.Bitmap(caminho+"balao.png");
						balao.image.onload = function(){};
						balao.regX=485;
						c_balao.addChild(balao);
						c_balao.x=movimento[count][0];
						c_balao.y=movimento[count][1];
						c_balao.scaleX=c_balao.scaleY=0.15;
						createjs.Tween.get(c_balao).to({y:c_balao.y-100},500,createjs.Ease.backOut).to({x:640,y:120,scaleX:1,scaleY:1},2000,createjs.Ease.backOut);

						console.log(ordem);

						var tit = new createjs.Text(itens[ordem].pergunta, "bold "+_tamanhoTxtPergunta+"px VAG Rounded BT", "#000000");
						tit.textAlign = "center";
						tit.lineWidth=890;
						tit.y=18;
						var posicao=tit.getBounds().height+70;
						c_balao.addChild(tit);
						if(_embaralha){
							
							shuffle(itens[ordem].opcoes);
						}

						var i;
						for(i=0;i<itens[ordem].opcoes.length;i++){
							var bt=caixaTexto(itens[ordem].opcoes[i]);
							bt.y=posicao;
							bt.n=itens[ordem].opcoes[i];
							c_balao.addChild(bt);
							bt.on("mousedown", function() {
								if(clicavel){
									clicavel=false;
									this.scaleX=this.scaleY=0.5;
									if(this.n==resposta){
										animaIco("certo",this.x+this.getBounds().width/2+50,this.y);
										sons[0].play();
										i_acertos++;
										createjs.Tween.get(this).to({scaleX:1,scaleY:1},400,createjs.Ease.backOut).wait(1000).call(
											function(){
												fecha_balao(false);
											}
											);
									}else{
										animaIco("errado",this.x+this.getBounds().width/2+50,this.y);
										sons[1].play();
									//moveCasas=3;
									i_erros++;
									if(i_erros>=itens.length){
										createjs.Tween.get(this).to({scaleX:1,scaleY:1},400,createjs.Ease.backOut).wait(1000).call(
											function(){
												fecha_balao(true);
											}
											);
									}else{
										createjs.Tween.get(this).to({scaleX:1,scaleY:1},400,createjs.Ease.backOut).wait(1000).call(
											function(){
												voltaPeao();
												fecha_balao(true);
											}
											);
									}
								}
							}
						});
							posicao+=bt.altura+25;
							console.log(posicao);
						}
					}






				}else{
					console.log("fim");
					verificaFim();
				}
			}
		}

	}
	function fecha_balao(_erro){
		clicavel=true;
		c_balao.removeAllChildren();
		if(ordem>=movimento.length){
			verificaFim();
		}else if(ordem>=itens.length){
			verificaFim();
		}else{
			ordem++;
			if(_erro){
				moveCasas=0;
				proximoMovimento();
			}else{
				dado.gotoAndPlay("corre");
				createjs.Tween.get(dado).to({x:40,y:40},300,createjs.Ease.quadOut).to({x:40,y:150},300,createjs.Ease.quadIn).call(paraDado);
			}
		}

	}
	function movimentaPiao(){
		var px=movimento[count][0];
		var py=movimento[count][1];

		var px2=movimento[count+1][0];
		var py2=movimento[count+1][1];
		createjs.Tween.get(piao).to({guide:{ path:[px,py, px,py-100,px2,py2]}},300,createjs.Ease.linear);

		piaoSombra.x=px;
		piaoSombra.y=py;
		createjs.Tween.get(piaoSombra).to({x:px2,y:py2},300,createjs.Ease.linear).call(proximoMovimento);
		count++;
	}
	function movimentaPiaoVolta(){
		var px=movimento[count][0];
		var py=movimento[count][1];

		var px2=movimento[count-1][0];
		var py2=movimento[count-1][1];
		createjs.Tween.get(piao).to({guide:{ path:[px,py, px,py-100,px2,py2]}},150,createjs.Ease.linear);

		piaoSombra.x=px;
		piaoSombra.y=py;
		createjs.Tween.get(piaoSombra).to({x:px2,y:py2},150,createjs.Ease.linear).call(voltaPeao);
		count--;
	}
	function caixaTexto(texto){
		var txt = new createjs.Text(texto, "bold "+_tamanhoTxtbt+"px VAG Rounded BT", "#FF6600");
		txt.textAlign = "center";
		//txt.textBaseline = "middle"; 
		txt.lineWidth=850;

		var tamX=850;
		var tamY=txt.getBounds().height;

		var button = new createjs.Shape();
		button.graphics.beginLinearGradientFill(["#E1E0FE", "#E7ECF5"], [0, 1], 0, 0, 0, tamY);
		button.graphics.drawRoundRect(0,0,tamX,tamY,20);
		button.graphics.endFill();
		button.regX=tamX/2;
		button.regY=tamY/2;
		button.scaleY=1.3;
		txt.regY=tamY/2;
		//button.y=-15;

		var t = new createjs.Container();
		t.addChild(button);
		t.addChild(txt);
		t.altura=tamY;

		return t;

	}
	function animaIco(qual,b,c){
		var ico;
		ico = new createjs.Bitmap(caminho+qual+".png");
		c_balao.addChild(ico);
		ico.x = b;
		ico.y = c;
		ico.regX=150;
		ico.regY=150;
		ico.scaleX=ico.scaleY=0.1;
		createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut);
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
	function verificaFim(){
		var img;
		var bo;
		var continua=false;

		if(count>=movimento.length-1 && i_acertos>0){
			img=caminho+"positivo_od1.png";
			continua=true;
			sons[2].play();

			
		}else{
			img=caminho+"tentenovamente_od1.png";
			continua=true;
			sons[3].play();
		}

		if(continua){
			inicio1=false;

			bo = new createjs.Bitmap(img);
			bo.image.onload = function(){};
			bo.regX=bo.regY=210;
			bo.x=640;
			bo.y=1000;
			stage.addChild(bo);
			createjs.Tween.get(bo).wait(1000).to({y:350},1000,createjs.Ease.quadOut);
			bo.on("mousedown", function (evt) {
				facesPossiveis=[6,3,2,5,4,2];
				stage.removeChild(this);
				count=0;
				ordem=0;
				moveCasas=0;
				inicio1=true;
				clicavel=true;
				i_acertos=0;
				i_erros=0;
				piao.x=movimento[count][0];
				piao.y=movimento[count][1];
				piaoSombra.x=piao.x;
				piaoSombra.y=piao.y;
				sombra.visible=true;
				dado.visible=true;
				dica.scaleX=dica.scaleY=0.5;
				dica.x=100;
				createjs.Tween.get(dica).to({scaleX:1,scaleY:1},250,createjs.Ease.backOut);
			});


		}

	}
	function tick(event) {
		stage.update(event);
	}

	var index;
	var t;
	for (index in sons) {
		t = sons[index];
		sons[index] = new Audio(caminho + t);
	}

	canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	content = new createjs.Container();
	c_balao = new createjs.Container();
	c_peao = new createjs.Container();

	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;

	if(_embaralha){
		shuffle(itens);
		
	}

	var cenario = new createjs.Bitmap(caminho+idFundo);
	cenario.image.onload = function(){};

	stage.addChild(cenario);
	stage.addChild(content);
	stage.addChild(c_peao);


	piaoSombra = new createjs.Bitmap(caminho+"piaoSombra.png");
	piaoSombra.image.onload = function(){};
	piaoSombra.regX=56;
	piaoSombra.regY=112;
	c_peao.addChild(piaoSombra);

	piao = new createjs.Bitmap(caminho+"piao.png");
	piao.image.onload = function(){};
	piao.regX=56;
	piao.regY=112;
	piao.x=movimento[count][0];
	piao.y=movimento[count][1];
	piaoSombra.x=piao.x;
	piaoSombra.y=piao.y;
	c_peao.addChild(piao);


	sombra = new createjs.Bitmap(caminho+"sombra.png");
	sombra.image.onload = function(){};
	sombra.regX=272/2;
	sombra.regY=244/2;
	stage.addChild(sombra);
	sombra.x=130;
	sombra.y=300;
	sombra.alpha=0.75;

	var spriteDado = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"dado.png"],
		"frames": {"regX": 0, "height": 200, "count": 12, "regY": 0, "width": 200},
		"animations": {
			"idle": 6,
			"corre": [1, 6, "corre",1]
		}
	});
	dado = new createjs.Sprite(spriteDado, "idle");
	stage.addChild(dado);
	dado.x=40;
	dado.y=150;
	dado.on("mousedown", function() {
		if(inicio1){
			dica.x=-500;
			inicio1=false;
			dado.gotoAndPlay("corre");
			createjs.Tween.get(dado).to({x:40,y:40},300,createjs.Ease.quadOut).to({x:40,y:150},300,createjs.Ease.quadIn).call(paraDado);
		}

	});

	dica = new createjs.Bitmap(caminho+"popups.png");
	dica.image.onload = function(){};
	stage.addChild(dica);
	dica.x=-500;
	dica.y=20;

	btinicia = new createjs.Bitmap(caminho+idBtiniciar);
	btinicia.on("click", function() {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		stage.removeChild(this);
		dica.x=100;
		dica.scaleX=dica.scaleY=0.5;
		createjs.Tween.get(dica).to({scaleX:1,scaleY:1},250,createjs.Ease.backOut);

	});


	if(itens.length==4){
		facesPossiveis=[6,6,5,5];

	}else if(itens.length==5){
		facesPossiveis=[6,4,6,5,4];

	}else if(itens.length>=6){
		facesPossiveis=[6,3,2,5,4,2];

	}else{
		var balao = new createjs.Bitmap(caminho+"balao.png");
		balao.image.onload = function(){};
		balao.regX=485;
		c_balao.addChild(balao);
		c_balao.x=movimento[count][0];
		c_balao.y=movimento[count][1];
		c_balao.scaleX=c_balao.scaleY=0.15;
		createjs.Tween.get(c_balao).to({y:c_balao.y-100},500,createjs.Ease.backOut).to({x:640,y:120,scaleX:1,scaleY:1},2000,createjs.Ease.backOut);

		var tit = new createjs.Text("Jogo não tem perguntas suficientes para funcionar", "bold 50px VAG Rounded BT", "#000000");
		tit.textAlign = "center";
		tit.lineWidth=890;
		tit.y=18;
		var posicao=tit.getBounds().height+50;
		c_balao.addChild(tit);

	}
	var play1 = new Image();
	play1.src = caminho+"btplayer.png";

	var play2 = new Image();
	play2.src = caminho+"btplayer_pause.png";


	stage.addChild(btinicia);
	stage.addChild(c_balao);

	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(30);
	createjs.MotionGuidePlugin.install();


}