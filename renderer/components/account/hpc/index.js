import { useState } from 'react'
import { message, Button, Card, Form, Input, Select } from 'antd'
import Plugins from '../../../../plugin'

import UserAPI from '../../../../src/api/user'

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

  // Data
  const [user, { mutateUser }] = UserAPI.useUser()

  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  }
  const tailLayout = {
    wrapperCol: { offset: 2, span: 8 }
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

      // New user
      const newUser = { ...user }

      // Update local
      const index = newUser.plugins?.find((p) => p.key === plugin.key)
      if (index)
        newUser.plugins = [
          ...newUser.plugins.slice(0, index),
          plugin,
          ...newUser.plugins.slice(index + 1)
        ]
      else newUser.plugins = [...(newUser.plugins || []), plugin]

      // API
      await UserAPI.update([{ key: 'plugins', value: newUser.plugins }])

      // Mutate
      mutateUser({ user: newUser })
    } catch (err) {
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  // Plugins list
  const HPCPlugins = Object.keys(Plugins)
    .map((key) => {
      const plugin = Plugins[key]
      if (plugin.category === 'HPC') return plugin
    })
    .filter((p) => p)

  const plugins = HPCPlugins.map((plugin) => {
    const existingPlugin = user.plugins?.find((p) => p.key === plugin.key)
    const initialValues = {}
    existingPlugin?.configuration &&
      Object.keys(existingPlugin.configuration).forEach((key) => {
        initialValues[key] = existingPlugin.configuration[key].value
      })
    return (
      <Card key={plugin.name} title={plugin.name}>
        {plugin.logo && (
          <img src={plugin.logo} style={{ width: '10%', margin: '10px' }} />
        )}
        <div dangerouslySetInnerHTML={{ __html: plugin.description }} />

        {plugin.configuration && (
          <Form
            {...layout}
            onFinish={(values) => onFinish(plugin, values)}
            initialValues={initialValues}
          >
            {Object.keys(plugin.configuration).map((key) => {
              const item = plugin.configuration[key]
              if (item.type === 'password') return passwordItem(item, key)
              else if (item.type === 'select') return selectItem(item, key)
            })}
            <Form.Item {...tailLayout}>
              <Button loading={loading} type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    )
  })

  /**
   * Render
   */
  return <>{plugins}</>
}

export default HPC
