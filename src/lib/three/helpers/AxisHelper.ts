/** @module Lib.Three.Helpers.AxisHelper */

import {
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer
} from 'three'

import Arrow, { IArrowHelper } from './ArrowHelper'
import { LabelHelper, ILabelHelper } from './LabelHelper'

export interface IAxisHelper {
  dispose: () => void
  render: () => void
  resize: (pos: IAxisHelperNewPos) => void
}

export interface IAxisHelperGroup extends Omit<Group, 'type'> {
  type: 'AxisHelper'
}

export interface IAxisHelperPos {
  offsetWidth: number
  offsetHeight: number
  width: number
  height: number
}

export interface IAxisHelperNewPos {
  newOffsetWidth: number
  newOffsetHeight: number
  newWidth: number
  newHeight: number
}

// Default width in viewport
const defaultWidth = 150
// Default height in viewport
const defaultHeight = 150

/**
 * Axis helper
 * @param renderer Renderer
 * @param camera Camera
 * @param dimensions Dimensions
 */
const AxisHelper = (
  renderer: WebGLRenderer,
  camera: PerspectiveCamera,
  { offsetWidth, offsetHeight, width, height } = {
    offsetWidth: 0,
    offsetHeight: 0,
    width: defaultWidth,
    height: defaultHeight
  }
): IAxisHelper => {
  // X-axis color
  const xColor = 'red'
  // Y-axis color
  const yColor = 'green'
  // Z-axis color
  const zColor = 'blue'
  // Base sphere color
  const baseColor = 'black'

  // Size
  let currentOffsetWidth = offsetWidth
  let currentOffsetHeight = offsetHeight
  let currentWidth = width
  let currentHeight = height

  // X
  const x = Arrow(xColor)
  x.rotateZ(-Math.PI / 2)
  const xLabel = LabelHelper(renderer, 'X', {
    position: new Vector3(1.1, 0, 0)
  })

  // Y
  const y = Arrow(yColor)
  const yLabel = LabelHelper(renderer, 'Y', {
    position: new Vector3(0, 1.1, 0)
  })

  // Z
  const z = Arrow(zColor)
  z.rotateX(Math.PI / 2)
  const zLabel = LabelHelper(renderer, 'Z', {
    position: new Vector3(0, 0, 1.1)
  })

  // Sphere
  const sphereGeometry = new SphereGeometry(0.05, 50, 50)
  const sphereMaterial = new MeshBasicMaterial({ color: baseColor })
  const sphere = new Mesh(sphereGeometry, sphereMaterial)

  // Axis helper
  const mesh = new Group() as IAxisHelperGroup
  mesh.type = 'AxisHelper'
  mesh.add(x)
  mesh.add(xLabel)
  mesh.add(y)
  mesh.add(yLabel)
  mesh.add(z)
  mesh.add(zLabel)
  mesh.add(sphere)

  // Scene
  const localScene = new Scene()
  localScene.add(mesh)

  // Camera
  const localCamera = new OrthographicCamera(-1.2, 1.2, 1.2, -1.2, -2, 2)

  /**
   * Resize
   * @param dimensions Dimensions
   */
  const resize = ({
    newOffsetWidth,
    newOffsetHeight,
    newWidth,
    newHeight
  }: IAxisHelperNewPos): void => {
    currentOffsetWidth = newOffsetWidth
    currentOffsetHeight = newOffsetHeight
    currentWidth = newWidth
    currentHeight = newHeight
  }

  /**
   * Render
   */
  const render = (): void => {
    renderer.setViewport(
      currentOffsetWidth,
      currentOffsetHeight,
      currentWidth,
      currentHeight
    )
    localCamera.rotation.copy(camera.rotation)
    renderer.render(localScene, localCamera)
  }

  /**
   * Dispose
   */
  const dispose = (): void => {
    sphereGeometry.dispose()
    sphereMaterial.dispose()

    mesh.children.forEach((child) => {
      if (child.type === 'ArrowHelper' || child.type === 'LabelHelper')
        (child as IArrowHelper | ILabelHelper).dispose()
    })

    localScene.remove(mesh)
  }

  return { dispose, render, resize }
}

export { AxisHelper }
