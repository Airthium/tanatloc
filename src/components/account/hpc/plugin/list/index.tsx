/** @module Components.Account.HPC.Plugin.List */

import { useState, useEffect } from 'react'
import { Card, Space, Typography } from 'antd'
import parse from 'html-react-parser'

import { IClientPlugin } from '@/plugins/index.d'

import PluginDialog from '../dialog'
import Delete from '../delete'

/**
 * Props
 */
export interface IProps {
  plugin: IClientPlugin
  plugins: IClientPlugin[]
  swr: {
    delOnePlugin: (plugin: IClientPlugin) => void
    mutateOnePlugin: (plugin: IClientPlugin) => void
  }
}

/**
 * Plugins list
 * @param props Props
 * @returns List
 */
const List = ({ plugin, plugins, swr }: IProps): JSX.Element => {
  // State
  const [list, setList] = useState<Array<JSX.Element>>([])

  // List
  useEffect(() => {
    const pluginsList = plugins
      .map((p: IClientPlugin) => {
        if (p.key !== plugin.key) return

        const configuration = p.configuration

        const children = Object.keys(configuration)
          .map((key) => {
            if (key === 'name') return

            let content: JSX.Element
            if (configuration[key].type === 'textarea') {
              const code = configuration[key].value
              content = (
                <Typography.Paragraph>
                  <pre>
                    <code>{code}</code>
                  </pre>
                </Typography.Paragraph>
              )
            } else if (configuration[key].type === 'password') {
              content = <Typography.Text>******</Typography.Text>
            } else {
              content = (
                <Typography.Text>
                  {configuration[key].value || 'unset'}
                </Typography.Text>
              )
            }

            return (
              <Typography.Paragraph key={key}>
                <Typography.Text strong={true}>
                  {configuration[key].label}:
                </Typography.Text>{' '}
                {content}
              </Typography.Paragraph>
            )
          })
          .filter((c) => c)

        return (
          <Card
            key={p.uuid}
            title={configuration.name?.value}
            actions={[
              <Delete
                key="delete"
                plugin={{
                  uuid: p.uuid,
                  configuration: p.configuration
                }}
                swr={{ delOnePlugin: swr.delOnePlugin }}
              />,
              <PluginDialog
                key="plugin"
                plugin={{
                  uuid: p.uuid,
                  key: p.key,
                  name: p.name,
                  needInit: p.needInit,
                  configuration: p.configuration,
                  inUseConfiguration: p.inUseConfiguration
                }}
                swr={{ mutateOnePlugin: swr.mutateOnePlugin }}
                edit={true}
              />
            ]}
          >
            <>
              <Typography.Text>{parse(p.description || '')}</Typography.Text>
              {children.length ? (
                children
              ) : (
                <Typography.Text>No configuration data</Typography.Text>
              )}
            </>
          </Card>
        )
      })
      .filter((c) => c) as JSX.Element[]

    setList(pluginsList)
  }, [plugin, plugins, swr])

  /**
   * Render
   */
  return (
    <Space direction="horizontal" wrap={true} size={20}>
      {list}
    </Space>
  )
}

export default List
