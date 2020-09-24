/** @module src/lib/three/loaders/PartLoader */

import {
  Box3,
  BufferGeometryLoader,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector2,
  Vector3
} from 'three/build/three.module'

// TODO edges not supported for now

/**
 * PartLoader
 */
const PartLoader = () => {
  // Solid color
  const solidColor = new Color('gray')
  // Face color
  const faceColor = new Color('gray')
  // Edge color
  // const edgeColor = new Color('black')
  // Highlight color
  const highlightColor = new Color('#0096C7')
  // Select colo
  const selectColor = new Color('#c73100')

  /**
   * Load
   * @param {Object} part Part
   * @param {boolean} transparent Transparent
   * @param {Object} clippingPlane Clipping plane
   */
  const load = (part, transparent, clippingPlane) => {
    const object = new Group()
    object.type = 'Part'

    // Solids
    const solids = new Group()
    part.solids?.forEach((solid) => {
      const mesh = loadElement(solid, solidColor, transparent, clippingPlane)
      mesh.visible = false
      solids.add(mesh)
    })
    object.add(solids)

    // Faces
    const faces = new Group()
    part.faces?.forEach((face) => {
      const mesh = loadElement(face, faceColor, transparent, clippingPlane)
      mesh.visible = true
      faces.add(mesh)
    })
    object.add(faces)

    // Edges
    const edges = new Group()
    object.add(edges)

    object.boundingBox = computeBoundingBox(object)
    object.setTransparent = (transp) => setTransparent(object, transp)
    object.startSelection = (renderer, camera, type) =>
      startSelection(object, renderer, camera, type)
    object.stopSelection = () => stopSelection(object)
    object.highlight = highlight
    object.unhighlight = unhighlight
    object.select = select
    object.unselect = unselect

    return object
  }

  /**
   * Load element
   * @param {Object} element Element
   * @param {Object} color Color
   * @param {boolean} transparent Transparent
   * @param {Object} clippingPlane Clipping plane
   */
  const loadElement = (element, color, transparent, clippingPlane) => {
    const loader = new BufferGeometryLoader()
    const geometry = loader.parse(element.buffer)
    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    const material = new MeshStandardMaterial({
      color: color,
      side: DoubleSide,
      transparent: transparent,
      opacity: transparent ? 0.5 : 1,
      depthWrite: !transparent,
      clippingPlanes: [clippingPlane]
    })

    const mesh = new Mesh(geometry, material)
    mesh.uuid = element.buffer.uuid

    return mesh
  }

  /**
   * Compute bounding box
   * @param {Object} part Part
   */
  const computeBoundingBox = (part) => {
    const box = new Box3()

    // Solids
    const solids = part.children[0]
    solids.children?.forEach((solid) => {
      const childBox = solid.geometry.boundingBox
      const min = new Vector3(
        Math.min(box.min.x, childBox.min.x),
        Math.min(box.min.y, childBox.min.y),
        Math.min(box.min.z, childBox.min.z)
      )
      const max = new Vector3(
        Math.max(box.max.x, childBox.max.x),
        Math.max(box.max.y, childBox.max.y),
        Math.max(box.max.z, childBox.max.z)
      )
      box.set(min, max)
    })

    return box
  }

  /**
   * Set transparent
   * @param {Object} part Part
   * @param {boolean} transparent Transparent
   */
  const setTransparent = (part, transparent) => {
    part.children.forEach((group) => {
      group.children?.forEach((child) => {
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
      solid.visible = true
    })
  }

  /**
   * Set faces visible
   * @param {Object} part Part
   * @param {boolean} visible Visible
   */
  const setFacesVisible = (part, visible) => {
    part.children[1].children.forEach((face) => {
      face.visible = true
    })
  }

  // highlight / selection Variables
  let raycaster = new Raycaster()
  let selectionPart = null
  let selectionRenderer = null
  let selectionCamera = null
  let selectionType = null
  let currentlyHighlighted = {}
  let previouslyHighlighted = {}
  const selection = []

  /**
   *
   * @param {Object} part Part
   * @param {Object} renderer Renderer
   * @param {Object} camera Camera
   * @param {string} type Type (solid, face)
   */
  const startSelection = (part, renderer, camera, type) => {
    selectionPart = part
    selectionRenderer = renderer
    selectionCamera = camera
    currentlyHighlighted = {}
    previouslyHighlighted = {}
    selection.length = 0

    if (type === 'solid') {
      setSolidsVisible(part, true)
      setFacesVisible(part, false)

      selectionType = 0
    } else if (type === 'face') {
      setSolidsVisible(part, false)
      setFacesVisible(part, true)

      selectionType = 1
    }

    selectionRenderer.domElement.addEventListener('mousemove', mouseMove)
    selectionRenderer.domElement.addEventListener('mousedown', mouseDown)
  }

  /**
   * Stop selection
   * @param {Object} part Part
   */
  const stopSelection = (part) => {
    selectionRenderer?.domElement.removeEventListener('mousemove', mouseMove)
    selectionRenderer?.domElement.removeEventListener('mousedown', mouseDown)

    selectionPart = null
    selectionRenderer = null
    selectionCamera = null
    selectionType = null

    setSolidsVisible(part, false)
    setFacesVisible(part, true)

    unhighlight(currentlyHighlighted)
    unhighlight(previouslyHighlighted)
    currentlyHighlighted = {}
    previouslyHighlighted = {}

    selection.forEach((s) => unselect(s))
    selection.length = 0
  }

  /**
   *  Global coordinates to local [-1, 1]^2
   * @param {Object} event Event
   */
  const globalToLocal = ({ X, Y }) => {
    const parentSize = new Vector2()
    selectionRenderer.getSize(parentSize)

    const mouse = new Vector2()
    mouse.x = (X / parentSize.x) * 2 - 1
    mouse.y = -(Y / parentSize.y) * 2 + 1

    return mouse
  }

  /**
   * Mouse move
   * @param {Object} event Event
   */
  const mouseMove = (event) => {
    const mouse = globalToLocal({ X: event.clientX, Y: event.clientY })
    raycaster.setFromCamera(mouse, selectionCamera)
    const intersects = raycaster.intersectObjects(
      selectionPart.children[selectionType].children
    )
    if (intersects.length > 0) {
      currentlyHighlighted = intersects[0].object
      highlight(currentlyHighlighted)
      if (currentlyHighlighted.uuid !== previouslyHighlighted.uuid)
        unhighlight(previouslyHighlighted)
      previouslyHighlighted = currentlyHighlighted
    } else {
      unhighlight(currentlyHighlighted)
      currentlyHighlighted = {}
    }
  }

  /**
   * Highlight
   * @param {Object} mesh Mesh
   */
  const highlight = (mesh) => {
    mesh && mesh.material && (mesh.material.color = highlightColor)
  }

  /**
   * Unhighlight
   * @param {Object} mesh Mesh
   */
  const unhighlight = (mesh) => {
    if (mesh && mesh.material) {
      const index = selection.findIndex((m) => m === mesh)
      mesh.material.color = index === -1 ? solidColor : selectColor
    }
  }

  /**
   * Mouse down
   */
  const mouseDown = () => {
    const index = selection.findIndex((p) => p === currentlyHighlighted)
    if (index === -1) {
      selection.push(currentlyHighlighted)
      select(currentlyHighlighted)
    } else {
      selection.splice(index, 1)
      unselect(currentlyHighlighted)
    }
  }

  /**
   * Select
   * @param {Object} mesh Mesh
   */
  const select = (mesh) => {
    mesh && mesh.material && (mesh.material.color = selectColor)
  }

  /**
   * Unselect
   * @param {Object} mesh Mesh
   */
  const unselect = (mesh) => {
    mesh && mesh.material && (mesh.material.color = solidColor)
  }

  return { load }
}

export { PartLoader }
