/*
Alteracao 12/12/2018
caminho fora do modulo estava errado

Alteracao 27/11/2018 Augusto
-adicionado fora do modulo pra quando estiver fora
Alteracao 23/11/2018 Augusto
-faltava adicinar , na var 'som' pra tornar ela privada
-correcao do audio que da pause e volta no comeco*/
var AppPlayer2 = function(canvasID, somPraTocar, imagem1, imagem2, _texto, tamanhoTexto, posTxt, foraDoModulo,imagensLocais,offsetInfos)
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
	som,
	arrastando=false,
	textoTempo,
	count=0,
	update=false,
	primeiroClique=true,
	inicioBarrinha=0,
	totalBarrinha=0,
	textoPlayer,
	som= null;

	canvas = document.getElementById(canvasID);
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);
	createjs.Touch.enable(stage);
	contenthit = new createjs.Container();
	contentFixado = new createjs.Container();
	contentFundo = new createjs.Container();
	content = new createjs.Container();

	if(offsetInfos){
		inicioBarrinha=offsetInfos[0];
		totalBarrinha=totalBarrinha+480;
	}else{
		inicioBarrinha=120;
		totalBarrinha=totalBarrinha+480;
	}

if(foraDoModulo){
	caminhoGeral="../../../../../../geral/image/";
}

	stage.addChild(contentFundo);
var fundo;
console.log(imagensLocais);
if(imagensLocais){
	fundo= new createjs.Bitmap(caminho+'audio_toca_fundo.png');
}else{
canvas.width=640;
	fundo= new createjs.Bitmap(caminhoGeral+'audio_toca_fundo.png');
}

	fundo.image.onload = function(){};
	contentFundo.addChild(fundo);
	fundo.on("click", function() {
		if(stage.mouseX>inicioBarrinha && stage.mouseX<(totalBarrinha+inicioBarrinha)){
			arrastando=true;
			barrinha.scaleX=(stage.mouseX-inicioBarrinha)/490;
			var currentTime = som.currentTime;
			var duration = som.duration;
			som.currentTime=barrinha.scaleX*duration;
			arrastando=false;
		}
	});
	if(imagensLocais){
	bt1 = new createjs.Bitmap(caminho+'audio_toca_bt1.png');
	}else{
bt1 = new createjs.Bitmap(caminhoGeral+'audio_toca_bt1.png');
bt1.x=57;
bt1.y=54;
bt1.regX=83/2;
bt1.regY=83/2;
	}

	bt1.image.onload = function(){};
	stage.addChild(bt1);

	bt1.on("click", function() {
		if(primeiroClique){


		som.addEventListener("timeupdate", function() {
			var currentTime = som.currentTime;
			var duration = som.duration;
			textoTempo.text=Math.floor(som.currentTime)+'/'+Math.floor(som.duration)+'s';
			stage.update();
			if(!arrastando){
				barrinha.scaleX=currentTime/duration;
				handle.x=barrinha.getBounds().width*barrinha.scaleX+inicioBarrinha;
			}
		});

		som.addEventListener("ended", function() {

			handle.x=inicioBarrinha;
			barrinha.scaleX=0;
			bt1.visible=true;
			bt2.visible=false;

			setTimeout(function(){
				/*createjs.Ticker.off("tick", ticker)*/
				console.log("update = false");
				update=false;
				stage.update();
			}, 150);
		});
		primeiroClique=false;
}
		som.play();
		bt1.visible=false;
		bt2.visible=true;
		handle.visible=true;
		if(!update){
			update=true;
			console.log("update = true");
			/*createjs.Ticker.addEventListener("tick", ticker)*/
		}
	});
	if(imagensLocais){
		bt2 = new createjs.Bitmap(caminho+'audio_toca_bt2.png');

	}else{
		bt2 = new createjs.Bitmap(caminhoGeral+'audio_toca_bt2.png');
		bt2.x=57;
		bt2.y=54;
		bt2.regX=83/2;
		bt2.regY=83/2;

	}

	bt2.image.onload = function(){};
	bt2.visible=false;
	stage.addChild(bt2);
	bt2.on("click", function() {
		som.pause();
		bt1.visible=true;
		bt2.visible=false;
	});
	if(imagensLocais){
	barrinha = new createjs.Bitmap(caminho+'audio_toca_bar.png');
	}else{
barrinha = new createjs.Bitmap(caminhoGeral+'audio_toca_bar.png');
	}

	barrinha.image.onload = function(){};
	if(offsetInfos){
		barrinha.x=offsetInfos[0];
		barrinha.y=offsetInfos[1];
	}else{
		barrinha.x=inicioBarrinha;
		barrinha.y=65;
	}
	barrinha.scaleX=0;
	stage.addChild(barrinha);
	if(imagensLocais){
	handle = new createjs.Bitmap(caminho+'audio_toca_handle.png');
	}else{
handle = new createjs.Bitmap(caminhoGeral+'audio_toca_handle.png');
	}

	handle.image.onload = function(){};

	if(offsetInfos){
		handle.x=offsetInfos[0];
		handle.y=offsetInfos[1];
	}else{
		handle.x=inicioBarrinha;
		handle.y=68;
	}
	handle.regX=77/2;
	handle.regY=77/2;
	//handle.visible=false;
	stage.addChild(handle);

	handle.on("mousedown", function (evt) {
		this.parent.addChild(this);
		var global = content.localToGlobal(this.x, this.y);
		this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};

		arrastando=true;
	});

	handle.on("pressmove", function (evt) {
		var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
		if(stage.mouseX>inicioBarrinha && stage.mouseX<(totalBarrinha+inicioBarrinha)){
			this.x = Math.floor(local.x);
			barrinha.scaleX=(stage.mouseX-inicioBarrinha)/490;
		}
	});

	handle.on("pressup", function (evt) {
		var currentTime = som.currentTime;
		var duration = som.duration;
		som.currentTime=barrinha.scaleX*duration;

		arrastando=false;
	});

	textoPlayer = new createjs.Text(_texto, "bold "+(tamanhoTexto-5)+"px VAG Rounded BT", "0x000000");
	textoPlayer.x=posTxt[0]-10;
	textoPlayer.y=posTxt[1]-34;
	textoPlayer.textAlign = "left";
	stage.addChild(textoPlayer);

som=new Audio(caminho+somPraTocar);
/*
som.addEventListener("canplay", function() {
	textoPlayer.text=_texto;
});
*/


	textoTempo = new createjs.Text('', "14px arial", "0x000000");
	if(offsetInfos){
		textoTempo.x=offsetInfos[0]+490;
		textoTempo.y=offsetInfos[1]-30;
	}else{
		textoTempo.x=610;
		textoTempo.y=45;
	}
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
