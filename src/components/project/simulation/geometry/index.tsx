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
        className="Geometry-list"
        key={g.id}
        style={{
          backgroundColor: g.id === geometry?.id ? '#FFFBE6' : '#FAFAFA'
        }}
        onClick={() => onSelect(g.id)}
      >
        <Typography.Text strong>{g.name}</Typography.Text>
      </div>
    ))
    setGeometryList(list)
  }, [geometry, geometries])

  /**
   * On select
   * @param {number} index Index
   */
  const onSelect = async (id: string): Promise<void> => {
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
  geometries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
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
