import { useState } from 'react'
import { Button, Card, Modal, Space, Typography } from 'antd'
import { CloudServerOutlined } from '@ant-design/icons'
import merge from 'lodash.merge'

import Plugins from '../../../../../plugin'

import PluginAPI from '../../../../../../src/api/plugin'

const CloudServer = ({ cloudServer, onOk }) => {
  // State
  const [visible, setVisible] = useState(false)

  // Data
  const [plugins] = PluginAPI.usePlugins()

  const close = () => {
    setVisible(false)
  }

  const onMerge = (plugin, diff) => {
    // Merge
    merge(plugin, diff)

    // Ok
    onOk(plugin)

    // Close
    close()
  }

  return (
    <Card>
      <Modal
        visible={visible}
        title="Cloud server"
        onOk={() => {}}
        okButtonProps={{
          disabled: true,
          style: { display: 'none' }
        }}
        onCancel={close}
      >
        <Space align="start" direction="horizontal">
          {plugins?.map((plugin) => {
            const base = Plugins[plugin.key]
            return (
              <Card key={plugin.uuid} title={plugin.name}>
                <base.renderer
                  data={plugin.data}
                  onSelect={(diff) => onMerge(plugin, diff)}
                />
              </Card>
            )
          })}
        </Space>
      </Modal>
      <Space direction="vertical">
        <Button
          icon={<CloudServerOutlined />}
          onClick={() => setVisible(true)}
        />
        {cloudServer && (
          <>
            <Typography.Text strong={true}>{cloudServer.name}</Typography.Text>
            {Object.keys(cloudServer.inUseConfiguration).map((key) => {
              const item = cloudServer.inUseConfiguration[key]
              return (
                <Space>
                  <Typography.Text strong={true}>{item.label}:</Typography.Text>
                  <Typography.Text>{String(item.value)}</Typography.Text>
                </Space>
              )
            })}
          </>
        )}
      </Space>
    </Card>
  )
}

export default CloudServer
