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
      child.dispose()
    })
    colorScene.clear()
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
    sprite.dispose = sprite.material.dispose
    colorScene.add(sprite)

    setLabels(lut)
  }

  /**
   * Set labels
   * @param {Object} lut LUT
   */
  const setLabels = (lut) => {
    const min =
      Math.abs(lut.minV) > 1e-12
        ? Math.abs(lut.minV) > 1000 || Math.abs(lut.minV) < 0.001
          ? lut.minV.toExponential(2)
          : lut.minV.toFixed(3)
        : 0
    const max =
      Math.abs(lut.maxV) > 1e-12
        ? Math.abs(lut.maxV) > 1000 || Math.abs(lut.maxV) < 0.001
          ? lut.maxV.toExponential(2)
          : lut.maxV.toFixed(3)
        : 0

    const minLabel = Label(min, 768, 'gray', 128)
    minLabel.scale.x = 1
    minLabel.scale.y = 0.3
    minLabel.position.set(-0.45, -0.95, 0)
    const maxLabel = Label(max, 768, 'gray', 128)
    maxLabel.scale.x = 1
    maxLabel.scale.y = 0.3
    maxLabel.position.set(-0.45, 0.95, 0)

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
