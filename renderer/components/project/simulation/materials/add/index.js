import { useState } from 'react'
import { message, Button } from 'antd'
import { v4 as uuid } from 'uuid'

import SimulationAPI from '../../../../../../src/api/simulation'

import Sentry from '../../../../../../src/lib/sentry'

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
  const [loading, setLoading] = useState()

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
          method: 'diff',
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
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Button loading={loading} disabled={disabled} onClick={onAdd}>
      Add
    </Button>
  )
}

export default Add
