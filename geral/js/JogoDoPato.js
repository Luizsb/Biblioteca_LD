/*versao 1.3
-foi colocado sequencia certa pros itens
-adicionado sistema de colecao de moeda
-modo de edicao para posicionamento das moedas e log no console
-foi adicionado um if para alterar a posição inicial da tela e do personagem pelo template

*/

var AppJogoPatinho = function (_debugador, idCanvas, _btiniciar, _playerSprite, _mapa, _itens, _final, _tempo, _positivo, _playerInix, _playerIniy, _qInicioMapa, _frentePlayer, _segueSequencia) {
	var canvas,
	stage,
	content,
	contentitens,
	contentPlayer,
	transicao = false,
	sons = ["patinho.mp3", "erro.mp3", "PARABENS.mp3", "tentenovamente.mp3", "tambor.mp3"],
	caminho = "resources/image/",
	player,
	playerCol,
	firstKey,
	velocidadeX = 10,
	velocidadeY = 8,
	directions = [0, 90, 180, 270],
	moveDirection,
	paredes,
	btInicio,
	iniciar = true,
	bateColisao = 30,
	posicaoY = -620,
	posicaoX = 0,
	botoes = [],
	hits = [],
	countTempo = 10,
	calculaTempo = false,
	texto_tempo,
	rate = 0,
	pontos = 0,
	count = 0,
	_playerInix,
	_playerIniy,
	_qInicioMapa,
	_frentePlayer,
	textoPontos,
	quadrante = [0, 0],
	rotacoes = [180, 0, 90, -90],
	fundoPos = [[0, 0], [994, 0], [0, 991], [994, 991]],
	botoesPos = [[1000, 450], [1000, 600], [850, 600], [1150, 600]],
	keysPressed = {
		38: 0,
		40: 0,
		37: 0,
		39: 0
	},
	index;


	for (index in sons) {
		var t = sons[index];
		sons[index] = new Audio(caminho + t);
	}



	canvas = document.getElementById(idCanvas);
	stage = new createjs.Stage(canvas);
	stage.enableMouseOver(10);
	createjs.Touch.enable(stage);
	contenttext = new createjs.Container();
	content = new createjs.Container();
	contentitens = new createjs.Container();
	contentPlayer = new createjs.Container();



	stage.addChild(content);

	stage.addChild(contentPlayer);



	var i;
	for (i = 0; i < _mapa.length; i++) {
		var fundo = new createjs.Bitmap(caminho + _mapa[i].imagem);
		fundo.image.onload = function () { };
		fundo.x = fundoPos[i][0];
		fundo.y = fundoPos[i][1];
		content.addChild(fundo);

	}

	paredes = new createjs.Bitmap(caminho + "mapaHit.png");
	paredes.image.onload = function () { };
	if (_debugador) {
		paredes.alpha = 0.51;
	} else {
		paredes.alpha = 0.01;
	}

	paredes.scaleX = 2;
	paredes.scaleY = 2;
	if(_qInicioMapa >= 0 || _qInicioMapa < 0){
		posicaoY = _qInicioMapa;
		quadrante[1] = -1;
	}
	content.addChild(paredes);
	content.y = posicaoY;



	if(_frentePlayer != null){
		player = new createjs.Sprite(_playerSprite, _frentePlayer);
	}else{
		player = new createjs.Sprite(_playerSprite, "idleLado");
	}

	playerCol = new createjs.Bitmap(caminho + "quad.png");
	playerCol.image.onload = function () { };
	playerCol.regX = 41;
	playerCol.regY = 41;
	playerCol.scaleX = 0.5;
	playerCol.scaleY = 0.5;
	playerCol.alpha = 0.01;

	if(_playerInix > 0 || _playerIniy > 0){
		contentPlayer.x = _playerInix;
		contentPlayer.y = _playerIniy;
	}else{
		contentPlayer.x = 350;
		contentPlayer.y = 400;
	}
	contentPlayer.scaleX = -1;
	contentPlayer.addChild(player);
	contentPlayer.addChild(playerCol);

	colisaoFim = new createjs.Bitmap(caminho + _final[0].imagem);
	colisaoFim.image.onload = function () { };
	colisaoFim.x = _final[0].posicao[0];
	colisaoFim.y = _final[0].posicao[1];
	content.addChild(colisaoFim);
	if (_debugador) {
		colisaoFim.on("mousedown", function (evt) {
			this.parent.addChild(this);
			var global = content.localToGlobal(this.x, this.y);
			this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };

		});
		colisaoFim.on("pressmove", function (evt) {
			var local = content.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
			this.x = Math.floor(local.x);
			this.y = Math.floor(local.y);
			_final[0].posicao[0] = this.x;
			_final[0].posicao[1] = this.y;
			criaDebugador();
		});
	}

	var i;
	for (i = 0; i < 4; i++) {
		botoes[i] = new createjs.Bitmap(caminho + "botao.png");
		botoes[i].image.onload = function () { };
		botoes[i].regX = 80;
		botoes[i].regY = 80;
		botoes[i].scaleX = 0.75;
		botoes[i].scaleY = 0.75;
		botoes[i].id = i + 1;
		botoes[i].rotation = rotacoes[i];
		botoes[i].x = botoesPos[i][0];
		botoes[i].y = botoesPos[i][1];
		stage.addChild(botoes[i]);
		botoes[i].on("mousedown", function () {
			this.scaleX = 0.75;
			this.scaleY = 0.75;
			this.alpha = 0.5;
			moveDirection = this.id;
			sons[0].play();

		});
		botoes[i].on("pressup", function () {
			createjs.Tween.get(this).to({ alpha: 1, scaleX: 0.75, scaleY: 0.75 }, 250, createjs.Ease.backOut);
			moveDirection = 0;
		});
	}
	criaRelogio();


	var btinicio = new createjs.Bitmap(caminho + _btiniciar);
	btinicio.image.onload = function () { };
	stage.addChild(btinicio);
	btinicio.on("mousedown", function () {
		var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", ticker);
		stage.removeChild(this);
		calculaTempo = true;

	});



	criaitens();
	textoPontos = new createjs.Text("Pontos: 0", "bold 80px VAG Rounded BT", "#ffffff");
	textoPontos.shadow = new createjs.Shadow("#000000", 1, 1, 10);
	content.addChild(contentitens);

	stage.update();
	setTimeout(function () { stage.update(); }, 2000);

	function criaitens() {
		for (i = 0; i < _itens.length; i++) {
			hits[i] = new createjs.Bitmap(caminho + _itens[i].imagem);
			hits[i].image.onload = function () { };
			contentitens.addChild(hits[i]);
			hits[i].x = _itens[i].posicao[0];
			hits[i].y = _itens[i].posicao[1];
			hits[i].name = i;
			console.log("criamoeda" + hits[i].name);


			if (_debugador) {
				hits[i].on("mousedown", function (evt) {
					this.parent.addChild(this);
					var global = contentitens.localToGlobal(this.x, this.y);
					this.offset = { 'x': global.x - evt.stageX, 'y': global.y - evt.stageY };

				});
				hits[i].on("pressmove", function (evt) {
					var local = contentitens.globalToLocal(evt.stageX + this.offset.x, evt.stageY + this.offset.y);
					this.x = Math.floor(local.x);
					this.y = Math.floor(local.y);
					_itens[this.name].posicao[0] = this.x;
					_itens[this.name].posicao[1] = this.y;
					criaDebugador();

				});

			}
		}
	}

	function criaDebugador() {
		console.clear();
		var debugador = '';
		var j;

		console.log(_itens.length);
		debugador += '\n';
		debugador += 'var itens=[';
		debugador += '\n';
		for (j = 0; j < _itens.length; j++) {
			debugador += '{' + 'imagem:"' + _itens[j].imagem + '",posicao:[' + _itens[j].posicao[0] + ',' + _itens[j].posicao[1] + ']';

			if (j == _itens.length - 1) {
				debugador += '}';
			} else {
				debugador += '},';
			}
			debugador += '\n';

		}
		debugador += '];';

		debugador += '\n';
		debugador += 'var final=[';
		debugador += '{' + 'imagem:"' + _final[0].imagem + '",posicao:[' + _final[0].posicao[0] + ',' + _final[0].posicao[1] + ']}];';

		console.log(debugador);
	}

	function detectKeys() {


		if (keysPressed[38] === 1) {

			moveDirection = 1;
		}
		if (keysPressed[40] === 1) {

			moveDirection = 2;
		}
		if (keysPressed[37] === 1) {

			moveDirection = 3;
		}
		if (keysPressed[39] === 1) {

			moveDirection = 4;


		}
	}
	function reseta() {
		count = 0;
		transicao = false;
		content.x = 0;
		if(_qInicioMapa >= 0 || _qInicioMapa < 0){
			posicaoY = _qInicioMapa;
			console.log(_qInicioMapa);
			quadrante[1] = -1;
			content.y = posicaoY;
		}else{
			content.y = -620;
		}
		if(_playerInix > 0 || _playerIniy > 0){
			contentPlayer.x = _playerInix;
			contentPlayer.y = _playerIniy;
		}else{
			contentPlayer.x = 350;
			contentPlayer.y = 400;
		}
		player.visible = true;
		criaRelogio();
		calculaTempo = true;
		contentitens.removeAllChildren();
		criaitens();
	}
	function criaRelogio() {
		countTempo = _tempo;
		texto_tempo = new createjs.Text(countTempo + "s", "bold 80px VAG Rounded BT", "#ffffff");
		texto_tempo.shadow = new createjs.Shadow("#000000", 1, 1, 10);
		texto_tempo.x = 1100;
		texto_tempo.y = 50;
		texto_tempo.textAlign = "center";
		stage.addChild(texto_tempo);
	}
	function Fim(i_erros) {
		calculaTempo = false;
		var img;
		var bo;
		var continua = false;
		iniciar = false;
		if (i_erros > 3) {
			img = caminho + "tentenovamente.png";
			continua = true;
			sons[3].play();
		} else {
			img = caminho + _positivo;
			continua = true;
			sons[2].play();
		}
		if (continua) {
			bo = new createjs.Bitmap(img);
			bo.image.onload = function () { };
			bo.regX = 292 / 2;
			bo.regY = 400 / 2;
			bo.x = 500;
			bo.y = 1000;
			stage.addChild(bo);
			createjs.Tween.get(bo).wait(200).to({ y: 350 }, 1000, createjs.Ease.bounceOut);
			if (i_erros <= 3) {
				if (_itens.length > 0) {
					stage.addChild(textoPontos);
					textoPontos.text = "Pontos: " + pontos;
					textoPontos.x = 50;
					textoPontos.y = 50;
				}
			}
			bo.on("mousedown", function (evt) {
				iniciar = true;
				stage.removeChild(this);
				stage.removeChild(texto_tempo);
				stage.removeChild(textoPontos);
				reseta();
			});
		}
	}
	function ticker(event) {
		if (calculaTempo) {
			if (rate > 30) {
				rate = 0;
				countTempo -= 1;
				texto_tempo.text = countTempo + "s";
				rate = 0;
				if (countTempo < 1) {
					calculaTempo = false;
					stage.removeChild(texto_tempo);
					Fim(5);
				}
			}
			rate++;
		}
		stage.update();
		if (iniciar) {
			detectKeys();
			if (!transicao) {
				if (moveDirection == 1) {
					if (player.currentAnimation !== "andaTras") {
						player.gotoAndPlay("andaTras");
					}
					contentPlayer.y -= velocidadeY;
				} else if (moveDirection == 2) {
					if (player.currentAnimation !== "andaFrente") {
						player.gotoAndPlay("andaFrente");
					}
					contentPlayer.y += velocidadeY;
				} else if (moveDirection == 3) {
					if (player.currentAnimation !== "anda") {
						player.gotoAndPlay("anda");
					}
					contentPlayer.scaleX = 1;
					contentPlayer.x -= velocidadeX;
				} else if (moveDirection == 4) {
					if (player.currentAnimation !== "anda") {
						player.gotoAndPlay("anda");
					}
					contentPlayer.scaleX = -1;
					contentPlayer.x += velocidadeX;
				}
				if (moveDirection == 0) {
					if(_frentePlayer != null){
						player.gotoAndStop(_frentePlayer);
					}else{
						player.gotoAndStop("idleLado");
					}
				}
				var collision = ndgmr.checkPixelCollision(playerCol, paredes, 0.1, true);
				if (collision) {
					if (moveDirection == 1) {
						contentPlayer.y += velocidadeY;
					} else if (moveDirection == 2) {
						contentPlayer.y -= velocidadeY;
					} else if (moveDirection == 3) {
						contentPlayer.x += velocidadeX;
					} else if (moveDirection == 4) {
						contentPlayer.x -= velocidadeX;
					}

				}

				if (contentPlayer.y < 50) {
					transicao = true;
					if (quadrante[1] == 0) {
						posicaoY = 0;
						quadrante[1] = -1;
					} else if (quadrante[1] == 1) {
						posicaoY = -620;
						quadrante[1] = 0;
					}
					createjs.Tween.get(contentPlayer).to({ y: 600 }, 500, createjs.Ease.quadOut).call(fimTransicao);
					createjs.Tween.get(content).to({ y: posicaoY }, 500, createjs.Ease.quadOut);
				}
				if (contentPlayer.y > 670) {
					transicao = true;
					if (quadrante[1] == 0) {
						posicaoY = -1240;
						quadrante[1] = 1;
					} else if (quadrante[1] == -1) {
						posicaoY = -620;
						quadrante[1] = 0;
					}
					createjs.Tween.get(contentPlayer).to({ y: 120 }, 500, createjs.Ease.quadOut).call(fimTransicao);
					createjs.Tween.get(content).to({ y: posicaoY }, 500, createjs.Ease.quadOut);
				}
				if (contentPlayer.x < 50) {
					transicao = true;
					if (quadrante[0] == 1) {
						posicaoX = 0;
						quadrante[0] = 0;
					}
					createjs.Tween.get(contentPlayer).to({ x: 750 }, 500, createjs.Ease.quadOut).call(fimTransicao);
					createjs.Tween.get(content).to({ x: posicaoX }, 500, createjs.Ease.quadOut);
				}
				if (contentPlayer.x > 1230) {
					transicao = true;
					if (quadrante[0] == 0) {
						posicaoX = -700;
						quadrante[0] = 1;
					}
					createjs.Tween.get(contentPlayer).to({ x: 600 }, 500, createjs.Ease.quadOut).call(fimTransicao);
					createjs.Tween.get(content).to({ x: posicaoX }, 500, createjs.Ease.quadOut);
				}
				console.log(posicaoY);

				if (!_debugador) {
					var collisionFim = ndgmr.checkRectCollision(playerCol, colisaoFim);
					if (collisionFim) {
						contentPlayer.scaleX = -1;
						player.gotoAndStop("idleLado");
						transicao = true;
						player.visible = false;
						Fim(0);

					}
					var i;
					for (i = 0; i < hits.length; i++) {
						var collisionItem = ndgmr.checkRectCollision(playerCol, hits[i]);
						if (collisionItem) {
							console.log("moeda " + hits[i].name+"count " + count);
							if (_segueSequencia) {
								if (hits[i].name == count) {								
									contentitens.removeChild(hits[i]);
									hits.splice(i, 1);
									pontos += 10;
									countTempo += 5;
									texto_tempo.scaleX = 3;
									texto_tempo.scaleY = 3;
									createjs.Tween.get(texto_tempo).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.bounceOut);
									sons[4].play();
									count += 1;
									break;
								}
							} else {
								contentitens.removeChild(hits[i]);
								hits.splice(i, 1);
								pontos += 10;
								countTempo += 5;
								texto_tempo.scaleX = 3;
								texto_tempo.scaleY = 3;
								createjs.Tween.get(texto_tempo).to({ scaleX: 1, scaleY: 1 }, 500, createjs.Ease.bounceOut);
								sons[4].play();

							}

						}
					}


				}

			}
		}

	}
	function fimTransicao() {
		transicao = false;
	}
	document.addEventListener("keydown", function (e) {
		keysPressed[e.keyCode] = 1;
		if (!firstKey) { firstKey = e.keyCode; }
	});
	document.addEventListener("keyup", function (e) {
		keysPressed[e.keyCode] = 0;
		if (firstKey === e.keyCode) { firstKey = null; }
		moveDirection = 0;

	});
};
