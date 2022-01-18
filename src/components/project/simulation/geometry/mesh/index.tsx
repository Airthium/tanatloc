import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Select, Space, Typography } from 'antd'

import { Error as ErrorNotification } from '@/components/assets/notification'
import Formula from '@/components/assets/formula'

import SimulationAPI from '@/api/simulation'

import { ISimulation } from '@/database/index.d'

export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors (geometry/mesh)
 * @memberof Components.Project.Simulation
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * Mesh
 * @param props Props
 */
const Mesh = ({ simulation, swr }: IProps): JSX.Element => {
  // State
  const [meshGlobalType, setMeshGlobalType]: [string, Function] = useState()
  const [meshGlobalValue, setMeshGlobalValue]: [string, Function] = useState()

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
   * On mesh global type
   * @param type Type
   */
  const onMeshGlobalType = async (type: string): Promise<void> => {
    try {
      setMeshGlobalType(type)
      if (type === 'auto') setMeshGlobalValue('normal')
      else setMeshGlobalValue('1')

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
    }
  }

  /**
   * On mehs global size
   * @param value Value
   */
  const onMeshGlobalSize = async (value: string): Promise<void> => {
    try {
      setMeshGlobalValue(value)

      const newSimulation = { ...simulation }

      // Update
      newSimulation.scheme.configuration.geometry.meshParameters = {
        ...newSimulation.scheme.configuration.geometry.meshParameters,
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
    }
  }

  /**
   * Render
   */
  return (
    <Card size="small" title="Mesh refinement">
      <Space direction="vertical">
        <Typography.Text>
          Type:
          <br />
          <Select value={meshGlobalType} onChange={onMeshGlobalType}>
            <Select.Option value="auto">Automatic</Select.Option>
            <Select.Option value="manual">Manual</Select.Option>
          </Select>
        </Typography.Text>
        {meshGlobalType === 'auto' && (
          <Typography.Text>
            Size:
            <br />
            <Select value={meshGlobalValue} onChange={onMeshGlobalSize}>
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
              onValueChange={onMeshGlobalSize}
              unit="$m$"
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
