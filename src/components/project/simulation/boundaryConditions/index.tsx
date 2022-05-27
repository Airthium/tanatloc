/** @module Components.Project.Simulation.BoundaryConditions */

import { useState, useEffect, useCallback, useContext } from 'react'
import { Card, Layout } from 'antd'

import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import { AddButton } from '@/components/assets/button'
import Loading from '@/components/loading'

import { SelectContext } from '@/context/select'
import { enable, disable, setType } from '@/context/select/actions'

import {
  IFrontGeometriesItem,
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import List from './list'
import BoundaryCondition from './boundaryCondition'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  geometry?: Pick<IFrontGeometriesItem, 'id'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
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
  const [boundaryCondition, setBoundaryCondition] =
    useState<IModelBoundaryConditionValue>()
  const [boundaryConditionVisible, setBoundaryConditionVisible] =
    useState<boolean>(false)

  // Context
  const { summary, dispatch } = useContext(SelectContext)

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions

  // Part
  useEffect(() => {
    if (summary) {
      dispatch(setType(summary.dimension === 2 ? 'edges' : 'faces'))
    }
  }, [summary, dispatch])

  /**
   * On add
   */
  const onAdd = useCallback((): void => {
    setBoundaryCondition(undefined)
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
      const boundaryConditionToEdit = boundaryConditionType.values![index]
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
    setBoundaryCondition(undefined)
    setVisible(true)
  }, [dispatch, setVisible])

  /**
   * Render
   */
  if (!geometry) return <Loading.Simple />
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

export default BoundaryConditions
