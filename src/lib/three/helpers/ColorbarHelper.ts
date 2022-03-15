/** @module Lib.Three.Helpers.ColorbarHelper */

import {
  CanvasTexture,
  OrthographicCamera,
  Scene,
  SpriteMaterial,
  Sprite,
  WebGLRenderer
} from 'three'
import { Lut } from 'three/examples/jsm/math/Lut'

import Label from './LabelHelper'
import NumberHelper from './NumberHelper'

export interface IColorbarHelper {
  render: () => void
  setLUT: (lut: Lut) => void
  setVisible: (visible: boolean) => void
}

export interface IColorbarHelperSprite extends Sprite {
  dispose: () => void
}

/**
 * Colorbar helper
 * @param renderer Renderer
 */
const ColorbarHelper = (renderer: WebGLRenderer): IColorbarHelper => {
  const width = 500
  const height = 50

  const colorScene = new Scene()
  const colorCamera = new OrthographicCamera(-1, 1, 1, -1, 2, 1)
  colorCamera.position.set(0, 0, 1)

  let sprite: IColorbarHelperSprite

  /**
   * Set visible
   * @param visible Visible
   */
  const setVisible = (visible: boolean): void => {
    colorScene.children.forEach((child) => {
      child.visible = visible
    })
  }

  /**
   * Clean scene (local)
   */
  const clearScene = (): void => {
    colorScene.children.forEach((child: IColorbarHelperSprite) => {
      child.dispose()
    })
    colorScene.clear()
  }

  /**
   * Set LUT
   * @param lutData LUT
   */
  const setLUT = (lutData: Lut): void => {
    clearScene()

    const lut = new Lut('rainbow', lutData.n)
    lut.setMin(lutData.minV)
    lut.setMax(lutData.maxV)

    const map = new CanvasTexture(lut.createCanvas())
    const material = new SpriteMaterial({ map: map })
    sprite = new Sprite(material) as IColorbarHelperSprite
    sprite.material.rotation = -Math.PI / 2
    sprite.scale.x = 0.2
    sprite.scale.y = 1.4
    sprite.dispose = sprite.material.dispose
    colorScene.add(sprite)

    setLabels(lut)
  }

  /**
   * Set labels
   * @param lut LUT
   */
  const setLabels = (lut: Lut): void => {
    let min = NumberHelper(lut.minV)
    let max = NumberHelper(lut.maxV)

    const minLabel = Label(String(min), 768, 'gray', 96, 'right')
    minLabel.scale.x = 0.5
    minLabel.scale.y = 4.5
    minLabel.position.set(-0.72, 0, 0)
    const maxLabel = Label(String(max), 768, 'gray', 96, 'left')
    maxLabel.scale.x = 0.5
    maxLabel.scale.y = 4.5
    maxLabel.position.set(0.72, 0, 0)

    colorScene.add(minLabel)
    colorScene.add(maxLabel)
  }

  /**
   * Render
   */
  const render = (): void => {
    const rect = renderer.domElement.getBoundingClientRect()
    renderer.setViewport(
      rect.width / 2 - width / 2,
      rect.height - height,
      width,
      height
    )
    renderer.render(colorScene, colorCamera)
  }

  return { render, setLUT, setVisible }
}

export { ColorbarHelper }
