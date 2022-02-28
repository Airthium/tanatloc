/** @module Lib.Three.Helpers.GridHelper */

import {
  Box3,
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Material,
  Scene,
  Sphere,
  Vector2,
  Vector3
} from 'three'

import Label, { ILabelHelper } from './LabelHelper'
import NumberHelper from './NumberHelper'

export interface IGridHelper {
  dispose: () => void
  setVisible: (visible: boolean) => void
  update: () => void
}

export interface IGridHelperGroup extends Omit<Group, 'type'> {
  type: Group['type'] | 'GridHelper'
  dispose: () => void
}

/**
 * GridHelper
 * @param scene Scene
 */
const GridHelper = (
  scene: Scene & { boundingBox: Box3; boundingSphere: Sphere }
): IGridHelper => {
  // Grid color
  const gridColor = '#888888'
  // Min divisions
  const minDivisions = 3
  // Max divisions
  const maxDivisions = 6
  // Grid overflow (% of maxsize)
  const overflowGrid = 0
  // Grid separation (% of maxsize)
  const overspaceGrid = 0.15

  // Variable
  let maxSize: number
  let gridHelper: IGridHelperGroup

  /**
   * Get number of division for each axis
   * @param size Size
   */
  const getDivisions = (size: { x: number; y: number; z: number }): Vector3 => {
    const xDiv = Math.max(
      Math.ceil((size.x / maxSize) * maxDivisions),
      minDivisions
    )
    const yDiv = Math.max(
      Math.ceil((size.y / maxSize) * maxDivisions),
      minDivisions
    )
    const zDiv = Math.max(
      Math.ceil((size.z / maxSize) * maxDivisions),
      minDivisions
    )

    return new Vector3(xDiv, yDiv, zDiv)
  }

  /**
   * Create grid
   * @param dimensions Dimensions
   */
  const createGrid = ({
    offsetWidth,
    width,
    height,
    wDiv,
    hDiv,
    rotate,
    translation
  }): IGridHelperGroup => {
    const grid = new Group() as IGridHelperGroup
    const material = new LineBasicMaterial({ color: gridColor })

    const origin = new Vector2(-width / 2, -height / 2)
    const xStep = width / (wDiv - 1)
    const yStep = height / (hDiv - 1)

    for (let i = 0; i < hDiv; ++i) {
      const lineGeometry = new BufferGeometry().setFromPoints([
        new Vector3(origin.x, origin.y + i * yStep, 0),
        new Vector3(origin.x + width, origin.y + i * yStep)
      ])
      const line = new Line(lineGeometry, material)

      const size = 512
      const fontSize = 64
      const scale = maxSize / 5

      const label1 = Label(NumberHelper(offsetWidth), size, 'grey', fontSize)
      label1.translateX(-width / 2)
      label1.translateY(height / 2 + overflowGrid * maxSize)
      label1.scale.setScalar(scale)
      const label2 = Label(NumberHelper(width), size, 'grey', fontSize)
      label2.translateX(width / 2)
      label2.translateY(height / 2 + overflowGrid * maxSize)
      label2.scale.setScalar(scale)

      grid.add(line)
      grid.add(label1)
      grid.add(label2)
    }

    for (let i = 0; i < wDiv; ++i) {
      const lineGeometry = new BufferGeometry().setFromPoints([
        new Vector3(origin.x + i * xStep, origin.y, 0),
        new Vector3(origin.x + i * xStep, origin.y + height)
      ])
      const line = new Line(lineGeometry, material)
      grid.add(line)
    }

    grid.translateX(translation.x)
    grid.translateY(translation.y)
    grid.translateZ(translation.z)

    grid.rotateX(rotate.x)
    grid.rotateY(rotate.y)
    grid.rotateZ(rotate.z)

    return grid
  }

  /**
   * Build grid
   */
  const build = (): IGridHelperGroup => {
    const boundingBox = scene.boundingBox
    const center = scene.boundingSphere.center

    const size = new Vector3(
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z
    )

    maxSize = Math.max(size.x, size.y, size.z)

    const divisions = getDivisions(size)

    const grid = new Group() as IGridHelperGroup

    const gridXY = createGrid({
      offsetWidth: boundingBox.min.x,
      width: size.x + maxSize * overflowGrid,
      height: size.y + maxSize * overflowGrid,
      wDiv: divisions.x,
      hDiv: divisions.y,
      rotate: new Vector3(0, 0, 0),
      translation: new Vector3(
        center.x,
        center.y,
        center.z - (size.z + overspaceGrid * maxSize) / 2
      )
    })
    const gridZX = createGrid({
      offsetWidth: boundingBox.min.z,
      width: size.z + maxSize * overflowGrid,
      height: size.x + maxSize * overflowGrid,
      wDiv: divisions.z,
      hDiv: divisions.x,
      rotate: new Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      translation: new Vector3(
        center.x,
        center.y - (size.y + overspaceGrid * maxSize) / 2,
        center.z
      )
    })
    const gridYZ = createGrid({
      offsetWidth: boundingBox.min.y,
      width: size.y + maxSize * overflowGrid,
      height: size.z + maxSize * overflowGrid,
      wDiv: divisions.y,
      hDiv: divisions.z,
      rotate: new Vector3(Math.PI / 2, Math.PI / 2, 0),
      translation: new Vector3(
        center.x - (size.x + overspaceGrid * maxSize) / 2,
        center.y,
        center.z
      )
    })

    grid.add(gridXY)
    grid.add(gridZX)
    grid.add(gridYZ)

    grid.type = 'GridHelper'
    grid.dispose = dispose

    return grid
  }

  /**
   * Update
   */
  const update = (): void => {
    scene.children.forEach((child: IGridHelperGroup) => {
      if (child.type === 'GridHelper') {
        scene.remove(child)
        child.dispose()
      }
    })

    gridHelper = build()
    scene.add(gridHelper)
  }

  /**
   * Set visible
   * @param visible Visible
   */
  const setVisible = (visible: boolean): void => {
    gridHelper.visible = visible
  }

  /**
   * Dispose
   */
  const dispose = (): void => {
    gridHelper?.children.forEach((group) => {
      group.children.forEach((child) => {
        if (child.type === 'Line') {
          const line = child as Line
          const geometry = line.geometry
          geometry.dispose()
          const material = line.material as Material
          material.dispose()
        } else if (child.type === 'LabelHelper') {
          const label = child as ILabelHelper
          label.dispose()
        }
      })
    })
  }

  return { dispose, setVisible, update }
}

export { GridHelper }
