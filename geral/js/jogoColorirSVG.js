var AppColorirSVG=function(){

                var canvas,
                caminho='resources/image/',
                icone1,
                icone2,
                icone2img,
                icone2img2,
                colorSample,
                stage;

                canvas = document.getElementById("canvas");
                stage = new createjs.Stage(canvas);

                createjs.Touch.enable(stage);
                stage.enableMouseOver(10);

                icone1 = new createjs.Bitmap(caminho+"picker.png");
                icone1.image.onload = function(){};
                
                icone1.y=-300;
                icone1.x=-600;


                var menuCor = new createjs.Bitmap(caminho+"crayon.png");
                menuCor.image.onload = function(){};
                
                menuCor.on("mousedown", function (evt) {
                    colSelecionada=rgba;
                    icone1.x=stage.mouseX;
                    icone1.y=stage.mouseY-96;
                    pintaSample(colorSample);

                });
                menuCor.on("pressmove", function (evt) {
                    colSelecionada=rgba;
                    pintaSample(colorSample);
                    icone1.x=stage.mouseX;
                    icone1.y=stage.mouseY-96;
                    
                });
                menuCor.on("pressup", function (evt) {
                    icone1.x=-200;
                    icone1.y=-500;

                });
                fundoSample = new createjs.Bitmap(caminho+"jogoColorir_fundopaleta.png");
                fundoSample.image.onload = function(){};
                
                fundoSample.x=0;
                fundoSample.y=500;

                colorSample = new createjs.Bitmap(caminho+"jogoColorir_fundopaleta.png");
                colorSample.image.onload = function(){};
                
                colorSample.x=0;
                colorSample.y=500;


                colorSample = new createjs.Bitmap(caminho+"jogoColorir_sample.png");
                colorSample.image.onload = function(){};
                
                colorSample.x=0;
                colorSample.y=500;

                stage.addChild(menuCor);
                stage.addChild(fundoSample);
                stage.addChild(colorSample);
                stage.addChild(icone1);
                createjs.Ticker.setFPS(30);
                createjs.Ticker.on("tick", ticker);

                var ctx = canvas.getContext('2d');
                function pintaSample(qual) {
                    var t=qual.id;
                    var filter = new createjs.ColorFilter(0,0,0,1,rgba_data[0],rgba_data[1],rgba_data[2]);
                    qual.filters = [filter];
                    qual.cache(0, 0, canvas.width, canvas.height);
                    stage.update();
                }
                function pick(event) {

                    var pixel = ctx.getImageData(stage.mouseX, stage.mouseY, 1, 1);
                    rgba_data = pixel.data;
                    rgba = 'rgba(' + rgba_data[0] + ', ' + rgba_data[1] +', ' + rgba_data[2] + ', ' + (rgba_data[3] / 255) + ')';
                    console.log(rgba_data);
                    

                }
                canvas.addEventListener('mousemove', pick);
                $('html').bind('touchmove', function(e) {
                    pick();
                });
                $('html').bind('touchend', function(e) {
                    pick();
                });


                function ticker(event){
                    stage.update();
                }
            }