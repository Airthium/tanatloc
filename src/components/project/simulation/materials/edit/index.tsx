import PropTypes from 'prop-types'
import { useState } from 'react'

import { IGeometry, ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'
import { EditButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  material: IModelMaterialValue
  simulation: ISimulation
  geometry: {
    solids: IGeometry['summary']['solids']
  }
  swr: {
    mutateOneSimulation: Function
  }
  onError: (desc?: string) => void
  onClose: () => void
}

/**
 * Errors (edit)
 * @memberof Components.Project.Simulation.Materials
 */
const errors = {
  material: 'You need to define a material',
  selected: 'You need to select a solid',
  updateError: 'Unable to edit the material'
}

/**
 * Edit material
 * @memberof Components.Project.Simulation.Materials
 * @param props Props
 */
const Edit = ({
  material,
  simulation,
  geometry,
  swr,
  onError,
  onClose
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  console.log(material)

  /**
   * On edit
   */
  const onEdit = async (): Promise<void> => {
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

      // New simulation
      const newSimulation = { ...simulation }
      const materials = newSimulation.scheme.configuration.materials

      // Modify selection
      const selection = geometry.solids
        .map((s) => {
          if (material.selected.find((m) => m.uuid === s.uuid))
            return {
              uuid: s.uuid,
              label: s.number
            }
        })
        .filter((s) => s)
      material.selected = selection

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

      // Loading
      setLoading(false)

      // Close
      onClose()
    } catch (err) {
      ErrorNotification(errors.updateError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <EditButton loading={loading} onEdit={onEdit}>
      Edit
    </EditButton>
  )
}

Edit.propTypes = {
  material: PropTypes.exact({
    uuid: PropTypes.string.isRequired,
    material: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired
  }).isRequired,
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
  geometry: PropTypes.exact({
    solids: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Edit
