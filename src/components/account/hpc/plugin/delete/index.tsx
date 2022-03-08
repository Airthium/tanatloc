/** @module Components.Account.HPC.Plugin.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'

import { IClientPlugin } from '@/database/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'

/**
 * Props
 */
export interface IProps {
  plugin: IClientPlugin
  swr: {
    delOnePlugin: (plugin: IClientPlugin) => void
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete plugin'
}

/**
 * On delete
 * @param plugin Plugin
 * @param swr SWR
 */
export const onDelete = async (
  plugin: IClientPlugin,
  swr: { delOnePlugin: (plugin: IClientPlugin) => void }
): Promise<void> => {
  try {
    // API
    await PluginAPI.del({ uuid: plugin.uuid })

    // Mutate
    swr.delOnePlugin(plugin)
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ plugin, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      title="Delete plugin"
      text={'Delete "' + (plugin.configuration.name?.value || 'plugin') + '"?'}
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(plugin, swr)
        } finally {
          setLoading(false)
        }
      }}
    >
      Delete
    </DeleteButton>
  )
}

Delete.propTypes = {
  plugin: PropTypes.exact({
    uuid: PropTypes.string.isRequired,
    configuration: PropTypes.object.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    delOnePlugin: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
