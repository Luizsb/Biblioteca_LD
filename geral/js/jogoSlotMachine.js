var appSlotMachine=function(idCanvas,_resposta,_textos,_img1,_img2,_img3,_img4){
			var canvas;
			var stage;
			var content;
			var contenttext;
			var contentgui;
			var fundos=[];
			var count=0;
			var sons = ["slot1.mp3","slot2.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3"]; 
			var caminho="resources/image/";
			var ingredientes=[];
			var subcount=0;
			var painel;
			var votopartido=false;
			var votobranco=false;
			var voto='';
			var fundo1;
			var fundo2;
			var spBt1,spBt2,spBt3,spBt4,spBt5;
			var bt1,bt2,bt3,bt4,bt5;
			var img1,img2,img3,img4,img5;
			var posicoes=[[{x:90,y:185},{x:90,y:-185},{x:90,y:-550},{x:90,y:-915},{x:90,y:-1270}]];
			var altImg=367;
			var counters=[0,0,0,0];
			var btcorrige;

			var clicavel=[true,true,true,true];
			var myManifest=[
			{
				id: "fundo1",
				src: caminho+"fundo1.png"
			},
			{
				id: "fundo2",
				src: caminho+"fundo2.png"
			},
			{
				id: "btcorrige",
				src: caminho+"btcorrige.png"
			},
			{
				id: "positivo",
				src: caminho+"positivo.png"
			},
			{
				id: "tentenovamente",
				src: caminho+"tentenovamente.png"
			},
			{
				id: "bt_iniciar",
				src: caminho+"bt_iniciar.png"
			}
			];
			myManifest.push({src:caminho+_textos,id:'textos'});
			myManifest.push({src:caminho+_img1,id:'imagens1'});
			myManifest.push({src:caminho+_img2,id:'imagens2'});
			myManifest.push({src:caminho+_img3,id:'imagens3'});
			myManifest.push({src:caminho+_img4,id:'imagens4'});
			var queue = new createjs.LoadQueue();
			console.log(myManifest);

			queue.loadManifest(myManifest,true);
			queue.on("complete", loaded);
			function loaded() {
				var index;
				for (index in sons) {
					var t = sons[index];
					sons[index] = new Audio(caminho + t);
				}

				canvas = document.getElementById("od2");
				stage = new createjs.Stage(canvas);
				stage.enableMouseOver(10);
				contenttext = new createjs.Container();
				content = new createjs.Container();
				contentgui = new createjs.Container();

				spBt1 = new createjs.SpriteSheet({
					framerate: 20,
					"images": [caminho+"spritesheet1.png"],
					"frames": {"regX": 0, "height": 116, "count": 6, "regY": 0, "width": 237},
					"animations": {
						"idle": 0,
						"aperta": [0, 5, "idle",1]
					}
				});			
				spBt2 = new createjs.SpriteSheet({
					framerate: 20,
					"images": [caminho+"spritesheet2.png"],
					"frames": {"regX": 0, "height": 103, "count": 6, "regY": 0, "width": 191},
					"animations": {
						"idle": 0,
						"aperta": [0, 5, "idle",1]
					}
				});			
				spBt3 = new createjs.SpriteSheet({
					framerate: 20,
					"images": [caminho+"spritesheet3.png"],
					"frames": {"regX": 0, "height": 103, "count": 6, "regY": 0, "width": 189},
					"animations": {
						"idle": 0,
						"aperta": [0, 5, "idle",1]
					}
				});			
				spBt4 = new createjs.SpriteSheet({
					framerate: 20,
					"images": [caminho+"spritesheet4.png"],
					"frames": {"regX": 0, "height": 102, "count": 6, "regY": 0, "width": 208},
					"animations": {
						"idle": 0,
						"aperta": [0, 5, "idle",1]
					}
				});			
				spBt5 = new createjs.SpriteSheet({
					framerate: 20,
					"images": [caminho+"spritesheet5.png"],
					"frames": {"regX": 0, "height": 303, "count": 6, "regY": 0, "width": 179},
					"animations": {
						"idle": 0,
						"aperta": [0, 6, "idle",1]
					}
				});


				stage.addChild(content);
				stage.addChild(contenttext);
				stage.addChild(contentgui);
				img1 = new createjs.Bitmap(queue.getResult("imagens1"));
				content.addChild(img1).set({x:90,y:posicoes[0][3].y});
				img2 = new createjs.Bitmap(queue.getResult("imagens2"));
				content.addChild(img2).set({x:355,y:posicoes[0][3].y});
				img3 = new createjs.Bitmap(queue.getResult("imagens3"));
				content.addChild(img3).set({x:620,y:posicoes[0][3].y});
				img4 = new createjs.Bitmap(queue.getResult("imagens4"));
				content.addChild(img4).set({x:885,y:posicoes[0][3].y});

				fundo1 = new createjs.Bitmap(queue.getResult("fundo1"));
				content.addChild(fundo1);
				fundo2 = new createjs.Bitmap(queue.getResult("fundo2"));
				content.addChild(fundo2);
				var textos = new createjs.Bitmap(queue.getResult("textos"));
				content.addChild(textos);
				fundo2.visible=false;
				setInterval(function(){ 
					if(fundo1.visible){
						fundo2.visible=true;
						fundo1.visible=false;
					}else{
						fundo2.visible=false;
						fundo1.visible=true;
					}

				}, 1000);
				bt1 = new createjs.Sprite(spBt1, "aperta");
				stage.addChild(bt1).set({x:48,y:591,alpha:0.1});
				bt1.on("click", function() {
					acaoBt(bt1,img1,0);

				});
				bt2 = new createjs.Sprite(spBt2, "aperta");
				stage.addChild(bt2).set({x:370,y:596,alpha:0.1});
				bt2.on("click", function() {
					acaoBt(bt2,img2,1);
				});
				bt3 = new createjs.Sprite(spBt3, "aperta");
				stage.addChild(bt3).set({x:675,y:596,alpha:0.1});
				bt3.on("click", function() {
					acaoBt(bt3,img3,2);
				});
				bt4 = new createjs.Sprite(spBt4, "aperta");
				stage.addChild(bt4).set({x:945,y:595,alpha:0.1});
				bt4.on("click", function() {
					acaoBt(bt4,img4,3);
				});
				bt5 = new createjs.Sprite(spBt5, "aperta");
				stage.addChild(bt5).set({x:1102,y:416,alpha:0.1});
				bt5.on("click", function() {
					randomiza(bt5,img5);
				});
				btcorrige = new createjs.Bitmap(queue.getResult("btcorrige"));
				content.addChild(btcorrige).set({x:1000,y:0});
				btcorrige.on("click", function() {
					corrige();
				});
				var btiniciar = new createjs.Bitmap(queue.getResult("bt_iniciar"));
				btiniciar.alpha=0.75;
				stage.addChild(btiniciar);
				btiniciar.on("click", function() {
					var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
					stage.removeChild(btiniciar);
					randomiza(bt5,img5);

				});
				createjs.Ticker.setFPS(30);
				createjs.Ticker.addEventListener("tick", ticker);
			}
			function randomiza(_obj1,_obj2,_id){
				sons[1].play();
				btcorrige.x=1050;
				createjs.Tween.get(btcorrige).to({x:1000}, 250,createjs.Ease.backOut);
				clicavel[0]=false;
				clicavel[1]=false;
				clicavel[2]=false;
				clicavel[3]=false;
				_obj1.gotoAndPlay("aperta");
				_obj1.alpha=1;
				setTimeout(function(){_obj1.alpha=0.1},500);
				counters[0]=randomizaNum(counters[0]);
				counters[1]=randomizaNum(counters[1]);
				counters[2]=randomizaNum(counters[2]);
				counters[3]=randomizaNum(counters[3]);
				createjs.Tween.get(img1).to({y:posicoes[0][counters[0]].y}, 600,createjs.Ease.backOut).call(verifica,[0,img1]);
				createjs.Tween.get(img2).to({y:posicoes[0][counters[1]].y}, 600,createjs.Ease.backOut).call(verifica,[1,img2]);
				createjs.Tween.get(img3).to({y:posicoes[0][counters[2]].y}, 600,createjs.Ease.backOut).call(verifica,[2,img3]);
				createjs.Tween.get(img4).to({y:posicoes[0][counters[3]].y}, 600,createjs.Ease.backOut).call(verifica,[3,img4]);

			}
			function randomizaNum(_t){
				var num=0;
				for(var i=0;i<100;i++){
					num=Math.round(Math.random()*4);
					if(num!=_t){
						break;
					}
				}
				return num;
			}
			function acaoBt(_obj1,_obj2,_id){
				btcorrige.x=1050;
				createjs.Tween.get(btcorrige).to({x:1000}, 250,createjs.Ease.backOut);
				if(clicavel[_id]){
					sons[0].play();
					clicavel[_id]=false;
					_obj1.gotoAndPlay("aperta");
					_obj1.alpha=1;
					setTimeout(function(){_obj1.alpha=0.1},500);
					counters[_id]++;
					createjs.Tween.get(_obj2).to({y:posicoes[0][counters[_id]].y}, 600,createjs.Ease.backOut).call(verifica,[_id,_obj2]);
				}
			}
			function verifica(_id,_obj2){
				clicavel[_id]=true;
				console.log("figura:"+_id+" posicao"+counters[_id]);

				if(counters[_id]>=4){

					counters[_id]=0;
					_obj2.y=posicoes[0][counters[_id]].y;

				}
			}
			function corrige(){
				var corretos=0;
				for(var i=0;i<4;i++){
					if(counters[i]==_resposta[i]){
						animaIco("certo",i*260+220,250);
						corretos++;
					}else{
						animaIco("errado",i*260+220,250);
					}
				}
				if(corretos>=4){
					var btcorreto = new createjs.Bitmap(queue.getResult("positivo"));
					stage.addChild(btcorreto);
					btcorreto.on("click", function() {
						stage.removeChild(btcorreto);
						contentgui.removeAllChildren();
						randomiza(bt5,img5);
					});
				}else{
					var btcorreto = new createjs.Bitmap(queue.getResult("tentenovamente"));
					stage.addChild(btcorreto);
					btcorreto.on("click", function() {
						stage.removeChild(btcorreto);
						contentgui.removeAllChildren();
						randomiza(bt5,img5);
					});
				}
			}
			function animaTitulo(texto){
				var tit = new createjs.Container();
				contenttext.addChild(tit);

				var txt = new createjs.Text(texto, "42px VAG Rounded BT", "#000000");
				txt.regY=60;
				txt.lineWidth=750;
				txt.textAlign = "center";

				tit.addChild(txt);

				tit.x=-300;
				tit.y=100;
				createjs.Tween.get(tit).to({x:850},300,createjs.Ease.backOut);
			}
			function animaIco(qual, b, c) {
				var ico;
				ico = new createjs.Bitmap(caminho + qual + ".png");
				console.log(caminho + qual + ".png");
				contentgui.addChild(ico);
				ico.x = b;
				ico.y = c;
				ico.regX = 155;
				ico.regY = 155;
				ico.scaleX = ico.scaleY = 0.1;
				createjs.Tween.get(ico).to({ scaleX: 0.5, scaleY: 0.5 }, 200, createjs.Ease.quadOut);
			}
			function mostraDica(){
				var imagem = new createjs.Bitmap(caminho+"dica.png");
				imagem.image.onload = function(){};
				imagem.x=900;
				imagem.y=173;
				stage.addChild(imagem);
				createjs.Tween.get(imagem).to({alpha:0.25},300).to({alpha:1},300).to({alpha:0.25},300).to({alpha:1},300).wait(2000).call(apagaDica);

			}
			function apagaDica(){
				stage.removeChild(this);
			}
			function ticker(event){
				stage.update();
			}
		}