/** @module Components.Project.Simulation.Geometry.Mesh */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback
} from 'react'
import { Card, Select, Space, Typography } from 'antd'

import { ISimulation } from '@/database/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import Formula from '@/components/assets/formula'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
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
  simulation: ISimulation,
  type: string,
  swr: { mutateOneSimulation: (simulation: ISimulation) => void }
): Promise<void> => {
  try {
    const newSimulation = { ...simulation }

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
  simulation: ISimulation,
  type: string,
  value: string,
  swr: { mutateOneSimulation: (simulation: ISimulation) => void }
): Promise<void> => {
  try {
    const newSimulation = { ...simulation }

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
  const [meshGlobalType, setMeshGlobalType]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState()
  const [meshGlobalValue, setMeshGlobalValue]: [
    string,
    Dispatch<SetStateAction<string>>
  ] = useState()

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
    async (value) => {
      try {
        await onMeshGlobalSize(simulation, meshGlobalType, value, swr)
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
        <Typography.Text>
          Type:
          <br />
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
        </Typography.Text>
        {meshGlobalType === 'auto' && (
          <Typography.Text>
            Size:
            <br />
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
          </Typography.Text>
        )}
        {meshGlobalType === 'manual' && (
          <Typography.Text>
            Size:
            <br />
            <Formula
              defaultValue={meshGlobalValue}
              onValueChange={onSize}
              unit="m"
            />
          </Typography.Text>
        )}
      </Space>
    </Card>
  )
}

Mesh.propTypes = {
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

export default Mesh
