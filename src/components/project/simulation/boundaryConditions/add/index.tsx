/** @module Components.Project.Simulation.BoundaryConditions.Add */

import { useCallback, useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'

import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

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
export interface Props {
  simulation: Simulation
  boundaryCondition: Partial<IModelBoundaryConditionValue>
  swr: Swr
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
  simulation: Simulation,
  boundaryCondition: IModelBoundaryConditionValue,
  swr: Swr
): Promise<void> => {
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
  await swr.mutateOneSimulation(newSimulation)
}

/**
 * Add
 * @param props Props
 * @return Add
 */
const Add: React.FunctionComponent<Props> = ({
  simulation,
  boundaryCondition,
  swr,
  onError,
  onClose
}) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

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

        await _onAdd(
          simulation,
          boundaryCondition as IModelBoundaryConditionValue,
          swr
        )

        // Close
        setLoading(false)
        onClose()
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
        setLoading(false)
      }
    })
  }, [simulation, boundaryCondition, swr, onError, onClose, dispatch])

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
