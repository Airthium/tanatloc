import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Space, Typography } from 'antd'

import Formula from '@/components/assets/formula'
import Selector from '@/components/assets/selector'

import DataBase from '../database'
import Add from '../add'
import Edit from '../edit'

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

  /**
   *
   * @param {Object} currentMaterial Current material
   */
  const onMaterialSelect = (currentMaterial) => {
    setCurrent({
      ...current,
      material: currentMaterial
    })
  }

  /**
   * On select
   * @param {Object} selected Selected
   */
  const onSelected = (selected) => {
    setCurrent({
      ...current,
      selected
    })
  }

  /**
   * On close
   */
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
        <Space direction="vertical">
          <DataBase onSelect={onMaterialSelect} />
          <Typography.Text>{current?.material?.label}</Typography.Text>
          {materials?.children?.map((child) => {
            const m = current?.material?.children?.find(
              (c) => c.symbol === child.name
            )
            if (m)
              return (
                <Formula
                  key={m.symbol}
                  defaultValue={m.value}
                  unit={child.unit}
                  onValueChange={(val) => {
                    m.value = val
                  }}
                />
              )
          })}
        </Space>
      </Card>
      <Selector part={part} updateSelected={onSelected} />
      <Space>
        <Button type="danger" onClick={onClose}>
          Cancel
        </Button>
        {material ? (
          <Edit
            disabled={disabled}
            material={current}
            project={project}
            simulation={simulation}
            part={part}
            close={onClose}
          />
        ) : (
          <Add
            disabled={disabled}
            material={current}
            project={project}
            simulation={simulation}
            part={part}
            close={onClose}
          />
        )}
      </Space>
    </Drawer>
  )
}

export default Material
