/** @module src/lib/three/helpers/LabelHelper */

import { Sprite, SpriteMaterial, Texture } from 'three/build/three.module'

/**
 * LabelHelper
 * @param {string} text Text
 * @param {number} size Size
 * @param {string} fontColor Font color
 * @param {number} fontSize Font size
 */
const LabelHelper = (text, size = 512, fontColor = 'black', fontSize = 512) => {
  // Canvas
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')
  context.fillStyle = fontColor
  context.font = fontSize + 'px sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, canvas.width / 2, canvas.height / 2)

  // Texture
  const texture = new Texture(canvas)
  texture.needsUpdate = true

  // Label
  const material = new SpriteMaterial({
    map: texture,
    transparent: true
  })
  const label = new Sprite(material)
  label.type = 'LabelHelper'

  /**
   * Dispose
   */
  const dispose = () => {
    texture.dispose()
    material.dispose()
  }

  label.dispose = dispose

  return label
}

export default LabelHelper
