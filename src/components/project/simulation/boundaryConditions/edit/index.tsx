/** @module Components.Project.Simulation.BoundaryConditions.Edit */

import PropTypes from 'prop-types'
import { useState } from 'react'

import { IGeometry, ISimulation } from '@/database/index.d'
import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import { EditButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  primary?: boolean
  needMargin?: boolean
  boundaryCondition: IModelBoundaryConditionValue
  oldBoundaryCondition: IModelBoundaryConditionValue
  simulation: ISimulation
  geometry: {
    faces: IGeometry['summary']['faces']
  }
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }

  onError: (desc?: string) => void
  onClose: () => void
}

/**
 * Errors (edit)
 */
const errors = {
  name: 'You need to define a name',
  type: 'You need to select a type',
  selected: 'You need to select a face',
  updateError: 'Unable to edit the boundary condition'
}

/**
 * Edit boundary condition
 * @param props Props
 */
const Edit = ({
  primary = false,
  needMargin = false,
  boundaryCondition,
  oldBoundaryCondition,
  simulation,
  geometry,
  swr,
  onError,
  onClose
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On edit
   */
  const onEdit = async (): Promise<void> => {
    setLoading(true)

    try {
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

      // New simulation
      const newSimulation = { ...simulation }
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
        const index = oldtypedBoundaryCondition.values.findIndex(
          (b) => b.uuid === oldBoundaryCondition.uuid
        )
        oldtypedBoundaryCondition.values = [
          ...oldtypedBoundaryCondition.values.slice(0, index),
          ...oldtypedBoundaryCondition.values.slice(index + 1)
        ]
      }

      // Modify selection
      const selection = geometry.faces
        .map((f) => {
          if (boundaryCondition.selected.find((b) => b.uuid === f.uuid))
            return {
              uuid: f.uuid,
              label: f.number
            }
        })
        .filter((s) => s)
      boundaryCondition.selected = selection

      // Update local
      if (oldType !== type) {
        // Add if different type
        const typedBoundaryCondition = boundaryConditions[
          type
        ] as IModelTypedBoundaryCondition
        typedBoundaryCondition.values = [
          ...typedBoundaryCondition.values,
          boundaryCondition
        ]
      } else {
        // Replace if same type
        const typedBoundaryCondition = boundaryConditions[
          type
        ] as IModelTypedBoundaryCondition
        const index = typedBoundaryCondition.values.findIndex(
          (b) => b.uuid === boundaryCondition.uuid
        )
        typedBoundaryCondition.values = [
          ...typedBoundaryCondition.values.slice(0, index),
          boundaryCondition,
          ...typedBoundaryCondition.values.slice(index + 1)
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
    <EditButton
      loading={loading}
      onEdit={onEdit}
      primary={primary}
      needMargin={needMargin}
    >
      Edit
    </EditButton>
  )
}

Edit.propTypes = {
  primary: PropTypes.bool,
  needMargin: PropTypes.bool,
  boundaryCondition: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.exact({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      children: PropTypes.array
    }),
    selected: PropTypes.array,
    values: PropTypes.array
  }).isRequired,
  oldBoundaryCondition: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string,
    type: PropTypes.exact({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      children: PropTypes.array
    }),
    selected: PropTypes.array,
    values: PropTypes.array
  }).isRequired,
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  geometry: PropTypes.shape({
    faces: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onError: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Edit
