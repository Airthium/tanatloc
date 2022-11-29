/** @module Components.Project.Simulation.Geometry */

import { Dispatch, SetStateAction } from 'react'
import { Card, Select, Typography } from 'antd'

import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import {
  IFrontGeometriesItem,
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

import style from '../index.style'

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
 * @param geometryId Geometry id
 * @param setGeometries Set geometries
 * @param swr Swr
 */
export const onSelect = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  loadedGeometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[],
  geometryId: string,
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)
    const newGeometry = loadedGeometries.find(
      (g) => g.id === geometryId
    ) as IFrontGeometriesItem

    // Update
    newSimulation.scheme.configuration.geometry.value = geometryId
    newSimulation.scheme.configuration.geometry.values = undefined

    const diff = {
      ...newSimulation.scheme.configuration,
      dimension: newGeometry.summary.dimension ?? 3,
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

    setGeometries([newGeometry])
  } catch (err) {
    ErrorNotification(errors.update, err)
  }
}

/**
 * On mutliple select
 * @param simulation Simulation
 * @param loadedGeometries Geometries
 * @param geometriesIds Geometries ids
 * @param setGeometries Set geometries
 * @param swr Swr
 */
export const onMultipleSelect = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  loadedGeometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[],
  geometriesIds: string[],
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    if (!geometriesIds.length) return

    const newSimulation = Utils.deepCopy(simulation)
    const newGeometries = loadedGeometries.filter((geometry) =>
      geometriesIds.includes(geometry.id)
    )

    // Update
    newSimulation.scheme.configuration.geometry.value = undefined
    newSimulation.scheme.configuration.geometry.values = geometriesIds

    const diff = {
      ...newSimulation.scheme.configuration,
      dimension: newGeometries[0].summary.dimension ?? 3,
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

    setGeometries(newGeometries as IFrontGeometriesItem[])
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
  const geometriesIds = simulation.scheme.configuration.geometry.values

  // Auto select
  if (!multiple && !geometryId && geometries.length) {
    onSelect(simulation, loadedGeometries, geometries[0].id, setGeometries, swr)
  } else if (multiple && !geometriesIds && geometries.length) {
    onMultipleSelect(
      simulation,
      loadedGeometries,
      geometries.map((geometry) => geometry.id),
      setGeometries,
      swr
    )
  }

  // List
  const list = (
    <div css={style.geometriesList}>
      <Select
        mode={multiple ? 'multiple' : undefined}
        options={loadedGeometries.map((geometry) => ({
          value: geometry.id,
          label: geometry.name
        }))}
        value={multiple ? geometriesIds : geometryId}
        onChange={(value) => {
          multiple
            ? onMultipleSelect(
                simulation,
                loadedGeometries,
                value as string[],
                setGeometries,
                swr
              )
            : onSelect(
                simulation,
                loadedGeometries,
                value as string,
                setGeometries,
                swr
              )
        }}
      />
    </div>
  )

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
