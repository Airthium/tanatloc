/** @module src/lib/three/loaders/PartLoader */

import {
  Box3,
  BufferAttribute,
  BufferGeometryLoader,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  Raycaster,
  Vector2,
  Vector3,
  VertexColors,
  WireframeGeometry
} from 'three/build/three.module'
import { Lut } from 'three/examples/jsm/math/Lut'

// TODO edges not supported for now

/**
 * PartLoader
 * @param {Function} mouseMoveEvent Mouse move event
 * @param {Function} mouseDownEvent Mouse down event
 */
const PartLoader = (mouseMoveEvent, mouseDownEvent) => {
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
    const partType = part.type

    const object = new Group()
    object.type = 'Part'

    // Solids
    const solids = new Group()
    partType === 'geometry' &&
      part.solids &&
      part.solids.forEach((solid) => {
        const mesh = loadElement(
          partType,
          solid,
          solidColor,
          transparent,
          clippingPlane
        )
        mesh.visible = false
        solids.add(mesh)
      })
    object.add(solids)

    // Faces
    const faces = new Group()
    part.faces &&
      part.faces.forEach((face) => {
        const mesh = loadElement(
          partType,
          face,
          faceColor,
          transparent,
          clippingPlane
        )
        if (mesh) {
          mesh.visible = true
          faces.add(mesh)
        }
      })
    object.add(faces)

    // Edges
    const edges = new Group()
    //   part.edges &&
    //   part.edges.forEach((edge) => {
    //     const mesh = loadElement(partType, edge, edgeColor, transparent, clippingPlane)
    //     mesh.visible = true
    //     edge.add(mesh)
    //   })
    object.add(edges)

    object.uuid = part.uuid

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
   * Load element
   * @param {string} partType Part type
   * @param {Object} element Element
   * @param {Object} color Color
   * @param {boolean} transparent Transparent
   * @param {Object} clippingPlane Clipping plane
   */
  const loadElement = (
    partType,
    element,
    color,
    transparent,
    clippingPlane
  ) => {
    const loader = new BufferGeometryLoader()
    const buffer = element.buffer
    const geometry = loader.parse(buffer)

    const colorAttribute = geometry.getAttribute('color')
    if (colorAttribute) {
      color = new Color(
        colorAttribute.array[0],
        colorAttribute.array[1],
        colorAttribute.array[2]
      )
    }

    if (partType === 'geometry') {
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
      material.originalColor = color

      const mesh = new Mesh(geometry, material)
      mesh.uuid = buffer.uuid

      return mesh
    } else if (partType === 'mesh') {
      const wireframe = new WireframeGeometry(geometry)
      wireframe.computeBoundingBox()
      wireframe.computeBoundingSphere()

      const material = new LineBasicMaterial({
        color: color,
        linewidth: 1,
        transparent: transparent,
        opacity: transparent ? 0.5 : 1,
        depthWrite: !transparent,
        clippingPlanes: [clippingPlane]
      })
      material.originalColor = color

      const mesh = new LineSegments(wireframe, material)
      mesh.uuid = buffer.uuid
      return mesh
    } else if (partType === 'result') {
      const group = new Group()

      geometry.computeBoundingBox()
      geometry.computeBoundingSphere()

      group.boundingBox = geometry.boundingBox
      group.boundingSphere = geometry.boundingSphere
      group.uuid = buffer.uuid

      const data = geometry.getAttribute('data')
      const min = Math.min(...data.array)
      const max = Math.max(...data.array)

      const lut = new Lut()
      lut.setMin(min)
      lut.setMax(max)

      const colors = new Float32Array(data.count * 3)
      for (let i = 0; i < data.count; ++i) {
        const color = lut.getColor(data.array[i])
        colors[3 * i + 0] = color.r
        colors[3 * i + 1] = color.g
        colors[3 * i + 2] = color.b
      }
      geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))

      const material = new LineBasicMaterial({
        vertexColors: VertexColors,
        color: color,
        side: DoubleSide,
        transparent: transparent,
        opacity: transparent ? 0.5 : 1,
        depthWrite: !transparent,
        clippingPlanes: [clippingPlane]
      })
      material.originalColor = color

      const mesh = new Mesh(geometry, material)

      const wireframeGeometry = new WireframeGeometry(geometry)
      const wireframeMaterial = new LineBasicMaterial({
        color: color,
        linewidth: 1,
        transparent: transparent,
        opacity: transparent ? 0.5 : 1,
        depthWrite: !transparent,
        clippingPlanes: [clippingPlane]
      })
      material.originalColor = color

      const wireframe = new LineSegments(wireframeGeometry, wireframeMaterial)
      wireframe.visible = transparent

      group.add(mesh)
      group.add(wireframe)

      return group
    }
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
          if (face.type === 'Group') {
            // This is a result
            childBox = face.boundingBox
          } else {
            childBox = face.geometry.boundingBox
          }
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
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
        if (child.children.length) {
          // This is a result
          child.children[0].geometry.dispose()
          child.children[0].material.dispose()
        }
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
          if (child.material) {
            child.material.transparent = transparent
            child.material.opacity = transparent ? 0.5 : 1
            child.material.depthWrite = !transparent
          }
          if (child.children.length) {
            // This is a result
            child.children[0].material.transparent = transparent
            child.children[0].material.opacity = transparent ? 0.5 : 1
            child.children[0].material.depthWrite = !transparent

            child.children[1].visible = transparent
          }
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
    selectionRenderer &&
      selectionRenderer.domElement.removeEventListener('mousemove', mouseMove)
    selectionRenderer &&
      selectionRenderer.domElement.removeEventListener('mousedown', mouseDown)

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
      if (solid.uuid === uuid) return solid
    }

    // Search in faces
    const faces = part.children[1]
    for (const face of faces.children) {
      if (face.uuid === uuid) return face
    }

    // Search in edges
    // TODO
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
      mouseMoveEvent(selectionPart, intersects[0].object.uuid)
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
      highlighted = mesh.uuid
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
      const index = selected.findIndex((m) => m === mesh.uuid)
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
