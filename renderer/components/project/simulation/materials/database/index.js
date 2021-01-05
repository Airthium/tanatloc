import { useState } from 'react'
import { Button, Card, Collapse, Layout, List, Menu, Modal } from 'antd'
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

const DataBase = () => {
  const [visible, setVisible] = useState()
  const [current, setCurrent] = useState()

  const onMenuClick = ({ key }) => {
    const materials = dataBase[key].children.map((material) => {
      return (
        <List.Item
          key={material.label}
          extra={<Button icon={<SelectOutlined />} />}
        >
          {material.label}
          <Collapse>
            <Collapse.Panel>
              {material.children.map((value) => {
                return (
                  <div>
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

  return (
    <Card>
      <Button icon={<DatabaseOutlined />} onClick={() => setVisible(true)}>
        Material database
      </Button>
      <Modal
        visible={visible}
        title="Material database"
        okText="Select"
        onOk={() => {}}
        onCancel={() => setVisible(false)}
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
    </Card>
  )
}

export default DataBase
