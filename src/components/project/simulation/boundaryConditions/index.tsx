/** @module Components.Project.Simulation.BoundaryConditions */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react'
import { Card, Layout } from 'antd'

import { ISimulation } from '@/database/simulation/index'
import { IGeometry } from '@/database/geometry/index'
import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import { AddButton } from '@/components/assets/button'

import List from './list'
import BoundaryCondition from './boundaryCondition'

import { SelectContext } from '@/context/select'
import { enable, disable, setType, setPart } from '@/context/select/actions'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  geometry: IGeometry
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
  setVisible: (visible: boolean) => void
}

/**
 * Boundary conditions
 * @param props Props
 * @returns BoundaryConditions
 */
const BoundaryConditions = ({
  simulation,
  geometry,
  swr,
  setVisible
}: IProps): JSX.Element => {
  // State
  const [boundaryCondition, setBoundaryCondition]: [
    IModelBoundaryConditionValue,
    Dispatch<SetStateAction<IModelBoundaryConditionValue>>
  ] = useState()
  const [boundaryConditionVisible, setBoundaryConditionVisible]: [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ] = useState(false)

  // Context
  const { dispatch } = useContext(SelectContext)

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions

  // Part
  useEffect(() => {
    dispatch(setType(geometry.dimension === 2 ? 'edges' : 'faces'))
    dispatch(setPart(geometry.summary.uuid))
  }, [geometry, dispatch])

  /**
   * On add
   */
  const onAdd = useCallback((): void => {
    setBoundaryCondition(null)
    setBoundaryConditionVisible(true)
    setVisible(false)
    dispatch(enable())
  }, [dispatch, setVisible])

  /**
   * On edit
   * @param type Type
   * @param index Index
   */
  const onEdit = useCallback(
    (type: string, index: number): void => {
      const boundaryConditionType = boundaryConditions[
        type
      ] as IModelTypedBoundaryCondition
      const boundaryConditionToEdit = boundaryConditionType.values[index]
      setBoundaryCondition(boundaryConditionToEdit)

      setBoundaryConditionVisible(true)
      setVisible(false)
      dispatch(enable())
    },
    [boundaryConditions, dispatch, setVisible]
  )

  /**
   * On close
   */
  const onClose = useCallback((): void => {
    dispatch(disable())
    setBoundaryConditionVisible(false)
    setBoundaryCondition(null)
    setVisible(true)
  }, [dispatch, setVisible])

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <AddButton onAdd={onAdd} fullWidth={true} primary={false}>
            Add boundary condition
          </AddButton>
          <List
            simulation={{
              id: simulation.id,
              scheme: simulation.scheme
            }}
            swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
            onEdit={onEdit}
          />
          <BoundaryCondition
            visible={boundaryConditionVisible}
            simulation={{
              id: simulation.id,
              scheme: simulation.scheme
            }}
            geometry={{
              faces: geometry.summary.faces,
              edges: geometry.summary.edges
            }}
            boundaryCondition={
              boundaryCondition && {
                uuid: boundaryCondition.uuid,
                name: boundaryCondition.name,
                type: boundaryCondition.type,
                selected: boundaryCondition.selected,
                values: boundaryCondition.values
              }
            }
            swr={{
              mutateOneSimulation: swr.mutateOneSimulation
            }}
            onClose={onClose}
          />
        </Card>
      </Layout.Content>
    </Layout>
  )
}

BoundaryConditions.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  geometry: PropTypes.exact({
    id: PropTypes.string.isRequired,
    dimension: PropTypes.number.isRequired,
    summary: PropTypes.exact({
      uuid: PropTypes.string.isRequired,
      faces: PropTypes.array.isRequired,
      edges: PropTypes.array
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default BoundaryConditions
