import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Input, Radio, Space } from 'antd'

import Formula from '@/components/assets/formula'
import Selector from '@/components/assets/selector'

import Add from '../add'
import Edit from '../edit'

/**
 * Boundary condition
 * @param {Object} props Props
 */
const BoundaryCondition = ({
  project,
  simulation,
  visible,
  part,
  boundaryConditions,
  boundaryCondition,
  close
}) => {
  // State
  const [current, setCurrent] = useState({
    name: 'New boundary condition'
  })
  const [disabled, setDisabled] = useState(true)

  // Data
  const types = Object.keys(boundaryConditions)
    .map((type) => {
      if (type === 'index' || type === 'title' || type === 'done') return
      return {
        key: type,
        label: boundaryConditions[type].label,
        children: boundaryConditions[type].children
      }
    })
    .filter((t) => t)

  const alreadySelected = Object.keys(boundaryConditions)
    .map((type) => {
      if (type === 'index' || type === 'title' || type === 'done') return
      return boundaryConditions[type]?.values?.map((b) => ({
        label: b.name,
        selected: b.selected
      }))
    })
    .filter((a) => a)
    .flat()

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
  const onName = (event) => {
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
  const onType = (event) => {
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
  const onValueChange = (index, value) => {
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
      name: 'New boundary condition'
    })
    close()
  }

  console.log(current)

  /**
   * Render
   */
  return (
    <Drawer
      title="Boundary condition"
      placement="left"
      closable={false}
      visible={visible}
      mask={false}
      maskClosable={false}
      width={300}
    >
      <Space direction="vertical">
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
                    defaultValue={
                      current.values?.[index]
                        ? current.values?.[index]?.value
                        : current.type.children?.[index]?.default
                    }
                    defaultChecked={
                      current.type.children.length > 1
                        ? current.values?.[index]?.checked !== undefined
                          ? current.values?.[index]?.checked
                          : true
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
          part={part}
          alreadySelected={alreadySelected}
          updateSelected={onSelected}
        />
        <Space style={{ textAlign: 'right' }}>
          <Button type="danger" onClick={onClose}>
            Cancel
          </Button>
          {boundaryCondition ? (
            <Edit
              disabled={disabled}
              boundaryCondition={current}
              oldBoundaryCondition={boundaryCondition}
              project={project}
              simulation={simulation}
              part={part}
              close={onClose}
            />
          ) : (
            <Add
              disabled={disabled}
              boundaryCondition={current}
              project={project}
              simulation={simulation}
              part={part}
              close={onClose}
            />
          )}
        </Space>
      </Space>
    </Drawer>
  )
}

export default BoundaryCondition
