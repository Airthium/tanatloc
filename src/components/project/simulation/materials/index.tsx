/** @module Components.Project.Simulation.Materials */

import { useState, useCallback, useContext, useMemo } from 'react'
import { Card, Layout } from 'antd'

import { IModelMaterialsValue } from '@/models/index.d'
import {
  IFrontGeometriesItem,
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { AddButton } from '@/components/assets/button'
import Loading from '@/components/loading'

import { SelectContext } from '@/context/select'
import { setType } from '@/context/select/actions'

import List from './list'
import Material from './material'

/**
 * Props
 */
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface Props {
  geometries: Geometry[]
  simulation: Simulation
  swr: Swr
  setVisible: (visible: boolean) => void
}

/**
 * Materials
 * @param props Props
 * @returns Materials
 */
const Materials: React.FunctionComponent<Props> = ({
  geometries,
  simulation,
  swr,
  setVisible
}) => {
  // State
  const [material, setMaterial] = useState<IModelMaterialsValue>()
  const [materialVisible, setMaterialVisible] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(SelectContext)

  // Materials
  const materials = useMemo(
    () => simulation.scheme.configuration.materials!,
    [simulation]
  )

  // Filtered geometries (remove duplicated)
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

  // Part selection
  useCustomEffect(
    () => {
      if (filteredGeometries[0]?.summary) {
        dispatch(
          setType(
            filteredGeometries[0].summary.dimension === 2 ? 'faces' : 'solids'
          )
        )
      }
    },
    [filteredGeometries],
    [dispatch]
  )

  /**
   * On add
   */
  const onAdd = useCallback((): void => {
    setMaterial(undefined)
    setMaterialVisible(true)
    setVisible(false)
  }, [setVisible])

  /**
   * On edit
   * @param index Index
   */
  const onEdit = useCallback(
    (index: number): void => {
      const materialToEdit = materials.values![index]
      setMaterial(materialToEdit)
      setMaterialVisible(true)
      setVisible(false)
    },
    [materials, setVisible]
  )

  /**
   * On close
   */
  const onClose = useCallback((): void => {
    setMaterialVisible(false)
    setMaterial(undefined)
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
          <AddButton onAdd={onAdd} fullWidth={true} primary={false}>
            Add material
          </AddButton>
          <List
            geometries={filteredGeometries.map((geometry) => ({
              id: geometry.id,
              summary: geometry.summary
            }))}
            simulation={{
              id: simulation.id,
              scheme: simulation.scheme
            }}
            swr={swr}
            onEdit={onEdit}
          />
          <Material
            visible={materialVisible}
            geometries={filteredGeometries.map((geometry) => ({
              id: geometry.id,
              name: geometry.name,
              summary: geometry.summary
            }))}
            simulation={{
              id: simulation.id,
              scheme: simulation.scheme
            }}
            material={
              material && {
                uuid: material.uuid,
                material: material.material,
                geometry: material.geometry,
                selected: material.selected
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

export default Materials
