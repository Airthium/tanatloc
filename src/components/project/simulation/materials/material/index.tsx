/** @module Components.Project.Simulation.Materials.Material */

import { useState, useCallback, useContext, useMemo, useEffect } from 'react'
import { Button, Card, Drawer, Space, Tabs, Typography } from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import {
  IModelMaterialsChild,
  IModelMaterialsValue,
  IUnit
} from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import { IMaterialDatabase } from '@/config/materials'

import { SelectContext, ISelect } from '@/context/select'
import { disable, enable, setPart, setType } from '@/context/select/actions'

import Formula from '@/components/assets/formula'
import Selector, { ISelection } from '@/components/assets/selector'
import { CancelButton } from '@/components/assets/button'

import DataBase from '../database'
import Add from '../add'
import Edit from '../edit'

import globalStyle from '@/styles/index.module.css'
import style from '../../../panel/index.module.css'

/**
 * Props
 */
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface Props {
  geometries: Geometry[]
  simulation: Simulation
  value?: IModelMaterialsValue
  swr: Swr
  onClose: () => void
}

export interface MaterialsChildProps {
  simulation: Simulation
  dimension: number | undefined
  material?: IModelMaterialsValue['material']['children'][0]
  child: IModelMaterialsChild
  index: number
  _onMaterialChange: (
    child: IModelMaterialsChild,
    index: number,
    val: string
  ) => void
  _onUnitChange: (index: number, unit: IUnit) => void
}

/**
 * MaterialsChild
 * @param props Props
 * @returns MaterialsChild
 */
const MaterialsChild: React.FunctionComponent<MaterialsChildProps> = ({
  simulation,
  dimension,
  material,
  child,
  index,
  _onMaterialChange,
  _onUnitChange
}) => {
  // Variables
  const variables = useMemo(
    () => simulation.scheme.variables,
    [simulation.scheme.variables]
  )

  // Vaue
  const value = useMemo(() => material?.value, [material])

  // Unit
  const unit = useMemo(() => material?.unit, [material])

  /**
   * On material change
   * @param val Value
   */
  const onMaterialChange = useCallback(
    (val: string): void => {
      _onMaterialChange(child, index, val)
    },
    [child, index, _onMaterialChange]
  )

  /**
   * On Unit change
   * @param unit Unit
   */
  const onUnitChange = useCallback(
    (unit: IUnit): void => {
      _onUnitChange(index, unit)
    },
    [index, _onUnitChange]
  )

  /**
   * Render
   */
  return (
    <Formula
      key={child.name}
      dimension={dimension}
      label={child.name}
      defaultValue={value ?? String(child.default)}
      additionalKeywords={variables}
      units={child.units}
      unit={unit ?? child.unit}
      onValueChange={onMaterialChange}
      onUnitChange={onUnitChange}
    />
  )
}

/**
 * Material
 * @param props Props
 * @returns Material
 */
