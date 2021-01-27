import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Modal, Space, Typography } from 'antd'
import { CloudServerOutlined } from '@ant-design/icons'
import merge from 'lodash.merge'

import Plugins from '@/plugin'

import PluginAPI from '@/api/plugin'

const CloudServer = ({ cloudServer, onOk }) => {
  // State
  const [visible, setVisible] = useState(false)

  // Data
  const router = useRouter()
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
    <Card title="Cloud server">
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
        <Space direction="vertical">
          <Typography.Text>
            Your cloud server does not appear in this list? Create one in your
            <Button
              onClick={() =>
                router.push({
                  pathname: '/dashboard',
                  query: { page: 'account', tab: 'hpc' }
                })
              }
            >
              account settings
            </Button>
          </Typography.Text>
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
                <Space key={key}>
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
