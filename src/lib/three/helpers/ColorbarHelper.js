/** @module src/lib/three/helpers/ColorbarHelper */

import {
  CanvasTexture,
  OrthographicCamera,
  Scene,
  SpriteMaterial,
  Sprite
} from 'three/build/three.module'

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
  const colorCamera = new OrthographicCamera(-1, 1, ratio, -ratio, 1, 2)
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
    sprite.scale.x = 1
    sprite.scale.y = 0.2
    colorScene.add(sprite)
  }

  /**
   * Render
   */
  const render = () => {
    const rect = renderer.domElement.getBoundingClientRect()
    renderer.setViewport(
      rect.width - width - 100,
      rect.height / 2 - height / 2,
      width,
      height
    )
    renderer.render(colorScene, colorCamera)
  }

  return { setVisible, setLUT, render }
}

export { ColorbarHelper }
