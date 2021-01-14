import { useState } from 'react'
import { message, Button } from 'antd'
import { v4 as uuid } from 'uuid'

import PluginForm from './pluginForm'
import List from './list'

import PluginAPI from '../../../../src/api/plugin'

import Sentry from '../../../../src/lib/sentry'

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
      // Set values
      Object.keys(values).forEach((key) => {
        plugin.configuration[key].value = values[key]
      })

      // Remove logo
      plugin.logo && delete plugin.logo

      // Set uuid
      plugin.uuid = uuid()

      // API
      await PluginAPI.add(plugin)

      // Mutate
      addOnePlugin(plugin)

      // Finish
      setAdd(false)
    } catch (err) {
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
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
