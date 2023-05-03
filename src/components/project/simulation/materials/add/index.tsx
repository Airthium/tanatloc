/** @module Components.Project.Simulation.Materials.Add */

import { useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'

import { IModelMaterialsValue } from '@/models/index.d'
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
  material: Omit<IModelMaterialsValue, 'uuid'>
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
  material: 'You need to define a material',
  selected: 'You need to select a solid',
  update: 'Unable to add material'
}

/**
 * On add
 * @param simulation Simulation
 * @param material Material
 * @param swr SWR
 */
export const _onAdd = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  material: Omit<IModelMaterialsValue, 'uuid'>,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    // New material
    const newMaterial = Utils.deepCopy(material) as IModelMaterialsValue

    // Set uuid
    newMaterial.uuid = uuid()

    // New simulation
    const newSimulation = Utils.deepCopy(simulation)

    // Update local
    const materials = newSimulation.scheme.configuration.materials!
    materials.values = [...(materials.values ?? []), newMaterial]

    // Diff
    const diff = {
      ...materials,
      done: true
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
 * @returns Add
 */
const Add = ({
  simulation,
  material,
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

      await _onAdd(simulation, material, swr)

      setLoading(false)
      onClose()
    } catch (err) {
      setLoading(false)
    }
  }, [simulation, material, swr, onError, onClose])

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
