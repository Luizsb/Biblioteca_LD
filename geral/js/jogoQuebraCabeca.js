/*
21/12/2018
-quando carregava de novo o jogo depois de jogar uma peça voltava da fase anterior
*/

var AppJigsaw=function (idCanvas,descricaoFases,_btiniciar,_enunciado=null,imagemGui,_trilha=null) {
	var stage,canvas,contentComplete,content,
	shapes=[],
	bmps=[],
	fase=0,
	gabaritoX=[],
	gabaritoY=[],
	imgLargura,
	imgAltura,
	linhas,
	colunas,
	tamanhoX,
	tamanhoY,
	offX,
	offY,
	musicafundo,
	pareVerificacao=false,
	caminho="resources/image/";

	function criaFase(){
		shapes=[];
		bmps=[];
		gabaritoX=[];
		gabaritoY=[];


		if(Object.keys(descricaoFases).length === 0 || typeof descricaoFases[fase] === 'undefined'){
			pareVerificacao = true;
			fim();
		}

		animaTitulo(descricaoFases[fase].titulo);

		content.removeAllChildren();

		imgLargura=descricaoFases[fase].imgLargura;
		imgAltura=descricaoFases[fase].imgAltura;
		linhas=descricaoFases[fase].linhas;
		colunas=descricaoFases[fase].colunas;

		tamanhoX=Math.floor(imgLargura/colunas);
		tamanhoY=Math.floor(imgAltura/linhas);

		offX=640-imgLargura/2;
		offY=380-imgAltura/2;
		var j,i;

		var shape = new createjs.Shape();
		shape.graphics
		.beginStroke("#000000")
		.setStrokeStyle(2)
		.moveTo(offX,offY)
		.lineTo(offX+tamanhoX*colunas,offY)
		.lineTo(offX+tamanhoX*colunas,offY+tamanhoY*linhas)
		.lineTo(offX,offY+tamanhoY*linhas)
		.lineTo(offX,offY)
		.endStroke();
		content.addChild(shape);

		var si=0;
		for (j = 0; j < linhas; j++) {
			for (i = 0; i < colunas; i++) {

				var px=i*tamanhoX+offX;
				var py=j*tamanhoY+offY;

				shapes[si] = new createjs.Shape();
				/*ajuste de performance para sombra*/
				if(linhas<=8){
					shapes[si].shadow = new createjs.Shadow("#000000", 2, 2, 0);
				}
				shapes[si].id=si;
				if(i==0 && j==0){
					if(linhas<=1){
						canto1isolado(shapes[si],tamanhoX,tamanhoY,0,0);                 
					}else{
						canto1(shapes[si],tamanhoX,tamanhoY,0,0);
					}
				}else if(i>0 && i<colunas-1 && j==0){
					if(linhas<=1){
						retaTopoisolado(shapes[si],tamanhoX,tamanhoY,0,0);                
					}else{
						retaTopo(shapes[si],tamanhoX,tamanhoY,0,0);
					}
				}else if(i==colunas-1 && j==0){
					if(linhas<=1){
						canto2isolado(shapes[si],tamanhoX,tamanhoY,0,0);                 
					}else{
						canto2(shapes[si],tamanhoX,tamanhoY,0,0);
					}
				}else if(i==colunas-1 && j>0 && j<linhas-1){
					retaRight(shapes[si],tamanhoX,tamanhoY,0,0);
				}else if(i==colunas-1 && j>0 && j==linhas-1){
					canto3(shapes[si],tamanhoX,tamanhoY,0,0);
				}else if(i>0 && i<colunas-1 && j==linhas-1){
					retaBottom(shapes[si],tamanhoX,tamanhoY,0,0);
				}else if(i==0 && j==linhas-1){
					canto4(shapes[si],tamanhoX,tamanhoY,0,0);
				}else if(i==0 && i<colunas-1 && j>0){
					retaLeft(shapes[si],tamanhoX,tamanhoY,0,0);
				}else{
					modelo1(shapes[si],tamanhoX,tamanhoY,0,0);
				}

				shapes[si].cola=[i-1,j+1,i+1,j-1];
				shapes[si].line=j;
				shapes[si].column=i;

				shapes[si].x=px;
				shapes[si].y=py;
				shapes[si].ox=px;
				shapes[si].oy=py;

				content.addChild(shapes[si]);
				gabaritoX[si]=shapes[si].x;
				gabaritoY[si]=shapes[si].y;
				shapes[si].alpha=0.5;
				shapes[si].pode=true;

				bmps[si] = new createjs.Bitmap(caminho+descricaoFases[fase].imagem);
				bmps[si].image.onload = function(){};
				content.addChild(bmps[si]);
				bmps[si].x=offX;
				bmps[si].y=offY;
				bmps[si].ox=offX;
				bmps[si].oy=offY;

				bmps[si].mask = shapes[si];
				shapes[si].on("mousedown", function (evt) {
					if(this.pode){

						content.setChildIndex(this, content.numChildren-1);
						content.setChildIndex(bmps[this.id], content.numChildren-1);
						var global = content.localToGlobal(this.x, this.y);
						this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
					}
				});

				shapes[si].on("pressmove", function (evt) {
					if(this.pode){
						var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
						this.x = local.x;
						this.y = local.y;
						bmps[this.id].x=local.x-(this.ox-offX);
						bmps[this.id].y=local.y-(this.oy-offY);
					}
				});

				shapes[si].on("pressup", function (evt) {

					if(this.pode){
						var i;
						var conferido=false;
						/*confere se foi solto no local senao confere colisoes entre pecas*/
						if(collisionDetect(this,gabaritoX[this.id],gabaritoY[this.id])){
							contentComplete.addChild(this);
							contentComplete.addChild(bmps[this.id]);

							this.pode=false;
							this.x=this.ox;
							this.y=this.oy;
							bmps[this.id].x=this.x-(this.ox-offX);
							bmps[this.id].y=this.y-(this.oy-offY);
							this.shadow = null;

						}else{

							if((this.id-colunas)>0 && collisionDetect2(this,shapes[this.id-colunas])){
								conferido=true;
								var t=this.id-colunas;
							}else if((this.id+colunas)<shapes.length && collisionDetect2(this,shapes[this.id+colunas])){
								conferido=true;
								var t=this.id+colunas;
							}else if((this.id+1)<shapes.length && collisionDetect2(this,shapes[this.id+1])){
								conferido=true;
								var t=this.id+1;
							}else if((this.id-1)>0 && collisionDetect2(this,shapes[this.id-1])){
								conferido=true;
								var t=this.id-1;
							}
							if(conferido){
								contentComplete.addChild(this);
								contentComplete.addChild(shapes[t]);
								contentComplete.addChild(bmps[this.id]);
								contentComplete.addChild(bmps[t]);
  /*
  this.x=this.ox;
  this.y=this.oy;

     shapes[t].x=shapes[t].ox;
     shapes[t].y=shapes[t].oy;

     bmps[this.id].x=this.x-(this.ox-offX);
     bmps[this.id].y=this.y-(this.oy-offY);

     bmps[t].x=this.x-(this.ox-offX);
     bmps[t].y=this.y-(this.oy-offY);
     */

     createjs.Tween.get(this).to({x:this.ox,y:this.oy},1000,createjs.Ease.bounceOut);
     createjs.Tween.get(shapes[t]).to({x:shapes[t].ox,y:shapes[t].oy},1000,createjs.Ease.bounceOut);
     createjs.Tween.get(bmps[this.id]).to({x:this.ox-(this.ox-offX),y:this.oy-(this.oy-offY)},1000,createjs.Ease.bounceOut);
     createjs.Tween.get(bmps[t]).to({x:this.ox-(this.ox-offX),y:this.oy-(this.oy-offY)},1000,createjs.Ease.bounceOut);

     this.pode=false;
     shapes[t].pode=false;

     this.shadow = null;
     shapes[t].shadow = null;
 }
}
}
createjs.Tween.get(content,{override:true}).wait(2000).call(verificaPosicoes);

});
				si++;
			}
		}
		for(i=0;i<shapes.length;i++){
			var rand=Math.floor(Math.random()*4);
			var px,py;
			if(rand==0){
				/*esquerda*/
				px=Math.random()*100;
				py=Math.random()*(canvas.height-tamanhoY);
			}else if(rand==1){
				/*topo*/
				px=Math.random()*(canvas.width-tamanhoX);
				py=Math.random()*tamanhoY;
			}else if(rand==2){
				/*direita*/
				px=Math.random()*150+(canvas.width-tamanhoX)-150;
				py=Math.random()*(canvas.height-tamanhoY);
			}else if(rand==3){
				/*bottom*/
				px=Math.random()*(canvas.width-tamanhoX);
				py=(Math.random()*tamanhoY)+(canvas.height-tamanhoY)-tamanhoY;
			}
			shapes[i].x=px;
			shapes[i].y=py;
			bmps[i].x=px-(shapes[i].ox-offX);
			bmps[i].y=py-(shapes[i].oy-offY);

		}
	}

	function animaTitulo(texto){
		var tit = new createjs.Container();
		contentComplete.addChild(tit);

		var txt = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#ffffff");
		txt.regY=60;
		txt.textAlign = "center";

		var contorno = new createjs.Text(texto, "bold 60px VAG Rounded BT", "#000000");
		contorno.regY=60;
		contorno.textAlign = "center";
		contorno.outline = 12;

		tit.addChild(contorno);
		tit.addChild(txt);

		tit.x=-300;
		tit.y=80;
		createjs.Tween.get(tit).to({x:640},300,createjs.Ease.backOut);
	}

	function verificaPosicoes(){
		if(pareVerificacao==false){
			/* melhorar, as vezes nao conta todos*/
			var contaPontos=0;
			for(i=0;i<shapes.length;i++){
				/*var colisao = ndgmr.checkRectCollision(hits[i],this);*/
				if(collisionDetect(shapes[i],shapes[i].ox,shapes[i].oy)){
					contaPontos++;
				}
			}
			console.log(shapes.length+"  "+contaPontos);
			if(contaPontos==shapes.length){
     // pareVerificacao=false;
     console.log("tudo certo");
     animaIco('certo',150,150);
     createjs.Tween.get(contentComplete).wait(50).call(verificaFeed);
 }
}
}

function verificaFeed(){
	if(descricaoFases[fase].textoFinal.length>5){
		var textoResposta= new createjs.Bitmap(caminho+descricaoFases[fase].textoFinal);
		textoResposta.image.onload = function(){};
		textoResposta.on("mousedown", function (evt) {
			stage.removeChild(this);
			proximaFase();
		});

		textoResposta.alpha=0;
		createjs.Tween.get(textoResposta).to({alpha:1},1000,createjs.Ease.linear);

		stage.addChild(textoResposta);

	}else{
		proximaFase();
	}
}

function proximaFase(){
	if(fase<descricaoFases.length-1){
		console.log('proxima fase');
        //content.removeAllChildren();
        contentComplete.removeAllChildren();
        fase++;
        criaFase();  
        pareVerificacao=false;

    }else{
    	fim();
    	console.log('fim');
    	pareVerificacao=true;
    }
}

function canto1(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx*.9, cy+sy*.3)
	.bezierCurveTo(cx+sx*1.3,cy+sy*.3,cx+sx*1.3,cy+sy*.7,cx+sx*.9, cy+sy*.7)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx+sx*.7, cy+sy*.9)
	.bezierCurveTo(cx+sx*.7,cy+sy*1.3,cx+sx*.3,cy+sy*1.3,cx+sx*.3, cy+sy*.9)
	.lineTo(cx, cy+sy)
	.lineTo(cx, cy)
	.endFill();
}
    //pra 2 ou 3 pecas
    function canto1isolado(ctx, sx, sy, cx, cy) {
    	ctx.graphics
    	.setStrokeStyle(1)
    	.beginFill("#000000")
    	.lineTo(cx, cy)
    	.lineTo(cx+sx, cy)
    	.lineTo(cx+sx*.9, cy+sy*.3)
    	.bezierCurveTo(cx+sx*1.3,cy+sy*.3,cx+sx*1.3,cy+sy*.7,cx+sx*.9, cy+sy*.7)
    	.lineTo(cx+sx, cy+sy)
    	.lineTo(cx+sx*.7, cy+sy*.9)
    	.lineTo(cx+sx, cy+sy)
    	.lineTo(cx, cy+sy)
    	.lineTo(cx, cy)
    	.endFill();
    }
    

    function retaTopo(ctx, sx, sy, cx, cy) {
    	ctx.graphics
    	.setStrokeStyle(1)
    	.beginFill("#000000")
    	.lineTo(cx, cy)
    	.lineTo(cx+sx, cy)
    	.lineTo(cx+sx*.9, cy+sy*.3)
    	.bezierCurveTo(cx+sx*1.3,cy+sy*.3,cx+sx*1.3,cy+sy*.7,cx+sx*.9, cy+sy*.7)
    	.lineTo(cx+sx, cy+sy)
    	.lineTo(cx+sx*.7, cy+sy*.9)
    	.bezierCurveTo(cx+sx*.7,cy+sy*1.3,cx+sx*.3,cy+sy*1.3,cx+sx*.3, cy+sy*.9)
    	.lineTo(cx, cy+sy)
    	.lineTo(cx+sx*-.1, cy+sy*.7)
    	.bezierCurveTo(cx+sx*.3,cy+sy*.7,cx+sx*.3,cy+sy*.3,cx+sx*-.1, cy+sy*.3)
    	.lineTo(cx, cy)
    	.endFill();
    }
