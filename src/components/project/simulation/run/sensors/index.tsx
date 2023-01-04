/** @module Components.Project.Simulation.Run.Sensors */

import { useCallback, useState } from 'react'
import { Button, Card, Space } from 'antd'
import { ApiOutlined } from '@ant-design/icons'

import {
  IFrontMutateSimulationsItem,
  IFrontResult,
  IFrontSimulationsItem
} from '@/api/index.d'
import { IModelSensor } from '@/models/index.d'

import Sensor from './sensor'
import List from './list'

import { globalStyle } from '@/styles'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'scheme'>
  setVisible: (visible: boolean) => void
  setResult: (result?: IFrontResult) => void
  setPostprocessing: (result?: IFrontResult) => void
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Sensors
 * @param props Props
 * @returns Sensors
 */
const Sensors = ({
  simulation,
  setVisible,
  setResult,
  setPostprocessing,
  swr
}: IProps): JSX.Element => {
  // State
  const [sensorVisible, setSensorVisible] = useState<boolean>()
  const [sensor, setSensor] = useState<IModelSensor & { index: number }>()

  /**
   * on add
   */
  const onAdd = useCallback(() => {
    setResult(undefined)
    setPostprocessing(undefined)
    setSensor(undefined)
    setVisible(false)
    setSensorVisible(true)
  }, [setVisible, setResult, setPostprocessing])

  /**
   * On edit
   * @param sensor Sensor
   */
  const onEdit = useCallback(
    (toEdit: IModelSensor & { index: number }) => {
      setResult(undefined)
      setPostprocessing(undefined)
      setSensor(toEdit)
      setVisible(false)
      setSensorVisible(true)
    },
    [setVisible, setResult, setPostprocessing]
  )

  /**
   * On close
   */
  const onClose = useCallback(() => {
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
        simulation={simulation}
        sensor={sensor}
        onClose={onClose}
        swr={swr}
      />
      <Space direction="vertical" css={globalStyle.fullWidth}>
        <Button
          css={globalStyle.fullWidth}
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
