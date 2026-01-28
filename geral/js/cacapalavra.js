var canvas, stage;
var content;
var contentLinhas;
var contenthit;
var letras=[];
var i=0;
var count=0;
var si=0;
var shapes=[];
var hits=[];
var acertos=[];
var edgeOffset = 40;
var words;
var btinicia;
var bt_dicas;
var dicas;
var margemX;
var margemY;
var telaFinal;
var g;
var c1;
var c2;
var line;
var dica=true;
var update=false;
var startTime;
var formatted;
var i_erros=0;
var matrix = [];
var	gabarito	=	[];
var corrects	=	[];

var possible	=	"ABCDEFGHIJKLMNOPQRSTUVWXYZÃÔÓÁ";
var	letters		=	['B','C','D','F','G','H','J','K','L','M','N','P','Q','R','S','T','V','W','X','Y','Z'];
var	directions	=	['hLtoR', 'vTtoB', 'hLtoR', 'vTtoB', 'dTLtoRB'];


function gameCacaPalavras(idCanvas, words, hasTips, columns, rows) {
	var clickCoords, releaseCoords;

	rows	=	rows	?	rows	:	15;
	columns	=	columns	?	columns	:	15;
    var i,r;

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
        var j;
		for(j = 0; j < matrix[i].length; j++){
			if(matrix[i][j]==''){
				matrix[i][j]=letters.randomItem();
            }
		}
	}

    canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	content = new createjs.Container();
	contentLinhas = new createjs.Container();
	contenthit = new createjs.Container();

	$('#' + idCanvas).attr('height', (rows * 55) + 100);

	margemX	=	(stage.canvas.width - (columns * 55)) / 2;
	margemY	=	30;


    createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;

	criaFundo(0,0,stage.canvas.width,$('#' + idCanvas).attr('height'));
	stage.addChild(content);
	stage.addChild(contenthit);
	stage.addChild(contentLinhas);

		dicas		=	new createjs.Bitmap("resources/image/dicas.png");
		bt_dicas	=	new createjs.Bitmap("resources/image/bt_dicas.png");

	if(hasTips){


		bt_dicas.image.onload = function(){};
	    stage.addChild(bt_dicas);
		bt_dicas.x=1210;
		bt_dicas.y=30;
		bt_dicas.on("click", function() {
	        dicas.visible=true;
			abreRecolhe();
		});
        
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
	}


	btinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
	btinicia.image.onload = function(){};
	stage.addChild(btinicia);

	btinicia.on("click", function() {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		btinicia.visible=false;
		createjs.Tween.get(this).wait(1200).call(abreRecolhe);
		update=true;
		startTime = Date.now();

		si=0;
        var j,i;
		for (j = 0; j < matrix.length; j++) {
            for (i = 0; i < matrix[j].length; i++) {

				letras[si]=criaLetra(matrix[j][i],40,55,55);
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
					hits[si].alpha=0.05;
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
						line.visible=true;
				    });

					hits[si].on("pressmove", function (evt) {
						var n=this.name-1;
						var t=contenthit.getObjectUnderPoint(evt.stageX, evt.stageY);
						c2.x=evt.stageX;
						c2.y=evt.stageY;

					});

					hits[si].on("pressup", function (evt) {
						var volta		=	true;
					    var n			=	this.name-1;
						var t			=	contenthit.getObjectUnderPoint(evt.stageX, evt.stageY);
						releaseCoords	=	t.fila + ',' + t.coluna;
						wordCoords		=	'first: ' + clickCoords + ' - last: ' + releaseCoords;
                        console.log(wordCoords);
                        console.log(gabarito);

						if(t != null){
							if(gabarito.indexOf(wordCoords) >= 0 && corrects.indexOf(gabarito.indexOf(wordCoords)) == -1){
								console.log('beeehh');
								corrects.push(gabarito.indexOf(wordCoords));
								volta=false;
								count++;
								som0();
								animaIco('certo',t.parent.x,t.parent.y);

								if (count == words.length) {
									fim(idCanvas, words, hasTips, columns, rows);
								}

								novalinha = new createjs.Shape();
								novalinha.alpha=0.3;
								novalinha.graphics.beginStroke("blue").setStrokeStyle(35,"round");
								novalinha.pos1 = novalinha.graphics.moveTo(c1.x,c1.y).command;
								novalinha.pos2 = novalinha.graphics.lineTo(c2.x,c2.y).command;
								contentLinhas.addChild(novalinha);
							}
						}
						if(volta){
							som1();
							i_erros++;
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
				createjs.Tween.get(letras[j]).wait(j*5).to({rotation:0,x:letras[j].px,scaleX:1,scaleY:1},500,createjs.Ease.backOut);
		    }
		}
	});

	telaFinal = new createjs.Bitmap("resources/image/telaFinal.png");
	telaFinal.image.onload = function(){};
	stage.addChild(telaFinal);
	telaFinal.alpha=0;

	g = new createjs.Graphics().f("red").dc(0,0,0);
	c1 = new createjs.Shape(g);
	c2 = new createjs.Shape(g);

	line = new createjs.Shape();
	line.alpha=0.3;
	line.graphics.beginStroke("red").setStrokeStyle(35,"round");
	line.pos1 = line.graphics.moveTo(0,10).command;
	line.pos2 = line.graphics.lineTo(10,10).command;
	stage.addChild(c1,c2,line);

	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setFPS(60);
}

