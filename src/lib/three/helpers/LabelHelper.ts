/** @module Lib.Three.Helpers.LabelHelper */

import { Sprite, SpriteMaterial, Texture } from 'three'

export interface ILabelHelper extends Omit<Sprite, 'type'> {
  type: Sprite['type'] | 'LabelHelper'
  dispose: () => void
}

/**
 * LabelHelper
 * @param text Text
 * @param size Size
 * @param fontColor Font color
 * @param fontSize Font size
 */
const LabelHelper = (
  text: string,
  size = 512,
  fontColor = 'black',
  fontSize = 512
): ILabelHelper => {
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
    transparent: true,
    depthWrite: false
  })
  const label = new Sprite(material) as ILabelHelper
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
