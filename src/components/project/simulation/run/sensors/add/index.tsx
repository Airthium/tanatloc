/** @module Components.Project.Simulation.Run.Sensors.Add */

import { useCallback, useContext, useState } from 'react'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelSensor } from '@/models/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import { AddButton } from '@/components/assets/button'

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
export interface IProps {
  simulation: Simulation
  sensor: Partial<IModelSensor>
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
 * On add
 * @param simulation Simulation
 * @param sensor Sensor
 * @param swr SWR
 */
export const _onAdd = async (
  simulation: Simulation,
  sensor: IModelSensor,
  swr: Swr
) => {
  // New simulation
  const newSimulation = Utils.deepCopy(simulation)

  // Update local
  const run = newSimulation.scheme.configuration.run

  // Diff
  const diff = {
    ...run,
    sensors: [...(run.sensors ?? []), sensor]
  }

  // API
  await SimulationAPI.update({ id: simulation.id }, [
    {
      key: 'scheme',
      type: 'json',
      method: 'set',
      path: ['configuration', 'run'],
      value: diff
    }
  ])

  // Local
  await swr.mutateOneSimulation(newSimulation)
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add: React.FunctionComponent<IProps> = ({
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
   * On add
   */
  const onAdd = useCallback((): void => {
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

        await _onAdd(simulation, sensor as IModelSensor, swr)

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
    <AddButton loading={loading} needMargin onAdd={onAdd}>
      Add
    </AddButton>
  )
}

export default Add
