/** @module Components.Project.Simulation.Run.CloudServer */

import dynamic from 'next/dynamic'
import {
  useState,
  useEffect,
  ComponentType,
  useCallback,
  Dispatch,
  SetStateAction
} from 'react'
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

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  cloudServer?: IModel['configuration']['run']['cloudServer']
  onOk: (plugin: IClientPlugin) => Promise<void>
}

export interface IPluginProps {
  plugin: IClientPlugin
  onOk: (plugin: IClientPlugin) => Promise<void>
  setVisible: Dispatch<SetStateAction<boolean>>
}

export interface IPluginsProps {
  pluginsList: IClientPlugin[]
  plugins: IClientPlugin[]
  onOk: (plugin: IClientPlugin) => Promise<void>
  setVisible: Dispatch<SetStateAction<boolean>>
}

/**
 * Errors
 */
export const errors = {
  plugins: 'Plugins error',
  pluginsLoad: 'Unable to load plugins'
}

/**
 * Plugin
 * @param props Props
 * @returns Plugin
 */
const Plugin = ({ plugin, onOk, setVisible }: IPluginProps): JSX.Element => {
  // Renderer
  const Renderer: ComponentType<{
    data: any
    onSelect: (diff: IClientPlugin) => void
  }> = dynamic(() => import(`/plugins/${plugin.key}/src/components`))

  /**
   * On select
   * @param diff Plugin
   */
  const onSelect = useCallback(
    (diff: IClientPlugin): void => {
      // Merge
      merge(plugin, diff)
      // Ok
      onOk(plugin)
      // Close
      setVisible(false)
    },
    [plugin, onOk, setVisible]
  )

  /**
   * Render
   */
  return (
    <Card key={plugin.uuid} title={plugin.configuration.name.value}>
      <Renderer data={plugin.data} onSelect={onSelect} />
    </Card>
  )
}

/**
 * Plugins
 * @param props Props
 * @returns Plugins
 */
const Plugins = ({
  pluginsList,
  plugins,
  onOk,
  setVisible
}: IPluginsProps): JSX.Element | null => {
  if (!plugins?.length) return null

  return (
    <Space align="start" direction="horizontal" wrap={true}>
      {plugins.map((plugin) => {
        const check = pluginsList.find((p) => p.key === plugin.key)
        if (!check) return null

        return (
          <Plugin
            key={plugin.key}
            plugin={plugin}
            onOk={onOk}
            setVisible={setVisible}
          />
        )
      })}
    </Space>
  )
}

/**
 * Cloud server
 * @param props Props
 * @returns CloudServer
 */
const CloudServer = ({ disabled, cloudServer, onOk }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [pluginsList, setPluginsList] = useState<IClientPlugin[]>([])

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
        setPluginsList(list)
      })
      .catch((err) => {
        ErrorNotification(errors.pluginsLoad, err)
      })
  }, [])

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * Dashboard
   */
  const dashboard = useCallback(() => {
    router
      .push({
        pathname: '/dashboard',
        query: { page: 'account', tab: 'hpc' }
      })
      .catch()
  }, [router])

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
        onCancel={setVisibleFalse}
        style={{ width: 'unset' }}
      >
        <Space direction="vertical">
          <Typography.Text>
            Your computational resource does not appear in this list? Create one
            in your{' '}
            <LinkButton onClick={dashboard}>account settings</LinkButton>
          </Typography.Text>
          <Plugins
            pluginsList={pluginsList}
            plugins={plugins}
            onOk={onOk}
            setVisible={setVisible}
          />
        </Space>
      </Modal>
      <Space direction="vertical" className={globalStyle.fullWidth}>
        {cloudServer && (
          <>
            <Typography.Text>
              <span className={globalStyle.textLight}>Plugin:</span>{' '}
              {cloudServer.name}
            </Typography.Text>

            <Typography.Text>
              <span className={globalStyle.textLight}>Name:</span>{' '}
              {cloudServer.configuration.name.value}
            </Typography.Text>

            {Object.keys(cloudServer.inUseConfiguration).map((key) => {
              const item = cloudServer.inUseConfiguration[key]

              let value = item.value
              if (typeof value === 'boolean') value = value ? 'yes' : 'no'

              return (
                <Typography.Text key={key}>
                  <span className={globalStyle.textLight}>{item.label}:</span>{' '}
                  {value}
                </Typography.Text>
              )
            })}
          </>
        )}
        <Button
          className={globalStyle.fullWidth}
          disabled={disabled}
          type={cloudServer ? 'link' : 'primary'}
          icon={<CloudServerOutlined />}
          onClick={setVisibleTrue}
        >
          {cloudServer ? 'Modify the resource' : 'Select a resource'}
        </Button>
      </Space>
    </Card>
  )
}

export default CloudServer