function abreRecolhe(){
	if(dica){
		dicas.alpha=0;
		createjs.Tween.get(dicas,{override:true}).to({x:0,y:0,scaleX:1,scaleY:1,alpha:1},500,createjs.Ease.backOut);
		dica=false;
	}else{
		dicas.alpha=1;
		createjs.Tween.get(dicas,{override:true}).to({x:1150,y:30,scaleX:0.1,scaleY:0.1,alpha:0},500,createjs.Ease.backOut);
		dica=true;
	}


}

function criaGui(idCanvas, words, hasTips, columns, rows){
	update=false;
	var contentgui = new createjs.Container();
	stage.addChild(contentgui);
	var gui = new createjs.Bitmap("resources/image/gui.png");
	gui.image.onload = function(){};
    contentgui.addChild(gui);
	gui.on("click", function() {
		stage.enableDOMEvents(false);
		resetAll();
		gameCacaPalavras(idCanvas, words, hasTips, columns, rows);
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

function animaIco(qual,b,c){
    var ico;
	ico = new createjs.Bitmap(""+qual+".png");
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
	createjs.Tween.get(telaFinal).wait(1000).to({alpha:1},1000,createjs.Ease.linear);
	criaGui(idCanvas, words, hasTips, columns, rows);
	som2();
}

function tick(event) {
    line.pos1.x = c1.x;
    line.pos1.y = c1.y;
	line.pos2.x = c2.x;
    line.pos2.y = c2.y;
	stage.update(event);
	if(update){
        checkTime();
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
    var shape = new createjs.Shape();
	shape.graphics.beginRadialGradientFill(["#ececed","#3d892b"], [0, 1], 640, 360, 0, 640, 360, 600).drawCircle(100, 100, 50);
	shape.graphics.drawRoundRect(0,0,tamX,tamY,0);
    shape.graphics.endFill();
	stage.addChild(shape);

}

function criaLetra(texto,tam,tamX,tamY){

	var txt = new createjs.Text(texto, "bold "+tam+"px VAG Rounded BT", "#000000");

	txt.y=10;
	txt.x=28;
    txt.textAlign = "center";

	var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#dbdbdb"], [0, 1], 0, 0, 0, tamY);
	button.graphics.drawRect(0, 0, tamX, tamY);
    button.graphics.endFill();

	var border = new createjs.Shape();
	border.graphics.beginStroke("#E87D0C");
	border.graphics.setStrokeStyle(2);
	border.graphics.drawRect(0, 0, tamX, tamY);

	var resp = new createjs.Container();
	resp.addChild(button);
	resp.addChild(txt);
	resp.addChild(border);

	return resp;
}

function criaBt(tamX,tamY,n,c,f){

	var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#ffffff", "#a3a7b1"], [0, 1], 0, 0, 0, tamY);
	button.graphics.drawRect(0, 0, tamX, tamY);
    button.graphics.endFill();
	button.name=n;
	button.coluna=c;
	button.fila=f;

	var resp = new createjs.Container();
	resp.addChild(button);

	return resp;
}

function som0(){
    document.getElementsByTagName('audio')[0].play();
}

function som1(){
    document.getElementsByTagName('audio')[1].play();
}

function som2(){
    document.getElementsByTagName('audio')[2].play();
}

Array.prototype.randomItem = function () {
	return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.randomIndex = function () {
	return Math.floor(Math.random() * this.length);
}

function placeWord(word, direction){
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
	acertos			=	[];
	edgeOffset		= 	40;
	btinicia		=	{};
	bt_dicas		=	{};
	dicas			=	{};
	telaFinal		=	{};
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