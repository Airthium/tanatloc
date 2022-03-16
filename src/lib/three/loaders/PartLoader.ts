/** @module Lib.Three.Loaders.PartLoader */

import {
  Box3,
  BufferGeometry,
  Color,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { Lut } from 'three/examples/jsm/math/Lut'

export interface IPartLoader {
  load: (
    part: { uuid?: string; buffer: Buffer },
    transparent: boolean,
    clippingPlane: Plane
  ) => Promise<IPart>
}

export interface IPartChildChild extends Object3D {
  geometry: BufferGeometry
  material: MeshStandardMaterial & { originalColor: Color }
  userData: {
    uuid: string
    number: string | number
    lut?: Lut
  }
  visible: boolean
}

export interface IPartChild extends Object3D {
  children: IPartChildChild[]
}

export interface IPart extends Object3D {
  type: 'Part'
  uuid: string
  boundingBox: Box3
  children: IPartChild[]
  dispose: () => void
  setTransparent: (transparent: boolean) => void
  startSelection: (
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    outlinePass: OutlinePass,
    type: string
  ) => void
  stopSelection: () => void
  getHighlighted: () => { uuid: string; number: number | string }
  getSelected: () => { uuid: string; number: number | string }[]
  highlight: (uuid: string) => void
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
  mouseMoveEvent: (
    part: IPart,
    uuid?: string,
    number?: number | string
  ) => void,
  mouseDownEvent: (part: IPart, uuid: string, number: number | string) => void
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
    dracoLoader.preload()
    loader.setDRACOLoader(dracoLoader)

    const gltf = (await new Promise((resolve, reject) => {
      loader.load(
        url,
        (glb) => resolve(glb),
        () => {
          /* nothing to do here */
        },
        (err) => reject(err)
      )
    })) as any

    const object = gltf.scene.children[0] as IPart
    object.type = 'Part'

    object.uuid = part.uuid

    // Set original colors
    const solids = object.children[0]
    if (solids)
      for (const solid of solids.children) {
        solid.material.originalColor = solid.material.color
        solid.material.roughness = 0.5
        solid.material.clippingPlanes = [clippingPlane]
        solid.visible = false
      }

    const faces = object.children[1]
    if (faces)
      for (const face of faces.children) {
        face.material.originalColor = face.material.color
        face.material.roughness = 0.5
        face.material.clippingPlanes = [clippingPlane]
      }

    const edges = object.children[2]
    if (edges)
      for (const edge of edges.children) {
        edge.material.originalColor = edge.material.color
        edge.material.roughness = 0.5
        edge.material.clippingPlanes = [clippingPlane]
      }

    // Transparency
    setTransparent(object, transparent)

    object.boundingBox = computeBoundingBox(object)
    object.dispose = () => dispose(object)

    object.setTransparent = (transp: boolean) => setTransparent(object, transp)

    object.startSelection = (
      renderer: WebGLRenderer,
      camera: PerspectiveCamera,
      outlinePass: OutlinePass,
      type: string
    ) => startSelection(object, renderer, camera, outlinePass, type)
    object.stopSelection = () => stopSelection(object)
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

    // Solids
    const solids = part.children[0]
    solids.children?.forEach((solid) => {
      const childBox = solid.geometry.boundingBox
      mergeBox(box, childBox)
    })

    if (box.isEmpty()) {
      // Try faces
      const faces = part.children[1]
      faces.children?.forEach((face) => {
        mergeBox(box, face.geometry.boundingBox)
      })
    }

    if (box.isEmpty()) {
      // Try edges
      const edges = part.children[2]
      edges.children?.forEach((edge) => {
        mergeBox(box, edge.geometry.boundingBox)
      })
    }

    return box
  }

  /**
   * Merge boxes
   * @param box1 Box
   * @param box2 Box
   */
  const mergeBox = (box1: Box3, box2: Box3): void => {
    const min = new Vector3(
      Math.min(box1.min.x, box2.min.x),
      Math.min(box1.min.y, box2.min.y),
      Math.min(box1.min.z, box2.min.z)
    )
    const max = new Vector3(
      Math.max(box1.max.x, box2.max.x),
      Math.max(box1.max.y, box2.max.y),
      Math.max(box1.max.z, box2.max.z)
    )
    box1.set(min, max)
  }

  /**
   * Dispose
   * @param part Part
   */
  const dispose = (part: IPart): void => {
    part.children.forEach((group) => {
      group.children.forEach((child) => {
        child.geometry.dispose()
        child.material.dispose()
      })
    })
  }

  /**
   * Set transparent
   * @param part Part
   * @param transparent Transparent
   */
  const setTransparent = (part: IPart, transparent: boolean): void => {
    part.children.forEach((group) => {
      group.children &&
        group.children.forEach((child) => {
          child.material.transparent = transparent
          child.material.opacity = transparent ? 0.5 : 1
          child.material.depthWrite = !transparent
        })
    })
  }

  /**
   * Set solids visible
   * @param part Part
   * @param visible Visible
   */
  const setSolidsVisible = (part: IPart, visible: boolean): void => {
    part.children[0].children.forEach((solid) => {
      solid.visible = visible
    })
  }

  /**
   * Set faces visible
   * @param part Part
   * @param visible Visible
   */
  const setFacesVisible = (part: IPart, visible: boolean): void => {
    part.children[1].children.forEach((face) => {
      face.visible = visible
    })
  }

  /**
   * Set edges visible
   * @param part Part
   * @param visible Visible
   */
  const setEdgesVisible = (part: IPart, visible: boolean): void => {
    part.children[2].children.forEach((edge) => {
      edge.visible = visible
    })
  }

  // highlight / selection Variables
  let raycaster = new Raycaster()
  let selectionPart: IPart = null
  let selectionRenderer: WebGLRenderer = null
  let selectionCamera: PerspectiveCamera = null
  let selectionOutlinePass: OutlinePass = null
  let selectionType: number = null
  let highlighted: { uuid: string; number: number | string } = null
  let selected: { uuid: string; number: number | string }[] = []

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
    type: string
  ): void => {
    selectionPart = part
    selectionRenderer = renderer
    selectionCamera = camera
    selectionOutlinePass = outlinePass
    selectionOutlinePass.selectedObjects = []
    highlighted = null
    selected.length = 0

    if (type === 'solids') {
      setSolidsVisible(part, true)
      setFacesVisible(part, false)
      setEdgesVisible(part, false)

      selectionType = 0
    } else if (type === 'faces') {
      setSolidsVisible(part, false)
      setFacesVisible(part, true)
      setEdgesVisible(part, false)

      selectionType = 1
    } else if (type === 'edges') {
      setSolidsVisible(part, false)
      setFacesVisible(part, false)
      setEdgesVisible(part, true)

      selectionType = 2
    }

    selectionRenderer.domElement.addEventListener('pointermove', mouseMove)
    selectionRenderer.domElement.addEventListener('pointerdown', mouseDown)
  }

  /**
   * Stop selection
   * @param part Part
   */
  const stopSelection = (part: IPart): void => {
    selectionRenderer &&
      selectionRenderer.domElement.removeEventListener('pointermove', mouseMove)
    selectionRenderer &&
      selectionRenderer.domElement.removeEventListener('pointerdown', mouseDown)

    selectionType = null

    setSolidsVisible(part, false)
    setFacesVisible(part, true)

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
    uuid: string
  ): IPart['children'][0]['children'][0] => {
    if (!part) return

    // Search in solids
    const solids = part.children[0]
    for (const solid of solids.children) {
      if (solid.userData.uuid === uuid) return solid
    }

    // Search in faces
    const faces = part.children[1]
    for (const face of faces.children) {
      if (face.userData.uuid === uuid) return face
    }

    // Search in edges
    const edges = part.children[2]
    for (const edge of edges.children) {
      if (edge.userData.uuid === uuid) return edge
    }
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
  const mouseMove = (event: MouseEvent): void => {
    const mouse = globalToLocal(event)
    raycaster.setFromCamera(mouse, selectionCamera)
    const intersects = raycaster.intersectObjects(
      selectionPart.children[selectionType].children
    )

    if (intersects.length)
      mouseMoveEvent(
        selectionPart,
        intersects[0].object.userData.uuid,
        intersects[0].object.userData.number
      )
    else mouseMoveEvent(selectionPart)
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
      const alreadyOutlined = selectionOutlinePass.selectedObjects.find(
        (s: IPart['children'][0]['children'][0]) =>
          s.userData.uuid === mesh.userData.uuid
      )
      if (!alreadyOutlined) selectionOutlinePass.selectedObjects.push(mesh)
    } else {
      const alreadySelected = selected.find(
        (s) => s.uuid === mesh.userData.uuid
      )
      if (!alreadySelected) selectionOutlinePass.selectedObjects.push(mesh)
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
      const outlinedIndex = selectionOutlinePass.selectedObjects.findIndex(
        (s: IPart['children'][0]['children'][0]) =>
          s.userData.uuid === mesh.userData.uuid
      )
      selectionOutlinePass.selectedObjects = [
        ...selectionOutlinePass.selectedObjects.slice(0, outlinedIndex),
        ...selectionOutlinePass.selectedObjects.slice(outlinedIndex + 1)
      ]
    } else {
      const selectedMesh = selected.find((s) => s.uuid === mesh.userData.uuid)
      if (!selectedMesh) {
        const outlinedIndex = selectionOutlinePass.selectedObjects.findIndex(
          (s: IPart['children'][0]['children'][0]) =>
            s.userData.uuid === mesh.userData.uuid
        )
        selectionOutlinePass.selectedObjects = [
          ...selectionOutlinePass.selectedObjects.slice(0, outlinedIndex),
          ...selectionOutlinePass.selectedObjects.slice(outlinedIndex + 1)
        ]
      }
    }
  }

  /**
   * Highlight
   * @param uuid Mesh uuid
   */
  const highlight = (uuid: string): void => {
    if (uuid === highlighted?.uuid) return
    else unhighlight()

    const mesh = findObject(selectionPart, uuid)
    if (mesh && mesh.material) {
      highlighted = { uuid: mesh.userData.uuid, number: mesh.userData.number }
      addOutlineOn(mesh)
      mesh.material.color = highlightColor
    }
  }

  /**
   * Unhighlight
   */
  const unhighlight = (): void => {
    const mesh = findObject(selectionPart, highlighted?.uuid)

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
      mouseDownEvent(selectionPart, highlighted.uuid, highlighted.number)
  }

  /**
   * Select
   * @param uuid Mesh uuid
   */
  const select = (uuid: string): void => {
    const mesh = findObject(selectionPart, uuid)
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
    const mesh = findObject(selectionPart, uuid)

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
