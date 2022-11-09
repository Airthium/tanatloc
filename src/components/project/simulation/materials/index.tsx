/** @module Components.Project.Simulation.Materials */

import { useState, useEffect, useCallback, useContext } from 'react'
import { Card, Layout } from 'antd'

import { IModelMaterialsValue } from '@/models/index.d'

import { AddButton } from '@/components/assets/button'
import Loading from '@/components/loading'

import { SelectContext } from '@/context/select'
import { enable, disable, setType } from '@/context/select/actions'

import {
  IFrontGeometriesItem,
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import List from './list'
import Material from './material'

/**
 * Props
 */
export interface IProps {
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
  setVisible: (visible: boolean) => void
}

/**
 * Materials
 * @param props Props
 * @returns Materials
 */
const Materials = ({
  geometries,
  simulation,
  swr,
  setVisible
}: IProps): JSX.Element => {
  // State
  const [material, setMaterial] = useState<IModelMaterialsValue>()
  const [materialVisible, setMaterialVisible] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(SelectContext)

  // Data
  const materials = simulation.scheme.configuration.materials!

  // Part
  useEffect(() => {
    if (geometries[0]?.summary) {
      dispatch(
        setType(geometries[0].summary.dimension === 2 ? 'faces' : 'solids')
      )
    }
  }, [geometries, dispatch])

  /**
   * On add
   */
  const onAdd = useCallback((): void => {
    setMaterial(undefined)
    setMaterialVisible(true)
    setVisible(false)
    dispatch(enable())
  }, [dispatch, setVisible])

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
      dispatch(enable())
    },
    [materials, dispatch, setVisible]
  )

  /**
   * On close
   */
  const onClose = useCallback((): void => {
    dispatch(disable())
    setMaterialVisible(false)
    setMaterial(undefined)
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
            Add material
          </AddButton>
          <List
            simulation={{
              id: simulation.id,
              scheme: simulation.scheme
            }}
            swr={swr}
            onEdit={onEdit}
          />
          <Material
            visible={materialVisible}
            geometries={geometries.map((geometry) => ({
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
