/*
3/6/2019
-adicionado clique e arraste no modo edicao

7/5/2019
-adicionado ignora inicio fim pra colocar a palavra cruzada no livro sem ser um od

-na hora de editar segurando shift todos movem juntos

-adicionado espaco cinza
-adicionado opcao de letras
-quando letra é arrastada mantem uma compia dela no lugar

02/06/2020
-alterada a transparecia das letras, dava pra ver as respostas dependendo do angulo
*/

var AppJogoCruzadinha=function(modoedicao,idCanvas,idfundo,idBtiniciar,_quadro,tamanhoQuad,tamanhoTextoQuad,tamanhoTextoDica,_letras,_ignoraInicioFim,_alinhamento){

	var canvas,
	stage,
	content,
	contenthit,
	contentgui,
	popup,
	fundo,
	fumaca,
	positivo,
	inicio1=false,
	btinicia,
	moscas=[],
	caminho="resources/image/",
	perguntaAtual=[],
	infoPos=[],
	perguntaString='',
	letrasTemplate='ABCDEFGHIJKLMNOPQRSTUVWXYZ',

	selecionado,
	selecionadoTipo,
	word_count=0,
	hits=[],
	dicas=[],
	bts=[],
	figuras=[],
	letras=[],
	edgeOffset = 35,
	count=0,
	si=0,
	countTempo=0,
	btcontinuar,
	score=0,
	label,
	update=true,
	clicavel=true,
	inicio1=true,
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];

	if(_letras){
		letrasTemplate=_letras;
	}

	function formaPergunta(){
		hits=[];
		perguntaString='';
		contenthit.removeAllChildren();

		var letrasMaiusculas=0;
		var i,j,w=0;

		for(j=0;j<_quadro[0].palavras.length;j++){
			for(i=0;i<_quadro[0].palavras[j][0].length;i++){
				infoPos[j]=[];
				var quadradovazio;
				if(_quadro[0].palavras[j][0][i]=="_"){
					continue;

				}else if(_quadro[0].palavras[j][0][i]=="+"){
					if(!modoedicao){
						console.log("cria letra vazia");
						espacos=true;
						quadradovazio=criaLetra(" ",tamanhoTextoQuad,tamanhoQuad,tamanhoQuad,1,"#666666");
						contenthit.addChild(quadradovazio);
						quadradovazio.regX=tamanhoQuad/2;
						quadradovazio.regY=tamanhoQuad/2;
						if(_quadro[0].palavras[j][1]=='h'){
							quadradovazio.x=tamanhoQuad*i+_quadro[0].palavras[j][2]+tamanhoQuad/2;
							quadradovazio.y=_quadro[0].palavras[j][3]+tamanhoQuad/2;    
						}else{
							quadradovazio.x=_quadro[0].palavras[j][2]+tamanhoQuad/2;
							quadradovazio.y=tamanhoQuad*i+_quadro[0].palavras[j][3]+tamanhoQuad/2;   
						}
					}
					continue;


				}
				perguntaString+=_quadro[0].palavras[j][0][i];



				if(modoedicao){
					hits[w]=criaLetra(_quadro[0].palavras[j][0][i],tamanhoTextoQuad,tamanhoQuad,tamanhoQuad,0.51,"#ffffff");
					hits[w].selecionado=j;
					hits[w].posicao=i;
					hits[w].alinhamento=_quadro[0].palavras[j][1];

					if (i==0) {
						/*verifica se tem resposta senao nao faz o objeto nao ser arrastado*/

						hits[w].on("mousedown", function (evt) {
							this.parent.addChild(this);
							var global = content.localToGlobal(this.x, this.y);
							this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
							selecionadoTipo='palavra';
							selecionado=this.selecionado;
						});
						hits[w].on("pressmove", function (evt) {
							var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
							var p;
							for(p=0;p<hits.length;p++){
								if(hits[p].palavra==this.selecionado){
									if(this.alinhamento=='h'){
										hits[p].x = Math.floor(local.x)+hits[p].posicao*tamanhoQuad;
										hits[p].y = Math.floor(local.y);
									}else if(this.alinhamento=='v'){
										hits[p].x = Math.floor(local.x);
										hits[p].y = Math.floor(local.y)+hits[p].posicao*tamanhoQuad;
									}
								}
							}
						});
						hits[w].on("pressup", function (evt) {
							criaDebug();
						});
					}
				}else{
					if (_quadro[0].palavras[j][0][i] == _quadro[0].palavras[j][0][i].toUpperCase()) {
						hits[w]=criaLetra(_quadro[0].palavras[j][0][i],tamanhoTextoQuad,tamanhoQuad,tamanhoQuad,1,"#ffffff");
						hits[w].pode=false;
						letrasMaiusculas++;
					}else{
						hits[w]=criaLetra(_quadro[0].palavras[j][0][i],tamanhoTextoQuad,tamanhoQuad,tamanhoQuad,0,"#ffffff");
						hits[w].pode=true;
					}


				}

				if(_quadro[0].palavras[j][1]=='h'){
					hits[w].x=tamanhoQuad*i+_quadro[0].palavras[j][2]+tamanhoQuad/2;
					hits[w].y=_quadro[0].palavras[j][3]+tamanhoQuad/2;
				}else{
					hits[w].x=_quadro[0].palavras[j][2]+tamanhoQuad/2;
					hits[w].y=tamanhoQuad*i+_quadro[0].palavras[j][3]+tamanhoQuad/2;

				}

				hits[w].name=_quadro[0].palavras[j][0][i].toUpperCase();
				hits[w].id=i;
				hits[w].palavra=j;
				hits[w].letra=j;
				hits[w].alpha=1;

				hits[w].regX=tamanhoQuad/2;
				hits[w].regY=tamanhoQuad/2;
				contenthit.addChild(hits[w]);
				w++;
			}
		}
		word_count=w-letrasMaiusculas;


		for(j=0;j<_quadro[0].dicas.length;j++){
			dicas[j] = new createjs.Bitmap(caminho+_quadro[0].dicas[j][0]);
			dicas[j].image.onload = function(){};
			dicas[j].regX=78/2;
			dicas[j].regY=78/2;
			dicas[j].id=j;
			var extensao=_quadro[0].dicas[j][3].split('.').pop();
			if(extensao=='mp3' || extensao=='wav'){
				dicas[j].tipo="som";
				dicas[j].som=_quadro[0].dicas[j][3];
			}else{
				dicas[j].tipo="img";
			}
			contenthit.addChild(dicas[j]);
			dicas[j].x=_quadro[0].dicas[j][1];
			dicas[j].y=_quadro[0].dicas[j][2];

			if(modoedicao){
				dicas[j].on("mousedown", function (evt) {
					this.parent.addChild(this);
					var global = content.localToGlobal(this.x, this.y);
					this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };
					selecionadoTipo='dica';
					selecionado=this.id;
				});
				dicas[j].on("pressmove", function (evt) {
					var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
					this.x = Math.floor(local.x);
					this.y = Math.floor(local.y);

				});
				dicas[j].on("pressup", function (evt) {
					criaDebug();
				});
			}else{
				dicas[j].on("mousedown", function (evt) {
					this.scaleX=this.scaleY=0.1;
					createjs.Tween.get(this).to({scaleX:1,scaleY:1},250,createjs.Ease.backOut);
					console.log(this.tipo);
					if(this.tipo=='som'){
						var som= new Audio(caminho+this.som);
						som.play();
					}else{
						popDica(_quadro[0].dicas[this.id][3]);
					}


				});
			}{}
		}
	}

	function montaFase(){
		inicio1=true;
		countTempo=0;
		var margemY=120;
		var margemX=120;
		var tamanhoLetra=75;
		content.removeAllChildren();

		formaPergunta();


		for(var i=0;i<letrasTemplate.length;i++){
			letras[i]=criaLetra(letrasTemplate[i],60,tamanhoLetra,tamanhoLetra,1,"#ffffff");
			var letraparada=criaLetra(letrasTemplate[i],60,tamanhoLetra,tamanhoLetra,1,"#ffffff");
			letraparada.alpha=0.4;
			content.addChild(letraparada);
			content.addChild(letras[i]);

			if(_alinhamento=="alinhaEsquerda"){
				if(margemY>680){
					margemX+=tamanhoLetra;
					margemY=120;
				}
			}else if(_alinhamento=="alinhaTopo"){
				if(margemX>canvas.width-50){
					margemX=120;
					margemY+=tamanhoLetra;
				}
			}else if(_alinhamento=="alinhaBaixo"){

			}else{
				if(margemY>680){
					margemX+=tamanhoLetra;
					margemY=120;
				}
			}

			letraparada.x=margemX;
			letraparada.y=margemY; 
			letraparada.regX=tamanhoLetra/2; 
			letraparada.regY=tamanhoLetra/2;
			letras[i].x=-100;
			letras[i].y=margemY; 
			letras[i].px=margemX;
			letras[i].py=margemY; 
			letras[i].regX=tamanhoLetra/2; 
			letras[i].regY=tamanhoLetra/2;
			letras[i].pode=true;
			letras[i].name=letrasTemplate[i];
			createjs.Tween.get(letras[i]).wait(i*10).to({x:margemX},300,createjs.Ease.bounceOut);


			if(_alinhamento=="alinhaEsquerda"){
				margemY+=tamanhoLetra;
			}else if(_alinhamento=="alinhaTopo"){
				margemX+=tamanhoLetra;
			}else if(_alinhamento=="alinhaBaixo"){

			}else{
				margemY+=tamanhoLetra;
			}
			letras[i].on("mousedown", function (evt) {
				if(this.pode && inicio1){
					this.parent.addChild(this);
					var global = content.localToGlobal(this.x, this.y);
					this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};

				}
			});
			letras[i].on("pressmove", function (evt) {
				if(this.pode && inicio1){
					var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
					this.x = local.x;
					this.y = local.y;
				}
			});
			letras[i].on("pressup", function (evt) {
				if(this.pode && inicio1){
					var volta=true;
					var l = contenthit.getNumChildren();
					for (var i=0; i<hits.length; i++) {
						if(collisionDetect(this, hits[i])){
							if(hits[i].pode && this.name==removerAcento(hits[i].name)){
								volta=false;
								this.x=this.px;
								this.y=this.py;

								var letracerta=criaLetra(hits[i].name,tamanhoTextoQuad,tamanhoQuad,tamanhoQuad,1,"#ffffff");
								contenthit.addChild(letracerta);
								letracerta.x=hits[i].x;
								letracerta.y=hits[i].y;
								letracerta.regX=tamanhoQuad/2;
								letracerta.regY=tamanhoQuad/2;
								hits[i].pode=false;
								contenthit.removeChild(hits[i]);

								fumaca.x=hits[i].x-tamanhoQuad/2;
								fumaca.y=hits[i].y-tamanhoQuad/2;
								fumaca.gotoAndPlay("fumaca1");

								sons[0].play();
								count++;
								if(count>=word_count){
									if(!_ignoraInicioFim){
										verificaFim();
									}

								}

								break;
							}					
						}
					}
					if(volta){
						sons[1].play();
						createjs.Tween.get(this).to({x:this.px,y:this.py},200,createjs.Ease.backIn);	

					}
				}
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

	function ticker(event){
		if(update){
			stage.update();
		}


	}
	function criaLetra(texto,tam,tamX,tamY,transp,corQuadrado){

		var txt = new createjs.Text(texto, tam+"px VAG Rounded BT", "#000000");


		txt.textAlign = "center";
		txt.regY=txt.getBounds().height/2;
		txt.alpha=transp;

		var button = new createjs.Shape();

		button.graphics.beginFill(corQuadrado);
		button.graphics.drawRect(0, 0, tamX, tamY);
		button.graphics.endFill();

		var border = new createjs.Shape();
		border.graphics.beginStroke("#196eb6");
		border.graphics.setStrokeStyle(2);
		border.graphics.drawRect(0, 0, tamX, tamY);

		button.regX=tamX/2;
		button.regY=tamY/2;
		border.regX=tamX/2;
		border.regY=tamY/2;

		var resp = new createjs.Container();
		resp.addChild(button);
		resp.addChild(txt);
		resp.addChild(border);


		return resp;
	}
	function verificaFim(){
		var img;
		var bo;
		var continua=false;


		img=caminho+"positivo.png";
		continua=true;
		sons[2].play();

		if(continua){
			bo = new createjs.Bitmap(img);
			bo.image.onload = function(){};
			bo.regX=269/2;
			bo.regY=450/2;
			bo.x=950;
			bo.y=1000;
			stage.addChild(bo);
			createjs.Tween.get(bo).wait(1000).to({y:350},1000,createjs.Ease.backOut);
			bo.on("mousedown", function (evt) {
				stage.removeChild(this);
				count=0;

				montaFase();
				formaPergunta();
			});


		}

	}
	function popDica(texto){



		var bmp;


		var extensao=texto.split('.').pop();


		if(extensao=='jpg' || extensao=='png'){
			bmp = new createjs.Bitmap(caminho+texto);
			bmp.image.onload = function(){};
			bmp.regX=1280/2;
			bmp.regY=720/2;
			popup.addChild(bmp);
		}else{
			bmp = new createjs.Bitmap(caminho+"popup.png");
			bmp.image.onload = function(){};
			bmp.regX=1280/2;
			bmp.regY=720/2;
			popup.addChild(bmp);

			var txt = new createjs.Text(texto, tamanhoTextoDica+"px VAG Rounded BT", "#ffffff");
			txt.textAlign = "center";
			txt.shadow = new createjs.Shadow("#000000", 5, 5, 10);
			txt.lineWidth = 900;
			txt.regY=txt.getBounds().height/2;

			popup.addChild(txt);
		}



		popup.x=640;
		popup.y=360;
		popup.scaleX=popup.scaleY=0.1;
		createjs.Tween.get(popup).to({scaleX:1,scaleY:1},750,createjs.Ease.backOut);

		popup.on("mousedown", function (evt) {
			popup.removeAllChildren();

		});
	}

	function removerAcento(palavra) {
		var palavraSemAcento = '';
		var caracterComAcento = 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
		var caracterSemAcento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';

		for (var i = 0; i < palavra.length; i++)
		{
			var char = palavra.substr(i, 1);
			var indexAcento = caracterComAcento.indexOf(char);
			if (indexAcento != -1) {
				palavraSemAcento += caracterSemAcento.substr(indexAcento, 1);
			} else {
				palavraSemAcento += char;
			}
		}

		return palavraSemAcento;
	}
	function animaIco(qual,b,c){
		var ico;
		ico = new createjs.Bitmap(caminho+qual+".png");
		contenthit.addChild(ico);
		ico.x = b+220;
		ico.y = c-80;
		ico.regX=150;
		ico.regY=150;
		ico.scaleX=ico.scaleY=0.1;
		createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut);
	}
	function intersect(obj1, obj2){

		var objBounds1 = obj1.getBounds().clone();
		var objBounds2 = obj2.getBounds().clone();
		if(obj1.x > (obj2.x - edgeOffset) && obj1.x < (obj2.x + objBounds2.width + edgeOffset) && obj1.y > (obj2.y - edgeOffset) && obj1.y < (obj2.y + objBounds2.height + edgeOffset)){
			return true;
		}else{
			return false;
		}
	}
	function collisionDetect(object1, object2){
		var ax1 = object1.x;
		var ay1 = object1.y;
		var ax2 = object1.x + edgeOffset;
		var ay2 = object1.y + edgeOffset;

		var bx1 = object2.x;
		var by1= object2.y;
		var bx2= bx1 + edgeOffset;
		var by2= by1 + edgeOffset;

		if(object1 == object2){
			return false;
		}
		if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1){
			return true;
		} else {
			return false;
		}
	}

	var index;
	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}

	canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);
	createjs.Touch.enable(stage);
	contenthit = new createjs.Container();
	content = new createjs.Container();
	contentgui = new createjs.Container();
	popup = new createjs.Container();
	fundo = new createjs.Bitmap(caminho+idfundo);
	fundo.image.onload = function(){};
	stage.addChild(fundo);


	stage.addChild(contenthit);
	stage.addChild(content);
	stage.addChild(contentgui);
	stage.addChild(popup);


	montaFase();

	if(_ignoraInicioFim){
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", ticker);

	}else{
		btinicia = new createjs.Bitmap(caminho+idBtiniciar);
		btinicia.image.onload = function(){};
		content.addChild(btinicia);
		btinicia.on("click", function() {
			var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
			btinicia.visible=false;
			createjs.Ticker.setFPS(60);
			createjs.Ticker.addEventListener("tick", ticker);
		});

	}


	if(modoedicao){
		var imgEdicao = new createjs.Bitmap(caminho+"modoEdicaoCruzadinha.png");
		imgEdicao.image.onload = function(){};
		stage.addChild(imgEdicao);
		imgEdicao.x=500;
		createjs.Tween.get(imgEdicao).to({x:0},800,createjs.Ease.quadOut);
		setTimeout(function(){ stage.removeChild(imgEdicao); }, 5000);
/*
		var i;
		for(i=0;i<_quadro[0].palavras.length;i++){
			var botao=criaLetra(_quadro[0].palavras[i][0],20,100,30,1,"#ffffff");
			stage.addChild(botao);
			botao.y=i*30+50;
			botao.x=80;
			botao.id=i;

			botao.on("mousedown", function (evt) {
				this.scaleX=this.scaleY=0.5;
				selecionado=this.id;
				selecionadoTipo="palavra";

			});
			botao.on("pressup", function (evt) {
				this.scaleX=this.scaleY=1;

			});            
		}
		for(i=0;i<_quadro[0].dicas.length;i++){
			var botao=criaLetra("dica"+(i+1),20,100,30,1,"#ffffff");
			stage.addChild(botao);
			botao.y=i*30+50;
			botao.x=200;
			botao.id=i;

			botao.on("mousedown", function (evt) {
				this.scaleX=this.scaleY=0.5;
				selecionado=this.id;
				selecionadoTipo="dica";

			});
			botao.on("pressup", function (evt) {
				this.scaleX=this.scaleY=1;

			});
		}
		*/
	}


	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
		"images": [caminho+"fumaca.png"],
		"frames": {"regX": 100, "height": 200, "count": 20, "regY": 100, "width": 200},
		"animations": {
			"idle": 20,
			"fumaca1": [0, 9, "idle"],
			"fumaca2": [10, 19, "idle"]
		}
	});
	fumaca = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(fumaca);



	stage.update();
	setTimeout(function () { stage.update(); }, 1000);
    /*   var quadro_od1=[{
                palavras:[['vestimentas', 'h',532,455],
                          ['irmã_', 'v',643,235],
                          ['tribu_os', 'v',697,180],
                          ['conselh_iros', 'v',862,70],
                          ['imper_dor', 'v',1028,180]],
                dicas:[['dica1.png',450,450,'O que podia evidenciar a posição social de um inca?'],
                       ['dica2.png',560,230,'Para se manter no poder o imperador se casava com quem?'],
                       ['dica3.png',700,90,'Eram cobrados em relação a cada pessoa e não conforme ela produzia.'],
                       ['dica4.png',940,70,'Os nobres ajudavam o imperador como…'],
                       ['dica5.png',1100,175,'Título do grande líder da sociedade inca.']]

            }];
            */
            function criaDebug(){
            	console.clear();

            	var debugador='var quadro_od1=[{';

            	var infoX=0;
            	var infoY=0;

            	var infoX2=0;
            	var infoY2=0;

            	debugador+='\n';
            	debugador+='palavras:[';
            	var i;
            	var t;
            	for(i=0;i<_quadro[0].palavras.length;i++){
            		var j;
            		for(j=0;j<hits.length;j++){
            			if(hits[j].palavra==i){
            				infoX=hits[j].x-tamanhoQuad/2;
            				infoY=hits[j].y-tamanhoQuad/2;

            				if(_quadro[0].palavras[i][1]=='h'){
            					if(_quadro[0].palavras[i][0][0]=='_'){
            						infoX-=tamanhoQuad;
            					}
            				}                    
            				if(_quadro[0].palavras[i][1]=='v'){
            					if(_quadro[0].palavras[i][0][0]=='_'){
            						infoY-=tamanhoQuad;
            					}
            				}
            				break;
            			}
            		}            
            		debugador+='["'+_quadro[0].palavras[i][0]+'","'+_quadro[0].palavras[i][1]+'",'+infoX+','+infoY+']';
            		if(i<_quadro[0].palavras.length-1){
            			debugador+=',';
            			debugador+='\n';
            		}else{
            			debugador+='],';
            		}
            	}
            	debugador+='\n';
            	debugador+='dicas:[';
            	for(i=0;i<_quadro[0].dicas.length;i++){

            		debugador+='["'+_quadro[0].dicas[i][0]+'",'+dicas[i].x+','+dicas[i].y+',"'+_quadro[0].dicas[i][3]+'"]';
            		if(i<_quadro[0].dicas.length-1){
            			debugador+=',';
            			debugador+='\n';
            		}else{
            			debugador+=']}];';
            		}
            	}

            	console.log(debugador);

            }
            document.addEventListener("keydown", function (e) {
            	var evtobj = window.event? event : e
            	if(modoedicao){
            		var idY=0;
            		if (e.keyCode==39){ 
            			var i;
            			console.log("39");
            			if(selecionadoTipo=='dica'){
            				console.log("selecionado");
            				dicas[selecionado].x+=Math.floor(tamanhoQuad/10);

            			}else{
            				for(i=0;i<hits.length;i++){
            					if(evtobj.shiftKey){
            						hits[i].x+=Math.floor(tamanhoQuad/10);
            						console.log(hits[i].x+" "+hits[i].y);

            					}else{
            						if(hits[i].palavra==selecionado){
            							if(evtobj.ctrlKey){
            								hits[i].x+=1;
            							}else{
            								hits[i].x+=Math.floor(tamanhoQuad/10);
            								console.log(hits[i].x+" "+hits[i].y);
            							}

            						}
            					}
            				}
            			}
            		}
            		if (e.keyCode==40) {
            			if(selecionadoTipo=='dica'){
            				dicas[selecionado].y+=tamanhoQuad/10;
            			}else{
            				for(i=0;i<hits.length;i++){
            					if(evtobj.shiftKey){
            						hits[i].y+=Math.floor(tamanhoQuad/10);
            						console.log(hits[i].x+" "+hits[i].y);
            					}else{
            						if(hits[i].palavra==selecionado){
            							if(evtobj.ctrlKey){
            								hits[i].y+=1;
            							}else{
            								hits[i].y+=Math.floor(tamanhoQuad/10);
            								console.log(hits[i].x+" "+hits[i].y);
            							}
            						}
            					}
            				}
            			}
            		}
            		if (e.keyCode==37) { 
            			if(selecionadoTipo=='dica'){
            				dicas[selecionado].x-=tamanhoQuad/10;
            			}else{
            				for(i=0;i<hits.length;i++){
            					if(evtobj.shiftKey){
            						hits[i].x-=Math.floor(tamanhoQuad/10);
            						console.log(hits[i].x+" "+hits[i].y);

            					}else{
            						if(hits[i].palavra==selecionado){
            							if(evtobj.ctrlKey){
            								hits[i].x-=1;
            							}else{
            								hits[i].x-=Math.floor(tamanhoQuad/10);
            								console.log(hits[i].x+" "+hits[i].y);
            							}
            						}
            					}
            				}
            			}
            		}
            		if (e.keyCode==38) { 
            			if(selecionadoTipo=='dica'){
            				dicas[selecionado].y-=tamanhoQuad/10;
            			}else{

            				for(i=0;i<hits.length;i++){
            					if(evtobj.shiftKey){
            						hits[i].y-=Math.floor(tamanhoQuad/10);
            						console.log(hits[i].x+" "+hits[i].y);
            					}else{
            						if(hits[i].palavra==selecionado){
            							if(evtobj.ctrlKey){
            								hits[i].y-=1;
            							}else{
            								hits[i].y-=Math.floor(tamanhoQuad/10);
            								console.log(hits[i].x+" "+hits[i].y);
            							}
            						}
            					}
            				}
            			}
            		}
            	}


            	criaDebug();


            });

        }