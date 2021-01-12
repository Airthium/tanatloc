/** @module src/lib/three/helpers/ColorbarHelper */

import {
  CanvasTexture,
  OrthographicCamera,
  Scene,
  SpriteMaterial,
  Sprite
} from 'three/build/three.module'

import Label from './LabelHelper'

/**
 * Colorbar helper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 */
const ColorbarHelper = (renderer, scene) => {
  const width = 50
  const height = 500
  const ratio = width / height

  const colorScene = new Scene()
  const colorCamera = new OrthographicCamera(-1, 1, 1, -1, 1, 2)
  colorCamera.position.set(-0.5, 0, 1)

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
      child.material.dispose()
      colorScene.remove(child)
    })
  }

  /**
   * Set LUT
   * @param {Object} lut LUT
   */
  const setLUT = (lut) => {
    clearScene()

    const map = new CanvasTexture(lut.createCanvas())
    const material = new SpriteMaterial({ map: map })
    sprite = new Sprite(material)
    sprite.scale.x = 0.2
    sprite.scale.y = 2
    sprite.position.set(-1, 0, 0)
    colorScene.add(sprite)

    setLabels(lut)
  }

  const setLabels = (lut) => {
    // TODO rescale using pow(3, 6, 9, ...)
    const min = Math.trunc(lut.minV)
    const max = Math.trunc(lut.maxV)

    const minLabel = Label(min, 512, 'gray', 128)
    minLabel.scale.x = 1
    minLabel.scale.y = 0.4
    minLabel.position.set(-0.3, -0.9, 0)
    const maxLabel = Label(max, 512, 'gray', 128)
    maxLabel.scale.x = 1
    maxLabel.scale.y = 0.4
    maxLabel.position.set(-0.3, 0.9, 0)

    colorScene.add(minLabel)
    colorScene.add(maxLabel)
  }

  /**
   * Render
   */
  const render = () => {
    const rect = renderer.domElement.getBoundingClientRect()
    renderer.setViewport(
      rect.width - width - 100,
      rect.height / 2 - height / 2,
      width + 100,
      height
    )
    renderer.render(colorScene, colorCamera)
  }

  return { setVisible, setLUT, render }
}

export { ColorbarHelper }
