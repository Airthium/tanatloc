import { useState } from 'react'
import { message } from 'antd'

import { EditButton } from '../../../../assets/button'

import SimulationAPI from '../../../../../../src/api/simulation'

import Sentry from '../../../../../../src/lib/sentry'

/**
 * Errors boundaryCondition/edit
 */
const errors = {
  updateError: 'Unable to edit the material'
}

/**
 * Edit material
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Edit = ({ disabled, material, project, simulation, part, close }) => {
  // State
  const [loading, setLoading] = useState()

  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )

  /**
   * On edit
   */
  const onEdit = async () => {
    setLoading(true)

    try {
      // New simulation
      const newSimulation = { ...simulation }
      const materials = newSimulation.scheme.configuration.materials

      // Modify selection
      const selection = part.solids
        .map((f) => {
          if (material.selected.includes(f.uuid))
            return {
              uuid: f.uuid,
              label: f.number
            }
        })
        .filter((s) => s)
      material.selected = selection

      // Update local
      const index = materials.values.findIndex((m) => m.uuid === material.uuid)
      materials.values = [
        ...materials.values.slice(0, index),
        material,
        ...materials.values.slice(index + 1)
      ]

      // Diff
      const diff = {
        ...materials
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

      // Close
      close()
    } catch (err) {
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setLoading(false)
    }
  }
  /**
   * Render
   */
  return <EditButton disabled={disabled} loading={loading} onEdit={onEdit} />
}

export default Edit
