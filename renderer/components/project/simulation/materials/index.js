import { useState, useEffect } from 'react'
import { Button, Layout } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

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
    dispatch(setType('solid'))
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
        <Button icon={<PlusCircleOutlined />} onClick={onAdd} />
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
