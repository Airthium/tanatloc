/** @module Components.Project.Simulation.BoundaryConditions.BoundaryCondition */

import { useState, useEffect, ChangeEvent, useCallback, useMemo } from 'react'
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Space,
  Typography
} from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import {
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

import Formula from '@/components/assets/formula'
import Selector, { ISelection } from '@/components/assets/selector'
import { CancelButton } from '@/components/assets/button'

import { ISelect } from '@/context/select'

import Add from '../add'
import Edit from '../edit'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

export interface IProps {
  visible: boolean
  geometry: Pick<IFrontGeometriesItem, 'summary'>
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  boundaryCondition?: IModelBoundaryConditionValue
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
  onClose: () => void
}

/**
 * Boundary condition
 * @param props Props
 * @returns BoundaryCondition
 */
const BoundaryCondition = ({
  visible,
  geometry,
  simulation,
  boundaryCondition,
  swr,
  onClose
}: IProps): JSX.Element => {
  type BCExtended = (IModelTypedBoundaryCondition & { key: string })[]
  // State
  const [alreadySelected, setAlreadySelected] = useState<ISelection[]>([])
  const [types, setTypes] = useState<BCExtended>([])
  const [totalNumber, setTotalNumber] = useState<number>()
  const [current, setCurrent] = useState<IModelBoundaryConditionValue>()
  const [error, setError] = useState<string>()

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions
  const dimension = simulation.scheme.configuration.dimension

  // Visible
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!visible && current) setCurrent(undefined)
  })

  // Edit or name
  useEffect(() => {
    if (visible && !current && boundaryCondition) setCurrent(boundaryCondition)
    else if (
      visible &&
      !current &&
      !boundaryCondition &&
      totalNumber !== undefined
    ) {
      setCurrent((prevCurrent) => ({
        ...(prevCurrent as IModelBoundaryConditionValue),
        name: 'Boundary condition ' + (totalNumber + 1)
      }))
    }
  }, [current, totalNumber, visible, boundaryCondition])

  // Already selected
  useEffect(() => {
    const currentAlreadySelected = Object.keys(boundaryConditions)
      .map((type) => {
        if (type === 'index' || type === 'title' || type === 'done') return
        const typedBoundaryCondition = boundaryConditions[
          type
        ] as IModelTypedBoundaryCondition

        return typedBoundaryCondition?.values
          ?.map((b) => {
            if (b.uuid === boundaryCondition?.uuid) return
            return {
              label: b.name,
              selected: b.selected
            }
          })
          .filter((s) => s)
      })
      .flat()
      .filter((s) => s)
    setAlreadySelected(currentAlreadySelected as ISelection[])
  }, [boundaryConditions, boundaryCondition])

  // Types
  useEffect(() => {
    const currentTypes = Object.keys(boundaryConditions)
      .map((type) => {
        if (type === 'index' || type === 'title' || type === 'done') return
        const typedBoundaryCondition = boundaryConditions[
          type
        ] as IModelTypedBoundaryCondition
        return {
          key: type,
          label: typedBoundaryCondition.label,
          children: typedBoundaryCondition.children,
          values: typedBoundaryCondition.values
        }
      })
      .filter((t) => t) as BCExtended
    setTypes(currentTypes)
  }, [boundaryConditions])

  // Total number
  useEffect(() => {
    const numberOfBoundaryConditions = types
      ?.map((t) => t.values?.length)
      .filter((n) => n)
      .reduce((a: any, b: any) => a + b, 0)

    setTotalNumber(numberOfBoundaryConditions)
  }, [types])

  /**
   * On name
   * @param event Event
   */
  const onName = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.value
    setCurrent((prevCurrent) => ({
      ...(prevCurrent as IModelBoundaryConditionValue),
      name: name
    }))
  }, [])

  /**
   * On type
   * @param event Event
   */
  const onType = useCallback(
    (event: RadioChangeEvent): void => {
      const key = event.target.value
      const type = types.find(
        (t) => t.key === key
      ) as IModelTypedBoundaryCondition & {
        key: string
      }
      const typedBoundaryCondition = boundaryConditions[
        key
      ] as IModelTypedBoundaryCondition

      const values = typedBoundaryCondition.children?.map((child) => ({
        checked: true,
        value: child.default
      }))

      setCurrent((prevCurrent) => ({
        ...(prevCurrent as IModelBoundaryConditionValue),
        type: {
          key: type.key,
          label: type.label,
          children: type.children
        },
        values: values
      }))
    },
    [boundaryConditions, types]
  )

  /**
   * On value change
   * @param index Index
   * @param value Value
   */
  const onValueChange = useCallback((index: number, value: string): void => {
    setCurrent((prevCurrent) => ({
      ...(prevCurrent as IModelBoundaryConditionValue),
      values: [
        ...prevCurrent!.values!.slice(0, index),
        {
          checked: prevCurrent!.values![index].checked,
          value
        },
        ...prevCurrent!.values!.slice(index + 1)
      ]
    }))
  }, [])

  /**
   * On checked change
   * @param index Index
   * @param checked Checked
   */
  const onCheckedChange = useCallback(
    (index: number, checked: boolean): void => {
      setCurrent((prevCurrent) => ({
        ...(prevCurrent as IModelBoundaryConditionValue),
        values: [
          ...prevCurrent!.values!.slice(0, index),
          {
            checked,
            value: prevCurrent!.values![index].value
          },
          ...prevCurrent!.values!.slice(index + 1)
        ]
      }))
    },
    []
  )

  /**
   * On selected
   * @param selected Selected
   */
  const onSelected = useCallback((selected: ISelect[]): void => {
    setCurrent((prevCurrent) => ({
      ...(prevCurrent as IModelBoundaryConditionValue),
      selected: selected
    }))
  }, [])

  // Inputs
  const inputs = useMemo(() => {
    if (current?.type && current.type?.children) {
      return (
        <Card>
          {current.type.children.map((child, index) => {
            if (dimension === 2 && child.only3D) return
            return (
              <Formula
                className="marginBottom-10"
                key={index}
                label={child.label}
                defaultValue={String(current.values![index].value)}
                defaultChecked={
                  current.type.children!.length > 1
                    ? current.values![index].checked
                    : undefined
                }
                onValueChange={(value) => onValueChange(index, value)}
                onCheckedChange={(checked) => onCheckedChange(index, checked)}
                unit={child.unit}
              />
            )
          })}
        </Card>
      )
    }
    return null
  }, [current, dimension, onCheckedChange, onValueChange])

  /**
   * Render
   */
  return (
    <Drawer
      className="boundaryCondition"
      title="Boundary condition"
      placement="left"
      closable={false}
      open={visible}
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
          {boundaryCondition ? (
            <Edit
              boundaryCondition={{
                uuid: current?.uuid || boundaryCondition.uuid,
                name: current?.name || boundaryCondition.name,
                type: current?.type || boundaryCondition.type,
                selected: current?.selected || boundaryCondition.selected,
                values: current?.values || boundaryCondition.values
              }}
              oldBoundaryCondition={{
                uuid: boundaryCondition.uuid,
                name: boundaryCondition.name,
                type: boundaryCondition.type,
                selected: boundaryCondition.selected,
                values: boundaryCondition.values
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
              boundaryCondition={{
                name: current?.name!,
                type: current?.type!,
                selected: current?.selected!,
                values: current?.values
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
          <Form layout="vertical">
            <Form.Item
              label={
                <Typography.Text strong>
                  Boundary condition name
                </Typography.Text>
              }
            >
              <Input
                value={current?.name || ''}
                onChange={onName}
                maxLength={50}
              />
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
                className="BoundaryCondition-types"
                optionType="button"
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
            </Form.Item>
          </Form>
        </Card>

        {inputs}

        <Selector
          geometry={geometry}
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
