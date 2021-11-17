import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Space, Typography } from 'antd'

import { IClientPlugin } from '@/database/index.d'

import PluginDialog from '../dialog'
import Delete from '../delete'

interface IProps {
  plugin: IClientPlugin
  plugins: IClientPlugin[]
  swr: {
    delOnePlugin: Function
    mutateOnePlugin: Function
  }
}

/**
 * Plugins list
 * @memberof Components.Account.HPC.Plugin
 * @param {Object} props Props `{ plugin, plugins, swr }`
 */
const List = ({ plugin, plugins, swr }: IProps): JSX.Element => {
  // State
  const [list, setList] = useState([])

  // List
  useEffect(() => {
    const pluginsList = plugins.map((p) => {
      if (p.key !== plugin.key) return

      const configuration = p.configuration

      const children = Object.keys(configuration)
        .map((key) => {
          if (key === 'name') return
          return (
            <Typography.Paragraph key={key}>
              <Typography.Text strong={true}>
                {configuration[key].label}:
              </Typography.Text>{' '}
              <Typography.Text>
                {configuration[key].type === 'password'
                  ? '******'
                  : configuration[key].value}
              </Typography.Text>
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

    setList(pluginsList)
  }, [plugin, plugins])

  /**
   * Render
   */
  return (
    <Space direction="horizontal" wrap={true}>
      {list}
    </Space>
  )
}

List.propTypes = {
  plugin: PropTypes.exact({
    key: PropTypes.string.isRequired
  }).isRequired,
  plugins: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    delOnePlugin: PropTypes.func.isRequired,
    mutateOnePlugin: PropTypes.func.isRequired
  }).isRequired
}

export default List
