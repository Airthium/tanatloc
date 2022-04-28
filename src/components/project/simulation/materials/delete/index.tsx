/** @module Components.Project.Simulation.Materials.Delete */

import { Dispatch, useContext, useState } from 'react'
import { Typography } from 'antd'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { ISelectAction, SelectContext } from '@/context/select'
import { unselect } from '@/context/select/actions'

import Utils from '@/lib/utils'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  index: number
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
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
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  index: number,
  dispatch: Dispatch<ISelectAction>,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const materials = newSimulation.scheme.configuration.materials!
    const material = materials.values![index]

    // (unselect)
    material.selected.forEach((s) => {
      dispatch(unselect(s))
    })

    // Remove value
    materials.values = [
      ...materials.values!.slice(0, index),
      ...materials.values!.slice(index + 1)
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
  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const { dispatch } = useContext(SelectContext)
  const materials = simulation.scheme.configuration.materials!
  const material = materials.values![index]

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      text={
        <>
          Are you sure you want to delete the material{' '}
          <Typography.Text strong>{material.material.label}</Typography.Text>
        </>
      }
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

export default Delete
