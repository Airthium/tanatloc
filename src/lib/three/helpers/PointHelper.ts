/** @module Lib.Three.Helpers.PointHelper */

import {
  Box3,
  BufferGeometry,
  Group,
  Line,
  LineBasicMaterial,
  Material,
  Mesh,
  MeshStandardMaterial,
  Scene,
  Sphere,
  SphereGeometry,
  Vector3
} from 'three'

export interface IPointHelper {
  build: () => void
  dispose: () => void
  update: (point?: Vector3) => void
}

const PointHelper = (
  scene: Scene & { boundingBox: Box3; boundingSphere: Sphere }
): IPointHelper => {
  // Group
  const group = new Group() as unknown as Omit<Group, 'type'> & {
    type: 'PointHelper'
  }
  group.type = 'PointHelper'
  group.visible = false

  // Scene
  scene.add(group)

  /**
   * Build sphere
   * @returns Sphere
   */
  const buildSphere = (): Mesh<BufferGeometry, Material> => {
    const radius = (scene.boundingSphere?.radius ?? 1) / 100

    const sphereGeometry = new SphereGeometry(radius)
    const sphereMaterial = new MeshStandardMaterial({ color: 0xff0000 })
    return new Mesh(sphereGeometry, sphereMaterial)
  }

  /**
   * Build line
   * @param point1 Point 1
   * @param point2 Point 2
   * @returns Line
   */
  const buildLine = (
    point1: Vector3,
    point2: Vector3
  ): Line<BufferGeometry, Material> => {
    const lineGeometry = new BufferGeometry().setFromPoints([point1, point2])
    const lineMaterial = new LineBasicMaterial({ color: 0xff0000 })
    return new Line(lineGeometry, lineMaterial)
  }

  /**
   * Build lines
   * @returns Lines
   */
  const buildLines = (): Line<BufferGeometry, Material>[] => {
    const lines = []

    const xLength = scene.boundingBox.max.x - scene.boundingBox.min.x
    const yLength = scene.boundingBox.max.y - scene.boundingBox.min.y
    const zLength = scene.boundingBox.max.z - scene.boundingBox.min.z
    const length = Math.max(xLength, yLength, zLength)

    // X
    const lineX = buildLine(
      new Vector3(-length / 2, 0, 0),
      new Vector3(length / 2, 0, 0)
    )
    lines.push(lineX)

    // Y
    const lineY = buildLine(
      new Vector3(0, -length / 2, 0),
      new Vector3(0, length / 2, 0)
    )
    lines.push(lineY)

    // Z
    const lineZ = buildLine(
      new Vector3(0, 0, -length / 2),
      new Vector3(0, 0, length / 2)
    )
    lines.push(lineZ)

    return lines
  }

  /**
   * Build
   */
  const build = () => {
    // Cleanup
    dispose()

    const sphere = buildSphere()
    const lines = buildLines()

    group.add(sphere)
    group.add(...lines)
  }

  /**
   * Update
   * @param point Point
   */
  const update = (point?: Vector3): void => {
    if (point) {
      group.position.set(point.x, point.y, point.z)
      group.visible = true
    } else {
      group.visible = false
    }
  }

  /**
   * Dispose
   */
  const dispose = () => {
    group.children.forEach((child) => {
      group.remove(child)
      const mesh = child as Mesh<BufferGeometry, Material>
      mesh.geometry.dispose()
      mesh.material.dispose()
    })
  }

  return { build, dispose, update }
}

export { PointHelper }