//pra 2 ou 3 pecas
function retaTopoisolado(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx*.9, cy+sy*.3)
	.bezierCurveTo(cx+sx*1.3,cy+sy*.3,cx+sx*1.3,cy+sy*.7,cx+sx*.9, cy+sy*.7)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx+sx*.7, cy+sy*.9)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx, cy+sy)
	.lineTo(cx+sx*-.1, cy+sy*.7)
	.bezierCurveTo(cx+sx*.3,cy+sy*.7,cx+sx*.3,cy+sy*.3,cx+sx*-.1, cy+sy*.3)
	.lineTo(cx, cy)
	.endFill();
}
function canto2(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx+sx*.7, cy+sy*.9)
	.bezierCurveTo(cx+sx*.7,cy+sy*1.3,cx+sx*.3,cy+sy*1.3,cx+sx*.3, cy+sy*.9)
	.lineTo(cx, cy+sy)
	.lineTo(cx+sx*-.1, cy+sy*.7)
	.bezierCurveTo(cx+sx*.3,cy+sy*.7,cx+sx*.3,cy+sy*.3,cx+sx*-.1, cy+sy*.3)
	.lineTo(cx, cy)
	.endFill();
}
//pra 2 ou 3 pecas
function canto2isolado(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx+sx*.7, cy+sy*.9)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx, cy+sy)
	.lineTo(cx+sx*-.1, cy+sy*.7)
	.bezierCurveTo(cx+sx*.3,cy+sy*.7,cx+sx*.3,cy+sy*.3,cx+sx*-.1, cy+sy*.3)
	.lineTo(cx, cy)
	.endFill();
}

