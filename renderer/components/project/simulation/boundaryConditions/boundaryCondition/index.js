import { useState, useEffect } from 'react'
import { Button, Card, Drawer, Radio, Space } from 'antd'

import Formula from '../../../../assets/formula'
import Selector from '../selector'

/**
 * Boundary condition
 * @param {Object} props Props
 */
const BoundaryCondition = ({
  visible,
  close,
  part,
  boundaryConditions,
  boundaryCondition
}) => {
  // State
  const [type, setType] = useState()
  const [current, setCurrent] = useState()

  // Data
  const types = Object.keys(boundaryConditions)
    .map((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return
      return {
        key,
        label: boundaryConditions[key].label,
        children: boundaryConditions[key].children
      }
    })
    .filter((t) => t)

  // Current
  useEffect(() => {
    if (boundaryCondition) setCurrent(boundaryCondition)
    // else setCurrent(boundaryConditions?.[type]?.value)
  }, [boundaryCondition, boundaryConditions])

  /**
   * On type
   * @param {Object} event Event
   */
  const onType = (event) => {
    const key = event.target.value
    const currentType = types.find((t) => t.key === key)
    setType(currentType)
  }

  /**
   * On close
   */
  const onClose = () => {
    setType()
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
      <Card title="Boundary condition type">
        <Radio.Group buttonStyle="solid" value={type?.key} onChange={onType}>
          {types?.map((type) => {
            return (
              <Radio.Button key={type.key} value={type.key}>
                {type.label}
              </Radio.Button>
            )
          })}
        </Radio.Group>
      </Card>
      {type && (
        <Card>
          {type.children?.map((child, index) => {
            return (
              <div key={index}>
                {child.label}
                <Formula
                  value={0}
                  onChange={(value) => onChange(index, value)}
                />
              </div>
            )
          })}
        </Card>
      )}
      <Selector part={part} />
      <Space>
        <Button type="danger" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={!false} onClick={() => {}}>
          {boundaryCondition ? 'Edit' : 'Add'}
        </Button>
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
