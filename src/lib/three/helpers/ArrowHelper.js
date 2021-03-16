/** @module lib/three/helpers/ArrowHelper */

import {
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial
} from 'three/build/three.module'

/**
 * ArrowHelper
 * @param {string} color Color
 */
const ArrowHelper = (color) => {
  // Cylinder
  const cylinderGeometry = new CylinderGeometry(0.025, 0.025, 0.8, 50)
  cylinderGeometry.translate(0, 0.4, 0)
  const cylinderMaterial = new MeshBasicMaterial({ color: color })
  const cylinder = new Mesh(cylinderGeometry, cylinderMaterial)

  // Cone
  const coneGeometry = new ConeGeometry(0.05, 0.2, 50)
  coneGeometry.translate(0, 0.9, 0)
  const coneMaterial = new MeshBasicMaterial({ color: color })
  const cone = new Mesh(coneGeometry, coneMaterial)

  // Arrow
  const arrow = new Group()
  arrow.type = 'ArrowHelper'
  arrow.add(cylinder)
  arrow.add(cone)

  /**
   * Dispose
   */
  const dispose = () => {
    cylinderGeometry.dispose()
    cylinderMaterial.dispose()

    coneGeometry.dispose()
    coneMaterial.dispose()
  }

  arrow.dispose = dispose

  return arrow
}

export default ArrowHelper
