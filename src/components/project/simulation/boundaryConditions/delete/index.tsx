import PropTypes from 'prop-types'
import { useState } from 'react'

import { ISimulation } from '@/database/index.d'

import { DeleteButton } from '@/components/assets/button'
import { Error } from '@/components/assets/notification'

import { useDispatch } from 'react-redux'
import { unselect } from '@/store/select/action'

import SimulationAPI from '@/api/simulation'

interface IProps {
  simulation: ISimulation
  type: string
  index: number
  swr: {
    mutateOneSimulation: Function
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
const Delete = ({ simulation, type, index, swr }: IProps): JSX.Element => {
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
      const typedBoundaryCondition = boundaryConditions[type]

      // (unselect)
      //@ts-ignore
      const boundaryCondition = typedBoundaryCondition.values[index]
      boundaryCondition.selected.forEach((s: { uuid: string }) => {
        dispatch(unselect(s.uuid))
      })

      //@ts-ignore
      typedBoundaryCondition.values = [
        //@ts-ignore
        ...typedBoundaryCondition.values.slice(0, index),
        //@ts-ignore
        ...typedBoundaryCondition.values.slice(index + 1)
      ]

      // Diff
      let done = false
      Object.keys(boundaryConditions).forEach((t) => {
        if (t === 'index' || t === 'title' || t === 'done') return
        //@ts-ignore
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
      throw err
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
