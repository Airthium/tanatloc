/** @module Components.Project.Simulation.BoundaryConditions.Delete */

import { Dispatch, useCallback, useContext, useMemo, useState } from 'react'
import { Typography } from 'antd'

import { IModelTypedBoundaryCondition } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { ISelectAction, SelectContext } from '@/context/select'
import { select } from '@/context/select/actions'
import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  type: string
  index: number
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to delete boundary condition'
}

/**
 * On delete
 * @param simulation Simulation
 * @param type Type
 * @param index Index
 * @param dispatch Dispatch
 * @param swr SWR
 */
export const _onDelete = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  type: string,
  index: number,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  selectDispatch: Dispatch<ISelectAction>,
  notificationDispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const boundaryConditions =
      newSimulation.scheme.configuration.boundaryConditions
    const typedBoundaryCondition = boundaryConditions[
      type
    ] as IModelTypedBoundaryCondition
    const boundaryCondition = typedBoundaryCondition.values![index]

    // (unselect)
    selectDispatch(select(boundaryCondition.selected))

    typedBoundaryCondition.values = [
      ...typedBoundaryCondition.values!.slice(0, index),
      ...typedBoundaryCondition.values!.slice(index + 1)
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

    // Local
    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    notificationDispatch(addError({ title: errors.update, err }))
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @return Delete
 */
const Delete = ({
  type,
  index,
  simulation,
  swr
}: IProps): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch: selectDispatch } = useContext(SelectContext)
  const { dispatch: notificationDispatch } = useContext(NotificationContext)

  // Data
  const boundaryConditions = useMemo(
    () => simulation.scheme.configuration.boundaryConditions,
    [simulation]
  )
  const typedBoundaryCondition = useMemo(
    () => boundaryConditions[type] as IModelTypedBoundaryCondition,
    [boundaryConditions, type]
  )
  const boundaryCondition = useMemo(
    () => typedBoundaryCondition.values![index],
    [typedBoundaryCondition, index]
  )

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(
        simulation,
        type,
        index,
        swr,
        selectDispatch,
        notificationDispatch
      )
    } finally {
      setLoading(false)
    }
  }, [simulation, type, index, swr, selectDispatch, notificationDispatch])

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      onDelete={onDelete}
      text={
        <>
          Are you sure you want to delete the condition{' '}
          <Typography.Text strong>{boundaryCondition?.name}</Typography.Text>?
        </>
      }
    />
  )
}

export default Delete
