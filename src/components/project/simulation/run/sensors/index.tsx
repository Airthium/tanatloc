import { Button, Card, Space } from 'antd'
import { ApiOutlined } from '@ant-design/icons'
import { useCallback, useState } from 'react'
import Sensor from './sensor'

export interface IProps {
  setVisible: (visible: boolean) => void
}

const Sensors = ({ setVisible }: IProps): JSX.Element => {
  // State
  const [sensorVisible, setSensorVisible] = useState<boolean>()
  const [sensor, setSensor] = useState<any>()

  const onAdd = useCallback(() => {
    setSensor(undefined)
    setSensorVisible(true)
    setVisible(false)
  }, [setVisible])

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
      <Sensor visible={sensorVisible} sensor={sensor} onClose={onClose} />
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
      </Space>
    </Card>
  )
}

export default Sensors
