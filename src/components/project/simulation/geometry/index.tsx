/** @module Components.Project.Simulation.Geometry */

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from 'react'
import { Card, Form, Select, Typography } from 'antd'

import {
  IFrontGeometriesItem,
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelTypedBoundaryCondition } from '@/models/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import Mesh from './mesh'

/**
 * Props
 */
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
export type GeometryChild =
  IFrontSimulationsItem['scheme']['configuration']['geometry']['children'][0]
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  geometries: Geometry[]
  simulation: Simulation
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>
  swr: Swr
}

export interface OneGeometryProps {
  geometries: Geometry[]
  simulation: Simulation
  child: GeometryChild
  index: number
  setGeometries: Dispatch<SetStateAction<IFrontGeometriesItem[]>>
  swr: Swr
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
 * @param geometry Geometry
 * @param index Index
 * @param swr Swr
 */
export const _onSelect = async (
  simulation: Simulation,
  geometry: Geometry,
  index: number,
  swr: Swr
): Promise<void> => {
  const newSimulation = Utils.deepCopy(simulation)

  // Update
  newSimulation.scheme.configuration.geometry.children[index].value =
    geometry.id

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

  // Check boundary conditions
  const geometries = newSimulation.scheme.configuration.geometry.children.map(
    (child) => child.value
  )
  console.log(geometries)
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions

  let done = false
  for (const type of Object.keys(boundaryConditions)) {
    if (type === 'index' || type === 'title' || type === 'done') continue

    const typedBoundaryCondition = boundaryConditions[
      type
    ] as IModelTypedBoundaryCondition

    for (const value of typedBoundaryCondition.values ?? []) {
      geometries.forEach((geometry) => {
        if (geometry === value.geometry) done = true
      })
      if (!done) break
    }
  }

  newSimulation.scheme.configuration.boundaryConditions.done = done

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
}

/**
 * One geometry
 * @param props Props
 * @returns OneGeometry
 */
const OneGeometry: React.FunctionComponent<OneGeometryProps> = ({
  geometries,
  simulation,
  child,
  index,
  setGeometries,
  swr
}) => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  // Geometry id
  const geometryId = useMemo(() => child.value, [child.value])

  // Not exists
  const exists = useMemo(
    () => !!geometries.find((geometry) => geometry.id === geometryId),
    [geometries, geometryId]
  )

  // Meshable
  const noMeshable = useMemo(() => child.noMeshable, [child.noMeshable])

  /**
   * On change
   * @param value Value
   */
  const onChange = useCallback(
    (value: string): void => {
      asyncFunctionExec(async () => {
        try {
          const geometry = geometries.find((g) => g.id === value)!
          await _onSelect(simulation, geometry, index, swr)
          setGeometries([geometry as IFrontGeometriesItem])
        } catch (err: any) {
          dispatch(addError({ title: errors.update, err }))
        }
      })
    },
    [geometries, simulation, index, setGeometries, swr, dispatch]
  )

  // Autofill
  useEffect(() => {
    if (geometries.length && !geometryId) onChange(geometries[0].id)
  }, [geometries, geometryId, onChange])

  /**
   * Render
   */
  return (
    <Card size="small" title={child.label}>
      <Form layout="vertical">
        {exists
          ? []
          : [
              <Typography.Text key="error" strong type="danger">
                Geometry does not exists anymore
              </Typography.Text>
            ]}
        <Form.Item>
          <Select
            placeholder="Select a simulation domain"
            options={geometries.map((geometry) => ({
              value: geometry.id,
              label: geometry.name
            }))}
            value={exists ? geometryId : undefined}
            onChange={onChange}
          />
        </Form.Item>
      </Form>
      {noMeshable ? null : (
        <Mesh
          simulation={{ id: simulation.id, scheme: simulation.scheme }}
          index={index}
          swr={{ mutateOneSimulation: swr.mutateOneSimulation }}
        />
      )}
    </Card>
  )
}

/**
 * Geometry
 * @param props Props
 * @returns Geometry
 */
const Geometry: React.FunctionComponent<IProps> = ({
  geometries,
  simulation,
  setGeometries,
  swr
}) => {
  // Children
  const children = useMemo(
    () => simulation.scheme.configuration.geometry.children,
    [simulation.scheme.configuration.geometry.children]
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
      {children.map((child, index) => (
        <OneGeometry
          key={child.label}
          geometries={geometries}
          simulation={simulation}
          child={child}
          index={index}
          setGeometries={setGeometries}
          swr={swr}
        />
      ))}
    </>
  )
}

export default Geometry
