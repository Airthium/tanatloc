import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Card, Collapse, Space, Typography } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import { IGeometry, ISimulation } from '@/database/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'
import MathJax from '@/components/assets/mathjax'

import SimulationAPI from '@/api/simulation'

import Mesh from './mesh'

export interface IProps {
  geometries: IGeometry[]
  geometry?: IGeometry
  simulation: ISimulation
  setGeometry: Function
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors (geometry)
 * @memberof Components.Project.Simulation
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * Geometry
 * @memberof Components.Project.Simulation
 * @param props Props
 */
const Geometry = ({
  geometries,
  geometry,
  simulation,
  setGeometry,
  swr
}: IProps): JSX.Element => {
  // State
  const [geometriesList, setGeometryList]: [IGeometry[], Function] = useState(
    []
  )

  useEffect(() => {
    const simulationGeometryId = simulation.scheme.configuration.geometry.value
    if (!simulationGeometryId) onSelect(geometry?.id)
  }, [simulation])

  useEffect(() => {
    const list = geometries.map((g) => (
      <div
        style={{
          padding: '20px',
          borderTop: '1px solid #BFBFBF',
          borderBottom: '1px solid #BFBFBF',
          backgroundColor: g.id === geometry?.id ? '#FFFBE6' : '#FAFAFA'
        }}
        onClick={() => onSelect(g.id)}
      >
        <Typography.Text strong>{g.name}</Typography.Text>
      </div>

      // <Collapse
      //   accordion={true}
      //   key={g.id}
      //   expandIcon={() => <></>}
      //   onChange={(key) => console.log(key)}
      // >
      //   <Collapse.Panel
      //     // forceRender
      //     key={g.id}
      //     header={g.name}
      //     style={{
      //       backgroundColor: g.id === geometry?.id && 'rgba(254, 226, 61, 0.5)'
      //     }}
      //   >
      //     <Space direction="vertical">
      //       <Typography.Title level={5}>Informations</Typography.Title>
      //       <Typography.Text>File: {g.name} </Typography.Text>
      //       <Typography.Text>
      //         Unit: <MathJax.Inline text={'m'} />
      //       </Typography.Text>
      //       {g.summary ? (
      //         <>
      //           {g.summary.solids && (
      //             <Typography.Text>
      //               Number of solids: {g.summary.solids.length}
      //             </Typography.Text>
      //           )}
      //           {g.summary.faces && (
      //             <Typography.Text>
      //               Number of faces: {g.summary.faces.length}
      //             </Typography.Text>
      //           )}
      //           {g.summary.edges && (
      //             <Typography.Text>
      //               Number of edges: {g.summary.edges.length}
      //             </Typography.Text>
      //           )}
      //         </>
      //       ) : (
      //         <Typography.Text>No summary available</Typography.Text>
      //       )}
      //     </Space>
      //   </Collapse.Panel>
      // </Collapse>
    ))
    setGeometryList(list)
  }, [geometry, geometries])

  /**
   * On select
   * @param {number} index Index
   */
  const onSelect = async (id: string): Promise<void> => {
    console.log(id)
    try {
      const newSimulation = { ...simulation }

      // Update
      newSimulation.scheme.configuration.geometry.value = id

      const diff = {
        ...newSimulation.scheme.configuration.geometry,
        done: true
      }

      // API
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'geometry'],
          value: diff
        }
      ])

      // Local
      swr.mutateOneSimulation(newSimulation)

      // Display
      const newGeometry = geometries.find((g) => g.id === id)
      setGeometry(newGeometry)
    } catch (err) {
      ErrorNotification(errors.update, err)
    }
  }

  /**
   * Render
   */
  return geometries.length ? (
    <>
      <Card>
        <Typography.Text>
          When changing the simulation domain, you might lose your topological
          entity assignments
        </Typography.Text>
      </Card>
      <Card>
        <Typography.Text strong>Select a simulation domain</Typography.Text>
      </Card>
      {geometriesList}
      {simulation.scheme.configuration.geometry.meshable && (
        <Mesh
          simulation={{ id: simulation.id, scheme: simulation.scheme }}
          swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
        />
      )}
    </>
  ) : (
    <Typography.Text>Please upload a geometry first</Typography.Text>
  )
}

Geometry.propTypes = {
  geometries: PropTypes.array.isRequired,
  geometry: PropTypes.object,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        geometry: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Geometry
