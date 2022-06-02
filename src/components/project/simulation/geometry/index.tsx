/** @module Components.Project.Simulation.Geometry */

import { Card, Typography } from 'antd'

import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import {
  IFrontGeometriesItem,
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

import Mesh from './mesh'

/**
 * Props
 */
export interface IProps {
  geometries: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
  geometry?: Pick<IFrontGeometriesItem, 'id' | 'summary'>
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  setGeometry: (geometry: IFrontGeometriesItem) => void
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update the simulation'
}

/**
 * On select
 * @param simulation Simulation
 * @param geometries Geometries
 * @param geometry Geometry
 * @param setGeometry Set geometry
 * @param swr Swr
 */
export const onSelect = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  geometries: Pick<IFrontGeometriesItem, 'id'>[],
  geometry: Pick<IFrontGeometriesItem, 'id' | 'summary'>,
  setGeometry: (geometry: IFrontGeometriesItem) => void,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

    // Update
    newSimulation.scheme.configuration.geometry.value = geometry.id

    const diff = {
      ...newSimulation.scheme.configuration,
      dimension: geometry.summary.dimension ?? 3,
      geometry: {
        ...newSimulation.scheme.configuration.geometry,
        done: true
      }
    }

    // API
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration'],
        value: diff
      }
    ])

    // Local
    swr.mutateOneSimulation(newSimulation)

    // Display
    const newGeometry = geometries.find((g) => g.id === geometry.id)
    setGeometry(newGeometry as IFrontGeometriesItem)
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * Geometry
 * @param props Props
 * @returns Geometry
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

  // Auto select
  if (!geometryId && geometry)
    onSelect(simulation, geometries, geometry, setGeometry, swr)

  // List
  const list = geometries.map((g) => (
    <div
      className="Geometry-list"
      key={g.id}
      style={{
        backgroundColor: g.id === geometry?.id ? '#FFFBE6' : '#FAFAFA'
      }}
      onClick={() => onSelect(simulation, geometries, g, setGeometry, swr)}
    >
      <Typography.Text>{g.name}</Typography.Text>
    </div>
  ))

  /**
   * Render
   */
  return (
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
  )
}

export default Geometry
