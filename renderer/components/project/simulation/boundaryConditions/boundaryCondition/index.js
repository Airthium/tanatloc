import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Input, Radio, Space } from 'antd'

import Formula from '../../../../assets/formula'
import Selector from '../selector'
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

  // Edit
  useEffect(() => {
    if (boundaryCondition) setCurrent(boundaryCondition)
  }, [boundaryCondition])

  // // Current
  // useEffect(() => {
  //   if (current?.name) return

  //   if (boundaryCondition) {
  //     setCurrent(boundaryCondition)
  //     if (!type)
  //       setType({
  //         key: boundaryConditionType,
  //         label: boundaryConditions[boundaryConditionType].label,
  //         children: boundaryConditions[boundaryConditionType].children
  //       })
  //   } else if (type) {
  //     const typedBoundaryConditions = boundaryConditions[type.key]
  //     const newBoundaryCondition = {
  //       name:
  //         current?.name ||
  //         typedBoundaryConditions.label +
  //           ' boundary condition ' +
  //           (typedBoundaryConditions.values
  //             ? typedBoundaryConditions.values.length + 1
  //             : '1'),
  //       selected: current?.selected || [],
  //       values: new Array(typedBoundaryConditions.children.length).fill(0)
  //     }
  //     setCurrent(newBoundaryCondition)
  //   }
  // }, [type, boundaryCondition, boundaryConditions])

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
    setCurrent({
      ...current,
      type: type,
      values: new Array(boundaryConditions[key].children.length).fill(0)
    })
  }

  /**
   * On change
   * @param {number} index Index
   * @param {string} value Value
   */
  const onChange = (index, value) => {
    setCurrent({
      ...current,
      values: [
        ...current.values.slice(0, index),
        value,
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
      {current?.type && (
        <Card>
          {current?.type?.children?.map((child, index) => {
            return (
              <div key={index}>
                {child.label}
                <Formula
                  value={
                    current?.values?.[index] === undefined
                      ? current?.type?.children?.[index]?.default
                      : current?.values?.[index]
                  }
                  onChange={(value) => onChange(index, value)}
                />
              </div>
            )
          })}
        </Card>
      )}
      <Selector part={part} updateSelected={onSelected} />
      <Space>
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
    </Drawer>
  )
}

export default BoundaryCondition

//   {boundaryCondition && (
//     <Card>
//       {boundaryCondition.children?.map((child, index) => {
//         return (
//           <div key={index}>
//             {child.label}:
//             <Formula
//               value={
//                 values[index] === undefined ? child.default : values[index]
//               }
//               onChange={(value) => onChange(value, index)}
//             />
//           </div>
//         )
//       })}
//     </Card>
//   )}
//   <div>
//     {faces?.map((face, index) => {
//       return (
//         <Card
//           hoverable
//           key={index}
//   style={{
//     marginBottom:
//       highlighted === face.uuid
//         ? '5px'
//         : selected.includes(face.uuid)
//         ? '5px'
//         : '7px',
//     border:
//       highlighted === face.uuid
//         ? '2px solid #0096C7'
//         : selected.includes(face.uuid)
//         ? '2px solid #c73100'
//         : '1px solid grey'
//   }}
//           bodyStyle={{ padding: '10px' }}
//           onMouseOver={() => onHighlight(face.uuid)}
//           onMouseOut={onUnhighlight}
//           onClick={() => onSelect(face.uuid)}
//         >
//           {face.name}
//         </Card>
//       )
//     })}
//   </div>
