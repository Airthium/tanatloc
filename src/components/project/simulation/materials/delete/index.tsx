import PropTypes from 'prop-types'
import { useState } from 'react'

import { ISimulation } from '@/database/index.d'

import { DeleteButton } from '@/components/assets/button'
import { Error } from '@/components/assets/notification'

import { useDispatch } from 'react-redux'
import { unselect } from '@/store/select/action'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: Function
  }
  index: number
}

/**
 * Error (delete)
 * @memberof Components.Project.Simulation.Materials
 */
const errors = {
  updateError: 'Unable to delete the material'
}

/**
 * Delete material
 * @memberof Components.Project.Simulation.Materials
 * @param props Props
 */
const Delete = ({ simulation, swr, index }: IProps): JSX.Element => {
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
      const materials = newSimulation?.scheme?.configuration?.materials
      const material = materials.values[index]

      // (unselect)
      material.selected.forEach((s: { uuid: string }) => {
        dispatch(unselect(s.uuid))
      })

      materials.values = [
        ...materials.values.slice(0, index),
        ...materials.values.slice(index + 1)
      ]

      // Diff
      const diff = {
        ...materials,
        done: !!materials.values.length
      }

      // API
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'materials'],
          value: diff
        }
      ])

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
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array.isRequired
        })
      })
    })
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  })
}

export default Delete