/** @module Components.Project.Simulation.MAterials.Database */

import { useCallback, useState } from 'react'
import { Button, Layout, List, Menu, Modal, Space } from 'antd'
import { DatabaseOutlined } from '@ant-design/icons'

import { IMaterialDatabase, materialDatabase } from '@/config/materials'

/**
 * Props
 */
export interface IProps {
  onSelect: (material: IMaterialDatabase['key']['children'][0]) => void
}

/**
 * Material database
 * @param props Props
 * @return Database
 */
const DataBase = ({ onSelect }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>()
  const [secondLevel, setSecondLevel] = useState<{
    key: string
    children: IMaterialDatabase['key']['children']
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

    setSecondLevel({
      key,
      children: subDatabase.children
    })
    setCurrent(undefined)
  }, [])

  /**
   * On second level menu
   * @param param { key }
   */
  const onSecondLevel = useCallback(
    ({ key }: { key: string }) => {
      const subDatabase = materialDatabase[secondLevel!.key]
      const child = subDatabase.children.find((c) => c.key === key)

      setCurrent(child)
    },
    [secondLevel]
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
        visible={visible}
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
                items={secondLevel?.children.map((child) => ({
                  key: child.key,
                  label: child.label
                }))}
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
