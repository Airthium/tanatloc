import { useState, useEffect } from 'react'
import { message, Button, Card, Form, Input, Select, Spin } from 'antd'
import { v4 as uuid } from 'uuid'

import Plugins from '../../../../plugin'

import Delete from './delete'

import PluginAPI from '../../../../src/api/plugin'

import Sentry from '../../../../src/lib/sentry'

const errors = {
  updateError: 'Unable to update plugins'
}

/**
 * HPC plugins
 */
const HPC = () => {
  // State
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [add, setAdd] = useState()

  // Data
  const [
    plugins,
    { addOnePlugin, mutateOnePlugin, loadingPlugins }
  ] = PluginAPI.usePlugins()

  // Plugins list
  useEffect(() => {
    if (loadingPlugins) return

    // HPC only
    const HPCPlugins = Object.keys(Plugins)
      .map((key) => {
        const plugin = Plugins[key]
        if (plugin.category === 'HPC') return plugin
      })
      .filter((p) => p)

    // List
    const pluginsList = HPCPlugins.map((plugin) => {
      const existingPlugin = plugins.filter((p) => p.key === plugin.key)

      return (
        <Card key={plugin.name} title={plugin.name}>
          {plugin.logo && (
            <img src={plugin.logo} style={{ width: '10%', margin: '10px' }} />
          )}
          <div dangerouslySetInnerHTML={{ __html: plugin.description }} />

          {add === plugin.key ? (
            plugin.configuration && (
              <Form {...layout} onFinish={(values) => onFinish(plugin, values)}>
                {Object.keys(plugin.configuration).map((key) => {
                  const item = plugin.configuration[key]
                  if (item.type === 'input') return inputItem(item, key)
                  else if (item.type === 'password')
                    return passwordItem(item, key)
                  else if (item.type === 'select') return selectItem(item, key)
                })}
                <Form.Item {...tailLayout}>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Add
                  </Button>
                </Form.Item>
              </Form>
            )
          ) : (
            <Button type="primary" onClick={() => onAdd(plugin.key)}>
              Add
            </Button>
          )}

          {existingPlugin.map((existing, index) => {
            return (
              <Card key={index} title={existing.configuration.name.value}>
                {Object.keys(existing.configuration).map((key) => {
                  if (key !== 'name')
                    return (
                      <div>
                        {existing.configuration[key].label}:{' '}
                        {existing.configuration[key].type === 'password'
                          ? '******'
                          : existing.configuration[key].value}
                      </div>
                    )
                })}
                <Button onClick={onEdit}>Edit</Button>
                <Delete plugin={existing} />
              </Card>
            )
          })}
        </Card>
      )
    })

    setList(pluginsList)
  }, [loadingPlugins, plugins, add])

  const onAdd = (key) => {
    setAdd(key)
  }

  const onEdit = () => {
    console.log('TODO')
  }

  const inputItem = (item, key) => {
    return (
      <Form.Item
        {...layout}
        key={item.label}
        name={key}
        label={item.label}
        htmlFor={'input-' + key}
        rules={[
          { required: true, message: "'" + item.label + "' is required" }
        ]}
      >
        <Input id={'input-' + key} />
      </Form.Item>
    )
  }

  /**
   * Build password item
   * @param {Object} item Item
   * @param {string} key Key
   */
  const passwordItem = (item, key) => {
    return (
      <Form.Item
        {...layout}
        key={item.label}
        name={key}
        label={item.label}
        htmlFor={'input-' + key}
        rules={[
          { required: true, message: "'" + item.label + "' is required" }
        ]}
      >
        <Input id={'input-' + key} type="password" />
      </Form.Item>
    )
  }

  /**
   * Build select item
   * @param {Object} item Item
   * @param {string} key Key
   */
  const selectItem = (item, key) => {
    return (
      <Form.Item
        {...layout}
        key={item.label}
        name={key}
        label={item.label}
        htmlFor={'select-' + key}
        rules={[
          { required: true, message: "'" + item.label + "' is required" }
        ]}
      >
        <Select id={'select-' + key}>
          {item.options.map((option) => {
            return (
              <Select.Option key={option} value={option}>
                {option}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>
    )
  }

  const onFinish = async (plugin, values) => {
    setLoading(true)

    try {
      // Set values
      Object.keys(values).forEach((key) => {
        plugin.configuration[key].value = values[key]
      })

      // Remove logo
      plugin.logo && delete plugin.logo

      // Set uuid
      plugin.uuid = uuid()

      // New plugins
      const newPlugins = [...plugins, plugin]

      // API
      await PluginAPI.update(newPlugins)

      // Mutate
      mutateOnePlugin(plugin)
    } catch (err) {
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return <>{loadingPlugins ? <Spin /> : list}</>
}

export default HPC
