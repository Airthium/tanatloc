/** @module Components.Project.Simulation.BoundaryConditions.BoundaryCondition */

import {
  useState,
  ChangeEvent,
  useCallback,
  useMemo,
  useContext,
  useEffect
} from 'react'
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Space,
  Tabs,
  Typography
} from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import {
  IModelBoundaryCondition,
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition,
  IUnit
} from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import { ISelect, SelectContext } from '@/context/select'
import { disable, enable, setPart, setType } from '@/context/select/actions'

import Formula from '@/components/assets/formula'
import Selector, { ISelection } from '@/components/assets/selector'
import { CancelButton } from '@/components/assets/button'

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
  value?: IModelBoundaryConditionValue
  swr: Swr
  onClose: () => void
}

export interface BoundaryConditionItemProps {
  simulation: Simulation
  dimension: number | undefined
  values: NonNullable<IModelBoundaryConditionValue['values']>
  child: IModelBoundaryCondition
  index: number
  _onValueChange: (index: number, value: string) => void
  _onCheckedChange: (index: number, checked: boolean) => void
  _onUnitChange: (index: number, unit: IUnit) => void
}

const BoundaryConditionItem: React.FunctionComponent<
  BoundaryConditionItemProps
> = ({
  simulation,
  dimension,
  values,
  child,
  index,
  _onValueChange,
  _onCheckedChange,
  _onUnitChange
}) => {
  // Variables
  const variables = useMemo(
    () => simulation.scheme.variables,
    [simulation.scheme.variables]
  )

  // Value
  const value = useMemo(() => values[index].value, [values, index])

  // Checked
  const checked = useMemo(
    () => (values.length > 1 ? values[index].checked : undefined),
    [values, index]
  )

  // Unit
  const unit = useMemo(
    () => values[index].unit ?? child.unit,
    [values, index, child]
  )

  /**
   * On value change
   * @param value Value
   */
  const onValueChange = useCallback(
    (value: string): void => _onValueChange(index, value),
    [index, _onValueChange]
  )

  /**
   * On checked change
   * @param checked Checked
   */
  const onCheckedChange = useCallback(
    (checked: boolean): void => _onCheckedChange(index, checked),
    [index, _onCheckedChange]
  )

  /**
   * On unit change
   * @param unit unit
   */
  const onUnitChange = useCallback(
    (unit: IUnit): void => _onUnitChange(index, unit),
    [index, _onUnitChange]
  )

  /**
   * Render
   */
  return (
    <Formula
      dimension={dimension}
      label={child.label}
      defaultValue={value ?? String(child.default)}
      defaultChecked={checked}
      additionalKeywords={variables}
      units={child.units}
      unit={unit}
      onValueChange={onValueChange}
      onCheckedChange={onCheckedChange}
      onUnitChange={onUnitChange}
    />
  )
}

/**
 * Boundary condition
 * @param props Props
 * @returns BoundaryCondition
 */
