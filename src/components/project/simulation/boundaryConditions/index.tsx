/** @module Components.Project.Simulation.BoundaryConditions */

import PropTypes from 'prop-types'
import { useState, useEffect, useCallback } from 'react'
import { Card, Layout } from 'antd'

import { IGeometry, ISimulation } from '@/database/index.d'
import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import { AddButton } from '@/components/assets/button'

import List from './list'
import BoundaryCondition from './boundaryCondition'

import { useDispatch } from 'react-redux'
import { enable, disable, setType, setPart } from '@/store/select/action'

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
    Function
  ] = useState()
  const [boundaryConditionVisible, setBoundaryConditionVisible]: [
    boolean,
    Function
  ] = useState(false)

  // Store
  const dispatch = useDispatch()

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions

  // Part
  useEffect(() => {
    dispatch(setType('faces'))
    dispatch(setPart(geometry.summary.uuid))
  }, [geometry, dispatch])

  /**
   * On add
   */
  const onAdd = useCallback((): void => {
    setBoundaryCondition()
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
    setBoundaryConditionVisible(false)
    setVisible(true)
    setBoundaryCondition()
    dispatch(disable())
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
              faces: geometry.summary.faces
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
    summary: PropTypes.exact({
      uuid: PropTypes.string.isRequired,
      faces: PropTypes.array.isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default BoundaryConditions
