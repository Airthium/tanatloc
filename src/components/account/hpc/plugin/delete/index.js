import PropTypes from 'prop-types'
import { useState } from 'react'

import { DeleteButton } from '@/components/assets/button'
import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'

/**
 * Errors (delete)
 * @memberof Components.Account.HPC.Plugin
 */
const errors = {
  updateError: 'Unable to delete plugin'
}

/**
 * Delete plugin
 * @memberof Components.Account.HPC.Plugin
 * @param {Object} props Props `{ plugin, swr }`
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
      ErrorNotification(errors.updateError, err)
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
  plugin: PropTypes.exact({
    uuid: PropTypes.string.isRequired,
    configuration: PropTypes.object
  }).isRequired,
  swr: PropTypes.exact({
    delOnePlugin: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
