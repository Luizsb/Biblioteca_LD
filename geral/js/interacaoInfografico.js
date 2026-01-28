/*
v1.1
-adicionado rollover
-ao clicar da pra arrastar e soltar
v1.0
criacao
*/
var AppInfografico=function(_fonte,_modoEdicao,_idCanvas,_url,_tamanho,_posicoes,_corBalao,_corTexto){
	'strict mode';
	var difinfo=document.getElementById(_idCanvas).parentElement,
	imgFundo,
	diful=difinfo.getElementsByTagName('ul'),
	quantidade= difinfo.getElementsByTagName('li').length,
	canvas = document.getElementById(_idCanvas),
	elemLeft = canvas.offsetLeft,
	elemTop = canvas.offsetTop,
	acertado=-1,
	clicado=false,
	context = canvas.getContext('2d'),
	rect = {
		x:250,
		y:350,
		width:200,
		heigth:100
	},
	count=0,
	tamanhoX=[],
	tamanhoY=[],
	posTemp=[],
	ativos=[],
	posMouse=[],
	elements=[];
	imgFundo=document.createElement('img');
	imgFundo.src=_url;
	if(_modoEdicao){
		quantidade=1;
	}

	imgFundo.onload = function () {
		console.log(imgFundo.width);
		draw();

	}
	var i;
	for(i=0;i<_posicoes.length;i++){
		elements.push({
			nome: i,
			width: 50,
			height: 50,
			ativo:false,
			top: _posicoes[i][0],
			left: _posicoes[i][1]
		});
	}
	console.log(elements);
	canvas.addEventListener('mousedown', function(evt) {
		clicado=true;
		var x = evt.pageX - elemLeft,
		y = evt.pageY - elemTop;
		var pos = getXY(canvas, evt);

		var bounds = canvas.getBoundingClientRect();
		pos.x /=  bounds.width;
		pos.y /=  bounds.height;

		pos.x *= canvas.width;
		pos.y *= canvas.height;
		posMouse[0]=pos.x;
		posMouse[1]=pos.y;
		if(_modoEdicao){
			if(count<quantidade){
				criabolotinha(pos.x,pos.y,difinfo.getElementsByTagName('li')[count].getElementsByTagName('a')[0].innerText);
				var t=[pos.x,pos.y];
				posTemp.push(t);
				count++;
				quantidade++;
				debugador();
			}
		}else{
			draw();
			var continua=-1;
			for(i=0;i<quantidade;i++){
				if(ativos[i]){
					continua=i;
					break;

				}
			}
			if(continua>-1){
				var i=continua;
				console.log("toca:"+difinfo.getElementsByTagName('li')[i].getElementsByTagName('div')[0].getElementsByTagName('audio')[0]);
				$.featherlight($(difinfo.getElementsByTagName('li')[i].getElementsByTagName('div')[0]), {
					targetAttr: 'href',
					openSpeed:      250,
					afterOpen: function(event){
						if(difinfo.getElementsByTagName('li')[i].getElementsByTagName('div')[0].getElementsByTagName('audio')[0]){
							difinfo.getElementsByTagName('li')[i].getElementsByTagName('div')[0].getElementsByTagName('audio')[0].play();
						}
					}
				});
			}
		}

	}, false);
	canvas.addEventListener('mouseup', function(evt) {
		clicado=false;
		debugador();
	},false);
	canvas.addEventListener('mousemove', function(evt) {
		var x = evt.pageX - elemLeft,
		y = evt.pageY - elemTop;
		var pos = getXY(canvas, evt);

		var bounds = canvas.getBoundingClientRect();
		pos.x /=  bounds.width;
		pos.y /=  bounds.height;

		pos.x *= canvas.width;
		pos.y *= canvas.height;
		posMouse[0]=pos.x;
		posMouse[1]=pos.y;
		
		if(_modoEdicao){
			if(clicado){
				
				posTemp[count-1][0]=pos.x;
				posTemp[count-1][1]=pos.y;
				debugador();
				for(i=0;i<posTemp.length;i++){
					draw();
				}
			}
		}
		if(!_modoEdicao){
			var i;
			/*
			for(i=0;i<elements.length;i++){
				if (pos.x>_posicoes[i][0]-tamanhoX[i]/2 && pos.x<_posicoes[i][0]+tamanhoX[i]/2+20 && pos.y>_posicoes[i][1] && pos.y<_posicoes[i][1]+tamanhoY[i]) {
					//acertado=i;
					break;
				}else{

				}
			}
			*/
			draw();
		}
		
	}, false);
	function getXY(canvas, event) {
    var rect = canvas.getBoundingClientRect();  // absolute position of canvas
    return {
    	x: event.clientX - rect.left,
    	y: event.clientY - rect.top
    }
}  
function draw(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.drawImage(imgFundo, 0, 0,canvas.width,canvas.height);
	var i=0;
	for(i=0;i<quantidade;i++){
		var tx=_posicoes[i][0];
		var ty=_posicoes[i][1];
		ativos[i]=false;
		if(_modoEdicao){
			tx=posTemp[i][0];
			ty=posTemp[i][1];
		}
		criabolotinha(tx,ty,difinfo.getElementsByTagName('li')[i].getElementsByTagName('a')[0].innerText,false,i);
	}
}
function criabolotinha(px,py,nome,invertecor,_i){
	var corBalao='#ffffff';
	var corTexto='#F26522';
	if(_corBalao){
		corBalao=_corBalao;
	}
	if(_corTexto){
		corTexto=_corTexto;
	}
	var corBalaoInv=invertColor(corBalao);
	var corTextoInv=invertColor(corTexto);

	var _temp=_fonte.split('p');
	context.font = _fonte;
	if(nome.length>2){
		var _tamanhoX=context.measureText(nome).width+20;
		var _tamanhoY=Number(_temp[0])+20;
		tamanhoX.push(_tamanhoX);
		tamanhoY.push(_tamanhoY);
		context.fillStyle = "rgba(0, 0, 0, 0.5)";
		roundRect(context, px-_tamanhoX/2-2, py+5, _tamanhoX, _tamanhoY, 10, true,false);
		if(context.isPointInPath(posMouse[0],posMouse[1])){
			//acertou algo
			invertecor=true;
			acertado=_i;
			ativos[_i]=true;
			context.fillStyle =corBalaoInv;
		}else{
			acertado=-1;
			context.fillStyle =corBalao;
		}
		//console.log(posMouse[0]+" "+posMouse[1]);
		roundRect(context, px-_tamanhoX/2, py, _tamanhoX, _tamanhoY, 10, true,false);
		if(invertecor){
			context.fillStyle=corTextoInv;
		}else{
			context.fillStyle=corTexto;
		}
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillText(nome, px, py+_tamanhoY/2);
	}else{
		tamanhoX.push(_tamanho);
		tamanhoY.push(_tamanho);
		var potenciometro=1;
		if(invertecor){
			potenciometro=1;
		}
		context.fillStyle = "rgba(0, 0, 0, 0.5)";
		context.beginPath();
		context.arc(_tamanho/2+px-2, _tamanho/2+py+5, _tamanho*potenciometro, 0, 2 * Math.PI);
		context.fill();
		if(context.isPointInPath(posMouse[0],posMouse[1])){
			//acertou algo
			invertecor=true;
			acertado=_i;
			ativos[_i]=true;
			context.fillStyle =corBalaoInv;
		}else{
			acertado=-1;
			context.fillStyle =corBalao;
		}
		context.beginPath();
		context.arc(_tamanho/2+px, _tamanho/2+py, _tamanho*potenciometro, 0, 2 * Math.PI);
		context.fill();
		if(invertecor){
			context.fillStyle=corTextoInv;
		}else{
			context.fillStyle=corTexto;
		}
		context.textBaseline = "middle";
		context.textAlign = "center";
		context.fillText(nome, _tamanho/2+px, _tamanho/2+py);
	}

}
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	if (typeof stroke == 'undefined') {
		stroke = true;
	}
	if (typeof radius === 'undefined') {
		radius = 5;
	}
	if (typeof radius === 'number') {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
	} else {
		var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
		for (var side in defaultRadius) {
			radius[side] = radius[side] || defaultRadius[side];
		}
	}
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}

}
function invertColor(hex) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
    	hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
    	throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
	len = len || 2;
	var zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}
function debugador(){
	var t="[";
	var i=0;
	for(i=0;i<posTemp.length;i++){
		if(i!=0){
			t+=","
		}
		t+="[";
		t+=Math.floor(posTemp[i][0]);
		t+=","
		t+=Math.floor(posTemp[i][1]);
		t+="]"
	}
	if(_corBalao){
		t+="],";
	}else{
		t+="]";
	}
	console.clear();
	console.log(t);

}
}
