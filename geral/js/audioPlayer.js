$(document).on('ready', () => {
    if (!window.audioPlayers) return

    const { audioPlayers, audioPath: windowAudioPath } = window

    const audioPath = windowAudioPath || './resources/image/'

    console.log('Ativando players de áudio...')

    $('audio[numero]').each((_, e) => {
        let el = $(e)

        const audioNumber = el.attr('numero')
        const elPath = el.attr('nome')

        el.wrap('<div>')
        el.contents().unwrap()

        el = el.parent()

        el.attr('class', 'audioPlayer')
        el.attr('data-numero', audioNumber)

        el.html([
            '<button class="playButton play">',
            '   ',
            '</button>',
            '<div class="audioConteudo">',
            `    <span>Áudio ${audioNumber}</span>`,
            '    <div class="temporizador">',
            '        <span class="inicio">00:00</span>',
            '        <span class="fim">00:00</span>',
            '    </div>',
            '</div>',
        ].join('\n'))

        const canvas = document.createElement('canvas')
        canvas.width = 410
        canvas.height = 20
        el.find('.audioConteudo').append(canvas)
        const ctx = canvas.getContext('2d')
        let canPlay = false
        
        const state = {
            audioState: 'LOADING',
            loadingX: 0,
            clicking: false
        }
        const audioElement = new Audio(audioPath + (elPath || audioPlayers[audioNumber]))

        audioElement.addEventListener('canplaythrough', () => {
            state.audioState = 'PAUSED'
            el.find('.fim').text(formatDuration(audioElement.duration))
            canPlay = true
        })

        audioElement.addEventListener('timeupdate', (ev) => {
            el.find('.inicio').text(formatDuration(audioElement.currentTime))
        })

        const changePlayState = () => {
            const btn = el.find('button')
            btn.removeClass('play')
            btn.removeClass('pause')

            btn.addClass(audioElement.paused ? 'play' : 'pause')
        }

        audioElement.addEventListener('play', changePlayState)
        audioElement.addEventListener('pause', changePlayState)

        el.find('button').click(() => {
            if (!canPlay) return
            if (audioElement.paused) audioElement.play()
            else audioElement.pause()
        })       

        const drawRoundedRect = (x, y, w, h, r) => {
            if (w < 2 * r) r = w / 2
            if (h < 2 * r) r = h / 2
            ctx.beginPath()
            ctx.moveTo(x + r, y)
            ctx.arcTo(x + w, y, x + w, y + h, r)
            ctx.arcTo(x + w, y + h, x, y + h, r)
            ctx.arcTo(x, y + h, x, y, r)
            ctx.arcTo(x, y, x + w, y, r)
            ctx.closePath()
            return this
        }

        const barHeight = 7
        const barWidth = 390

        const barX = canvas.width / 2 - barWidth / 2
        const barY = canvas.height / 2 - barHeight / 2

        const loadingBarFragment = 20
        const loadingBarGap = 10

        const drawBarBase = () => {
            if (state.audioState === 'LOADING') {
                state.loadingX += state.loadingX > 30 ? -30 : 1.7
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
                for (let i = 0; i < 100; i++) {
                    const fragX = -canvas.width - barX + state.loadingX + (loadingBarGap + loadingBarFragment) * i

                    // console.log(fragX)
                    drawRoundedRect(fragX, barY, loadingBarFragment, barHeight, 100)
                    ctx.fill()
                }
            } else {
                ctx.fillStyle = 'white'
                drawRoundedRect(barX, barY, barWidth, barHeight, 100)
                ctx.fill()

                ctx.fillStyle = '#EB7C54'
                const progressBarW = (barWidth * (audioElement.currentTime / audioElement.duration))
                drawRoundedRect(barX, barY, progressBarW, barHeight, 100)
                ctx.fill()
                ctx.path

                ctx.fillStyle = '#f09b7d'
                
                ctx.beginPath()
                ctx.arc(barX + progressBarW, barY + barHeight / 2, 10, 0, 2 * Math.PI)
                ctx.closePath()
                ctx.fill()
            }
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            drawBarBase()

            requestAnimationFrame(render)
        }
        render()

        const changeTime = (x) => {
            x = convertRange(x, [0, canvas.clientWidth], [0, canvas.width])
            if (!canPlay) return
            if (state.clicking && x > barX && x < canvas.width - (barX)) {
                const factor = (x - barX) / (barWidth)
                // console.log(canvas.width, barX)
                // console.log(x, canvas.width - (barX))
                audioElement.currentTime = audioElement.duration * factor
                // console.log(audioElement.duration * factor)
            }
        }

        canvas.addEventListener('mousedown', ({layerX: x}) => {
            state.clicking = true
            changeTime(x)
        })

        canvas.addEventListener('mouseup', () => {
            state.clicking = false
        })

        document.addEventListener('mouseup', () => {
            state.clicking = false
        })

        canvas.addEventListener('mousemove', (ev) => {
            const {layerX: x} = ev
            changeTime(x)
        })

    })
})

function formatDuration(seconds) {
    const d = new Date(seconds * 1000)

    const f = (t) => t.toString().padStart(2, '0')

    return `${f(d.getMinutes())}:${f(d.getSeconds())}`
}

function convertRange(value, r1, r2) {
    return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0]
  }