
var AppJogoDialogo=function(idIniciar,idFundo,idCanvas,faseTextos,posXY){

var caminho="resources/image/",
 canvas1,
 stage,
 content,
 content2,
 fase1,
 fundo,
 rosto1,
 rosto2,
 inicio1=false,
 btinicia,
 figuras=[],
 bts=[],
 imagens,
 gui,
 startTime,
 erro,
 i_erros=0,
 i_acertos=0,
 scoreTotal=0,
 tutorial,
 word,
count=0,
sons = ["tambor.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"]; 



    
    var index;
for (index in sons) {
    var t = sons[index];
    sons[index] = new Audio(caminho + t);
}
    
    canvas1 = document.getElementById(idCanvas);
    stage = new createjs.Stage(canvas1);
    stage.enableMouseOver(10);
    createjs.Touch.enable(stage);
	content = new createjs.Container();
	content2 = new createjs.Container();

	fase1 = new createjs.Container();

	fundo = new createjs.Bitmap(caminho+idFundo);
	fundo.image.onload = function(){};
	stage.addChild(fundo);
	stage.addChild(fase1);
	
	var spriteSheet = new createjs.SpriteSheet({
		framerate: 20,
			"images": [caminho+"rosto1.png"],
			"frames": [[5,5,94,101,0,59.35,139.25],[104,5,99,96,0,61.35,134.25],[208,5,94,96,0,59.35,139.25],[307,5,94,86,0,59.35,139.25],[406,5,94,96,0,59.35,139.25],[5,111,94,86,0,59.35,139.25],[104,111,94,101,0,59.35,139.25],[203,111,94,86,0,59.35,139.25],[302,111,94,94,0,59.35,139.25]],
			"animations": {
				"idle": 0,
				"fala": [0,8, "move2",0.4],
				"move2": [0, 8, "idle",0.4]
			}
	});
	rosto1 = new createjs.Sprite(spriteSheet, "idle");
	stage.addChild(rosto1);
	rosto1.x=200;
	rosto1.y=560;
	rosto1.scaleX=-1.2;
	rosto1.scaleY=1.2;	
    
    var spriteSheet2 = new createjs.SpriteSheet({
		framerate: 20,
			"images": [caminho+"rosto2.png"],
			"frames": [[5,5,93,91,0,76.25,150.65],[103,5,97,92,0,78.25,147.65],[205,5,102,101,0,78.25,150.65],[312,5,96,98,0,78.25,150.65],[5,111,96,95,0,78.25,150.65],[106,111,102,101,0,78.25,150.65],[213,111,96,91,0,78.25,150.65],[314,111,102,101,0,78.25,150.65],[5,217,96,95,0,78.25,150.65],[106,217,96,91,0,78.25,150.65],[207,217,96,98,0,78.25,150.65]],
			"animations": {
				"idle": 0,
				"fala": [0, 10, "move2",0.4],
				"move2": [0, 10, "idle",0.4]
			}
	});
	rosto2 = new createjs.Sprite(spriteSheet2, "idle");
	stage.addChild(rosto2);
	rosto2.x=1080;
	rosto2.y=560;
	rosto2.scaleX=1.2;
	rosto2.scaleY=1.2;
	
	
	stage.addChild(content);
	stage.addChild(content2);
	
	btinicia = new createjs.Bitmap(caminho+idIniciar);
	btinicia.image.onload = function(){};
    stage.addChild(btinicia);
	btinicia.x=0;
	btinicia.y=0;
	btinicia.on("click", function() {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
        this.visible=false;
        criaFase();
    });
	
	tutorial = new createjs.Bitmap(caminho+"tutorial.png");
	tutorial.image.onload = function(){};
    stage.addChild(tutorial);
	tutorial.visible=false;
	tutorial.alpha=0;
	 
	createjs.Ticker.setFPS(30);
    createjs.Ticker.on("tick", ticker);

function animaTitulo(texto){
    var tit = new createjs.Container();
	stage.addChild(tit);
	
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
	tit.y=350;
    createjs.Tween.get(tit).to({x:640},300,createjs.Ease.backOut).wait(1000).call(deletaTitulo);
}  
function deletaTitulo(){
    stage.removeChild(this);
}        
function criaFase(){
    content.removeAllChildren();
    content2.removeAllChildren();
    var t=faseTextos[count];
    
    var numeroextenso;
    if(count===0){
        numeroextenso="First";
    }else if(count==1){
        numeroextenso="Second";
    }else if(count==2){
        numeroextenso="Third";
    }else if(count==3){
        numeroextenso="Fourth";
    }else if(count==4){
        numeroextenso="Fifth"; 
    }
    
    animaTitulo(numeroextenso+" dialogue");
    
    shuffle(t);
    i_acertos=0;
    
    figuras=[];
    bts=[];
    var i;
    var margem=0;
    for(i=0;i<t.length;i++){
		figuras[i] = new createjs.Bitmap(caminho+"baloes"+i+".png");
        figuras[i].image.onload = function(){};
		content.addChild(figuras[i]);
		figuras[i].x = posXY[i][0];
		figuras[i].y = posXY[i][1];
		figuras[i].regX=313/2;
		figuras[i].regY=225/2;
		figuras[i].id=i;
        figuras[i].alpha=0;
        figuras[i].scaleX=figuras[i].scaleY=0;
        var c = new createjs.Shape();
        c.graphics.beginFill("red").drawEllipse( figuras[i].x, figuras[i].y,10,10);
        
        createjs.Tween.get(figuras[i]).wait(200*i+1000).to({alpha:1,scaleX:1,scaleY:1},1000,createjs.Ease.bounceOut);
		
	}
	for(i=0;i<t.length;i++){
        console.log(t[i]);
		bts[i] = caixaTexto(t[i][0]);
		content.addChild(bts[i]);
        margem+=bts[i].getBounds().width/2;
		bts[i].x =bts[i].px= margem+120;
		bts[i].y =bts[i].py = 160;
		bts[i].regX=80;
		bts[i].regY=80;
		bts[i].id=t[i][1];
		bts[i].som=t[i][2];
		bts[i].pode=true;
        margem+=bts[i].getBounds().width/2+35;
        
        
		bts[i].on("mousedown", function (evt) {
		if(this.pode){
            this.parent.addChild(this);
            var global = content.localToGlobal(this.x, this.y);
            this.offset = {'x' : global.x - evt.stageX, 'y' : global.y - evt.stageY};
			
		}
	    });
	    bts[i].on("pressmove", function (evt) {
		if(this.pode){
            var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
            this.x = local.x;
		    this.y = local.y;
        }
	    });
	    bts[i].on("pressup", function (evt) {
		if(this.pode){
            var i;
            var resultado;
            var continua=false;
            for(i=0;i<figuras.length;i++){
                if(collisionDetect(this,figuras[i])){
                    resultado=figuras[i].id;
                    continua=true;
                    break;
                    
                }
            }
            if(continua){
                if(this.id==resultado){
                    i_acertos++;
                    scoreTotal++;
                    animaIco("certo",figuras[resultado].x-150,figuras[resultado].y-70,false);
                    this.x=figuras[i].x+80;
                    this.y=figuras[i].y+50;
                    this.pode=false;
                    sons[0].play();
                    if(this.som){
                        var somtemp=new Audio(caminho+this.som);
                        somtemp.play();
                    }
                    if(i===0 || i==2 || i==4){
                        rosto1.gotoAndPlay("fala");        
                    }else{
                        rosto2.gotoAndPlay("fala");
                    }
            }else{
                sons[1].play();
                animaIco("errado",figuras[i].x,figuras[i].y,true);
                createjs.Tween.get(this).to({x:this.px,y:this.py},1000,createjs.Ease.bounceOut);
                
            }
            }else{
                createjs.Tween.get(this).to({x:this.px,y:this.py},1000,createjs.Ease.bounceOut);   
            }
             
            if(i_acertos==faseTextos[count].length){
                createjs.Tween.get(this).wait(2000).call(proxima);
                
            }

		}
	    });
	}
	
	
}

function proxima(){
    
    if(count<(faseTextos.length-1)){
        count++;
        criaFase();
    }else{
		verificaFim();
	}
}
function textoContorno(texto){

	var txt = new createjs.Text(texto, "bold 40px VAG Rounded BT", "#ffffff");
	
    txt.textAlign = "center";
	txt.shadow = new createjs.Shadow("#005f46", 5, 5, 10);
	txt.lineWidth = 800; 
	
	var tamX=txt.getBounds().width+120;
	var tamY=txt.getBounds().height+80;
	txt.regY=tamY/2-40;
    
	var t = new createjs.Container();
	t.addChild(txt);
	
	return t;

}
function caixaTexto(texto){
	
	var txt = new createjs.Text(texto, "bold 27px VAG Rounded BT", "#000000");

    txt.textAlign = "center";
    txt.lineWidth = 250;
    
    var tamX=txt.getBounds().width;
	var tamY=txt.getBounds().height;
	
	var button = new createjs.Shape();
    button.graphics.beginLinearGradientFill(["#000000", "#000000"], [0, 1], 0, 0, 0, tamY);
    button.graphics.drawRoundRect(0,0,tamX,tamY+50,10);
    button.graphics.endFill();
	button.regX=tamX/2;
	button.regY=tamY/2;
    button.alpha=0.01;
	
	var resp = new createjs.Container();
	resp.addChild(button);
	resp.addChild(txt);
    txt.y=-20;
    
    var pivo = new createjs.Shape();
    pivo.graphics.beginFill("red").drawEllipse(0,0,10,10);  
	
	return resp;

}        
 function collisionDetect(object1, object2){
    var ax1 = object1.x;
    var ay1 = object1.y;
    var ax2 = object1.x + 140;
    var ay2 = object1.y + 140;
 
    var bx1 = object2.x;
    var by1= object2.y;
    var bx2= bx1 + 140;
    var by2= by1 + 140;
     
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

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}
function criaGui(){
    gui = new createjs.Container();
	stage.addChild(gui);

    var _gui = new createjs.Bitmap(caminho+"gui.png");
	_gui.image.onload = function(){};
    
	var txt_a = new createjs.Text(scoreTotal, "bold 40px VAG Rounded BT", "#000000");
    txt_a.textAlign = "left";
	txt_a.x=220;
	txt_a.y=30;
	
	var txt_e = new createjs.Text(i_erros, "bold 40px VAG Rounded BT", "#b10000");
    txt_e.textAlign = "left";
	txt_e.x=220;
	txt_e.y=105;
	
	gui.x=380;
	gui.y=300;
	
	gui.addChild(_gui);
	gui.addChild(txt_a);
	gui.addChild(txt_e);

}
function verificaFim(){
    var img;
    var bo;
	var continua=false;
    content.removeAllChildren();
	criaGui();
    if(i_erros>20){
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
		
	    bo = new createjs.Bitmap(img);
	    bo.image.onload = function(){};
	    bo.regX=bo.regY=210;
	    bo.x=860;
	    bo.y=1000;
	    bo.scaleX=bo.scaleY=0.75;
	    stage.addChild(bo);
		createjs.Tween.get(bo).wait(200).to({y:360},1000,createjs.Ease.bounceOut);
	    bo.on("mousedown", function (evt) {
			stage.removeChild(gui);
			stage.removeChild(this);
			count=0;
			i_acertos=0;
			scoreTotal=0;
			i_erros=0;
			criaFase();
        });
	
	
	}
    
}
function animaIco(qual,b,c,deletar){
    var ico;
	ico = new createjs.Bitmap(caminho+qual+".png");
    content.addChild(ico);
	ico.x = b;
	ico.y = c;
	ico.regX=155;
	ico.regY=155;
	ico.scaleX=ico.scaleY=0.1;
    if(deletar){
        createjs.Tween.get(ico).to({scaleX:0.4,scaleY:0.4},200,createjs.Ease.quadOut).wait(600).call(deletaIcone);
    }else{
        createjs.Tween.get(ico).to({scaleX:0.4,scaleY:0.4},200,createjs.Ease.quadOut);
        
    }
    
	
}
        function deletaIcone(){
            content.removeChild(this);
        }
function ticker(){
    stage.update();
}
};