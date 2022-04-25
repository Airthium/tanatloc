/** @module Components.Project.Simulation.Materials.Material */

import { useState, useEffect, useCallback } from 'react'
import { Button, Card, Drawer, Space, Typography } from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import { IModelMaterials, IModelMaterialsValue } from '@/models/index.d'

import Formula from '@/components/assets/formula'
import Selector, { ISelection } from '@/components/assets/selector'
import { CancelButton } from '@/components/assets/button'

import { ISelect } from '@/context/select'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import DataBase, { IMaterialDatabase } from '../database'
import Add from '../add'
import Edit from '../edit'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  geometry: {
    solids: IFrontGeometriesItem['summary']['solids']
    faces?: IFrontGeometriesItem['summary']['faces']
  }
  material?: IModelMaterialsValue
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
  onClose: () => void
}

/**
 * Material
 * @param props Props
 * @returns Material
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
  const [alreadySelected, setAlreadySelected] = useState<ISelection[]>()
  const [current, setCurrent] = useState<IModelMaterialsValue>()
  const [error, setError] = useState<string>()

  // Data
  const materials = simulation.scheme.configuration.materials

  // Visible
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!visible && current) setCurrent(undefined)
  })

  // Edit
  useEffect(() => {
    if (visible && !current && material) setCurrent(material)
  }, [current, visible, material])

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
  }, [simulation, material, materials])

  /**
   * On material select
   * @param currentMaterial Current material
   */
  const onMaterialSelect = useCallback(
    (currentMaterial: IMaterialDatabase['key']['children'][0]) => {
      setCurrent((prevCurrent) => ({
        ...prevCurrent,
        material: currentMaterial
      }))
    },
    []
  )

  /**
   * On select
   * @param selected Selected
   */
  const onSelected = useCallback((selected: ISelect[]) => {
    setCurrent((prevCurrent) => ({
      ...prevCurrent,
      selected: selected
    }))
  }, [])

  /**
   * On material change
   * @param child Children
   * @param index Index
   * @param val Value
   */
  const onMaterialChange = useCallback(
    (child: IModelMaterials, index: number, val: string) => {
      setCurrent((prevCurrent) => ({
        ...prevCurrent,
        material: {
          label: 'Custom',
          children: [
            ...(prevCurrent?.material?.children?.slice(0, index) || []),
            {
              label: child.label,
              symbol: child.name,
              value: val
            },
            ...(prevCurrent?.material?.children?.slice(index + 1) || [])
          ]
        }
      }))
    },
    []
  )

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
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => {
            setCurrent(undefined)
            onClose()
          }}
        />
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CancelButton
            onCancel={() => {
              setCurrent(undefined)
              onClose()
            }}
          />
          {material ? (
            <Edit
              material={{
                uuid: current?.uuid ?? material.uuid,
                material: current?.material ?? material.material,
                selected: current?.selected ?? material.selected
              }}
              simulation={{
                id: simulation.id,
                scheme: simulation.scheme
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
          <Space direction="vertical" className="full-width">
            <DataBase onSelect={onMaterialSelect} />
            <Typography.Text>
              Material: {current?.material?.label ?? 'default'}
            </Typography.Text>
            {materials.children?.map((child, index) => {
              const m = current?.material?.children?.find(
                (c) => c.symbol === child.name
              )

              return (
                <Formula
                  key={child.name}
                  label={child.name}
                  defaultValue={m ? m.value : String(child.default)}
                  unit={child.unit}
                  onValueChange={(val) => {
                    onMaterialChange(child, index, val)
                  }}
                />
              )
            })}
          </Space>
        </Card>

        <Selector
          geometry={{
            solids: geometry.solids,
            faces: geometry.faces
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

export default Material