function retaRight(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx*.3, cy+sy*-.1)
	.bezierCurveTo(cx+sx*.3,cy+sy*.3,cx+sx*.7,cy+sy*.3,cx+sx*.7, cy+sy*-.1)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx+sx*.7, cy+sy*.9)
	.bezierCurveTo(cx+sx*.7,cy+sy*1.3,cx+sx*.3,cy+sy*1.3,cx+sx*.3, cy+sy*.9)
	.lineTo(cx, cy+sy)
	.lineTo(cx+sx*-.1, cy+sy*.7)
	.bezierCurveTo(cx+sx*.3,cy+sy*.7,cx+sx*.3,cy+sy*.3,cx+sx*-.1, cy+sy*.3)
	.lineTo(cx, cy)
	.endFill();
}

function canto3(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx*.3, cy+sy*-.1)
	.bezierCurveTo(cx+sx*.3,cy+sy*.3,cx+sx*.7,cy+sy*.3,cx+sx*.7, cy+sy*-.1)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx, cy+sy)
	.lineTo(cx+sx*-.1, cy+sy*.7)
	.bezierCurveTo(cx+sx*.3,cy+sy*.7,cx+sx*.3,cy+sy*.3,cx+sx*-.1, cy+sy*.3)
	.lineTo(cx, cy)
	.endFill();
}

