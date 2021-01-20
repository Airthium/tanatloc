import { useState } from 'react'

import { Error } from '@/components/assets/notification'
import { DeleteButton } from '@/components/assets/button'

import { useDispatch } from 'react-redux'
import { unselect } from '@/store/select/action'

import SimulationAPI from '@/api/simulation'

/**
 * Errors boundaryConditions/delete
 * @memberof module:'src/components/project/simulation
 */
const errors = {
  updateError: 'Unable to delete the boundary condition'
}

/**
 * Delete boundary condition
 * @memberof module:'src/components/project/simulation
 * @param {Object} props Props
 */
const Delete = ({ project, simulation, type, index }) => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )
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

      mutateOneSimulation(newSimulation)
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

export default Delete
