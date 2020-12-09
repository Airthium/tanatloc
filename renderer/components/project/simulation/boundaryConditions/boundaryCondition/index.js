import { useState } from 'react'
import { Card, Drawer, Radio } from 'antd'

import Formula from '../../../../assets/formula'

/**
 * Boundary condition
 * @param {Object} props Props
 */
const BoundaryCondition = ({ visible, boundaryConditions }) => {
  // State
  const [type, setType] = useState()

  // Data
  const types = Object.keys(boundaryConditions)
    .map((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return
      return {
        key,
        label: boundaryConditions[key].label
      }
    })
    .filter((t) => t)

  const onType = (event) => {
    const key = event.target.value
    const currentType = types.find((t) => t.key === key)
    setType(currentType)
  }

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
        <Radio.Group buttonStyle="solid" value={type.key} onChange={onType}>
          {types.map((type) => {
            return (
              <Radio.Button key={type.key} value={type.key}>
                {type.label}
              </Radio.Button>
            )
          })}
        </Radio.Group>
      </Card>
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
//           style={{
//             marginBottom:
//               highlighted === face.uuid
//                 ? '5px'
//                 : selected.includes(face.uuid)
//                 ? '5px'
//                 : '7px',
//             border:
//               highlighted === face.uuid
//                 ? '2px solid #0096C7'
//                 : selected.includes(face.uuid)
//                 ? '2px solid #c73100'
//                 : '1px solid grey'
//           }}
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
//   <Space>
//     <Button type="danger" onClick={toggleBoundaryCondition}>
//       Cancel
//     </Button>
//     <Button disabled={!boundaryCondition} onClick={onAdd}>
//       Add
//     </Button>
//   </Space>
