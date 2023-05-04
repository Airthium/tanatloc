/** @module Components.Project.Simulation.Run.Sensors.Delete */

import { Dispatch, useCallback, useContext, useMemo, useState } from 'react'
import { Typography } from 'antd'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import { ISelectAction, SelectContext } from '@/context/select'
import { setPoint } from '@/context/select/actions'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

import Utils from '@/lib/utils'

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
 * Errors
 */
export const errors = {
  udpate: 'Unable to update simulation'
}

/**
 * On delete
 * @param simulation Simulation
 * @param index Index
 * @param dispatch Disptach
 * @param swr SWR
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

    // Local
    const run = newSimulation.scheme.configuration.run

    // Unselect
    dispatch(setPoint())

    // Remove value
    run.sensors = [
      ...run.sensors!.slice(0, index),
      ...run.sensors!.slice(index + 1)
    ]

    // API
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'run'],
        value: run
      }
    ])

    // Local
    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    ErrorNotification(errors.udpate, err)
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
  const [loading, setLoading] = useState<boolean>()

  // Data
  const { dispatch } = useContext(SelectContext)
  const run = useMemo(() => simulation.scheme.configuration.run, [simulation])
  const sensor = useMemo(() => run.sensors![index], [index, run])

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
  }, [simulation, index, dispatch, swr])

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      text={
        <>
          Are you sure you want to delete the sensor{' '}
          <Typography.Text strong>{sensor.name}</Typography.Text>
        </>
      }
      onDelete={onDelete}
    />
  )
}

export default Delete
