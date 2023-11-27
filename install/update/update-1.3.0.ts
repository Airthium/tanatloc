/** @module Install.Update130 */

import { tables } from '@/config/db'

import { query, updater } from '@/database'

/**
 * Update
 */
const update = async (): Promise<void> => {
  console.info(' - Update for v1.3.0')
  // Replace meshable by noMeshable = !meshable
  // Introduce geometry children
  try {
    // Get simulations
    const { rows: simulations } = await query(
      'SELECT id, scheme FROM ' + tables.SIMULATIONS,
      []
    )

    for (const simulation of simulations) {
      const geometry = simulation.scheme.configuration.geometry

      // Skip already up-to-date
      if (geometry.children) continue

      // Replace meshable
      let noMeshable: true | undefined = undefined
      if (!geometry.meshable) noMeshable = true
      delete geometry.meshable

      // Introduce geometry children
      if (geometry.multiple) {
        geometry.children = geometry.values.map((v: string, index: number) => ({
          noMeshable,
          value: v,
          meshParameters: geometry.meshParameters,
          mesh: geometry.meshes?.[index]
        }))
      } else {
        geometry.children = [
          {
            label: 'Domain',
            noMeshable,
            value: geometry.value,
            meshParameters: geometry.meshParameters,
            mesh: geometry.mesh
          }
        ]
      }
      delete geometry.multiple
      delete geometry.n
      delete geometry.value
      delete geometry.values
      delete geometry.meshParameters
      delete geometry.mesh
      delete geometry.meshes

      // Update simulation
      await updater(tables.SIMULATIONS, simulation.id, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'geometry'],
          value: geometry
        }
      ])
    }
  } catch (err: any) {
    console.error('   ⚠ Update 1.3.0 failed')
    console.error(err)
  }
}

export default update
