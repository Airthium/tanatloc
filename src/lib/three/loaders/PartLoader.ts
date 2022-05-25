/** @module Lib.Three.Loaders.PartLoader */

import {
  Box3,
  BufferGeometry,
  Color,
  DoubleSide,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { Lut } from 'three/examples/jsm/math/Lut'

export interface IPartLoader {
  load: (
    part: { uuid: string; buffer: Buffer },
    transparent: boolean,
    clippingPlane: Plane
  ) => Promise<IPart>
}

export interface IPartMesh
  extends Mesh<
    BufferGeometry,
    MeshStandardMaterial & { originalColor: Color }
  > {
  userData: {
    uuid: string
    label: number
    // lut?: Lut
  }
}

export interface IPartObject extends Object3D {
  children: (IPartObject | IPartMesh)[]
}

export interface IPart extends Object3D {
  type: 'Part'
  uuid: string
  boundingBox: Box3
  children: (IPartObject | IPartMesh)[]
  dispose: () => void
  setTransparent: (transparent: boolean) => void
  startSelection: (
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    outlinePass: OutlinePass,
    type?: string
  ) => void
  stopSelection: () => void
  getHighlighted: () => { uuid: string; number: number | string } | null
  getSelected: () => { uuid: string; number: number | string }[]
  highlight: (uuid?: string) => void
  unhighlight: () => void
  select: (uuid: string) => void
  unselect: (uuid: string) => void
}

/**
 * PartLoader
 * @memberof Lib.Three.Loaders
 * @param mouseMoveEvent Mouse move event
 * @param mouseDownEvent Mouse down event
 */
const PartLoader = (
  mouseMoveEvent: (part: IPart, uuid?: string, number?: number) => void,
  mouseDownEvent: (part: IPart, uuid: string, number: number) => void
): IPartLoader => {
  // Highlight color
  const highlightColor = new Color('#FAD114')
  // Select colo
  const selectColor = new Color('#EE9817')

  /**
   * Load
   * @param part Part
   * @param transparent Transparent
   * @param clippingPlane Clipping plane
   */
  const load = async (
    part: { uuid: string; buffer: Buffer },
    transparent: boolean,
    clippingPlane: Plane
  ): Promise<IPart> => {
    const blob = new Blob([Buffer.from(part.buffer)])
    const url = URL.createObjectURL(blob)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/three/libs/draco/')
    loader.setDRACOLoader(dracoLoader)
    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('node_modules/three//examples/js/libs/basis/')
    loader.setKTX2Loader(ktx2Loader)

    const gltf: GLTF = await new Promise((resolve, reject) => {
      loader.load(
        url,
        (glb) => {
          resolve(glb)
        },
        () => undefined,
        (err) => reject(err)
      )
    })

    const scene = gltf.scene
    const object = new Object3D() as IPart
    object.type = 'Part'
    object.uuid = part.uuid
    object.children = scene.children

    // Set clipping plane and visible
    object.traverse((child) => {
      if (child.type === 'Mesh') {
        const mesh = child as IPartMesh
        mesh.material.clippingPlanes = [clippingPlane]
        mesh.material.side = DoubleSide
        mesh.material.roughness = 0.5
        mesh.material.metalness = 0.5
        mesh.visible = true
      }
    })

    // Check type
    const firstName = object.children[0].name
    switch (firstName) {
      case 'Solid1':
        object.name = 'Geometry3D'
        break
      case 'Faces':
        object.name = 'Geometry2D'
      case 'Triangles':
        // TODO mesh or result
        break
      default:
        break
    }

    // Set uuid, label
    let faceIndex = 0
    let edgeIndex = 0
    object.children.forEach((solid, solidIndex) => {
      // Solid
      console.log(solid.name)
      solid.name = 'Solid ' + (solidIndex + 1)
      solid.userData = {
        uuid: solid.uuid,
        label: solidIndex + 1
      }
      solid.children.forEach((child) => {
        if (child.type === 'Mesh') {
          // Face
          faceIndex++
          const face = child
          console.log(face.name)
          face.name = 'Face ' + faceIndex
          face.userData = {
            uuid: child.uuid,
            label: faceIndex
          }
        } else if (child.type === 'Object3D') {
          child.children.forEach((edge) => {
            // Edge
            console.log(edge.name)
            edgeIndex++
            edge.name = 'Edge ' + edgeIndex
            edge.userData = {
              uuid: edge.uuid,
              label: edgeIndex
            }
          })
        }
      })
    })

    // Transparency
    setTransparent(object, transparent)

    object.boundingBox = computeBoundingBox(object)
    object.dispose = () => dispose(object)

    object.setTransparent = (transp: boolean) => setTransparent(object, transp)

    object.startSelection = (
      renderer: WebGLRenderer,
      camera: PerspectiveCamera,
      outlinePass: OutlinePass,
      type?: string
    ) => startSelection(object, renderer, camera, outlinePass, type)
    object.stopSelection = () => stopSelection()
    object.getHighlighted = () => highlighted
    object.getSelected = () => selected
    object.highlight = highlight
    object.unhighlight = unhighlight
    object.select = select
    object.unselect = unselect

    return object
  }

  /**
   * Compute bounding box
   * @param part Part
   */
  const computeBoundingBox = (part: IPart): Box3 => {
    const box = new Box3()

    part.traverse((child) => {
      box.expandByObject(child)
    })

    return box
  }

  /**
   * Dispose
   * @param part Part
   */
  const dispose = (part: IPart): void => {
    part.traverse((child) => {
      if (child.type === 'Mesh') {
        const mesh = child as IPartMesh
        mesh.geometry.dispose()
        mesh.material.dispose()
      }
    })
  }

  /**
   * Set transparent
   * @param part Part
   * @param transparent Transparent
   */
  const setTransparent = (part: IPart, transparent: boolean): void => {
    part.traverse((child) => {
      if (child.type === 'Mesh') {
        const mesh = child as IPartMesh
        mesh.material.transparent = transparent
        mesh.material.opacity = transparent ? 0.5 : 1
        mesh.material.depthWrite = !transparent
      }
    })
  }

  // highlight / selection Variables
  let raycaster = new Raycaster()
  let selectionPart: IPart | null = null
  let selectionRenderer: WebGLRenderer | null = null
  let selectionCamera: PerspectiveCamera | null = null
  let selectionOutlinePass: OutlinePass | null = null
  let selectionLevel: number | null = null
  let highlighted: { uuid: string; number: number } | null = null
  let selected: { uuid: string; number: number }[] = []

  /**
   *
   * @param part Part
   * @param renderer Renderer
   * @param camera Camera
   * @param outlinePass OutlinePass
   * @param type Type (solid, face)
   */
  const startSelection = (
    part: IPart,
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    outlinePass: OutlinePass,
    type?: string
  ): void => {
    selectionPart = part
    selectionRenderer = renderer
    selectionCamera = camera
    selectionOutlinePass = outlinePass
    selectionOutlinePass.selectedObjects = []
    highlighted = null
    selected.length = 0

    if (type === 'solids') {
      selectionLevel = 0
    } else if (type === 'faces') {
      selectionLevel = 1
    } else if (type === 'edges') {
      selectionLevel = 2
    }

    selectionRenderer.domElement.addEventListener('pointermove', mouseMove)
    selectionRenderer.domElement.addEventListener('pointerdown', mouseDown)
  }

  /**
   * Stop selection
   */
  const stopSelection = (): void => {
    selectionRenderer &&
      selectionRenderer.domElement.removeEventListener('pointermove', mouseMove)
    selectionRenderer &&
      selectionRenderer.domElement.removeEventListener('pointerdown', mouseDown)

    selectionLevel = null

    unhighlight()
    highlighted = null

    selected.forEach((s) => {
      unselect(s.uuid)
    })
    selected.length = 0

    selectionPart = null
    selectionRenderer = null
    selectionCamera = null
    selectionOutlinePass = null
  }

  /**
   * Find object in part
   * @param part Part
   * @param uuid UUID
   */
  const findObject = (
    part: IPart,
    uuid?: string
  ): IPartObject | IPartMesh | undefined => {
    if (!part) return
    if (!uuid) return

    let found
    part.traverse((child) => {
      if (child.uuid === uuid) found = child
    })

    return found
  }

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param event Event
   */
  const globalToLocal = (event: MouseEvent): Vector2 => {
    const node = event.target as HTMLElement
    const rect = node.getBoundingClientRect()

    const X = event.clientX - rect.left
    const Y = event.clientY - rect.top

    const mouse = new Vector2()
    mouse.x = (X / rect.width) * 2 - 1
    mouse.y = -(Y / rect.height) * 2 + 1

    return mouse
  }

  /**
   * Mouse move
   * @param event Event
   */
  //TODO
  const mouseMove = (event: MouseEvent): void => {
    const mouse = globalToLocal(event)
    raycaster.setFromCamera(mouse, selectionCamera!)
    const intersects = raycaster.intersectObjects([selectionPart!])

    if (intersects.length)
      mouseMoveEvent(
        selectionPart!,
        intersects[0].object.userData.uuid,
        intersects[0].object.userData.number
      )
    else mouseMoveEvent(selectionPart!)
  }

  /**
   * Add outline pass
   * @param mesh Mesh
   * @param selection Selection
   */
  const addOutlineOn = (
    mesh: IPart['children'][0]['children'][0],
    selection?: boolean
  ): void => {
    if (selection) {
      const alreadyOutlined = selectionOutlinePass!.selectedObjects.find(
        (s) => s.userData.uuid === mesh.userData.uuid
      )
      if (!alreadyOutlined) selectionOutlinePass!.selectedObjects.push(mesh)
    } else {
      const alreadySelected = selected.find(
        (s) => s.uuid === mesh.userData.uuid
      )
      if (!alreadySelected) selectionOutlinePass!.selectedObjects.push(mesh)
    }
  }

  /**
   * Remove outline pass
   * @param mesh Mesh
   * @param selection Selection
   */
  const removeOutlineOn = (
    mesh: IPart['children'][0]['children'][0],
    selection?: boolean
  ): void => {
    if (selection) {
      const outlinedIndex = selectionOutlinePass!.selectedObjects.findIndex(
        (s) => s.userData.uuid === mesh.userData.uuid
      )
      selectionOutlinePass!.selectedObjects = [
        ...selectionOutlinePass!.selectedObjects.slice(0, outlinedIndex),
        ...selectionOutlinePass!.selectedObjects.slice(outlinedIndex + 1)
      ]
    } else {
      const selectedMesh = selected.find((s) => s.uuid === mesh.userData.uuid)
      if (!selectedMesh) {
        const outlinedIndex = selectionOutlinePass!.selectedObjects.findIndex(
          (s) => s.userData.uuid === mesh.userData.uuid
        )
        selectionOutlinePass!.selectedObjects = [
          ...selectionOutlinePass!.selectedObjects.slice(0, outlinedIndex),
          ...selectionOutlinePass!.selectedObjects.slice(outlinedIndex + 1)
        ]
      }
    }
  }

  /**
   * Highlight
   * @param uuid Mesh uuid
   */
  const highlight = (uuid?: string): void => {
    if (uuid === highlighted?.uuid) return
    else unhighlight()

    const mesh = findObject(selectionPart!, uuid)
    if (mesh) {
      if (mesh.type === 'Mesh') {
      }
      addOutlineOn(mesh)
    }

    // if (mesh && mesh.material) {
    //   highlighted = { uuid: mesh.userData.uuid, number: mesh.userData.number }
    //   addOutlineOn(mesh)
    //   mesh.material.color = highlightColor
    // }
  }

  /**
   * Unhighlight
   */
  const unhighlight = (): void => {
    const mesh = findObject(selectionPart!, highlighted?.uuid)

    if (mesh && mesh.material) {
      removeOutlineOn(mesh)
      // Check selection
      const index = selected.findIndex((s) => s.uuid === mesh.userData.uuid)
      // Unhighlight
      mesh.material.color =
        index === -1 ? mesh.material.originalColor : selectColor
    }

    highlighted = null
  }

  /**
   * Mouse down
   */
  const mouseDown = (): void => {
    if (highlighted)
      mouseDownEvent(selectionPart!, highlighted.uuid, highlighted.number)
  }

  /**
   * Select
   * @param uuid Mesh uuid
   */
  const select = (uuid: string): void => {
    const mesh = findObject(selectionPart!, uuid)
    if (mesh && mesh.material) {
      selected.push({ uuid, number: mesh.userData.number })
      addOutlineOn(mesh, true)
      mesh.material.color = selectColor
    }
  }

  /**
   * Unselect
   * @param uuid Mesh uuid
   */
  const unselect = (uuid: string): void => {
    const mesh = findObject(selectionPart!, uuid)

    const index = selected.findIndex((s) => s.uuid === uuid)
    if (index !== -1)
      selected = [...selected.slice(0, index), ...selected.slice(index + 1)]

    if (mesh && mesh.material) {
      removeOutlineOn(mesh, true)
      mesh.material.color = mesh.material.originalColor
    }
  }

  return { load }
}

export { PartLoader }
