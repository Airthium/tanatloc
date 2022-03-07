/** @module Components.Project.Simulation.Geometry */

import PropTypes from 'prop-types'
import { Card, Typography } from 'antd'

import { IGeometry, ISimulation } from '@/database/index.d'

import { ErrorNotification } from '@/components/assets/notification'

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
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * On select
 * @param {number} index Index
 */
const onSelect = async (
  simulation: ISimulation,
  geometries: IGeometry[],
  id: string,
  setGeometry: Function,
  swr: { mutateOneSimulation: (simulation: ISimulation) => void }
): Promise<void> => {
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
 * Geometry
 * @param props Props
 */
const Geometry = ({
  geometries,
  geometry,
  simulation,
  setGeometry,
  swr
}: IProps): JSX.Element => {
  // Data
  const geometryId = simulation.scheme.configuration.geometry.value
  if (!geometryId)
    onSelect(simulation, geometries, geometry?.id, setGeometry, swr)

  const list = geometries.map((g) => (
    <div
      className="Geometry-list"
      key={g.id}
      style={{
        backgroundColor: g.id === geometry?.id ? '#FFFBE6' : '#FAFAFA'
      }}
      onClick={() => onSelect(simulation, geometries, g.id, setGeometry, swr)}
    >
      <Typography.Text strong>{g.name}</Typography.Text>
    </div>
  ))

  /**
   * Render
   */
  return geometries.length ? (
    <>
      <Card size="small">
        <Typography.Text>
          When changing the simulation domain, you might lose your topological
          entity assignments
        </Typography.Text>
      </Card>
      <Card size="small">
        <Typography.Text strong>Select a simulation domain</Typography.Text>
      </Card>
      {list}
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
