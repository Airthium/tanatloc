/** @module Components.Project.Simulation.Materials.Delete */

import { useCallback, useContext, useMemo, useState } from 'react'
import { Typography } from 'antd'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { SelectContext } from '@/context/select'
import { select } from '@/context/select/actions'

import { DeleteButton } from '@/components/assets/button'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface Props {
  simulation: Simulation
  index: number
  swr: Swr
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
  simulation: Simulation,
  index: number,
  swr: Swr
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const materials = newSimulation.scheme.configuration.materials!

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
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete: React.FunctionComponent<Props> = ({ simulation, index, swr }) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch: notificationDispatch } = useContext(NotificationContext)
  const { dispatch: selectDispatch } = useContext(SelectContext)

  // Material
  const materials = useMemo(
    () => simulation.scheme.configuration.materials!,
    [simulation]
  )

  // Material
  const material = useMemo(() => materials.values![index], [materials, index])

  // Selected
  const selected = useMemo(() => material.selected, [material.selected])

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(simulation, index, swr)
      // (unselect)
      selectDispatch(select(selected))
    } catch (err: any) {
      notificationDispatch(addError({ title: errors.update, err }))
      throw err
    } finally {
      setLoading(false)
    }
  }, [simulation, index, swr, selected, selectDispatch, notificationDispatch])

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
