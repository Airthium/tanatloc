import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Layout, List, Menu, Modal, Space } from 'antd'
import { DatabaseOutlined } from '@ant-design/icons'

export interface IProps {
  onSelect: Function
}

export interface IMaterialDatabase {
  [key: string]: {
    label: string
    children: {
      key: string
      label: string
      children: {
        label: string
        symbol: string
        value: number
      }[]
    }[]
  }
}

/**
 * Material database
 * @memberof Components.Project.Simulation.Materials
 */
const materialDatabase: IMaterialDatabase = {
  metal: {
    label: 'Metal',
    children: [
      {
        key: 'steel',
        label: 'Generic Steel',
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
      },
      {
        key: 'S235JR+AR',
        label: 'Steel (S235JR+AR)',
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
            value: 0.27
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
      },
      {
        key: '304',
        label: 'Stainless Steel 304',
        children: [
          {
            label: 'Density',
            symbol: 'Rho',
            value: 8000
          },
          {
            label: "Young's modulus",
            symbol: 'E',
            value: 193e9
          },
          {
            label: "Poisson's ratio",
            symbol: 'Nu',
            value: 0.29
          }
        ]
      },
      {
        key: '316L',
        label: 'Stainless Steel 316L',
        children: [
          {
            label: 'Density',
            symbol: 'Rho',
            value: 7990
          },
          {
            label: "Young's modulus",
            symbol: 'E',
            value: 193e9
          },
          {
            label: "Poisson's ratio",
            symbol: 'Nu',
            value: 0.25
          }
        ]
      },
      {
        key: '6082-O',
        label: 'Aluminium 6082-O',
        children: [
          {
            label: 'Density',
            symbol: 'Rho',
            value: 2700
          },
          {
            label: "Young's modulus",
            symbol: 'E',
            value: 69e9
          },
          {
            label: "Poisson's ratio",
            symbol: 'Nu',
            value: 0.33
          }
        ]
      },
      {
        key: '7075-O',
        label: 'Aluminium 7075-O',
        children: [
          {
            label: 'Density',
            symbol: 'Rho',
            value: 2810
          },
          {
            label: "Young's modulus",
            symbol: 'E',
            value: 71.7e9
          },
          {
            label: "Poisson's ratio",
            symbol: 'Nu',
            value: 0.33
          }
        ]
      }
    ]
  },
  polymer: {
    label: 'Polymer',
    children:[{
      key: 'PMMA',
      label: 'PMMA',
      children:[{
        label: 'Density',
            symbol: 'Rho',
            value: 1180
          },
          {
            label: "Young's modulus",
            symbol: 'E',
            value: 2.9e9
          },
          {
            label: "Poisson's ratio",
            symbol: 'Nu',
            value: 0.36
      }]
    }]
  },
  fluid: {
    label: 'Fluid',
    children: [
      {
        key: 'water',
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
          },
          {
            label: 'Thermal conductivity',
            symbol: 'Lambda',
            value: 0.6
          },
          {
            label: 'Heat capacity',
            symbol: 'Cp',
            value: 4185
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
  // State
  const [visible, setVisible]: [boolean, Function] = useState()

  const [secondLevel, setSecondLevel]: [
    { key: string; children: IMaterialDatabase['key']['children'] },
    Function
  ] = useState()

  const [current, setCurrent]: [
    IMaterialDatabase['key']['children'][0],
    Function
  ] = useState()

  // Data
  const keys = Object.keys(materialDatabase)

  /**
   * On first level menu
   * @param param { key }
   */
  const onFirstLevel = ({ key }: { key: string }) => {
    const subDatabase = materialDatabase[key]

    setSecondLevel({
      key,
      children: subDatabase.children
    })
    setCurrent()
  }

  /**
   * On second level menu
   * @param param { key }
   */
  const onSecondLevel = ({ key }: { key: string }) => {
    const subDatabase = materialDatabase[secondLevel.key]
    const child = subDatabase.children.find((c) => c.key === key)

    setCurrent(child)
  }

  /**
   * On material select
   * @param material Material
   */
  const onMaterialSelect = (
    material: IMaterialDatabase['key']['children'][0]
  ) => {
    onSelect(material)
    setVisible(false)
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        icon={<DatabaseOutlined />}
        onClick={() => setVisible(true)}
        className="full-width"
      >
        Pick a material
      </Button>
      <Modal
        visible={visible}
        title="Material database"
        onCancel={() => setVisible(false)}
        onOk={() => onMaterialSelect(current)}
        okText="Choose"
        okButtonProps={{ disabled: !current }}
      >
        <Layout>
          <Layout.Content>
            <Space style={{ alignItems: 'stretch' }}>
              <Menu mode="inline" onClick={onFirstLevel}>
                {keys.map((key) => {
                  return (
                    <Menu.Item key={key}>
                      {materialDatabase[key].label}
                    </Menu.Item>
                  )
                })}
              </Menu>
              <Menu mode="inline" onClick={onSecondLevel}>
                {secondLevel?.children.map((child) => {
                  return <Menu.Item key={child.key}>{child.label}</Menu.Item>
                })}
              </Menu>
              {current && (
                <List itemLayout="vertical">
                  {current.children.map((child) => (
                    <List.Item key={child.label}>
                      {child.label}: {child.symbol} = {child.value}
                    </List.Item>
                  ))}
                </List>
              )}
            </Space>
          </Layout.Content>
        </Layout>
      </Modal>
    </>
  )
}

DataBase.propTypes = {
  onSelect: PropTypes.func.isRequired
}

export default DataBase
