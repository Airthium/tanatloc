import { useState } from 'react'
import { Button, Collapse, Layout, List, Menu, Modal } from 'antd'
import { DatabaseOutlined, SelectOutlined } from '@ant-design/icons'

const dataBase = {
  metal: {
    label: 'Metal',
    children: [
      {
        label: 'Steel',
        children: [
          {
            label: "Young's modulus",
            symbol: 'E',
            value: 2.1e9
          },
          {
            label: "Poisson's ratio",
            symbol: 'Nu',
            value: 0.3
          }
        ]
      }
    ]
  }
}

/**
 * Material database
 */
const DataBase = ({ onSelect }) => {
  const [visible, setVisible] = useState()
  const [current, setCurrent] = useState()

  const onMenuClick = ({ key }) => {
    const materials = dataBase[key].children.map((material) => {
      return (
        <List.Item
          key={material.label}
          extra={
            <Button
              icon={<SelectOutlined />}
              onClick={() => onMaterialSelect(material)}
            />
          }
        >
          {material.label}
          <Collapse>
            <Collapse.Panel>
              {material.children.map((value) => {
                return (
                  <div key={value.label}>
                    {value.label}: {value.symbol} = {value.value}{' '}
                  </div>
                )
              })}
            </Collapse.Panel>
          </Collapse>
        </List.Item>
      )
    })

    setCurrent(<List itemLayout="vertical">{materials}</List>)
  }

  const onMaterialSelect = (material) => {
    onSelect(material)
    setVisible(false)
  }

  return (
    <>
      <Button icon={<DatabaseOutlined />} onClick={() => setVisible(true)}>
        Material database
      </Button>
      <Modal
        visible={visible}
        title="Material database"
        onCancel={() => setVisible(false)}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Layout>
          <Layout.Sider theme="light">
            <Menu mode="inline" onClick={onMenuClick}>
              {Object.keys(dataBase).map((key) => {
                return <Menu.Item key={key}>{dataBase[key].label}</Menu.Item>
              })}
            </Menu>
          </Layout.Sider>
          <Layout.Content>{current}</Layout.Content>
        </Layout>
      </Modal>
    </>
  )
}

export default DataBase
