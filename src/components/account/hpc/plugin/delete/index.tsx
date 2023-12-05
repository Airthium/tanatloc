/** @module Components.Account.HPC.Plugin.Delete */

import { ReactNode, useCallback, useContext, useState } from 'react'
import { Typography } from 'antd'

import { HPCClientPlugin } from '@/plugins/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

import PluginAPI from '@/api/plugin'

/**
 * Props
 */
export interface IProps {
  plugin: Pick<HPCClientPlugin, 'key' | 'uuid' | 'configuration'>
  swr: {
    delOnePlugin: (plugin: Pick<HPCClientPlugin, 'key'>) => Promise<void>
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
export const _onDelete = async (
  plugin: Pick<HPCClientPlugin, 'key' | 'uuid'>,
  swr: {
    delOnePlugin: (plugin: Pick<HPCClientPlugin, 'key'>) => Promise<void>
  }
): Promise<void> => {
  // API
  await PluginAPI.del({ uuid: plugin.uuid })

  // Mutate
  await swr.delOnePlugin(plugin)
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ plugin, swr }: IProps): ReactNode => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(plugin, swr)
    } catch (err: any) {
      dispatch(addError({ title: errors.del, err }))
      throw err
    } finally {
      setLoading(false)
    }
  }, [plugin, swr, dispatch])

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
      onDelete={onDelete}
    >
      Delete
    </DeleteButton>
  )
}

export default Delete
