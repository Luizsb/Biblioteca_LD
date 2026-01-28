/*
Versao 1

*/

var board;
var sons = ["som1.mp3", "som2.mp3", "som3.mp3", "som4.mp3", "som5.mp3","tambor.mp3"]; 

var App=function (idCanvas) {

    'use strict';

    var caminho="resources/image/",
        jogoIni=true,
        baus=[],
        audioOn,
        audioOff,
        audioPode=true,
        canvas,
        stage, 
        canvasW, 
        canvasH,
        manifest, 
        totalLoaded, 
        queue,
        mapTiles, 
        game, 
        mapWidth, 
        mapHeight, 
        tileSheet, 
        tiles,
        player, 
        playerSheet, 
        firstKey, 
        enemy,
        bt1,
        bt2,
        bt3,
        bt4,
        pontos=0,
        enemySheet, 
        enemies = [], 
        randomTurn,
        moveDirection=0,
        directions = [0, 90, 180, 270],
        keysPressed = {
            38: 0,
            40: 0,
            37: 0,
            39: 0
        };
    
    canvasW = 1280;
    canvasH = 720;


    
    mapTiles = {};
    
    function buildMap(map) {
        
        var row, col, tileClone, tileIndex, defineTile;
        
        if (!board) {
            board = new createjs.Container();
            board.x = 0;
            board.y = 0;
            stage.addChild(board);
        }
        
        mapWidth = map[0].length;
        mapHeight = map.length;
        
        defineTile = {
            walkable: function (row, col) {
                if (map[row][col] === 0) {
                    return false;
                } else {
                    return true;
                }
            },
            door: function (row, col) {
                if (map[row][col] === 2) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        
        tileIndex = 0;
        var bauindex=0;
        var i=0;
        mapTiles = [];
        board.removeAllChildren();
        for (row = 0; row < mapHeight; row++) {
            for (col = 0; col < mapWidth; col++) {
                tileClone = tiles.clone();
                tileClone.name = "t_" + row + "_" + col;
                tileClone.gotoAndStop(map[row][col]);
                tileClone.x = col * tileSheet._frameWidth;
                tileClone.y = row * tileSheet._frameHeight;
                mapTiles["t_" + row + "_" + col] = {
                    index: tileIndex,
                    walkable: defineTile.walkable(row, col),
                    door: defineTile.door(row, col)
                };
                tileIndex++;
                
                /*cria bau*/
                if(map[row][col]==2){
                    
                    baus[i] = new createjs.Bitmap(caminho+"bauzinho.png");
                    baus[i].image.onload = function(){};
                    baus[i].px=col * tileSheet._frameWidth;
                    baus[i].py=row * tileSheet._frameHeight;
                    i++;
                   
                    
                }
                
                
                board.addChild(tileClone);
            }
        }

        for(i=0;i<baus.length;i++){
            board.addChild(baus[i]);
            baus[i].x=baus[i].px;
            baus[i].y=baus[i].py;
            
        }
        
        
    }
    function botaoAudio(){
        audioOn = new createjs.Bitmap(caminho+"btaudioOn.png");
        audioOn.image.onload = function(){};
        stage.addChild(audioOn);
        audioOn.x=1000;
        audioOn.y=18;
    audioOn.on("click", function() {
        if(jogoIni){
            this.visible=false;
            audioOff.visible=true;
            audioPode=false;
        }
    });
    
    audioOff = new createjs.Bitmap(caminho+"btaudioOff.png");
	audioOff.image.onload = function(){};
    stage.addChild(audioOff);
    audioOff.x=1000;
    audioOff.y=18;
    audioOff.on("click", function() {
        if(jogoIni){
            this.visible=false;
            audioOn.visible=true;
            audioPode=true;
        }
    });
    audioOn.visible=true;
    audioOff.visible=false;

	
}
    function addPlayer(rot) {
        player.name = "player";
        player.x = canvasW / 2;
        player.y = canvasH / 2;
        player.regX = 0;
        player.regY = 0;
        player.rotation = rot;
        player.speed = 6;
        player.height = 34;
        player.width = 34;
        player.gotoAndStop("stand");
        board.addChild(player);
    }
    
    function addEnemy(x, y, rot) {
        var num = enemies.length;
        enemies[num] = enemy.clone();
        enemies[num].name = "enemy" + enemies.length;
        enemies[num].x = x * tileSheet._frameWidth + (tileSheet._frameWidth / 2);
        enemies[num].y = y * tileSheet._frameHeight + (tileSheet._frameHeight / 2);
        enemies[num].regX = 0;
        enemies[num].regY = 0;
        enemies[num].rotation = rot;
        enemies[num].speed = 2;
        enemies[num].height = 34;
        enemies[num].width = 34;
        enemies[num].gotoAndPlay("walk");
        board.addChild(enemies[num]);
    }
    
    function warpChar(char, x, y, rot) {
        
        char.x = x * tileSheet._frameWidth + (tileSheet._frameWidth / 2);
        char.y = y * tileSheet._frameHeight + (tileSheet._frameHeight / 2);
        char.rotation = rot;
        
    }
    
    function checkCorners(char, dirx, diry) {
        
        var formulaA, formulaB, formulaC, formulaD;
        
        if (dirx === 0) {
            formulaC = Math.floor((char.x - char.width / 2) / tileSheet._frameWidth);
            formulaD = Math.floor((char.x + char.width / 2) / tileSheet._frameWidth);
            if (diry === -1) {
                formulaA = Math.floor(((char.y - char.width / 2) + (char.speed * diry)) / tileSheet._frameHeight);
                char.topLeft = mapTiles["t_" + formulaA + "_" + formulaC];
                char.topRight = mapTiles["t_" + formulaA + "_" + formulaD];
                if (char.topLeft.walkable && char.topRight.walkable) {
                    return true;
                }
            } else if (diry === 1) {
                formulaB = Math.floor(((char.y + char.width / 2) + (char.speed * diry)) / tileSheet._frameHeight);
                char.bottomLeft = mapTiles["t_" + formulaB + "_" + formulaC];
                char.bottomRight = mapTiles["t_" + formulaB + "_" + formulaD];
                if (char.bottomLeft.walkable && char.bottomRight.walkable) {
                    return true;
                }
            }
        }
        if (diry === 0) {
            formulaC = Math.floor((char.y - char.height / 2) / tileSheet._frameHeight);
            formulaD = Math.floor((char.y + char.height / 2) / tileSheet._frameHeight);
            if (dirx === -1) {
                formulaA = Math.floor(((char.x - char.width / 2) + (char.speed * dirx)) / tileSheet._frameWidth);
                char.topLeft = mapTiles["t_" + formulaC + "_" + formulaA];
                char.bottomLeft = mapTiles["t_" + formulaD + "_" + formulaA];
                if (char.topLeft.walkable && char.bottomLeft.walkable) {
                    return true;
                }
            } else if (dirx === 1) {
                formulaB = Math.floor(((char.x + char.width / 2) + (char.speed * dirx)) / tileSheet._frameWidth);
                char.topRight = mapTiles["t_" + formulaC + "_" + formulaB];
                char.bottomRight = mapTiles["t_" + formulaD + "_" + formulaB];
                if (char.topRight.walkable && char.bottomRight.walkable) {
                    return true;
                }
            }
        }
        
    }
    
    function moveChar(char, dirx, diry) {
        
        if (dirx === 0) {
            if (diry === -1 && checkCorners(char, dirx, diry)) { /* up*/
                if (char.name === "player") {
                    board.y += -diry * char.speed;
                }
                char.y += diry * char.speed;
                char.rotation = 270;
            } else if (diry === 1 && checkCorners(char, dirx, diry)) { /* down*/
                if (char.name === "player") {
                    board.y += -diry * char.speed;
                }
                char.y += diry * char.speed;
                char.rotation = 90;
            }
        }
        if (diry === 0) {
            if (dirx === -1 && checkCorners(char, dirx, diry)) { /* left*/
                if (char.name === "player") {
                    board.x += -dirx * char.speed;
                }
                char.x += dirx * char.speed;
                char.rotation = 180;
            } else if (dirx === 1 && checkCorners(char, dirx, diry)) { /* right*/
                if (char.name === "player") {
                    board.x += -dirx * char.speed;
                }
                char.x += dirx * char.speed;
                char.rotation = 0;
            }
        }
        
    }
    
    function pTheorem(point1, point2) {
        return Math.floor(Math.sqrt(((point2.x - point1.x) * (point2.x - point1.x)) + ((point2.y - point1.y) * (point2.y - point1.y))));
    }
    
    function getAngle(point1, point2) {
        
        var deltaX, deltaY, angle;
        
        deltaX = point2.x - point1.x;
        deltaY = point2.y - point1.y;
        
        angle = Math.atan2(deltaY, deltaX);
        
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        
        return angle * 180 / Math.PI;
        
    }
    
    function enemyBrain() {
        
        var e, distToPlayer, angleToPlayer;
        
        function walkForward() {
            if (enemies[e].currentAnimation !== "walk") {
                enemies[e].gotoAndPlay("walk");
            }
            switch (enemies[e].rotation) {
            case 0:
                if (checkCorners(enemies[e], 1, 0)) {
                    moveChar(enemies[e], 1, 0);
                } else {
                    enemies[e].rotation = directions[Math.floor(Math.random() * directions.length)];
                }
                break;
            case 90:
                if (checkCorners(enemies[e], 0, 1)) {
                    moveChar(enemies[e], 0, 1);
                } else {
                    enemies[e].rotation = directions[Math.floor(Math.random() * directions.length)];
                }
                break;
            case 180:
                if (checkCorners(enemies[e], -1, 0)) {
                    moveChar(enemies[e], -1, 0);
                } else {
                    enemies[e].rotation = directions[Math.floor(Math.random() * directions.length)];

                }
                break;
            case 270:
                if (checkCorners(enemies[e], 0, -1)) {
                    moveChar(enemies[e], 0, -1);
                } else {
                    enemies[e].rotation = directions[Math.floor(Math.random() * directions.length)];
                }
                break;
            default:
                enemies[e].rotation = 0;
            }
        }
        
        for (e = 0; e < enemies.length; e++) {
            
            distToPlayer = pTheorem({x: enemies[e].x, y: enemies[e].y}, {x: player.x, y: player.y});
            angleToPlayer = Math.floor(getAngle({x: enemies[e].x, y: enemies[e].y}, {x: player.x, y: player.y}));
            
            if(distToPlayer<40){
                
                verificaFim(true);
                
            }
            if (distToPlayer < player.width * 3) {
                if (angleToPlayer > 315 || angleToPlayer < 45) {
                    enemies[e].rotation = 0;
                }
                if (angleToPlayer > 45 && angleToPlayer < 135) {
                    enemies[e].rotation = 90;
                }
                if (angleToPlayer > 135 && angleToPlayer < 225) {
                    enemies[e].rotation = 180;
                }
                if (angleToPlayer > 225 && angleToPlayer < 315) {
                    enemies[e].rotation = 270;
                }
                if (distToPlayer > player.width) {
                    walkForward();
                } else {
                    enemies[e].gotoAndStop("stand");
                }
            } else {
                if (randomTurn) {
                    enemies[e].rotation = directions[Math.floor(Math.random() * directions.length)];
                    randomTurn = false;
                }
                walkForward();
            }
            
        }
        
    }
    
    document.addEventListener("keydown", function (e) {
        keysPressed[e.keyCode] = 1;
        if (!firstKey) { firstKey = e.keyCode; }
    });
    document.addEventListener("keyup", function (e) {
        keysPressed[e.keyCode] = 0;
        if (firstKey === e.keyCode) { firstKey = null; }
        if (player) { player.gotoAndStop("stand"); }
    });
    
    
    function detectKeys() {
        verificaColideBaus();
        if (keysPressed[38] === 1) { 
            if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
            moveChar(player, 0, -1);
        }
        if (keysPressed[40] === 1) {
            if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
            moveChar(player, 0, 1);
        }
        if (keysPressed[37] === 1) { 
            if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
            moveChar(player, -1, 0);
        }
        if (keysPressed[39] === 1) { 
            if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
            moveChar(player, 1, 0);
        }
        
        if (firstKey) {
            switch (firstKey) {
            case 38:
                player.rotation = 270;
                break;
            case 40:
                player.rotation = 90;
                break;
            case 37:
                player.rotation = 180;
                break;
            case 39:
                player.rotation = 0;
                break;
            }
        }
        
    }
    
    function criaFundo(){
        var shape = new createjs.Shape();
        shape.graphics.beginLinearGradientFill(["#333333", "#000000"], [0, 1], 0, 0, 0, 720);
        shape.graphics.drawRoundRect(0,0,1280,720,0);
        shape.graphics.endFill();
        stage.addChild(shape);
    }
function collisionDetect(object1, object2){
    var ax1 = object1.x;
    var ay1 = object1.y;
    var ax2 = object1.x + 50;
    var ay2 = object1.y + 50;
 
    var bx1 = object2.x;
    var by1= object2.y;
    var bx2= bx1 + 50;
    var by2= by1 + 50;
     
    if(object1 == object2){
        return false;
    }
    if (ax1 <= bx2 && ax2 >= bx1 && ay1 <= by2 && ay2 >= by1){
        return true;
    } else {
        return false;
    }  
}
    function verificaColideBaus(){
        var i;
        for(i=0;i<baus.length;i++){
            if(collisionDetect(player,baus[i])){
                board.removeChild(baus[i]);
                sons[5].play();
                baus[i].x=-2000;
                baus[i].y=-2000;
                pontos++;
                
                if(pontos>=baus.length){
                    verificaFim();
                }
                
                break;
            }
        }
        
    }
    function handleTick() {
        if(jogoIni){
            detectKeys();
            enemyBrain(); 
            
            if(moveDirection==1){
                if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
                moveChar(player, 0, -1);
                player.rotation = 270;
               verificaColideBaus();
                
            }else if(moveDirection==2){
                if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
                moveChar(player, 0, 1);
                player.rotation = 90;
                verificaColideBaus();
                
            }else if(moveDirection==3){
                if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
                moveChar(player, -1, 0);
                player.rotation = 180;
                verificaColideBaus();
                
            }else if(moveDirection==4){
                if (player.currentAnimation !== "walk") { player.gotoAndPlay("walk"); }
                moveChar(player, 1, 0);
                player.rotation = 0;
                verificaColideBaus();
                
            }
            
        }

        stage.update();
    
    }
    function criaBotoes(){
        bt1 = new createjs.Bitmap(caminho+"teclaEsquerda.png");
        bt1.image.onload = function(){};
        stage.addChild(bt1);
        bt1.x=305;
        bt1.y=579;
        bt1.on("mousedown", function() {
            this.alpha=0.3;
            moveDirection=3;
            if(audioPode){
                sons[0].play();
            }
        });
        bt1.on("pressup", function() {
            moveDirection=0;
            player.gotoAndStop("stand");
            this.alpha=0.65;
        });
        
        bt2 = new createjs.Bitmap(caminho+"teclaDireita.png");
        bt2.image.onload = function(){};
        stage.addChild(bt2);
        bt2.x=728;
        bt2.y=579;
        bt2.on("mousedown", function() {
            this.alpha=0.3;
            moveDirection=4;
            if(audioPode){
                sons[1].play();
            }
        });
        bt2.on("pressup", function() {
            moveDirection=0;
            player.gotoAndStop("stand");
            this.alpha=0.65;
        }); 
        
        bt3 = new createjs.Bitmap(caminho+"teclaCima.png");
        bt3.image.onload = function(){};
        stage.addChild(bt3);
        bt3.x=516;
        bt3.y=459;
        bt3.on("mousedown", function() {
            this.alpha=0.3;
            moveDirection=1;
            if(audioPode){
                sons[2].play();
            }
        });
        bt3.on("pressup", function() {
            moveDirection=0;
            player.gotoAndStop("stand");
            this.alpha=0.65;
        });
          
        bt4 = new createjs.Bitmap(caminho+"teclaBaixo.png");
        bt4.image.onload = function(){};
        stage.addChild(bt4);
        bt4.x=516;
        bt4.y=579;
        bt4.on("mousedown", function() {
            this.alpha=0.3;
            moveDirection=2;

        });
        bt4.on("pressup", function() {
            moveDirection=0;
            player.gotoAndStop("stand");
            this.alpha=0.65;
        });
        
        bt1.alpha=0.65;
        bt2.alpha=0.65;
        bt3.alpha=0.65;
        bt4.alpha=0.65;
        
    }
    function verificaFim(tudoerrado){
        jogoIni=false;
        var img;
        var bo;
        var continua=false;
        stage.removeChild(bt1);
        stage.removeChild(bt2);
        stage.removeChild(bt3);
        stage.removeChild(bt4);
        if(tudoerrado){
            img=caminho+"tentenovamente.png";
            continua=true;
            sons[4].play();
        }else{
            img=caminho+"positivo.png";
            continua=true;
            sons[3].play();
        }
        if(continua){
            bo = new createjs.Bitmap(img);
            bo.image.onload = function(){};
            bo.regX=269/2;
            bo.regY=450/2;
            bo.x=640;
            bo.y=1000;
            stage.addChild(bo);
            createjs.Tween.get(bo).to({y:350},1000,createjs.Ease.quadOut);
            bo.on("mousedown", function (evt) {
                stage.removeChild(this);
                player.x = canvasW / 2;
                player.y = canvasH / 2;
                board.x=0;
                board.y=0;
                jogoIni=true;
                pontos=0;
                stage.addChild(bt1);
                stage.addChild(bt2);
                stage.addChild(bt3);
                stage.addChild(bt4);
                var i;
                for(i=0;i<baus.length;i++){
                    board.addChild(baus[i]);
                    baus[i].x=baus[i].px;
                    baus[i].y=baus[i].py;
                }

			
        });
	
	
	}
    
}
    
    function init() {

        canvas = document.getElementById(idCanvas);
        stage = new createjs.Stage(canvas);
        stage.enableMouseOver(30);
        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(30);
        createjs.Ticker.useRAF = true;
        createjs.Ticker.addEventListener("tick", handleTick);
        
        tileSheet = new createjs.SpriteSheet({
            images: [caminho+"tiles.png"],
            frames: {
                height: 48,
                width: 48,
                regX: 0,
                regY: 0,
                count: 10
            }
        });
        
        
        
        tiles = new createjs.Sprite(tileSheet);
        
        playerSheet = new createjs.SpriteSheet({
            animations: {
                stand: [0],
                walk: [1, 13]
            },
            images: [caminho+"personagem.png"],
            frames: [[5,5,36,49,0,13.600000000000001,25.5],[46,5,39,39,0,16.6,23.5],[90,5,36,45,0,13.600000000000001,25.5],[131,5,36,50,0,13.600000000000001,26.5],[172,5,36,52,0,13.600000000000001,26.5],[213,5,36,52,0,13.600000000000001,25.5],[5,62,36,47,0,13.600000000000001,22.5],[46,62,38,40,0,15.600000000000001,19.5],[89,62,36,47,0,13.600000000000001,22.5],[130,62,36,51,0,13.600000000000001,24.5],[171,62,36,52,0,13.600000000000001,26.5],[212,62,36,50,0,13.600000000000001,26.5],[5,119,37,45,0,14.600000000000001,25.5],[47,119,39,39,0,16.6,23.5]]
        });
        
        player = new createjs.Sprite(playerSheet);
        
        enemySheet = new createjs.SpriteSheet({
            animations: {
                stand: [0],
                walk: [1, 5]
            },
            images: [caminho+"aranha.png"],
            frames: [[5,5,41,47,0,18.35,24.9],[51,5,41,47,0,18.35,24.9],[5,57,43,47,0,20.35,24.9],[53,57,41,48,0,18.35,24.9],[5,110,43,48,0,20.35,24.9],[53,110,38,47,0,15.350000000000001,24.9]]
        });
        
        enemy = new createjs.Sprite(enemySheet);
        
        
        var btInicio = new createjs.Bitmap(caminho+"bt_iniciar_od1.png");
        btInicio.image.onload = function(){};
        stage.addChild(btInicio);
        btInicio.on("click", function() {
            var elementoScroll = document.getElementById(idCanvas);
            elementoScroll.scrollIntoView();
            stage.removeChild(this);
            criaFundo();
            stage.currentMap = "mapa";
            buildMap(mapa);
            addPlayer(0);
            addEnemy(1, 1, 0);
            addEnemy(7, 4, 0);
            addEnemy(25, 4, 0);
            addEnemy(1, 13, 0);
            addEnemy(17, 13, 0);
           
            
            criaBotoes();
            botaoAudio();
        });
        var index;
        for (index in sons) {
            var t = sons[index];
            sons[index] = new Audio(caminho + t);
        }
         
        
    }
    init();

    
};