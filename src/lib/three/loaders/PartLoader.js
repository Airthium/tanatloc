/** @module Lib.Three.Loaders */

import { Box3, Color, Raycaster, Vector2, Vector3 } from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

/**
 * PartLoader
 * @memberof Lib.Three.Loaders
 * @param {Function} mouseMoveEvent Mouse move event
 * @param {Function} mouseDownEvent Mouse down event
 */
const PartLoader = (mouseMoveEvent, mouseDownEvent) => {
  // Highlight color
  const highlightColor = new Color('#FAD114')
  // Select colo
  const selectColor = new Color('#c73100')

  /**
   * Load
   * @param {Object} part Part
   * @param {boolean} transparent Transparent
   * @param {Object} clippingPlane Clipping plane
   */
  const load = async (part, transparent, clippingPlane) => {
    const blob = new Blob([Buffer.from(part.buffer)])
    const url = URL.createObjectURL(blob)

    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/three/libs/draco/')
    dracoLoader.preload()
    loader.setDRACOLoader(dracoLoader)

    const gltf = await new Promise((resolve, reject) => {
      loader.load(
        url,
        (glb) => resolve(glb),
        (progress) => console.info(progress),
        (err) => console.error(err)
      )
    })

    const object = gltf.scene.children[0]
    object.type = 'Part'

    object.uuid = part.uuid

    // Set original colors
    const solids = object.children[0]
    for (const solid of solids.children) {
      solid.material.originalColor = solid.material.color
      solid.material.clippingPlanes = [clippingPlane]
    }
    const faces = object.children[1]
    for (const face of faces.children) {
      face.material.originalColor = face.material.color
      face.material.clippingPlanes = [clippingPlane]
    }

    // Transparency
    setTransparent(object, transparent)

    object.boundingBox = computeBoundingBox(object)
    object.dispose = () => dispose(object)

    object.setTransparent = (transp) => setTransparent(object, transp)

    object.startSelection = (renderer, camera, outlinePass, type) =>
      startSelection(object, renderer, camera, outlinePass, type)
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
   * @param {Object} part Part
   */
  const computeBoundingBox = (part) => {
    const box = new Box3()

    // Solids
    const solids = part.children[0]
    solids.children &&
      solids.children.forEach((solid) => {
        const childBox = solid.geometry.boundingBox
        mergeBox(box, childBox)
      })

    if (box.isEmpty()) {
      // Try faces
      const faces = part.children[1]
      faces.children &&
        faces.children.forEach((face) => {
          let childBox
          childBox = face.geometry.boundingBox
          mergeBox(box, childBox)
        })
    }

    return box
  }

  /**
   * Merge boxes
   * @param {Object} box1 Box
   * @param {Object} box2 Box
   */
  const mergeBox = (box1, box2) => {
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
   * @param {Object} part Part
   */
  const dispose = (part) => {
    part.children.forEach((group) => {
      group.children.forEach((child) => {
        child.geometry.dispose()
        child.material.dispose()
      })
    })
  }

  /**
   * Set transparent
   * @param {Object} part Part
   * @param {boolean} transparent Transparent
   */
  const setTransparent = (part, transparent) => {
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
   * @param {Object} part Part
   * @param {boolean} visible Visible
   */
  const setSolidsVisible = (part, visible) => {
    part.children[0].children.forEach((solid) => {
      solid.visible = visible
    })
  }

  /**
   * Set faces visible
   * @param {Object} part Part
   * @param {boolean} visible Visible
   */
  const setFacesVisible = (part, visible) => {
    part.children[1].children.forEach((face) => {
      face.visible = visible
    })
  }

  // highlight / selection Variables
  let raycaster = new Raycaster()
  let selectionPart = null
  let selectionRenderer = null
  let selectionCamera = null
  let selectionOutlinePass = null
  let selectionType = null
  let highlighted = null
  let selected = []

  /**
   *
   * @param {Object} part Part
   * @param {Object} renderer Renderer
   * @param {Object} camera Camera
   * @param {Object} outlinePass OutlinePass
   * @param {string} type Type (solid, face)
   */
  const startSelection = (part, renderer, camera, outlinePass, type) => {
    selectionPart = part
    selectionRenderer = renderer
    selectionCamera = camera
    selectionOutlinePass = outlinePass
    highlighted = null
    selected.length = 0

    if (type === 'solids') {
      setSolidsVisible(part, true)
      setFacesVisible(part, false)

      selectionType = 0
    } else if (type === 'faces') {
      setSolidsVisible(part, false)
      setFacesVisible(part, true)

      selectionType = 1
    }

    selectionRenderer.domElement.addEventListener('pointermove', mouseMove)
    selectionRenderer.domElement.addEventListener('pointerdown', mouseDown)
  }

  /**
   * Stop selection
   * @param {Object} part Part
   */
  const stopSelection = (part) => {
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
      unselect(s)
    })
    selected.length = 0

    selectionPart = null
    selectionRenderer = null
    selectionCamera = null
    selectionOutlinePass = null
  }

  /**
   * Find object in part
   * @param {Object} part Part
   * @param {string} uuid UUID
   */
  const findObject = (part, uuid) => {
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
  }

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param {Object} event Event
   */
  const globalToLocal = (event) => {
    const rect = event.target.getBoundingClientRect()

    const X = event.clientX - rect.left
    const Y = event.clientY - rect.top

    const mouse = new Vector2()
    mouse.x = (X / rect.width) * 2 - 1
    mouse.y = -(Y / rect.height) * 2 + 1

    return mouse
  }

  /**
   * Mouse move
   * @param {Object} event Event
   */
  const mouseMove = (event) => {
    const mouse = globalToLocal(event)
    raycaster.setFromCamera(mouse, selectionCamera)
    const intersects = raycaster.intersectObjects(
      selectionPart.children[selectionType].children
    )

    if (intersects.length)
      mouseMoveEvent(selectionPart, intersects[0].object.userData.uuid)
    else mouseMoveEvent(selectionPart)
  }

  /**
   * Highlight
   * @param {Object} uuid Mesh uuid
   */
  const highlight = (uuid) => {
    if (uuid === highlighted) return
    else unhighlight()

    const mesh = findObject(selectionPart, uuid)
    if (mesh && mesh.material) {
      highlighted = mesh.userData.uuid
      selectionOutlinePass.selectedObjects = [mesh]
      mesh.material.color = highlightColor
    }
  }

  /**
   * Unhighlight
   */
  const unhighlight = () => {
    const mesh = findObject(selectionPart, highlighted)

    if (mesh && mesh.material) {
      selectionOutlinePass.selectedObjects = []
      // Check selection
      const index = selected.findIndex((m) => m === mesh.userData.uuid)
      // Unhighlight
      mesh.material.color =
        index === -1 ? mesh.material.originalColor : selectColor
    }

    highlighted = null
  }

  /**
   * Mouse down
   */
  const mouseDown = () => {
    if (highlighted) mouseDownEvent(selectionPart, highlighted)
  }

  /**
   * Select
   * @param {Object} uuid Mesh uuid
   */
  const select = (uuid) => {
    const mesh = findObject(selectionPart, uuid)
    if (mesh && mesh.material) {
      selected.push(uuid)
      mesh.material.color = selectColor
    }
  }

  /**
   * Unselect
   * @param {Object} uuid Mesh uuid
   */
  const unselect = (uuid) => {
    const mesh = findObject(selectionPart, uuid)

    if (mesh && mesh.material) {
      mesh.material.color = mesh.material.originalColor
    }

    const index = selected.findIndex((s) => s === uuid)
    if (index !== -1)
      selected = [...selected.slice(0, index), ...selected.slice(index + 1)]
  }

  return { load }
}

export { PartLoader }
