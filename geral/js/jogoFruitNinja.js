var AppFruit=function(idCanvas,idFundo,_itens,tamanhoRastro,tamanhoCarta,tamanhoTexto,frequencia,frutaCaindodeCima, errosPermitidos,_btiniciar,_enunciado=null,_mascara=null,_temVideo=false,_temSprite=false,mensagensFinais=null,mensagensFinaisSons=null,_musica=null){

	var canvas,
	pincel,
	colideId=-1,
	caminho='resources/image/',
	stage, 
	shape,
	content,
	telaPintura,
	icones,
	gravity = 0.1,
	text,
	grupo=[],
	direcoes=[[100,720,6,8],[300,720,2,11],[900,720,-6,9],[1100,720,-3,12]],
	rate=0,
	rateNormal=0,
	index=0,
	tempo=0,
	fase=0,
	guia,
	i_erros=0,
	i_erros_fase=0,
	i_acertos=0,
	acertosTotal=0,
	iniciar=false,
	jogaFrutas=false,
	desenhar=false,
	trail,
	fumacinha,
	texto_tempo,
	count=0,
	countTempo=0,
	duracaoVideo,
	videovaiprofim=false,
	MOUSE_POINTS = [],
	arraycores=[],
	enun,
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
	btinicia;

	var videoHTMLTag = document.getElementById('vidFundoIntro');
	var videoHTMLTagLoop = document.getElementById('vidFundoLoop');
	var videoHTMLTagFim = document.getElementById('vidFundoFim');

	function particulas1(tx,ty){
		var cont = new createjs.Container();
		var rotations=[0,90,120,180,270];
		var i;
		for(i=0;i<5;i++){
			var b = new createjs.Bitmap(caminho+"brilho2.png");
			b.image.onload = function(){};
			b.regX=575;
			b.regY=55;
			b.rotation=rotations[i];
			b.scaleX=b.scaleY=0.1;
			createjs.Tween.get(b).wait(i*60).to({scaleX:1,scaleY:1},800,createjs.Ease.quadOut).wait(500+i*120).to({alpha:0},1000,createjs.Ease.linear);
			cont.addChild(b);
		}
		var b = new createjs.Bitmap(caminho+"brilho1.png");
		b.image.onload = function(){};
		b.regX=107;
		b.regY=107;
		b.scaleX=b.scaleY=0.1;
		createjs.Tween.get(b).wait(60).to({scaleX:1,scaleY:1},800,createjs.Ease.backOut).wait(600).to({alpha:0},2000,createjs.Ease.linear);
		cont.addChild(b);

		var r=Math.random()*360;
		cont.rotation=r;
		createjs.Tween.get(cont).to({rotation:r+45},3000,createjs.Ease.linear).call(apaga);
		icones.addChild(cont);
		cont.x=tx;
		cont.y=ty;
	}

	function apaga(){
		icones.removeChild(this);
	}
	function collisionDetect(object1, object2){
		var ax1 = object1.x;
		var ay1 = object1.y;
		var ax2 = object1.x + 100;
		var ay2 = object1.y + 100;

		var bx1 = object2.x;
		var by1= object2.y;
		var bx2= bx1 + 100;
		var by2= by1 + 100;

		if(object1 == object2) 
		{
			return false;
		}
		if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1)
		{
			return true;
		} else {
			return false;
		}  
	}

	function ticker() {
		telaPintura.removeAllChildren();
		if(iniciar){
			if(jogaFrutas){
				if(rateNormal>60){
					countTempo-=1;
					texto_tempo.text=countTempo+"s";
					rateNormal=0;
				}
				rateNormal++;
				if(rate>frequencia){
					rate=0;
					var i=grupo.length;
					var qual=Math.floor(Math.random()*_itens[fase].figuras.length);
					if(_temSprite){
						var bob1 = new createjs.Sprite(_itens[fase].figuras[qual], "fumaca1");
						bob1.scaleX=bob1.scaleY=0.1;
						createjs.Tween.get(bob1).to({scaleX:1,scaleY:1},250,createjs.Ease.backOut);
						grupo[i]=bob1;
					}else{
						grupo[i] = new createjs.Bitmap(caminho+_itens[fase].figuras[qual]);
						grupo[i].image.onload = function(){};
						grupo[i].regX=tamanhoCarta[0]/2;
						grupo[i].regY=tamanhoCarta[1]/2;

					}
					grupo[i].pode=true;
					grupo[i].fatoralfa=2;


					if(_mascara){
						var t=Math.floor(Math.random()*arraycores.length);
						grupo[i].x = arraycores[t][0]; 
						grupo[i].y = arraycores[t][1]; 

					}else if(frutaCaindodeCima){
						grupo[i].x = Math.random()*800+200; 
						grupo[i].y = -tamanhoCarta[1]/2; 
					}else{
						grupo[i].y = direcoes[index][1];
						grupo[i].x = direcoes[index][0];
					}
					grupo[i].id = qual;
					grupo[i].name = _itens[fase].figuras[qual];

					if(_mascara){
						grupo[i].speedX = 0;
						grupo[i].speedY = 0;
						

					}else if(frutaCaindodeCima){
						grupo[i].speedX = 0;
						grupo[i].speedY = 0;

					}else{
						grupo[i].speedX = direcoes[index][2];
						grupo[i].speedY = direcoes[index][3];
					}

					content.addChild(grupo[i]);

					index++;
					if(index>3){
						index=0;
					}
					tempo+=1;
				}
				if(_itens[fase].tempo==0){
					if(count>=_itens[fase].certas.length){
						jogaFrutas=false;
						createjs.Tween.get(content).wait(4000).call(iniciaFase,[true],true);
						console.log('fim');
					}

				}else{
					if(countTempo<1){
						jogaFrutas=false;
						createjs.Tween.get(content).wait(4000).call(iniciaFase,[true],true);
						console.log('fim');
					}
				}
				rate++;
				
			}
			for(i=0;i<grupo.length;i++){
				var apagaitem=false;
				var correto=false;
				if(!_mascara){
					grupo[i].x += grupo[i].speedX;
					grupo[i].y -= grupo[i].speedY;
					if(frutaCaindodeCima){
						grupo[i].speedY -= 0.05;	
					}else{
						grupo[i].speedY -= gravity;	
					}
				}else{
					grupo[i].fatoralfa-=0.01
					grupo[i].alpha = grupo[i].fatoralfa;
				}

				var pt = content.globalToLocal(stage.mouseX, stage.mouseY);

				var colisao = ndgmr.checkRectCollision(pincel,grupo[i]);

				if(grupo[i].pode && desenhar && colisao){
					grupo[i].pode=false;
					if(_itens[fase].certas.indexOf(grupo[i].name)>-1){
						apagaitem=true;
						sons[0].play();
						animaIco('certo',pincel.x,pincel.y-100);

						i_acertos++;
						count++;
					}else{
						sons[1].play();
						animaIco('errado',pincel.x,pincel.y);
						apagaitem=true;
						i_erros++;
						i_erros_fase++;
						if(errosPermitidos){
							if (i_erros_fase >= errosPermitidos) {
								jogaFrutas=false;
								content.removeAllChildren();
								createjs.Tween.get(content).wait(4000).call(iniciaFase,[true],true);
								console.log('fim');
							}
						}
					}
				}
				if(grupo[i].y>720 || grupo[i].alpha<0.01){
					if(_itens[fase].certas.indexOf(grupo[i].name)>-1){
						i_erros++;
					}
					apagaitem=true;
				}

				if(apagaitem){
					fumacinha.x=pincel.x;
					fumacinha.y=pincel.y;
					fumacinha.gotoAndPlay('fumaca1');
					content.removeChild(grupo[i]);
					grupo.splice(i,1);

				}

			}
		}
		if(desenhar){
			drawTrail();
		}


		stage.update();
	}

	function verificaFim(){
		var img;
		var bo;
		var continua=false;

		var txt1 = new createjs.Text("pontos:"+i_acertos, "60px VAG Rounded BT", "#000000");
		txt1.lineWidth=900;
		txt1.x=180;
		txt1.y=320;
		
		var txt2 = new createjs.Text("erros:"+i_erros, "60px VAG Rounded BT", "#000000");
		txt2.lineWidth=900;
		txt2.x=180;
		txt2.y=400;

		var txt;

		if(mensagensFinais){
			if(i_acertos>=0 && i_acertos<=15){
				txt = new createjs.Text(mensagensFinais[0], tamanhoTexto+"px VAG Rounded BT", "#ffffff");
				if(mensagensFinaisSons){
					var audiofinal=new Audio(caminho+mensagensFinaisSons[0]);
					audiofinal.play();
				}
			}else if(i_acertos>=16 && i_acertos<=30){
				txt = new createjs.Text(mensagensFinais[1], tamanhoTexto+"px VAG Rounded BT", "#ffffff");
				if(mensagensFinaisSons){
					var audiofinal=new Audio(caminho+mensagensFinaisSons[1]);
					audiofinal.play();
				}
			}else{
				txt = new createjs.Text(mensagensFinais[2], tamanhoTexto+"px VAG Rounded BT", "#ffffff");
				if(mensagensFinaisSons){
					var audiofinal=new Audio(caminho+mensagensFinaisSons[2]);
					audiofinal.play();
				}
			}
			txt.x=-350;
			txt.y=100;
			txt.regY=60;
			txt.lineWidth=1100;
			txt.textAlign = "center";
			img=caminho+"positivo.png";
			continua=true;
		}else{
			if(i_acertos>=10){
				img=caminho+"positivo.png";
				continua=true;
				sons[2].play();
			}else{
				img=caminho+"tentenovamente.png";
				continua=true;
				sons[3].play();
			}
		}
		
		if(continua){
			inicio1=false;

			bo = new createjs.Bitmap(img);
			bo.image.onload = function(){};
			bo.regX=160;
			bo.regY=220;
			bo.x=640;
			bo.y=1000;
			
			createjs.Tween.get(bo).wait(1000).to({y:350},1000,createjs.Ease.backOut);

			if(_temVideo){

				videoHTMLTagFim.currentTime=0;
				videoHTMLTagFim.play();

				videoHTMLTagFim.style.zIndex=3;
				videoHTMLTagLoop.style.zIndex=2;
				videoHTMLTag.style.zIndex=1;
				setTimeout(function(){
					createjs.Tween.get(txt).to({x:640},300,createjs.Ease.backOut);
					content.addChild(txt,txt1,txt2);
					stage.addChild(bo);
				},1500);
			}else{
				content.addChild(txt1,txt2);
				stage.addChild(bo);
			}
			bo.on("mousedown", function (evt) {
				content.removeAllChildren();
				stage.removeChild(this);
				grupo=[];
				rate=0;
				rateNormal=0;
				index=0;
				acertosTotal=0;
				fase=0;
				i_erros=0;
				i_acertos=0;
				if(_temVideo){
					videoHTMLTag.currentTime=0;
					videoHTMLTag.style.zIndex=3;
					videoHTMLTagFim.style.zIndex=2;
					videoHTMLTagLoop.style.zIndex=1;
					videoHTMLTag.play();

					setTimeout(function(){
						iniciaFase(false);
					},duracaoVideo*1000);
				}else{
					iniciaFase(false);
				}

				videoHTMLTag.currentTime=0;
				videoHTMLTag.play();
				videovaiprofim=false;
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
	function animaIco(qual,b,c){
		var ico;
		ico = new createjs.Bitmap(caminho+qual+".png");
		stage.addChild(ico);
		ico.x = b;
		ico.y = c;
		ico.regX=150;
		ico.regY=150;
		ico.scaleX=ico.scaleY=0.1;
		createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut).wait(500).call(deletaIco);
	}
	function deletaIco(){
		stage.removeChild(this);
	}
	function drawTrail() {

		pincel.x=stage.mouseX;
		pincel.y=stage.mouseY;
		var points = MOUSE_POINTS;
		var nb = MOUSE_POINTS.length-1;
		trail = new createjs.Shape();
		var i;
		for(i = 0; i <= nb - 1; i++) {
			trail.graphics
			.setStrokeStyle(i*1,'round','round')
			.beginStroke('rgba(0,0,0,1)')
			.moveTo(points[i].x,points[i].y)
			.lineTo(points[i+1].x,points[i+1].y);
		}
		telaPintura.addChild(trail);
	}    

	function onDown(e) {
		MOUSE_POINTS = [];
		desenhar=true;
		setTimeout(desabilitaDesenho, 500);
	}
	function onUp(e) {
		desabilitaDesenho();
	}
	function desabilitaDesenho(){
		desenhar=false;
		pincel.x=-1000;
		pincel.y=-1000;
	}
	function onMouseMove(e) {
		if(desenhar){
			var pt = new createjs.Point(e.stageX,e.stageY);
			MOUSE_POINTS.unshift(pt);
			MOUSE_POINTS = MOUSE_POINTS.slice(0,tamanhoRastro);
		}

		
	} 
	function iniciaFase(conta){
		iniciar=false;
		count=0;
		i_erros_fase=0;
		acertosTotal+=_itens[fase].certas.length;
		if(conta){
			fase++;
		}
		content.removeAllChildren();
		if(fase<_itens.length){
			countTempo=Math.abs(_itens[fase].tempo);
			iniciar=true;
			jogaFrutas=true;
			if(_itens[fase].titulo){
				animaTitulo(_itens[fase].titulo);
			}
			texto_tempo = new createjs.Text("00s", "bold 80px VAG Rounded BT", "#000000");
			texto_tempo.x=1150;
			texto_tempo.y=30;
			if(_itens[fase].tempo<=0){
				texto_tempo.y=-500;
			}

			texto_tempo.textAlign = "center";
			content.addChild(texto_tempo);
			
		}else{
			console.log('fimMesmo');
			verificaFim();
		}
	}
	function animaTitulo(texto){
		var tit = new createjs.Container();
		content.addChild(tit);
		var extensao=texto.split('.').pop();
		
		var txt;
		if(extensao=='jpg' || extensao=='png'){
			txt = new createjs.Bitmap(caminho+texto);
			txt.image.onload = function () {};
			txt.tipo="imagem";
			tit.addChild(txt);
			tit.x=-1280;
			tit.y=0;
			createjs.Tween.get(tit).to({x:0},300,createjs.Ease.backOut);
		}else{
			var txt = new createjs.Text(texto, tamanhoTexto+"px VAG Rounded BT", "#ffffff");
			txt.regY=60;
			txt.lineWidth=900;
			txt.textAlign = "center";
			var contorno = new createjs.Text(texto, tamanhoTexto+"px VAG Rounded BT", "#000000");
			contorno.regY=60;
			contorno.textAlign = "center";
			contorno.outline = 8;
			contorno.lineWidth=900;
			tit.addChild(contorno);
			tit.addChild(txt);
			tit.x=-350;
			tit.y=100;
			createjs.Tween.get(tit).to({x:640},300,createjs.Ease.backOut);
		}
	}  
	var index;
	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}

	canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	icones = new createjs.Container();
	content = new createjs.Container();
	telaPintura = new createjs.Container();

	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true; 

	if(_temVideo){
		videoHTMLTag.pause();
		console.log("que?"+caminho+idFundo);
		videoHTMLTag.onended = function() {
			videoHTMLTagLoop.style.zIndex=3;
			videoHTMLTag.style.zIndex=2;
			videoHTMLTagFim.style.zIndex=1;
			videoHTMLTagLoop.play();
			videoHTMLTag.currentTime=0;
		};

		videoHTMLTag.addEventListener('loadeddata', function() {
			duracaoVideo=videoHTMLTag.duration;
			console.log(videoHTMLTag.duration);
		}, false);
	}
	var fundo;

	if(_temVideo){

	}else{
		fundo = new createjs.Bitmap(caminho+idFundo);
		fundo.image.onload = function(){};
		stage.addChild(fundo);
	}

	stage.addChild(icones);
	stage.addChild(content);
	stage.addChild(telaPintura);

	if(_mascara){
		var canvastemp = document.createElement('canvas');
		var ctx = canvastemp.getContext("2d");
		var img1 = new Image();

		img1.onload = function () {
			console.log(img1.naturalWidth);
			ctx.drawImage(img1, 0, 0);
			for(var i=0;i<img1.naturalWidth;i++){
				for(var j=0;j<img1.naturalHeight;j++){
					var teste=ctx.getImageData(i, j, 1, 1);
					if(teste.data[1]==0){
						var t=[i*10,j*10];
						arraycores.push(t)
					}
				}

			}
		};
		img1.src = caminho+_mascara;
	}

	if(_btiniciar!=null){
		btinicia = new createjs.Bitmap(caminho+_btiniciar);
	}else{
		btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
	}
	var offsetaudio=500;
	var telatuto;
	if(_enunciado){
		
		enun=new Audio(caminho+_enunciado);
		enun.onloadeddata = function() {
			offsetaudio=enun.duration*1000;
		}; 
		enun.onended = function () {
			stage.removeChild(telatuto);
			if(_temVideo){
				videoHTMLTag.play();
			}
		}
	}
	btinicia.image.onload = function(){};
	stage.addChild(btinicia);
	btinicia.on("click", function() {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		if(_musica){
			console.log("_musica "+_musica);
			var musica=new Audio(caminho+_musica);
			musica.play();
		}
		btinicia.visible=false;
		if(_enunciado){
			telatuto = new createjs.Bitmap(caminho+"tela_tutorial.png");
			stage.addChild(telatuto);
			enun.play();
		}
		if(_temVideo){
			offsetaudio+=duracaoVideo*1000;
			if(_enunciado){
			}else{
				videoHTMLTag.play();
			}
		}
		setTimeout(function(){
			iniciaFase(false);
		},offsetaudio);
		

	});
	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"fumaca.png"],
		"frames": {"regX": 100, "height": 200, "count": 10, "regY": 100, "width": 200},
		"animations": {
			"idle": 20,
			"fumaca1": [0, 9, "idle",0.6]
		}
	});
	fumacinha = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(fumacinha);	
	fumacinha.scaleX=2;
	fumacinha.scaleY=2;

	stage.addEventListener('stagemousemove',onMouseMove);
	stage.addEventListener('stagemousedown',onDown);
	stage.addEventListener('stagemouseup',onUp);

	pincel = new createjs.Shape();
	pincel.graphics.beginFill("red").drawCircle(0, 0, 20);
	pincel.x = 20;
	pincel.y = 20;
	stage.addChild(pincel);
	pincel.alpha=0.01;




	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", ticker);


	stage.autoClear = true;


};