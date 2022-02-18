import PropTypes from 'prop-types'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { IGeometry, ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  material: Omit<IModelMaterialValue, 'uuid'>
  simulation: ISimulation
  geometry: {
    solids: IGeometry['summary']['solids']
  }
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
  onError: (desc?: string) => void
  onClose: () => void
}

/**
 * Errors (add)
 * @memberof Components.Project.Simulation.Materials
 */
const errors = {
  material: 'You need to define a material',
  selected: 'You need to select a solid',
  updateError: 'Unable to add the material'
}

/**
 * Add material
 * @memberof Components.Project.Simulation.Materials
 * @param props Props
 */
const Add = ({
  material,
  simulation,
  geometry,
  swr,
  onError,
  onClose
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On add
   */
  const onAdd = async (): Promise<void> => {
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

      // New material
      const newMaterial = { ...material } as IModelMaterialValue

      // Set uuid
      newMaterial.uuid = uuid()

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
      newMaterial.selected = selection

      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const materials = newSimulation.scheme.configuration.materials
      materials.values = [...(materials.values || []), newMaterial]

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

      // Local
      swr.mutateOneSimulation(newSimulation)

      // Stop loading
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
    <AddButton loading={loading} onAdd={onAdd} needMargin={true}>
      Add
    </AddButton>
  )
}

Add.propTypes = {
  material: PropTypes.exact({
    material: PropTypes.object,
    selected: PropTypes.array
  }).isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array
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

export default Add
