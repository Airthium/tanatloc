import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Space, Typography } from 'antd'

import PluginDialog from '../dialog'
import Delete from '../delete'

/**
 * Plugins list
 * @param {Object} props Props
 */
const List = ({ plugin, plugins, swr }) => {
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
                id: p.id,
                configuration: p.configuration
              }}
              swr={{ delOnePlugin: swr.delOnePlugin }}
            />,
            <PluginDialog
              key="plugin"
              plugin={{
                name: p.name,
                configuration: p.configuration
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
