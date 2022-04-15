/** @module Components.Account.HPC.Plugin.List */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { Card, Space, Typography } from 'antd'

import { IClientPlugin } from '@/database/index.d'

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
                <Typography.Text>{configuration[key].value}</Typography.Text>
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
            {children.length ? (
              children
            ) : (
              <Typography.Text>No configuration data</Typography.Text>
            )}
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

List.propTypes = {
  plugin: PropTypes.exact({
    key: PropTypes.string.isRequired
  }).isRequired,
  plugins: PropTypes.arrayOf(
    PropTypes.exact({
      key: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      configuration: PropTypes.object.isRequired,
      inUseConfiguration: PropTypes.object,
      data: PropTypes.object,
      needInit: PropTypes.bool,
      needReInit: PropTypes.bool
    }).isRequired
  ).isRequired,
  swr: PropTypes.exact({
    delOnePlugin: PropTypes.func.isRequired,
    mutateOnePlugin: PropTypes.func.isRequired
  }).isRequired
}

export default List
