class MuralSelectorAction extends Monogatari.Action {
  constructor([show, type, muralID, ...classes]) {
    super()
    this.configuration = MuralSelectorAction._configuration

    this.muralID = muralID
    this.mural = MuralSelectorAction._configuration.murals[muralID]
    if (!this.mural) {
      return Promise.reject(`Mural ${muralID} not found.`)
    }

    if (!PIXI) {
      return Promise.reject(`PIXI module not found.`)
    }

    this.classes = (typeof classes !== 'undefined') ? ['animated', ...classes.filter ((item) => item !== 'at' && item !== 'with')] : []
  }

  apply() {
    this.selected = false
    console.log('apply')
    this.app = new PIXI.Application({
      backgroundColor: 0x000,
      width: this.configuration.width,
      height: this.configuration.heigth
    })

    const bg = PIXI.Sprite.from(this.getImageAsset(this.mural.background))
    if (this.mural.backgroundSize) {
      bg.width = this.mural.backgroundSize[0]
      bg.height = this.mural.backgroundSize[1]
    }

    this.app.stage.addChild(bg)
    
    this.engine.currentMuralPixiApp = this.app
    this.engine.currentMuralInstance = this
    
    setTimeout(() => {
      
      for (const className of this.classes) {
        this.app.view.classList.add(className)
      }

      this.engine.element().find('#tsparticles').get(0).appendChild(this.app.view)
    
    this.engine.element().find('text-box').hide()
    }, 200);

    return new Promise(res => {
      this.addItems(res)
    })
  }

  addItems(res) {
    this.items = []

    this.clicked = false
    for (const item of this.mural.items) {

      if (item.condition && !item.condition()) continue

      let texture = PIXI.Texture.from(this.getImageAsset(item.image))
      let hoverTexture = PIXI.Texture.from(this.getImageAsset(item.hover))

      if (item.sprite) {
        const spr1 = item.sprite.slice(0, 2)
        const spr2 = item.sprite.slice(2).map((s, i) => s - spr1[i])
        texture = this.loadTextureFromSpritesheet(texture, ...spr1, ...spr2)
        hoverTexture = this.loadTextureFromSpritesheet(hoverTexture, ...spr1, ...spr2)
      }

      const sprite = new PIXI.Sprite(texture)
      sprite.anchor.set(0.5)
      sprite.x = item.position[0]
      sprite.y = item.position[1]

      sprite._normalTexture = texture
      sprite._hoverTexture = hoverTexture

      if (item.size) {
        sprite.width = item.size[0]
        sprite.height = item.size[1]
      }

      sprite.interactive = true
      sprite.buttonMode = true

      let interval

      const timeout = setTimeout(() => {
        this.items.forEach(i => {
          let t = false
          let times = 0
          interval = setInterval(() => {
            if (this.clicked) return
            if (times >= 7) return

            i.texture = t ? i._normalTexture : i._hoverTexture
            t = !t
            times++
          }, 600);
        })
      }, this.configuration.highlightInterval)

      const hover = () => sprite.texture = hoverTexture
      const unHover = () => sprite.texture = texture
      const click = () => {
        this.clicked = true
        if (this.selected) return
        clearInterval(interval)
        clearTimeout(timeout)

        this.items.forEach(i => {
          i.interactive = false
          i.buttonMode = false
        })
        sprite.texture = texture

        this.selected = true
        this.engine.run(item.action).then(r => res())
      }

      sprite
        .on('pointerover', hover)
        .on('pointerout', unHover)
        .on('pointerdown', click)

      this.items.push(sprite)

      this.app.stage.addChild(sprite)
    }
  }

  revert() {
    console.log('revert')
    const muralApp = this.engine.currentMuralPixiApp
    if (muralApp) {
      muralApp.destroy(true)
      this.engine.currentMuralPixiApp = null
      this.engine.currentMuralInstance = null
    }
    this.engine.element().find('text-box').show()
  }

  getImageAsset(name) {
    return `${this.engine.setting('AssetsPath').root}/${this.engine.setting('AssetsPath').images}/${this.engine.asset('images', name)}`
  }

  loadTextureFromSpritesheet(texture, x, y, w, h) {
    const rect = new PIXI.Rectangle(x, y, w, h)
    return new PIXI.Texture(texture.baseTexture, rect)
  }


  static matchString([show, type, muralID]) {
    return show === 'show' && type === 'mural' && muralID
  }

  static murals(x) {
    MuralSelectorAction._configuration = {
      ...MuralSelectorAction._configuration,
      ...x
    }
  }
}

MuralSelectorAction._configuration = {
  murals: {},
  width: 1280,
  heigth: 720,
  highlightInterval: 20E3
}

MuralSelectorAction.id = 'MuralSelectorAction'


// HideMural

class HideMuralAction extends Monogatari.Action {
  constructor() {
    super()
  }

  apply() {
    const muralApp = this.engine.currentMuralPixiApp
    if (muralApp) {
      console.log(muralApp)
      muralApp.destroy(true)
      this.engine.currentMuralPixiApp = null
      this.engine.currentMuralInstance = null
    }

    this.engine.element().find('text-box').show()

    return Promise.resolve()
  }

  revert() {

  }

  didApply() {
    return Promise.resolve({
      advance: true
    })
  }

  static matchString([hide, mural]) {
    return hide === 'hide' && mural === 'mural'
  }
}

