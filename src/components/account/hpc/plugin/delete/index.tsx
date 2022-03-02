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
const errors = {
  updateError: 'Unable to delete plugin'
}

/**
 * On delete
 * @param plugin Plugin
 * @param setLoading Set loading
 * @param swr SWR
 */
export const onDelete = async (
  plugin: IClientPlugin,
  setLoading: Dispatch<SetStateAction<boolean>>,
  swr: { delOnePlugin: (plugin: IClientPlugin) => void }
): Promise<void> => {
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
      text={'Delete "' + (plugin.configuration.name?.value || 'plugin') + '"?'}
      onDelete={() => onDelete(plugin, setLoading, swr)}
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
