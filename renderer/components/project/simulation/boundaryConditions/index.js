import { useState } from 'react'
import { Button, Card, Drawer, Layout, Radio, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Formula from '../../../assets/formula'

const BoundaryConditions = ({ project, simulation, part, setVisible }) => {
  // State
  const [bcVisible, setBcVisible] = useState(false)
  const [bcType, setBcType] = useState()

  // Data
  const subScheme = simulation?.scheme.categories.boundaryConditions
  const radios = Object.keys(subScheme)
    .map((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return
      return {
        key,
        ...subScheme[key]
      }
    })
    .filter((r) => r)

  const toggleBoundaryCondition = () => {
    setVisible(bcVisible)
    setBcVisible(!bcVisible)
  }

  const addBoundaryCondition = () => {
    toggleBoundaryCondition()
  }

  const onType = (event) => {
    const type = event.target.value
    setBcType(subScheme[type])
  }

  return (
    <Layout>
      <Layout.Content>
        <Button icon={<PlusCircleOutlined />} onClick={addBoundaryCondition} />
        <Drawer
          title="Boundary condition"
          placement="left"
          closable={false}
          visible={bcVisible}
          mask={false}
          maskClosable={false}
          width={300}
        >
          <Card title="Boundary condition type">
            <Radio.Group buttonStyle="solid" onChange={onType}>
              {radios.map((radio) => {
                return (
                  <Radio.Button key={radio.key} value={radio.key}>
                    {radio.label}
                  </Radio.Button>
                )
              })}
            </Radio.Group>
          </Card>
          {bcType && (
            <Card>
              {bcType.children?.map((child, index) => {
                return (
                  <div key={index}>
                    {child.label}:
                    <Formula defaultValue={child.default} onChange={() => {}} />
                  </div>
                )
              })}
            </Card>
          )}
          <div>
            {part &&
              part.faces?.map((face, index) => {
                return <Card key={index}>{face.name}</Card>
              })}
          </div>
          <Space>
            <Button type="danger" onClick={toggleBoundaryCondition}>
              Cancel
            </Button>
            <Button onClick={toggleBoundaryCondition}>Add</Button>
          </Space>
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default BoundaryConditions
