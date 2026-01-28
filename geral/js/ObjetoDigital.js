window.ObjetoDigitalConfig = {
  capitulo: true
}

window.DEV_MODE = false

class ObjetoDigital {
  constructor(id) {
    this.id = id
    this.started = false

    this._init()
  }

  _init() {
    this.$ = $(`#${this.id}`)
    this.canvas = this.$.find('canvas').get()[0]
  }

  init() {

  }

  ready () {
    const $start = this.$.find('#btIniciaTutorial')

    const startGameCanvas = () => {
      this.$.find('.telaInicio').hide()
      this.$.find('.telaMenu').show()
      console.log(this.$.find('.divCanvas'))
      this.$.find('.divCanvas').removeAttr('hidden')
      this.$.find('.divCanvas').show()
      this.$.find('.divCanvas').css('display', 'flex')
      this.onStartClick()
    }
    
    $start.on('click', () => {
      startGameCanvas()
    })

    if (window.DEV_MODE) {
      startGameCanvas()
    }
  }

  onStartClick () {

  }

  
  static startGame(Game, ...params) {
    const instance = new Game(...params)
    window.games = window.games || {}
    
    window.games[instance.name] = instance
  }

  // UTILS

  static async loadFont(name, url) {
    const f = new FontFace(name, `url(${url})`)
    const font = await f.load()

    document.fonts.add(font)
    return font
  }

  static get geralRelativePath () {
    return window.ObjetoDigitalConfig.capitulo ? '../../../../../geral' : '../../../../../../geral'
  }
}

