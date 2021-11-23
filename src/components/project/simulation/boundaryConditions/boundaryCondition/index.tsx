//@ts-nocheck

import { useState, useEffect, ChangeEvent } from 'react'
import { Button, Card, Drawer, Input, Radio, Space } from 'antd'

import { ISimulation } from '@/database/index.d'

import { GoBack } from '@/components/assets/button'
import Formula from '@/components/assets/formula'
import Selector from '@/components/assets/selector'

import Add from '../add'
import Edit from '../edit'

interface IProps {
  visible: boolean
  simulation: ISimulation
  geometry: {}
  boundaryConditions: {}[]
  boundaryCondition?: {
    name: string
    selected: { uuid: string }[]
    values: {}[]
  }
  swr: {}
  close: Function
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
  boundaryConditions,
  boundaryCondition,
  swr,
  close
}: IProps): JSX.Element => {
  // State
  const [types, setTypes]: [
    {
      key: string
      label: string
      children: {}[]
      values: {}[]
    }[],
    Function
  ] = useState([])
  const [alreadySelected, setAlreadySelected]: [{}[], Function] = useState([])
  const [totalNumber, setTotalNumber]: [number, Function] = useState(0)
  const [current, setCurrent]: [
    { name: string; selected: {}[]; values: {}[] },
    Function
  ] = useState(boundaryCondition)
  const [disabled, setDisabled]: [boolean, Function] = useState(true)

  // Types & already selected
  useEffect(() => {
    if (!boundaryConditions) return

    const currentTypes = Object.keys(boundaryConditions)
      .map((type) => {
        if (type === 'index' || type === 'title' || type === 'done') return
        return {
          key: type,
          label: boundaryConditions[type].label,
          children: boundaryConditions[type].children,
          values: boundaryConditions[type].values
        }
      })
      .filter((t) => t)
    setTypes(currentTypes)

    const currentAlreadySelected = Object.keys(boundaryConditions)
      .map((type) => {
        if (type === 'index' || type === 'title' || type === 'done') return
        return boundaryConditions[type]?.values?.map((b) => ({
          label: b.name,
          selected: b.selected
        }))
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
        selected: boundaryCondition.selected.map((s) => s.uuid)
      })
  }, [boundaryCondition])

  // Disabled
  useEffect(() => {
    if (
      !current ||
      !current.name ||
      !current.selected?.length ||
      !current.values?.length
    )
      setDisabled(true)
    else setDisabled(false)
  }, [current])

  /**
   * On name
   * @param {Object} event Event
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
   * @param {Object} event Event
   */
  const onType = (event: ChangeEvent<HTMLInputElement>): void => {
    const key = event.target.value
    const type = types.find((t) => t.key === key)
    const values = boundaryConditions[key].children
      ? boundaryConditions[key].children.map((child) => ({
          checked: true,
          value: child.default
        }))
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
   * @param {number} index Index
   * @param {string} value Value
   */
  const onValueChange = (index: number, value): void => {
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
   * @param {number} index Index
   * @param {boolean} checked Checked
   */
  const onCheckedChange = (index, checked) => {
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
   * @param {Array} selected Selected
   */
  const onSelected = (selected) => {
    setCurrent({
      ...current,
      selected: selected
    })
  }

  /**
   * On close
   */
  const onClose = () => {
    setCurrent({
      name: 'Boundary condition ' + (totalNumber + 1)
    })
    close()
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
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <GoBack onClick={onClose} />
        <Card title="Boundary condition name">
          <Input value={current?.name || ''} onChange={onName} />
        </Card>
        <Card title="Boundary condition type">
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
                    defaultValue={current.values[index].value}
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
          geometry={geometry}
          alreadySelected={alreadySelected}
          updateSelected={onSelected}
        />
        <Space
          direction="horizontal"
          style={{ width: '100%', justifyContent: 'flex-end' }}
        >
          <Button danger onClick={onClose}>
            Cancel
          </Button>
          {boundaryCondition ? (
            <Edit
              disabled={disabled}
              simulation={simulation}
              boundaryCondition={current}
              oldBoundaryCondition={boundaryCondition}
              geometry={geometry}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              close={onClose}
            />
          ) : (
            <Add
              disabled={disabled}
              simulation={simulation}
              boundaryCondition={current}
              geometry={geometry}
              swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
              close={onClose}
            />
          )}
        </Space>
      </Space>
    </Drawer>
  )
}

export default BoundaryCondition
