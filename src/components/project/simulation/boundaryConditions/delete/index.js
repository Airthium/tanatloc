import PropTypes from 'prop-types'
import { useState } from 'react'

import { DeleteButton } from '@/components/assets/button'
import { Error } from '@/components/assets/notification'

import { useDispatch } from 'react-redux'
import { unselect } from '@/store/select/action'

import SimulationAPI from '@/api/simulation'

/**
 * Errors boundaryConditions/delete
 * @memberof module:components/project/simulation
 */
const errors = {
  updateError: 'Unable to delete the boundary condition'
}

/**
 * Delete boundary condition
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const Delete = ({ simulation, type, index, swr }) => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const dispatch = useDispatch()

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)

    try {
      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions
      const typedBoundaryCondition = boundaryConditions[type]

      // (unselect)
      const boundaryCondition = typedBoundaryCondition.values[index]
      boundaryCondition.selected.forEach((s) => {
        dispatch(unselect(s.uuid))
      })

      typedBoundaryCondition.values = [
        ...typedBoundaryCondition.values.slice(0, index),
        ...typedBoundaryCondition.values.slice(index + 1)
      ]

      // Diff
      let done = false
      Object.keys(boundaryConditions).forEach((t) => {
        if (t === 'index' || t === 'title' || t === 'done') return
        if (boundaryConditions[t].values?.length) done = true
      })
      const diff = {
        ...boundaryConditions,
        done: done
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

      // Stop loading
      setLoading(false)

      // Local
      swr.mutateOneSimulation(newSimulation)
    } catch (err) {
      Error(errors.updateError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return <DeleteButton loading={loading} onDelete={onDelete} />
}

Delete.propTypes = {
  simulation: PropTypes.shape({
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  type: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
