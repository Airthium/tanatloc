/** @module Components.Project.Simulation.Run.Sensors.Add */

import { useCallback, useState } from 'react'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelSensor } from '@/models/index.d'

import { AddButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  sensor: Partial<IModelSensor>
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
 * On add
 * @param simulation Simulation
 * @param sensor Sensor
 * @param swr SWR
 */
export const _onAdd = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  sensor: IModelSensor,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
) => {
  try {
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
  } catch (err: any) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({
  simulation,
  sensor,
  onError,
  onClose,
  swr
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>()

  /**
   * On add
   */
  const onAdd = useCallback((): void => {
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

        await _onAdd(simulation, sensor as IModelSensor, swr)

        // Close
        setLoading(false)
        onClose()
      } catch (err) {
        setLoading(false)
      }
    })()
  }, [simulation, sensor, onError, onClose, swr])

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
