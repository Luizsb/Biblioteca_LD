var AppCorridaCavalo=function(idCanvas,_itens,tamanhoBt,margemBt,margemPergunta,espacamento,ativaTempo,_tempoPergunta,tamanhoTextoBotao,pontosNecessarios,mostraTutorial,_naoembaralhar){
	var caminho="resources/image/",
	canvas,
	stage,
	fundo,
	content,
	telaEscolha,
	perguntas,
	dif,
	cont_carro=[],
	pistas=['pista.png','pista.png','pista.png','pistaFim.png'],
	fumaca=[],
	positivo,
	tente,
	inicio1=false,
	btinicia,
	count=0,
	i_erros=0,
	i_acertos=0,
	edgeOffset=80,
	btcontinuar,
	score=0,
	carros=[],
	carrosBt=[],
	sinal=[],
	frase,
	hit,
	help,
	escolha=1,
	acerto=false,
	chegada,
	tutorial,
	n_resp=6,
	check,
	tempoPergunta=5000,
	tempoPista=3000,
	tempoDelay=3000,
	distancia=20,
	pistaWidth=1280,
	sheets=[],
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"]; 

	function dificuldade(){
		dif = new createjs.Container();
		stage.addChild(dif);
		var d1 = new createjs.Bitmap(caminho+"dif0.png");
		d1.image.onload = function(){};
		dif.addChild(d1);
		dif.x=1000;
		dif.y=500;

		var d2 = new createjs.Bitmap(caminho+"dif1.png");
		d2.image.onload = function(){};
		dif.addChild(d2);
		d2.y=58;
		d2.on("mousedown", function (evt) {
			check.y=58;
			tempoPergunta=_tempoPergunta;
		});

		var d3 = new createjs.Bitmap(caminho+"dif2.png");
		d3.image.onload = function(){};
		dif.addChild(d3);
		d3.y=130;
		d3.on("mousedown", function (evt) {
			check.y=130;
			tempoDelay=2000;
			tempoPergunta=_tempoPergunta/2;
		});

		check = new createjs.Bitmap(caminho+"dif3.png");
		check.image.onload = function(){};
		dif.addChild(check);
		check.y=58;

	};
	function iniciaCorrida(){
		telaEscolha.removeAllChildren();
		count=0;
		for(var i=0;i<3;i++){
			sinal[i] = new createjs.Bitmap(caminho+"sinal"+i+".png");
			sinal[i].image.onload = function(){};
			stage.addChild(sinal[i]);
			sinal[i].x=1000;
			sinal[i].y=350;
			sinal[i].regX=153;
			sinal[i].regY=275;
			sinal[i].scaleX=sinal[i].scaleY=0;
			createjs.Tween.get(sinal[i]).wait(i*1000).to({scaleX:1,scaleY:1},250,createjs.Ease.backOut).wait(800).to({alpha:0.1},250).call(apaga);   

		}
		fundo.x=0;
		createjs.Tween.get(fundo).wait(3000).call(largada);
		inicio1=true;
	}
	function animaPistaInicio(){
		createjs.Tween.get(pistas[0]).to({x:-1280},tempoPista,createjs.Ease.linear);
		createjs.Tween.get(pistas[1]).to({x:0},tempoPista,createjs.Ease.linear).call(animaPistaLooping);
	}
	function animaPistaLooping(){
		createjs.Tween.get(pistas[1],{loop:true}).to({x:-1280},tempoPista,createjs.Ease.linear);
		createjs.Tween.get(pistas[2],{loop:true}).to({x:0},tempoPista,createjs.Ease.linear);
	}
	function animaPistaFim(){


		if(pistas[2].x>pistas[1].x){
			pistas[3].x=pistas[2].x+1280;
		}else{
			pistas[3].x=pistas[1].x+1280;
		}
		createjs.Tween.get(pistas[1],{override:true}).to({x:-1280},tempoPista,createjs.Ease.linear);
		createjs.Tween.get(pistas[2],{override:true}).to({x:-1280},tempoPista,createjs.Ease.linear);
		createjs.Tween.get(pistas[3],{override:true}).to({x:0},tempoPista,createjs.Ease.linear);
	}
	function largada(evt){
		animaPistaInicio();
		for(var i=0;i<3;i++){
			carros[i].gotoAndPlay("corre");
			createjs.Tween.get(carros[i],{loop:true}).to({x:50},randomiza(),createjs.Ease.quadInOut).to({x:0},randomiza(),createjs.Ease.quadInOut);
			createjs.Tween.get(cont_carro[i]).to({x:50},2000,createjs.Ease.quadOut);
			fumaca[i].visible=true;
		}
		montaFase();
	}
	function randomiza(){
		var n=Math.floor(Math.random()*500)+500;
		return n;
	}
	function montaFase(){
		inicia=true;

		var frase = new createjs.Container();
		var extensao=_itens[count].pergunta.split('.').pop();
		if(extensao=='jpg' || extensao=='png'){
			img = new createjs.Bitmap(caminho+_itens[count].pergunta);
			img.image.onload = function(){};
			frase.addChild(img);

		}else{
			var txt = new createjs.Text(_itens[count].pergunta, "42px VAG Rounded BT", "#ffffff");
			txt.lineWidth=1000;
			txt.textAlign = "center";

			var contorno = new createjs.Text(_itens[count].pergunta, "42px VAG Rounded BT", "#000000");
			contorno.lineWidth=1000;
			contorno.textAlign = "center";
			contorno.outline = 8;

			contorno.x=640;
			txt.x=640;
			frase.addChild(contorno);
			frase.addChild(txt);
		}
		perguntas.addChild(frase);
		frase.x=-1280;
		frase.y=margemPergunta[1];

		createjs.Tween.get(frase).wait(tempoDelay).to({x:0},250,createjs.Ease.backOut);
		if(ativaTempo){
			createjs.Tween.get(content).wait(tempoPergunta+tempoDelay).call(limpaSegue);
		}
		if(_naoembaralhar){

		}else{
			shuffle(_itens[count].opcoes);
		}


		for(var i=0;i<_itens[count].opcoes.length;i++){

			var extensao=_itens[count].opcoes[i].split('.').pop();
			var bt;
			if(extensao=='jpg' || extensao=='png'){
				bt = new createjs.Bitmap(caminho+_itens[count].opcoes[i]);
				bt.image.onload = function () {};
				bt.tipo="imagem";
			}else{
				bt = caixaTexto(_itens[count].opcoes[i]);
				bt.tipo="texto";
			}

			perguntas.addChild(bt);
			bt.x=-640;

			bt.alpha=1;
			if(espacamento=='vertical'){
				bt.px=margemBt[0];
				bt.y=margemBt[1]+(tamanhoBt[1]+5)*i;
			}else{
				if(_itens[count].posicoes){
					bt.px=_itens[count].posicoes[i][0];
					bt.y=_itens[count].posicoes[i][1];
				}else{
					bt.px=i*(tamanhoBt[0]+espacamento)+margemBt[0];
					bt.y=margemBt[1];

				}

			}

			bt.py=margemBt[1];
			bt.name=_itens[count].opcoes[i];
			bt.certa=_itens[count].certa;
			bt.regX=tamanhoBt[0]/2;
			bt.regY=tamanhoBt[1]/2;
			createjs.Tween.get(bt).wait(tempoDelay).to({x:bt.px},250,createjs.Ease.backOut);
			bt.on("mousedown", function (evt) {
				if(inicia){
					inicia=false;
					if(this.name==this.certa){
						acerto=true;
						volta=false;
						sons[0].play();
						i_acertos++;
						animaIco("certo",this.px,this.py);      
					}else{
						sons[1].play();
						i_erros++;
						this.alpha=0.25;
						animaIco("errado",this.px,this.py);
					}
					createjs.Tween.get(content).wait(tempoDelay).call(limpaSegue);
				}
			}); 

		}

	}
	function animaIco(qual,b,c){
		var ico;
		ico = new createjs.Bitmap(caminho+qual+".png");
		perguntas.addChild(ico);
		ico.x = b-30;
		ico.y = c-150;
		ico.regX=98;
		ico.regY=98;
		ico.scaleX=ico.scaleY=0.1;
		createjs.Tween.get(ico).to({scaleX:0.3,scaleY:0.3},200,createjs.Ease.quadOut);
	}
	function limpaSegue(){
		var out1;
		var out2;
		if(escolha==0){
			out1=1;
			out2=2;
		}else if(escolha==1){
			out1=0;
			out2=2;
		}else if(escolha==2){
			out1=0;
			out2=1;
		}
		var fracao=_itens.length;
		var t;
		if(acerto){
			t=cont_carro[escolha];
			createjs.Tween.get(cont_carro[escolha]).to({x:t.x+800/fracao},500,createjs.Ease.quadOut);
			acerto=false;
		}else{
			t=cont_carro[out1];
			createjs.Tween.get(t).to({x:t.x+800/fracao},500,createjs.Ease.quadOut);
			t=cont_carro[out2];
			var n=Math.floor(Math.random()*500/fracao)+500/fracao;
			createjs.Tween.get(t).to({x:t.x+n},500,createjs.Ease.quadOut);

		}

		perguntas.removeAllChildren();
		if(count<_itens.length-1){
			count++;
			montaFase();
		}else{
			Fim();
		}

	}
	function Fim(){
		animaPistaFim();

		chegada.visible=true;
		createjs.Tween.get(chegada,{loop:true}).to({rotation:30},1000,createjs.Ease.quadInOut).to({rotation:-30},1000,createjs.Ease.quadInOut);

		var i;
		for(i=0;i<cont_carro.length;i++){
			createjs.Tween.get(cont_carro[i],{override:true}).to({x:cont_carro[i].x+1380},4000,createjs.Ease.quadIn);
		}
		if(i_acertos>=pontosNecessarios){
			sons[2].play();
			positivo.visible=true;
			positivo.y=720;
			createjs.Tween.get(positivo).wait(4000).to({y:150},750,createjs.Ease.quadOut);
			sons[2].play();
		}else{
			tente.visible=true;
			tente.y=720;
			createjs.Tween.get(tente).wait(4000).to({y:150},750,createjs.Ease.quadOut);
			sons[3].play();
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
		stage.update();
	}
	function apaga(){
		stage.removeChild(this);

	}
	function caixaTexto(texto){

		var txt = new createjs.Text(texto, tamanhoTextoBotao+"px VAG Rounded BT", "#000000");
		txt.textAlign = "center";
		txt.lineWidth = tamanhoBt[0];
		
		var tamX=txt.getBounds().width+80;
		var tamY=txt.getBounds().height+50;
		txt.regY=tamY/2-35;

		var button = new createjs.Shape();
		button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, tamY);
		button.graphics.drawRoundRect(0,0,tamanhoBt[0],tamanhoBt[1],20);
		button.graphics.endFill();
		button.regX=tamanhoBt[0]/2;
		button.regY=tamanhoBt[1]/2-10;

		var t = new createjs.Container();
		t.addChild(button);
		t.addChild(txt);

		return t;

	}

	function reseta(){
		createjs.Tween.removeTweens(chegada);
		chegada.rotation=-30;
		chegada.visible=false;
		pistas[0].x=0;
		pistas[1].x=1280;
		pistas[2].x=1280;
		pistas[3].x=1280;
		tente.visible=false;
		positivo.visible=false;
		count=0;
		i_erros=0;
		i_acertos=0;
		for(var i=0;i<3;i++){
			createjs.Tween.removeTweens(cont_carro[i]);
			cont_carro[i].x=50;
			createjs.Tween.removeTweens(carros[i]);
			carros[i].x=0;
		}
		iniciaCorrida();
	}
	function init2() {
		var index;
		for (index in sons) {
			var t = sons[index];
			sons[index] = new Audio(caminho + t);
		}
		if(_naoembaralhar){
			
		}else{
			shuffle(_itens);

		}
		canvas = document.getElementById(idCanvas);
		stage = new createjs.Stage(canvas);
		stage.enableMouseOver(10);
		fundo = new createjs.Container();
		content = new createjs.Container();
		telaEscolha = new createjs.Container();

		createjs.Touch.enable(stage);
		stage.enableMouseOver(10);
		stage.mouseMoveOutside = true; 

		perguntas = new createjs.Container();
		for(var i=0;i<pistas.length;i++){
			var t=caminho+pistas[i];
			pistas[i] = new createjs.Bitmap(t);
			pistas[i].image.onload = function(){};
			stage.addChild(pistas[i]);
		}
		pistas[0].x=0;
		pistas[1].x=1280;
		pistas[2].x=1280;
		pistas[3].x=1280;

		stage.addChild(content);
		stage.addChild(perguntas);
		stage.addChild(telaEscolha);

		var spriteSheet = new createjs.SpriteSheet({
			framerate: 20,
			"images": [caminho+"rastro.png"],
			"frames": {"regX": 0, "height": 113, "count": 6, "regY": 0, "width": 180},
			"animations": {
				"idle": 0,
				"fumaca1": [0, 5, "fumaca1",0.5]
			}
		});

		for(var i=0;i<3;i++){
			sheets[i] = new createjs.SpriteSheet({
				framerate: 20,
				"images": ["resources/image/cavalo_sheet"+i+".png"],
				"frames": {"regX": 0, "height": 255, "count": 6, "regY": 0, "width": 400},
				"animations": {
					"idle": 0,
					"corre": [1, 5, "corre",0.5]
				}
			});
			cont_carro[i] = new createjs.Container();
			carros[i] = new createjs.Sprite(sheets[i], "idle");


			cont_carro[i].addChild(carros[i]);
			content.addChild(cont_carro[i]);
			cont_carro[i].x=150;
			cont_carro[i].y=70+i*140;

			fumaca[i] = new createjs.Sprite(spriteSheet, "idle");
			cont_carro[i].addChild(fumaca[i]);
			fumaca[i].gotoAndPlay("fumaca1");
			fumaca[i].x=-80;
			fumaca[i].y=190;
			fumaca[i].visible=false;


		}
		var fundo_esc = new createjs.Bitmap(caminho+"escolha.png");
		fundo_esc.image.onload = function(){};
		telaEscolha.addChild(fundo_esc);

		tutorial = new createjs.Bitmap(caminho+"tutorial.png");
		tutorial.image.onload = function(){};
		stage.addChild(tutorial);
		tutorial.on("click", function() {
			tutorial.visible=false;

		});
		if(!mostraTutorial){
			tutorial.visible=false;
		}
		var spriteSheet = new createjs.SpriteSheet({
			framerate: 20,
			"images": ["resources/image/rastro.png"],
			"frames": {"regX": 0, "height": 113, "count": 6, "regY": 0, "width": 180},
			"animations": {
				"idle": 0,
				"fumaca1": [0, 5, "fumaca1",0.5]
			}
		});
		btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
		btinicia.image.onload = function(){};
		stage.addChild(btinicia);
		btinicia.on("click", function() {
			var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
			btinicia.visible=false;
			carrosBt=[];
			inicio1=true;
			for(var i=0;i<3;i++){

				carrosBt[i] = new createjs.Container();
				carrosBt[i] = new createjs.Bitmap(caminho+"cavalo"+i+".png");
				carrosBt[i].image.onload = function(){};
				telaEscolha.addChild(carrosBt[i]);
				carrosBt[i].x=i*260+150;
				carrosBt[i].y=i*100+200;
				carrosBt[i].n=i;
				carrosBt[i].on("mousedown", function (evt) {
					if(inicio1){
						inicio1=false;
						for(var i=0;i<3;i++){
							carrosBt[i].alpha=0;
						}
						escolha=this.n;

						var iconePlayer = new createjs.Bitmap(caminho+"iconeplayer.png");
						iconePlayer.image.onload = function(){};
						iconePlayer.x=300;
						iconePlayer.alpha=0.7;
						cont_carro[this.n].addChild(iconePlayer);

						this.alpha=1;
						createjs.Tween.get(this).to({x:1500},1200,createjs.Ease.backIn).call(iniciaCorrida);
					}
				});
				if(ativaTempo){
					dif.visible=false;
				}
			}


		});
		positivo = new createjs.Bitmap(caminho+"positivo.png");
		positivo.image.onload = function(){};
		stage.addChild(positivo);
		positivo.x=460;
		positivo.y=150;
		positivo.visible=false;
		positivo.on("click", function() {
			reseta();

		});

		tente = new createjs.Bitmap(caminho+"tentenovamente.png");
		tente.image.onload = function(){};
		stage.addChild(tente);
		tente.x=470;
		tente.y=150;
		tente.visible=false;
		tente.on("click", function() {
			reseta();

		});

		chegada = new createjs.Bitmap(caminho+"chegada.png");
		chegada.image.onload = function(){};
		stage.addChild(chegada);
		chegada.regX=347;
		chegada.regY=360;
		chegada.x=1180;
		chegada.y=730;
		chegada.rotation=-30;
		chegada.visible=false;

		dificuldade();
		if(!ativaTempo){
			dif.visible=false;
		}

		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", ticker);
	}
	init2();
}