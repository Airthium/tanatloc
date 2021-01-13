import { useState } from 'react'
import { Button } from 'antd'

import PluginAPI from '../../../../src/api/plugin'

import Sentry from '../../../../src/lib/sentry'

const errors = {
  updateError: 'Unable to delete plugin'
}

/**
 * Delete plugin
 * @param {Object} props Props
 */
const Delete = ({ plugin }) => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const [plugins, { delOnePlugin }] = PluginAPI.usePlugins()

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)

    try {
      const index = plugins.findIndex((p) => p.uuid === plugin.index)

      if (index === -1) throw new Error('Unable to find the plugin')

      // Update
      const newPlugins = [
        ...plugins.slice(0, index),
        ...plugins.slice(index + 1)
      ]

      // API
      await PluginAPI.update(newPlugins)

      // Mutate
      delOnePlugin(plugin)
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
    <Button type="danger" loading={loading} onClick={onDelete}>
      Delete
    </Button>
  )
}

export default Delete
