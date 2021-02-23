import { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { Error } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

/**
 * Errors material/add
 */
const errors = {
  updateError: 'Unable to add the material'
}

/**
 * Add material
 * @param {Object} props Props
 */
const Add = ({ material, project, simulation, part, disabled, close }) => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )

  /**
   * On add
   */
  const onAdd = async () => {
    setLoading(true)

    try {
      // Modify selection
      const selection = part.solids
        .map((s) => {
          if (material.selected.includes(s.uuid))
            return {
              uuid: s.uuid,
              label: s.number
            }
        })
        .filter((s) => s)
      material.selected = selection

      // Set uuid
      material.uuid = uuid()

      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const materials = newSimulation.scheme.configuration.materials
      materials.values = [...(materials.values || []), material]

      // Diff
      const diff = {
        ...materials,
        done: true
      }

      // Update
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'materials'],
          value: diff
        }
      ])

      // Mutate
      mutateOneSimulation(newSimulation)

      // Stop loading
      setLoading(false)

      // Close
      close()
    } catch (err) {
      Error(errors.updateError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return <AddButton disabled={disabled} loading={loading} onAdd={onAdd} />
}

export default Add
