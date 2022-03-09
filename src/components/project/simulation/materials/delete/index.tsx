/** @module Components.Project.Simulation.Materials.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'

import { ISimulation } from '@/database/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { useDispatch } from 'react-redux'
import { unselect } from '@/store/select/action'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  index: number
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Error
 */
export const errors = {
  update: 'Unable to delete the material'
}

/**
 * On delete
 */
const onDelete = async (
  simulation: ISimulation,
  index: number,
  dispatch: Dispatch<any>,
  swr: IProps['swr']
): Promise<void> => {
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

    // Local
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ simulation, index, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  // Data
  const dispatch = useDispatch()

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(simulation, index, dispatch, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

Delete.propTypes = {
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
  index: PropTypes.number.isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
