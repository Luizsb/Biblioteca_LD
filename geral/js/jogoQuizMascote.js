var AppquizMascote=function(idCanvas,imgFundo,_itens,ativaTempo,tempoPergunta,tamTextoPergunta,tamTextoResposta,tamanhoBalao,larguraBotao){

	var canvas,
	stage,
	fundo,
	conta,
	hit,
	mascote,
	olho,
	olho2,
	boca,
	count=0,
	word,
	inicio1=false,
	btinicia,
	fumacinha,
	relogio,
	gui,
	i_acertos=0,
	i_erros=0,
	txt_a,
	txt_e,
	bts = [],
	piscadarate=0,
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"],
	caminho='resources/image/';



	function criaGui(){
		gui = new createjs.Container();
		stage.addChild(gui);

		var _gui = new createjs.Bitmap(caminho+"acertos.png");
		_gui.image.onload = function(){};

		txt_a = new createjs.Text(0, "bold 120px VAG Rounded BT", "#000000");
		txt_a.textAlign = "center";
		txt_a.x=150;
		txt_a.y=130;


		gui.addChild(_gui);
		gui.addChild(txt_a);
		gui.x=420;
		gui.y=200;

	}
	function formulaPergunta(){
		console.log(_itens[count].palavras);

		boca.gotoAndPlay("fala");

		createjs.Tween.get(mascote).to({rotation:10,y:750}, 500,createjs.Ease.backOut).wait(350).to({rotation:0}, 250,createjs.Ease.backOut);

		conta.removeAllChildren();
		inicio1=true;

		word=textoContorno(_itens[count].pergunta);
		word.x=-900;
		word.y=100;
		word.name=_itens[count].resposta;
		conta.addChild(word);
		shuffle(_itens[count].palavras);
		createjs.Tween.get(word).to({x:750},300,createjs.Ease.backOut);
		var i;
		for(i=0;i<_itens[count].palavras.length;i++){
			bts[i] = caixaTexto(_itens[count].palavras[i]);
			conta.addChild(bts[i]);
			bts[i].x=-900;
			bts[i].px=750;
			bts[i].y=bts[i].py=_itens[count].posicoesBotoes[i][1];
			console.log(i*75+300);
			bts[i].alpha=0.8;
			bts[i].pode=true;
			bts[i].id=i;
			bts[i].name=_itens[count].palavras[i];
			createjs.Tween.get(bts[i]).wait(1400+i*20).to({x:750},300,createjs.Ease.backOut);
			bts[i].on("mousedown", function (evt) {
				if(this.pode && inicio1){
					this.parent.addChild(this);
					var global = conta.localToGlobal(this.x, this.y);
					this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
					this.alpha=1;

				}
			});
			bts[i].on("pressmove", function (evt) {
				if(this.pode && inicio1){
					var local = conta.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
					this.x = local.x;
					this.y = local.y;
				}
			});
			bts[i].on("pressup", function (evt) {
				if(this.pode && inicio1){
					this.pode=false;
					var volta=true;
					if(this.name==word.name){
						acerto=true;
						volta=false;
						inicio1=false;
                        //this.x=word.x;
                        //this.y=word.y+tamanhoBalao[1]/4;
                        sons[0].play();

                        i_acertos++;

                        animaIco("certo",this.px,this.py+65);

                        createjs.Tween.removeTweens(word);
                        createjs.Tween.get(word).wait(3000).call(proxima);

                        for(i=0; i<bts.length;i++){
                        	bts[i].visible = false;
                        }
                        bts[this.id].visible=true;
                    }

                    if(volta){
                    	sons[1].play();
                    	i_erros++;
                    	txt_a.text=i_erros;
                    	createjs.Tween.get(this).to({x:this.px,y:this.py},500,createjs.Ease.backOut);
                    	animaIco("errado",this.px,this.py+65);
                    	this.alpha=0.5;
                    }
                }    

            });


		}
		if(ativaTempo){
			relogio.gotoAndPlay("tempo1");
			relogio.y=900;
			relogio.scaleX=relogio.scaleY=0.4;
			createjs.Tween.get(relogio).wait(1200).to({y:600,scaleX:1,scaleY:1,rotation:10}, 250,createjs.Ease.backOut).wait(350).to({rotation:-5}, 250,createjs.Ease.backOut).wait(tempoPergunta).call(proxima);
		}
	}
	function proxima(){
		inicio1=true;
		if(count<(_itens.length-1)){
			count++;
			formulaPergunta();
			if(ativaTempo){
				relogio.y=900;
				fumacinha.gotoAndPlay("fumaca1");	
				fumacinha.x = 1160;
				fumacinha.y = 600;
			}
		}else{
			verificaFim();
			relogio.y=900;
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

	function verificaFim(){
		var img;
		var bo;
		var continua=false;
		gui.visible=true;
		if(i_erros>2){
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
			createjs.Tween.removeTweens(word);
			conta.removeAllChildren();

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
				conta.removeAllChildren();
				count=0;
				gui.visible=false;
				i_acertos=0;
				i_erros=0;
				txt_a.text=i_erros;

				formulaPergunta();
			});


		}

	}
	function animaIco(qual,b,c){
		var ico;
		ico = new createjs.Bitmap(caminho+qual+".png");
		conta.addChild(ico);
		ico.x = b+220;
		ico.y = c-80;
		ico.regX=150;
		ico.regY=150;
		ico.scaleX=ico.scaleY=0.1;
		if(qual=="errado"){
			createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut).wait(1000).call(deleta);
		}else{
			createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut);  
		}

	}
	function deleta(){
		conta.removeChild(this);
	}
	function criaFundo(px,py,tamX,tamY){
		var shape = new createjs.Shape();
		shape.graphics.beginLinearGradientFill(["#4b9d1f", "#447824"], [0, 1], 0, 0, 0, tamY);
		shape.graphics.drawRoundRect(0,0,tamX,tamY,0);
		shape.graphics.endFill();
		stage.addChild(shape);
		fundo = new createjs.Bitmap(caminho+"fundo_od1.png");
		fundo.image.onload = function(){};
		stage.addChild(fundo);
	}

	function textoContorno(texto){
		var nome=texto;
		var extensao=nome.split('.').pop();
		var bt;
		var txt;
		if(extensao=='jpg' || extensao=='png'){
			txt = new createjs.Bitmap(caminho+nome);
			txt.image.onload = function () {
				txt.regX=txt.getBounds().width/2;
				txt.regY=txt.getBounds().height/2;
			};
			txt.tipo="imagem";
		}else{
			txt = new createjs.Text(texto, tamTextoPergunta+"px VAG Rounded BT", "#000000");
			txt.textAlign = "center";
			txt.y=20;
			txt.lineWidth = tamanhoBalao[0]-100; 
			var tamX=txt.getBounds().width+80;
			var tamY=txt.getBounds().height+50;
			txt.regY=tamY/2;
		}

		button = new createjs.Bitmap(caminho+"balao.png");
		button.image.onload = function(){};
		button.regX=tamanhoBalao[0]/2;
		button.regY=tamanhoBalao[1]/2;
		//stage.addChild(button);

		var resp = new createjs.Container();

		resp.addChild(button);
		resp.addChild(txt);

		return resp;

	}

	function caixaTexto(texto){

		var txt = new createjs.Text(texto, tamTextoResposta+"px VAG Rounded BT", "#000000");




		txt.textAlign = "center";
		txt.lineWidth=larguraBotao;
		var tamX=txt.getBounds().width+80;
		var tamY=txt.getBounds().height+30;
		txt.regY=tamY/2-35;

		var button = new createjs.Shape();
		button.graphics.beginLinearGradientFill(["#ffe400", "#ffae00"], [0, 1], 0, 0, 0, tamY);
		button.graphics.drawRoundRect(0,0,tamX,tamY,20);
		button.graphics.endFill();
		button.regX=tamX/2;
		button.regY=tamY/2;

		var resp = new createjs.Container();
		resp.addChild(button);
		resp.addChild(txt);
		txt.y=-10;

		return resp;

	}
	function ticker(event){
		stage.update();
		piscadarate++;
		if(piscadarate>180){
			olho.gotoAndPlay("pisca");
			piscadarate=0;
		}
	}
	function collisionDetect(object1, object2){
		var ax1 = object1.x;
		var ay1 = object1.y;
		var ax2 = object1.x + 500;
		var ay2 = object1.y + 75;

		var bx1 = object2.x;
		var by1= object2.y;
		var bx2= bx1 + 500;
		var by2= by1 + 75;

		if(object1 == object2) 
		{
			return false;
		}
		if (ax1 <= bx2 && ax2 >= bx1 &&
			ay1 <= by2 && ay2 >= by1)
		{
			return true;
		} else {

			return false;
		}  
	}
	function init() {
		canvas = document.getElementById(idCanvas);
		stage = new createjs.Stage(canvas);
		stage.enableMouseOver(10);

		createjs.Touch.enable(stage);
		stage.enableMouseOver(10);
		stage.mouseMoveOutside = true;

		criaFundo(0,0,1280,720);
		var index;
		for (index in sons) {
			var t = sons[index];
			sons[index] = new Audio(caminho + t);
		}


		shuffle(_itens);

		conta = new createjs.Container();
		stage.addChild(conta);
		mascote = new createjs.Container();
		stage.addChild(mascote);
		mascote.regX=350;
		mascote.regY=666;
		mascote.x=350;
		mascote.y=1100;
		mascote.rotation=90;


		var masc_img = new createjs.Bitmap(caminho+"mascote.png");
		masc_img.image.onload = function(){};
		mascote.addChild(masc_img);

		var spriteBoca = new createjs.SpriteSheet({
			framerate: 20,
			"images": [caminho+"boca.png"],
			"frames": {"regX": 0, "height": 156, "count": 7, "regY": 0, "width": 278},
			"animations": {
				"idle": 0,
				"fala": [1, 6, "fala2",0.4],
				"fala2": [1, 6, "fala3",0.4],
				"fala3": [1, 6, "idle",0.4]
			}
		});
		boca = new createjs.Sprite(spriteBoca, "idle");
		mascote.addChild(boca);
		boca.x=140;
		boca.y=350;
		boca.rotation=-8;
		var spriteOlho = new createjs.SpriteSheet({
			framerate: 20,
			"images": [caminho+"pisca.png"],
			"frames": {"regX": 0, "height": 191, "count": 7, "regY": 0, "width": 329},
			"animations": {
				"idle": 0,
				"pausa":[0,0,"pisca",0.1],
				"pisca": [1, 6, "idle",0.7]
			}
		});
		olho = new createjs.Sprite(spriteOlho, "idle");
		mascote.addChild(olho);
		olho.x=100;
		olho.y=142;


		btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
		btinicia.image.onload = function(){};
		stage.addChild(btinicia);
		btinicia.on("click", function() {
			var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
			btinicia.visible=false;
			formulaPergunta();
			criaGui();
			gui.visible=false;
			boca.gotoAndPlay("fala");
			olho.gotoAndPlay("pisca");

		});
		var spriteRelogio = new createjs.SpriteSheet({
			framerate: 20,
			"images": [caminho+"relogio.png"],
			"frames": {"regX": 100, "height": 214, "count": 13, "regY": 107, "width": 200},
			"animations": {
				"idle": 0,
				"idle2": 12,
				"tempo1": [0, 12, "idle2",0.035]
			}
		});
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
		fumacinha = new createjs.Sprite(spriteSheet, "idle");
		stage.addChild(fumacinha);

		relogio = new createjs.Sprite(spriteRelogio, "idle");
		stage.addChild(relogio);
		relogio.x=1160;
		relogio.y=900;

		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", ticker);
	}
	init();
}