/** @module Components.Project.Simulation.Run.Sensors.Edit */

import { useCallback, useContext, useState } from 'react'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelSensor } from '@/models/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { EditButton } from '@/components/assets/button'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'
import { asyncFunctionExec } from '@/components/utils/asyncFunction'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Sensor = Partial<IModelSensor> & { index?: number }
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  simulation: Simulation
  sensor: Sensor
  onError: (error?: string) => void
  onClose: () => void
  swr: Swr
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
  simulation: Simulation,
  sensor: Sensor,
  swr: Swr
) => {
  // New simulation
  const newSimulation = Utils.deepCopy(simulation)
  const run = newSimulation.scheme.configuration.run

  // Local
  const index = sensor.index!
  delete sensor.index
  run.sensors![index] = sensor as IModelSensor

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
 * Edit
 * @param props Props
 * @returns Edit
 */
const Edit: React.FunctionComponent<IProps> = ({
  simulation,
  sensor,
  onError,
  onClose,
  swr
}) => {
  // State
  const [loading, setLoading] = useState<boolean>()

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On edit
   */
  const onEdit = useCallback((): void => {
    asyncFunctionExec(async () => {
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

        await _onEdit(simulation, sensor as IModelSensor, swr)

        // Close
        setLoading(false)
        onClose()
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
        setLoading(false)
      }
    })
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
