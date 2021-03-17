import { useState, useEffect } from 'react'
import { Button, Card, Space, Typography } from 'antd'

import { Error } from '@/components/assets/notification'

import PluginDialog from '../dialog'
import Delete from '../delete'

import PluginAPI from '@/api/plugin'

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
  const [edit, setEdit] = useState(false)

  // List
  useEffect(() => {
    const pluginsList = plugins.map((p) => {
      if (p.key !== plugin.key) return

      const configuration = p.configuration
      return (
        <Card
          key={p.uuid}
          title={configuration.name?.value}
          style={{ marginTop: '10px' }}
        >
          {edit ? (
            <PluginDialog
              plugin={p}
              onFinish={(values) => onEdit(p, values)}
              onCancel={() => setEdit(false)}
            />
          ) : (
            Object.keys(configuration).map((key) => {
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
          )}
          <Space>
            <Button disabled={edit} onClick={() => setEdit(true)}>
              Edit
            </Button>
            <Delete plugin={p} />
          </Space>
        </Card>
      )
    })

    setList(pluginsList)
  }, [JSON.stringify(plugins), plugin, edit])

  /**
   * On edit
   * @param {Object} initialPlugin Plugin
   * @param {Object} values Values
   */
  const onEdit = async (initialPlugin, values) => {
    try {
      // Set values
      Object.keys(values).forEach((key) => {
        initialPlugin.configuration[key].value = values[key]
      })

      initialPlugin.needReInit = true

      // API
      await PluginAPI.update(initialPlugin)

      // Mutate
      swr.mutateOnePlugin(initialPlugin)

      // Finish
      setEdit(false)
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * Render
   */
  return <Space>{list}</Space>
}

export default List
