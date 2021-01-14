import { useState, useEffect } from 'react'
import { message, Button, Card, Space, Typography } from 'antd'

import PluginForm from './pluginForm'
import Delete from './delete'

import PluginAPI from '../../../../src/api/plugin'

import Sentry from '../../../../src/lib/sentry'

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
const List = ({ plugin }) => {
  // State
  const [list, setList] = useState([])
  const [edit, setEdit] = useState(false)

  // Data
  const [plugins, { mutateOnePlugin }] = PluginAPI.usePlugins()

  // List
  useEffect(() => {
    const pluginsList = plugins.map((p) => {
      if (p.key !== plugin.key) return

      const configuration = p.configuration
      return (
        <Card
          key={p.uuid}
          title={configuration.name.value}
          style={{ marginTop: '10px' }}
        >
          {edit ? (
            <PluginForm
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

      //New plugins
      const index = plugins.findIndex((p) => p.uuid === initialPlugin.uuid)
      const newPlugins = [
        ...plugins.slice(0, index),
        initialPlugin,
        ...plugins.slice(index + 1)
      ]

      // API
      await PluginAPI.update(newPlugins)

      // Mutate
      mutateOnePlugin(initialPlugin)

      // Finish
      setEdit(false)
    } catch (err) {
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
    }
  }

  /**
   * Render
   */
  return <>{list}</>
}

export default List
