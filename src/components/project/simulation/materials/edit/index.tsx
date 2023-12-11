/** @module Components.Project.Simulation.Materials.Edit */

import { useCallback, useContext, useState } from 'react'

import { IModelMaterialsValue } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import { EditButton } from '@/components/assets/button'

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
  material: Partial<IModelMaterialsValue>
  swr: Swr
  onError: (desc?: string) => void
  onClose: () => void
}

/**
 * Errors
 */
export const errors = {
  uuid: 'UUID not defined on material',
  material: 'You need to define a material',
  selected: 'You need to select a solid',
  update: 'Unable to edit material'
}

/**
 * On edit
 * @param simulation Simulation
 * @param material Material
 * @param swr SWR
 */
export const _onEdit = async (
  simulation: Simulation,
  material: IModelMaterialsValue,
  swr: Swr
): Promise<void> => {
  // New simulation
  const newSimulation = Utils.deepCopy(simulation)
  const materials = newSimulation.scheme.configuration.materials!

  // Update local
  const index = materials.values!.findIndex(
    (m: { uuid: string }) => m.uuid === material.uuid
  )
  materials.values = [
    ...materials.values!.slice(0, index),
    material,
    ...materials.values!.slice(index + 1)
  ]

  // Diff
  const diff = {
    ...materials
  }

  // API
  await SimulationAPI.update({ id: simulation.id }, [
    {
      key: 'scheme',
      type: 'json',
      method: 'set',
      path: ['configuration', 'materials'],
      value: diff
    }
  ])

  // Local
  await swr.mutateOneSimulation(newSimulation)
}

/**
 * Edit material
 * @param props Props
 */
const Edit: React.FunctionComponent<Props> = ({
  simulation,
  material,
  swr,
  onError,
  onClose
}) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

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
        if (!material.uuid) {
          onError(errors.uuid)
          setLoading(false)
          return
        }

        // Check
        if (!material.material) {
          onError(errors.material)
          setLoading(false)
          return
        }

        if (!material.selected?.length) {
          onError(errors.selected)
          setLoading(false)
          return
        }
        onError()

        await _onEdit(simulation, material as IModelMaterialsValue, swr)

        // Close
        setLoading(false)
        onClose()
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
        setLoading(false)
      }
    })
  }, [simulation, material, swr, onError, onClose, dispatch])

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
