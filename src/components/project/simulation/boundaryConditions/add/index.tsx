/** @module Components.Project.Simulation.BoundaryConditions.Add */

import { useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'

import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  boundaryCondition: Omit<IModelBoundaryConditionValue, 'uuid'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
  onError: (desc?: string) => void
  onClose: () => void
}

/**
 * Errors
 */
export const errors = {
  name: 'You need to define a name',
  type: 'You need to select a type',
  selected: 'You need to select a face',
  update: 'Unable to add boundary condition'
}

/**
 * on Add
 * @param simulation Simulation
 * @param boundaryCondition Boundary condition
 * @param swr SWR
 */
export const _onAdd = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  boundaryCondition: Omit<IModelBoundaryConditionValue, 'uuid'>,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // New boundary condition
    const newBoundaryCondition = {
      ...boundaryCondition
    } as IModelBoundaryConditionValue

    // Get type key
    const type = newBoundaryCondition.type.key

    // Set uuid
    newBoundaryCondition.uuid = uuid()

    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const boundaryConditions =
      newSimulation.scheme.configuration.boundaryConditions
    const TypedBoundaryCondition = boundaryConditions[
      type
    ] as IModelTypedBoundaryCondition
    TypedBoundaryCondition.values = [
      ...(TypedBoundaryCondition.values ?? []),
      newBoundaryCondition
    ]

    // Diff
    const diff = {
      ...boundaryConditions,
      done: true
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
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'run'],
        value: {
          ...newSimulation.scheme.configuration.run,
          done: false
        }
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
 * Add
 * @param props Props
 * @return Add
 */
const Add = ({
  simulation,
  boundaryCondition,
  swr,
  onError,
  onClose
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * On add
   */
  const onAdd = useCallback(async () => {
    setLoading(true)
    try {
      // Check
      if (!boundaryCondition.name) {
        onError(errors.name)
        setLoading(false)
        return
      }

      if (!boundaryCondition.type?.key) {
        onError(errors.type)
        setLoading(false)
        return
      }

      if (!boundaryCondition.selected?.length) {
        onError(errors.selected)
        setLoading(false)
        return
      }
      onError()

      await _onAdd(simulation, boundaryCondition, swr)

      // Close
      setLoading(false)
      onClose()
    } catch (err) {
      setLoading(false)
    }
  }, [simulation, boundaryCondition, swr, onError, onClose])

  /**
   * Render
   */
  return (
    <AddButton loading={loading} onAdd={onAdd} needMargin={true}>
      Add
    </AddButton>
  )
}

export default Add
