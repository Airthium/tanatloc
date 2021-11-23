import { useState } from 'react'
import {
  Button,
  Collapse,
  Layout,
  List,
  Menu,
  Modal,
  Space,
  Typography
} from 'antd'
import { DatabaseOutlined, SelectOutlined } from '@ant-design/icons'

interface IProps {
  onSelect: Function
}

/**
 * Database
 * @memberof Components.Project.Simulation.Materials
 */
const dataBase = {
  metal: {
    label: 'Metal',
    children: [
      {
        label: 'Steel',
        children: [
          {
            label: 'Density',
            symbol: 'Rho',
            value: 7850
          },
          {
            label: "Young's modulus",
            symbol: 'E',
            value: 2.1e9
          },
          {
            label: "Poisson's ratio",
            symbol: 'Nu',
            value: 0.3
          },
          {
            label: 'Thermal conductivity',
            symbol: 'Lambda',
            value: 15
          },
          {
            label: 'Heat capacity',
            symbol: 'Cp',
            value: 502
          }
        ]
      }
    ]
  },
  fluid: {
    label: 'Fluid',
    children: [
      {
        label: 'Water',
        children: [
          {
            label: 'Density',
            symbol: 'Rho',
            value: 1e3
          },
          {
            label: 'Dynamic viscosity',
            symbol: 'Mu',
            value: 1e-3
          }
        ]
      }
    ]
  }
}

/**
 * Material database
 * @memberof Components.Project.Simulation.Materials
 * @param props Props
 */
const DataBase = ({ onSelect }: IProps): JSX.Element => {
  const [visible, setVisible]: [boolean, Function] = useState()
  const [current, setCurrent]: [JSX.Element, Function] = useState()

  const onMenuClick = ({ key }) => {
    const materials = dataBase[key].children.map(
      (material: {
        label: string
        children: {
          label: string
          symbol: string
          value: number
        }[]
      }) => {
        return (
          <List.Item key={material.label}>
            <Collapse>
              <Collapse.Panel
                key=""
                header={material.label}
                extra={
                  <Button
                    size="small"
                    icon={<SelectOutlined />}
                    onClick={() => onMaterialSelect(material)}
                  />
                }
              >
                <Space direction="vertical">
                  {material.children.map((value) => {
                    return (
                      <Typography.Text key={value.label}>
                        {value.label}: {value.symbol} = {value.value}
                      </Typography.Text>
                    )
                  })}
                </Space>
              </Collapse.Panel>
            </Collapse>
          </List.Item>
        )
      }
    )

    setCurrent(<List itemLayout="vertical">{materials}</List>)
  }

  const onMaterialSelect = (material: {
    label: string
    children: {
      label: string
      symbol: string
      value: number
    }[]
  }) => {
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
