/** @module Components.Project.Simulation.BoundaryConditions.Delete */

import { useCallback, useContext, useMemo, useState } from 'react'
import { Typography } from 'antd'

import { IModelTypedBoundaryCondition } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { select } from '@/context/select/actions'
import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

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
  type: string
  index: number
  swr: Swr
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
 * @param swr SWR
 */
export const _onDelete = async (
  simulation: Simulation,
  type: string,
  index: number,
  swr: Swr
): Promise<void> => {
  // New simulation
  const newSimulation = Utils.deepCopy(simulation)

  // Update local
  const boundaryConditions =
    newSimulation.scheme.configuration.boundaryConditions
  const typedBoundaryCondition = boundaryConditions[
    type
  ] as IModelTypedBoundaryCondition

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
}

/**
 * Delete
 * @param props Props
 * @return Delete
 */
const Delete: React.FunctionComponent<Props> = ({
  type,
  index,
  simulation,
  swr
}) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch: selectDispatch } = useContext(SelectContext)
  const { dispatch: notificationDispatch } = useContext(NotificationContext)

  // Boundary conditions
  const boundaryConditions = useMemo(
    () => simulation.scheme.configuration.boundaryConditions,
    [simulation]
  )

  // Typed boundary condition
  const typedBoundaryCondition = useMemo(
    () => boundaryConditions[type] as IModelTypedBoundaryCondition,
    [boundaryConditions, type]
  )

  // Boundary condition
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
      await _onDelete(simulation, type, index, swr)
      // (unselect)
      selectDispatch(select(boundaryCondition.selected))
    } catch (err: any) {
      notificationDispatch(addError({ title: errors.update, err }))
      throw err
    } finally {
      setLoading(false)
    }
  }, [
    simulation,
    type,
    index,
    swr,
    boundaryCondition,
    selectDispatch,
    notificationDispatch
  ])

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
