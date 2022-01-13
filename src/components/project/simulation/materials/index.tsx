/** @module Components.Project.Simulation.Materials */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Layout, Space, Typography } from 'antd'

import { IGeometry, ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

import { AddButton } from '@/components/assets/button'
import List from './list'
import Material from './material'

import { useDispatch } from 'react-redux'
import { enable, disable, setType, setPart } from '@/store/select/action'

export interface IProps {
  geometry?: IGeometry
  simulation: ISimulation
  swr: {
    mutateOneSimulation: Function
  }
  setVisible: Function
}

/**
 * Materials
 * @memberof Components.Project.Simulation.Materials
 * @param props Props
 */
const Materials = ({
  geometry,
  simulation,
  swr,
  setVisible
}: IProps): JSX.Element => {
  // State
  const [material, setMaterial]: [IModelMaterialValue, Function] = useState()
  const [materialVisible, setMaterialVisible]: [boolean, Function] =
    useState(false)

  // Store
  const dispatch = useDispatch()

  // Data
  const materials = simulation?.scheme.configuration.materials

  // Part
  useEffect(() => {
    dispatch(setType('solids'))
    dispatch(setPart(geometry?.summary.uuid))
  }, [geometry])

  /**
   * On add
   */
  const onAdd = (): void => {
    setMaterial()
    setMaterialVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  /**
   * On edit
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
    setMaterial()
    dispatch(disable())
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <AddButton disabled={!geometry} onAdd={onAdd}>
            Add material
          </AddButton>
          {geometry ? (
            <>
              <List simulation={simulation} swr={swr} onEdit={onEdit} />
              <Material
                visible={materialVisible}
                simulation={simulation}
                geometry={{
                  solids: geometry.summary.solids
                }}
                materials={materials}
                material={material}
                swr={swr}
                close={onClose}
              />
            </>
          ) : (
            <Space>
              <Typography.Text>Please upload a geometry first</Typography.Text>
            </Space>
          )}
        </Card>
      </Layout.Content>
    </Layout>
  )
}

Materials.propTypes = {
  geometry: PropTypes.object,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array
        })
      })
    })
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default Materials
