import { useState } from 'react'
import { message, Button } from 'antd'

import { EditButton } from '../../../../assets/button'

import SimulationAPI from '../../../../../../src/api/simulation'

import Sentry from '../../../../../../src/lib/sentry'

/**
 * Errors boundaryCondition/edit
 */
const errors = {
  updateError: 'Unable to edit the boundary condition'
}

/**
 * Edit boundary condition
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Edit = ({
  disabled,
  boundaryCondition,
  oldBoundaryCondition,
  project,
  simulation,
  part,
  close
}) => {
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
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions

      // Get type key
      const type = boundaryCondition.type.key

      // Get old type
      const oldType = oldBoundaryCondition.type.key

      if (oldType !== type) {
        const index = boundaryConditions[oldType].values.findIndex(
          (b) => b.uuid === oldBoundaryCondition.uuid
        )
        boundaryConditions[oldType].values = [
          ...boundaryConditions[oldType].values.slice(0, index),
          ...boundaryConditions[oldType].values.slice(index + 1)
        ]
      }

      // Modify selection
      const selection = part.faces
        .map((f) => {
          if (boundaryCondition.selected.includes(f.uuid))
            return {
              uuid: f.uuid,
              label: f.number
            }
        })
        .filter((s) => s)
      boundaryCondition.selected = selection

      // Update local
      if (oldType !== type) {
        boundaryConditions[type].values = [
          ...boundaryConditions[type].values,
          boundaryCondition
        ]
      } else {
        const index = boundaryConditions[type].values.findIndex(
          (b) => b.uuid === boundaryCondition.uuid
        )
        boundaryConditions[type].values = [
          ...boundaryConditions[type].values.slice(0, index),
          boundaryCondition,
          ...boundaryConditions[type].values.slice(index + 1)
        ]
      }

      // Diff
      const diff = {
        ...boundaryConditions
      }

      // Update
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'diff',
          path: ['configuration', 'boundaryConditions'],
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
  return <EditButton disabled={disabled} loading={loading} onEdit={onEdit} />
}

export default Edit
