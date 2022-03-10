/** @module Components.Project.Simulation.BoundaryConditions.BoundaryCondition */

import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  ChangeEvent,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
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
  IModelBoundaryConditionValue,
  IModelTypedBoundaryCondition
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
 * @param props Props
 * @returns BoundaryCondition
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
    { label: string; selected: { uuid: string; label: number | string }[] }[],
    Dispatch<
      SetStateAction<
        {
          label: string
          selected: { uuid: string; label: number | string }[]
        }[]
      >
    >
  ] = useState([])
  const [types, setTypes]: [
    (IModelTypedBoundaryCondition & { key: string })[],
    Dispatch<SetStateAction<(IModelTypedBoundaryCondition & { key: string })[]>>
  ] = useState([])
  const [totalNumber, setTotalNumber]: [
    number,
    Dispatch<SetStateAction<number>>
  ] = useState(0)
  const [current, setCurrent]: [
    IModelBoundaryConditionValue,
    Dispatch<SetStateAction<IModelBoundaryConditionValue>>
  ] = useState()
  const [error, setError]: [string, Dispatch<SetStateAction<string>>] =
    useState('')

  // Data
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions

  // Edit
  useEffect(() => {
    if (boundaryCondition) setCurrent(boundaryCondition)
  }, [boundaryCondition])

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
    setAlreadySelected(currentAlreadySelected)
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
      .filter((t) => t)
    setTypes(currentTypes)
  }, [boundaryConditions])

  // Total number
  useEffect(() => {
    const numberOfBoundaryConditions = types
      ?.map((t) => t.values?.length)
      .filter((n) => n)
      .reduce((a, b) => a + b, 0)

    setTotalNumber(numberOfBoundaryConditions)
  }, [types])

  // Name
  useEffect(() => {
    setCurrent((prevCurrent) => ({
      ...prevCurrent,
      name: 'Boundary condition ' + (totalNumber + 1)
    }))
  }, [totalNumber])

  /**
   * On name
   * @param event Event
   */
  const onName = (event: ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.value
    setCurrent((prevCurrent) => ({
      ...prevCurrent,
      name: name
    }))
  }

  /**
   * On type
   * @param event Event
   */
  const onType = (event: RadioChangeEvent): void => {
    const key = event.target.value
    const type = types.find((t) => t.key === key)
    const typedBoundaryCondition = boundaryConditions[
      key
    ] as IModelTypedBoundaryCondition

    const values = typedBoundaryCondition.children?.map((child) => ({
      checked: true,
      value: child.default
    }))

    setCurrent((prevCurrent) => ({
      ...prevCurrent,
      type: {
        key: type.key,
        label: type.label,
        children: type.children
      },
      values: values
    }))
  }

  /**
   * On value change
   * @param index Index
   * @param value Value
   */
  const onValueChange = (index: number, value: string): void => {
    setCurrent((prevCurrent) => ({
      ...prevCurrent,
      values: [
        ...current.values.slice(0, index),
        {
          checked: current.values[index].checked,
          value
        },
        ...current.values.slice(index + 1)
      ]
    }))
  }

  /**
   * On checked change
   * @param index Index
   * @param checked Checked
   */
  const onCheckedChange = (index: number, checked: boolean): void => {
    setCurrent((prevCurrent) => ({
      ...prevCurrent,
      values: [
        ...current.values.slice(0, index),
        {
          checked,
          value: current.values[index].value
        },
        ...current.values.slice(index + 1)
      ]
    }))
  }

  /**
   * On selected
   * @param selected Selected
   */
  const onSelected = useCallback((selected: string[]): void => {
    setCurrent((prevCurrent) => ({
      ...prevCurrent,
      selected: selected.map((s) => ({
        uuid: s,
        label: 0 //TODO
      }))
    }))
  }, [])

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
          <CancelButton onCancel={onClose} />
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
              geometry={{
                faces: geometry.faces
              }}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              onError={(desc) => setError(desc)}
              onClose={onClose}
            />
          ) : (
            <Add
              boundaryCondition={{
                name: current?.name,
                type: current?.type,
                selected: current?.selected,
                values: current?.values
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
      <Space direction="vertical" className="full-width">
        <Card title="Boundary condition name" size="small">
          <Input value={current?.name || ''} onChange={onName} />
        </Card>
        <Card title="Boundary condition type" size="small">
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
        </Card>
        {current?.type && current.type?.children && (
          <Card>
            {current.type.children.map((child, index) => {
              return (
                <Formula
                  className="marginBottom-10"
                  key={index}
                  label={child.label}
                  defaultValue={String(current.values[index].value)}
                  defaultChecked={
                    current.type.children.length > 1
                      ? current.values[index].checked
                      : undefined
                  }
                  onValueChange={(value) => onValueChange(index, value)}
                  onCheckedChange={(checked) => onCheckedChange(index, checked)}
                  unit={child.unit}
                />
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

BoundaryCondition.propTypes = {
  visible: PropTypes.bool,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  geometry: PropTypes.exact({
    faces: PropTypes.array.isRequired
  }).isRequired,
  boundaryCondition: PropTypes.exact({
    uuid: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.exact({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      children: PropTypes.array
    }).isRequired,
    selected: PropTypes.array.isRequired,
    values: PropTypes.array
  }),
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default BoundaryCondition
