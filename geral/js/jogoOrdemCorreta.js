

var AppJogoOrdenCorreta = function(idCanvas, _btiniciar, _fundo, _itens,_audioEnunciado,_imagemGui,_idioma,_modoEdicao,_gabarito){ 
	'use strict';
	var caminho = "resources/image/",
	canvas1,
	stage1,
	content1,
	contentFiguras1,
	content1hit,
	content1Temp,
	seq1=[3,2,4,0,1],
	hits1a=[],
	posX1a=[10,430,850,10,430,850],
	posY1a=[10,10,10,450,450,450],
	hits1b=[],
	posX1b=[469,469,469,1120,1120],
	posY1b=[131,360,590,131,360],
	ordem1=[0,1,2,3,4],
	figuras1=[],
	figuras1drag=[],
	count1=0,
	posGlobX1,
	posGlobY1,
	positivo1,
	count=0,
	btiniciar1,
	inicio1,
	i_erros=0,
	imgtroca,
	respostas=[],
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
	texto_errado;


	for (var index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}
	for (var index in _gabarito) {
		respostas[index] = "";
	}
	console.log(respostas);

	canvas1 = document.getElementById(idCanvas);
	stage1 = new createjs.Stage(canvas1);
	stage1.enableMouseOver(10);
	content1 = new createjs.Container();
	content1hit = new createjs.Container();
	contentFiguras1 = new createjs.Container();
	content1Temp = new createjs.Container();
	var fundo = new createjs.Bitmap(caminho+_fundo);
	fundo.image.onload = function(){};
	stage1.addChild(fundo);


	stage1.addChild(content1hit);
	stage1.addChild(content1);
	stage1.addChild(contentFiguras1);
	stage1.addChild(content1Temp);

	montaFase1();

	inicio1=true;


	positivo1 = new createjs.Bitmap(caminho+"positivo.png");
	positivo1.image.onload = function(){};
	stage1.addChild(positivo1);
	positivo1.x=100;
	positivo1.y=10;
	positivo1.visible=false;
	positivo1.on("mousedown", function (evt) {
		count=0;
		inicio1=true;
		montaFase1();
		content1Temp.removeAllChildren();
		positivo1.visible=false;
	});

	if(_modoEdicao){


		var imgEditMode = new createjs.Bitmap(caminho+"modoEdicao.png");
		imgEditMode.image.onload = function(){};
		stage1.addChild(imgEditMode); 
		setTimeout(function(){stage1.removeChild(imgEditMode);},3000);

		if(_itens.length>1){
			var bt1 = new createjs.Bitmap(caminho+"modoEdicao_bt1.png");
			bt1.image.onload = function(){};
			stage1.addChild(bt1);
			bt1.on("click", function() {
				if(count>0){
					count--;
					montaFase1();
				}

			});          

			var bt2 = new createjs.Bitmap(caminho+"modoEdicao_bt2.png");
			bt2.image.onload = function(){};
			stage1.addChild(bt2);
			bt2.x=1180;
			bt2.on("click", function() {
				if(count<_itens.length-1){
					count++;
					montaFase1();
				}
			});  
		}

	}

	imgtroca = new createjs.Bitmap(caminho+"troca.png");
	imgtroca.image.onload = function(){};
	stage1.addChild(imgtroca);
	imgtroca.regX=142/2;
	imgtroca.regY=85/2;
	imgtroca.y=-500;


	btiniciar1 = new createjs.Bitmap(caminho+_btiniciar);
	btiniciar1.image.onload = function(){};
	stage1.addChild(btiniciar1);
	btiniciar1.on("mousedown", function (evt) {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		btiniciar1.visible=false;
	});






	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker1);

	function montaFase1(){
		contentFiguras1.removeAllChildren();
		for(var i=0;i<_itens[count].botoes.length;i++){
			console.log(_itens[count].botoes[i][0]);

			var extensao=_itens[count].botoes[i][0].split('.').pop();
			if(extensao=='jpg' || extensao=='png'){
				figuras1drag[i] = new createjs.Bitmap(caminho+_itens[count].botoes[i][0]);
				figuras1drag[i].image.onload = function(){};
			}else{
				figuras1drag[i] = textoContorno(_itens[count].botoes[i][0],_itens[count].botoes[i][3],_itens[count].botoes[i][4],_itens[count].botoes[i][6]);
				figuras1drag[i].tipoTexto=true;
			}

			figuras1drag[i].image.onload = function(){};
			contentFiguras1.addChild(figuras1drag[i]);
			figuras1drag[i].x=figuras1drag[i].px=_itens[count].botoes[i][1];
			figuras1drag[i].py=_itens[count].botoes[i][2];
			figuras1drag[i].y=-500;
			figuras1drag[i].regX=_itens[count].botoes[i][3]/2;
			figuras1drag[i].regY=_itens[count].botoes[i][4]/2;
			figuras1drag[i].pode=true;
			figuras1drag[i].n=i;
			figuras1drag[i].nome=_itens[count].botoes[i][0];
			figuras1drag[i].ordem=0;
			createjs.Tween.get(figuras1drag[i]).wait(i*80).to({x:_itens[count].botoes[i][1],y:_itens[count].botoes[i][2]},250,createjs.Ease.backOut);
			if(_modoEdicao){
				figuras1drag[i].on("mousedown", function (evt) {

					this.parent.addChild(this);
					var global = content1.localToGlobal(this.x, this.y);
					this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
					this.regX=this.getBounds().width/2;
					this.regY=this.getBounds().height/2;

				});
				figuras1drag[i].on("pressmove", function (evt) {

					var local = content1.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
					this.x = Math.floor(local.x);
					this.y = Math.floor(local.y);


				});
				figuras1drag[i].on("pressup", function (evt) {
					_itens[count].botoes[this.n][1]=this.x;
					_itens[count].botoes[this.n][2]=this.y;
					_itens[count].botoes[this.n][3]=this.getBounds().width;
					_itens[count].botoes[this.n][4]=this.getBounds().height;
					criaDebug();
				}); 

			}else{


				figuras1drag[i].on("mousedown", function (evt) {
					if(this.pode && inicio1){
						this.parent.addChild(this);
						var global = content1.localToGlobal(this.x, this.y);
						this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};

						posGlobX1=this.px;
						posGlobY1=this.py;
						this.scaleX=0.7;
						this.scaleY=0.7;
						imgtroca.x=this.x;
						imgtroca.y=this.y;
						imgtroca.visible=true;
					}

				});
				figuras1drag[i].on("pressmove", function (evt) {
					if(this.pode && inicio1){
						var local = content1.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
						this.x = local.x;
						this.y = local.y;
						imgtroca.x=local.x;
						imgtroca.y=local.y;

					}
				});
				figuras1drag[i].on("pressup", function (evt) {
					
					if(this.pode && inicio1){
						imgtroca.visible=false;
						this.scaleX=1;
						this.scaleY=1;
						console.log("---------");
						var volta=true;
						
						for (var i=0; i<figuras1drag.length; i++) {
							if(this.n==i){
								continue;
							}

							var child = figuras1drag[i];

							if(collisionDetect(this,child)){
								console.log("troca="+this.n+ " por"+child.n);
								var oldx=this.x;
								var oldy=this.y
								createjs.Tween.get(this).to({x:child.x,y:child.y},250,createjs.Ease.backOut);
								createjs.Tween.get(child).to({x:posGlobX1,y:posGlobY1},250,createjs.Ease.backOut);
								child.px=posGlobX1;
								child.py=posGlobY1;
								this.px=child.x;
								this.py=child.y;
								
								volta=false;
								sons[0].play();
								break;
							}
							
						}
						content1Temp.removeAllChildren();
						var contagemcerta=0;
						for (var i=0; i<figuras1drag.length; i++) {

							if(gabarito[count].botoes[i][1]==figuras1drag[i].px){
								contagemcerta++;
								animaCerto1(figuras1drag[i].px,figuras1drag[i].py-figuras1drag[i].regY);
							}
						}
						if(contagemcerta>=figuras1drag.length){
							inicio1=false;
							setTimeout(function(){positivo1.visible=true;},1200);
							
						}
						if(volta){
							console.log("volta"+posGlobY1);
							createjs.Tween.get(this).to({x:posGlobX1,y:posGlobY1},500,createjs.Ease.backOut);

						}
					}
				}); 
			}
		}


	}

	function collisionDetect(object1, object2){
		var ax1 = object1.x;
		var ay1 = object1.y;
		var ax2 = object1.x + 70;
		var ay2 = object1.y + 70;

		var bx1 = object2.x;
		var by1= object2.y;
		var bx2= bx1 + 70;
		var by2= by1 + 70;

		if(object1 == object2){
			return false;
		}
		if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1){
			return true;
		} else {
			return false;
		} 
	}
	function animaCerto1(b,c){
		var certo;
		certo = new createjs.Bitmap(caminho+"certo.png");
		content1Temp.addChild(certo);
		certo.x = b-170;
		certo.y = c+50;
		certo.regX=98;
		certo.regY=98;
		certo.scaleX=certo.scaleY=0.1;
		createjs.Tween.get(certo).to({scaleX:0.3,scaleY:0.3},500,createjs.Ease.quadOut).wait(700);
	}

	function apagaicone1(e){
		contenthit.removeChild(this);
	}
	function ticker1(event){
		stage1.update();
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
	function textoContorno(texto,tamanhoX,tamanhoY,_tamanhoFonte){

		var txt = new createjs.Text(texto, "bold "+_tamanhoFonte+"px VAG Rounded BT", "#ffffff");
		txt.regY=60;
		txt.textAlign = "center";
		txt.lineWidth = tamanhoX;

		var contorno = new createjs.Text(texto, "bold "+_tamanhoFonte+"px VAG Rounded BT", "#000000");
		contorno.regY=60;
		contorno.textAlign = "center";
		contorno.outline = 10;
		contorno.lineWidth = tamanhoX;

		var resp = new createjs.Container();

		resp.addChild(contorno);
		resp.addChild(txt);

		return resp;

	}
	function criaDebug(){
		console.clear();

		var debugador='';
		var i;
		var t;
		var j;


		if(_itens.length>1){
			debugador+='\n';
			debugador+='var itens=[';
			for(j=0;j<_itens.length;j++){
				debugador+='\n';
				debugador+='{botoes:[';
				subItens(j); 
				if(j<_itens.length-1){
					debugador+='},';
					debugador+='\n';
				}else{
					debugador+='}';
				}
			}
			debugador+='\n';
			debugador+='];';


		}else{
			debugador='var itens=[{botoes:[';
			debugador+='\n';
			subItens(count);
			debugador+='}];';


		}


		function subItens(queFase){
			for(i=0;i<_itens[queFase].botoes.length;i++){


				debugador+='["'+_itens[queFase].botoes[i][0]+'",'+_itens[queFase].botoes[i][1]+','+_itens[queFase].botoes[i][2]+','+_itens[queFase].botoes[i][3]+','+_itens[queFase].botoes[i][4]+']';
				if(i<_itens[queFase].botoes.length-1){
					debugador+=',';
					debugador+='\n';
				}else{
					debugador+=']';
				}
			}
		}

		console.log(debugador);

	} 
}
