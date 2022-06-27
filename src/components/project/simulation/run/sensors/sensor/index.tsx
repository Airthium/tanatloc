import { useState } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Button, Drawer, Space, Typography } from 'antd'
import Card from 'antd/lib/card/Card'

import Formula from '@/components/assets/formula'
import { CancelButton } from '@/components/assets/button'

export interface IProps {
  visible?: boolean
  sensor?: {}
  onClose: () => void
}

const Sensor = ({ visible, sensor, onClose }: IProps): JSX.Element => {
  const [current, setCurrent] = useState()

  return (
    <Drawer
      className="sensor"
      title="Sensor"
      placement="left"
      closable={false}
      visible={visible}
      mask={false}
      maskClosable={false}
      width={300}
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => {
            setCurrent(undefined)
            onClose()
          }}
        />
      }
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CancelButton
            onCancel={() => {
              setCurrent(undefined)
              onClose()
            }}
          />
          {sensor ? 'Edit' : 'Add'}
        </div>
      }
    >
      <Space direction="vertical" className="full-width">
        <Card size="small">
          <Space direction="vertical" className="full-width">
            <Typography.Text>Point selection</Typography.Text>X Y Z
          </Space>
        </Card>
        <Card size="small">
          <Space direction="vertical" className="full-width">
            <Typography.Text>Formula</Typography.Text>
            <Formula onValueChange={console.log} />
          </Space>
        </Card>
      </Space>
    </Drawer>
  )
}

export default Sensor