HideMuralAction.id = 'HideMuralAction'

// Reset mural

class ResetMuralAction extends Monogatari.Action {
  constructor() {
    super()
  }

  apply() {
    const mural = this.engine.currentMuralInstance
    if (!mural) {
      return Promise.reject('Mural not defined before.')
    }
    mural.selected = false
    mural.items.forEach(i => i.destroy())
    return new Promise(res => {
      mural.addItems(res)
    })

  }

  revert() {

  }

  didApply() {
    return Promise.resolve({
      advance: true
    })
  }

  static matchString([hide, mural]) {
    return hide === 'reset' && mural === 'mural'
  }
}

HideMuralAction.id = 'ResetMuralAction'


// ToggleTextBoxAction

class ToggleTextBoxAction extends Monogatari.Action {
  constructor([toggle]) {
    super()
    this.action = toggle
  }

  apply() {
    if (this.action === 'show') this.show()
    else if (this.action === 'hide') this.hide()
    else if (this.action === 'toggle') {
      const visible = this.engine.element().find('text-box').is(':visible')
      if (visible) this.hide()
      else this.show()
    }

    return Promise.resolve()
  }

  hide() {
    this.engine.element().find('text-box').hide()
  }

  show() {
    this.engine.element().find('text-box').show()
  }

  revert() {
    const visible = this.engine.element().find('text-box').is(':visible')
    if (visible) this.hide()
    else this.show()
  }

  didApply() {
    return Promise.resolve({
      advance: true
    })
  }

  static matchString([toggle, textbox]) {
    return ['toggle', 'hide', 'show'].includes(toggle) && textbox.toLowerCase() === 'textbox'
  }
}

ToggleTextBoxAction.id = 'ToggleTextBoxAction'



class ItemVisualizerElement extends Monogatari.Component {
  render() {
    return `<div class="item-visualizer-wrapper">
      <div class="item-visualizer-component">
        <div class="content">
          <div class="preview">
          </div>
          <div class="description">
            
          </div>
        </div>
      </div>
      <button>Fechar</button>
    </div>`
  }
}

ItemVisualizerElement.tag = 'item-visualizer'

class InventoryScreenElement extends Monogatari.ScreenComponent {
  render() {
    console.log('render')
    return `<div class="inventory-wrapper">
    <button class="top left" data-action="back"><span class="fas fa-arrow-left"></span></button>
    <h4>Inventario</h4>
    <div class="content"></div>
  </div>`
  }

  static createListener(mono) {
    const $el =$( mono.element().find('inventory-screen').get(0))

    mono.registerListener('open-screen', {
      callback: (element) => {
        if (element.collection[0].dataset.open !== 'inventory') return

        const $content = $el.find('.content')

        $($content.get(0)).empty()

        const itens = mono.storage('interactedItens')

        if (itens.length === 0) {
          return $content.append('<p>Nenhum item</p>')
        }

        const defaultImageHandler = it => `${monogatari.setting('AssetsPath').root}/${monogatari.setting('AssetsPath').images}/${monogatari.asset('images', it.image)}`
        const itemImageHandler = ShowItemAction._configuration.itemImageHandler || defaultImageHandler

        itens.forEach(async it => {
          const item = ShowItemAction._configuration.items[it]

          const img = await itemImageHandler(item)

          $content.append(`
          <a class="item-box" data-action="back" id="item-${it}">
            <img src="${img}">
            <p>${item.name}</p>
          </a>
          `)

          $(`#item-${it}`).click(() => {
            mono.run(`show item ${it}`)
          })
        })
      }
    });

  }
}

InventoryScreenElement.tag = 'inventory-screen';



class ShowItemAction extends Monogatari.Action {
  constructor([show, item, itemId]) {
    super()
    this.itemId = itemId
    this.item = ShowItemAction._configuration.items[itemId]
    console.log(this.item)
    if (!this.item) {
      return Promise.reject(`Mural ${itemId} not found.`)
    }
    this.done = false

    const defaultImageHandler = it => `${monogatari.setting('AssetsPath').root}/${monogatari.setting('AssetsPath').images}/${monogatari.asset('images', it.image)}`
    this.itemImageHandler = ShowItemAction._configuration.itemImageHandler || defaultImageHandler
  }

  apply() {
    const $visualizer = this.engine.element().find('item-visualizer')

    $($visualizer.find('.description').get(0)).empty()
    $($visualizer.find('.preview').get(0)).empty()

    this.itemImageHandler(this.item).then(img => {
      $visualizer.find('.preview').append(`<img src="${img}" />`)
    })

    $visualizer.find('.description').append(`<h4>${this.item.title}</h4>`)
    this.item.description.map(l => `<p>${l}</p>`).forEach(l => {
      $visualizer.find('.description').append(l)
    })

    $visualizer.show()

    return new Promise(res => {
      $visualizer.find('button').click(() => {
        $visualizer.hide()
        if (!this.done) {
          res()
        }
        this.done = true
      })
    })
  }

  revert() {

  }


  static matchString([show, item, itemId]) {
    console.log(show === 'show' && item === 'item' && !!itemId)
    return show === 'show' && item === 'item' && !!itemId
  }

  static items(x) {
    ShowItemAction._configuration = {
      ...ShowItemAction._configuration,
      ...x
    }
  }
}

ShowItemAction._configuration = {
  items: {},
}

ShowItemAction.id = 'ShowItemAction'