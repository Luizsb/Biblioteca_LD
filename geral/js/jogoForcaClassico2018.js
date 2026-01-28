var AppForcaClassico=function(idCanvas, questions){
var canvas;
var stage;
var content;
var forka;
var contenthit;
var contentgui;
var c_boneco;
var fundo;
var agua;
var positivo;
var tente;
var inicio1=false;
var btinicia;
var bonecoX=[333,243,327,417,290,381];
var bonecoY=[108,200,189,202,329,331];
var escala=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
var queLin=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var tempoAtivo=false;
var hits=[];
var boneco=[];
var erros=0;
var letras=[];
var edgeOffset = 80;
var count=0;
var i_erros=0;
var i_acertos=0;
var si=0;
var forkaimg=0;
var btcontinuar;
var score=0;
var label;
var update=true;
var clicavel=true;
var inicio1=true;
var help;
var fumacinha;
var relogio;
var tipotween=createjs.Ease.backOut;
    
    	var caminho="resources/image/";
	var sons = ["tambor.mp3", "erro.mp3", "parabens.mp3", "tentenovamente.mp3"];
for (index in sons) {
        var t = sons[index];
        sons[index] = new Audio(caminho + t);
    }

	shuffle(questions);
    canvas = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas);
	
    createjs.Touch.enable(stage);
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;
	
	contenthit = new createjs.Container();
	content = new createjs.Container();
	c_boneco = new createjs.Container();
	forka = new createjs.Container();
	fundo = new createjs.Bitmap(caminho+"fundo_od1.png");
	fundo.image.onload = function(){};
    stage.addChild(fundo);
	
	stage.addChild(contenthit);
	stage.addChild(forka);
	stage.addChild(c_boneco);
	stage.addChild(content);
	
	var spriteRelogio = new createjs.SpriteSheet({
		framerate: 20,
			"images": [caminho+"relogio.png"],
			"frames": {"regX": 100, "height": 214, "count": 13, "regY": 107, "width": 200},
			"animations": {
				"idle": 0,
				"idle2": 12,
				"tempo1": [0, 12, "idle2",0.0033]
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
	relogio.visible=false;

	var t_boneco = new createjs.Bitmap(caminho+"boneco_hit.png");
    t_boneco.image.onload = function(){};
	c_boneco.x=440;
	c_boneco.y=150;
	c_boneco.regX=125;
	c_boneco.rotation=-10;
	c_boneco.addChild(t_boneco);
	
	c_boneco.visible=false;
    var i;
	for(i=0;i<6;i++){
	    boneco[i] = new createjs.Bitmap(caminho+"p"+i+".png");
        boneco[i].image.onload = function(){};
		boneco[i].x=bonecoX[i];
		boneco[i].y=-500;
	    c_boneco.addChild(boneco[i]);
	}
	
	
	
	btinicia = new createjs.Bitmap(caminho+"bt_iniciar.png");
	btinicia.image.onload = function(){};
    stage.addChild(btinicia);
	btinicia.on("click", function() {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        btinicia.visible=false;
		inicio1=true;
		c_boneco.visible=true;
		createjs.Tween.get(c_boneco,{loop:true}).to({rotation:10},1000,createjs.Ease.quadInOut).to({rotation:-10},1000,createjs.Ease.quadInOut);
		forkaimg = new createjs.Bitmap(caminho+"forka.png");
	    forkaimg.image.onload = function(){};
        forka.addChild(forkaimg);
	    forka.x=69;
	    forka.y=40;
        montaFase(questions);
		help.visible=true;
    });
	
	positivo = new createjs.Bitmap(caminho+"positivo.png");
	positivo.image.onload = function(){};
    stage.addChild(positivo);
	positivo.y=120;
	positivo.x=850;
	positivo.visible=false;
	positivo.on("click", function() {
        positivo.visible=false;
		inicio1=true;
		count=0;
		i_erros=0;
		erros=0;
        montaFase(questions);
		ativaTempo(questions);
    });
	
	tente = new createjs.Bitmap(caminho+"tentenovamente.png");
	tente.image.onload = function(){};
    stage.addChild(tente);
	tente.y=200;
	tente.x=850;
	tente.visible=false;
	tente.on("click", function() {
		tente.visible=false;
	    count=0;
		i_erros=0;
		erros=0;
		inicio1=true;
		montaFase(questions);
		ativaTempo(questions);
	});
	
	help = new createjs.Bitmap(caminho+"help.png");
	help.image.onload = function(){};
    stage.addChild(help);
	help.visible=false;
	help.on("click", function() {
	    help.visible=false;
		ativaTempo(questions);
	});
	
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", ticker);

function ativaTempo(questions){
	if(tempoAtivo){
		relogio.visible=true;
		relogio.x=120;
		relogio.y=120;
		relogio.gotoAndPlay("tempo1");
		relogio.scaleX=relogio.scaleY=0.4;
		createjs.Tween.get(relogio).to({scaleX:0.8,scaleY:0.8,rotation:10}, 250,tipotween).wait(350).to({rotation:-5}, 250,tipotween);
		createjs.Tween.get(btinicia).to({alpha: 1}, 120000).call(proximoErro, [questions]);
	}
}
function montaFase(questions){
	var t		=	questions[count][0],
		margemX	=	100,
		margemY	=	0,
		m		=	0;

    i_erros		=	0;
    i_acertos	=	0;
	hits		=	[];
	letras		=	[];

    contenthit.removeAllChildren();
	content.removeAllChildren();

	contenthit.y=620;
	contenthit.scaleX=contenthit.scaleY=escala[count];

    var i;
	for(i = 0; i < 6; i++){
		boneco[i].x=bonecoX[i];
		boneco[i].y=-500;
	}

    for(i = 0; i < t.length; i++){
		hits[i] = new createjs.Bitmap(caminho+"hit.png");
        hits[i].image.onload = function(){};
		hits[i].n=removeAcento(t[i]);
		hits[i].n_acento=t[i];
		hits[i].id=i;
		hits[i].pode=true;
		hits[i].regX=72/2;
		hits[i].regY=30;
		if(t[i]=='_'){
			i_acertos++;
		}else if(t[i]=='-'){
			var letra = criaLetra(t[i],80);
            if(t.length>15){
                letra.x=m*50+margemX;
                letra.scaleY=letra.scaleX=0.6;
            }else{
                letra.x=m*75+margemX;
                letra.scaleY=letra.scaleX=0.8;
            }
			letra.y=margemY+10;
	        contenthit.addChild(letra);
			i_acertos++;
		}else{
			contenthit.addChild(hits[i]);
		}
		
        if(t.length>15){
            hits[i].x=m*45+60;
            hits[i].y=200;
            hits[i].scaleY=hits[i].scaleX=0.6;
            hits[i].escala=0.6;

        }else{
            hits[i].x=m*75+margemX;
            hits[i].y=200;
            hits[i].escala=0.8;

        }
          
		createjs.Tween.get(hits[i]).wait(i*100).to({y:margemY},300,createjs.Ease.backOut);
		
		if(m>0 && m==queLin[count]){
			m=0;
			margemY=90;
			contenthit.y=565;
			contenthit.x=50;
			
		}else{
			m++;
		}
		
	}
    
    
	
	for(i=0;i<26;i++){
	        letras[i] = new createjs.Bitmap(caminho+"l"+i+".png");
            letras[i].image.onload = function(){};
	        content.addChild(letras[i]);
	    	letras[i].y=800;
			letras[i].regX=43; 
            letras[i].regY=40;
	    	letras[i].pode=true;
			letras[i].id=i;
			letras[i].n=String.fromCharCode(i+97);
			letras[i].scaleY=letras[i].scaleX=0.85;
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
				var t=questions[count][0];
	            var volta=true;
				var limite=hits[0].x+hits.length*75;
			    if(this.x<limite && this.y>520){
                    var i;
					for(i=0;i<hits.length;i++){
						if(hits[i].n==this.n){
							sons[0].play();
							volta=false;
							var letra = criaLetra(hits[i].n_acento.toUpperCase(),80);
							var local = contenthit.localToGlobal(hits[i].x,hits[i].y);
							letra.x=local.x;
							letra.y=local.y+7;
							letra.scaleY=letra.scaleX=0.1;
                            console.log(this.escala);
							createjs.Tween.get(letra).to({scaleX:hits[i].escala,scaleY:hits[i].escala},300,createjs.Ease.backOut);
	                        content.addChild(letra);
							this.x=this.px;
						    this.y=this.py;
							this.alpha=0.5;
						    this.scaleY=this.scaleX=0.85;
							i_acertos++;
						}
						
					}
					this.pode=false;
                    verificaErros(questions);	
			    	} else {
					    var volta=false;
					    this.scaleY=this.scaleX=0.85;
	        		    createjs.Tween.get(this).to({x:this.px,y:this.py},200,createjs.Ease.backIn);
					}
			    
	        	if(volta){
					this.pode=false;
				    var err = new createjs.Bitmap(caminho+"errado.png");
                    err.image.onload = function(){};
		            content.addChild(err);
		            err.x=this.px;
		            err.y=this.py;
					err.regX=err.regY=160;
		            err.scaleY=err.scaleX=0.3;
		            err.alpha=0.1;
		            createjs.Tween.get(err).to({alpha:1},200,createjs.Ease.linear);
				    this.scaleY=this.scaleX=0.85;
	        		sons[1].play();
	        		createjs.Tween.get(this).to({x:this.px,y:this.py},200,createjs.Ease.backIn);
                    var t=this.id;
					createjs.Tween.get(boneco[i_erros]).to({x:bonecoX[i_erros]-240,y:bonecoY[i_erros]-110},400,createjs.Ease.backOut);				
					i_erros++;
					verificaErros(questions);
	        	}
				
	        }
	        });
	    
	    }
	si=0;
    var i,j;
    for(i=0;i<4;i++){
	    for(j=0;j<7;j++){	
		if(si<26){
            letras[si].x=letras[si].px=78*j+700;
            letras[si].py=76*i+80; 
            createjs.Tween.get(letras[si]).wait(si*30).to({y:76*i+80},300,createjs.Ease.backOut);
		
		}
	        si++;
	    }
	}
    console.log(questions[count][1]);
        var extensao=questions[count][1].split('.').pop();
    var frase;
        var bt;
        if(extensao=='jpg' || extensao=='png'){
            frase = new createjs.Bitmap(caminho+""+questions[count][1]);
        frase.image.onload = function(){};
		content.addChild(frase);
        frase.x=questions[count][2];
        frase.y=questions[count][3];
        }else{
            frase = caixaTexto(questions[count][1],33);
        frase.x=300;
        frase.y=380;	
        content.addChild(frase);
        createjs.Tween.get(frase).to({x:950},300,createjs.Ease.backOut);
        }

}

