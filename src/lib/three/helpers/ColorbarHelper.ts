/** @module Lib.Three.Helpers.ColorbarHelper */

import {
  CanvasTexture,
  OrthographicCamera,
  Scene,
  SpriteMaterial,
  Sprite,
  WebGLRenderer,
  Vector3
} from 'three'
import { Lut } from 'three/examples/jsm/math/Lut'

import { LabelHelper } from './LabelHelper'
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
    colorScene.children.forEach((child) =>
      (child as IColorbarHelperSprite).dispose()
    )
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

    const minLabel = LabelHelper(renderer, String(min), {
      position: new Vector3(-0.72, 0, 0),
      align: 'right'
    })
    minLabel.scale.x = 0.25
    minLabel.scale.y = 2.5
    const maxLabel = LabelHelper(renderer, String(max), {
      position: new Vector3(0.72, 0, 0),
      align: 'left'
    })
    maxLabel.scale.x = 0.25
    maxLabel.scale.y = 2.5

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
