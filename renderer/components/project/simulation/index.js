/** @module renderer/components/project/simulation */

import { useState, useEffect } from 'react'
import { Layout, Menu, Modal } from 'antd'

import Panel from '../panel'

import About from './about'
import Geometry from './geometry'
import Parameters from './parameters'
import BoundaryConditions from './boundaryConditions'

// TODO test data only
const simulationScheme = {
  algorithm: 'Laplacian',
  category: 'Academic',
  description: 'Laplacian algorithm (TODO)',
  categories: {
    geometry: {
      index: 1,
      title: 'Geometry'
    },
    parameters: {
      index: 2,
      title: 'Parameters',
      rightHandSide: {
        label: 'Right hand side',
        children: [
          {
            label: 'External force',
            htmlEntity: 'formula',
            default: 0
          }
        ]
      },
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        children: [
          {
            label: 'u',
            htmlEntity: 'select',
            options: [
              {
                label: 'P1',
                value: 'P1'
              },
              {
                label: 'P2',
                value: 'P2'
              }
            ],
            default: 'P1',
            name: 'Uh'
          }
        ]
      },
      solver: {
        advanced: true,
        label: 'Solver',
        children: [
          {
            label: 'System resolution',
            htmlEntity: 'select',
            options: [
              { label: 'GMRES', value: 'GMRES' },
              { label: 'MUMPS', value: 'MUMPS' },
              { label: 'UMFPACK', value: 'UMFPACK' }
            ],
            default: 'MUMPS'
          }
        ]
      }
    },
    boundaryConditions: {
      index: 3,
      title: 'Boundary conditions',
      dirichlet: {
        label: 'Dirichlet',
        children: [
          {
            label: 'u',
            htmlEntity: 'formula',
            default: 0
          }
        ]
      },
      neumann: {
        label: 'Neumann',
        children: [
          {
            label: 'du/dn',
            htmlEntity: 'formula',
            default: 0
          }
        ]
      }
    },
    run: {
      index: 4,
      title: 'Run'
    }
  }
}

/**
 * Simulation Selector
 * @param {Object} props Props
 */
const Selector = ({ visible, onOk, onCancel }) => {
  // State
  const [current, setCurrent] = useState()
  const [loading, setLoading] = useState(false)

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
  const onCreate = async () => {
    setLoading(true)
    if (current) onOk(simulationScheme)
    setLoading(false)
  }

  /**
   * Render
   */
  return (
    <Modal
      visible={visible}
      title="Create simulation"
      okText="Create"
      okButtonProps={{ loading: loading }}
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
const Simulation = ({ project, simulation, type, part, onClose }) => {
  // State
  const [visible, setVisible] = useState()
  const [title, setTitle] = useState()

  /**
   * Simulation effect
   */
  useEffect(() => {
    setVisible(simulation)
    const subScheme = simulation?.scheme.categories[type]
    setTitle(subScheme ? subScheme.title : 'About')
  }, [simulation, type])

  /**
   * Render
   */
  return (
    <Panel visible={visible} title={title} onClose={onClose}>
      {type === 'about' && <About project={project} simulation={simulation} />}
      {type === 'geometry' && (
        <Geometry project={project} simulation={simulation} part={part} />
      )}
      {type === 'parameters' && (
        <Parameters project={project} simulation={simulation} />
      )}
      {type === 'boundaryConditions' && (
        <BoundaryConditions project={project} simulation={simulation} />
      )}
    </Panel>
  )
}

Simulation.Selector = Selector

export default Simulation
