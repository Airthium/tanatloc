/** @module Components.Project.Simulation.Run.CloudServer */

import dynamic from 'next/dynamic'
import {
  useState,
  useEffect,
  ComponentType,
  useCallback,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo
} from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Modal, Space, Tooltip, Typography } from 'antd'
import { CloudDownloadOutlined, CloudServerOutlined } from '@ant-design/icons'
import { merge } from 'lodash'

import { HPCClientPlugin } from '@/plugins/index.d'
import { IModel } from '@/models/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import { LinkButton } from '@/components/assets/button'

import PluginAPI from '@/api/plugin'
import PluginsAPI from '@/api/plugins'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  parallel?: boolean
  cloudServer?: IModel['configuration']['run']['cloudServer']
  onOk: (plugin: HPCClientPlugin) => Promise<void>
}

export interface IPluginProps {
  plugin: HPCClientPlugin
  parallel?: boolean
  onOk: (plugin: HPCClientPlugin) => Promise<void>
  setVisible: Dispatch<SetStateAction<boolean>>
}

export interface IPluginsProps {
  pluginsList: HPCClientPlugin[]
  plugins: HPCClientPlugin[]
  parallel?: boolean
  onOk: (plugin: HPCClientPlugin) => Promise<void>
  setVisible: Dispatch<SetStateAction<boolean>>
}

/**
 * Errors
 */
export const errors = {
  plugins: 'Plugins error',
  pluginsLoad: 'Unable to load plugins',
  extra: 'Unable to execute extra action'
}

/**
 * On extra
 * @param plugin Plugin
 * @param action Action
 */
export const _onExtra = async (
  plugin: HPCClientPlugin,
  action: string
): Promise<void> => await PluginAPI.extra(plugin, action)

/**
 * Plugin
 * @param props Props
 * @returns Plugin
 */
const Plugin: React.FunctionComponent<IPluginProps> = ({
  plugin,
  parallel,
  onOk,
  setVisible
}) => {
  // Renderer
  const Renderer: ComponentType<{
    data: any
    parallel?: boolean
    onSelect: (diff: HPCClientPlugin) => void
  }> = dynamic(() => import(`/plugins/${plugin.key}/src/components`))

  /**
   * On select
   * @param diff Plugin
   */
  const onSelect = useCallback(
    (diff: HPCClientPlugin): void => {
      asyncFunctionExec(async () => {
        // Merge
        merge(plugin, diff)
        // Ok
        await onOk(plugin)
        // Close
        setVisible(false)
      })
    },
    [plugin, onOk, setVisible]
  )

  /**
   * Render
   */
  return (
    <Card key={plugin.uuid} title={plugin.configuration.name.value}>
      <Renderer data={plugin.data} parallel={parallel} onSelect={onSelect} />
    </Card>
  )
}

/**
 * Plugins
 * @param props Props
 * @returns Plugins
 */
const Plugins: React.FunctionComponent<IPluginsProps> = ({
  pluginsList,
  plugins,
  parallel,
  onOk,
  setVisible
}) => {
  const pluginsLength = useMemo(() => plugins.length, [plugins])
  /**
   * Render
   */
  if (!pluginsLength) return null
  return (
    <Space direction="vertical">
      {plugins.map((plugin) => {
        const check = pluginsList.find((p) => p.key === plugin.key)
        if (!check) return null

        return (
          <Plugin
            key={plugin.uuid}
            plugin={plugin}
            parallel={parallel}
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
const CloudServer: React.FunctionComponent<IProps> = ({
  disabled,
  parallel,
  cloudServer,
  onOk
}) => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [pluginsList, setPluginsList] = useState<HPCClientPlugin[]>([])

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const router = useRouter()
  const [plugins, { errorPlugins }] = PluginAPI.usePlugins()

  // Plugins errors
  useEffect(() => {
    if (errorPlugins)
      dispatch(addError({ title: errors.plugins, err: errorPlugins }))
  }, [errorPlugins, dispatch])

  // Plugins
  useEffect(() => {
    asyncFunctionExec(async () => {
      try {
        const list = await PluginsAPI.list()
        const listHPC = list.filter(
          (l) => l.category === 'HPC'
        ) as HPCClientPlugin[]
        setPluginsList(listHPC)
      } catch (err: any) {
        dispatch(addError({ title: errors.pluginsLoad, err }))
      }
    })
  }, [dispatch])

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

  /**
   * Dashboard
   */
  const dashboard = useCallback((): void => {
    asyncFunctionExec(async () => {
      await router.push({
        pathname: '/dashboard',
        query: { page: 'account', tab: 'hpc' }
      })
    })
  }, [router])

  /**
   * On extra
   * @param action Action
   */
  const onExtra = useCallback(
    (action: string): void => {
      asyncFunctionExec(async () => {
        try {
          await _onExtra(cloudServer!, action)
        } catch (err: any) {
          dispatch(addError({ title: errors.extra, err }))
        }
      })
    },
    [cloudServer, dispatch]
  )

  // Extras
  const extras = useMemo(() => {
    const extra = cloudServer?.extra
    if (!extra) return <></>

    const extras = Object.keys(extra).map((key) => {
      const e = extra[key]
      const icon =
        e.icon === 'cloud-download' ? <CloudDownloadOutlined /> : null
      if (e.type === 'button')
        return (
          <Tooltip key={e.action} title={e.label}>
            <Button icon={icon} onClick={() => onExtra(e.action)} />
          </Tooltip>
        )
    })

    return (
      <div>
        Custom plugin actions:
        <br />
        {extras}
      </div>
    )
  }, [cloudServer?.extra, onExtra])

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
            parallel={parallel}
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

            {Object.keys(cloudServer.inUseConfiguration ?? {}).map((key) => {
              const item = cloudServer.inUseConfiguration![key]
              const parallelOnly = item.parallelOnly

              if (parallelOnly && !parallel) return

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
        {extras}
      </Space>
    </Card>
  )
}

export default CloudServer
