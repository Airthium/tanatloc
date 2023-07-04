/** @module Components.Project.Simulation.Run.Sensors.Edit */

import { Dispatch, useCallback, useContext, useState } from 'react'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelSensor } from '@/models/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { EditButton } from '@/components/assets/button'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  sensor: Partial<IModelSensor> & { index: number }
  onError: (error?: string) => void
  onClose: () => void
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
  name: 'You need to define a name',
  point: 'You need to select a point',
  formula: 'You need to define a formula',
  update: 'Unable to update simulation'
}

/**
 * On edit
 * @param simulation Simulation
 * @param sensor Sensor (+ index)
 * @param swr SWR
 */
export const _onEdit = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  sensor: IModelSensor & { index?: number },
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
) => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)
    const run = newSimulation.scheme.configuration.run

    // Local
    const index = sensor.index
    delete sensor.index
    run.sensors![index!] = sensor

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
    dispatch(addError({ title: errors.update, err }))
    throw err
  }
}

/**
 * Edit
 * @param props Props
 * @returns Edit
 */
const Edit = ({
  simulation,
  sensor,
  onError,
  onClose,
  swr
}: IProps): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>()

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On edit
   */
  const onEdit = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        // Check
        if (!sensor.name) {
          onError(errors.name)
          setLoading(false)
          return
        }

        if (!sensor.point) {
          onError(errors.point)
          setLoading(false)
          return
        }

        if (!sensor.formula) {
          onError(errors.formula)
          setLoading(false)
          return
        }

        onError()

        await _onEdit(simulation, sensor as IModelSensor, swr, dispatch)

        // Close
        setLoading(false)
        onClose()
      } catch (err) {
        setLoading(false)
      }
    })()
  }, [simulation, sensor, onError, onClose, swr, dispatch])

  /**
   * Render
   */
  return (
    <EditButton loading={loading} primary needMargin onEdit={onEdit}>
      Edit
    </EditButton>
  )
}

export default Edit
