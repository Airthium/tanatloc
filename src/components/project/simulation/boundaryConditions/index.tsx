/** @module Components.Project.Simulation.BoundaryConditions */

import { useState, useCallback, useMemo } from 'react'
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

import { AddButton } from '@/components/assets/button'
import Loading from '@/components/loading'

import List from './list'
import BoundaryCondition from './boundaryCondition'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface Props {
  simulation: Simulation
  geometries: Geometry[]
  swr: Swr
  setVisible: (visible: boolean) => void
}

/**
 * Boundary conditions
 * @param props Props
 * @returns BoundaryConditions
 */
const BoundaryConditions: React.FunctionComponent<Props> = ({
  simulation,
  geometries,
  swr,
  setVisible
}) => {
  // State
  const [boundaryCondition, setBoundaryCondition] =
    useState<IModelBoundaryConditionValue>()
  const [boundaryConditionVisible, setBoundaryConditionVisible] =
    useState<boolean>(false)

  // Boundary conditions
  const boundaryConditions = useMemo(
    () => simulation.scheme.configuration.boundaryConditions,
    [simulation]
  )

  // filtered geometries (reomve duplicated)
  const filteredGeometries = useMemo(() => {
    const filtered = geometries.reduce(
      (accumulator: Geometry[], current: Geometry) => {
        if (!accumulator.find((geometry) => geometry.id === current.id))
          accumulator.push(current)

        return accumulator
      },
      []
    )
    return filtered
  }, [geometries])

  /**
   * On add
   */
  const onAdd = useCallback((): void => {
    setBoundaryCondition(undefined)
    setBoundaryConditionVisible(true)
    setVisible(false)
  }, [setVisible])

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
    },
    [boundaryConditions, setVisible]
  )

  /**
   * On close
   */
  const onClose = useCallback((): void => {
    setBoundaryConditionVisible(false)
    setBoundaryCondition(undefined)
    setVisible(true)
  }, [setVisible])

  /**
   * Render
   */
  if (!filteredGeometries.length) return <Loading.Simple />
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <AddButton onAdd={onAdd} fullWidth={true}>
            Add boundary condition
          </AddButton>
          <List
            geometries={filteredGeometries}
            simulation={simulation}
            swr={swr}
            onEdit={onEdit}
          />
          {boundaryConditionVisible ? (
            <BoundaryCondition
              geometries={filteredGeometries}
              simulation={simulation}
              value={boundaryCondition}
              swr={swr}
              onClose={onClose}
            />
          ) : null}
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default BoundaryConditions
