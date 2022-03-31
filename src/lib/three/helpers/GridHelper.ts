/** @module Lib.Three.Helpers.GridHelper */

import {
  Box3,
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Material,
  Object3D,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { ILabelHelper, LabelHelper } from './LabelHelper'
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
 * Grid Helper
 * @param renderer Renderer
 * @param scene Scene
 * @param camera Camera
 * @param controls Controls
 * @returns GridHelper
 */
const GridHelper = (
  renderer: WebGLRenderer,
  scene: Scene & { boundingBox: Box3; boundingSphere: Sphere },
  camera: PerspectiveCamera,
  controls: TrackballControls
) => {
  // Grid offset
  const baseGridOffset = 0.05
  // Axis offset
  const baseLabelOffset = 2
  // Minimum divisions
  const minDiv = 2
  // Maximum divisions
  const maxDiv = 5

  let gridOffset: number
  let labelOffset: number
  let gridHelper: IGridHelperGroup

  /**
   * Get divisions
   * @param size Size
   * @returns Divisions
   */
  const getAxisDivions = (size: Vector3): Vector3 => {
    const maxSize = Math.max(size.x, size.y, size.z)
    const xDiv = Math.max(Math.ceil((size.x / maxSize) * maxDiv), minDiv)
    const yDiv = Math.max(Math.ceil((size.y / maxSize) * maxDiv), minDiv)
    const zDiv = Math.max(Math.ceil((size.z / maxSize) * maxDiv), minDiv)
    return new Vector3(xDiv, yDiv, zDiv)
  }

  /**
   * Create grid
   * @param width Width
   * @param height Height
   * @param widthDivs Width divisions
   * @param heightDivs Height divisions
   * @param rotate Rotate
   * @returns Grid
   */
  const createGrid = (
    width: number,
    height: number,
    widthDivs: number,
    heightDivs: number,
    rotate?: (grid: Group) => void
  ): Group => {
    // Grid
    const grid = new Group()

    // Material
    const material = new LineBasicMaterial({ color: 0x888888 })

    // Lines
    const og = new Vector3(-width / 2, 0, -height / 2)
    const stepX = width / (widthDivs - 1)
    const stepY = height / (heightDivs - 1)

    for (let i = 0; i < heightDivs; ++i) {
      const lineGeo = new BufferGeometry().setFromPoints([
        new Vector3(og.x, 0, og.z + i * stepY),
        new Vector3(og.x + width, 0, og.z + i * stepY)
      ])
      grid.add(new Line(lineGeo, material))
    }

    for (let i = 0; i < widthDivs; ++i) {
      const lineGeo = new BufferGeometry().setFromPoints([
        new Vector3(og.x + i * stepX, 0, og.z),
        new Vector3(og.x + i * stepX, 0, og.z + height)
      ])
      grid.add(new Line(lineGeo, material))
    }

    // Rotate
    rotate?.(grid)

    return grid
  }

  /**
   * Create labels
   * @param start
   * @param end
   * @param axis
   * @param markingsNb
   * @returns Labels
   */
  const createLabels = (
    start: number,
    end: number,
    axis: Vector3,
    markingsNb: number
  ): Group => {
    // Group
    const group = new Group()

    // Labels
    const length = Math.abs(end - start)
    const step = length / (markingsNb - 1)
    const pos = new Vector3().copy(axis).multiplyScalar(-length / 2)
    const stepDir = new Vector3().copy(axis).multiplyScalar(step)
    let stepValue = start
    for (let i = 0; i < markingsNb; ++i) {
      const label = LabelHelper(renderer, NumberHelper(stepValue))
      label.position.copy(pos)
      group.add(label)
      pos.add(stepDir)
      stepValue += step
    }

    return group
  }

  /**
   * Build
   * @returns GridHelperGroup
   */
  const build = (): IGridHelperGroup => {
    const boundingBox = scene.boundingBox
    const center = scene.boundingSphere.center
    const size = new Vector3(
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z
    )

    const axisDivs = getAxisDivions(size)

    gridOffset = Math.max(size.x, size.y, size.z) * baseGridOffset
    labelOffset = gridOffset * baseLabelOffset

    // Grid
    const grid = new Group() as IGridHelperGroup

    // Grids
    const gridXZ = createGrid(size.x, size.z, axisDivs.x, axisDivs.z)
    const gridXY = createGrid(
      size.x,
      size.y,
      axisDivs.x,
      axisDivs.y,
      (grid: Object3D) => {
        grid.rotateX(Math.PI / 2)
      }
    )
    const gridYZ = createGrid(
      size.y,
      size.z,
      axisDivs.y,
      axisDivs.z,
      (grid: Object3D) => {
        grid.rotateZ(-Math.PI / 2)
      }
    )

    grid.add(gridXZ, gridXY, gridYZ)

    // Axis
    const labelsX = createLabels(
      boundingBox.min.x,
      boundingBox.max.x,
      new Vector3(1, 0, 0),
      axisDivs.x
    )
    const labelsY = createLabels(
      boundingBox.min.y,
      boundingBox.max.y,
      new Vector3(0, 1, 0),
      axisDivs.y
    )
    const labelsZ = createLabels(
      boundingBox.min.z,
      boundingBox.max.z,
      new Vector3(0, 0, 1),
      axisDivs.z
    )

    grid.add(labelsX, labelsY, labelsZ)

    grid.position.set(center.x, center.y, center.z)
    grid.type = 'GridHelper'
    grid.dispose = dispose

    return grid
  }

  /**
   * Math sign
   * @param value Value
   * @returns Sign
   */
  const sign = (value: number): -1 | 1 => {
    return value <= 0 ? -1 : 1
  }

  /**
   * Return -1 if (absolute) value is lower than 0.5, 1 otherwise
   * @param value Value
   * @returns Sign
   */
  const aMSign = (value: number): -1 | 1 => {
    return Math.abs(value) <= 0.5 ? 1 : -1
  }

  /**
   * Update
   */
  const update = (): void => {
    const boundingBox = scene.boundingBox
    const size = new Vector3(
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z
    )

    let currentlyVisible: boolean
    scene.children.forEach((child: IGridHelperGroup) => {
      if (child.type === 'GridHelper') {
        currentlyVisible = child.visible
        scene.remove(child)
        child.dispose()
      }
    })

    gridHelper = build()

    // Distance to target
    const distanceToTarget = controls.object.position.distanceTo(
      controls.target
    )

    // Scale sprites
    gridHelper.traverse((child) => {
      if (child.type === 'LabelHelper')
        child.scale.setScalar(distanceToTarget * 0.05)
    })

    // Use camera forward direction to flip grids and labels
    // As well as set axis visibily
    const camFwd = new Vector3()
    camera.getWorldDirection(camFwd)

    const scaleFactor = distanceToTarget / 10 / (controls.minDistance + 1e-3)

    // Grids
    const gridXZ = gridHelper.children[0]
    const gridXY = gridHelper.children[1]
    const gridYZ = gridHelper.children[2]
    gridXZ.position.set(
      0,
      sign(camFwd.y) * (size.y / 2 + gridOffset * scaleFactor),
      0
    )
    gridXY.position.set(
      0,
      0,
      sign(camFwd.z) * (size.z / 2 + gridOffset * scaleFactor)
    )
    gridYZ.position.set(
      sign(camFwd.x) * (size.x / 2 + gridOffset * scaleFactor),
      0,
      0
    )

    // Labels
    const labelsX = gridHelper.children[3]
    const labelsY = gridHelper.children[4]
    const labelsZ = gridHelper.children[5]
    labelsX.position.set(
      0,
      sign(camFwd.y) *
        aMSign(camFwd.y) *
        (size.y / 2 + labelOffset * scaleFactor),
      sign(camFwd.z) *
        aMSign(camFwd.y) *
        -(size.z / 2 + labelOffset * scaleFactor)
    )
    labelsY.position.set(
      sign(camFwd.x) *
        aMSign(camFwd.x) *
        (size.x / 2 + labelOffset * scaleFactor),
      0,
      sign(camFwd.z) *
        aMSign(camFwd.x) *
        -(size.z / 2 + labelOffset * scaleFactor)
    )
    labelsZ.position.set(
      sign(camFwd.x) *
        aMSign(camFwd.x) *
        (size.x / 2 + labelOffset * scaleFactor),
      sign(camFwd.y) *
        aMSign(camFwd.x) *
        -(size.y / 2 + labelOffset * scaleFactor),
      0
    )

    // Visibility
    const verticalVisibilityThreshold = 0.2 * scaleFactor
    const horizontalVisibilityThreshold = 0.3 * scaleFactor
    labelsX.visible =
      Math.abs(camFwd.y) > verticalVisibilityThreshold ||
      Math.abs(camFwd.z) > horizontalVisibilityThreshold
    labelsY.visible =
      Math.abs(camFwd.x) > horizontalVisibilityThreshold ||
      Math.abs(camFwd.z) > horizontalVisibilityThreshold
    labelsZ.visible =
      Math.abs(camFwd.x) > horizontalVisibilityThreshold ||
      Math.abs(camFwd.y) > verticalVisibilityThreshold

    gridHelper.visible = currentlyVisible

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
