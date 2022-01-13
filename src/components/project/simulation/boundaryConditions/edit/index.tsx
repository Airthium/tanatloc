import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'

import { ISimulation } from '@/database/index.d'
import {
  IModelBoundaryCondition,
  IModelBoundaryConditionValue
} from '@/models/index.d'

import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  simulation: ISimulation
  boundaryCondition: IModelBoundaryConditionValue
  oldBoundaryCondition: IModelBoundaryConditionValue
  geometry: {
    faces: {
      uuid: string
      number: number
    }[]
  }
  swr: {
    mutateOneSimulation: Function
  }

  onError: (desc: string) => void
  onClose: () => void
}

/**
 * Errors (edit)
 * @memberof Components.Project.Simulation.BoundaryConditions
 */
const errors = {
  updateError: 'Unable to edit the boundary condition'
}

/**
 * Edit boundary condition
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param props Props
 */
const Edit = ({
  simulation,
  boundaryCondition,
  oldBoundaryCondition,
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
      // New simulation
      const newSimulation = { ...simulation }
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions

      // Get type key
      const type = boundaryCondition.type.key

      // Get old type
      const oldType = oldBoundaryCondition.type.key

      if (oldType !== type) {
        const oldtypedBoundaryCondition = boundaryConditions[oldType] as {
          label: string
          refineFactor?: number
          children?: IModelBoundaryCondition[]
          values?: IModelBoundaryConditionValue[]
        }
        const index = oldtypedBoundaryCondition.values.findIndex(
          (b: { uuid: string }) => b.uuid === oldBoundaryCondition.uuid
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
        const typedBoundaryCondition = boundaryConditions[type] as {
          label: string
          refineFactor?: number
          children?: IModelBoundaryCondition[]
          values?: IModelBoundaryConditionValue[]
        }
        typedBoundaryCondition.values = [
          ...typedBoundaryCondition.values,
          boundaryCondition
        ]
      } else {
        const typedBoundaryCondition = boundaryConditions[type] as {
          label: string
          refineFactor?: number
          children?: IModelBoundaryCondition[]
          values?: IModelBoundaryConditionValue[]
        }
        const index = typedBoundaryCondition.values.findIndex(
          (b: { uuid: string }) => b.uuid === boundaryCondition.uuid
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

      // Close
      onClose()
    } catch (err) {
      Error(errors.updateError, err)
    } finally {
      setLoading(false)
    }
  }
  /**
   * Render
   */
  return (
    <Button loading={loading} onClick={onEdit}>
      Edit
    </Button>
  )
}

Edit.propTypes = {
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  boundaryCondition: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    type: PropTypes.shape({
      key: PropTypes.string.isRequired
    }).isRequired,
    selected: PropTypes.array.isRequired
  }).isRequired,
  oldBoundaryCondition: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    type: PropTypes.shape({
      key: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  geometry: PropTypes.shape({
    faces: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Edit
