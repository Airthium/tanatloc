import { Sprite, SpriteMaterial, Texture } from 'three/build/three.module'

/**
 * LabelHelper
 * @param {string} text Text
 * @param {number} fontSize Font size
 */
const LabelHelper = (text, fontColor = 'black', fontSize = 256) => {
  // Canvas
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
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

  return label
}

export default LabelHelper
