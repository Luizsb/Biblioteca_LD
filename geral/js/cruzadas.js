var canvas;
var stage;
var content;
var contenthit;
var contentgui;
var fundo;
var agua;
var positivo;
var inicio1=false;
var btinicia;
var vazio=[0,0,0,0,0,0,0,0,0,0,0];
var moscas=[];
var word_count=0;
var hits=[];
var bts=[];
var figuras=[];
var letras=[];
var edgeOffset = 10;
var count=0;
var si=0;
var countTempo=0;
var btcontinuar;
var score=0;
var label;
var update=true;
var clicavel=true;
var inicio1=true;
var sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"];
var caminho= ["resources/image/"];
var scoreTotal;

function gameCruzadas(idCanvas, wordsQtd, x, y, tipsDefaultPos) {
	tipsDefaultPos = typeof tipsDefaultPos !== 'undefined' ? tipsDefaultPos : true;

    var index;
    for (index in sons) {
        var t = sons[index];
        sons[index] = new Audio(caminho + t);
    }
    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);
	contenthit = new createjs.Container();
	content = new createjs.Container();
	contentgui = new createjs.Container();
	createjs.Touch.enable(stage);
	fundo = new createjs.Bitmap(caminho+"fundo_od1.png");
	fundo.image.onload = function(){};
    stage.addChild(fundo);

	stage.addChild(content);
	stage.addChild(contenthit);
	stage.addChild(contentgui);

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
	agua = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(agua);


	if (tipsDefaultPos) {
        var i;
		for(i = wordsQtd - 1; i >= 0; i--){
	        bts[i] = new createjs.Bitmap(caminho+"b"+i+".png");
	        bts[i].image.onload = function(){};
		    stage.addChild(bts[i]);
			bts[i].y	=	10;
			bts[i].x	=	(stage.canvas.width - 100 - ((wordsQtd - 1) - i) * 100 );
	        bts[i].name	=	i;
			bts[i].on("click", function (evt) {
		        if(inicio1){
	                figuras[this.name].visible=true;
		        }
		    });
		}
	} else {
		for(i = 0 ; i < wordsQtd; i++){
	        bts[i] = new createjs.Bitmap(caminho+"b"+i+".png");
	        bts[i].image.onload = function(){};
		    stage.addChild(bts[i]);
			bts[i].y	=	posY[i];
			bts[i].x	=	posX[i];
	        bts[i].name	=	i;
			bts[i].on("click", function (evt) {
		        if(inicio1){
	                figuras[this.name].visible=true;
		        }
		    });
		}
	}
