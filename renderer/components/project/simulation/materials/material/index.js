import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Space } from 'antd'

import DataBase from '../database'
import Selector from '../../../../assets/selector'
import Add from '../add'

const Material = ({
  project,
  simulation,
  visible,
  part,
  materials,
  material,
  close
}) => {
  // State
  const [current, setCurrent] = useState()
  const [disabled, setDisabled] = useState(true)

  // Edit
  useEffect(() => {
    if (material) setCurrent(material)
  }, [material])

  // Disabled
  useEffect(() => {
    if (!current || !current.material || !current.selected?.length)
      setDisabled(true)
    else setDisabled(false)
  }, [current])

  const onMaterialSelect = (currentMaterial) => {
    setCurrent({
      ...current,
      material: currentMaterial
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
        <Add
          disabled={disabled}
          material={current}
          oriject={project}
          simulation={simulation}
          part={part}
          close={onClose}
        />
      </Space>
    </Drawer>
  )
}

export default Material
