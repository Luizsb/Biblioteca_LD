/*
V2.3 alterado 11/6/2019
-foi feito cache do bitmap em criaLetra pra melhorar performance

v2.2
-adicionadas dicas por fase
*/

var AppCacaPalavras=function(idCanvas,words,temDica,tamanhoHorizontal,tamanhoVertical,letters,cordoFundo,_infantil,_btiniciar,_dicaPorFase){
	var canvas, stage,
	caminho="resources/image/",
	content,
	contentLinhas,
	contenthit,
	fundo,
	letras=[],
	count=0,
	itensCount=0,
	shapes=[],
	hits=[],
	btinicia,
	bt_dicas,
	dicas,
	margemX,
	margemY,
	g,
	c1,
	c2,
	line,
	dica=true,
	update=false,
	startTime,
	formatted,
	i_erros=0,
	matrix = [],
	gabarito	=	[],
	corrects	=	[],
	directions	=	['hLtoR', 'vTtoB', 'hLtoR', 'vTtoB', 'dTLtoRB'],
	sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];


	var clickCoords, releaseCoords;
	var index;
	var t;
	for (index in sons) {
		t = sons[index];
		sons[index] = new Audio(caminho + t);
	}
	canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	content = new createjs.Container();
	contentLinhas = new createjs.Container();
	contenthit = new createjs.Container();
	fundo = new createjs.Container();
	createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;
	stage.snapToPixelEnabled =true;

	stage.addChild(fundo);
	stage.addChild(content);
	stage.addChild(contenthit);
	stage.addChild(contentLinhas);


	criaFundo(0,0,stage.canvas.width,$('#' + idCanvas).attr('height'));
    /*
    document.getElementById("palavrasdoCacaPalavra").innerHTML = itens[itensCount].gabarito;
    */

    bt_dicas	=	new createjs.Bitmap(caminho+"bt_dicas.png");

    if(temDica){


    	bt_dicas.image.onload = function(){};
    	stage.addChild(bt_dicas);
    	bt_dicas.x=1215;
    	bt_dicas.y=10;
    	bt_dicas.on("click", function() {
    		abreRecolhe();
    	});


    }


    if(_btiniciar!=null){
    	btinicia = new createjs.Bitmap(caminho+_btiniciar);
    }else{
    	btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
    }

    btinicia.image.onload = function(){};
    stage.addChild(btinicia);

    btinicia.on("click", function () {
    	var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
    	if(stage.mouseX>940 && stage.mouseX<968){
    		if(stage.mouseY>367 && stage.mouseY<400){
    			letters = ['-'];
    		}
    	}
    	btinicia.visible = false;
        if(temDica){
           createjs.Tween.get(this).wait(1200).call(abreRecolhe);
       }
       startTime = Date.now();
       criaFase(words);
   });

    g = new createjs.Graphics().f("red").dc(0,0,0);
    c1 = new createjs.Shape(g);
    c2 = new createjs.Shape(g);

    line = new createjs.Shape();
    line.alpha=0.3;
    line.graphics.beginStroke("red").setStrokeStyle(35,"round");
    line.pos1 = line.graphics.moveTo(0,10).command;
    line.pos2 = line.graphics.lineTo(10,10).command;
    stage.addChild(c1,c2,line);
    line.visible=false;

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(60);

    function criaFase(words){
    	update=true;
    	letras=[];
    	hits=[];
    	matrix=[];
    	gabarito=[];
    	corrects=[];
    	count=0;

    	if(itens.length>1){
    		animaTitulo(itens[itensCount].tituloFase);  
    	}
    	if(_dicaPorFase && itensCount>0){
    		abreRecolhe();
    	}

    	var rows	=	rows	?	rows	:	tamanhoVertical;
    	var columns	=	columns	?	columns	:	tamanhoHorizontal;
    	var i,r,j;

    	for(i = 0; i < words.length; i++){
    		rows	=	rows	>=	words[i].length	?	rows	:	words[i].length;
    		columns	=	columns	>=	words[i].length	?	columns	:	words[i].length;
    	}

    	for(r = 0; r < rows; r++){
    		var array	=	[];
    		var c;

    		for(c = 0; c < columns; c++){
    			array.push('');
    		}

    		matrix[r]	=	array;
    	}

    	for(i = 0; i < words.length; i++){
    		placeWord(words[i], directions.randomItem());
    	}


    	for(i = 0; i < matrix.length; i++){
    		for(j = 0; j < matrix[i].length; j++){
    			if(matrix[i][j]==''){
    				matrix[i][j]=letters.randomItem();
    			}
    		}
    	}
    	if(((rows * 55) + 100)>720){
    		$('#' + idCanvas).attr('height', (rows * 55) + 100);
    	}	

    	fundo.removeAllChildren();
    	criaFundo(0,0,stage.canvas.width,$('#' + idCanvas).attr('height'));

    	margemX	=	(stage.canvas.width - (columns * 55)) / 2;
    	margemY	=	30;


    	content.removeAllChildren();
    	contenthit.removeAllChildren();
    	contentLinhas.removeAllChildren();


    	var si=0;
    	for (j = 0; j < matrix.length; j++) {
    		for (i = 0; i < matrix[j].length; i++) {

    			letras[si]=criaLetra(matrix[j][i].toUpperCase(),40,55,55);
    			content.addChild(letras[si]);
    			letras[si].px=i*57+margemX;
    			letras[si].x=-50;
    			letras[si].y=j*57+margemY;
    			letras[si].scaleX=letras[si].scaleY=0.0;

    			if(matrix[j][i] !== 0){
    				hits[si] = criaBt(55,55,matrix[j][i],i,j);
    				contenthit.addChild(hits[si]);
    				hits[si].x=i*57+margemX;
    				hits[si].y=j*57+margemY;
    				hits[si].alpha=0.01;
    				hits[si].name=matrix[j][i];
    				hits[si].fila=j;
    				hits[si].coluna=i;

    				hits[si].on("mousedown", function (evt) {
    					var n		=	this.name-1;
    					clickCoords	=	this.fila + ',' + this.coluna;

    					c1.x=this.x+28;
    					c1.y=this.y+28;
    					c2.x=this.x+28;
    					c2.y=this.y+28;

    				});

    				hits[si].on("pressmove", function (evt) {
    					c2.x=evt.stageX;
    					c2.y=evt.stageY;
    					line.visible=true;

    				});

    				hits[si].on("pressup", function (evt) {
    					
    					if(contenthit.getObjectUnderPoint(evt.stageX, evt.stageY) != null){
    						var volta		=	true;
    						var n			=	this.name-1;
    						var t			=	contenthit.getObjectUnderPoint(evt.stageX, evt.stageY);
    						releaseCoords	=	t.fila + ',' + t.coluna;
    						wordCoords		=	'first: ' + clickCoords + ' - last: ' + releaseCoords;
    						if(gabarito.indexOf(wordCoords) >= 0 && corrects.indexOf(gabarito.indexOf(wordCoords)) == -1){
    							corrects.push(gabarito.indexOf(wordCoords));
    							volta=false;
    							count++;
    							sons[0].play();
    							animaIco('certo',t.parent.x,t.parent.y);
    							novalinha = new createjs.Shape();
    							novalinha.alpha=0.3;
    							novalinha.graphics.beginStroke("blue").setStrokeStyle(35,"round");
    							novalinha.pos1 = novalinha.graphics.moveTo(c1.x,c1.y).command;
    							novalinha.pos2 = novalinha.graphics.lineTo(c2.x,c2.y).command;
    							contentLinhas.addChild(novalinha);
    							if (count == words.length) {
    								fim(idCanvas, words, columns, rows);
    							}
    						}
    						if(volta){
    							sons[1].play();
    							i_erros++;
    						}
    					}
    					
    					line.visible	=	false;
    				});
    			}
    			si++;
    		}
    	}
    	shuffle(letras);
    	for (j = 0; j < letras.length; j++) {
    		if(letras[j]!=null){
    			letras[j].rotation=-Math.random()*360;
    			createjs.Tween.get(letras[j]).wait(250+j*2).to({rotation:0,x:letras[j].px,scaleX:1,scaleY:1},500,createjs.Ease.backOut);
    		}
    	}
    }
    function abreRecolhe(){
    	if(dica){
    		/* ve se tem dica para cada fase*/
    		if(_dicaPorFase){
    			dicas		=	new createjs.Bitmap(caminho+"dicas_"+idCanvas+"_fase"+(itensCount+1)+".png");
    		}else{
    			dicas		=	new createjs.Bitmap(caminho+"dicas_"+idCanvas+".png");

    		}

    		dicas.image.onload = function(){};
    		stage.addChild(dicas);
    		dicas.x=1150;
    		dicas.y=30;
    		dicas.scaleX=0.1;
    		dicas.scaleY=0.1;
    		dicas.alpha=0;
    		dicas.on("click", function() {
    			abreRecolhe();
    		});
    		createjs.Tween.get(dicas,{override:true}).to({x:0,y:0,scaleX:1,scaleY:1,alpha:1},500,createjs.Ease.backOut);
    		dica=false;
    	}else{
    		stage.removeChild(dicas);
    		dica=true;
    	}


    }

    function criaGui(idCanvas, words, hasTips, columns, rows){

    	var contentgui = new createjs.Container();
    	stage.addChild(contentgui);
    	var gui = new createjs.Bitmap(caminho+"gui.png");
    	gui.image.onload = function(){};
    	contentgui.addChild(gui);
    	contentgui.on("click", function() {
    		stage.removeChild(contentgui);
    		itensCount=0;
    		criaFase(itens[itensCount].palavras);

    	});


    	var texto_tempo = new createjs.Text(formatted, "bold 40px VAG Rounded BT", "#000000");
    	texto_tempo.x=295;
    	texto_tempo.y=140;
    	texto_tempo.textAlign = "center";
    	contentgui.addChild(texto_tempo);

    	var texto_errado = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#000000");
    	texto_errado.x=295;
    	texto_errado.y=210;
    	texto_errado.textAlign = "center";
    	contentgui.addChild(texto_errado);


    	contentgui.x=-800;
    	contentgui.y=160;
    	createjs.Tween.get(contentgui).to({x: 300}, 600,createjs.Ease.backOut);
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
    function animaTitulo(texto){
    	var tit = new createjs.Container();
    	stage.addChild(tit);

    	var txt = new createjs.Text(texto, "bold 50px VAG Rounded BT", "#ffc000");
    	txt.regY=60;
    	txt.textAlign = "center";
    	txt.lineWidth = 850;

    	var contorno = new createjs.Text(texto, "bold 50px VAG Rounded BT", "#000000");
    	contorno.regY=60;
    	contorno.textAlign = "center";
    	contorno.outline = 12;
    	contorno.lineWidth = 850;


    	tit.addChild(contorno);
    	tit.addChild(txt);

    	tit.x=-300;
    	tit.y=80;
    	createjs.Tween.get(tit).to({x:640},300,createjs.Ease.backOut).wait(3000).to({x:2200},300,createjs.Ease.backIn).call(deletaTitulo);
    }
    function deletaTitulo(){

    }
    function animaIco(qual,b,c){
    	var ico;
    	ico = new createjs.Bitmap(caminho+qual+".png");
    	stage.addChild(ico);
    	ico.x = b;
    	ico.y = c;
    	ico.regX=98;
    	ico.regY=98;
    	ico.scaleX=ico.scaleY=0.1;
    	createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},200,createjs.Ease.quadOut).wait(500).call(deletaIco);
    }

    function deletaIco(){
    	stage.removeChild(this);
    }

    function apaga(e){
    	content.removeChild(this);
    }

    function fim(idCanvas, words, hasTips, columns, rows){
    	update=false;
    	itensCount++;
    	console.log(itensCount);
    	if(itensCount<itens.length){
        //criaFase(itens[itensCount].palavras);
        createjs.Tween.get(btinicia).wait(1500).call(criaFase,[itens[itensCount].palavras]);
    }else{

    	criaGui(idCanvas, words, hasTips, columns, rows);
    	sons[2].play();

    }

}

