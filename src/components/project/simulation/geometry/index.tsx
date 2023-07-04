/** @module Components.Project.Simulation.Geometry */

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo
} from 'react'
import { Card, Select, Typography } from 'antd'

import {
  IFrontGeometriesItem,
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import Mesh from './mesh'

import style from '../index.module.css'

/**
 * Props
 */
export interface IProps {
  loadedGeometries: Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>[]
  geometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[]
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
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
export const _onSelect = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  loadedGeometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[],
  geometryId: string,
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
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
    await swr.mutateOneSimulation(newSimulation)

    // Display

    setGeometries([newGeometry])
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
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
export const _onMultipleSelect = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  loadedGeometries: Pick<IFrontGeometriesItem, 'id' | 'summary'>[],
  geometriesIds: string[],
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
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
    await swr.mutateOneSimulation(newSimulation)

    // Display

    setGeometries(newGeometries as IFrontGeometriesItem[])
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
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
}: IProps): React.JSX.Element => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const multiple = useMemo(
    () => simulation.scheme.configuration.geometry.multiple,
    [simulation]
  )
  const n = useMemo(
    () => simulation.scheme.configuration.geometry.n,
    [simulation]
  )
  const geometryId = useMemo(
    () => simulation.scheme.configuration.geometry.value,
    [simulation]
  )
  const geometriesIds = useMemo(
    () => simulation.scheme.configuration.geometry.values,
    [simulation]
  )

  // Auto select
  useCustomEffect(
    () => {
      ;(async () => {
        if (!multiple && !geometryId && geometries.length) {
          await _onSelect(
            simulation,
            loadedGeometries,
            geometries[0].id,
            setGeometries,
            swr,
            dispatch
          )
        } else if (multiple && !geometriesIds && geometries.length) {
          await _onMultipleSelect(
            simulation,
            loadedGeometries,
            geometries.map((geometry) => geometry.id),
            setGeometries,
            swr,
            dispatch
          )
        }
      })()
    },
    [multiple, geometryId, geometriesIds, loadedGeometries, geometries, swr],
    [dispatch]
  )

  /**
   * On change
   * @param values Values
   */
  const onChange = useCallback(
    (value: string | string[]): void => {
      ;(async () => {
        multiple
          ? await _onMultipleSelect(
              simulation,
              loadedGeometries,
              value as string[],
              setGeometries,
              swr,
              dispatch
            )
          : await _onSelect(
              simulation,
              loadedGeometries,
              value as string,
              setGeometries,
              swr,
              dispatch
            )
      })()
    },
    [multiple, loadedGeometries, simulation, setGeometries, swr, dispatch]
  )

  // List
  const list = useMemo(
    () => (
      <div className={style.geometriesList}>
        <Select
          mode={multiple ? 'multiple' : undefined}
          options={loadedGeometries.map((geometry) => ({
            value: geometry.id,
            label: geometry.name
          }))}
          value={multiple ? geometriesIds : geometryId}
          onChange={onChange}
        />
      </div>
    ),
    [multiple, geometryId, geometriesIds, onChange, loadedGeometries]
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
        {n ? (
          <>
            <br />
            <Typography.Text>{n} geometries needed</Typography.Text>
          </>
        ) : null}
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
