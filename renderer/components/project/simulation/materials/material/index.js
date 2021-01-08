import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Radio, Space } from 'antd'

import DataBase from '../database'
import Formula from '../../../../assets/formula'
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

  console.log(materials)

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
        <Radio.Group>
          <Radio value={1}>
            <div>
              <DataBase onSelect={onMaterialSelect} />
              {current?.material?.label}
            </div>
          </Radio>
          <Radio value={2}>
            <div>
              <p>Custom material:</p>
              {materials.children.map((m) => {
                return (
                  <div>
                    <p>{m.label}</p>
                    {m.symbol}:
                    <Formula
                      defaultValue={m.default}
                      onChange={() => console.log('TODO')}
                    ></Formula>
                    {m.unit}
                  </div>
                )
              })}
            </div>
          </Radio>
        </Radio.Group>
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
