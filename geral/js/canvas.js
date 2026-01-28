var canvas = function(canvasID, somPraTocar, imagem1, imagem2, texto, tamanhoTexto, posTxt)
{
	var caminho="resources/image/",
	caminhoGeral="../../../../../geral/image/",
	canvas,
	stage,
	content,
	contentFundo,
	fundoAtual,
	contenthit,
	barrinha,
	handle,
	bt1,
	bt2,
	contentFixado,
	audioIngredientes,
	arrastando=false,
	textoTempo,
	count=0,
	update=false;

	som= null;

	canvas = document.getElementById(canvasID);
	canvas.width=640;
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);
	createjs.Touch.enable(stage);
	contenthit = new createjs.Container();
	contentFixado = new createjs.Container();
	contentFundo = new createjs.Container();
	content = new createjs.Container();

	stage.addChild(contentFundo);

	var fundo = new createjs.Bitmap(caminhoGeral+'audio_toca_fundo.png');
	fundo.image.onload = function(){};
	contentFundo.addChild(fundo);
	fundo.on("click", function() {
		if(stage.mouseX>120 && stage.mouseX<600){
			arrastando=true;
			barrinha.scaleX=(stage.mouseX-120)/490;
			var currentTime = som.currentTime;
			var duration = som.duration;
			som.currentTime=barrinha.scaleX*duration;
			arrastando=false;
		}
	}); 
	
	bt1 = new createjs.Bitmap(caminhoGeral+'audio_toca_bt1.png');
	bt1.image.onload = function(){};
	bt1.x=57;
	bt1.y=54;
	bt1.regX=83/2;
	bt1.regY=83/2;
	stage.addChild(bt1);
	bt1.on("click", function() {

			setTimeout(function(){
				/*createjs.Ticker.off("tick", ticker)*/
				console.log("update = false");
				update=false;
				stage.update();

			}, 150);
		});

		som.play();
		bt1.visible=false;
		bt2.visible=true;
		handle.visible=true;
		if(!update){
			update=true;
			console.log("update = true");
			/*createjs.Ticker.addEventListener("tick", ticker)*/
		}
	};  

	barrinha = new createjs.Bitmap(caminhoGeral+'audio_toca_bar.png');
	barrinha.image.onload = function(){};
	barrinha.x=120;
	barrinha.y=65;
	barrinha.scaleX=0; 
	stage.addChild(barrinha);

	handle = new createjs.Bitmap(caminhoGeral+'audio_toca_handle.png');
	handle.image.onload = function(){};
	handle.x=120;
	handle.y=68;
	handle.regX=77/2;
	handle.regY=77/2;
	handle.visible=false;
	stage.addChild(handle);

	handle.on("mousedown", function (evt) {
		this.parent.addChild(this);
		var global = content.localToGlobal(this.x, this.y);
		this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};

		arrastando=true;
	});

	handle.on("pressmove", function (evt) {
		var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
		if(stage.mouseX>120 && stage.mouseX<600){
			this.x = Math.floor(local.x);
			barrinha.scaleX=(stage.mouseX-120)/490;
		}
	});

	handle.on("pressup", function (evt) {
		var currentTime = som.currentTime;
		var duration = som.duration;
		som.currentTime=barrinha.scaleX*duration;

		arrastando=false;
	});

	var texto = new createjs.Text(texto, "bold "+(tamanhoTexto-5)+"px VAG Rounded BT", "0x000000");
	texto.x=posTxt[0]-10;
	texto.y=posTxt[1]-34;
	texto.textAlign = "left";
	stage.addChild(texto);

	textoTempo = new createjs.Text('', "14px arial", "0x000000");
	textoTempo.x=610;
	textoTempo.y=45;
	textoTempo.textAlign = "right";
	stage.addChild(textoTempo);

	stage.update();

	setTimeout(function(){
		stage.update();
	}, 1000);     
	setTimeout(function(){
		stage.update();
	}, 2500);

}
