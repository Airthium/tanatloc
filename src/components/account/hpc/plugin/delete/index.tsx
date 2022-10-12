/** @module Components.Account.HPC.Plugin.Delete */

import { useState } from 'react'
import { Typography } from 'antd'

import { IClientPlugin } from '@/plugins/index.d'

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
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      title="Delete plugin"
      text={
        <>
          Are you sure you want to delete the plugin{' '}
          <Typography.Text strong>
            {plugin.configuration.name?.value}
          </Typography.Text>
          ?
        </>
      }
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

export default Delete
