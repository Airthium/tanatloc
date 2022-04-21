/** @module Components.Project.Simulation.Materials.Edit */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'

import { ISimulation } from '@/database/simulation/index'
import { IModelMaterialValue } from '@/models/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import { EditButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  material: IModelMaterialValue
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
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
  update: 'Unable to edit the material'
}

/**
 * On edit
 * @param simulation Simulation
 * @param material Material
 * @param swr SWR
 */
export const onEdit = async (
  simulation: IProps['simulation'],
  material: IProps['material'],
  swr: IProps['swr']
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = { ...simulation }
    const materials = newSimulation.scheme.configuration.materials

    // Update local
    const index = materials.values.findIndex(
      (m: { uuid: string }) => m.uuid === material.uuid
    )
    materials.values = [
      ...materials.values.slice(0, index),
      material,
      ...materials.values.slice(index + 1)
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
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Edit material
 * @param props Props
 */
const Edit = ({
  simulation,
  material,
  swr,
  onError,
  onClose
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

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

          await onEdit(simulation, material, swr)

          // Close
          setLoading(false)
          onClose()
        } catch (err) {
          setLoading(true)
        }
      }}
    >
      Edit
    </EditButton>
  )
}

Edit.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  material: PropTypes.exact({
    uuid: PropTypes.string.isRequired,
    material: PropTypes.object,
    selected: PropTypes.array
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Edit
