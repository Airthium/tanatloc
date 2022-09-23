/** @module Components.Project.Simulation.Geometry.Mesh */

import { useState, useEffect, useCallback } from 'react'
import { Card, Form, Select, Space } from 'antd'

import { ErrorNotification } from '@/components/assets/notification'
import Formula from '@/components/assets/formula'

import Utils from '@/lib/utils'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
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
 * On mesh global type
 * @param simulation Simulation
 * @param type Type
 * @param swr SWR
 */
export const onMeshGlobalType = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  type: string,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

    // Update
    newSimulation.scheme.configuration.geometry.meshParameters = {
      type,
      value: type === 'auto' ? 'normal' : '1'
    }

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
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * On mesh global size
 * @param simulation Simulation
 * @param type Type
 * @param value Value
 * @param swr SWR
 */
export const onMeshGlobalSize = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  type: string,
  value: string,
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

    // Update
    newSimulation.scheme.configuration.geometry.meshParameters = {
      ...newSimulation.scheme.configuration.geometry.meshParameters,
      type,
      value: value
    }

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
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Mesh
 * @param props Props
 * @returns Mesh
 */
const Mesh = ({ simulation, swr }: IProps): JSX.Element => {
  // State
  const [meshGlobalType, setMeshGlobalType] = useState<string>()
  const [meshGlobalValue, setMeshGlobalValue] = useState<string>()

  // Global
  useEffect(() => {
    const meshParameters =
      simulation.scheme.configuration.geometry.meshParameters
    if (meshParameters) {
      setMeshGlobalType(meshParameters.type)
      setMeshGlobalValue(meshParameters.value)
    } else {
      setMeshGlobalType('auto')
      setMeshGlobalValue('normal')
    }
  }, [simulation])

  /**
   * On size
   * @param value Value
   */
  const onSize = useCallback(
    async (value: string) => {
      try {
        await onMeshGlobalSize(simulation, meshGlobalType!, value, swr)
        setMeshGlobalValue(value)
      } catch (err) {}
    },
    [simulation, meshGlobalType, swr]
  )

  /**
   * Render
   */
  return (
    <Card size="small" title="Mesh refinement">
      <Space direction="vertical" className="full-width">
        <Form layout="vertical">
          <Form.Item label="Type">
            <Select
              className="full-width"
              value={meshGlobalType}
              onChange={async (type) => {
                try {
                  await onMeshGlobalType(simulation, type, swr)

                  setMeshGlobalType(type)
                  if (type === 'auto') setMeshGlobalValue('normal')
                  else setMeshGlobalValue('1')
                } catch (err) {}
              }}
            >
              <Select.Option value="auto">Automatic</Select.Option>
              <Select.Option value="manual">Manual</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        {meshGlobalType === 'auto' && (
          <Form layout="vertical">
            <Form.Item label="Size">
              <Select
                className="full-width"
                value={meshGlobalValue}
                onChange={onSize}
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
        {meshGlobalType === 'manual' && (
          <Formula
            label="Size"
            defaultValue={meshGlobalValue}
            onValueChange={onSize}
            unit="m"
          />
        )}
      </Space>
    </Card>
  )
}

export default Mesh
