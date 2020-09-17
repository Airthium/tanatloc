import {
  Geometry,
  Group,
  Line,
  LineBasicMaterial,
  Vector2,
  Vector3
} from 'three/build/three.module'

import Label from './LabelHelper'

const GridHelper = (renderer, scene, camera, controls) => {
  // Grid color
  const gridColor = '#888888'
  // Min divisions
  const minDivisions = 3
  // Max divisions
  const maxDivisions = 6
  // Grid overflow (% of maxsize)
  const overflowGrid = 0.05
  // Grid separation (% of maxsize)
  const overspaceGrid = 0.15

  // Variable
  let maxSize
  let gridHelper

  const getDivisions = (size) => {
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

  const createGrid = ({ width, height, wDiv, hDiv, rotate, translation }) => {
    const grid = new Group()
    const material = new LineBasicMaterial({ color: gridColor })

    const origin = new Vector2(-width / 2, -height / 2)
    const xStep = width / (wDiv - 1)
    const yStep = height / (hDiv - 1)

    for (let i = 0; i < hDiv; ++i) {
      const lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(origin.x, origin.y + i * yStep, 0),
        new Vector3(origin.x + width, origin.y + i * yStep)
      )
      const line = new Line(lineGeometry, material)

      const fontSize = (100 * maxSize) / 10

      const label1 = Label(0, 'grey', fontSize)
      label1.translateX(-width / 2)
      label1.translateY(height / 2 + overflowGrid * maxSize)
      const label2 = Label(width.toFixed(2), 'grey', fontSize)
      label2.translateX(width / 2)
      label2.translateY(height / 2 + overflowGrid * maxSize)

      grid.add(line)
      grid.add(label1)
      grid.add(label2)
    }

    for (let i = 0; i < wDiv; ++i) {
      const lineGeometry = new Geometry()
      lineGeometry.vertices.push(
        new Vector3(origin.x + i * xStep, origin.y, 0),
        new Vector3(origin.x + i * xStep, origin.y + height)
      )
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

  const build = () => {
    const boundingBox = scene.boundingBox
    const center = scene.boundingSphere.center

    const size = new Vector3(
      boundingBox.max.x - boundingBox.min.x,
      boundingBox.max.y - boundingBox.min.y,
      boundingBox.max.z - boundingBox.min.z
    )

    maxSize = Math.max(size.x, size.y, size.z)

    const divisions = getDivisions(size, maxSize)

    const grid = new Group()

    const gridXY = createGrid({
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
      width: size.z + maxSize * overflowGrid,
      height: size.x + maxSize * overflowGrid,
      wDiv: divisions.z,
      hDiv: divisions.x,
      rotate: new Vector3(-Math.PI / 2, 0, -Math.PI / 2),
      translation: new Vector3(
        center.z,
        center.y - (size.y + overspaceGrid * maxSize) / 2,
        center.x
      )
    })
    const gridYZ = createGrid({
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

    return grid
  }

  const update = () => {
    scene.children.forEach((child) => {
      if (child.type === 'GridHelper') scene.remove(child)
    })

    gridHelper = build()
    scene.add(gridHelper)
  }

  const setVisible = (visible) => {
    gridHelper.visible = visible
  }

  return { update, setVisible }
}

export { GridHelper }
