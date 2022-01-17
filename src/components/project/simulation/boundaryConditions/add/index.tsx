import PropTypes from 'prop-types'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { IGeometry, ISimulation } from '@/database/index.d'
import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import { Error } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  boundaryCondition: Omit<IModelBoundaryConditionValue, 'uuid'>
  simulation: ISimulation
  geometry: {
    faces: IGeometry['summary']['faces']
  }
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
  onError: (desc: string) => void
  onClose: () => void
}

/**
 * Errors (add)
 * @memberof Components.Project.Simulation.BoundaryConditions
 */
const errors = {
  name: 'You need to define a name',
  type: 'You need to select a type',
  selected: 'You need to select a face',
  updateError: 'Unable to add the boundary condition'
}

/**
 * Add boundary condition
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param props Props
 */
const Add = ({
  simulation,
  boundaryCondition,
  geometry,
  swr,
  onError,
  onClose
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * on Add
   */
  const onAdd = async () => {
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

      // New boundary condition
      const newBoundaryCondition = {
        ...boundaryCondition
      } as IModelBoundaryConditionValue

      // Get type key
      const type = newBoundaryCondition.type.key

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
      newBoundaryCondition.selected = selection

      // Set uuid
      newBoundaryCondition.uuid = uuid()

      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions
      const TypedBoundaryCondition = boundaryConditions[
        type
      ] as IModelTypedBoundaryCondition
      TypedBoundaryCondition.values = [
        ...(TypedBoundaryCondition.values || []),
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

      // Local
      swr.mutateOneSimulation(newSimulation)

      // Stop loading
      setLoading(false)

      // Close
      onClose()
    } catch (err) {
      Error(errors.updateError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <AddButton loading={loading} onAdd={onAdd}>
      Add
    </AddButton>
  )
}

Add.propTypes = {
  boundaryCondition: PropTypes.shape({
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

export default Add
