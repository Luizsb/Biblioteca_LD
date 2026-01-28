var App=function (idCanvas,tamanhoPergunta,errosPermitidos,veloBolha,tempoPergunta,_bolhas,_itens,animaBolhasFundo,frequencia,unicaResposta,_musica,_erroTeto,_fullScreen) {

	'use strict';
	var canvas, stage, fundo, content, conta, hit,
	n_resp=6,
	freq=0,
	freq2=0,
	count=0,
	word,
	inicio1=false,
	gui,
	i_acertos=0,
	i_erros=0,
	txt_a,
	txt_e,
	btinicia,
	pos=[],
	subCount1=0,
	subCount2=0,
	btFull,
	caminho="resources/image/",
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3","bubble.mp3"];


	function criaGui(){
		gui = new createjs.Container();
		stage.addChild(gui);

		var _gui = new createjs.Bitmap(caminho+"gui.png");
		_gui.image.onload = function(){};


		txt_a = new createjs.Text(0, "bold 40px VAG Rounded BT", "#000000");
		txt_a.textAlign = "left";
		txt_a.x=220;
		txt_a.y=25;

		txt_e = new createjs.Text(0, "bold 40px VAG Rounded BT", "#b10000");
		txt_e.textAlign = "left";
		txt_e.x=220;
		txt_e.y=100;

		gui.addChild(_gui);
		gui.addChild(txt_a);
		gui.addChild(txt_e);

	}
	function formulaPergunta(){
		shuffle(_itens[count].opcoesErradas);
		subCount1=0;
		subCount2=0;
		if(_itens[count].audioEnunciado){
			var aud = new Audio(caminho+_itens[count].audioEnunciado);
			aud.play(); 
		}
		inicio1=true;
		var extensao=_itens[count].palavra.split('.').pop();
		if(extensao=='jpg' || extensao=='png'){
			word= new createjs.Bitmap(caminho+_itens[count].palavra);
			word.image.onload = function(){};
			word.regX=640;
			word.x=-640;
			word.y=470;

		}else{
			word=textoContorno(_itens[count].palavra,tamanhoPergunta);
			word.x=-640;
			word.y=600;
		}
		content.addChild(word);
		createjs.Tween.get(word).wait(500).to({x:640},300,createjs.Ease.backOut).wait(tempoPergunta).call(proxima);
	}

	function proxima(){
		var i;
		for(i=0;i<conta.getNumChildren();i++){
			var filho=conta.getChildAt(i);
			createjs.Tween.get(filho,{override:true}).to({y:-300},200+Math.random()*100,createjs.Ease.backIn).call(deleta);
		}
		content.removeAllChildren();
		if(count<_itens.length-1){
			count++;
			formulaPergunta();
		}else{
			verificaFim();
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
	function formaBolha(texto,_largura,_altura){
		var txt;
		var resp = new createjs.Container();
		var escolhaBolha=Math.floor(Math.random()*_bolhas.length);
		var bo = new createjs.Bitmap(caminho+_bolhas[escolhaBolha].img);
		bo.image.onload = function(){};
		bo.regX=_bolhas[escolhaBolha].largura/2;
		bo.regY=_bolhas[escolhaBolha].altura/2;
		bo.alpha=0.75;
		/*bo.scaleX=bo.scaleY=0.4+(Math.random()*30)/100;*/
		resp.id=texto;
		resp.pode=true;
		resp.addChild(bo);


		var extensao=texto.split('.').pop();
		if(extensao=='jpg' || extensao=='png'){
			txt= new createjs.Bitmap(caminho+texto);
			txt.image.onload = function(){};
			txt.regX=_largura/2;
			txt.regY=_altura/2;

		}else{
			txt = new createjs.Text(texto.toUpperCase(), tamanhoPergunta+"px VAG Rounded BT", "#000000");
			txt.textAlign = "center";
			txt.letterSpacing = 20;
			txt.lineWidth=_largura;
			txt.regY=txt.getBounds().height/2;

		}
		txt.y=_bolhas[escolhaBolha].posTexto;

		resp.addChild(txt);

		conta.addChild(resp);
		resp.y=720+_bolhas[escolhaBolha].altura/2;

		resp.x=Math.floor(Math.random()*900+200);
		createjs.Tween.get(resp).to({y:550},500,createjs.Ease.quadOut).to({y:-300},veloBolha+Math.random()*veloBolha,createjs.Ease.linear).call(deletaBalao,[texto,resp]);
		resp.on("mousedown", function (evt) {
			if(this.pode){
				this.pode=false;
				if(_itens[count].opcoesCorretas.indexOf(this.id)>-1){
					sons[4].play();
					conta.removeChild(this);
					popBolha(this.x,this.y);
					popCerto(this.x,this.y);
					i_acertos++;
					txt_a.text=i_acertos;
					if(unicaResposta){
						createjs.Tween.removeTweens(word);
						proxima();
					}
				}else{
					sons[1].play();
					popIcone('errado.png',0,0,this);
					i_erros++;
					txt_e.text=i_erros;
				}
			}
		});
	}

	function deletaBalao(texto,resp){
		if(_erroTeto){
			if(_itens[count].opcoesCorretas.indexOf(resp.id)<0){
				i_erros++;
				txt_e.text=i_erros;
			}
		}
		stage.removeChild(this);
/*
    if(_itens[count].opcoesCorretas.indexOf(texto)){
        i_erros++;
        txt_e.text=i_erros;
    }
    */
}
function verificaFim(){
	var img;
	var bo;
	var continua=false;
	if(i_erros>=errosPermitidos){
		img=caminho+"tentenovamente.png";
		continua=true;
		sons[3].play();
	}else if(i_erros==0 && i_acertos==0){
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

		bo = new createjs.Bitmap(img);
		bo.image.onload = function(){};
		bo.regX=269/2;
		bo.regY=450/2;
		bo.x=640;
		bo.y=1000;
		stage.addChild(bo);
		createjs.Tween.get(bo).wait(2000).to({y:350},1000,createjs.Ease.backOut);
		bo.on("mousedown", function (evt) {
			stage.removeChild(this);
			count=0;
			i_acertos=0;
			txt_a.text=i_acertos;
			i_erros=0;
			txt_e.text=i_erros;

			formulaPergunta();
		});


	}

}
function popBolha(px,py){
	var bo = new createjs.Bitmap(caminho+"bolha_pop.png");
	bo.image.onload = function(){};
	bo.regX=bo.regY=155;
	bo.scaleX=bo.scaleY=0.5;
	bo.x=px;
	bo.y=py;
	stage.addChild(bo);
	createjs.Tween.get(bo).to({scaleX:1.5,scaleY:1.5},150,createjs.Ease.linear).call(deleta);
}
function popCerto(px,py){
	var bo = new createjs.Bitmap(caminho+"certo.png");
	bo.image.onload = function(){};
	bo.regX=bo.regY=155;
	bo.scaleX=bo.scaleY=0.5;
	bo.x=px;
	bo.y=py;
	stage.addChild(bo);
	createjs.Tween.get(bo).to({scaleX:1,scaleY:1},200,createjs.Ease.quadOut).to({scaleX:0.5,scaleY:0.5},300,createjs.Ease.quadOut).call(deleta);
}
function popIcone(qual,px,py,cont){
	var ico = new createjs.Bitmap(caminho+qual);
	ico.image.onload = function(){};
	ico.regX=ico.regY=155;
	ico.scaleX=ico.scaleY=0.01;
	ico.x=px;
	ico.y=py;
	cont.addChild(ico);
	createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},150,createjs.Ease.linear);
}
function deleta(){
	stage.removeChild(this);
}
function textoContorno(texto,tamanho){

	var txt = new createjs.Text(texto, "bold "+tamanho+"px VAG Rounded BT", "#ffffff");
	txt.regY=60;
	txt.textAlign = "center";
	txt.lineWidth = 1100;

	var contorno = new createjs.Text(texto, "bold "+tamanho+"px VAG Rounded BT", "#000000");
	contorno.regY=60;
	contorno.textAlign = "center";
	contorno.outline = 10;
	contorno.lineWidth = 1100;

	var resp = new createjs.Container();

	resp.addChild(contorno);
	resp.addChild(txt);

	return resp;

}
function ticker(event){
	stage.update();

	if(inicio1){
		var nu;
		if(freq2>(veloBolha/frequencia)){
			freq2=0;
			formaBolha(_itens[count].opcoesErradas[subCount2]/*nome da imagem*/,_itens[count].larguraImg/*largura em pixels*/,_itens[count].alturaImg/*altura pixels*/);
			if(subCount2==_itens[count].opcoesErradas.length-1){
				subCount2=0;
			}else{
				subCount2++;
			}

		}else{
			freq2++;
		}
	}
}

function init() {
	var index;
	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}

	shuffle(_itens);

	canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);

	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;


	var fundo = new createjs.Bitmap(caminho+"fundo.png");
	fundo.image.onload = function(){};
	stage.addChild(fundo);


	if(animaBolhasFundo){
		var bolhafundo1 = new createjs.Bitmap(caminho+"bol_fundo.png");
		bolhafundo1.image.onload = function(){};
		stage.addChild(bolhafundo1);
		bolhafundo1.y=0;
	}



	conta = new createjs.Container();
	stage.addChild(conta);

	content = new createjs.Container();
	stage.addChild(content);



	btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
	btinicia.image.onload = function(){};
	stage.addChild(btinicia);
	btinicia.on("click", function() {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		if(animaBolhasFundo){
			createjs.Tween.get(bolhafundo1,{loop:true}).wait(100).to({y:-719},10000,createjs.Ease.linear);
		}
		btinicia.visible=false;
		formulaPergunta();
		criaGui();
		if(_musica){
			var musica=new Audio(caminho+_musica);
			musica.play();

		}


	});

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", ticker);
}
var queue = new createjs.LoadQueue();
queue.on("complete", loaded);
queue.loadManifest(
	[{
		id: "full1",
		src: caminho+"btFullscreen.png"
	},
	{
		id: "full2",
		src: caminho+"btFullscreen2.png"
	}
	]);
function loaded()
{
	if(_fullScreen){
		btFull = new createjs.Bitmap(queue.getResult("full1")).set({x:1150,y:600,scaleX:1,scaleY:1});
		stage.addChild(btFull);
		btFull.addEventListener("click", function(){
			alternaFullScreen(idCanvas,btFull,queue.getResult("full1"),queue.getResult("full2"));
		}, false);
	}
}
init();
}
