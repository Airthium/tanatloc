/** @module Components.Project.Simulation.Materials.Material */

import { useState, useCallback, useContext, useMemo } from 'react'
import { Button, Card, Drawer, Space, Tabs, Typography } from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import { IModelMaterialsChild, IModelMaterialsValue } from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import { IMaterialDatabase } from '@/config/materials'

import { SelectContext, ISelect } from '@/context/select'
import { setPart } from '@/context/select/actions'

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
  child: IModelMaterialsChild
  index: number
  value: string | number | undefined
  _onMaterialChange: (
    child: IModelMaterialsChild,
    index: number,
    val: string
  ) => void
}

/**
 * MaterialsChild
 * @param props Props
 * @returns MaterialsChild
 */
const MaterialsChild = ({
  child,
  index,
  value,
  _onMaterialChange
}: IMaterialsChildProps): JSX.Element => {
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

  return (
    <Formula
      key={child.name}
      label={child.name}
      defaultValue={value ?? String(child.default)}
      unit={child.unit}
      onValueChange={onMaterialChange}
    />
  )
}

/**
 * Material
 * @param props Props
 * @returns Material
 */
const Material = ({
  visible,
  geometries,
  simulation,
  material,
  swr,
  onClose
}: IProps): JSX.Element => {
  // State
  const [alreadySelected, setAlreadySelected] = useState<ISelection[]>()
  const [current, setCurrent] = useState<IModelMaterialsValue>()
  const [activeKey, setActiveKey] = useState<string>()
  const [error, setError] = useState<string>()

  // Context
  const { dispatch } = useContext(SelectContext)

  // Data
  const materials = useMemo(
    () => simulation.scheme.configuration.materials,
    [simulation]
  )

  // Init
  useCustomEffect(
    () => {
      dispatch(setPart(geometries[0]?.summary.uuid))
      setActiveKey(material?.geometry)
    },
    [geometries, material],
    [dispatch]
  )

  // Visible
  useCustomEffect(() => {
    if (!visible && current) setCurrent(undefined)
  }, [visible, current])

  // Default
  useCustomEffect(() => {
    if (visible && !current && material) {
      setCurrent(material)
    } else if (visible && !current && !material)
      setCurrent({
        material: {
          label: 'Default',
          children:
            materials?.children.map((child) => ({
              label: child.label,
              symbol: child.name,
              value: child.default
            })) ?? []
        },
        geometry: geometries[0]?.id
      } as IModelMaterialsValue)
  }, [visible, geometries, materials, current])

  // Already selected
  useCustomEffect(() => {
    const currentAlreadySelected = materials?.values
      ?.map((m) => {
        if (m.uuid === material?.uuid) return
        return {
          label: m.material.label,
          selected: m.selected
        }
      })
      .filter((s) => s)
    setAlreadySelected((currentAlreadySelected ?? []) as ISelection[])
  }, [simulation, material, materials])

  /**
   * On material select
   * @param currentMaterial Current material
   */
  const onMaterialSelect = useCallback(
    (currentMaterial: IMaterialDatabase['key']['children'][0]) => {
      setCurrent((prevCurrent) => ({
        ...(prevCurrent as IModelMaterialsValue),
        material: currentMaterial
      }))
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
    (child: IModelMaterialsChild, index: number, val: string) => {
      setCurrent((prevCurrent) => ({
        ...(prevCurrent as IModelMaterialsValue),
        material: {
          label: 'Custom',
          children: [
            ...prevCurrent!.material.children.slice(0, index),
            {
              label: child.label,
              symbol: child.name,
              value: val
            },
            ...prevCurrent!.material.children.slice(index + 1)
          ]
        }
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
      ...(prevCurrent as IModelMaterialsValue),
      selected: selected
    }))
  }, [])

  /**
   * On geometry change
   * @param key Key
   */
  const onGeometryChange = useCallback(
    (key: string) => {
      // Active key
      setActiveKey(key)

      // Set part
      const geometry = geometries.find((geometry) => geometry.id === key)
      dispatch(setPart(geometry!.summary.uuid))

      // Set geometry
      setCurrent((prevCurrent) => ({
        ...(prevCurrent as IModelMaterialsValue),
        geometry: key
      }))
    },
    [geometries, dispatch]
  )

  /**
   * On cancel
   */
  const onCancel = useCallback(() => {
    setCurrent(undefined)
    onClose()
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
                  child={child}
                  index={index}
                  value={m?.value}
                  _onMaterialChange={onMaterialChange}
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
          activeKey={activeKey}
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