function tick(event) {

	stage.update(event);
	if(update){
		checkTime();
		line.pos1.x = c1.x;
		line.pos1.y = c1.y;
		line.pos2.x = c2.x;
		line.pos2.y = c2.y;
	}
}

function checkTime(){
	var timeDifference = Date.now() - startTime;
	formatted = convertTime(timeDifference);
}

function convertTime(miliseconds) {
	var totalSeconds = Math.floor(miliseconds/1000);
	var minutes = Math.floor(totalSeconds/60);
	var seconds = totalSeconds - minutes * 60;
	if(seconds<10){
		seconds='0'+seconds;
	}
	return minutes + ':' + seconds;
}

function criaFundo(px,py,tamX,tamY){
	var extensao=cordoFundo[itensCount][0].split('.').pop();

	var shape;
	if(extensao=='jpg' || extensao=='png'){
		shape = new createjs.Bitmap(caminho+cordoFundo[itensCount][0]);
		shape.image.onload = function () {};
		fundo.addChild(shape);

	}else{
		shape = new createjs.Shape();
		shape.graphics.beginRadialGradientFill([cordoFundo[itensCount][0],cordoFundo[itensCount][1]], [0, 1], 640, 360, 0, 640, 360, 600).drawCircle(100, 100, 50);
		shape.graphics.drawRect(0,0,tamX,tamY);
		shape.graphics.endFill();
		fundo.addChild(shape);
	}




}

