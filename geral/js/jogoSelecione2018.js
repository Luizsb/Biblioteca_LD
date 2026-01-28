/*
v1.31
17/09/2021
posicao do icone certo ajustada pro canto esquerdo superior

v1.3
09/03/2020
-co clicar no titulo toca o som novamente caso tenha

12/11/2019
-adicionado botao tipo texto

jogo selecionar


*/
var AppJogoSelecionar=function(modoEdicao,idCanvas,idFundo,_btiniciar,_itens,_parametros,_enunciado,_escondeHit,contaPontos,_audioBotao,_tamanhoTextoBotao,_fullScreen,_trilha=null){
	var caminho="resources/image/",
	canvas,
	stage,
	content,
	contentFundo,
	fundoAtual,
	contenthit,
	contentFixado,
	audioIngredientes,
	sons = ["tambor.mp3", "erro.mp3", "parabens.mp3", "tentenovamente.mp3"],
	count=0,
	fase=_parametros.fase,
	botoes=[],
	figuras=[],
	figura,
	inicio1=false,
	edgeOffsetX=200,
	edgeOffsetY=200,
	btreseta,
	btinicia,
	positivo,
	i_erros=0,
	i_acertos=0,
	mostraLinha=false,
	audioOn,audioOff,
	line,
	pontosNecessarios=0,
	tempArray=[],
	txt_a,txt_e,
	index,
	texto_tempo,
	calculaTempo=false,
	countTempo=0,
	rate=0,
	botaoLoad,
	btFull,
	audioFase,
	musicafundo,
	tempoCertoErrado=200000;


	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
		console.log( sons[index]);
	}

	canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);
	contenthit = new createjs.Container();
	contentFixado = new createjs.Container();
	contentFundo = new createjs.Container();
	content = new createjs.Container();
	createjs.Touch.enable(stage);
	stage.addChild(contentFundo);



	stage.addChild(content);
	stage.addChild(contentFixado);
	stage.addChild(contenthit);



	if(_parametros.contaPontos){
		criaGui();
	}

	montaFase();

	if(_btiniciar!=null){
		btinicia = new createjs.Bitmap(caminho+_btiniciar);
	}else{
		btinicia = new createjs.Bitmap(caminho+"bt_iniciar_od4.png");
	}

	btinicia.image.onload = function(){};
	stage.addChild(btinicia);
	btinicia.on("click", function(e) {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		btinicia.visible=false;
		inicio1=true;
		criaRelogio();
		if(_trilha){
			musicafundo=new Audio(caminho+_trilha);
			musicafundo.play();
			musicafundo.loop=true;
		}

		if(typeof _enunciado !== 'undefined'){
			var enun=new Audio(caminho+_enunciado);
			enun.play();

		}
		audioFase=new Audio(caminho+_itens[fase].som);
		audioFase.play();

		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", ticker);
	});


	var imgFull1 = new Image();
	var imgFull2 = new Image();
	imgFull1.src = caminho+"btFullscreen.png";
	imgFull2.src = caminho+"btFullscreen2.png";
	btFull = new createjs.Bitmap(imgFull1).set({x:1150,y:600,scaleX:1,scaleY:1});
	if(_fullScreen){
		stage.addChild(btFull);

	}
	btFull.addEventListener("click",toggleFullScreen);

	botaoLoad = new createjs.Bitmap(caminho+"iconepasta.png");
	botaoLoad.image.onload = function(){};
	stage.update();
	setTimeout(function () { stage.update(); }, 1000);



	function criaRelogio(){
		if(_parametros.contaTempo!=null){
			if(_parametros.contaTempo[0]>0){
				countTempo=_parametros.contaTempo[0];
				texto_tempo = new createjs.Text(countTempo+"s", "bold "+_parametros.contaTempo[2]+"px VAG Rounded BT", _parametros.contaTempo[1]);
				texto_tempo.x=_parametros.contaTempo[3];
				texto_tempo.y=_parametros.contaTempo[4];
				texto_tempo.textAlign = "center";
				stage.addChild(texto_tempo);
				calculaTempo=true;
			}
		}
	}
	function criaGui(){
		var gui = new createjs.Container();
		stage.addChild(gui);

		var _gui = new createjs.Bitmap(caminho+"gui.png");
		_gui.image.onload = function(){};

		txt_a = new createjs.Text(i_acertos, "bold 40px VAG Rounded BT", "#000000");
		txt_a.textAlign = "left";
		txt_a.x=220;
		txt_a.y=25;

		txt_e = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#b10000");
		txt_e.textAlign = "left";
		txt_e.x=510;
		txt_e.y=25;

		gui.addChild(_gui);
		gui.addChild(txt_a);
		gui.addChild(txt_e);

	}
	function atualizaGui(){
		if(_parametros.contaPontos){
			txt_a.text=i_acertos;
			txt_e.text=i_erros;
		}
	}
	function montaFase(){
		inicio1=true;
		content.removeAllChildren();
		if(_parametros.limpaContainer!=null){
			if(_parametros.limpaContainer){
				contentFixado.removeAllChildren();
			}
		}else{
			contentFixado.removeAllChildren();
		}
		console.log(_itens);
		contentFundo.removeAllChildren();
		var fundo = new createjs.Bitmap(caminho+_itens[fase].fundo);
		fundo.image.onload = function(){};
		contentFundo.addChild(fundo);

		pontosNecessarios=0;
		tempArray=[];
		botoes=[];
		figuras=[];

		var extensao=_itens[fase].pergunta.split('.').pop();
		if(extensao=='jpg' || extensao=='png'){
			figura = new createjs.Bitmap(caminho+_itens[fase].pergunta);
			figura.image.onload = function(){};
			figura.regX=_itens[fase].tamanhoPergunta[0]/2;
			figura.regY=_itens[fase].tamanhoPergunta[1]/2;
		}else{
			figura = textoContorno(_itens[fase].pergunta,_itens[fase].tamanhoPergunta[0],_itens[fase].tamanhoPergunta[1]);
			figura.tipoTexto=true;
		}
		figura.x=-1280;
		figura.y=_itens[fase].posicaoPergunta[1];

		createjs.Tween.get(figura).to({x:_itens[fase].posicaoPergunta[0]},400,createjs.Ease.quadOut);


		if(modoEdicao){
			figura.on("mousedown", function (evt) {
				this.parent.addChild(this);
				var global = content.localToGlobal(this.x, this.y);
				this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
				if(figura.tipoTexto!=true){
					this.regX=this.getBounds().width/2;
					this.regY=this.getBounds().height/2;

				}
			});
			figura.on("pressmove", function (evt) {
				var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
				this.x = Math.floor(local.x);
				this.y = Math.floor(local.y);

			});
			figura.on("pressup", function (evt) {
				criaDebug();
			});

		}else{
			if(_itens[fase].som){
				figura.on("mousedown", function (evt) {
					audioFase.pause();
					audioFase=new Audio(caminho+_itens[fase].som);
					audioFase.play();

				});
			}
		}
		var i;
		for(i=0;i<_itens[fase].respostas.length;i++){
			if(_itens[fase].respostas[i][1]){
				if(contaPontos){
					pontosNecessarios=contaPontos[fase];
				}else{
					pontosNecessarios++;
				}
			}
			var extensao=_itens[fase].respostas[i][0].split('.').pop();
			if(extensao=='jpg' || extensao=='png'){
				botoes[i] = new createjs.Bitmap(caminho+_itens[fase].respostas[i][0]);
				botoes[i].image.onload = function(){};
				botoes[i].regX=_itens[fase].respostas[i][2][0]/2;
				botoes[i].regY=_itens[fase].respostas[i][2][1]/2;
			}else{
				botoes[i] = caixaTexto(_itens[fase].respostas[i][0],_itens[fase].respostas[i][2][0],_itens[fase].respostas[i][2][1]);
				botoes[i].tipoTexto=true;
			}

			content.addChild(botoes[i]);
			botoes[i].x=_itens[fase].respostas[i][3][0];
			botoes[i].y=_itens[fase].respostas[i][3][1];
			botoes[i].nome=_itens[fase].respostas[i][0];
			botoes[i].id=i;
			botoes[i].pode=true;
			botoes[i].answer=_itens[fase].respostas[i][1];


			tempArray.push(_itens[fase].respostas[i][0]);

			if(_escondeHit){
				botoes[i].alpha=0.01;
			}

			botoes[i].scaleX=0;
			botoes[i].scaleY=0;
			createjs.Tween.get(botoes[i]).wait(i*80).to({scaleX:1,scaleY:1},400,createjs.Ease.backOut);

			if(modoEdicao){
				botoes[i].on("mousedown", function (evt) {
					this.parent.addChild(this);
					var global = content.localToGlobal(this.x, this.y);
					this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
					if(this.tipoTexto!=true){
						this.regX=this.getBounds().width/2;
						this.regY=this.getBounds().height/2;
						console.log("teste");
					}else{

					}
				});
				botoes[i].on("pressmove", function (evt) {
					var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
					this.x = Math.floor(local.x);
					this.y = Math.floor(local.y);
				});
				botoes[i].on("pressup", function (evt) {
					criaDebug();
				});

			}else{

				botoes[i].on("mousedown", function (evt) {
					if(this.pode && inicio1){
						this.scaleX=0.75;
						this.scaleY=0.75;

					}
				});
				botoes[i].on("pressup", function (evt) {
					if(this.pode && inicio1){
						createjs.Tween.get(this).to({scaleX:1,scaleY:1},200,createjs.Ease.backOut);
						if(this.answer){

							if(_audioBotao){
								console.log("toca som"+this.nome);
								var sombotao=new Audio(caminho+this.nome.substring(0,this.nome.length-4)+".mp3");
								sombotao.play();
							}else{
								sons[0].play();
							}
							this.pode=false;

							count++;
							i_acertos++;
							animaIco("certo",this.x-this.regX/2,this.y-this.regY/2);
							if(count>=pontosNecessarios){
								setTimeout(proximaFase,1500);
								inicio1=false;
							}

							/* troca imagem*/
							if(_parametros.trocaImagem!=null){
								var imgTemp = new createjs.Bitmap(caminho+_parametros.trocaImagem+this.nome);
								console.log("nome da imagem nova:"+caminho+_parametros.trocaImagem+this.nome)

								imgTemp.image.onload = function(){};
								content.addChild(imgTemp);
								content.setChildIndex(imgTemp,this.id);
								console.log("layer="+this.id);
								imgTemp.x=this.x;
								imgTemp.y=this.y;
								imgTemp.regX=this.regX;
								imgTemp.regY=this.regY;
								content.removeChild(this);
							}



						}else{
							animaIco("errado",this.x-this.regX/2,this.y-this.regY/2);
							sons[1].play();
							i_erros++;
							if(i_erros>=_parametros.errosPermitidos){
								Fim();
							}
						}
						atualizaGui();
					}

				});
			}
		}


		content.addChild(figura);

	}
	function textoContorno(texto,tamanhoX,tamanhoY){

		var txt = new createjs.Text(texto, "bold "+_tamanhoTextoBotao+"px VAG Rounded BT", "#ffffff");
		txt.regY=60;
		txt.textAlign = "center";
		txt.lineWidth = tamanhoX;

		var contorno = new createjs.Text(texto, "bold "+_tamanhoTextoBotao+"px VAG Rounded BT", "#000000");
		contorno.regY=60;
		contorno.textAlign = "center";
		contorno.outline = 10;
		contorno.lineWidth = tamanhoX;

		var resp = new createjs.Container();

		resp.addChild(contorno);
		resp.addChild(txt);

		return resp;

	}
	function caixaTexto(texto,tamanhoX,tamanhoY){

		var txt = new createjs.Text(texto, _tamanhoTextoBotao+"px VAG Rounded BT", "#000000");
		txt.lineWidth=tamanhoX;
		var tamX=txt.getBounds().width;
		var tamY=txt.getBounds().height;
		txt.regY=tamY/2;
		txt.textAlign = "center";
		var button = new createjs.Shape();
		button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamanhoY);
		button.graphics.drawRoundRect(0,0,tamanhoX,tamanhoY,20);
		button.graphics.endFill();
		button.regX=tamanhoX/2;
		button.regY=tamanhoY/2;
		button.alpha=0.75;

		var t = new createjs.Container();
		t.addChild(button);
		t.addChild(txt);

		return t;

	}
	function criaDebug(){
		console.clear();
		var debugador='Copiar e colar dentro da fase correspondente';
		debugador+='\n';
		var i;
		var t;
		if(figura.tipoTexto){
			debugador+='{pergunta:"'+_itens[fase].pergunta+'",fundo:"'+_itens[fase].fundo+'"'+',tamanhoPergunta:['+_itens[fase].tamanhoPergunta[0]+','+_itens[fase].tamanhoPergunta[1]+'],';
		}else{
			debugador+='{pergunta:"'+_itens[fase].pergunta+'",fundo:"'+_itens[fase].fundo+'"'+',tamanhoPergunta:['+figura.getBounds().width+','+figura.getBounds().height+'],';
		}

		debugador+='posicaoPergunta:['+figura.x+','+figura.y+'],';
		debugador+='\n';
		debugador+='respostas:[';
		debugador+='\n';
		for(i=0;i<botoes.length;i++){
			if(botoes[i].tipoTexto){
				debugador+='["'+botoes[i].nome+'",'+_itens[fase].respostas[i][1]+',['+_itens[fase].respostas[i][2][0]+','+_itens[fase].respostas[i][2][1]+'],';
			}else{
				debugador+='["'+botoes[i].nome+'",'+_itens[fase].respostas[i][1]+',['+botoes[i].getBounds().width+','+botoes[i].getBounds().height+'],';
			}

			debugador+='['+botoes[i].x+','+botoes[i].y+']]';
			if(i<botoes.length-1){
				debugador+=',';
				debugador+='\n';
			}else{
				debugador+='],';
			}
		}
		debugador+='som:"'+_itens[fase].som+'"}';
		console.log(debugador);

	}
	function reseta(){
		fase=0;
		inicio1=true;
		i_erros=0;
		i_acertos=0;
		count=0;
		var w=0;
		content.removeAllChildren();
		contentFixado.removeAllChildren();
		montaFase();
		atualizaGui();
		stage.removeChild(texto_tempo);
		criaRelogio();
		audioFase=new Audio(caminho+_itens[fase].som);
		audioFase.play();
	}
	function animaIco(qual,b,c){
		var ico;
		ico = new createjs.Bitmap(caminho+qual+".png");
		content.addChild(ico);
		ico.x = b;
		if(c<100){
			c=100;
		}
		ico.y = c;
		ico.regX=155;
		ico.regY=270;
		ico.scaleX=ico.scaleY=0.1;
		createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut).wait(tempoCertoErrado).call(deleta);
	}
	function deleta(){
		content.removeChild(this);
	}
	function proximaFase(){
		if(fase<_itens.length-1){
			fase++;
			count=0;
			fundoAtual=idFundo[fase];
			createjs.Tween.get(content).wait(1000).call(montaFase);
			audioFase.pause();
			audioFase=new Audio(caminho+_itens[fase].som);
			audioFase.play();
			console.log(fase);
		}else{
			Fim();
		}

	}
	function Fim(){
		if(_trilha){
			musicafundo.pause();
		}
		calculaTempo=false;
		inicio1=false;
		var img;
		var bo;
		var continua=false;

		if(i_erros>=_parametros.errosPermitidos){
			img=caminho+"tentenovamente.png";
			continua=true;
			sons[3].play();
		}else{
			img=caminho+"positivo.png";
			continua=true;
			sons[2].play();
		}
		if(continua){
			inicio1=false;
			bo = new createjs.Bitmap(img);
			bo.image.onload = function(){};
			bo.regX=292/2;
			bo.regY=400/2;
			bo.x=_parametros.posicaoJoinha[0];
			bo.y=1000;
			stage.addChild(bo);
			createjs.Tween.get(bo).wait(200).to({y:_parametros.posicaoJoinha[1]},1000,createjs.Ease.bounceOut);
			bo.on("mousedown", function (evt) {
				if(_trilha){
					musicafundo.play();
				}
				content.removeAllChildren();
				contentFixado.removeAllChildren();
				stage.removeChild(this);
				reseta();
			});
		}
	}

	function collisionDetect(object1, object2){
		var ax1 = object1.x;
		var ay1 = object1.y;
		var ax2 = object1.x + _parametros.offsetColisao[0];
		var ay2 = object1.y + _parametros.offsetColisao[1];

		var bx1 = object2.x;
		var by1= object2.y;
		var bx2= bx1 + _parametros.offsetColisao[0];
		var by2= by1 + _parametros.offsetColisao[1];

		if(object1 == object2){
			return false;
		}
		if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1){
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
	function toggleFullScreen() {
		var videoElement = document.getElementById(idCanvas);


		if (!document.mozFullScreen && !document.webkitFullScreen) {
			btFull.image=imgFull1;
			if (videoElement.mozRequestFullScreen) {
				videoElement.mozRequestFullScreen();
			} else {
				videoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			btFull.image=imgFull2;
			if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else {
				document.webkitCancelFullScreen();
			}
		}


	}
	function ticker(event){
		stage.update();
		if(calculaTempo){
			if(rate>60){
				rate=0;
				countTempo-=1;
				texto_tempo.text=countTempo+"s";
				rate=0;
				if(countTempo<1){
					calculaTempo=false;
					stage.removeChild(texto_tempo);
					i_erros=1000;
					Fim();
				}
			}
			rate++;
		}
	}
};
