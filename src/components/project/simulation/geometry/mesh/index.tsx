/** @module Components.Project.Simulation.Geometry.Mesh */

import { useState, useEffect, useCallback, useContext } from 'react'
import { Card, Collapse, Form, Select } from 'antd'

import {
  IModelMeshSizeAuto,
  IModelMeshSizeFactor,
  IModelMeshSizeManual,
  IUnit
} from '@/models/index.d'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Formula from '@/components/assets/formula'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type MeshParameters =
  | IModelMeshSizeManual
  | IModelMeshSizeAuto
  | IModelMeshSizeFactor

export interface IProps {
  simulation: Simulation
  index: number
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
}

/**
 * Defaults
 */
const defaultMeshSize = {
  manual: {
    type: 'manual',
    value: 1
  } as IModelMeshSizeManual,
  auto: {
    type: 'auto',
    value: 'normal'
  } as IModelMeshSizeAuto,
  factor: {
    type: 'factor',
    value: 1
  } as IModelMeshSizeFactor
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update simulation'
}

/**
 * On global
 * @param simulation Simulation
 * @param index Index
 * @param meshParameters Mesh parameters
 * @param swr SWR
 */
export const _onGlobal = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  index: number,
  meshParameters: MeshParameters,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  }
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

    // Update
    newSimulation.scheme.configuration.geometry.children[index].meshParameters =
      meshParameters

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
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'run'],
        value: {
          ...newSimulation.scheme.configuration.run,
          done: false
        }
      }
    ])

    // Local
    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    throw err
  }
}

/**
 * Mesh
 * @param props Props
 * @returns Mesh
 */
const Mesh = ({ simulation, index, swr }: IProps): React.JSX.Element => {
  // State
  const [global, setGlobal] = useState<MeshParameters>(defaultMeshSize.auto)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Global
  useEffect(() => {
    const meshParameters =
      simulation.scheme.configuration.geometry.children[index].meshParameters
    meshParameters && setGlobal(meshParameters)
  }, [simulation, index])

  /**
   * On type
   * @param type Type
   */
  const onType = useCallback(
    (type: keyof typeof defaultMeshSize): void => {
      const newGlobal = defaultMeshSize[type]
      _onGlobal(simulation, index, newGlobal, swr)
        .then(() => {
          setGlobal(newGlobal)
        })
        .catch((err) => dispatch(addError({ title: errors.update, err })))
    },
    [simulation, swr, dispatch]
  )

  /**
   * On value
   * @param value Value
   */
  const onValue = useCallback(
    (value: string | number): void => {
      const newGlobal = {
        ...global,
        value: value
      } as MeshParameters
      _onGlobal(simulation, index, newGlobal, swr)
        .then(() => {
          setGlobal(newGlobal)
        })
        .catch((err) => dispatch(addError({ title: errors.update, err })))
    },
    [simulation, swr, global, dispatch]
  )

  /**
   * On unit
   * @param unit Unit
   */
  const onUnit = useCallback(
    (unit: IUnit): void => {
      const newGlobal = {
        ...global,
        unit
      } as MeshParameters
      _onGlobal(simulation, index, newGlobal, swr)
        .then(() => setGlobal(newGlobal))
        .catch((err) => dispatch(addError({ title: errors.update, err })))
    },
    [simulation, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <Collapse>
      <Collapse.Panel key="meshRefinement" header="Mesh refinement">
        <Card size="small">
          <Form layout="vertical">
            <Form.Item label="Type">
              <Select
                className={globalStyle.fullWidth}
                value={global.type}
                onChange={onType}
              >
                {Object.keys(defaultMeshSize).map((key) => (
                  <Select.Option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          {global.type === 'auto' && (
            <Form layout="vertical">
              <Form.Item label="Size">
                <Select
                  className={globalStyle.fullWidth}
                  value={global.value}
                  onChange={onValue}
                >
                  <Select.Option value="veryfine">Very fine</Select.Option>
                  <Select.Option value="fine">Fine</Select.Option>
                  <Select.Option value="normal">Normal</Select.Option>
                  <Select.Option value="coarse">Coarse</Select.Option>
                  <Select.Option value="verycoarse">Very coarse</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          )}
          {global.type === 'manual' && (
            <Formula
              label="Size"
              noLarge
              defaultValue={global.value}
              units={[{ label: 'm' }, { label: 'mm', multiplicator: 1e3 }]}
              unit={global.unit}
              onValueChange={onValue}
              onUnitChange={onUnit}
            />
          )}
          {global.type === 'factor' && (
            <Formula
              label="Size"
              noLarge
              defaultValue={global.value}
              onValueChange={onValue}
            />
          )}
        </Card>
      </Collapse.Panel>
    </Collapse>
  )
}

export default Mesh
