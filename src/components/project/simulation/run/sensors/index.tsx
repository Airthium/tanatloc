/** @module Components.Project.Simulation.Run.Sensors */

import { useCallback, useState } from 'react'
import { Button, Card, Space } from 'antd'
import { ApiOutlined } from '@ant-design/icons'

import {
  IFrontGeometriesItem,
  IFrontMutateSimulationsItem,
  IFrontResult,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelSensor } from '@/models/index.d'

import Sensor from './sensor'
import List from './list'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export type Geometry = Pick<IFrontGeometriesItem, 'id' | 'name' | 'summary'>
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'scheme'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  geometries: Geometry[]
  simulation: Simulation
  setVisible: (visible: boolean) => void
  setResults: (results: IFrontResult[]) => void
  setPostprocessing: (result?: IFrontResult) => void
  swr: Swr
}

/**
 * Sensors
 * @param props Props
 * @returns Sensors
 */
const Sensors: React.FunctionComponent<IProps> = ({
  geometries,
  simulation,
  setVisible,
  setResults,
  setPostprocessing,
  swr
}) => {
  // State
  const [sensorVisible, setSensorVisible] = useState<boolean>()
  const [sensor, setSensor] = useState<IModelSensor & { index: number }>()

  /**
   * on add
   */
  const onAdd = useCallback((): void => {
    setResults([])
    setPostprocessing(undefined)
    setSensor(undefined)
    setVisible(false)
    setSensorVisible(true)
  }, [setVisible, setResults, setPostprocessing])

  /**
   * On edit
   * @param sensor Sensor
   */
  const onEdit = useCallback(
    (toEdit: IModelSensor & { index: number }): void => {
      setResults([])
      setPostprocessing(undefined)
      setSensor(toEdit)
      setVisible(false)
      setSensorVisible(true)
    },
    [setVisible, setResults, setPostprocessing]
  )

  /**
   * On close
   */
  const onClose = useCallback((): void => {
    setSensor(undefined)
    setVisible(true)
    setSensorVisible(false)
  }, [setVisible])

  /**
   * Render
   */
  return (
    <Card size="small" title="Sensors">
      <Sensor
        visible={sensorVisible}
        geometries={geometries}
        simulation={simulation}
        sensor={sensor}
        onClose={onClose}
        swr={swr}
      />
      <Space direction="vertical" className={globalStyle.fullWidth}>
        <Button
          className={globalStyle.fullWidth}
          disabled={false}
          type="primary"
          icon={<ApiOutlined />}
          onClick={onAdd}
        >
          Add a sensor
        </Button>
        <List simulation={simulation} onEdit={onEdit} swr={swr} />
      </Space>
    </Card>
  )
}

export default Sensors
