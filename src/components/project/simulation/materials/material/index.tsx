import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Space, Typography } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { IGeometry, ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

import { GoBack } from '@/components/assets/button'
import Formula from '@/components/assets/formula'
import Selector from '@/components/assets/selector'

import DataBase from '../database'
import Add from '../add'
import Edit from '../edit'

export interface IProps {
  visible: boolean
  simulation: ISimulation
  geometry: {
    solids: IGeometry['summary']['solids']
  }
  material?: IModelMaterialValue
  swr: {
    mutateOneSimulation: Function
  }
  onClose: () => void
}

/**
 * Material
 * @memberof Components.Project.Simulation.Materials
 * @param {Object} props Props
 */
const Material = ({
  visible,
  simulation,
  geometry,
  material,
  swr,
  onClose
}: IProps): JSX.Element => {
  // State
  const [current, setCurrent]: [IModelMaterialValue, Function] =
    useState(material)
  const [error, setError]: [string, Function] = useState()

  // Data
  const materials = simulation.scheme.configuration.materials

  // Edit
  useEffect(() => {
    if (material) setCurrent(material)
  }, [material])

  /**
   * On material select
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
  const onSelected = (selected: string[]) => {
    setCurrent({
      ...current,
      selected: selected.map((s) => ({
        uuid: s
      }))
    })
  }

  /**
   * Render
   */
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
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button danger onClick={onClose}>
            Cancel
          </Button>
          {material ? (
            <Edit
              material={{
                uuid: current.uuid,
                material: current.material,
                selected: current.selected
              }}
              simulation={{
                id: simulation.id,
                scheme: simulation.scheme
              }}
              geometry={{
                solids: geometry.solids
              }}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              onError={(desc) => setError(desc)}
              onClose={onClose}
            />
          ) : (
            <Add
              material={{
                material: current?.material,
                selected: current?.selected
              }}
              simulation={{
                id: simulation.id,
                scheme: simulation.scheme
              }}
              geometry={{
                solids: geometry.solids
              }}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              onError={(desc) => setError(desc)}
              onClose={onClose}
            />
          )}
        </div>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <GoBack onClick={onClose} />
        <Card size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <DataBase onSelect={onMaterialSelect} />
            <Typography.Text>{current?.material?.label}</Typography.Text>
            {materials.children?.map((child) => {
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

        <Selector
          geometry={{
            solids: geometry.solids
          }}
          updateSelected={onSelected}
        />

        {error && (
          <Typography.Text>
            <ExclamationCircleOutlined style={{ color: 'red' }} /> {error}
          </Typography.Text>
        )}
      </Space>
    </Drawer>
  )
}

Material.propTypes = {
  visible: PropTypes.bool,
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
  geometry: PropTypes.exact({
    solids: PropTypes.array.isRequired
  }).isRequired,
  material: PropTypes.exact({
    uuid: PropTypes.string.isRequired,
    material: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired
  }),
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Material
