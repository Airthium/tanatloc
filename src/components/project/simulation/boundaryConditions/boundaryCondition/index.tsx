import { useState, useEffect, ChangeEvent } from 'react'
import {
  Button,
  Card,
  Drawer,
  Input,
  Radio,
  RadioChangeEvent,
  Space,
  Typography
} from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import { IGeometry, ISimulation } from '@/database/index.d'
import {
  IModelBoundaryCondition,
  IModelBoundaryConditionValue
} from '@/models/index.d'

import Formula from '@/components/assets/formula'
import Selector from '@/components/assets/selector'
import { CancelButton } from '@/components/assets/button'

import Add from '../add'
import Edit from '../edit'

export interface IProps {
  visible: boolean
  simulation: ISimulation
  geometry: {
    faces: IGeometry['summary']['faces']
  }
  boundaryCondition?: IModelBoundaryConditionValue
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
  onClose: () => void
}

/**
 * Boundary condition
 * @memberof Components.Project.Simulation.BoundaryConditions
 * @param props Props
 */
const BoundaryCondition = ({
  visible,
  simulation,
  geometry,
  boundaryCondition,
  swr,
  onClose
}: IProps): JSX.Element => {
  // State
  const [alreadySelected, setAlreadySelected]: [
    { label: string; selected: { uuid: string }[] }[],
    Function
  ] = useState([])
  const [types, setTypes]: [
    {
      key: string
      label: string
      children: {}[]
      values: {}[]
    }[],
    Function
  ] = useState([])
  const [totalNumber, setTotalNumber]: [number, Function] = useState(0)
  const [current, setCurrent]: [IModelBoundaryConditionValue, Function] =
    useState()
  const [error, setError]: [string, Function] = useState('')

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions

  // Types & already selected
  useEffect(() => {
    if (!boundaryConditions) return

    const currentTypes = Object.keys(boundaryConditions)
      .map((type) => {
        if (type === 'index' || type === 'title' || type === 'done') return
        const boundaryConditionType = boundaryConditions[type] as {
          label: string
          refineFactor?: number
          children?: IModelBoundaryCondition[]
          values?: IModelBoundaryConditionValue[]
        }
        return {
          key: type,
          label: boundaryConditionType.label,
          children: boundaryConditionType.children,
          values: boundaryConditionType.values
        }
      })
      .filter((t) => t)
    setTypes(currentTypes)

    const currentAlreadySelected = Object.keys(boundaryConditions)
      .map((type) => {
        if (type === 'index' || type === 'title' || type === 'done') return
        const boundaryConditionType = boundaryConditions[type] as {
          label: string
          refineFactor?: number
          children?: IModelBoundaryCondition[]
          values?: IModelBoundaryConditionValue[]
        }
        return boundaryConditionType?.values?.map(
          (b: { name: string; selected: {}[] }) => ({
            label: b.name,
            selected: b.selected
          })
        )
      })
      .filter((a) => a)
      .flat()
    setAlreadySelected(currentAlreadySelected)

    const numberOfBoundaryConditions = currentTypes
      .map((t) => t.values?.length)
      .filter((n) => n)
      .reduce((a, b) => a + b, 0)

    setTotalNumber(numberOfBoundaryConditions)
  }, [boundaryConditions])

  useEffect(() => {
    setCurrent({
      ...current,
      name: 'Boundary condition ' + (totalNumber + 1)
    })
  }, [totalNumber])

  // Edit
  useEffect(() => {
    if (boundaryCondition)
      setCurrent({
        ...boundaryCondition,
        selected: boundaryCondition.selected.map(
          (s: { uuid: string }) => s.uuid
        )
      })
  }, [boundaryCondition])

  /**
   * On name
   * @param event Event
   */
  const onName = (event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.value
    setCurrent({
      ...current,
      name: name
    })
  }

  /**
   * On type
   * @param event Event
   */
  const onType = (event: RadioChangeEvent): void => {
    const key = event.target.value
    const type = types.find((t) => t.key === key)
    const boundaryConditionType = boundaryConditions[key] as {
      label: string
      refineFactor?: number
      children?: IModelBoundaryCondition[]
      values?: IModelBoundaryConditionValue[]
    }

    const values = boundaryConditionType.children
      ? boundaryConditionType.children.map(
          (child: IModelBoundaryCondition) => ({
            checked: true,
            value: child.default
          })
        )
      : [
          {
            checked: true,
            value: 0
          }
        ]
    setCurrent({
      ...current,
      type: type,
      values: values
    })
  }

  /**
   * On value change
   * @param index Index
   * @param value Value
   */
  const onValueChange = (index: number, value: string): void => {
    setCurrent({
      ...current,
      values: [
        ...current.values.slice(0, index),
        {
          checked: current.values[index].checked,
          value
        },
        ...current.values.slice(index + 1)
      ]
    })
  }

  /**
   * On checked change
   * @param index Index
   * @param checked Checked
   */
  const onCheckedChange = (index: number, checked: boolean): void => {
    setCurrent({
      ...current,
      values: [
        ...current.values.slice(0, index),
        {
          checked,
          value: current.values[index].value
        },
        ...current.values.slice(index + 1)
      ]
    })
  }

  /**
   * On selected
   * @param selected Selected
   */
  const onSelected = (selected: string[]): void => {
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
      className="boundaryCondition"
      title="Boundary condition"
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
          {boundaryCondition ? (
            <Edit
              simulation={{
                id: simulation.id,
                scheme: simulation.scheme
              }}
              boundaryCondition={current}
              oldBoundaryCondition={boundaryCondition}
              geometry={geometry}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              onError={(desc) => setError(desc)}
              onClose={onClose}
            />
          ) : (
            <Add
              boundaryCondition={{
                name: current?.name,
                type: current?.type,
                selected: current?.selected
              }}
              simulation={{
                id: simulation.id,
                scheme: simulation.scheme
              }}
              geometry={{
                faces: geometry.faces
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
        <Card title="Boundary condition name" size="small">
          <Input value={current?.name || ''} onChange={onName} />
        </Card>
        <Card title="Boundary condition type" size="small">
          <Radio.Group
            buttonStyle="solid"
            value={current?.type?.key}
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
        </Card>
        {current?.type && current?.type?.children && (
          <Card>
            {current?.type?.children?.map((child, index) => {
              return (
                <div key={index}>
                  {child.label}
                  <Formula
                    defaultValue={String(current.values[index].value)}
                    defaultChecked={
                      current.type.children.length > 1
                        ? current.values[index].checked
                        : undefined
                    }
                    onValueChange={(value) => onValueChange(index, value)}
                    onCheckedChange={(checked) =>
                      onCheckedChange(index, checked)
                    }
                    unit={child.unit}
                  />
                </div>
              )
            })}
          </Card>
        )}
        <Selector
          geometry={{
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

export default BoundaryCondition
