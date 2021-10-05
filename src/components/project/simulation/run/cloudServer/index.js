import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Modal, Space, Typography } from 'antd'
import { CloudServerOutlined } from '@ant-design/icons'
import merge from 'lodash.merge'

import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'
import PluginsAPI from '@/api/plugins'

/**
 * Errors (run/cloudServer)
 * @memberof Components.Project.Simulation
 */
const errors = {
  plugins: 'Plugins error',
  pluginsLoad: 'Unable to load plugins'
}

/**
 * Cloud server
 * @memberof Components.Project.Simulation
 * @param {Object} props Props `{ disabled, cloudServer, onOk }`
 */
const CloudServer = ({ disabled, cloudServer, onOk }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [Plugins, setPlugins] = useState([])

  // Data
  const router = useRouter()
  const [plugins, { errorPlugins }] = PluginAPI.usePlugins()

  // Plugins errors
  useEffect(() => {
    if (errorPlugins) ErrorNotification(errors.plugins, errorPlugins)
  }, [errorPlugins])

  // Plugins
  useEffect(() => {
    PluginsAPI.list()
      .then((list) => {
        setPlugins(list)
      })
      .catch((err) => {
        ErrorNotification(errors.pluginsLoad, err)
      })
  }, [])

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
              const Plugin = Plugins.find((p) => p.key === plugin.key)
              if (!Plugin) return

              const Renderer = dynamic(() =>
                import(`/plugins/${Plugin.key}/src/components`)
              )

              return (
                <Card key={plugin.uuid} title={plugin.configuration.name.value}>
                  <Renderer
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
            <Typography.Text strong={true}>
              {cloudServer.configuration.name.value}
            </Typography.Text>
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
