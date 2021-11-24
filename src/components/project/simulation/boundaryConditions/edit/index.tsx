import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'

import { ISimulation } from '@/database/index.d'
import { IModelBoundaryConditionValue } from '@/models/index.d'

import { Error } from '@/components/assets/notification'

import SimulationAPI from '@/api/simulation'

interface IProps {
  disabled?: boolean
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

  close: Function
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
  disabled,
  simulation,
  boundaryCondition,
  oldBoundaryCondition,
  geometry,
  swr,
  close
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On edit
   */
  const onEdit = async (): Promise<void> => {
    setLoading(true)

    try {
      // New simulation
      const newSimulation = { ...simulation }
      const boundaryConditions =
        newSimulation.scheme.configuration.boundaryConditions

      // Get type key
      const type = boundaryCondition.type.key

      // Get old type
      const oldType = oldBoundaryCondition.type.key

      if (oldType !== type) {
        //@ts-ignore
        const index = boundaryConditions[oldType].values.findIndex(
          (b: { uuid: string }) => b.uuid === oldBoundaryCondition.uuid
        )
        //@ts-ignore
        boundaryConditions[oldType].values = [
          //@ts-ignore
          ...boundaryConditions[oldType].values.slice(0, index),
          //@ts-ignore
          ...boundaryConditions[oldType].values.slice(index + 1)
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
        //@ts-ignore
        boundaryConditions[type].values = [
          //@ts-ignore
          ...boundaryConditions[type].values,
          boundaryCondition
        ]
      } else {
        //@ts-ignore
        const index = boundaryConditions[type].values.findIndex(
          (b: { uuid: string }) => b.uuid === boundaryCondition.uuid
        )
        //@ts-ignore
        boundaryConditions[type].values = [
          //@ts-ignore
          ...boundaryConditions[type].values.slice(0, index),
          boundaryCondition,
          //@ts-ignore
          ...boundaryConditions[type].values.slice(index + 1)
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
      close()
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
    <Button disabled={disabled} loading={loading} onClick={onEdit}>
      Edit
    </Button>
  )
}

Edit.propTypes = {
  disabled: PropTypes.bool,
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
  close: PropTypes.func.isRequired
}

export default Edit
