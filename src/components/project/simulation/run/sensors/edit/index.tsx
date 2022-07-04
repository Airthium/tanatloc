/** @module Components.Simulation.Project.Run.Sensors.Edit */

import { useState } from 'react'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelSensor } from '@/models/index.d'

import { EditButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  sensor: IModelSensor & { index: number }
  onError: (error?: string) => void
  onClose: () => void
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
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
export const onEdit = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  sensor: IModelSensor & { index: number },
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
) => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)
    const run = newSimulation.scheme.configuration.run

    // Local
    const index = sensor.index
    run.sensors![index] = {
      name: sensor.name,
      point: sensor.point,
      formula: sensor.formula
    }

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
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
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
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>()

  /**
   * Render
   */
  return (
    <EditButton
      loading={loading}
      primary
      needMargin
      onEdit={async () => {
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

          await onEdit(simulation, sensor, swr)

          // Close
          setLoading(false)
          onClose()
        } catch (err) {
          setLoading(false)
        }
      }}
    >
      Edit
    </EditButton>
  )
}

export default Edit