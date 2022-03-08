/** @module Components.Project.Simulation.Materials.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'

import { ISimulation } from '@/database/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { useDispatch } from 'react-redux'
import { unselect } from '@/store/select/action'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  index: number
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Error (delete)
 */
const errors = {
  updateError: 'Unable to delete the material'
}

/**
 * Delete material
 * @param props Props
 */
const Delete = ({ index, simulation, swr }: IProps): JSX.Element => {
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
      const materials = newSimulation.scheme.configuration.materials
      const material = materials.values[index]

      // (unselect)
      material.selected.forEach((s: { uuid: string }) => {
        dispatch(unselect(s.uuid))
      })

      // Remove value
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

      // Stop loading
      setLoading(false)

      // Local
      swr.mutateOneSimulation(newSimulation)
    } catch (err) {
      ErrorNotification(errors.updateError, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete()
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

Delete.propTypes = {
  index: PropTypes.number.isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
