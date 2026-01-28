var QIcanvas;
var QIstage;
var QIfundo;
var QIconta;
var QIhit;
var QIn_resp=6;
var QIfreq=0;
var QIfreq2=0;
var QIcount=0;
var QIrespostas=[];
var QIseq=[0,1,2,3,4,5,6,7];
var QIposX=[376,794,207,566,997,364,842];
var QIposY=[457,457,564,564,564,654,654];
var QIword;
var QIinicio1=false;

var QIgui;
var QIi_acertos=0;
var QIi_erros=0;
var QItxt_a;
var QItxt_e;
var larguraImagens=590;
var alturaImagens=590;

function quizImagem(idCanvas, questions) {
	QIshuffle(questions.questions);
	QIshuffle(questions.answers);

    QIcanvas = document.getElementById(idCanvas);
    QIstage = new createjs.Stage(QIcanvas);
    QIstage.enableMouseOver(10);

	createjs.Touch.enable(QIstage);
	QIstage.enableMouseOver(10);
	QIstage.mouseMoveOutside = true;

	var QIfundo = new createjs.Bitmap("resources/image/quiz-image_bg.png");
	QIfundo.image.onload = function(){};
	QIstage.addChild(QIfundo);

	QIshuffle(QIseq);

	QIconta = new createjs.Container();
	QIstage.addChild(QIconta);


	var QIbtinicia = new createjs.Bitmap("resources/image/bt_iniciar.png");
	QIbtinicia.image.onload = function(){};
	QIstage.addChild(QIbtinicia);
	QIbtinicia.on("mousedown", function (evt) {
	    QIstage.removeChild(this);
		QIformulaPergunta(questions);
	    QIcriaGui();
		QIcriaBts(questions);
	});
	QIbtinicia.x=400;
	QIbtinicia.y=250;



	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", QIticker);
}

function QIcriaGui(){
    QIgui = new createjs.Container();
	QIstage.addChild(QIgui);
	QIgui.x=960;

    var QI_gui = new createjs.Bitmap("resources/image/gui.png");
	QI_gui.image.onload = function(){};


	QItxt_a = new createjs.Text(0, "bold 40px VAG Rounded BT", "#000000");
    QItxt_a.textAlign = "left";
	QItxt_a.x=220;
	QItxt_a.y=25;

	QItxt_e = new createjs.Text(0, "bold 40px VAG Rounded BT", "#b10000");
    QItxt_e.textAlign = "left";
	QItxt_e.x=220;
	QItxt_e.y=100;

	QIgui.addChild(QI_gui);
	QIgui.addChild(QItxt_a);
	QIgui.addChild(QItxt_e);

}

function QIcriaBts(questions){
    QIinicio1=true;
	var QIsi			=	0,
		margem			=	50,
		lastBtnH		=	0;

	for(var i = 0; i < questions.answers.length; i++){
		var bt = QIcriaTexto(questions.answers[i][0]);

		bt.x	= 	bt.px = (bt.getBounds().x * -1) + margem;
		bt.y	=	900;
		bt.py	=	i * 80 + 120;
		bt.id	=	questions.answers[i][1];
		bt.pode	=	true;

		QIstage.addChild(bt);
		createjs.Tween.get(bt).wait(i*100).to({y:50 + (lastBtnH)},600,createjs.Ease.backOut);
		lastBtnH	+=	bt.getBounds().height + 30;

		bt.on("mousedown", function (evt) {
			this.scaleX=this.scaleY=0.8;

			createjs.Tween.get(this).to({scaleX:1,scaleY:1},300,createjs.Ease.backOut);

			if(this.id == QIrespostas[QIcount]){
				QIanimaIco("certo",850,400);
				QIsom0();
				QIi_acertos++;
				QItxt_a.text=QIi_acertos;
			} else {
				QIanimaIco("errado",850,400);
				QIi_erros++;
				QIsom1();
				QItxt_e.text=QIi_erros;
			}
			createjs.Tween.get(this).wait(1000).call(QIproxima, [questions]);
		});
	}
}

function QIformulaPergunta(questions){
    var QIfi	= new createjs.Container();
    var QIfig1	= new createjs.Bitmap(questions.questions[QIcount][0]);

    QIrespostas.push(questions.questions[QIcount][1]);

    QIconta.removeAllChildren();
	QIconta.addChild(QIfi);
	QIfig1.image.onload = function(){};
	QIfi.addChild(QIfig1);

	QIfig1.regX=larguraImagens/2;
	QIfig1.regY=alturaImagens/2;
	QIfig1.rotation=5;
	QIfi.x=850;
	QIfi.y=-600;
	QIfi.rotation=-30;
	QIfi.scaleX=QIfi.scaleY=0.9;
	createjs.Tween.get(QIfi).wait(200).to({y:400,rotation:0},1000,createjs.Ease.backOut);
    createjs.Tween.get(QIfig1,{loop:true}).to({y:0,rotation:-5},Math.random()*500+1000,createjs.Ease.quadInOut).to({y:0,rotation:5},Math.random()*500+1000,createjs.Ease.quadInOut);
}

