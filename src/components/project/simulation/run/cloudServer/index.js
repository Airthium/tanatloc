import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Modal, Space, Typography } from 'antd'
import { CloudServerOutlined } from '@ant-design/icons'
import merge from 'lodash.merge'

import { Error as ErrorNotification } from '@/components/assets/notification'

import Plugins from '@/plugins'

import PluginAPI from '@/api/plugin'

const errors = {
  plugins: 'Plugins error'
}

/**
 * Cloud server
 * @memberof module:components/project/simulation
 * @param {Object} props Props
 */
const CloudServer = ({ disabled, cloudServer, onOk }) => {
  // State
  const [visible, setVisible] = useState(false)

  // Data
  const router = useRouter()
  const [plugins, { errorPlugins }] = PluginAPI.usePlugins()

  // Plugins errors
  useEffect(() => {
    if (errorPlugins) ErrorNotification(errors.plugins, errorPlugins)
  }, [errorPlugins])

  /**
   * Close
   */
  const close = () => {
    setVisible(false)
  }

  /**
   * On merge
   * @param {Object} plugin Plugin
   * @param {Object} diff Diff
   */
  const onMerge = (plugin, diff) => {
    // Merge
    merge(plugin, diff)

    // Ok
    onOk(plugin)

    // Close
    close()
  }

  /**
   * Render
   */
  return (
    <Card title="Cloud server">
      <Modal
        visible={visible}
        title="Cloud server"
        okButtonProps={{
          disabled: true,
          style: { display: 'none' }
        }}
        onCancel={close}
        style={{ width: 'unset' }}
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
          <Space align="start" direction="horizontal" wrap={true}>
            {plugins?.map((plugin) => {
              const base = Plugins[plugin.key]
              return (
                <Card key={plugin.uuid} title={plugin.configuration.name.value}>
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
          disabled={disabled}
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

CloudServer.propTypes = {
  disabled: PropTypes.bool,
  cloudServer: PropTypes.shape({
    name: PropTypes.string,
    inUseConfiguration: PropTypes.object.isRequired
  }),
  onOk: PropTypes.func.isRequired
}

export default CloudServer
