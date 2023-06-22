/** @module Lib.Three.Helpers.ColorbarHelper */

import {
  CanvasTexture,
  Group,
  OrthographicCamera,
  Scene,
  SpriteMaterial,
  Sprite,
  WebGLRenderer,
  Vector3,
  Color
} from 'three'
import { Lut } from 'three/examples/jsm/math/Lut'

import { IUnit } from '@/models/index.d'

import { ILabelHelper, LabelHelper } from './LabelHelper'
import NumberHelper from './NumberHelper'

export interface IColorbarHelper {
  render: () => void
  addLUT: (lut: Lut) => void
  setUnit: (unit?: IUnit) => void
  setVisible: (visible: boolean) => void
  setColorMap: (key: string) => void
  setRange: (minV: number, maxV: number) => void
  setAutomaticRange: () => void
  getMinV: () => number
  getMaxV: () => number
  getColor: (data: number) => Color
  dispose: () => void
}

export interface IColorbarHelperSprite extends Sprite {
  dispose: () => void
}

/**
 * Colorbar helper
 * @param renderer Renderer
 */
const ColorbarHelper = (renderer: WebGLRenderer): IColorbarHelper => {
  const width = 700
  const height = 50

  const lut = new Lut('rainbow', 512)
  lut.setMin(Number.MAX_VALUE)
  lut.setMax(-Number.MAX_VALUE)

  const colorScene = new Scene()
  const colorCamera = new OrthographicCamera(-1, 1, 1, -1, 2, 1)
  colorCamera.position.set(0, 0, 1)

  const group = new Group()
  colorScene.add(group)

  let customRange = false
  let scaleFactor: number = 1
  let addFactor: number = 0

  /**
   * Set unit
   * @param unit Unit
   */
  const setUnit = (unit?: IUnit): void => {
    const unitLabelHelper = LabelHelper(
      renderer,
      String('Unit: ' + (unit?.label ?? 1)),
      {
        background: 'white',
        fillStyle: 'black',
        position: new Vector3(0, 0.5, 0),
        width: 512
      }
    )
    unitLabelHelper.scale.x = 0.4
    unitLabelHelper.scale.y = 2.8
    unitLabelHelper.renderOrder = 0

    group.add(unitLabelHelper)

    scaleFactor = unit?.multiplicator ?? 1
    addFactor = unit?.adder ?? 0
  }

  /**
   * Set visible
   * @param visible Visible
   */
  const setVisible = (visible: boolean): void => {
    colorScene.children.forEach((group) => {
      group.children.forEach((child) => (child.visible = visible))
    })
  }

  /**
   * Clean scene (local)
   */
  const clearScene = (): void => {
    colorScene.children.forEach((group) => {
      group.children.forEach((child) => {
        const label = child as ILabelHelper
        if (label.type === 'LabelHelper') label.dispose()

        const sprite = child as IColorbarHelperSprite
        if (sprite.type === 'Sprite') sprite.dispose()

        group.remove(child)
      })
    })
  }

  /**
   * Add LUT
   * @param lutData LUT
   */
  const addLUT = (lutData: Lut): void => {
    if (!customRange) {
      const min = lut.minV
      const max = lut.maxV

      lut.setMin(Math.min(min, lutData.minV))
      lut.setMax(Math.max(max, lutData.maxV))
    }

    const map = new CanvasTexture(lut.createCanvas())
    const material = new SpriteMaterial({ map: map, depthWrite: false })
    const sprite = new Sprite(material) as IColorbarHelperSprite
    sprite.material.rotation = -Math.PI / 2
    sprite.scale.x = 0.2
    sprite.scale.y = 1.2
    sprite.renderOrder = 1
    sprite.dispose = sprite.material.dispose
    group.add(sprite)

    setLabels(lut)
  }

  /**
   * Set labels
   * @param lut LUT
   */
  const setLabels = (lut: Lut): void => {
    let min = NumberHelper(lut.minV * scaleFactor + addFactor)
    let max = NumberHelper(lut.maxV * scaleFactor + addFactor)

    const minLabel = LabelHelper(renderer, String(min), {
      background: 'white',
      fillStyle: 'black',
      position: new Vector3(-0.62, 0, 0),
      width: 512,
      align: 'right'
    })
    minLabel.scale.x = 0.4
    minLabel.scale.y = 2.8
    minLabel.renderOrder = 0
    const maxLabel = LabelHelper(renderer, String(max), {
      background: 'white',
      fillStyle: 'black',
      position: new Vector3(0.62, 0, 0),
      width: 512,
      align: 'left'
    })
    maxLabel.scale.x = 0.4
    maxLabel.scale.y = 2.8
    maxLabel.renderOrder = 0

    group.add(minLabel)
    group.add(maxLabel)
  }

  /**
   * Set color map
   * @param key Key
   */
  const setColorMap = (key: string) => {
    lut.setColorMap(key, 512)
  }

  const setRange = (minV: number, maxV: number): void => {
    customRange = true
    lut.setMin(minV)
    lut.setMax(maxV)
  }

  const setAutomaticRange = (): void => {
    customRange = false
    lut.setMin(Number.MAX_VALUE)
    lut.setMax(-Number.MAX_VALUE)
  }

  /**
   * Get minV
   * @returns minV
   */
  const getMinV = (): number => lut.minV

  /**
   * Get maxV
   * @returns maxV
   */
  const getMaxV = (): number => lut.maxV

  /**
   * Get color
   * @param data Data
   * @returns Color
   */
  const getColor = (data: number) => {
    return lut.getColor(data)
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

  const dispose = () => {
    if (!customRange) {
      lut.setMin(Number.MAX_VALUE)
      lut.setMax(-Number.MAX_VALUE)
    }
    clearScene()
  }

  return {
    render,
    addLUT,
    getMinV,
    getMaxV,
    getColor,
    setUnit,
    setVisible,
    setColorMap,
    setRange,
    setAutomaticRange,
    dispose
  }
}

export { ColorbarHelper }
