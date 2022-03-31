/** @module Lib.Three.Helpers.LabelHelper */

import { Sprite, SpriteMaterial, Texture, Vector3, WebGLRenderer } from 'three'

export interface ILabelHelper extends Omit<Sprite, 'type'> {
  type: Sprite['type'] | 'LabelHelper'
  dispose: () => void
}

/**
 * LabelHelper
 * @param renderer Renderer
 * @param text Text
 * @param parameters Parameters
 */
const LabelHelper = (
  renderer: WebGLRenderer,
  text: string,
  parameters?: {
    position?: Vector3
    scale?: number
    align?: CanvasTextAlign
  }
): ILabelHelper => {
  // Canvas
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext('2d')
  context.fillStyle = 'grey'
  context.font = '50px sans-serif'
  context.textAlign = parameters?.align || 'center'
  context.textBaseline = 'middle'
  context.fillText(text, canvas.width / 2, canvas.height / 2)

  // Texture
  const texture = new Texture(canvas)
  texture.flipY = true
  texture.needsUpdate = true

  // Material
  const material = new SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false
  })
  material.map.anisotropy = renderer.capabilities.getMaxAnisotropy()

  // Label
  const label = new Sprite(material) as ILabelHelper
  label.type = 'LabelHelper'

  // Position
  if (parameters?.position) label.position.copy(parameters.position)

  // Scale
  if (parameters?.scale) label.scale.setScalar(parameters.scale)

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

export { LabelHelper }