function retaBottom(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx*.3, cy+sy*-.1)
	.bezierCurveTo(cx+sx*.3,cy+sy*.3,cx+sx*.7,cy+sy*.3,cx+sx*.7, cy+sy*-.1)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx*.9, cy+sy*.3)
	.bezierCurveTo(cx+sx*1.3,cy+sy*.3,cx+sx*1.3,cy+sy*.7,cx+sx*.9, cy+sy*.7)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx, cy+sy)
	.lineTo(cx+sx*-.1, cy+sy*.7)
	.bezierCurveTo(cx+sx*.3,cy+sy*.7,cx+sx*.3,cy+sy*.3,cx+sx*-.1, cy+sy*.3)
	.lineTo(cx, cy)
	.endFill();
}

function canto4(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx*.3, cy+sy*-.1)
	.bezierCurveTo(cx+sx*.3,cy+sy*.3,cx+sx*.7,cy+sy*.3,cx+sx*.7, cy+sy*-.1)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx*.9, cy+sy*.3)
	.bezierCurveTo(cx+sx*1.3,cy+sy*.3,cx+sx*1.3,cy+sy*.7,cx+sx*.9, cy+sy*.7)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx, cy+sy)
	.lineTo(cx, cy)
	.endFill();
}

function retaLeft(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx*.3, cy+sy*-.1)
	.bezierCurveTo(cx+sx*.3,cy+sy*.3,cx+sx*.7,cy+sy*.3,cx+sx*.7, cy+sy*-.1)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx*.9, cy+sy*.3)
	.bezierCurveTo(cx+sx*1.3,cy+sy*.3,cx+sx*1.3,cy+sy*.7,cx+sx*.9, cy+sy*.7)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx+sx*.7, cy+sy*.9)
	.bezierCurveTo(cx+sx*.7,cy+sy*1.3,cx+sx*.3,cy+sy*1.3,cx+sx*.3, cy+sy*.9)
	.lineTo(cx, cy+sy)
	.lineTo(cx, cy)
	.endFill();
}

