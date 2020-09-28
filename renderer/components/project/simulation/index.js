/** @module renderer/components/project/simulation */

import { useState, useEffect } from 'react'
import { Layout, Menu, Modal } from 'antd'

import Panel from '../panel'

// TODO test data only
const simulationScheme = {
  title: 'A simulation',
  children: [
    {
      title: 'Geometry',
      key: 'geometry'
    },
    {
      title: 'Parameters',
      key: 'parameters'
    },
    {
      title: 'Run',
      key: 'run'
    },
    {
      title: 'Results',
      key: 'results'
    }
  ]
}

/**
 * Simulation Selector
 * @param {Object} props Props
 */
const Selector = ({ visible, onOk, onCancel }) => {
  // State
  const [current, setCurrent] = useState()

  /**
   * On select
   * @param {Object} data Data { key }
   */
  const onSelect = ({ key }) => {
    setCurrent(key)
  }

  /**
   * On create
   */
  const onCreate = () => {
    if (current) onOk(simulationScheme)
  }

  /**
   * Render
   */
  return (
    <Modal
      visible={visible}
      title="Create simulation"
      okText="Create"
      onOk={onCreate}
      onCancel={onCancel}
    >
      <Layout>
        <Layout.Sider theme="light">
          <Menu mode="inline" openKeys={['academic']} onSelect={onSelect}>
            <Menu.SubMenu key="academic" title="Academic" disabled={true}>
              <Menu.Item key="laplacian">Laplacian</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Layout.Sider>
        <Layout.Content>{current}</Layout.Content>
      </Layout>
    </Modal>
  )
}

/**
 * Simulation
 * @param {Object} props Props
 */
const Simulation = ({ simulation, onClose }) => {
  // State
  const [visible, setVisible] = useState()
  const [title, setTitle] = useState()

  /**
   * Simulation effect
   */
  useEffect(() => {
    setVisible(simulation)
    setTitle(simulation?.scheme.title)
    // console.log(simulation)
  }, [simulation])

  return <Panel visible={visible} title={title} onClose={onClose}></Panel>
  // // State
  // const [visible, setVisible] = useState()

  // // Simualtion
  // useEffect(() => {
  //   if (simulation) setVisible(true)
  //   else setVisible(false)
  // }, [simulation])

  // /**
  //  * Render
  //  */
  // return (
  //   <Drawer
  //     visible={visible}
  //     onClose={() => setVisible(false)}
  //     mask={false}
  //     maskClosable={false}
  //     placement="top"
  //   >
  //     <Steps>
  //       <Steps.Step
  //         title="Geometry"
  //         description="Import your geometry or mesh"
  //       />
  //       <Steps.Step
  //         title="Parameters"
  //         description="Parameterize your simulation"
  //       />
  //       <Steps.Step title="Run" description="Run your simulation" />
  //       <Steps.Step title="Results" description="Visualize your results" />
  //     </Steps>
  //   </Drawer>
  // )
}

Simulation.Selector = Selector

export default Simulation
