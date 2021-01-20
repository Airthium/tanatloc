import { useState } from 'react'
import { Button } from 'antd'

import { Error } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'

/**
 * Errors (hpc/delete)
 */
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
  const [, { delOnePlugin }] = PluginAPI.usePlugins()

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)

    try {
      // API
      await PluginAPI.del(plugin)

      // Mutate
      delOnePlugin(plugin)
    } catch (err) {
      Error(errors.updateError, err)
    } finally {
      setLoading(false)
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
