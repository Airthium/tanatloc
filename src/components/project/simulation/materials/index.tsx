/** @module Components.Project.Simulation.Materials */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Card, Layout } from 'antd'

import { IGeometry, ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

import { AddButton } from '@/components/assets/button'
import List from './list'
import Material from './material'

import { useDispatch } from 'react-redux'
import { enable, disable, setType, setPart } from '@/store/select/action'

export interface IProps {
  geometry: IGeometry
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
  setVisible: (visible: boolean) => void
}

/**
 * Materials
 * @param props Props
 */
const Materials = ({
  geometry,
  simulation,
  swr,
  setVisible
}: IProps): JSX.Element => {
  // State
  const [material, setMaterial]: [
    IModelMaterialValue,
    Dispatch<SetStateAction<IModelMaterialValue>>
  ] = useState()
  const [materialVisible, setMaterialVisible]: [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ] = useState(false)

  // Store
  const dispatch = useDispatch()

  // Data
  const materials = simulation.scheme.configuration.materials

  // Part
  useEffect(() => {
    dispatch(setType('solids'))
    dispatch(setPart(geometry.summary.uuid))
  }, [geometry])

  /**
   * On add
   */
  const onAdd = (): void => {
    setMaterial(null)
    setMaterialVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  /**
   * On edit
   * @param index Index
   */
  const onEdit = (index: number): void => {
    const materialToEdit = materials.values[index]
    setMaterial(materialToEdit)

    setMaterialVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  /**
   * On close
   */
  const onClose = (): void => {
    setMaterialVisible(false)
    setVisible(true)
    setMaterial(null)
    dispatch(disable())
  }

  /**
   * Render
   */
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
            simulation={{
              id: simulation.id,
              scheme: simulation.scheme
            }}
            geometry={{
              solids: geometry.summary.solids
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

Materials.propTypes = {
  geometry: PropTypes.exact({
    id: PropTypes.string.isRequired,
    summary: PropTypes.exact({
      uuid: PropTypes.string.isRequired,
      solids: PropTypes.array.isRequired
    }).isRequired
  }).isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          children: PropTypes.array,
          values: PropTypes.array
        }).isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default Materials
