/** @module Lib.Three.Loaders.PartLoader */

import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
  WebGLRenderer,
  WireframeGeometry
} from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { Lut } from 'three/examples/jsm/math/Lut'

import { IGeometryPart } from '@/lib/index.d'
import { TGeometrySummary } from '@/database/geometry/get'

export interface IPartLoader {
  load: (
    part: IGeometryPart,
    transparent: boolean,
    displayMesh: boolean,
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
    lut?: Lut
  }
}

export interface IPartObject extends Object3D {
  children: (IPartObject | IPartMesh)[]
}

export type ISelectionType = 'solids' | 'faces' | 'edges' | 'point'

export interface IPart extends Object3D {
  type: 'Part'
  uuid: string
  boundingBox: Box3
  children: (IPartObject | IPartMesh)[]
  dispose: () => void
  setTransparent: (transparent: boolean) => void
  setDisplayMesh: (displayMesh: boolean) => void
  startSelection: (
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    type: ISelectionType
  ) => void
  stopSelection: () => void
  getHighlighted: () => { uuid: string; label: number | string } | null
  getSelected: () => { uuid: string; label: number | string }[]
  highlight: (uuid?: string) => void
  unhighlight: () => void
  select: (uuid: string) => void
  unselect: (uuid: string) => void
}

/**
 * Load mesh
 * @param object Object
 * @param clippingPlane Clipping plane
 */
const loadMesh = (object: IPart, clippingPlane: Plane): void => {
  object.traverse((child) => {
    if (child.type === 'Mesh') {
      const mesh = child as IPartMesh

      // Wireframe
      const geometry = new WireframeGeometry(mesh.geometry)
      const material = new LineBasicMaterial({
        color: mesh.material.color,
        linewidth: 1
      })
      const wireframe = new LineSegments(geometry, material)

      mesh.add(wireframe)

      mesh.material.visible = false
      mesh.material.clippingPlanes = [clippingPlane]
    }
  })
}

/**
 * Load result
 * @param object Object
 * @param clippingPlane Plane
 */
const loadResult = (object: IPart, clippingPlane: Plane): void => {
  object.traverse((child) => {
    if (child.type === 'Mesh' || child.type === 'Line') {
      const mesh = child as IPartMesh
      const data = mesh.geometry.getAttribute('data') as BufferAttribute
      if (data) {
        let min = (data.array as number[]).reduce(
          (m, currentValue) => Math.min(m, currentValue),
          data.array[0]
        )
        let max = (data.array as number[]).reduce(
          (m, currentValue) => Math.max(m, currentValue),
          data.array[0]
        )

        if (min === max) {
          min = min - 1
          max = max + 1
        }

        const lut = new Lut()
        lut.setMin(min)
        lut.setMax(max)

        mesh.userData = {
          ...mesh.userData,
          lut
        }
      }

      if (child.type === 'Mesh') {
        // Wireframe
        const geometry = new WireframeGeometry(mesh.geometry)
        const material = new LineBasicMaterial({
          linewidth: 1
        })
        const wireframe = new LineSegments(geometry, material)

        mesh.add(wireframe)
      }

      mesh.material.vertexColors = true
      mesh.material.clippingPlanes = [clippingPlane]
    }
  })
}

/**
 * Load geometry
 * @param object Object
 * @param clippingPlane Clipping plane
 */
