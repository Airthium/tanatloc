import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Layout, Space, Typography } from 'antd'

import { AddButton } from '@/components/assets/button'
import List from './list'
import Material from './material'

import { useDispatch } from 'react-redux'
import { enable, disable, setType, setPart } from '@/store/select/action'

/**
 * Materials
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const Materials = ({ simulation, part, swr, setVisible }) => {
  // State
  const [material, setMaterial] = useState()
  const [materialVisible, setMaterialVisible] = useState(false)

  // Store
  const dispatch = useDispatch()

  // Data
  const materials = simulation?.scheme?.configuration?.materials

  // Part
  useEffect(() => {
    dispatch(setType('solids'))
    dispatch(setPart(part?.uuid))
  }, [part])

  /**
   * On add
   */
  const onAdd = () => {
    setMaterial()
    setMaterialVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  /**
   * On edit
   */
  const onEdit = (index) => {
    const materialToEdit = materials.values[index]
    setMaterial(materialToEdit)

    setMaterialVisible(true)
    setVisible(false)
    dispatch(enable())
  }

  /**
   * On close
   */
  const onClose = () => {
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
        <AddButton disabled={!part} onAdd={onAdd}>
          Add material
        </AddButton>
        {part ? (
          <>
            <List simulation={simulation} swr={swr} onEdit={onEdit} />
            <Material
              visible={materialVisible}
              simulation={simulation}
              part={part}
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
      </Layout.Content>
    </Layout>
  )
}

Materials.propTypes = {
  simulation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        materials: PropTypes.shape({
          values: PropTypes.array
        })
      })
    })
  }).isRequired,
  part: PropTypes.object,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default Materials
