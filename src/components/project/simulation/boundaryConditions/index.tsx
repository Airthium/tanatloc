/** @module Components.Project.Simulation.BoundaryConditions */

import { useState, useCallback, useContext, useMemo } from 'react'
import { Card, Layout } from 'antd'

import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'
import {
  IFrontGeometriesItem,
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import { SelectContext } from '@/context/select'
import { enable, disable, setType } from '@/context/select/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { AddButton } from '@/components/assets/button'
import Loading from '@/components/loading'

import List from './list'
import BoundaryCondition from './boundaryCondition'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  geometries: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
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
  geometries,
  swr,
  setVisible
}: IProps): JSX.Element => {
  // State
  const [boundaryCondition, setBoundaryCondition] =
    useState<IModelBoundaryConditionValue>()
  const [boundaryConditionVisible, setBoundaryConditionVisible] =
    useState<boolean>(false)

  // Context
  const { dispatch } = useContext(SelectContext)

  // Data
  const boundaryConditions = useMemo(
    () => simulation.scheme.configuration.boundaryConditions,
    [simulation]
  )

  // Part
  useCustomEffect(
    () => {
      if (geometries[0]?.summary) {
        dispatch(
          setType(geometries[0].summary.dimension === 2 ? 'edges' : 'faces')
        )
      }
    },
    [geometries],
    [dispatch]
  )

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
  if (!geometries.length) return <Loading.Simple />
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <AddButton onAdd={onAdd} fullWidth={true} primary={false}>
            Add boundary condition
          </AddButton>
          <List
            geometries={geometries.map((geometry) => ({
              id: geometry.id,
              summary: geometry.summary
            }))}
            simulation={{
              id: simulation.id,
              scheme: simulation.scheme
            }}
            swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
            onEdit={onEdit}
          />
          <BoundaryCondition
            visible={boundaryConditionVisible}
            geometries={geometries.map((geometry) => ({
              id: geometry.id,
              name: geometry.name,
              summary: geometry.summary
            }))}
            simulation={{
              id: simulation.id,
              scheme: simulation.scheme
            }}
            boundaryCondition={
              boundaryCondition && {
                uuid: boundaryCondition.uuid,
                name: boundaryCondition.name,
                type: boundaryCondition.type,
                geometry: boundaryCondition.geometry,
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
