/** @module Components.Project.Simulation.Geometry.Mesh */

import { useState, useEffect, useCallback, Dispatch, useContext } from 'react'
import { Card, Form, Select, Space } from 'antd'

import { IUnit } from '@/models/index.d'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Formula from '@/components/assets/formula'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
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
 * On mesh global type
 * @param simulation Simulation
 * @param type Type
 * @param swr SWR
 */
export const _onMeshGlobalType = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  type: string,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
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
    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
    throw err
  }
}

/**
 * On mesh global size
 * @param simulation Simulation
 * @param value Value
 * @param swr SWR
 */
export const _onMeshGlobalSize = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  value: string | number,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

    // Update
    newSimulation.scheme.configuration.geometry.meshParameters = {
      ...newSimulation.scheme.configuration.geometry.meshParameters,
      type: newSimulation.scheme.configuration.geometry.meshParameters?.type!,
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
    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
    throw err
  }
}

/**
 * On mesh global unit
 * @param simulation Simulation
 * @param unit Unit
 * @param swr SWR
 */
export const _onMeshGlobalUnit = async (
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>,
  unit: IUnit,
  swr: {
    mutateOneSimulation: (
      simulation: IFrontMutateSimulationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    const newSimulation = Utils.deepCopy(simulation)

    // Update
    newSimulation.scheme.configuration.geometry.meshParameters = {
      ...newSimulation.scheme.configuration.geometry.meshParameters,
      type: newSimulation.scheme.configuration.geometry.meshParameters?.type!,
      value: newSimulation.scheme.configuration.geometry.meshParameters?.value!,
      unit
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
    await swr.mutateOneSimulation(newSimulation)
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
    throw err
  }
}

/**
 * Mesh
 * @param props Props
 * @returns Mesh
 */
const Mesh = ({ simulation, swr }: IProps): React.JSX.Element => {
  // State
  const [meshGlobalType, setMeshGlobalType] = useState<string>()
  const [meshGlobalValue, setMeshGlobalValue] = useState<string | number>()
  const [meshGlobalUnit, setMeshGlobalUnit] = useState<IUnit>()

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Global
  useEffect(() => {
    const meshParameters =
      simulation.scheme.configuration.geometry.meshParameters
    if (meshParameters) {
      setMeshGlobalType(meshParameters.type)
      setMeshGlobalValue(meshParameters.value)
      setMeshGlobalUnit(meshParameters.unit ?? { label: 'm' })
    } else {
      setMeshGlobalType('auto')
      setMeshGlobalValue('normal')
      setMeshGlobalUnit({ label: 'm' })
    }
  }, [simulation])

  /**
   * On change
   * @param type Type
   */
  const onChange = useCallback(
    (type: string): void => {
      ;(async () => {
        try {
          await _onMeshGlobalType(simulation, type, swr, dispatch)

          setMeshGlobalType(type)
          if (type === 'auto') setMeshGlobalValue('normal')
          else setMeshGlobalValue('1')
        } catch (err) {}
      })()
    },
    [simulation, swr, dispatch]
  )

  /**
   * On size
   * @param value Value
   */
  const onSize = useCallback(
    (value: string | number): void => {
      ;(async () => {
        try {
          await _onMeshGlobalSize(simulation, value, swr, dispatch)
          setMeshGlobalValue(value)
        } catch (err) {}
      })()
    },
    [simulation, swr, dispatch]
  )

  /**
   * On unit
   * @param unit Unit
   */
  const onUnit = useCallback(
    (unit: IUnit): void => {
      ;(async () => {
        try {
          await _onMeshGlobalUnit(simulation, unit, swr, dispatch)
          setMeshGlobalUnit(unit)
        } catch (err) {}
      })()
    },
    [simulation, swr, dispatch]
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
            noLarge
            defaultValue={meshGlobalValue}
            units={[{ label: 'm' }, { label: 'mm', multiplicator: 1e3 }]}
            unit={meshGlobalUnit}
            onValueChange={onSize}
            onUnitChange={onUnit}
          />
        )}
      </Space>
    </Card>
  )
}

export default Mesh