const BoundaryCondition: React.FunctionComponent<Props> = ({
  geometries,
  simulation,
  value,
  swr,
  onClose
}) => {
  // State
  const [uuid, setUuid] = useState<string>()
  const [name, setName] = useState<string>()
  const [bcType, setBCType] = useState<IModelBoundaryConditionValue['type']>()
  const [geometry, setGeometry] = useState<Geometry>()
  const [dimension, setDimension] = useState<number>()
  const [selected, setSelected] = useState<ISelection['selected']>()
  const [values, setValues] = useState<IModelBoundaryConditionValue['values']>()
  const [error, setError] = useState<string>()

  // Context
  const { dispatch } = useContext(SelectContext)

  // Boundary conditions
  const boundaryConditions = useMemo(
    () => simulation.scheme.configuration.boundaryConditions,
    [simulation]
  )

  // Already selected
  const alreadySelected = useMemo(() => {
    const alreadySelected = Object.keys(boundaryConditions)
      .map((type) => {
        if (type === 'index' || type === 'title' || type === 'done') return
        const typedBoundaryCondition = boundaryConditions[
          type
        ] as IModelTypedBoundaryCondition

        return typedBoundaryCondition?.values
          ?.map((b) => {
            if (b.uuid === uuid) return
            return {
              label: b.name,
              selected: b.selected
            }
          })
          .filter((s) => s)
      })
      .flat()
      .filter((s) => s)

    return alreadySelected as ISelection[]
  }, [boundaryConditions, uuid])

  // Types
  const types = useMemo(() => {
    const types = Object.keys(boundaryConditions)
      .map((type) => {
        if (type === 'index' || type === 'title' || type === 'done') return
        const typedBoundaryCondition = boundaryConditions[
          type
        ] as IModelTypedBoundaryCondition
        return {
          key: type,
          label: typedBoundaryCondition.label
        }
      })
      .filter((t) => t) as { key: string; label: string }[]
    return types
  }, [boundaryConditions])

  /**
   * On name
   * @param event Event
   */
  const onName = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.value
    setName(name)
  }, [])

  /**
   * On type
   * @param event Event
   */
  const onType = useCallback(
    (event: RadioChangeEvent): void => {
      const key = event.target.value

      // Type
      const type = types.find(
        (t) => t.key === key
      ) as IModelTypedBoundaryCondition & {
        key: string
      }
      setBCType(type)

      // Values
      const typedBoundaryCondition = boundaryConditions[
        key
      ] as IModelTypedBoundaryCondition
      const values = typedBoundaryCondition.children?.map((child) => ({
        checked: true,
        value: child.default
      }))
      setValues(values ?? [])
    },
    [boundaryConditions, types]
  )

  /**
   * On value change
   * @param index Index
   * @param value Value
   */
  const onValueChange = useCallback(
    (index: number, value: string): void => {
      setValues([
        ...values!.slice(0, index),
        {
          ...values![index],
          value
        },
        ...values!.slice(index + 1)
      ])
    },
    [values]
  )

  /**
   * On checked change
   * @param index Index
   * @param checked Checked
   */
  const onCheckedChange = useCallback(
    (index: number, checked: boolean): void => {
      setValues([
        ...values!.slice(0, index),
        {
          ...values![index],
          checked
        },
        ...values!.slice(index + 1)
      ])
    },
    [values]
  )

  /**
   * On unit change
   * @param index Index
   * @param unit Unit
   */
  const onUnitChange = useCallback(
    (index: number, unit: IUnit): void => {
      setValues([
        ...values!.slice(0, index),
        {
          ...values![index],
          unit
        },
        ...values!.slice(index + 1)
      ])
    },
    [values]
  )

  /**
   * On selected
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
      const type = dimension === 2 ? 'edges' : 'faces'

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

  // Inputs
  const inputs = useMemo(() => {
    if (!bcType) return
    const typedBoundaryCondition = boundaryConditions[
      bcType.key
    ] as IModelTypedBoundaryCondition
    const children = typedBoundaryCondition.children
    if (!children) return

    return (
      <Card>
        {children.map((child, index) => {
          if (dimension === 2 && child.only3D) return

          return (
            <BoundaryConditionItem
              key={child.label}
              simulation={simulation}
              dimension={dimension}
              values={values!}
              child={child}
              index={index}
              _onValueChange={onValueChange}
              _onCheckedChange={onCheckedChange}
              _onUnitChange={onUnitChange}
            />
          )
        })}
      </Card>
    )
  }, [
    simulation,
    boundaryConditions,
    bcType,
    dimension,
    values,
    onValueChange,
    onCheckedChange,
    onUnitChange
  ])

  const numberOfBCs = useMemo(() => {
    let count = 0
    Object.keys(boundaryConditions).forEach((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return

      const typedBoundaryCondition = boundaryConditions[
        key
      ] as IModelTypedBoundaryCondition
      count += typedBoundaryCondition.values?.length ?? 0
    })
    return count
  }, [boundaryConditions])

  // Initialize uuid
  useEffect(() => {
    if (uuid) return

    setUuid(value?.uuid ?? 'add')
  }, [value, uuid])

  console.log(boundaryConditions)
  // Initialize name
  useEffect(() => {
    if (name) return

    if (value?.name) setName(value.name)
    else {
      setName('Boundary condition ' + (numberOfBCs + 1))
    }
  }, [value, name, numberOfBCs])

  // Initialize geometry
  useEffect(() => {
    if (geometry) return

    const geometryId = value?.geometry ?? geometries[0].id
    onGeometryChange(geometryId)
  }, [geometries, value, geometry, onGeometryChange])

  // Initialize type (BC type)
  useEffect(() => {
    if (bcType) return

    setBCType(value?.type)
  }, [value, bcType])

  // Initialize values
  useEffect(() => {
    if (values) return

    setValues(value?.values ?? [])
  }, [value, values])

  /**
   * Render
   */
  return (
    <Drawer
      className={style.subPanel}
      title="Boundary condition"
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
              boundaryCondition={{
                uuid: uuid,
                name: name,
                type: bcType,
                geometry: geometry?.id,
                selected: selected,
                values: values
              }}
              oldBoundaryCondition={value}
              simulation={simulation}
              swr={swr}
              onError={setError}
              onClose={onClose}
            />
          ) : (
            <Add
              boundaryCondition={{
                uuid: uuid,
                name: name,
                type: bcType,
                geometry: geometry?.id,
                selected: selected,
                values: values
              }}
              simulation={simulation}
              swr={swr}
              onError={setError}
              onClose={onClose}
            />
          )}
        </div>
      }
    >
      <Space direction="vertical" className={globalStyle.fullWidth}>
        <Card size="small">
          <Form layout="vertical">
            <Form.Item
              label={
                <Typography.Text strong>
                  Boundary condition name
                </Typography.Text>
              }
            >
              <Input value={name ?? ''} onChange={onName} maxLength={50} />
            </Form.Item>
          </Form>
        </Card>
        <Card size="small">
          <Form layout="vertical">
            <Form.Item
              label={
                <Typography.Text strong>
                  Boundary condition type
                </Typography.Text>
              }
            >
              <Radio.Group
                optionType="button"
                buttonStyle="solid"
                value={bcType?.key}
                onChange={onType}
              >
                {types?.map((type) => {
                  return (
                    <Radio.Button key={type.key} value={type.key}>
                      {type.label}
                    </Radio.Button>
                  )
                })}
              </Radio.Group>
            </Form.Item>
          </Form>
        </Card>

        {inputs}

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

export default BoundaryCondition