function QIproxima(questions){
    if(QIcount < (questions.questions.length - 1)){
        QIcount++;
        QIformulaPergunta(questions);
    } else {
	    QIi_erros	=	100;
		QIverificaFim(questions);
	}
}

function QIshuffle(a) {     
	var j, x, i;     

	for (i = a.length; i; i -= 1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
}

function QIverificaFim(questions){
    var QIimg;
    var bo;
	var continua=false;
    if(QIi_acertos>=QIseq.length){
	    QIimg="resources/image/positivo.png";
		continua=true;
		QIsom2();
	}else{
	    QIimg="resources/image/tentenovamente.png";
		continua=true;

	}
	if(continua){
	    QIinicio1=false;
		QIconta.removeAllChildren();

	    QIbo = new createjs.Bitmap(QIimg);
	    QIbo.image.onload = function(){};
	    QIbo.regX=QIbo.regY=210;
	    QIbo.x=800;
	    QIbo.y=1000;
	    QIstage.addChild(QIbo);
		createjs.Tween.get(QIbo).wait(1000).to({y:400},1000,createjs.Ease.backOut);
	    QIbo.on("mousedown", function (evt) {
	        QIstage.removeChild(this);
			QIcount=0;
			QIi_acertos=0;
			QItxt_a.text=QIi_acertos;
			QIi_erros=0;
			QItxt_e.text=QIi_erros;
	        QIformulaPergunta(questions);
        });


	}

}

function QIpopBolha(px,py){
    var QIbo = new createjs.Bitmap("resources/image/bolha_pop.png");
	QIbo.image.onload = function(){};
	QIbo.regX=QIbo.regY=155;
	QIbo.scaleX=QIbo.scaleY=0.5;
	QIbo.x=px;
	QIbo.y=py;
	QIstage.addChild(QIbo);
	createjs.Tween.get(QIbo).to({scaleX:1,scaleY:1},150,createjs.Ease.linear).call(QIdeleta);
}

function QIanimaIco(qual,b,c){
    var QIico;
	QIico = new createjs.Bitmap("resources/image/"+qual+".png");
    QIstage.addChild(QIico);
	QIico.x = b;
	QIico.y = c;
	QIico.regX=315/2;
	QIico.regY=315/2;
	QIico.scaleX=QIico.scaleY=0.1;
	createjs.Tween.get(QIico).to({scaleX:0.8,scaleY:0.8},200,createjs.Ease.backOut).wait(600).call(QIdeleta);
}
function QIdeleta(){
    QIstage.removeChild(this);
}

function QIticker(event){
	QIstage.update();

}

function QIcriaTexto(texto){
	var txt			=	new createjs.Text(texto, "bold 40px VAG Rounded BT", "#ffffff"),
		button		=	new createjs.Shape(),
		t			=	new createjs.Container();

	txt.shadow		=	new createjs.Shadow("#000000", 3, 3, 6);
	txt.textAlign	=	"left";
	txt.lineWidth	=	500;
	txt.regX		=	txt.getBounds().width / 2;
	txt.y			=	10;
	button.alpha 	=	0.6;
	button.regX		=	(txt.getBounds().width + 30) / 2;

	button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, txt.getBounds().height + 20);
	button.graphics.drawRoundRect(0,0,txt.getBounds().width + 30, txt.getBounds().height + 20,20);
	button.graphics.endFill();

    t.addChild(button);
	t.addChild(txt);
	
	return t;
}


function QIcollisionDetect(QIobject1, QIobject2){
    var QIax1 = QIobject1.x;
    var QIay1 = QIobject1.y;
    var QIax2 = QIobject1.x + 100;
    var QIay2 = QIobject1.y + 100;

    var QIbx1 = QIobject2.x;
    var QIby1= QIobject2.y;
    var QIbx2= QIbx1 + 100;
    var QIby2= QIby1 + 100;

    if(QIobject1 == QIobject2)
    {
        return false;
    }

    if (QIax1 <= QIbx2 && QIax2 >= QIbx1 &&
            QIay1 <= QIby2 && QIay2 >= QIby1)
    {
        return true;
    } else {

        return false;
    }
}

function QIsom0(){
		document.getElementsByTagName('audio')[0].play();
}
function QIsom1(){
		document.getElementsByTagName('audio')[1].play();
}
function QIsom2(){
		document.getElementsByTagName('audio')[2].play();
}