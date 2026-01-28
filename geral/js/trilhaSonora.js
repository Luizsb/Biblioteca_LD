
var appAudio = function (sonsAudio) {
    var index;
    var imageObj = [];
    var qualsom = 0;
    for (index in sonsAudio) {
        var t = sonsAudio[index];
        sonsAudio[index] = new Audio("" + t);
    }
    loadCanvas();
    function tocaAudio() {
        sonsAudio[qualsom].play();
    }
    function paraTudo() {
        for (index in sonsAudio) {
            sonsAudio[index].pause();
        }
    }
    function toggle(id) {
        if (imageObj[id].tocando) {

            for (index in imageObj) {
                imageObj[index].tocando = false;
            }

            imageObj[id].tocando = false;
            paraTudo();
            imageObj[id].src = "resources/image/audio_toca.png";
        } else {
            imageObj[id].tocando = true;
            qualsom = id;
            tocaAudio();
            imageObj[id].src = "resources/image/audio_para.png";
        }
    }

    function loadCanvas() {

        var canvas = document.getElementById('audio_canvas');

        var i = 0;

        for (i = 0; i < 5; i++) {

            var ctx = canvas.getContext("2d");
            imageObj[i] = new Image();
            var tocando = false;
            ctx.font = "30px Arial";
            imageObj[i].px = i * 320;
            imageObj[i].id = i;
            imageObj[i].tocando = false;
            imageObj[i].largura = i * 320 + 320;
            imageObj[i].onload = function () {
                ctx.drawImage(this, this.px, 0);
                ctx.fillText("Trilha " + (Number(this.id) + 1), this.px + 120, 65);
            };
            imageObj[i].src = "resources/image/audio_toca.png";

            canvas.addEventListener('mouseup', function (evt) {

                for (i = 0; i < 5; i++) {
                    imageObj[i].src = "resources/image/audio_toca.png";
                }
                var janela = canvas.scrollWidth;
                var proporcao = janela / 5;

                if (evt.x < proporcao) {
                    toggle(0);
                } else if (evt.x > proporcao & evt.x < proporcao * 2) {
                    toggle(1);
                } else if (evt.x > proporcao * 2 & evt.x < proporcao * 3) {
                    toggle(2);
                } else if (evt.x > proporcao * 3 & evt.x < proporcao * 4) {
                    toggle(3);
                } else if (evt.x > proporcao * 4 & evt.x < proporcao * 5) {
                    toggle(4);
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);

            }, false);
        }
    }
}