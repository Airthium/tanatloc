import { useState } from 'react'
import { Button, Card, Drawer, Space } from 'antd'

import DataBase from '../database'
import Selector from '../../../../assets/selector'

const Material = ({
  project,
  simulation,
  visible,
  part,
  materials,
  material,
  close
}) => {
  const [current, setCurrent] = useState()

  const onMaterialSelect = (material) => {
    setCurrent({
      ...current,
      material
    })
  }

  const onSelected = (selected) => {
    setCurrent({
      ...current,
      selected
    })
  }

  const onClose = () => {
    close()
  }

  return (
    <Drawer
      title="Material"
      placement="left"
      closable={false}
      visible={visible}
      mask={false}
      maskClosable={false}
      width={300}
    >
      <Card>
        <DataBase onSelect={onMaterialSelect} />
        {current?.material?.label}
      </Card>
      <Selector part={part} updateSelected={onSelected} />
      <Space>
        <Button type="danger" onClick={onClose}>
          Cancel
        </Button>
      </Space>
    </Drawer>
  )
}

export default Material
