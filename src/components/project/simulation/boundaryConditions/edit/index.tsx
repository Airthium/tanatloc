/** @module Components.Project.Simulation.BoundaryConditions.Edit */

import { useState } from 'react'

import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import { EditButton } from '@/components/assets/button'

import Utils from '@/lib/utils'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  boundaryCondition: IModelBoundaryConditionValue
  oldBoundaryCondition: IModelBoundaryConditionValue
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
  update: 'Unable to edit the boundary condition'
}

/**
 * On edit
 */
const onEdit = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  boundaryCondition: IModelBoundaryConditionValue,
  oldBoundaryCondition: IModelBoundaryConditionValue,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = Utils.deepCopy(simulation)
    const boundaryConditions =
      newSimulation.scheme.configuration.boundaryConditions

    // Get type key
    const type = boundaryCondition.type.key

    // Get old type
    const oldType = oldBoundaryCondition.type.key

    // Remove old boundary condition if type if different
    if (oldType !== type) {
      const oldtypedBoundaryCondition = boundaryConditions[
        oldType
      ] as IModelTypedBoundaryCondition
      const index = oldtypedBoundaryCondition.values!.findIndex(
        (b) => b.uuid === oldBoundaryCondition.uuid
      )
      oldtypedBoundaryCondition.values = [
        ...oldtypedBoundaryCondition.values!.slice(0, index),
        ...oldtypedBoundaryCondition.values!.slice(index + 1)
      ]
    }

    // Update local
    if (oldType !== type) {
      // Add if different type
      const typedBoundaryCondition = boundaryConditions[
        type
      ] as IModelTypedBoundaryCondition
      typedBoundaryCondition.values = [
        ...(typedBoundaryCondition.values || []),
        boundaryCondition
      ]
    } else {
      // Replace if same type
      const typedBoundaryCondition = boundaryConditions[
        type
      ] as IModelTypedBoundaryCondition
      const index = typedBoundaryCondition.values!.findIndex(
        (b) => b.uuid === boundaryCondition.uuid
      )
      typedBoundaryCondition.values = [
        ...typedBoundaryCondition.values!.slice(0, index),
        boundaryCondition,
        ...typedBoundaryCondition.values!.slice(index + 1)
      ]
    }

    // Diff
    const diff = {
      ...boundaryConditions
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
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Edit boundary condition
 * @param props Props
 * @returns Edit
 */
const Edit = ({
  simulation,

  boundaryCondition,
  oldBoundaryCondition,
  swr,
  onError,
  onClose
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <EditButton
      loading={loading}
      onEdit={async () => {
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

          await onEdit(simulation, boundaryCondition, oldBoundaryCondition, swr)

          // Close
          setLoading(false)
          onClose()
        } catch (err) {
          setLoading(false)
        }
      }}
      primary
      needMargin
    >
      Edit
    </EditButton>
  )
}

export default Edit