var i;
	for(i=0;i<wordsQtd;i++){
		figuras[i] = new createjs.Bitmap(caminho+"d"+i+".png");
        figuras[i].image.onload = function(){};
	    stage.addChild(figuras[i]);
        figuras[i].visible=false;
		figuras[i].on("click", function (evt) {
	        if(inicio1){
                this.visible=false;
	        }
	    });
	}

	btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
	btinicia.image.onload = function(){};
    stage.addChild(btinicia);
	btinicia.on("click", function() {
        btinicia.visible=false;
		inicio1=true;
        montaCacaPalavra(x, y);

    });

	positivo = new createjs.Bitmap(caminho+"positivo.png");
	positivo.image.onload = function(){};
    stage.addChild(positivo);
	positivo.y=120;
	positivo.x=25;
	positivo.visible=false;
    positivo.on("click", function() {
        this.visible=false;
        score=0;
        vazio=[0,0,0,0,0,0,0,0,0,0,0];
        content.removeAllChildren();
        contenthit.removeAllChildren();
        montaCacaPalavra(x, y);
    });

	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker);
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
function montaCacaPalavra(x, y){
	scoreTotal = 0;
    countTempo=0;
		var margemY=0;
	    var margemX=63;
		count=0;
    hits=[];
    letras=[];
	var i,j;
		for(i=0;i<mapa.length;i++){
		    for(j=0;j<mapa[i].length;j++){

                hits[count] = new createjs.Bitmap(caminho+"hit.png");
                hits[count].image.onload = function(){};
	            contenthit.addChild(hits[count]);
				hits[count].x=j*55+x+28;
				hits[count].y=i*54+y+28;
				hits[count].regX=28;
				hits[count].regY=28;
                hits[count].alpha=0;
				hits[count].pode=true;
				hits[count].coluna=i;
				hits[count].name=mapa[i][j];
                hits[count].wordSize = 0;

				if (mapa[i][j] !== 0) {
					scoreTotal++;
				}
var k;
				for(k = 0; k < mapa[i].length; k++){
					if (mapa[i][k] !== 0) {
						hits[count].wordSize++;
					}
				}
                count++;
            }
		}
	    for(i=0;i<26;i++){

	        letras[i] = new createjs.Bitmap(caminho+"l"+i+".png");
            letras[i].image.onload = function(){};
	        content.addChild(letras[i]);
            if(i>17){
                margemX=251;
                margemY=1366;
            }else if(i>8){
                margemX=157;
                margemY=684;
			}

            letras[i].x=-100;
            letras[i].y=76*i-margemY+48;
            letras[i].px=margemX;
            letras[i].py=76*i-margemY+48;
            letras[i].regX=43;
            letras[i].regY=40;
            letras[i].pode=true;
            letras[i].name=i+1;
            createjs.Tween.get(letras[i]).wait(i*10).to({x:margemX},300,createjs.Ease.bounceOut);
            letras[i].on("mousedown", function (evt) {
                if(this.pode && inicio1){
                    this.parent.addChild(this);
                    var global = content.localToGlobal(this.x, this.y);
                    this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
                    this.scaleY=this.scaleX=0.7;
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
                var i;
		        for (i=0; i<l; i++) {
                    var child = contenthit.getChildAt(i);
                    var pt = child.globalToLocal(this.x, this.y);
                    if(intersect(this, child)){
                        if(child.pode && this.name==child.name){
						    volta=false;
							child.pode=false;
							this.x=this.px;
							this.y=this.py;
							this.scaleY=this.scaleX=1;

							vazio[child.coluna]+=1;

							if(child.wordSize==vazio[child.coluna]){
                                sons[0].play();
							    var certo = new createjs.Bitmap(caminho+"certo.png");
                                certo.image.onload = function(){};
								stage.addChild(certo);
							    certo.x=child.x;
							    certo.y=child.y;
							    certo.scaleY=certo.scaleX=0.2;
								certo.alpha=0.1;
								createjs.Tween.get(certo).to({alpha:1},200,createjs.Ease.linear).wait(2000).call(sapoengole);

							}
                            verificaFim();

	                        var letra = new createjs.Bitmap(caminho+"l"+(this.name-1)+".png");
                            letra.image.onload = function(){};
							letra.x=child.x;
							letra.y=child.y;
							letra.regX=43;
                            letra.regY=40;
							letra.scaleY=letra.scaleX=0.7;
	                        content.addChild(letra);
                        }
                    }
			    }
	        	if(volta){
				    this.scaleY=this.scaleX=1;
	        		sons[1].play();
	        		createjs.Tween.get(this).to({x:this.px,y:this.py},200,createjs.Ease.backIn);

	        	}
	        	}
	        });

	    }
}
function ticker(event){
    if(update){
	    stage.update();
	}
}
function verificaFim(){
    score+=1;
	if(score>=scoreTotal){
	    positivo.visible=true;
		sons[2].play();
        var i;
		for(i=0;i<26;i++){
	        letras[i].visible=false;
		}
	}
}
function sapoengole(e){
    stage.removeChild(this);
}
function intersect(obj1, obj2){

    var objBounds1 = obj1.getBounds().clone();
    var objBounds2 = obj2.getBounds().clone();
	if(obj1.x > (obj2.x - edgeOffset) && obj1.x < (obj2.x + objBounds2.width + edgeOffset) && obj1.y > (obj2.y - edgeOffset) &&	obj1.y < (obj2.y + objBounds2.height + edgeOffset)){
		return true;
    }else{
		return false;
    }
}