import PropTypes from 'prop-types'
import { useState } from 'react'

import { IClientPlugin } from '@/database/index.d'

import { DeleteButton } from '@/components/assets/button'
import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'

export interface IProps {
  plugin: IClientPlugin
  swr: {
    delOnePlugin: Function
  }
}

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
 * @param props Props
 */
const Delete = ({ plugin, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)

    try {
      // API
      await PluginAPI.del(plugin)

      // Mutate
      swr.delOnePlugin(plugin)
    } catch (err) {
      ErrorNotification(errors.updateError, err)
      throw err
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