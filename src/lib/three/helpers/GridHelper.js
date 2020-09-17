import {
  Geometry,
  Group,
  Line,
  LineBasicMaterial,
  Vector2,
  Vector3
} from 'three/build/three.module'

const GridHelper = (renderer, scene, camera, controls) => {
  const gridColor = '#888888'

  const createGrid = ({ width, height, wDiv, hDiv, direction }) => {
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
      grid.add(line)
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

    grid.lookAt(direction)

    return grid
  }

  const grid = new Group()

  const gridXY = createGrid({
    width: 10,
    height: 10,
    wDiv: 10,
    hDiv: 10,
    direction: new Vector3(0, 0, 1)
  })
  const gridXZ = createGrid({
    width: 10,
    height: 10,
    wDiv: 10,
    hDiv: 10,
    direction: new Vector3(0, 1, 0)
  })
  const gridYZ = createGrid({
    width: 10,
    height: 10,
    wDiv: 10,
    hDiv: 10,
    direction: new Vector3(1, 0, 0)
  })

  grid.add(gridXY)
  grid.add(gridXZ)
  grid.add(gridYZ)

  grid.type = 'GridHelper'
  scene.add(grid)
}

export { GridHelper }
