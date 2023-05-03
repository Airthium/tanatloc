/** @module Components.Project.Simulation.Materials.Delete */

import { Dispatch, useCallback, useContext, useMemo, useState } from 'react'
import { Typography } from 'antd'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { ISelectAction, SelectContext } from '@/context/select'
import { unselect } from '@/context/select/actions'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  index: number
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

/**
 * Error
 */
export const errors = {
  update: 'Unable to delete material'
}

/**
 * On delete
 */
export const _onDelete = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  index: number,
  dispatch: Dispatch<ISelectAction>,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
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
    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
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
  const materials = useMemo(
    () => simulation.scheme.configuration.materials!,
    [simulation]
  )
  const material = useMemo(() => materials.values![index], [materials, index])

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(simulation, index, dispatch, swr)
    } finally {
      setLoading(false)
    }
  }, [simulation, index, swr, dispatch])

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
      onDelete={onDelete}
    />
  )
}

export default Delete
