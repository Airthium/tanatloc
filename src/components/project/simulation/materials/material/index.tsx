import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Space, Typography } from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import { IGeometry, ISimulation } from '@/database/index.d'
import { IModelMaterialValue } from '@/models/index.d'

import Formula from '@/components/assets/formula'
import Selector from '@/components/assets/selector'
import { CancelButton } from '@/components/assets/button'

import DataBase, { IMaterialDatabase } from '../database'
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
    mutateOneSimulation: (simulation: ISimulation) => void
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
  const [alreadySelected, setAlreadySelected]: [
    { label: string; selected: { uuid: string }[] }[],
    Function
  ] = useState()
  const [current, setCurrent]: [IModelMaterialValue, Function] = useState()
  const [error, setError]: [string, Function] = useState()

  // Data
  const materials = simulation.scheme.configuration.materials

  // Edit
  useEffect(() => {
    if (material) setCurrent(material)
  }, [material])

  // Already selected
  useEffect(() => {
    const currentAlreadySelected = materials?.values
      ?.map((m) => {
        if (m.uuid === material?.uuid) return
        return {
          label: m.material.label,
          selected: m.selected
        }
      })
      .filter((s) => s)
    setAlreadySelected(currentAlreadySelected)
  }, [simulation, material])

  /**
   * On material select
   * @param {Object} currentMaterial Current material
   */
  const onMaterialSelect = (
    currentMaterial: IMaterialDatabase['key']['children'][0]
  ) => {
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
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onClose} />}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CancelButton onCancel={onClose}>Cancel</CancelButton>
          {material ? (
            <Edit
              primary={true}
              needMargin={true}
              material={{
                uuid: current?.uuid ?? material.uuid,
                material: current?.material ?? material.material,
                selected: current?.selected ?? material.selected
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
      <Space direction="vertical" className="full-width">
        <Card size="small">
          <Space direction="vertical" className="full-width text-center">
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
          alreadySelected={alreadySelected}
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