function removeAcento(strToReplace) {
	str_acento= 'áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ';
	str_sem_acento = 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
	var nova='';
    var i;
	for (i = 0; i < strToReplace.length; i++) {
		if (str_acento.indexOf(strToReplace.charAt(i)) != -1) {
			nova+=str_sem_acento.substr(str_acento.search(strToReplace.substr(i,1)),1);
		} else {
			nova+=strToReplace.substr(i,1);
		}
	}
	return nova;
} 
function caixaTexto(texto,tam){
	
	var txt = new createjs.Text(texto, "bold "+tam+"px VAG Rounded BT", "#000000");

	var tamX=txt.getBounds().width+80;
	var tamY=txt.getBounds().height+50;
	
	txt.regY=tamY/2-35;
    txt.textAlign = "center";
	txt.lineWidth = 610; 
	
	var resp = new createjs.Container();
	resp.addChild(txt);
	
	return resp;
}

function criaLetra(texto,tam){
	
	var txt = new createjs.Text(texto, "bold "+tam+"px VAG Rounded BT", "#603a28");

	var tamX=txt.getBounds().width+80;
	var tamY=txt.getBounds().height+50;
	
	txt.regY=tamY/2-35;
    txt.textAlign = "center";
	txt.lineWidth = 610; 
	
	var c = new createjs.Bitmap(caminho+"l_vazia.png");
    c.image.onload = function(){};
	c.regX=89/2;
	c.regY=90/2;
	
	
	var t = new createjs.Container();
	t.addChild(c);
	t.addChild(txt);
	
	return t;

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
    if(update){
	    stage.update();
	}
}
function verificaErros(questions){
	
	if(i_acertos >= questions[count][0].length){
	    createjs.Tween.removeTweens(btinicia);
		relogio.visible=false;
	    inicio1=false;
		var certo = new createjs.Bitmap(caminho+"certo.png");
        certo.image.onload = function(){};
		stage.addChild(certo);
		certo.x=350;
		certo.y=400;
		certo.scaleY=certo.scaleX=0.5;
		certo.alpha=0.1;
		createjs.Tween.get(certo).to({alpha:1},200,createjs.Ease.linear).wait(4000).call(proximo, [questions]);
	
	}else if(i_erros>=6){
	    createjs.Tween.removeTweens(btinicia);
		relogio.visible=false;
	    inicio1=false;
		tente.visible=true;
		content.removeAllChildren();
	
	}

}
function proximoErro(questions){
    erros++;
	proximo(questions);
}

function proximo(questions){
    stage.removeChild(this);
	
    if(count >= questions.length - 1){
		createjs.Tween.removeTweens(btinicia);
		relogio.visible=false;
	    inicio1=false;
		content.removeAllChildren();
		contenthit.removeAllChildren();
	    if(erros>0){
			tente.visible=true;
			sons[3].play();
		}else{
			positivo.visible=true;
			sons[2].play();
		}

	} else {
		ativaTempo(questions);
	    inicio1=true;
	    count++;
	    montaFase(questions);
	}
}

function apaga(){
    stage.removeChild(this);

}
function collisionDetect(object1, object2){
    var ax1 = object1.x;
    var ay1 = object1.y;
    var ax2 = object1.x + edgeOffset;
    var ay2 = object1.y + edgeOffset;

    var bx1 = object2.x;
    var by1= object2.y;
    var bx2= bx1 + edgeOffset;
    var by2= by1 + edgeOffset;
    
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

}