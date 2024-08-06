/** @module Components.Project.Simulation.Run.Sensors.Delete */

import { useCallback, useContext, useMemo, useState } from 'react'
import { Typography } from 'antd'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { setPoint } from '@/context/select/actions'
import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

import Utils from '@/lib/utils'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  simulation: Simulation
  index: number
  swr: Swr
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update simulation'
}

/**
 * On delete
 * @param simulation Simulation
 * @param index Index
 * @param swr SWR
 */
export const _onDelete = async (
  simulation: Simulation,
  index: number,
  swr: Swr
): Promise<void> => {
  // New simulation
  const newSimulation = Utils.deepCopy(simulation)

  // Local
  const run = newSimulation.scheme.configuration.run

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
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete: React.FunctionComponent<IProps> = ({
  simulation,
  index,
  swr
}) => {
  // State
  const [loading, setLoading] = useState<boolean>()

  // Context
  const { dispatch: selectDispatch } = useContext(SelectContext)
  const { dispatch: notificationDispatch } = useContext(NotificationContext)

  // Run
  const run = useMemo(() => simulation.scheme.configuration.run, [simulation])

  // Sensor
  const sensor = useMemo(() => run.sensors![index], [index, run])

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(simulation, index, swr)
      // Unselect
      selectDispatch(setPoint())
    } catch (err: any) {
      notificationDispatch(addError({ title: errors.update, err }))
    } finally {
      setLoading(false)
    }
  }, [simulation, index, swr, selectDispatch, notificationDispatch])

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