function modelo1(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx*.3, cy+sy*-.1)
	.bezierCurveTo(cx+sx*.3,cy+sy*.3,cx+sx*.7,cy+sy*.3,cx+sx*.7, cy+sy*-.1)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx*.9, cy+sy*.3)
	.bezierCurveTo(cx+sx*1.3,cy+sy*.3,cx+sx*1.3,cy+sy*.7,cx+sx*.9, cy+sy*.7)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx+sx*.7, cy+sy*.9)
	.bezierCurveTo(cx+sx*.7,cy+sy*1.3,cx+sx*.3,cy+sy*1.3,cx+sx*.3, cy+sy*.9)
	.lineTo(cx, cy+sy)
	.lineTo(cx+sx*-.1, cy+sy*.7)
	.bezierCurveTo(cx+sx*.3,cy+sy*.7,cx+sx*.3,cy+sy*.3,cx+sx*-.1, cy+sy*.3)
	.lineTo(cx, cy)
	.endFill();
}

function modelo2(ctx, sx, sy, cx, cy) {
	ctx.graphics
	.setStrokeStyle(1)
	.beginFill("#000000")
	.lineTo(cx, cy)
	.lineTo(cx+sx*.3, cy+sy*-.1)
	.lineTo(cx+sx*.5, cy+sy*+.2)
	.lineTo(cx+sx*.7, cy+sy*-.1)
	.lineTo(cx+sx, cy)
	.lineTo(cx+sx*.9, cy+sy*.3)
	.lineTo(cx+sx*1.2, cy+sy*.5)
	.lineTo(cx+sx*.9, cy+sy*.7)
	.lineTo(cx+sx, cy+sy)
	.lineTo(cx+sx*.7, cy+sy*1.1)
	.lineTo(cx+sx*.5, cy+sy*.9)
	.lineTo(cx+sx*.3, cy+sy*1.1)
	.lineTo(cx, cy+sy)
	.lineTo(cx+sx*.1, cy+sy*.7)
	.lineTo(cx+sx*-.17, cy+sy*.5)
	.lineTo(cx+sx*.1, cy+sy*.3)
	.lineTo(cx, cy)
	.endFill();
}




