/** @module Components.Project.Simulation.Run.CloudServer */

import dynamic from 'next/dynamic'
import { useState, useEffect, ComponentType } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Modal, Space, Typography } from 'antd'
import { CloudServerOutlined } from '@ant-design/icons'
import { merge } from 'lodash'

import { IClientPlugin } from '@/plugins/index.d'
import { IModel } from '@/models/index.d'

import { LinkButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'
import PluginsAPI from '@/api/plugins'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  cloudServer?: IModel['configuration']['run']['cloudServer']
  onOk: (plugin: IClientPlugin) => Promise<void>
}

/**
 * Errors
 */
export const errors = {
  plugins: 'Plugins error',
  pluginsLoad: 'Unable to load plugins'
}

/**
 * Cloud server
 * @param props Props
 * @returns CloudServer
 */
const CloudServer = ({ disabled, cloudServer, onOk }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [Plugins, setPlugins] = useState<IClientPlugin[]>([])

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
   * Render
   */
  return (
    <Card size="small" title="Computational resource">
      <Modal
        open={visible}
        title="Computational resource"
        okButtonProps={{
          disabled: true,
          style: { display: 'none' }
        }}
        onCancel={() => setVisible(false)}
        style={{ width: 'unset' }}
      >
        <Space direction="vertical">
          <Typography.Text>
            Your computational resource does not appear in this list? Create one
            in your{' '}
            <LinkButton
              onClick={() =>
                router.push({
                  pathname: '/dashboard',
                  query: { page: 'account', tab: 'hpc' }
                })
              }
            >
              account settings
            </LinkButton>
          </Typography.Text>
          <Space align="start" direction="horizontal" wrap={true}>
            {plugins?.map((plugin) => {
              const Plugin = Plugins.find((p) => p.key === plugin.key)
              if (!Plugin) return

              const Renderer: ComponentType<{
                data: any
                onSelect: (diff: IClientPlugin) => void
              }> = dynamic(
                () => import(`/plugins/${Plugin.key}/src/components`)
              )

              return (
                <Card key={plugin.uuid} title={plugin.configuration.name.value}>
                  <Renderer
                    data={plugin.data}
                    onSelect={(diff: IClientPlugin) => {
                      // Merge
                      merge(plugin, diff)
                      // Ok
                      onOk(plugin)
                      // Close
                      setVisible(false)
                    }}
                  />
                </Card>
              )
            })}
          </Space>
        </Space>
      </Modal>
      <Space direction="vertical" className="full-width">
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
          className="full-width"
          disabled={disabled}
          type={cloudServer ? 'link' : 'primary'}
          icon={<CloudServerOutlined />}
          onClick={() => setVisible(true)}
        >
          {cloudServer ? 'Modify the resource' : 'Select a resource'}
        </Button>
      </Space>
    </Card>
  )
}

export default CloudServer
