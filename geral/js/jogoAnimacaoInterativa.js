/*
25/8/2020
bug fixes no arraste multiplo

V1.2
20/06/2020
-retirado preload
adicionado carregamento total do video antes de iniciar od

V1.0
5/05/2020
-versao basica com apenas quiz basico, arraste e goto basico

*/

var appAnimeInterativo=function(_modoedicao,_idContainer,_idVideo,_idCanvas,_btiniciar,_trilha,itens,_tipoTransicao,_escondeHit=true,_centralizaPivot=true,_feedbackErrado=true,_arrasteMultiplo=false){
	var canvas;
	var stage;
	var fundo;
	var conta;
	var caminhoGeral="../../../../geral/image/";
	var caminho="resources/image/";
	var video1=document.getElementById(_idVideo);
	var cenaAtual=0;
	var countTotal=0;
	var count=0;
	var pontos=0;
	var btFull;
	var containerTimeline;
	var containerTimelineMarc;
	var container_cenas;
	var container_icos;
	var container_gui;
	var container_gui_pop;
	var container_itens;
	var btContinuasp;
	var btReiniciarsp;
	var jogoClicavel=true;
	var bts=[];
	var hits=[];
	var inicioFim=[];
	var itemselecionado=0;
	var imagemselecionada;
	var contItemSel;
	var imgItem;
	var scrubling=false;
	var menuSelecionado=0;
	var barrinhaVideo;
	var txtTempoVideo;
	var posicaoAgulha=0;
	var proporcaoVideo;
	var tempoAtual=0;
	var menuTipo;
	var line;
	var nomeAnterior;
	var idAnterior;
	var mostralinha=[false,null,null];
	var menudentrodoloop=true;
	var mao1;
	var mao1sp;
	var mao2sp;
	var travazoom=true;
	var loaded2=false;
	var	loaded1=false;
	var transicao=createjs.Ease.backOut;
	if(_tipoTransicao=="elastic"){
		transicao=createjs.Ease.backOut;
	}else if(_tipoTransicao=="fade"){
		transicao=createjs.Ease.quadOut;
	}
/*
	var preloadedimages = new Array();
	for(var i=0;i<itens.length;i++){
		for(var j=1;j<itens[i][2].length;j++){
			if(itens[i][2][j][5]=="arraste" || itens[i][2][j][5]=="imagem" || itens[i][2][j][5]=="botao" || itens[i][2][j][5]=="hit"){
				preloadedimages[i] = new Image();
				preloadedimages[i].src = caminho+itens[i][2][j][0];
			}
		}
	}
	var preloadedimages2 = new Array();
	function preload() {
		for (i = 0; i < preload.arguments.length; i++) {
			preloadedimages2[i] = new Image();
			preloadedimages2[i].src = preload.arguments[i];
		}
	}
	preload(
		caminho+"btFullscreen.png",
		caminho+"btFullscreen2.png",
		caminho+"maozinha1.png",
		caminho+"maoVoltar2.png"
		);
		*/
		document.getElementById(_idVideo).style.display="none";
		document.getElementById(_idCanvas).style.display="none";
		video1.disablePictureInPicture = true;

		var divLoading = document.createElement("DIV");   
		document.getElementById(_idContainer).appendChild(divLoading); 
		divLoading.setAttribute("style", "height: 700px; display:flex; justify-content:center; align-items: center;"); 
		var cent = document.createElement("center");   
		divLoading.appendChild(cent); 
		var img = document.createElement("img");  
		img.src = caminhoGeral+"loading.gif";                
		cent.appendChild(img);                   


		loaded2=true;
		canvas = document.getElementById(_idCanvas);
		stage = new createjs.Stage(canvas);
		container_cenas = new createjs.Container();
		container_icos = new createjs.Container();
		container_itens = new createjs.Container();
		container_gui = new createjs.Container();
		container_gui_pop = new createjs.Container();
		containerTimeline = new createjs.Container();
		containerTimelineMarc = new createjs.Container();
		createjs.Touch.enable(stage);
		stage.enableMouseOver();
		stage.mouseMoveOutside = true;
		stage.addChild(containerTimeline);
		containerTimeline.y=720;
		containerTimelineMarc.y=720;
		stage.addChild(container_itens);
		container_itens.y=900;
		stage.addChild(container_gui);
		stage.addChild(container_gui_pop);
		stage.addChild(container_cenas);

		mao1sp = new createjs.SpriteSheet({
			framerate: 20,
			"images": [caminho+"maozinha1.png"],
			frames: [[2,2,179,191,0,99.3,106.6],[183,2,180,188,0,99.3,106.6],[365,2,183,184,0,99.3,106.6],[550,2,183,186,0,99.3,106.6],[735,2,184,188,0,99.3,106.6],[2,195,184,190,0,99.3,106.6],[188,195,182,191,0,99.3,106.6],[372,195,181,191,0,99.3,106.6],[555,195,179,191,0,99.3,106.6],[736,195,169,182,0,90.3,97.6],[2,388,159,173,0,80.3,88.6],[163,388,150,163,0,71.3,78.6],[315,388,145,157,0,66.3,72.6],[462,388,157,169,0,78.3,84.6],[621,388,160,172,0,81.3,87.6],[783,388,162,175,0,83.3,90.6],[2,565,165,178,0,86.3,93.6],[169,565,168,180,0,89.3,95.6],[339,565,168,180,0,89.3,95.6],[509,565,169,182,0,90.3,97.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6],[2,2,179,191,0,99.3,106.6]],
			"animations": {
				"idle": 0,
				"idle2": 11,
				"tempo1": [0, 33, "tempo1",1]
			}
		});	
		mao2sp = new createjs.SpriteSheet({
			framerate: 20,
			"images": [caminho+"maoVoltar2.png"],
			frames: [[2,2,313,63,0,177.7,32.8],[2,70,310,84,0,174.7,53.8],[2,159,307,99,0,171.7,68.8],[2,263,306,108,0,170.7,77.8],[2,376,305,111,0,169.7,80.8],[2,492,295,101,0,159.7,70.8],[2,598,286,90,0,150.7,58.8],[2,693,276,82,0,140.7,45.8],[2,780,286,77,0,150.7,42.8],[2,862,295,71,0,159.7,39.8],[2,938,304,67,0,168.7,36.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8],[2,2,313,63,0,177.7,32.8]],
			"animations": {
				"idle": 0,
				"idle2": 11,
				"tempo1": [0, 22, "tempo1",1]
			}
		});	


		if(_modoedicao){
			document.getElementById("menuEdicao").style.display="block";
			document.getElementById(_idContainer).style.width="80%";


			var videoLoader = document.getElementById('addVideo');
			videoLoader.addEventListener('change', carregaVideo, false);

			var imgLoader = document.getElementById('addimg');
			imgLoader.addEventListener('change', carregaImagem, false);


			canvas.height=900;
			var btplay = new createjs.Bitmap(caminho+"btPlay.png");
			btplay.image.onload = function(){};
			containerTimeline.addChild(btplay);
			btplay.x=590;
			btplay.y=85;
			btplay.on("mousedown", function (evt) {
				if (video1.paused){ 
					video1.play(); 
				}else{ 
					video1.pause();
				}



			});
			var btavante = new createjs.Bitmap(caminho+"btAvante.png");
			btavante.image.onload = function(){};
			containerTimeline.addChild(btavante);
			btavante.x=680;
			btavante.y=85;
			btavante.on("mousedown", function (evt) {
				tempoAtual=(video1.currentTime+0.1).toFixed(1);
				video1.currentTime = tempoAtual;
				posicaoAgulha+=proporcaoVideo;
				barrinhaVideo.scaleX=posicaoAgulha /1280;
				txtTempoVideo.x=posicaoAgulha/1.05;
				txtTempoVideo.text=tempoAtual;

			});
			var btvolta = new createjs.Bitmap(caminho+"btVolta.png");
			btvolta.image.onload = function(){};
			containerTimeline.addChild(btvolta);
			btvolta.x=500;
			btvolta.y=85;
			btvolta.on("mousedown", function (evt) {
				tempoAtual=(video1.currentTime-0.1).toFixed(1);
				video1.currentTime = tempoAtual;
				posicaoAgulha-=proporcaoVideo;
				barrinhaVideo.scaleX=posicaoAgulha /1280;
				txtTempoVideo.x=posicaoAgulha/1.05;
				txtTempoVideo.text=tempoAtual;

			});


			var fundotimeline = new createjs.Bitmap(caminho+"fundoTimeline.png");
			fundotimeline.image.onload = function(){};
			containerTimeline.addChild(fundotimeline);

			stage.addChild(containerTimelineMarc);

			barrinhaVideo = new createjs.Bitmap(caminho+"barrinhaVideo.jpg");
			barrinhaVideo.image.onload = function(){};
			containerTimeline.addChild(barrinhaVideo);
			barrinhaVideo.scaleX=0;

			txtTempoVideo = new createjs.Text(0, "bold 25px arial", "#000000");
			containerTimeline.addChild(txtTempoVideo);
			txtTempoVideo.x=0;
			txtTempoVideo.y=30;

			fundotimeline.on("mousedown", function (evt) {
				container_gui.removeAllChildren();
				container_gui_pop.removeAllChildren();

			});
			fundotimeline.on("pressmove", function (evt) {
				scrubling=true;
				tempoAtual=(stage.mouseX /1280*  video1.duration).toFixed(1);
				barrinhaVideo.scaleX=stage.mouseX /1280;
				video1.currentTime = tempoAtual;
				posicaoAgulha=(1280-(1280-stage.mouseX));
				txtTempoVideo.x=posicaoAgulha/1.05;
				txtTempoVideo.text=tempoAtual;

			});
			fundotimeline.on("pressup", function (evt) {
				scrubling=false;
			});

			var additem = new createjs.Bitmap(caminho+"adicionaitem.png");
			additem.image.onload = function(){};
			stage.addChild(additem);
			additem.y=820;

			imgItem = new createjs.Bitmap(caminho+"faixa.png");
			imgItem.image.onload = function(){};
			container_itens.addChild(imgItem);


			additem.on("click", function() {

				addItemMais(-1);

			});
			if(itens.length>0){
				for(var i=0;i<itens.length;i++){
					console.log(i);
					addItemMais(i);
				}

			}
		}else{
			montaInicio();
		}
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", ticker);

		function addItemMais(_i){
			var id;
			if(_i>=0){
				id=_i;
			}else{
				id=itens.length;
			}
			document.getElementById("menuBotoesImagens").style.display="none";
			container_gui.removeAllChildren();
			container_gui_pop.removeAllChildren();

			var marcador1 = new createjs.Bitmap(caminho+"marcador1.png");
			marcador1.image.onload = function(){};
			containerTimelineMarc.addChild(marcador1);
			marcador1.name="marcadorIn"+id;
			if(_i>=0){
				posicaoAgulha=proporcaoVideo*itens[id][0][0]*10;
				marcador1.x=posicaoAgulha;
			}


			var marcador2 = new createjs.Bitmap(caminho+"marcador2.png");
			marcador2.image.onload = function(){};
			containerTimelineMarc.addChild(marcador2);
			marcador2.name="marcadorOut"+id;
			if(_i>=0){
				posicaoAgulha=proporcaoVideo*itens[id][1][0]*10;
				marcador2.x=posicaoAgulha;
			}


			var item = new createjs.Container();

			var fundoitem = new createjs.Bitmap(caminho+"fundoitem.png");
			fundoitem.image.onload = function(){};
			item.addChild(fundoitem);
			console.log("pos="+id+" "+id*80)
			item.y=id*80;
			item.id=id;
			if(_i>=0){
				item.menu=1;
			}

			fundoitem.on("click", function() {
				container_gui_pop.removeAllChildren();
				imgItem.y=80*this.parent.id;
				itemselecionado=this.parent.id;
				contItemSel=this.parent;
				if(this.parent.menu>=0){
					criamenu1();
				}else{
					document.getElementById("menuBotoesImagens").style.display="none";
					container_gui.removeAllChildren();
				}
				tempoAtual=itens[itemselecionado][1][0];
				video1.currentTime = tempoAtual;
				posicaoAgulha=proporcaoVideo*video1.currentTime*10;
				barrinhaVideo.scaleX=posicaoAgulha /1280;
				txtTempoVideo.x=posicaoAgulha/1.05;
				txtTempoVideo.text=tempoAtual;

			});

			var btmais = new createjs.Bitmap(caminho+"btmais.png");
			btmais.image.onload = function(){};
			item.addChild(btmais);
			btmais.x=1000;
			btmais.y=10;
			btmais.on("click", function() {
				contItemSel=this.parent;
				imgItem.y=80*this.parent.id;
				itemselecionado=this.parent.id;
				popupItem();


			});

			var btin = new createjs.Bitmap(caminho+"btin.png");
			btin.image.onload = function(){};
			item.addChild(btin);
			btin.x=140;
			btin.y=13;
			btin.on("click", function() {
				contItemSel=this.parent;
				imgItem.y=80*this.parent.id;
				itemselecionado=this.parent.id;

				var t = this.parent.getChildByName("txtin");
				t.text=tempoAtual;
				var t = containerTimelineMarc.getChildByName("marcadorIn"+this.parent.id);
				t.x=posicaoAgulha;

				itens[itemselecionado][0][0]=tempoAtual;
				console.log(tempoAtual);
				debugador();

			});				
			var btout = new createjs.Bitmap(caminho+"btout.png");
			btout.image.onload = function(){};
			item.addChild(btout);
			btout.x=288;
			btout.y=13;
			btout.on("click", function() {
				contItemSel=this.parent;
				imgItem.y=80*this.parent.id;
				itemselecionado=this.parent.id;

				var t = this.parent.getChildByName("txtout");
				t.text=tempoAtual;
				var t = containerTimelineMarc.getChildByName("marcadorOut"+this.parent.id);
				t.x=posicaoAgulha;


				itens[itemselecionado][1][0]=tempoAtual;
				debugador();

			});		
			var btloop = new createjs.Bitmap(caminho+"btloop.png");
			btloop.image.onload = function(){};
			item.addChild(btloop);
			btloop.x=440;
			btloop.y=13;
			btloop.on("click", function() {
				contItemSel=this.parent;
				imgItem.y=80*this.parent.id;
				itemselecionado=this.parent.id;

				var t = this.parent.getChildByName("txtloop");
				itens[itemselecionado][1][2]=tempoAtual;
				t.text=tempoAtual;

				debugador();

			});
			var novaentrada=[[0,true],[0,true,false],null,null,null];
			if(_i==-1){
				itens.push(novaentrada);
			}
			var btcheck = new createjs.Bitmap(caminho+"btcheck.png");
			btcheck.image.onload = function(){};
			btcheck.x=455;
			btcheck.y=11;
			if(itens[id][1][2]==true){
				btcheck.alpha=1;
			}else{
				btcheck.alpha=0.1;
			}
			btcheck.name="btcheck";

			var txt = new createjs.Text("seq"+id, "bold 25px arial", "#000000");
			item.addChild(txt);
			txt.x=30;
			txt.y=18;
			itemselecionado=id;
			contItemSel=item;
			imgItem.y=80*itemselecionado;

			var txtin = new createjs.Text(0, "bold 25px arial", "#000000");
			txtin.x=160;
			txtin.y=18;
			txtin.name="txtin";
			if(_i>=0){
				txtin.text=itens[itemselecionado][0][0];
			}
			item.addChild(txtin);

			var txtout = new createjs.Text(0, "bold 25px arial", "#000000");
			txtout.x=300;
			txtout.y=18;
			txtout.name="txtout";
			if(_i>=0){
				txtout.text=itens[itemselecionado][1][0];
			}		
			item.addChild(txtout);			

			var txtloop = new createjs.Text(0, "bold 25px arial", "#000000");
			txtloop.x=450;
			txtloop.y=18;
			txtloop.name="txtloop";
			if(itens[itemselecionado][1][2]){
				txtloop.text=itens[itemselecionado][1][2];
			}else{
				itens[itemselecionado][1][2]=false;
				txtloop.text=false;
			}		
			item.addChild(txtloop);

			var txtmenu = new createjs.Text("...", "bold 25px arial", "#000000");
			item.addChild(txtmenu);
			txtmenu.x=600;
			txtmenu.y=15;
			txtmenu.name="txtmenu";
			if(_i>=0){
				if(itens[itemselecionado][2]){	
					txtmenu.text=itens[itemselecionado][2][0];
				}else if(itens[itemselecionado][3]){	
					txtmenu.text="vai para seq:"+itens[itemselecionado][3];
				}

			}
			var btClose = new createjs.Bitmap(caminho+"btfechar.png");
			btClose.image.onload = function(){};
			btClose.name="btfecha"+_i;
			btClose.x=1240;
			btClose.y=15;
			btClose.id=_i;
			item.addChild(btClose);
			btClose.on("click", function() {
				itemselecionado=this.parent.id;
				itens.splice(this.parent.id,1);
				containerTimelineMarc.removeAllChildren();
				container_itens.removeAllChildren();
				setTimeout(function(){
					container_itens.addChild(imgItem);
					for(var i=0;i<itens.length;i++){
						console.log(i);
						addItemMais(i);
					}
				},500);
				debugador();

			});

			container_itens.addChild(item);
			canvas.height+=100;

			debugador();
		}
		function popupItem(){
			container_gui.removeAllChildren();
			container_gui_pop.removeAllChildren();
			var fundoPop = new createjs.Bitmap(caminho+"fundopop.png");
			fundoPop.image.onload = function(){};
			container_gui.addChild(fundoPop);
			var j=0;
			var w=0;
			for(i=0;i<24;i++){
				var bt = new createjs.Bitmap(caminho+"n"+i+".png");
				bt.image.onload = function(){};
				container_gui.addChild(bt);
				bt.x=260+j*43;
				bt.y=w*38+65;
				bt.id=i;
				bt.on("pressup",function(evt) {

					itens[itemselecionado][3]=this.id;
					var t = contItemSel.getChildByName("txtmenu");
					t.text="vai para seq: "+this.id;

					container_gui.removeAllChildren();
					container_gui_pop.removeAllChildren();
					debugador();
				});
				j++;
				if(j>3){
					j=0;
					w++;
				}
			}

			var btMenu1 = new createjs.Bitmap(caminho+"btMenu1.png");
			btMenu1.image.onload = function(){};
			btMenu1.x=20;
			btMenu1.y=15;
			btMenu1.on("click", function() {
				var t = contItemSel.getChildByName("txtmenu");
				t.text="menu tipo 1";
				contItemSel.menu=1;
				container_gui.removeAllChildren();
				itens[itemselecionado][2]=["menu1"];
				itens[itemselecionado][3]=null;
				menuTipo="menu1";
				criamenu1();
				debugador();

			});		
			var btMenu2 = new createjs.Bitmap(caminho+"btMenu2.png");
			btMenu2.image.onload = function(){};
			btMenu2.x=20;
			btMenu2.y=100;
			btMenu2.on("click", function() {
				var t = contItemSel.getChildByName("txtmenu");
				t.text="menu tipo 2";
				contItemSel.menu=2;
				container_gui.removeAllChildren();
				itens[itemselecionado][2]=["menu2"];
				itens[itemselecionado][3]=null;
				menuTipo="menu2";
				criamenu2();
				debugador();

			});
			container_gui.addChild(btMenu1);
			container_gui.addChild(btMenu2);
			container_gui.x=stage.mouseX-300;
			container_gui.y=stage.mouseY-360;
		}
		function popupDragImagens(_id,_this,_tipo){

			container_gui_pop.removeAllChildren();
			if(_tipo=="arraste" || _tipo=="marcador"|| _tipo=="mao1"|| _tipo=="mao2"){
				var fundoPop = new createjs.Bitmap(caminho+"fundopop.png");

			}else{
				var fundoPop = new createjs.Bitmap(caminho+"fundopopimg.png");

			}
			fundoPop.image.onload = function(){};
			container_gui_pop.addChild(fundoPop);


			var j=0;
			var w=0;
			for(i=0;i<24;i++){
				var bt = new createjs.Bitmap(caminho+"n"+i+".png");
				bt.image.onload = function(){};
				container_gui_pop.addChild(bt);
				bt.x=260+j*43;
				bt.y=w*38+65;
				bt.id=i;
				bt.idMae=_id;
				bt.on("pressup",function(evt) {
					itens[itemselecionado][2][_id][3]=this.id;
					container_gui_pop.removeAllChildren();
					var t2 = container_gui.getChildByName("goto"+this.idMae);
					if(t2){
						container_gui.removeChild(t2);
					}
					var bt2 = new createjs.Bitmap(caminho+"n"+this.id+".png");
					bt2.image.onload = function(){};
					bt2.name="goto"+this.idMae;
					container_gui.addChild(bt2);
					bt2.x=imagemselecionada.x+35;
					bt2.y=imagemselecionada.y;


					debugador();
				});
				j++;
				if(j>3){
					j=0;
					w++;
				}
			}

			fundoPop.on('mousedown', function(evt){
				var stageX = evt.stageX,
				stageY = evt.stageY,
				localPos = this.globalToLocal(stageX, stageY);
				this.parent._localPos = localPos;
			});
			fundoPop.on('pressup', function(evt){
			});
			fundoPop.on('pressmove', function(evt){
				this.parent.x = evt.stageX - this.parent._localPos.x;
				this.parent.y = evt.stageY - this.parent._localPos.y;
			});
			setTimeout(function(){

			},2000)
			if(_tipo=="botao"){
				var btcheck = new createjs.Bitmap(caminho+"btcheck.png");
				btcheck.image.onload = function(){};
				btcheck.x=143;
				btcheck.y=88;
				btcheck.alpha=0.1;
				btcheck.on("click", function() {
					this.alpha=1;
					btcheck2.alpha=0.1;
					itens[itemselecionado][2][_id][4]=true;
					debugador();
				});
				container_gui_pop.addChild(btcheck);

				var btcheck2 = new createjs.Bitmap(caminho+"btcheck.png");
				btcheck2.image.onload = function(){};
				btcheck2.x=143;
				btcheck2.y=142;
				btcheck2.alpha=0.1;
				btcheck2.on("click", function() {
					this.alpha=1;
					btcheck.alpha=0.1;
					itens[itemselecionado][2][_id][4]=false;
					debugador();
				});
				container_gui_pop.addChild(btcheck2);

				if(itens[itemselecionado][2][_id][4]){
					btcheck.alpha=1;
					btcheck2.alpha=0.1;
				}else{
					btcheck.alpha=0.1;
					btcheck2.alpha=1;
				}


			}
			if(_tipo=="arraste"){
				var btalvo = new createjs.Bitmap(caminho+"btMenu3.png");
				btalvo.image.onload = function(){};
				btalvo.x=20;
				btalvo.y=15;
				container_gui_pop.addChild(btalvo);
				btalvo.on("click", function() {
					mostralinha[0]=true;
					mostralinha[1]=_this;
					container_gui_pop.removeAllChildren();
				});
			}


			container_gui_pop.alpha=0.75;
			container_gui_pop.x=stage.mouseX+150;
			container_gui_pop.y=stage.mouseY-150;
			if(container_gui_pop.x>1200){
				container_gui_pop.x=stage.mouseX-400;
			}
		}
		function criaLinha(obj1, obj2) {

			stage.removeChild(line);
			line = new createjs.Shape();
			stage.addChild(line);
			line.graphics.setStrokeStyle(5);
			line.graphics.beginStroke('yellow');
			line.graphics.moveTo(mostralinha[1].x, mostralinha[1].y);
			line.graphics.lineTo(stage.mouseX, stage.mouseY);
			line.graphics.endStroke();

		}
		function criamenu1(){
			document.getElementById("menuBotoesImagens").style.display="block";
			container_gui.removeAllChildren();
			container_gui.x=0;
			container_gui.y=0;

			if(itens[itemselecionado][2]){
				if(itens[itemselecionado][2].length>1){
					for(var i=1;i<itens[itemselecionado][2].length;i++){
						adicionaImagemContainer(
							itens[itemselecionado][2][i][0],
							i,
							false,
							[itens[itemselecionado][2][i][1],itens[itemselecionado][2][i][2]],
							itens[itemselecionado][2][i][5]
							);
					}

				}
			}

			var btmais = new createjs.Bitmap(caminho+"btmais.png");
			btmais.image.onload = function(){};
			btmais.y=50
			btmais.on("click", function() {


			});

		}
		function criamenu2(){
			document.getElementById("menuBotoesImagens").style.display="block";
			container_gui.removeAllChildren();
			container_gui.x=0;
			container_gui.y=0;

			if(itens[itemselecionado][2].length>1){
				for(var i=1;i<itens[itemselecionado][2].length;i++){
					console.log("teste="+itens[itemselecionado][2][i][0]);
					adicionaImagemContainer(
						itens[itemselecionado][2][i][0],
						i,
						false,
						[itens[itemselecionado][2][i][1],itens[itemselecionado][2][i][2]]);
				}

			}

			var btmais = new createjs.Bitmap(caminho+"btmais.png");
			btmais.image.onload = function(){};
			btmais.y=50
			btmais.on("click", function() {


			});

		}
		function carregaVideo(e){
			var reader = new FileReader();
			reader.onload = function(event){

				video1.src=event.target.result;

			}
			reader.readAsDataURL(e.target.files[0]); 
			console.log(e.target.files[0].name);    
		}
		function carregaImagem(evt) {
			mostralinha[0]=false;
			stage.removeChild(line);
			var files = evt.target.files; 
			for (var i = 0, f; f = files[i]; i++) {

				if (!f.type.match('image.*')) {
					continue;
				}
				var reader = new FileReader();
				reader.onload = (function(theFile) {
					return function(e) {
						caixaDialogo(itens[itemselecionado][2].length,files[0].name);
						debugador();
					};
				})(f);

				reader.readAsDataURL(f);
			}
		}
		function adicionaImagemContainer(_qual,_id,_novo,_pos,_tipinho){
			var imagem;
			if(_tipinho=="mao1"){
				imagem=new createjs.Sprite(mao1sp, "tempo1").set({x:500,y:500});
				imagem.qual="mao1";
			}else if(_tipinho=="mao2"){
				imagem=new createjs.Sprite(mao2sp, "tempo1").set({x:500,y:500});
				imagem.qual="mao2";
			}else{
				var imagem = new createjs.Bitmap(caminho+_qual);
				imagem.image.onload = function(){};
				imagem.qual=_qual;
			}
			imagem.id=_id;

			container_gui.addChild(imagem);
			imagem.name="imagem";

			imagem.x=_pos[0];
			imagem.y=_pos[1];

			var btClose = new createjs.Bitmap(caminho+"btfechar.png");
			btClose.image.onload = function(){};
			btClose.name="btfecha"+_id;
			btClose.mae=imagem;
			btClose.x=imagem.x;
			btClose.y=imagem.y;
			btClose.id=_id;
			container_gui.addChild(btClose);
			btClose.on("click", function() {
				container_gui_pop.removeAllChildren();
				container_gui.removeChild(this.mae);
				container_gui.removeChild(this);
				itens[itemselecionado][2].splice(this.id,1);
				contItemSel.menu=null;
				debugador();
				var t2 = container_gui.getChildByName("goto"+this.id);
				if(t2){
					container_gui.removeChild(t2);
				}

			});

			if(_novo){
				console.log("nova imagem");
				itens[itemselecionado][2].push([_qual]);
				itens[itemselecionado][2][_id][4]=false;
				itens[itemselecionado][2][_id][5]=_tipinho;
				if(_tipinho=="arraste"){
					itens[itemselecionado][2][_id][6]=false;
				}
			}
			if(itens[itemselecionado][2][_id][3]!=null){
				var bt2 = new createjs.Bitmap(caminho+"n"+itens[itemselecionado][2][_id][3]+".png");
				bt2.image.onload = function(){};
				bt2.name="goto"+_id;
				container_gui.addChild(bt2);
				bt2.x=imagem.x+35;
				bt2.y=imagem.y;
			}
			imagem.on('mousedown', function(evt){
				imagemselecionada=this;
				container_gui_pop.removeAllChildren();
				var stageX = evt.stageX,
				stageY = evt.stageY,
				localPos = this.globalToLocal(stageX, stageY);
				this._localPos = localPos;
				if(mostralinha[0]){
					mostralinha[0]=false;
					stage.removeChild(line);
					itens[itemselecionado][2][idAnterior][6]=this.qual;
				}
			});
			imagem.on('pressup', function(evt){
				itens[itemselecionado][2][this.id][1]=Math.floor(this.x);
				itens[itemselecionado][2][this.id][2]=Math.floor(this.y);
				var _tipo=itens[itemselecionado][2][this.id][5];
				if(_tipo=="botao" || _tipo=="marcador"|| _tipo=="arraste"|| _tipo=="mao1" || _tipo=="mao2"){
					popupDragImagens(this.id,this,itens[itemselecionado][2][this.id][5]);
				}
				debugador();
				nomeAnterior=this.qual;
				idAnterior=this.id;
			});
			imagem.on('pressmove', function(evt){
				var t = container_gui.getChildByName("btfecha"+this.id);
				t.x=this.x;
				t.y=this.y;			
				var t2 = container_gui.getChildByName("goto"+this.id);
				if(t2){
					t2.x=this.x+35;
					t2.y=this.y;
				}

				this.x = evt.stageX - this._localPos.x;
				this.y = evt.stageY - this._localPos.y;
			});
		}
		function caixaDialogo(_id,_url) {
			var txt1,txt2,txt3,txt4,txt5;
			txt1 = new createjs.Text("Esta imagem é:", "45px VAG Rounded BT", "#000000");
			txt1.textAlign = "center";
			txt1.x=640;
			txt1.y=50;
			txt2 = new createjs.Text("•IMAGEM", "55px VAG Rounded BT", "#000000");
			txt2.textAlign = "center";
			txt2.x=300;
			txt2.y=200;
			txt2.addEventListener("click", function(event) { 	
				stage.removeChild(t);
				adicionaImagemContainer(_url,_id,true,[0,0],"imagem");
			});		

			txt3 = new createjs.Text("•MARCADOR", "55px VAG Rounded BT", "#000000");
			txt3.textAlign = "center";
			txt3.x=300;
			txt3.y=300;
			txt3.addEventListener("click", function(event) { 
				stage.removeChild(t);
				adicionaImagemContainer(_url,_id,true,[0,0],"marcador");
			});

			var btMao1 = new createjs.Bitmap(caminho+"btMenuMao1.png");
			btMao1.image.onload = function(){};
			btMao1.x=750;
			btMao1.y=150;
			btMao1.id=_id;
			btMao1.on("click", function() {
				stage.removeChild(t);
				adicionaImagemContainer(_url,_id,true,[0,0],"mao1");
			});		
			var btMao2 = new createjs.Bitmap(caminho+"btMenuMao2.png");
			btMao2.image.onload = function(){};
			btMao2.x=750;
			btMao2.y=300;
			btMao2.id=_id;
			btMao2.on("click", function() {
				stage.removeChild(t);
				adicionaImagemContainer(_url,_id,true,[0,0],"mao2");
			});
			if(itens[itemselecionado][2][0]=="menu1"){
				txt4 = new createjs.Text("•BOTÃO", "55px VAG Rounded BT", "#000000");
				txt4.textAlign = "center";
				txt4.x=300;
				txt4.y=400;
				txt4.addEventListener("click", function(event) {
					stage.removeChild(t);
					adicionaImagemContainer(_url,_id,true,[0,0],"botao");
				});
			}else if(itens[itemselecionado][2][0]=="menu2"){
				txt4 = new createjs.Text("•BOTÃO ARRASTAR", "55px VAG Rounded BT", "#000000");
				txt4.textAlign = "center";
				txt4.x=300;
				txt4.y=400;
				txt4.addEventListener("click", function(event) {
					stage.removeChild(t);
					adicionaImagemContainer(_url,_id,true,[0,0],"arraste");
				});			

				txt5 = new createjs.Text("•HIT (Alvo)", "55px VAG Rounded BT", "#000000");
				txt5.textAlign = "center";
				txt5.x=300;
				txt5.y=500;
				txt5.addEventListener("click", function(event) {
					stage.removeChild(t);
					adicionaImagemContainer(_url,_id,true,[0,0],"hit");
				});

			}

			var button = new createjs.Shape();
			button.graphics.beginLinearGradientFill(["#ffffff", "#d5d5d5"], [0, 1], 0, 0, 0, 720);
			button.graphics.drawRoundRect(0, 0, canvas.width, canvas.height, 20);
			button.graphics.endFill();
			button.alpha=0.75;

			button.addEventListener("click", function(event) { });

			var t = new createjs.Container();
			t.addChild(button);
			t.addChild(txt1);
			t.addChild(txt2);
			t.addChild(txt3);
			t.addChild(txt4);
			t.addChild(txt5);
			t.addChild(btMao1);
			t.addChild(btMao2);

			stage.addChild(t);
		}
		document.addEventListener("keydown", function (e) {
			var evtobj = window.event? event : e;
			if(_modoedicao){
				if(evtobj.shiftKey){
					if(travazoom){
						travazoom=false;
						console.log(itemselecionado);
						document.getElementById(_idContainer).style.width="200%";
						document.getElementById(_idContainer).style.left="-"+stage.mouseX+"px";
						document.getElementById(_idContainer).style.top="-"+stage.mouseY+"px";
					}
				}
			}
		});	
		document.addEventListener("keyup", function (e) {
			travazoom=true;
			var evtobj = window.event? event : e;
			if(_modoedicao){
				console.log(itemselecionado);
				document.getElementById(_idContainer).style.width="80%";
				document.getElementById(_idContainer).style.left="0px";
				document.getElementById(_idContainer).style.top="0px";
			}
		});
		function debugador(){
			var myJSON = JSON.stringify(itens);
			document.getElementById("debugador").textContent="var _itens="+myJSON+";";
		}
/***
 *      __  _                        _  _  _                           _       
 *     / _|(_)                      | |(_)| |                         | |      
 *    | |_  _  _ __ ___     ___   __| | _ | |_   _ __ ___    ___    __| |  ___ 
 *    |  _|| || '_ ` _ \   / _ \ / _` || || __| | '_ ` _ \  / _ \  / _` | / _ \
 *    | |  | || | | | | | |  __/| (_| || || |_  | | | | | || (_) || (_| ||  __/
 *    |_|  |_||_| |_| |_|  \___| \__,_||_| \__| |_| |_| |_| \___/  \__,_| \___|
 *                                                                             
 *                                                                             
 */
 function montaInicio(){


 	var btiniciar = new createjs.Bitmap(caminho + _btiniciar);
 	stage.addChild(btiniciar);
 	btiniciar.on('mousedown', function(evt){
 		var elementoScroll = document.getElementById(_idContainer);
 		elementoScroll.scrollIntoView();
 		stage.removeChild(this);

 		if(_trilha){
 			var musicafundo=new Audio(caminho+_trilha);
 			musicafundo.play();
 			musicafundo.loop=true;
 		}
 		cenaAtual=0;
 		menuTipo=itens[cenaAtual][2][0];
 		inicioFim=itens[cenaAtual];
 		inicioFim[1][1]=true;
 		video1.currentTime=inicioFim[0][0];

 		if(inicioFim[0][0]==inicioFim[1][0]){
 			montaMenuTipo2();
 		}else{
 			video1.play();
 			setTimeout(function(){
 				video1.play();
 			},500);
 			setTimeout(function(){
 				video1.play();
 			},1000);
 		}
 	});

 	btFull = new createjs.Bitmap(caminho+"btFullscreen.png").set({x:canvas.width-120,y:canvas.height-120,scaleX:1,scaleY:1});
 	stage.addChild(btFull);
 	btFull.addEventListener("click", function(){
 		alternaFullScreen(_idContainer,btFull,caminho+"btFullscreen.png",caminho+"btFullscreen2.png",_idVideo,_idCanvas);
 	}, false);
 }
 
 function montaMenuTipo2(){
 	jogoClicavel=true;
 	container_cenas.removeAllChildren();
 	count=0;
 	countTotal=0;
 	hits = [];
 	for(var i=1;i<itens[cenaAtual][2].length;i++){
 		if(itens[cenaAtual][2][i][5]=="mao1"){
 			botao=new createjs.Sprite(mao1sp, "tempo1");
 			console.log("carrega maozinha teste");
 		}else if(itens[cenaAtual][2][i][5]=="mao2"){
 			botao=new createjs.Sprite(mao2sp, "tempo1");
 		}else{
 			botao = new createjs.Bitmap(caminho+itens[cenaAtual][2][i][0]);
 			botao.image.onload = function(){};

 		}
 		botao.name=itens[cenaAtual][2][i][0];
 		botao.nome=itens[cenaAtual][2][i][0].slice(0, -4);
 		botao.x=itens[cenaAtual][2][i][1];
 		botao.y=itens[cenaAtual][2][i][2];
 		botao.px=itens[cenaAtual][2][i][1];
 		botao.py=itens[cenaAtual][2][i][2];
 		botao.seq=itens[cenaAtual][2][i][3];
 		botao.menutipo=itens[cenaAtual][2][0];
 		botao.resposta=itens[cenaAtual][2][i][4];
 		botao.tipo=itens[cenaAtual][2][i][5];
 		botao.alvo=itens[cenaAtual][2][i][6];
 		if(_arrasteMultiplo){
 			if(itens[cenaAtual][2][i][6]){
 				countTotal++;
 			}
 		}else{
 			countTotal=1;
 		}
 		container_cenas.addChild(botao);
 		if(_tipoTransicao=="fade"){
 			botao.alpha=0.1;
 			createjs.Tween.get(botao).wait(i*100).to({ alpha: 1}, 200, transicao);
 		}else{
 			botao.scaleX=0.1;
 			botao.scaleY=0.1;
 			createjs.Tween.get(botao).wait(i*100).to({ scaleX: 1,scaleY:1 }, 250, transicao);
 		}
 		console.log("seq="+itens[cenaAtual][2][i][3]);
 		if(itens[cenaAtual][2][i][5]=="hit"){
 			hits.push(botao);
 			if(_escondeHit){
 				botao.visible=false;

 			}
 		}
 		if(itens[cenaAtual][2][i][5]=="botao" || itens[cenaAtual][2][i][5]=="marcador" || itens[cenaAtual][2][i][5]=="mao1" || itens[cenaAtual][2][i][5]=="mao2"){
 			botao.on('mouseover', function() {
 				this.cursor = "pointer";
 				this.alpha=0.5;
 			});
 			botao.on('mouseout', function() {
 				this.alpha=1;
 			});
 			botao.on('mousedown', function() {
 				this.scaleX=0.75;
 				this.scaleY=0.75;
 				createjs.Tween.get(this).to({ scaleX: 1,scaleY:1 }, 750, createjs.Ease.backOut);
 				if(jogoClicavel){
 					
 					if(this.tipo=="marcador" || this.tipo=="mao1" || this.tipo=="mao2"){
 						jogoClicavel=false;
 						cenaAtual=this.seq;
 						menutipo=this.menutipo;
 						condicionaLink(cenaAtual);
 					}else{
 						var som=new Audio(caminho+this.nome+".mp3");
 						som.play();
 						
 						console.log(caminho+this.nome+".mp3");
 						var tamXeste=this.getBounds().width;
 						var tamYeste=this.getBounds().height;
 						if(this.resposta){
 							animaIco("certo",this.x+tamXeste/2,this.y+tamYeste/2);
 						}else{
 							animaIco("errado",this.x+tamXeste/2,this.y+tamYeste/2);
 						}
 						if(this.seq){
 							jogoClicavel=false;
 							cenaAtual=this.seq;
 							menutipo=this.menutipo;
 							video1.pause();
 							setTimeout(function(){
 								condicionaLink(cenaAtual);
 							},1000);
 						}
 					}
 				}
 			});
 		}else if(itens[cenaAtual][2][i][5]=="arraste"){
 			botao.arrastavel=true;
 			botao.on('mouseover', function() {
 				if(this.arrastavel && jogoClicavel){
 					this.cursor = "pointer";
 				}
 			});
 			botao.on('mousedown', function(evt){
 				if(this.arrastavel && jogoClicavel){
 					var stageX = evt.stageX,
 					stageY = evt.stageY,
 					localPos = this.globalToLocal(stageX, stageY);
 					this._localPos = localPos;
 				}
 			});
 			botao.on('pressmove', function(evt){
 				if(this.arrastavel && jogoClicavel){
 					this.x = evt.stageX - this._localPos.x;
 					this.y = evt.stageY - this._localPos.y;
 				}
 			});
 			botao.on('pressup', function() {

 				if(this.arrastavel && jogoClicavel){
 					var colidiu = false;
 					var continuar=true;
 					var len=container_cenas.getNumChildren();
 					//var obj=container_cenas.getChildByName(this.alvo);
 					//if(obj){
 						for(var i=0;i<hits.length;i++){
 							//var obj=container_cenas.getChildAt(i);
 							if(hits[i].tipo=="hit"){
 								var colisao = ndgmr.checkPixelCollision(hits[i], this, 0.1, true);
 								if (colisao) {
 									colidiu = true;
 									console.log("colisao com:"+hits[i].name+"  alvo "+this.alvo);
 									console.log("count :"+count);
 									
 									var tamXeste=this.getBounds().width;
 									var tamYeste=this.getBounds().height;
 									var tamXalvo=hits[i].getBounds().width;
 									var tamYalvo=hits[i].getBounds().height;
 									

 									if(this.alvo==hits[i].name){
 										continuar=false;
 										if(_centralizaPivot){
 											this.regX=tamXeste/2;
 											this.regY=tamYeste/2;
 											this.x=hits[i].x+tamXalvo/2;
 											this.y=hits[i].y+tamYalvo/2;
 										}else{
 											this.x=hits[i].x;
 											this.y=hits[i].y;
 										}
 										continuar=false;
 										this.scaleX=0.75;
 										this.scaleY=0.75;
 										createjs.Tween.get(this).to({ scaleX: 1,scaleY:1 }, 300, createjs.Ease.backOut);
 										animaIco("certo",this.x,this.y);
 										this.arrastavel=false;
 										count+=1;
 										if(count>=countTotal){
 											jogoClicavel=false;
 											cenaAtual=this.seq;
 											menutipo=this.menutipo;
 											video1.pause();
 											setTimeout(function(){
 												condicionaLink(cenaAtual);
 											},1000);
 										}
 										break;
 									}else{
 										if(_feedbackErrado){
 											if(this.seq!=null){
 												if(count>=countTotal){
 													console.log("colisao errada, vai para seq:"+this.seq);
 													continuar=false;
 													jogoClicavel=false;
 													cenaAtual=this.seq;
 													var tempseq=this.seq;
 												}
 											}
 										}
 									}
 									

 								}else{
 									
 									//createjs.Tween.get(this).to({ x: this.px, y: this.py }, 300, createjs.Ease.backOut);
 								}
 							}
 						}
 					//}
 					if(continuar){
 						animaIco("errado",this.x,this.y);
 						createjs.Tween.get(this).to({ x: this.px, y: this.py }, 300, createjs.Ease.backOut);
 						if(colidiu){
 							if(_feedbackErrado){
 								if(this.seq!=null){
 									jogoClicavel=false;
 									var tempseq=this.seq;
 									setTimeout(function(){
 										condicionaLink(tempseq);
 									},1000);
 								}
 							}
 						}
 					}
 				}
 			});
 		}
 	}
 	console.log("countTotal "+countTotal);
 }
 function condicionaLink(_url){
 	container_cenas.removeAllChildren();
 	menudentrodoloop=true;
 	inicioFim=itens[_url];
 	if(inicioFim[0][0]==inicioFim[1][0]){
 		video1.pause();
 		video1.currentTime=inicioFim[0][0];

 		montaMenuTipo2();
 		
 	}else{
 		//console.log("_url:"+inicioFim);
 		inicioFim[1][1]=true;
 		video1.currentTime=inicioFim[0][0];
 		video1.play();
 		jogoClicavel=true;
 	}
 }
 function animaIco(qual, b, c) {
 	var ico;
 	ico = new createjs.Bitmap(caminho + qual + ".png");
 	stage.addChild(ico);
 	ico.x = b;
 	ico.y = c;
 	ico.regX = 155;
 	ico.regY = 155;
 	ico.scaleX = ico.scaleY = 0.1;
 	createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut).wait(600).call(deleta);
 }
 function deleta() {
 	stage.removeChild(this);
 }

 video1.addEventListener('loadeddata', function() {
 	loaded1=true;
 	proporcaoVideo=1280/(video1.duration*10);
 	console.log(proporcaoVideo);
 }, false);
 video1.onended = function() {
 	video1.pause();

 };
 video1.addEventListener('timeupdate', function () {
 	if(!_modoedicao){
 		if(inicioFim[1][1]==true){
 			if(video1.currentTime>inicioFim[1][0]){
 				if(inicioFim[2]==null && inicioFim[3]>=0){
 					console.log("pula cena sem menu");
 					cenaAtual=inicioFim[3];
 					inicioFim=itens[cenaAtual];
 					inicioFim[1][1]=true;
 					video1.currentTime=inicioFim[0][0];
 					video1.play();
 				}else{
 					if(inicioFim[1][2]>0){
 						console.log("verifica loop:"+inicioFim[1][2]);
 						video1.currentTime=inicioFim[1][2];
 						video1.play();
 						if(menudentrodoloop){
 							executaAcaoFimSequencia();
 						}
 						menudentrodoloop=false;
 					}else{
 						console.log("not loop");
 						inicioFim[1][1]=false;
 						video1.pause();
 						executaAcaoFimSequencia();

 					}
 				}
 			}
 		}
 	}else{
 		if(!video1.paused){
 			tempoAtual=(video1.currentTime+0.1).toFixed(1);
 			posicaoAgulha+=proporcaoVideo;
 			barrinhaVideo.scaleX=posicaoAgulha /1280;
 			txtTempoVideo.x=posicaoAgulha/1.05;
 			txtTempoVideo.text=tempoAtual;
 		}
 	}
 }, false);
 function executaAcaoFimSequencia(){

 	console.log("cenaAtual="+cenaAtual);
 	menuTipo=itens[cenaAtual][2][0];
 	if(inicioFim[3]!=null){
 		cenaAtual=inicioFim[3];
 		inicioFim=itens[cenaAtual];
 		inicioFim[1][1]=true;
 		video1.currentTime=inicioFim[0][0];
 		if(inicioFim[0][0]==inicioFim[1][0]){
 			montaMenuTipo2();
 		}else{
 			video1.play();

 		}
 	}else{

 		montaMenuTipo2();
 		
 	}
 }
 function ticker(event){
 	stage.update();
 	if(mostralinha[0]){
 		criaLinha(mostralinha[1],mostralinha[2]);
 	}
 	if(loaded1 && loaded2){
 		
 		document.getElementById(_idVideo).style.display="block";
 		document.getElementById(_idCanvas).style.display="block";
 		divLoading.style.display="none";
 		loaded2=false;
 		loaded1=false;
 	}
 }

}