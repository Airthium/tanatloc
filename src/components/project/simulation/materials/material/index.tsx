import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Space, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'

import { GoBack } from '@/components/assets/button'
import Formula from '@/components/assets/formula'
import Selector from '@/components/assets/selector'

import DataBase from '../database'
import Add from '../add'
import Edit from '../edit'

interface IProps {
  visible: boolean
  simulation: ISimulation
  geometry: {
    solids: {
      uuid: string
      number: number
    }[]
  }
  materials: { children: { name: string; unit: string }[] }
  material?: {
    uuid: string
    selected: {}[]
  }
  swr: {
    mutateOneSimulation: Function
  }
  close: Function
}

/**
 * Material
 * @memberof Components.Project.Simulation.Materials
 * @param {Object} props Props `{ visible, simulation, geometry, materials, material, swr, close }`
 */
const Material = ({
  visible,
  simulation,
  geometry,
  materials,
  material,
  swr,
  close
}: IProps): JSX.Element => {
  // State
  const [current, setCurrent]: [
    {
      uuid: string
      material?: {
        label: string
        children: {
          symbol: string
          value: string
        }[]
      }
      selected: {}[]
    },
    Function
  ] = useState(material)
  const [disabled, setDisabled]: [boolean, Function] = useState(true)

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
      className="material"
      title="Material"
      placement="left"
      closable={false}
      visible={visible}
      mask={false}
      maskClosable={false}
      width={300}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <GoBack onClick={onClose} />
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
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
        <Selector geometry={geometry} updateSelected={onSelected} />
        <Space
          direction="horizontal"
          style={{ width: '100%', justifyContent: 'flex-end' }}
        >
          <Button danger onClick={onClose}>
            Cancel
          </Button>
          {material ? (
            <Edit
              disabled={disabled}
              material={current}
              simulation={simulation}
              geometry={geometry}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              close={onClose}
            />
          ) : (
            <Add
              disabled={disabled}
              material={current}
              simulation={simulation}
              geometry={geometry}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              close={onClose}
            />
          )}
        </Space>
      </Space>
    </Drawer>
  )
}

Material.propTypes = {
  visible: PropTypes.bool,
  simulation: PropTypes.object.isRequired,
  geometry: PropTypes.object.isRequired,
  materials: PropTypes.object.isRequired,
  material: PropTypes.object,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired
}

export default Material
