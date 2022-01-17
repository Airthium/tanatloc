import {
  CanvasTexture,
  OrthographicCamera,
  Scene,
  SpriteMaterial,
  Sprite
} from 'three'

import { Lut } from 'three/examples/jsm/math/Lut'

import Label from './LabelHelper'
import NumberHelper from './NumberHelper'

/**
 * Colorbar helper
 * @memberof Lib.Three.Helpers
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 */
const ColorbarHelper = (renderer, scene) => {
  const width = 500
  const height = 50

  const colorScene = new Scene()
  const colorCamera = new OrthographicCamera(-1, 1, 1, -1, 2, 1)
  colorCamera.position.set(0, 0, 1)

  let sprite

  /**
   * Set visible
   * @param {bool} visible Visible
   */
  const setVisible = (visible) => {
    colorScene.children.forEach((child) => {
      child.visible = visible
    })
  }

  /**
   * Clean scene (local)
   */
  const clearScene = () => {
    colorScene.children.forEach((child) => {
      child.dispose()
    })
    colorScene.clear()
  }

  /**
   * Set LUT
   * @param {Object} lut LUT
   */
  const setLUT = (lutData) => {
    clearScene()

    const lut = new Lut('rainbow', lutData.n)
    lut.setMin(lutData.minV)
    lut.setMax(lutData.maxV)

    const map = new CanvasTexture(lut.createCanvas())
    const material = new SpriteMaterial({ map: map })
    sprite = new Sprite(material)
    sprite.material.rotation = -Math.PI / 2
    sprite.scale.x = 0.2
    sprite.scale.y = 1.8
    sprite.dispose = sprite.material.dispose
    colorScene.add(sprite)

    setLabels(lut)
  }

  /**
   * Set labels
   * @param {Object} lut LUT
   */
  const setLabels = (lut) => {
    let min = NumberHelper(lut.minV)
    let max = NumberHelper(lut.maxV)

    const minLabel = Label(min, 768, 'gray', 128)
    minLabel.scale.x = 0.5
    minLabel.scale.y = 4.5
    minLabel.position.set(-0.9, 0.45, 0)
    const maxLabel = Label(max, 768, 'gray', 128)
    maxLabel.scale.x = 0.5
    maxLabel.scale.y = 4.5
    maxLabel.position.set(0.8, 0.45, 0)

    colorScene.add(minLabel)
    colorScene.add(maxLabel)
  }

  /**
   * Render
   */
  const render = () => {
    const rect = renderer.domElement.getBoundingClientRect()
    renderer.setViewport(
      rect.width / 2 - width / 2,
      rect.height - height,
      width,
      height
    )
    renderer.render(colorScene, colorCamera)
  }

  return { setVisible, setLUT, render }
}

export { ColorbarHelper }
