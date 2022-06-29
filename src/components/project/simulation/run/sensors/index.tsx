/** @module Components.Simulation.Project.Run.Sensors */

import { useCallback, useState } from 'react'
import { Button, Card, Space } from 'antd'
import { ApiOutlined } from '@ant-design/icons'

import {
  IFrontMutateSimulationsItem,
  IFrontSimulationsItem
} from '@/api/index.d'

import Sensor from './sensor'
import List from './list'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  setVisible: (visible: boolean) => void
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Sensors
 * @param props Props
 * @returns Sensors
 */
const Sensors = ({ simulation, setVisible, swr }: IProps): JSX.Element => {
  // State
  const [sensorVisible, setSensorVisible] = useState<boolean>()
  const [sensor, setSensor] = useState<any>()

  /**
   * on add
   */
  const onAdd = useCallback(() => {
    setSensor(undefined)
    setSensorVisible(true)
    setVisible(false)
  }, [setVisible])

  /**
   * On close
   */
  const onClose = useCallback(() => {
    setSensorVisible(false)
    setSensor(undefined)
    setVisible(true)
  }, [setVisible])

  /**
   * Render
   */
  return (
    <Card size="small" title="Sensors">
      <Sensor
        visible={sensorVisible}
        simulation={simulation}
        sensor={sensor}
        onClose={onClose}
        swr={swr}
      />
      <Space direction="vertical" className="full-width">
        <Button
          className="full-width"
          disabled={false}
          type="primary"
          icon={<ApiOutlined />}
          onClick={onAdd}
        >
          Add a sensor
        </Button>
        <List simulation={simulation} swr={swr} />
      </Space>
    </Card>
  )
}

export default Sensors