function criaLetra(texto,tam,tamX,tamY){

	var txt = new createjs.Text(texto, "bold "+tam+"px VAG Rounded BT", "#000000");
	txt.y=10;
	txt.x=28;
	txt.textAlign = "center";
	//txt.snapToPixel = true;


	var button = new createjs.Shape();
	button.graphics.beginLinearGradientFill(["#ffffff", "#dbdbdb"], [0, 1], 0, 0, 0, tamY);
	button.graphics.drawRect(0, 0, tamX, tamY);
	button.graphics.endFill();
	//button.snapToPixel = true;

	var border = new createjs.Shape();
	border.graphics.beginStroke("#999999");
	border.graphics.setStrokeStyle(3);
	border.graphics.drawRect(0, 0, tamX, tamY);
	//border.snapToPixel = true;

	var resp = new createjs.Container();
	resp.addChild(button);
	resp.addChild(txt);
	resp.addChild(border);
	setTimeout(function(){resp.cache(0, 0, 55, 55);},700);
	

	return resp;
}

function criaBt(tamX,tamY,n,c,f){

	var button = new createjs.Shape();
	button.graphics.beginFill("#000000").drawRect(0, 0, tamX, tamY);
	button.coluna=c;
	button.fila=f;

	var resp = new createjs.Container();
	resp.addChild(button);

	return resp;
}

