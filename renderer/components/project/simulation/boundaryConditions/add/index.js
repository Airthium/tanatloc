import { useState } from 'react'
import { message } from 'antd'
import { v4 as uuid } from 'uuid'

import { AddButton } from '../../../../assets/button'

import SimulationAPI from '../../../../../../src/api/simulation'

import Sentry from '../../../../../../src/lib/sentry'

/**
 * Errors boundaryCondition/add
 */
const errors = {
  updateError: 'Unable to add the boundary condition'
}

/**
 * Add boundary condition
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Add = ({
  disabled,
  boundaryCondition,
  project,
  simulation,
  part,
  close
}) => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )

  /**
   * on Add
   */
  const onAdd = async () => {
    setLoading(true)

    try {
      // Get type key
      const type = boundaryCondition.type.key

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

      // Set uuid
      boundaryCondition.uuid = uuid()

      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions
      boundaryConditions[type].values = [
        ...(boundaryConditions[type].values || []),
        boundaryCondition
      ]

      // Diff
      const diff = {
        ...boundaryConditions,
        done: true
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
  return <AddButton disabled={disabled} loading={loading} onAdd={onAdd} />
}

export default Add
