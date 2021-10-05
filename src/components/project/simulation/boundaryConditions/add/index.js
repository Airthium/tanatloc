import PropTypes from 'prop-types'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Button } from 'antd'

import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Errors (add)
 * @memberof Components.Project.Simulation.BoundaryConditions
 */
const errors = {
  updateError: 'Unable to add the boundary condition'
}

/**
 * Add boundary condition
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param {Object} props Props `{ disabled, simulation, boundaryCondition, geometry, swr, close }`
 */
const Add = ({
  disabled,
  simulation,
  boundaryCondition,
  geometry,
  swr,
  close
}) => {
  // State
  const [loading, setLoading] = useState(false)

  /**
   * on Add
   */
  const onAdd = async () => {
    setLoading(true)

    try {
      // Get type key
      const type = boundaryCondition.type.key

      // Modify selection
      const selection = geometry.faces
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

      // API
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'boundaryConditions'],
          value: diff
        }
      ])

      // Local
      swr.mutateOneSimulation(newSimulation)

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
  return (
    <Button disabled={disabled} loading={loading} onClick={onAdd}>
      Add
    </Button>
  )
}

Add.propTypes = {
  disabled: PropTypes.bool,
  simulation: PropTypes.shape({
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  boundaryCondition: PropTypes.shape({
    selected: PropTypes.array
  }),
  geometry: PropTypes.shape({
    faces: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired
}

export default Add
