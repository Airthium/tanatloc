import PropTypes from 'prop-types'
import { useState } from 'react'

import { ISimulation } from '@/database/index.d'
import { IModelTypedBoundaryCondition } from '@/models/index.d'

import { DeleteButton } from '@/components/assets/button'
import { Error } from '@/components/assets/notification'

import { useDispatch } from 'react-redux'
import { unselect } from '@/store/select/action'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  type: string
  index: number
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors (delete)
 * @memberof Components.Project.Simulation.BoundaryConditions
 */
const errors = {
  updateError: 'Unable to delete the boundary condition'
}

/**
 * Delete boundary condition
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param props Props
 */
const Delete = ({ type, index, simulation, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  // Data
  const dispatch = useDispatch()

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)

    try {
      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions
      const typedBoundaryCondition = boundaryConditions[
        type
      ] as IModelTypedBoundaryCondition
      const boundaryCondition = typedBoundaryCondition.values[index]

      // (unselect)
      boundaryCondition.selected.forEach((s: { uuid: string }) => {
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
        const ttypedBoundaryCondition = boundaryConditions[
          t
        ] as IModelTypedBoundaryCondition
        if (ttypedBoundaryCondition.values?.length) done = true
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
      throw err
    }
  }

  /**
   * Render
   */
  return <DeleteButton loading={loading} onDelete={onDelete} />
}

Delete.propTypes = {
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.shape({
          //TODO
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
