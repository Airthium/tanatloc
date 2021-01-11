import { useState, useEffect } from 'react'
import { Button, Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import { AddButton } from '../../../assets/button'
import List from './list'
import Material from './material'

import { useDispatch } from 'react-redux'
import {
  enable,
  disable,
  setType,
  setPart
} from '../../../../store/select/action'

const Materials = ({ project, simulation, part, setVisible }) => {
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
  const onEdit = () => {}

  /**
   * On close
   */
  const onClose = () => {
    setMaterialVisible(false)
    setVisible(true)
    setMaterial()
    dispatch(disable())
  }

  return (
    <Layout>
      <Layout.Content>
        <AddButton icon={<PlusCircleOutlined />} onAdd={onAdd}>
          Add material
        </AddButton>
        <List project={project} simulation={simulation} onEdit={onEdit} />
        <Material
          project={project}
          simulation={simulation}
          visible={materialVisible}
          part={part}
          materials={materials}
          material={material}
          close={onClose}
        />
      </Layout.Content>
    </Layout>
  )
}

export default Materials
