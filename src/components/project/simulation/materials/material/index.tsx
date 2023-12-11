/** @module Components.Project.Simulation.Materials.Material */

import { useState, useCallback, useContext, useMemo, useRef } from 'react'
import { Button, Card, Drawer, Space, Tabs, Typography } from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import {
  IModelMaterialsChild,
  IModelMaterialsValue,
  IModelVariable,
  IUnit
} from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import { IMaterialDatabase } from '@/config/materials'

import { SelectContext, ISelect } from '@/context/select'
import { select, setPart } from '@/context/select/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

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
export interface IProps {
  visible: boolean
  geometries: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  material?: IModelMaterialsValue
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
  onClose: () => void
}

export interface IMaterialsChildProps {
  dimension?: number
  variables?: IModelVariable[]
  child: IModelMaterialsChild
  index: number
  value: string | number | undefined
  unit: IUnit | undefined
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
const MaterialsChild: React.FunctionComponent<IMaterialsChildProps> = ({
  dimension,
  variables,
  child,
  index,
  value,
  unit,
  _onMaterialChange,
  _onUnitChange
}) => {
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
const Material: React.FunctionComponent<IProps> = ({
  visible,
  geometries,
  simulation,
  material,
  swr,
  onClose
}) => {
  // Ref
  const init = useRef<boolean>(false)

  // State
  const [current, setCurrent] = useState<IModelMaterialsValue>()
  const [error, setError] = useState<string>()

  // Context
  const { dispatch } = useContext(SelectContext)

  // Dimension
  const dimension = useMemo(
    () => simulation.scheme.configuration.dimension,
    [simulation]
  )

  // Variables
  const variables = useMemo(() => simulation.scheme.variables, [simulation])

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
          if (m.uuid === material?.uuid) return
          return {
            label: m.material.label,
            selected: m.selected
          }
        })
        .filter((s) => s) ?? []
    return alreadySelected as ISelection[]
  }, [material, materials])

  // Initialization
  useCustomEffect(() => {
    if (!visible) {
      setCurrent(undefined)
      return
    }

    if (current) return

    if (material) {
      setCurrent(material)
      dispatch(select(material.selected))
    } else
      setCurrent({
        uuid: 'add',
        material: {
          label: 'Default',
          children: materials.children.map((child) => ({
            label: child.label,
            symbol: child.name,
            value: child.default
          }))
        },
        geometry: geometries[0]?.id,
        selected: []
      })
    init.current = true
  }, [visible, geometries, material, materials, current])

  // Set part
  useCustomEffect(
    () => {
      if (!visible) return

      const geometry = geometries.find(
        (geometry) => geometry.id === current?.geometry
      )
      if (geometry) dispatch(setPart(geometry.summary.uuid))
    },
    [visible, geometries, current],
    [dispatch]
  )

  /**
   * On material select
   * @param currentMaterial Current material
   */
  const onMaterialSelect = useCallback(
    (currentMaterial: IMaterialDatabase['key']['children'][0]): void => {
      if (!init.current) return

      setCurrent({
        ...current!,
        material: currentMaterial
      })
    },
    [current]
  )

  /**
   * On material change
   * @param child Children
   * @param index Index
   * @param val Value
   */
  const onMaterialChange = useCallback(
    (child: IModelMaterialsChild, index: number, val: string): void => {
      if (!init.current) return

      setCurrent({
        ...current!,
        material: {
          label: 'Custom',
          children: [
            ...current!.material.children.slice(0, index),
            {
              ...current!.material.children[index],
              label: child.label,
              symbol: child.name,
              value: val
            },
            ...current!.material.children.slice(index + 1)
          ]
        }
      })
    },
    [current]
  )

  /**
   * On unit change
   * @param index Index
   * @param unit Unit
   */
  const onUnitChange = useCallback(
    (index: number, unit: IUnit): void => {
      if (!init.current) return

      setCurrent({
        ...current!,
        material: {
          ...current!.material,
          children: [
            ...current!.material.children.slice(0, index),
            {
              ...current!.material.children[index],
              unit: unit
            },
            ...current!.material.children.slice(index + 1)
          ]
        }
      })
    },
    [current]
  )

  /**
   * On select
   * @param selected Selected
   */
  const onSelected = useCallback(
    (selected: ISelect[]): void => {
      if (!init.current) return

      setCurrent({
        ...current!,
        selected: selected
      })
    },
    [current]
  )

  /**
   * On geometry change
   * @param key Key
   */
  const onGeometryChange = useCallback(
    (key: string): void => {
      if (!init.current) return

      // Set part
      const geometry = geometries.find((geometry) => geometry.id === key)
      dispatch(setPart(geometry!.summary.uuid))

      // Set geometry
      setCurrent({
        ...current!,
        geometry: key
      })
    },
    [geometries, current, dispatch]
  )

  /**
   * On cancel
   */
  const onCancel = useCallback((): void => {
    onClose()
    setCurrent(undefined)
    init.current = false
  }, [onClose])

  /**
   * Render
   */
  return (
    <Drawer
      className={style.subPanel}
      title="Material"
      placement="left"
      closable={false}
      open={visible}
      mask={false}
      maskClosable={false}
      width={300}
      extra={<Button type="text" icon={<CloseOutlined />} onClick={onCancel} />}
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CancelButton onCancel={onCancel} />
          {material ? (
            <Edit
              material={{
                uuid: current?.uuid ?? material.uuid,
                material: current?.material ?? material.material,
                geometry: current?.geometry ?? material.geometry,
                selected: current?.selected ?? material.selected
              }}
              simulation={{
                id: simulation.id,
                scheme: simulation.scheme
              }}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              onError={setError}
              onClose={onCancel}
            />
          ) : (
            <Add
              material={{
                material: current?.material!,
                geometry: current?.geometry!,
                selected: current?.selected!
              }}
              simulation={{
                id: simulation.id,
                scheme: simulation.scheme
              }}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
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
              Material: {current?.material?.label ?? 'default'}
            </Typography.Text>
            {materials?.children?.map((child, index) => {
              const m = current?.material?.children?.find(
                (c) => c.symbol === child.name
              )

              return (
                <MaterialsChild
                  key={child.name}
                  dimension={dimension}
                  variables={variables}
                  child={child}
                  index={index}
                  value={m?.value}
                  unit={m?.unit ?? child.unit}
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
          activeKey={current?.geometry}
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
