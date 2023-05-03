/** @module Components.Project.Simulation.BoundaryConditions.Delete */

import { Dispatch, useCallback, useContext, useMemo, useState } from 'react'
import { Typography } from 'antd'

import { IModelTypedBoundaryCondition } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { ISelectAction, SelectContext } from '@/context/select'
import { unselect } from '@/context/select/actions'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

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
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
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
  dispatch: Dispatch<ISelectAction>,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
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
    boundaryCondition.selected.forEach((s) => {
      dispatch(unselect(s))
    })

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
    swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @return Delete
 */
const Delete = ({ type, index, simulation, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const { dispatch } = useContext(SelectContext)
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
  const onDelete = useCallback(async () => {
    setLoading(true)
    try {
      await _onDelete(simulation, type, index, dispatch, swr)
    } finally {
      setLoading(false)
    }
  }, [simulation, type, index, swr, dispatch])

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
