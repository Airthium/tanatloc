/** @module Components.Project.Simulation.BoundaryConditions.BoundaryCondition */

import {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useMemo,
  useContext
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
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
} from '@/models/index.d'
import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem,
  IFrontGeometriesItem
} from '@/api/index.d'

import Formula from '@/components/assets/formula'
import Selector, { ISelection } from '@/components/assets/selector'
import { CancelButton } from '@/components/assets/button'

import { ISelect, SelectContext } from '@/context/select'
import { setPart } from '@/context/select/actions'

import { globalStyle, globalStyleFn } from '@/styles'
import style from '../../../panel/index.style'

import Add from '../add'
import Edit from '../edit'

export interface IProps {
  visible: boolean
  geometries: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
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
  geometries,
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
  const [activeKey, setActiveKey] = useState<string>()
  const [error, setError] = useState<string>()

  // Context
  const { dispatch } = useContext(SelectContext)

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions
  const dimension = simulation.scheme.configuration.dimension

  // Init
  useEffect(() => {
    dispatch(setPart(geometries[0]?.summary.uuid))
    setActiveKey(boundaryCondition?.geometry)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [`${geometries}`, boundaryCondition, dispatch])

  // Default
  useEffect(() => {
    if (!current)
      setCurrent({
        geometry: geometries[0]?.id
      } as IModelBoundaryConditionValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [`${geometries}`, current])

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
                css={globalStyleFn.marginBottom(10)}
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
        ...(prevCurrent as IModelBoundaryConditionValue),
        geometry: key
      }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [`${geometries}`, dispatch]
  )

  /**
   * Render
   */
  return (
    <Drawer
      css={style.subPanel}
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
                uuid: current?.uuid ?? boundaryCondition.uuid,
                name: current?.name ?? boundaryCondition.name,
                type: current?.type ?? boundaryCondition.type,
                geometry: current?.geometry ?? boundaryCondition.geometry,
                selected: current?.selected ?? boundaryCondition.selected,
                values: current?.values ?? boundaryCondition.values
              }}
              oldBoundaryCondition={{
                uuid: boundaryCondition.uuid,
                name: boundaryCondition.name,
                type: boundaryCondition.type,
                geometry: boundaryCondition.geometry,
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
                geometry: current?.geometry!,
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
      <Space direction="vertical" css={globalStyle.fullWidth}>
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

export default BoundaryCondition