const Material: React.FunctionComponent<Props> = ({
  geometries,
  simulation,
  value,
  swr,
  onClose
}) => {
  // State
  const [uuid, setUuid] = useState<string>()
  const [material, setMaterial] = useState<IModelMaterialsValue['material']>()
  const [geometry, setGeometry] = useState<Geometry>()
  const [dimension, setDimension] = useState<number>()
  const [selected, setSelected] = useState<ISelection['selected']>()
  const [error, setError] = useState<string>()

  // Context
  const { dispatch } = useContext(SelectContext)

  // Materials
  const materials = useMemo(
    () => simulation.scheme.configuration.materials!,
    [simulation]
  )

  // Already selected
  const alreadySelected = useMemo(() => {
    const alreadySelected =
      materials.values
        ?.map((m) => {
          if (m.uuid === uuid) return
          return {
            label: m.material.label,
            selected: m.selected
          }
        })
        .filter((s) => s) ?? []
    return alreadySelected as ISelection[]
  }, [materials, uuid])

  /**
   * On material select
   * @param currentMaterial Current material
   */
  const onMaterialSelect = useCallback(
    (currentMaterial: IMaterialDatabase['key']['children'][0]): void => {
      setMaterial(currentMaterial)
    },
    []
  )

  /**
   * On material change
   * @param child Children
   * @param index Index
   * @param val Value
   */
  const onMaterialChange = useCallback(
    (child: IModelMaterialsChild, index: number, val: string): void => {
      setMaterial({
        label: 'Custom',
        children: [
          ...material!.children.slice(0, index),
          {
            ...material?.children[index],
            label: child.label,
            symbol: child.name,
            value: val
          },
          ...material!.children.slice(index + 1)
        ]
      })
    },
    [material]
  )

  /**
   * On unit change
   * @param index Index
   * @param unit Unit
   */
  const onUnitChange = useCallback(
    (index: number, unit: IUnit): void => {
      setMaterial({
        ...material!,
        children: [
          ...material!.children.slice(0, index),
          {
            ...material!.children[index],
            unit: unit
          },
          ...material!.children.slice(index + 1)
        ]
      })
    },
    [material]
  )

  /**
   * On select
   * @param selected Selected
   */
  const onSelected = useCallback((selected: ISelect[]): void => {
    setSelected(selected)
  }, [])

  /**
   * On geometry change
   * @param key Key
   */
  const onGeometryChange = useCallback(
    (key: string): void => {
      // Geometry
      const geometry = geometries.find((geometry) => geometry.id === key)!
      setGeometry(geometry)

      // Dimension
      const dimension = geometry.summary.dimension
      setDimension(dimension)

      // Type
      const type = dimension === 2 ? 'faces' : 'solids'

      // Dispatch
      dispatch(enable())
      dispatch(setType(type))
      dispatch(setPart(geometry.summary.uuid))
    },
    [geometries, dispatch]
  )

  /**
   * On cancel
   */
  const onCancel = useCallback((): void => {
    onClose()
    dispatch(disable())
  }, [onClose, dispatch])

  // Initialize uuid
  useEffect(() => {
    if (uuid) return

    setUuid(value?.uuid ?? 'add')
  }, [value, uuid])

  // Initialize geometry
  useEffect(() => {
    if (geometry) return

    let geometryId = value?.geometry ?? geometries[0].id
    onGeometryChange(geometryId)
  }, [geometries, value, geometry, onGeometryChange])

  // Initialize material
  useEffect(() => {
    if (material) return

    setMaterial(
      value?.material ?? {
        label: 'Default',
        children: materials.children.map((child) => ({
          label: child.label,
          symbol: child.name,
          value: child.default
        }))
      }
    )
  }, [value, materials, material])

  /**
   * Render
   */
  return (
    <Drawer
      className={style.subPanel}
      title="Material"
      placement="left"
      closable={false}
      open={true}
      mask={false}
      maskClosable={false}
      width={300}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onCancel} />}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CancelButton onCancel={onCancel} />
          {value ? (
            <Edit
              material={{
                uuid: uuid,
                material: material,
                geometry: geometry?.id,
                selected: selected
              }}
              simulation={simulation}
              swr={swr}
              onError={setError}
              onClose={onCancel}
            />
          ) : (
            <Add
              material={{
                uuid: uuid,
                material: material,
                geometry: geometry?.id,
                selected: selected
              }}
              simulation={simulation}
              swr={swr}
              onError={setError}
              onClose={onCancel}
            />
          )}
        </div>
      }
    >
      <Space direction="vertical" className={globalStyle.fullWidth}>
        <Card size="small">
          <Space direction="vertical" className={globalStyle.fullWidth}>
            <DataBase onSelect={onMaterialSelect} />
            <Typography.Text>
              Material: {material?.label ?? 'default'}
            </Typography.Text>
            {materials?.children?.map((child, index) => {
              const m = material?.children?.find((c) => c.symbol === child.name)

              return (
                <MaterialsChild
                  key={child.name}
                  simulation={simulation}
                  dimension={dimension}
                  material={m}
                  child={child}
                  index={index}
                  _onMaterialChange={onMaterialChange}
                  _onUnitChange={onUnitChange}
                />
              )
            })}
          </Space>
        </Card>

        <Tabs
          items={geometries.map((geometry) => ({
            key: geometry.id,
            label: geometry.name,
            children: (
              <Selector
                geometry={geometry}
                alreadySelected={alreadySelected}
                updateSelected={onSelected}
              />
            )
          }))}
          activeKey={geometry?.id}
          onChange={onGeometryChange}
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
