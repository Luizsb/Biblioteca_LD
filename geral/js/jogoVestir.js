var AppJogoVestir=function(fasesConfig, _idCanvas, _btiniciar){
var caminho="resources/image/";
var canvas;
var stage;
var fundo;
var content;
var personagem;
var corpo;
var calca;
var meias;
var tenis;
var camisa;
var jaqueta;
var cabelo;
var olho;
var nariz;
var boca;
var offX=350;
var fase=0;
var itens=[{
    corpos:['h1'],
    calcas:["vaqueros","pantalones_cortos"],
    camisas:["camiseta","pulover"],
    jaquetas:['bufanda','gorra','guantes'],
    meias:['calcetines'],
    tenis:['zapatillas_deportivas','botas']

},{
    corpos:['m1'],
    calcas:["falda","pantalones"],
    camisas:["camiseta2","vestido"],
    jaquetas:['chaqueta','gafas'],
    meias:['sombrero','pendientes'],
    tenis:['bailarinas','sandalias']

}];

var reco;
var tomPele=0;
var respostaTemp=[];

function init1() {

    canvas = document.getElementById(_idCanvas);
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(10);

    createjs.Touch.enable(stage);
    stage.enableMouseOver(10);
    stage.mouseMoveOutside = true;

    var fundo = new createjs.Bitmap(caminho+"fundo.png");
    fundo.image.onload = function(){};
    stage.addChild(fundo);

    content = new createjs.Container();
    personagem = new createjs.Container();
    corpo = new createjs.Container();
    calca = new createjs.Container();
    meias = new createjs.Container();
    tenis = new createjs.Container();
    camisa = new createjs.Container();
    jaqueta = new createjs.Container();
    cabeca = new createjs.Container();
    cabelo = new createjs.Container();
    olho = new createjs.Container();
    nariz = new createjs.Container();
    boca = new createjs.Container();
    stage.addChild(content);
    stage.addChild(personagem);
    personagem.addChild(corpo);
    personagem.addChild(meias);

    personagem.addChild(calca);
    personagem.addChild(tenis);
    personagem.addChild(camisa);
    personagem.addChild(jaqueta);
    personagem.addChild(cabeca);
    personagem.addChild(cabelo);
    personagem.addChild(olho);
    personagem.addChild(nariz);
    personagem.addChild(boca);

    reco = new createjs.Bitmap(caminho+'bt_recomecar.png');
    reco.image.onload = function(){};
    reco.x=1400;
    reco.y=560;
    stage.addChild(reco);
    reco.on("mousedown", function (evt) {
        primeiraEtapa();
        btContinuar.visible=false;

    });

    var btinicio = new createjs.Bitmap(caminho+_btiniciar);
    btinicio.image.onload = function(){};
    stage.addChild(btinicio);
    btinicio.on("mousedown", function (evt) {
        document.getElementById(_idCanvas).scrollIntoview();
        stage.removeChild(this);
        animaTitulo('Gabriela y Diego no consiguen encontrar sus ropas y accesorios. ¿Vamos a ayudarlos?',210,360,43);
        createjs.Tween.get(content).wait(7000).call(primeiraEtapa);
        var som=new Audio(caminho+'enunciado.mp3');
        som.play();

    });

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", ticker);
}
function tocaSom(qual){
    var somTemp=new Audio(caminho+qual);
    somTemp.play();
}
function primeiraEtapa(){
    respostaTemp=[];
    content.removeAllChildren();
    corpo.removeAllChildren();
    cabelo.removeAllChildren();
    calca.removeAllChildren();
    meias.removeAllChildren();
    tenis.removeAllChildren();
    camisa.removeAllChildren();
    jaqueta.removeAllChildren();
    olho.removeAllChildren();
    nariz.removeAllChildren();
    boca.removeAllChildren();

    etapaRoupas(fasesConfig[fase].qualgenero,0);
}

function etapaRoupas(sexo,body){
    content.removeAllChildren();
    createjs.Tween.get(reco).to({x:1120},500,createjs.Ease.backOut);

    animaTitulo(fasesConfig[fase].titulo,350,85,35);
    tocaSom(fasesConfig[fase].audio);

    var img1 = new createjs.Bitmap(caminho+itens[sexo].corpos[0]+".png");
    img1.image.onload = function(){};
    corpo.addChild(img1);
    personagem.x=-450;
    personagem.scaleX=personagem.scaleY=0.425;
    createjs.Tween.get(personagem).to({x:50},500,createjs.Ease.backOut);
    createjs.Tween.get(corpo).to({rotation:-10},500,createjs.Ease.quadOut).to({rotation:5},350,createjs.Ease.quadOut).to({rotation:-2},200,createjs.Ease.quadOut).to({rotation:0},200);

    var i;
    var offsetx=offX;
    var offsety=110;
    for(i=0;i<itens[sexo].camisas.length;i++){
        var bt = new createjs.Bitmap(caminho+'bt_'+itens[sexo].camisas[i]+".png");
        bt.image.onload = function(){};
        content.addChild(bt);
        bt.id=i;
        bt.x=offsetx;
        bt.y=-150;
        bt.nome=itens[sexo].camisas[i];
        createjs.Tween.get(bt).wait(i*100).to({y:offsety},250,createjs.Ease.backOut);
        if(offsetx>1000){
            offsetx=offX;
            offsety+=150;
        }else{
            offsetx+=150;
        }
        bt.on("mousedown", function (evt) {
            if(fasesConfig[fase].resposta.indexOf(this.nome)>=0){
                if(respostaTemp.indexOf(this.nome)==-1){
                    respostaTemp.push(this.nome);
                    console.log(this.nome);
                }
            }

            camisa.removeAllChildren();
            tocaSom(itens[sexo].camisas[this.id]+".mp3");
            var img1 = new createjs.Bitmap(caminho+itens[sexo].camisas[this.id]+".png");
            img1.image.onload = function(){};
            camisa.addChild(img1);
            this.scaleX=this.scaleY=0.5;
            createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut);
        });
    }
    criabotaoLimpa(offsetx,offsety,camisa,null);

    offsetx=offX;
    if(itens[sexo].jaquetas.length>0){
        offsety+=150;

        for(i=0;i<itens[sexo].jaquetas.length;i++){
            var bt = new createjs.Bitmap(caminho+'bt_'+itens[sexo].jaquetas[i]+".png");
            bt.image.onload = function(){};
            content.addChild(bt);
            bt.id=i;
            bt.x=offsetx;
            bt.y=-150;
            bt.nome=itens[sexo].jaquetas[i];
            createjs.Tween.get(bt).wait(i*100).to({y:offsety},250,createjs.Ease.backOut);
            if(offsetx>1000){
                offsetx=offX;
                offsety+=150;
            }else{
                offsetx+=150;
            }
            bt.on("mousedown", function (evt) {
                if(fasesConfig[fase].resposta.indexOf(this.nome)>=0){
                    if(respostaTemp.indexOf(this.nome)==-1){
                        respostaTemp.push(this.nome);
                    }
                }
                jaqueta.removeAllChildren();
                tocaSom(itens[sexo].jaquetas[this.id]+".mp3");
                var img1 = new createjs.Bitmap(caminho+itens[sexo].jaquetas[this.id]+".png");
                img1.image.onload = function(){};
                jaqueta.addChild(img1);
                this.scaleX=this.scaleY=0.5;
                createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut);
            });
        }
        criabotaoLimpa(offsetx,offsety,jaqueta,null);
    }

    offsetx=offX;
    if(itens[sexo].calcas.length>0){
        offsety+=150;

        for(i=0;i<itens[sexo].calcas.length;i++){
            var bt = new createjs.Bitmap(caminho+'bt_'+itens[sexo].calcas[i]+".png");
            bt.image.onload = function(){};
            content.addChild(bt);
            bt.id=i;
            bt.x=offsetx;
            bt.y=-150;
            bt.nome=itens[sexo].calcas[i];
            createjs.Tween.get(bt).wait(i*100).to({y:offsety},250,createjs.Ease.backOut);
            if(offsetx>1000){
                offsetx=offX;
                offsety+=150;
            }else{
                offsetx+=150;
            }
            bt.on("mousedown", function (evt) {
                if(fasesConfig[fase].resposta.indexOf(this.nome)>=0){
                    if(respostaTemp.indexOf(this.nome)==-1){
                        respostaTemp.push(this.nome);
                    }
                }
                calca.removeAllChildren();
                tocaSom(itens[sexo].calcas[this.id]+".mp3");
                var img1 = new createjs.Bitmap(caminho+itens[sexo].calcas[this.id]+".png");
                img1.image.onload = function(){};
                calca.addChild(img1);
                this.scaleX=this.scaleY=0.5;
                createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut);
            });
        }
        criabotaoLimpa(offsetx,offsety,calca,null);
    }

    offsetx=offX;
    if(itens[sexo].tenis.length>0){
        offsety+=150;
        for(i=0;i<itens[sexo].meias.length;i++){
            var bt = new createjs.Bitmap(caminho+'bt_'+itens[sexo].meias[i]+".png");
            bt.image.onload = function(){};
            content.addChild(bt);
            bt.id=i;
            bt.x=offsetx;
            bt.y=-150;
            bt.nome=itens[sexo].meias[i];
            createjs.Tween.get(bt).wait(i*100).to({y:offsety},250,createjs.Ease.backOut);
            if(offsetx>1000){
                offsetx=offX;
                offsety+=150;
            }else{
                offsetx+=150;
            }
            bt.on("mousedown", function (evt) {
                if(fasesConfig[fase].resposta.indexOf(this.nome)>=0){
                    if(respostaTemp.indexOf(this.nome)==-1){
                        respostaTemp.push(this.nome);
                    }
                }
                meias.removeAllChildren();
                tocaSom(itens[sexo].meias[this.id]+".mp3");
                var img1 = new createjs.Bitmap(caminho+itens[sexo].meias[this.id]+".png");
                img1.image.onload = function(){};
                meias.addChild(img1);
                this.scaleX=this.scaleY=0.5;
                createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut);
            });
        }

        for(i=0;i<itens[sexo].tenis.length;i++){
            var bt = new createjs.Bitmap(caminho+'bt_'+itens[sexo].tenis[i]+".png");
            bt.image.onload = function(){};
            content.addChild(bt);
            bt.id=i;
            bt.x=offsetx;
            bt.y=-150;
            bt.nome=itens[sexo].tenis[i];
            createjs.Tween.get(bt).wait(i*100).to({y:offsety},250,createjs.Ease.backOut);
            if(offsetx>1000){
                offsetx=offX;
                offsety+=150;
            }else{
                offsetx+=150;
            }
            bt.on("mousedown", function (evt) {
                if(fasesConfig[fase].resposta.indexOf(this.nome)>=0){
                    if(respostaTemp.indexOf(this.nome)==-1){
                        respostaTemp.push(this.nome);
                    }
                }
                tenis.removeAllChildren();
                tocaSom(itens[sexo].tenis[this.id]+".mp3");
                var img1 = new createjs.Bitmap(caminho+itens[sexo].tenis[this.id]+".png");
                img1.image.onload = function(){};
                tenis.addChild(img1);
                this.scaleX=this.scaleY=0.5;
                createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut);
            });
        }
        criabotaoLimpa(offsetx,offsety,tenis,meias);
    }

    var btContinuar = new createjs.Bitmap(caminho+'bt_continuar.png');
    btContinuar.image.onload = function(){};
    btContinuar.x=1400;
    btContinuar.y=400;
    content.addChild(btContinuar);
    createjs.Tween.get(btContinuar).to({x:1120},500,createjs.Ease.backOut);
    btContinuar.on("mousedown", function (evt) {
        etapaFim();
    });
}

