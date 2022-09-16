/** @module Components.Project.Simulation.MAterials.Database */

import { useCallback, useState } from 'react'
import { Button, Layout, List, Menu, Modal, Space } from 'antd'
import { DatabaseOutlined } from '@ant-design/icons'

/**
 * Props
 */
export interface IProps {
  onSelect: (material: IMaterialDatabase['key']['children'][0]) => void
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
        value: number | string
      }[]
    }[]
  }
}

/**
 * Material database
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
          },
          {
            label: 'Thermal conductivity',
            symbol: 'Lambda',
            value: 16.2
          },
          {
            label: 'Heat capacity',
            symbol: 'Cp',
            value: 500
          },
          {
            label: 'Yield strength',
            symbol: 'SigmaY',
            value: 215e6
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
          },
          {
            label: 'Thermal conductivity',
            symbol: 'Lambda',
            value: 16.2
          },
          {
            label: 'Heat capacity',
            symbol: 'Cp',
            value: 500
          },
          {
            label: 'Yield strength',
            symbol: 'SigmaY',
            value: 290e6
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
          },
          {
            label: 'Thermal conductivity',
            symbol: 'Lambda',
            value: 170
          },
          {
            label: 'Heat capacity',
            symbol: 'Cp',
            value: 960
          },
          {
            label: 'Yield strength',
            symbol: 'SigmaY',
            value: 60e6
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
          },
          {
            label: 'Thermal conductivity',
            symbol: 'Lambda',
            value: 173
          },
          {
            label: 'Heat capacity',
            symbol: 'Cp',
            value: 960
          },
          {
            label: 'Yield strength',
            symbol: 'SigmaY',
            value: 110e6
          }
        ]
      },
      {
        key: '2017A',
        label: 'Aluminium 2017A',
        children: [
          {
            label: 'Density',
            symbol: 'Rho',
            value: 2790
          },
          {
            label: "Young's modulus",
            symbol: 'E',
            value: 72.5e9
          },
          {
            label: "Poisson's ratio",
            symbol: 'Nu',
            value: 0.33
          },
          {
            label: 'Thermal conductivity',
            symbol: 'Lambda',
            value: 134
          },
          {
            label: 'Heat capacity',
            symbol: 'Cp',
            value: 873
          },
          {
            label: 'Yield strength',
            symbol: 'SigmaY',
            value: 275e6
          }
        ]
      }
    ]
  },
  polymer: {
    label: 'Polymer',
    children: [
      {
        key: 'PMMA',
        label: 'PMMA',
        children: [
          {
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
          },
          {
            label: 'Thermal conductivity',
            symbol: 'Lambda',
            value: 0.193
          },
          {
            label: 'Heat capacity',
            symbol: 'Cp',
            value: 1480
          },
          {
            label: 'Yield strength',
            symbol: 'SigmaY',
            value: 69e6
          }
        ]
      }
    ]
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
 * @param props Props
 * @return Database
 */
const DataBase = ({ onSelect }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>()
  const [firstLevel, setFirstLevel] = useState<{
    key: string
    children: IMaterialDatabase['key']['children']
  }>()
  const [secondLevel, setSecondLevel] = useState<{
    key: string
  }>()
  const [current, setCurrent] =
    useState<IMaterialDatabase['key']['children'][0]>()

  // Data
  const keys = Object.keys(materialDatabase)

  /**
   * On first level menu
   * @param param { key }
   */
  const onFirstLevel = useCallback(({ key }: { key: string }) => {
    const subDatabase = materialDatabase[key]

    console.log(key, subDatabase)
    setFirstLevel({
      key,
      children: subDatabase.children
    })
    setSecondLevel(undefined)
    setCurrent(undefined)
  }, [])

  /**
   * On second level menu
   * @param param { key }
   */
  const onSecondLevel = useCallback(
    ({ key }: { key: string }) => {
      console.log(key)
      const subDatabase = materialDatabase[firstLevel!.key]
      const child = subDatabase.children.find((c) => c.key === key)

      setSecondLevel({ key })
      setCurrent(child)
    },
    [firstLevel]
  )

  /**
   * On material select
   * @param material Material
   */
  const onMaterialSelect = useCallback(
    (material: IMaterialDatabase['key']['children'][0]) => {
      onSelect(material)
      setVisible(false)
    },
    [onSelect]
  )

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
        open={visible}
        title="Material database"
        onCancel={() => setVisible(false)}
        onOk={() => onMaterialSelect(current!)}
        okText="Choose"
        okButtonProps={{ disabled: !current }}
        width="50%"
      >
        <Layout>
          <Layout.Content>
            <Space style={{ alignItems: 'stretch' }}>
              <Menu
                mode="inline"
                items={keys.map((key) => ({
                  key: key,
                  label: materialDatabase[key].label
                }))}
                onClick={onFirstLevel}
              />
              <Menu
                mode="inline"
                items={firstLevel?.children.map((child) => ({
                  key: child.key,
                  label: child.label
                }))}
                selectedKeys={secondLevel?.key ? [secondLevel?.key] : []}
                onClick={onSecondLevel}
              />
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

export default DataBase
