import { useState } from 'react'
import { Button } from 'antd'
import { v4 as uuid } from 'uuid'

import { Error } from '@/components/assets/notification'

import PluginForm from './pluginForm'
import List from './list'

import PluginAPI from '@/api/plugin'

/**
 * Errors hpc/plugin
 */
const errors = {
  updateError: 'Unable to update plugins'
}

/**
 * Plugin
 * @param {Object} props Props
 */
const Plugin = ({ plugin }) => {
  // State
  const [add, setAdd] = useState(false)

  // Data
  const [, { addOnePlugin }] = PluginAPI.usePlugins()

  /**
   * On finish
   * @param {Object} values Values
   */
  const onFinish = async (values) => {
    try {
      // New plugin
      const newPlugin = { ...plugin }

      // Set values
      Object.keys(values).forEach((key) => {
        newPlugin.configuration[key].value = values[key]
      })

      // Remove logo
      newPlugin.logo && delete newPlugin.logo

      // Remove renderer
      newPlugin.renderer && delete newPlugin.renderer

      // Set uuid
      newPlugin.uuid = uuid()

      // API
      await PluginAPI.add(newPlugin)

      // Mutate
      addOnePlugin(newPlugin)

      // Finish
      setAdd(false)
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * Render
   */
  return (
    <>
      {add ? (
        <PluginForm
          plugin={plugin}
          onFinish={onFinish}
          onCancel={() => setAdd(false)}
        />
      ) : (
        <Button type="primary" onClick={() => setAdd(true)}>
          Add
        </Button>
      )}
      <List plugin={plugin} />
    </>
  )
}

export default Plugin
