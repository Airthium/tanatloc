/** @module Components.Project.Simulation.Materials.Material */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback
} from 'react'
import { Button, Card, Drawer, Space, Typography } from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import { IGeometry, ISimulation } from '@/database/index.d'
import { IModelMaterial, IModelMaterialValue } from '@/models/index.d'

import Formula from '@/components/assets/formula'
import Selector from '@/components/assets/selector'
import { CancelButton } from '@/components/assets/button'

import { ISelect } from '@/context/select'

import DataBase, { IMaterialDatabase } from '../database'
import Add from '../add'
import Edit from '../edit'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  simulation: ISimulation
  geometry: {
    solids: IGeometry['summary']['solids']
    faces?: IGeometry['summary']['faces']
  }
  material?: IModelMaterialValue
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
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
  const [alreadySelected, setAlreadySelected]: [
    { label: string; selected: { uuid: string; label: number | string }[] }[],
    Dispatch<
      SetStateAction<
        {
          label: string
          selected: { uuid: string; label: number | string }[]
        }[]
      >
    >
  ] = useState()
  const [current, setCurrent]: [
    IModelMaterialValue,
    Dispatch<SetStateAction<IModelMaterialValue>>
  ] = useState()
  const [error, setError]: [string, Dispatch<SetStateAction<string>>] =
    useState()

  // Data
  const materials = simulation.scheme.configuration.materials

  // Visible
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!visible && current) setCurrent(null)
  })

  // Edit
  useEffect(() => {
    if (visible && !current && material) setCurrent(material)
  }, [current, material])

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
   * @param {Object} currentMaterial Current material
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
   * @param {Object} selected Selected
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
    (child: IModelMaterial, index: number, val: string) => {
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
            setCurrent(null)
            onClose()
          }}
        />
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CancelButton
            onCancel={() => {
              setCurrent(null)
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
    solids: PropTypes.array.isRequired,
    faces: PropTypes.array
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
