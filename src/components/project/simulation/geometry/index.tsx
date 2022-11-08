/** @module Components.Project.Simulation.Geometry */

import { Dispatch, SetStateAction } from 'react'
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
  loadedGeometries: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update simulation'
}

/**
 * On select
 * @param simulation Simulation
 * @param loadedGeometries Geometries
 * @param geometry Geometry
 * @param setGeometries Set geometries
 * @param swr Swr
 */
export const onSelect = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  loadedGeometries: Pick<IFrontGeometriesItem, 'id'>[],
  geometry: Pick<IFrontGeometriesItem, 'id' | 'summary'>,
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>,
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
      },
      run: {
        ...newSimulation.scheme.configuration.run,
        done: false
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
    const newGeometry = loadedGeometries.find((g) => g.id === geometry.id)
    setGeometries((prev) => [...prev, newGeometry as IFrontGeometriesItem])
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * On mutliple select
 * @param simulation Simulation
 * @param loadedGeometries Geometries
 * @param geometries Geometries
 * @param setGeometries Set geometries
 * @param swr Swr
 */
export const onMultipleSelect = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  loadedGeometries: Pick<IFrontGeometriesItem, 'id'>[],
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[],
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

    // Update
    newSimulation.scheme.configuration.geometry.values = geometries.map(
      (g) => g.id
    )

    const diff = {
      ...newSimulation.scheme.configuration,
      dimension: geometries[0].summary.dimension ?? 3,
      geometry: {
        ...newSimulation.scheme.configuration.geometry,
        done: true
      },
      run: {
        ...newSimulation.scheme.configuration.run,
        done: false
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
    const newGeometries = loadedGeometries.filter((g) =>
      geometries.filter((gg) => gg.id === g.id)
    )
    setGeometries((prev) => [
      ...prev,
      ...(newGeometries as IFrontGeometriesItem[])
    ])
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
  loadedGeometries,
  geometries,
  simulation,
  setGeometries,
  swr
}: IProps): JSX.Element => {
  // Data
  const multiple = simulation.scheme.configuration.geometry.multiple
  const geometryId = simulation.scheme.configuration.geometry.value
  const geometryIds = simulation.scheme.configuration.geometry.values

  // Auto select
  if (!multiple && !geometryId && geometries.length) {
    onSelect(simulation, loadedGeometries, geometries[0], setGeometries, swr)
  } else if (multiple && !geometryIds && geometries.length) {
    onMultipleSelect(
      simulation,
      loadedGeometries,
      geometries,
      setGeometries,
      swr
    )
  }

  // List
  const list = <></>
  // const list = loadedGeometries.map((g) => (
  //   <div
  //     className="Geometry-list"
  //     key={g.id}
  //     style={{
  //       backgroundColor: g.id === geometry?.id ? '#FFFBE6' : '#FAFAFA'
  //     }}
  //     onClick={() =>
  //       onSelect(simulation, loadedGeometries, g, setGeometry, swr)
  //     }
  //   >
  //     <Typography.Text>{g.name}</Typography.Text>
  //   </div>
  // ))

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