Array.prototype.randomItem = function () {
	return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.randomIndex = function () {
	return Math.floor(Math.random() * this.length);
}

function placeWord(word, direction){
	if(_infantil){
		hLtoR(word);
	}else{
		switch(direction) {
			case 'hLtoR':
			hLtoR(word);
			break;
			case 'vTtoB':
			vTtoB(word);
			break;
			case 'dTLtoRB':
			dTLtoRB(word);
			break;
		}
	}
}

function hLtoR(word){
	var lineIndex			=	matrix.randomIndex(),
	line				=	matrix[lineIndex],
	firstLetterIndex	=	Math.floor(Math.random() * (line.length - word.length)),
	canInsert			=	true;

	for(letter in word){	/* checa se da para inserir a palavra na linha selecionada*/
		var matrixLineLetterIndex	= 	parseInt(firstLetterIndex) + parseInt(letter);

		if(matrix[lineIndex][matrixLineLetterIndex] !== '' && matrix[lineIndex][matrixLineLetterIndex] !== word[letter] ){
			canInsert	=	false;
			placeWord(word, directions.randomItem());
			return false;
		}
	}

	if(canInsert){
		for(letter in word){	/*	insere a palavra na linha selecionada*/
			var matrixLineLetterIndex	= 	parseInt(firstLetterIndex) + parseInt(letter);
			matrix[lineIndex][matrixLineLetterIndex]	=	word[letter];
		}

		gabarito.push( 'first: ' + (lineIndex + ',' + firstLetterIndex) + ' - last: ' + (lineIndex + ',' + (firstLetterIndex + word.length - 1)) );
	}
}

function vTtoB(word){
	var firstLetterRowIndex	=	Math.floor(Math.random() * (matrix.length - word.length)),
	randomColumn		=	Math.floor(Math.random() * (matrix[0].length)),
	canInsert			=	true;

	for(letter in word){	/* checa se da para inserir a palavra na linha selecionada*/
		var	letterRow	=	parseInt(firstLetterRowIndex) + parseInt(letter);

		if(matrix[letterRow][randomColumn] !== '' && matrix[letterRow][randomColumn] !== word[letter]){
			canInsert	=	false;
			placeWord(word, directions.randomItem());
			return	false;
		}
	}

	if(canInsert){
		for(letter in word){	/*	insere a palavra na linha selecionada*/
			var matrixLineLetterIndex	= 	parseInt(firstLetterRowIndex) + parseInt(letter);

			matrix[matrixLineLetterIndex][randomColumn]	=	word[letter];
		}

		gabarito.push( 'first: ' + (firstLetterRowIndex + ',' + randomColumn) + ' - last: ' + (firstLetterRowIndex + word.length - 1) + ',' + randomColumn );
	}

}

function dTLtoRB(word){
	var	firstLetterRowIndex		=	Math.floor(Math.random() * (matrix.length - word.length)),
	line					=	matrix[firstLetterRowIndex],
	firstLetterColumnIndex	=	Math.floor(Math.random() * (line.length - word.length)),
	canInsert				=	true;

	for(letter in word){
		var	letterRow		=	parseInt(firstLetterRowIndex)		+	parseInt(letter),
		letterColumn	=	parseInt(firstLetterColumnIndex)	+	parseInt(letter);

		if(matrix[letterRow][letterColumn] !== '' && matrix[letterRow][letterColumn] !== word[letter]){
			canInsert	=	false;
			placeWord(word, directions.randomItem());
			return	false;
		}
	}

	if(canInsert){
		for(letter in word){
			var	matrixLetterRow		=	parseInt(firstLetterRowIndex)		+	parseInt(letter),
			matrixLetterColumn	=	parseInt(firstLetterColumnIndex)	+	parseInt(letter);

			matrix[matrixLetterRow][matrixLetterColumn]	=	word[letter];
		}

		gabarito.push( 'first: ' + (firstLetterRowIndex + ',' + firstLetterColumnIndex) + ' - last: ' + (firstLetterRowIndex + word.length - 1) + ',' + (firstLetterColumnIndex + word.length - 1) );

	}
}

function resetAll(){
	canvas			=	{};
	stage			=	{};
	content			=	{};
	contentLinhas	=	{};
	contenthit		=	{};
	letras			=	[];
	corrects	=	[];
	i				=	0;
	count			=	0;

	si				=	0;
	shapes			=	[];
	hits			=	[];
	btinicia		=	{};
	bt_dicas		=	{};
	dicas			=	{};
	g				=	{};
	c1				=	{};
	c2				=	{};
	line			=	{};
	dica			=	true;
	update			=	false;
	startTime		=	{};
	formatted		=	'';
	i_erros			=	0;
	matrix			=	[];
	gabarito		=	[];
}
}