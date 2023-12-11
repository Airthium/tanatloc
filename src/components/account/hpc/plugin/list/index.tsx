/** @module Components.Account.HPC.Plugin.List */

import { useMemo, ReactNode } from 'react'
import { Card, Space, Typography } from 'antd'
import parse from 'html-react-parser'

import { HPCClientPlugin } from '@/plugins/index.d'

import Delete from '../delete'
import PluginDialog from '../dialog'
import Refresh from '../refresh'

/**
 * Props
 */
export interface IProps {
  plugin: Pick<HPCClientPlugin, 'key'>
  plugins: HPCClientPlugin[]
  swr: {
    delOnePlugin: (plugin: Pick<HPCClientPlugin, 'key'>) => Promise<void>
    mutateOnePlugin: (plugin: HPCClientPlugin) => Promise<void>
  }
}

/**
 * Plugins list
 * @param props Props
 * @returns List
 */
const List: React.FunctionComponent<IProps> = ({ plugin, plugins, swr }) => {
  // List
  const list = useMemo(() => {
    const pluginsList = plugins
      .map((p: HPCClientPlugin) => {
        if (p.key !== plugin.key) return

        const configuration = p.configuration

        const children = Object.keys(configuration)
          .map((key) => {
            if (key === 'name') return

            let content: ReactNode
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
                  {configuration[key].value ?? 'unset'}
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

        const actions = []
        actions.push(
          <Delete
            key="delete"
            plugin={{
              key: p.key,
              uuid: p.uuid,
              configuration: p.configuration
            }}
            swr={{ delOnePlugin: swr.delOnePlugin }}
          />
        )

        if (p.haveInit) actions.push(<Refresh plugin={p} />)
        actions.push(
          <PluginDialog
            key="plugin"
            plugin={p}
            swr={{ mutateOnePlugin: swr.mutateOnePlugin }}
            edit={true}
          />
        )

        return (
          <Card
            key={p.uuid}
            title={configuration.name?.value}
            actions={actions}
          >
            <>
              <Typography.Text>{parse(p.description ?? '')}</Typography.Text>
              {children.length ? (
                children
              ) : (
                <Typography.Text>No configuration data</Typography.Text>
              )}
            </>
          </Card>
        )
      })
      .filter((c) => c) as ReactNode

    return pluginsList
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