function collisionDetect(object1,bx1,by1){
	var ax1 = object1.x;
	var ay1 = object1.y;
	var ax2 = object1.x + 30;
	var ay2 = object1.y + 30;

	var bx2= bx1 + 30;
	var by2= by1 + 30;

	if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1)
	{
		return true;
	} else {
		return false;
	}
}

function collisionDetect2(object1, object2){
	var ax1 = object1.x;
	var ay1 = object1.y;
	var ax2 = object1.x + tamanhoX*1.1;
	var ay2 = object1.y + tamanhoY*1.1;

	var bx1 = object2.x;
	var by1= object2.y;
	var bx2= bx1 + tamanhoX*1.1;
	var by2= by1 + tamanhoY*1.1;

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

function animaIco(qual,b,c){
	var ico;
	ico = new createjs.Bitmap(caminho+qual+".png");
	content.addChild(ico);
	ico.x = b;
	ico.y = c;
	ico.regX=155;
	ico.regY=155;
	ico.scaleX=ico.scaleY=0.1;
	createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut);
}

function tick(event) {
	stage.update();
}

function fim(){
	if(_trilha){
		musicafundo.pause();
	}
	var img;
	var bo;
	var continua=false;
	img=caminho+"positivo.png";
	continua=true;
	var paragensSom=new Audio(caminho+"PARABENS.mp3");
	paragensSom.play();

	if(continua){
		bo = new createjs.Bitmap(img);
		bo.image.onload = function(){};
		bo.regX=269/2
		bo.regY=450/2;
		bo.x=640;
		bo.y=1000;
		bo.scaleX=bo.scaleY=1;
		stage.addChild(bo);
		createjs.Tween.get(bo).wait(200).to({y:360},1000,createjs.Ease.bounceOut);
		bo.on("mousedown", function (evt) {
			if(_trilha){
				musicafundo.play();
			}
			pareVerificacao=false;
			stage.removeChild(this);
			content.removeAllChildren();
			contentComplete.removeAllChildren();
			fase=0;
			criaFase();
		});
	}
}

function init_cacaPalavras() {
	canvas=document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	content = new createjs.Container();
	contentComplete = new createjs.Container();

	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;

	var fundo= new createjs.Bitmap(caminho+"fundo_jigsaw.png");
	fundo.image.onload = function(){};
	stage.addChild(fundo);
	stage.addChild(contentComplete);
	stage.addChild(content);


	var btinicio;
	if(_btiniciar!=null){
		btinicio = new createjs.Bitmap(caminho+_btiniciar);
	}else{
		btinicio = new createjs.Bitmap(caminho+"bt_iniciar.png");
	}

	btinicio.image.onload = function(){};
	btinicio.on("mousedown", function (evt) {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		stage.removeChild(this);
		if(_trilha){
			musicafundo=new Audio(caminho+_trilha);
			musicafundo.play();
			musicafundo.loop=true;
		}
		criaFase();
		if(_enunciado){
			var enun=new Audio(caminho+_enunciado);
			enun.play();
		}
	});

	stage.addChild(btinicio);

	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(60);

}
init_cacaPalavras();
}
