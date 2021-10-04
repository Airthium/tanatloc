import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'

import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

/**
 * Errors (edit)
 * @memberof Components.Project.Simulation.BoundaryConditions
 */
const errors = {
  updateError: 'Unable to edit the boundary condition'
}

/**
 * Edit boundary condition
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param {Object} props Props
 */
const Edit = ({
  disabled,
  simulation,
  boundaryCondition,
  oldBoundaryCondition,
  geometry,
  swr,
  close
}) => {
  // State
  const [loading, setLoading] = useState()

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

      // Close
      close()
    } catch (err) {
      Error(errors.updateError, err)
    } finally {
      setLoading(false)
    }
  }
  /**
   * Render
   */
  return (
    <Button disabled={disabled} loading={loading} onClick={onEdit}>
      Edit
    </Button>
  )
}

Edit.propTypes = {
  disabled: PropTypes.bool,
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  boundaryCondition: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    type: PropTypes.shape({
      key: PropTypes.string.isRequired
    }).isRequired,
    selected: PropTypes.array.isRequired
  }).isRequired,
  oldBoundaryCondition: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    type: PropTypes.shape({
      key: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  geometry: PropTypes.shape({
    faces: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired
}

export default Edit
