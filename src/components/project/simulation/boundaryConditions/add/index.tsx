import PropTypes from 'prop-types'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

import { IGeometry, ISimulation } from '@/database/index.d'
import {
  IModelBoundaryCondition,
  IModelBoundaryConditionValue
} from '@/models/index.d'

import { Error } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  disabled?: boolean
  simulation: ISimulation
  boundaryCondition: IModelBoundaryConditionValue
  geometry: {
    faces: IGeometry['summary']['faces']
  }
  swr: {
    mutateOneSimulation: Function
  }
  onError: (desc: string) => void
  onClose: () => void
}

/**
 * Errors (add)
 * @memberof Components.Project.Simulation.BoundaryConditions
 */
const errors = {
  updateError: 'Unable to add the boundary condition'
}

/**
 * Add boundary condition
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param props Props
 */
const Add = ({
  disabled,
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
      if (!boundaryCondition.type?.key) {
        onError('You need to select a type')
        setLoading(false)
        return
      }

      if (!boundaryCondition.selected?.length) {
        onError('You need to select a face')
        setLoading(false)
        return
      }

      // Get type key
      const type = boundaryCondition.type.key

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

      // Set uuid
      boundaryCondition.uuid = uuid()

      // New simulation
      const newSimulation = { ...simulation }

      // Update local
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions
      const boundaryConditionType = boundaryConditions[type] as {
        label: string
        refineFactor?: number
        children?: IModelBoundaryCondition[]
        values?: IModelBoundaryConditionValue[]
      }
      boundaryConditionType.values = [
        ...(boundaryConditionType.values || []),
        boundaryCondition
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
    <AddButton disabled={disabled} loading={loading} onAdd={onAdd}>
      Add
    </AddButton>
  )
}

Add.propTypes = {
  disabled: PropTypes.bool,
  simulation: PropTypes.shape({
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  boundaryCondition: PropTypes.shape({
    selected: PropTypes.array
  }),
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