function etapaFim(){
    reco.x=1400;
    content.removeAllChildren();
    createjs.Tween.get(personagem,{override:true}).to({x:450,scaleX:0.425,scaleY:0.425},500,createjs.Ease.backOut);


    console.log(String(respostaTemp.sort())+"=="+String(fasesConfig[fase].resposta.sort()));
    if(String(respostaTemp.sort())==String(fasesConfig[fase].resposta.sort())){
        animaIco('certo',250,360);
        fase++;
    }else{
        animaIco('errado',250,360);
    }

    if(fase<=itens.length+1){

        createjs.Tween.get(content).wait(2000).call(primeiraEtapa);
    }else{
        tocaSom('parabens.mp3');
        var positivo = new createjs.Bitmap(caminho+'positivo.png');
        positivo.image.onload = function(){};
        positivo.x=900;
        positivo.y=720;
        content.addChild(positivo);
        createjs.Tween.get(positivo).to({y:200},550,createjs.Ease.backOut);
        positivo.on("mousedown", function (evt) {
            fase=0;
            primeiraEtapa();
        });
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

function criabotaoLimpa(px,py,qual_container,qual_container2){
    var bt = new createjs.Bitmap(caminho+'bt_limpa.png');
    bt.image.onload = function(){};
    content.addChild(bt);
    bt.x=px;
    bt.y=py;
    bt.on("mousedown", function (evt) {
        qual_container.removeAllChildren();
        if(qual_container2){
            qual_container2.removeAllChildren();
        }
        this.scaleX=this.scaleY=0.5;
        createjs.Tween.get(this).to({scaleX:1,scaleY:1},500,createjs.Ease.backOut);
    });
}

function animaTitulo(texto,px,py,tamanhoTexto){
    var tit = new createjs.Container();
    content.addChild(tit);

    var txt = new createjs.Text(texto, tamanhoTexto+"px VAG Rounded BT", "#ffffff");
    txt.lineWidth=900;
    txt.regY=60;

    var contorno = new createjs.Text(texto, tamanhoTexto+"px VAG Rounded BT", "#000000");
    contorno.lineWidth=900;
    contorno.regY=60;
    contorno.outline = 8;

    tit.addChild(contorno);
    tit.addChild(txt);

    tit.x=-640;
    tit.y=py;
    createjs.Tween.get(tit).to({x:px},300,createjs.Ease.backOut);

}
function popIco(qual,px,py){
    var ico = new createjs.Bitmap(caminho+qual);
    ico.image.onload = function(){};
    ico.regX=ico.regY=155;
    ico.scaleX=ico.scaleY=0.01;
    ico.x=px;
    ico.y=py;
    content.addChild(ico);
    createjs.Tween.get(ico).to({scaleX:0.5,scaleY:0.5},150,createjs.Ease.linear);
}

function ticker(event){
    stage.update();
}

init1();
}