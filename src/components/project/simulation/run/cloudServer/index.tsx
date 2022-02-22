import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useState, useEffect, ComponentType } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Modal, Space, Typography } from 'antd'
import { CloudServerOutlined } from '@ant-design/icons'
import { merge } from 'lodash'

import { IClientPlugin } from '@/database/index.d'
import { IModel } from '@/models/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'
import PluginsAPI from '@/api/plugins'

export interface IProps {
  disabled?: boolean
  cloudServer: IModel['configuration']['run']['cloudServer']
  onOk: (plugin: IClientPlugin) => Promise<void>
}

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
 * @param props Props
 */
const CloudServer = ({ disabled, cloudServer, onOk }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [Plugins, setPlugins]: [IClientPlugin[], Function] = useState([])

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
  const close = (): void => {
    setVisible(false)
  }

  /**
   * On merge
   * @param plugin Plugin
   * @param diff Diff
   */
  const onMerge = (plugin: IClientPlugin, diff: IClientPlugin): void => {
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
    <Card size="small" title="Cloud server">
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

              const Renderer: ComponentType<{ data: any; onSelect: Function }> =
                dynamic(() => import(`/plugins/${Plugin.key}/src/components`))

              return (
                <Card key={plugin.uuid} title={plugin.configuration.name.value}>
                  <Renderer
                    data={plugin.data}
                    onSelect={(diff: IClientPlugin) => onMerge(plugin, diff)}
                  />
                </Card>
              )
            })}
          </Space>
        </Space>
      </Modal>
      <Space direction="vertical">
        {cloudServer && (
          <>
            <Typography.Text>
              <span className="text-light">Plugin:</span> {cloudServer.name}
            </Typography.Text>

            <Typography.Text>
              <span className="text-light">Name:</span>{' '}
              {cloudServer.configuration.name.value}
            </Typography.Text>

            {Object.keys(cloudServer.inUseConfiguration).map((key) => {
              const item = cloudServer.inUseConfiguration[key]

              let value = item.value
              if (typeof value === 'boolean') value = value ? 'yes' : 'no'

              return (
                <Typography.Text key={key}>
                  <span className="text-light">{item.label}:</span> {value}
                </Typography.Text>
              )
            })}
          </>
        )}
        <Button
          disabled={disabled}
          type={cloudServer ? 'link' : 'primary'}
          icon={<CloudServerOutlined />}
          onClick={() => setVisible(true)}
        >
          {cloudServer ? 'Modify the cloud server' : 'Select a Cloud server'}
        </Button>
      </Space>
    </Card>
  )
}

CloudServer.propTypes = {
  disabled: PropTypes.bool,
  cloudServer: PropTypes.shape({
    name: PropTypes.string,
    configuration: PropTypes.shape({
      name: PropTypes.shape({
        value: PropTypes.string
      })
    }),
    inUseConfiguration: PropTypes.object.isRequired
  }),
  onOk: PropTypes.func.isRequired
}

export default CloudServer
