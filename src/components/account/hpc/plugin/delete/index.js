import PropTypes from 'prop-types'
import { useState } from 'react'

import { DeleteButton } from '@/components/assets/button'
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
const Delete = ({ plugin, swr }) => {
  // State
  const [loading, setLoading] = useState(false)

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)

    try {
      // API
      await PluginAPI.del(plugin)

      // Mutate
      swr.delOnePlugin(plugin)
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
    <DeleteButton
      loading={loading}
      text={
        'Delete "' + (plugin?.configuration?.name?.value || 'plugin') + '"?'
      }
      onDelete={onDelete}
    >
      Delete
    </DeleteButton>
  )
}

Delete.propTypes = {
  plugin: PropTypes.object.isRequired,
  swr: PropTypes.shape({
    delOnePlugin: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
