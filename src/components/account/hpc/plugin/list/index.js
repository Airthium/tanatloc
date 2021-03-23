import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Space, Typography } from 'antd'

import PluginDialog from '../dialog'
import Delete from '../delete'

/**
 * Errors hpc/list
 */
const errors = {
  updateError: 'Unable to update the plugin'
}

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
      return (
        <Card key={p.uuid} title={configuration.name?.value}>
          {Object.keys(configuration).map((key) => {
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
          })}
          <Space direction="">
            <PluginDialog
              plugin={p}
              swr={{ mutateOnePlugin: swr.mutateOnePlugin }}
              edit={true}
            />
            <Delete plugin={p} swr={{ delOnePlugin: swr.delOnePlugin }} />
          </Space>
        </Card>
      )
    })

    setList(pluginsList)
  }, [JSON.stringify(plugins), plugin])

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
  plugin: PropTypes.shape({
    key: PropTypes.string.isRequired
  }).isRequired,
  plugins: PropTypes.array.isRequired,
  swr: PropTypes.shape({
    addOnePlugin: PropTypes.func.isRequired,
    delOnePlugin: PropTypes.func.isRequired,
    mutateOnePlugin: PropTypes.func.isRequired
  }).isRequired
}

export default List
