/** @module Components.Project.Simulation.Geometry.Mesh */

import { useState, useEffect, useCallback } from 'react'
import { Card, Form, Select, Space } from 'antd'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import Formula from '@/components/assets/formula'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import { globalStyle } from '@/styles'

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
  update: 'Unable to update simulation'
}

/**
 * On mesh global type
 * @param simulation Simulation
 * @param type Type
 * @param swr SWR
 */
export const _onMeshGlobalType = async (
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
export const _onMeshGlobalSize = async (
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
   * On change
   * @param type Type
   */
  const onChange = useCallback(
    async (type: string): Promise<void> => {
      try {
        await _onMeshGlobalType(simulation, type, swr)

        setMeshGlobalType(type)
        if (type === 'auto') setMeshGlobalValue('normal')
        else setMeshGlobalValue('1')
      } catch (err) {}
    },
    [simulation, swr]
  )

  /**
   * On size
   * @param value Value
   */
  const onSize = useCallback(
    async (value: string) => {
      try {
        await _onMeshGlobalSize(simulation, meshGlobalType!, value, swr)
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
      <Space direction="vertical" className={globalStyle.fullWidth}>
        <Form layout="vertical">
          <Form.Item label="Type">
            <Select
              className={globalStyle.fullWidth}
              value={meshGlobalType}
              onChange={onChange}
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
                className={globalStyle.fullWidth}
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