const loadGeometry = (object: IPart, clippingPlane: Plane): void => {
  object.traverse((child) => {
    if (child.type === 'Mesh') {
      const mesh = child as IPartMesh
      mesh.material.clippingPlanes = [clippingPlane]
      mesh.material.originalColor = mesh.material.color
    }
  })
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
    label?: number,
    point?: Vector3
  ) => void,
  mouseDownEvent: (part: IPart, uuid: string, label: number) => void
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
    part: IGeometryPart,
    transparent: boolean,
    displayMesh: boolean,
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
    object.uuid = part.summary.uuid
    object.children = scene.children
    object.userData = scene.userData

    // Set material
    if (part.summary.type === 'mesh') loadMesh(object, clippingPlane)
    else if (part.summary.type === 'result') loadResult(object, clippingPlane)
    else if (
      part.summary.type === 'geometry3D' ||
      part.summary.type === 'geometry2D'
    )
      loadGeometry(object, clippingPlane)

    // Transparency
    setTransparent(object, transparent)

    // Display mesh
    setDisplayMesh(object, displayMesh)

    object.boundingBox = computeBoundingBox(object)
    object.dispose = () => dispose(object)

    object.setTransparent = (transp: boolean) => setTransparent(object, transp)
    object.setDisplayMesh = (disp: boolean) => setDisplayMesh(object, disp)

    object.startSelection = (
      renderer: WebGLRenderer,
      camera: PerspectiveCamera,
      type: ISelectionType
    ) => startSelection(object, renderer, camera, type)
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

  /**
   * Set display mesh
   * @param part Part
   * @param displayMesh Display mesh
   */
  const setDisplayMesh = (part: IPart, displayMesh: boolean): void => {
    if (part.userData.type !== 'result') return
    part.traverse((child) => {
      child.traverse((subChild) => {
        if (subChild.type === 'LineSegments') {
          const mesh = subChild as IPartMesh
          mesh.visible = displayMesh
        }
      })
    })
  }

  // highlight / selection Variables
  let raycaster = new Raycaster()
  let selectionPart: IPart | null = null
  let selectionType: ISelectionType | null = null
  let selectionRenderer: WebGLRenderer | null = null
  let selectionCamera: PerspectiveCamera | null = null
  let highlighted: { uuid: string; label: number } | null = null
  let selected: { uuid: string; label: number }[] = []

  /**
   *
   * @param part Part
   * @param renderer Renderer
   * @param camera Camera
   * @param type Type (solid, face)
   */
  const startSelection = (
    part: IPart,
    renderer: WebGLRenderer,
    camera: PerspectiveCamera,
    type: ISelectionType
  ): void => {
    selectionPart = part
    selectionType = type
    selectionRenderer = renderer
    selectionCamera = camera
    highlighted = null
    selected.length = 0

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

    unhighlight()
    highlighted = null

    selected.forEach((s) => {
      unselect(s.uuid)
    })
    selected.length = 0

    selectionType = null
    selectionPart = null
    selectionRenderer = null
    selectionCamera = null
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
      if (child.userData.uuid === uuid) found = child
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
   * Solids select
   */
  const solidsSelect = () => {
    const intersects = raycaster.intersectObject(selectionPart!, true)
    if (intersects.length) {
      const intersect = intersects[0].object
      const parent = intersect.parent
      if (parent)
        // On a face
        mouseMoveEvent(
          selectionPart!,
          parent.userData.uuid,
          parent.userData.label
        )
    } else mouseMoveEvent(selectionPart!)
  }

  /**
   * Faces select
   */
  const facesSelect = () => {
    const summary = selectionPart!.userData as TGeometrySummary

    let intersects
    if (summary.dimension === 2) {
      intersects = raycaster.intersectObject(selectionPart!, true)
      if (intersects.length) {
        const intersect = intersects[0].object
        const parent = intersect.parent
        if (parent?.type === 'Mesh')
          // On an edge
          mouseMoveEvent(
            selectionPart!,
            parent.userData.uuid,
            parent.userData.label
          )
        // On a face
        else
          mouseMoveEvent(
            selectionPart!,
            intersect.userData.uuid,
            intersect.userData.label
          )
      } else mouseMoveEvent(selectionPart!)
    } else {
      intersects = raycaster.intersectObject(selectionPart!, true)
      if (intersects.length) {
        const intersect = intersects[0].object
        mouseMoveEvent(
          selectionPart!,
          intersect.userData.uuid,
          intersect.userData.label
        )
      } else mouseMoveEvent(selectionPart!)
    }
  }

  /**
   * Edges select
   */
  const edgesSelect = () => {
    const summary = selectionPart!.userData as TGeometrySummary

    let intersects
    const edges = summary.edges
    intersects = raycaster.intersectObject(selectionPart!, true)
    if (intersects.length) {
      const intersect = intersects[0].object
      const edge = edges?.find((e) => e.uuid === intersect.userData.uuid)
      if (edge)
        // On an edge
        mouseMoveEvent(
          selectionPart!,
          intersect.userData.uuid,
          intersect.userData.label
        )
      else mouseMoveEvent(selectionPart!)
    } else mouseMoveEvent(selectionPart!)
  }

  /**
   * Point select
   */
  const pointSelect = () => {
    const intersects = raycaster.intersectObject(selectionPart!, true)
    if (intersects.length) {
      const intersect = intersects[0]

      mouseMoveEvent(selectionPart!, undefined, undefined, intersect.point)
    } else mouseMoveEvent(selectionPart!)
  }

  /**
   * Mouse move
   * @param event Event
   */
  const mouseMove = (event: MouseEvent): void => {
    const mouse = globalToLocal(event)
    raycaster.setFromCamera(mouse, selectionCamera!)

    switch (selectionType) {
      case 'solids':
        solidsSelect()
        break
      case 'faces':
        facesSelect()
        break
      case 'edges':
        edgesSelect()
        break
      case 'point':
        pointSelect()
        break
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
      highlighted = {
        uuid: mesh.userData.uuid,
        label: mesh.userData.label
      }

      // Highlight
      if (mesh.type === 'Mesh') {
        const partMesh = mesh as IPartMesh
        partMesh.material.color = highlightColor
      } else {
        // mesh.type === 'Object3D'
        const partObject = mesh as IPartObject
        partObject.traverse((child) => {
          if (child.type === 'Mesh') {
            const subMesh = child as IPartMesh
            subMesh.material.color = highlightColor
          }
        })
      }
    }
  }

  /**
   * Unhighlight
   */
  const unhighlight = (): void => {
    const mesh = findObject(selectionPart!, highlighted?.uuid)
    highlighted = null

    if (!mesh) return

    // Check selection
    const index = selected.findIndex((s) => s.uuid === mesh.userData.uuid)
    // Unhighlight
    if (mesh.type === 'Mesh') {
      const partMesh = mesh as IPartMesh
      partMesh.material.color =
        index === -1 ? partMesh.material.originalColor : selectColor
    } else {
      //mesh.type === 'Object3D'
      const partObject = mesh as IPartObject
      partObject.traverse((child) => {
        if (child.type === 'Mesh') {
          const subMesh = child as IPartMesh
          subMesh.material.color =
            index === -1 ? subMesh.material.originalColor : selectColor
        }
      })
    }
  }

  /**
   * Mouse down
   */
  const mouseDown = (): void => {
    if (highlighted)
      mouseDownEvent(selectionPart!, highlighted.uuid, highlighted.label)
  }

  /**
   * Select
   * @param uuid Mesh uuid
   */
  const select = (uuid: string): void => {
    const mesh = findObject(selectionPart!, uuid)
    if (mesh) {
      selected.push({ uuid, label: mesh.userData.label })

      // Select
      if (mesh.type === 'Mesh') {
        const partMesh = mesh as IPartMesh
        partMesh.material.color = selectColor
      } else {
        //mesh.type === 'Object3D'
        const partObject = mesh as IPartObject
        partObject.traverse((child) => {
          if (child.type === 'Mesh') {
            const subMesh = child as IPartMesh
            subMesh.material.color = selectColor
          }
        })
      }
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

    if (mesh) {
      // Unselect
      if (mesh.type === 'Mesh') {
        const partMesh = mesh as IPartMesh
        partMesh.material.color = partMesh.material.originalColor
      } else {
        //mesh.type === 'Object3D'
        const partObject = mesh as IPartObject
        partObject.traverse((child) => {
          if (child.type === 'Mesh') {
            const subMesh = child as IPartMesh
            subMesh.material.color = subMesh.material.originalColor
          }
        })
      }
    }
  }

  return { load }
}

export { PartLoader }
