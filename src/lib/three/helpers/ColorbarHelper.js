/** @module src/lib/three/helpers/ColorbarHelper */

import {
  CanvasTexture,
  OrthographicCamera,
  Scene,
  SpriteMaterial,
  Sprite
} from 'three/build/three.module'
import { Lut } from 'three/examples/jsm/math/Lut'

/**
 * Colorbar helper
 * @param {Object} renderer Renderer
 * @param {Object} scene Scene
 */
const ColorbarHelper = (renderer, scene) => {
  const parentRect = renderer.domElement.getBoundingClientRect()

  const width = 50
  const height = 500
  const ratio = width / height

  const colorScene = new Scene()
  const colorCamera = new OrthographicCamera(-1, 1, ratio, -ratio, 1, 2)
  colorCamera.position.set(-0.5, 0, 1)

  let sprite

  const setVisible = (visible) => {
    colorScene.children.forEach((child) => {
      child.visible = visible
    })
  }

  const clearScene = () => {
    colorScene.children.forEach((child) => {
      colorScene.remove(child)
    })
  }

  const setLUT = (lut) => {
    clearScene()

    const map = new CanvasTexture(lut.createCanvas())
    const material = new SpriteMaterial({ map: map })
    sprite = new Sprite(material)
    sprite.scale.x = 1
    sprite.scale.y = 0.2
    colorScene.add(sprite)
  }

  const render = () => {
    renderer.setViewport(
      parentRect.width - width - 100,
      parentRect.height / 2 - height / 2,
      width,
      height
    )
    renderer.render(colorScene, colorCamera)
  }

  return { setVisible, setLUT, render }
}

export { ColorbarHelper }
