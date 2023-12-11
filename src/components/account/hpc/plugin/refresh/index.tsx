/** @module Components.Account.HPC.Plugin.Refresh */

import { useCallback, useContext, useState } from 'react'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import { HPCClientPlugin } from '@/plugins/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import Utils from '@/lib/utils'

import PluginAPI from '@/api/plugin'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  plugin: HPCClientPlugin
}

/**
 * Errors
 */
export const errors = {
  refresh: 'Unable to refresh plugin'
}

/**
 * On update
 * @param plugin Plugin
 */
export const _onUpdate = async (plugin: HPCClientPlugin): Promise<void> => {
  // Local
  const initialPlugin = Utils.deepCopy(plugin)
  initialPlugin.needReInit = true

  // API
  await PluginAPI.update(initialPlugin)
}

/**
 * Refresh
 * @param props Props
 * @returns Refresh
 */
const Refresh: React.FunctionComponent<IProps> = ({ plugin }) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    asyncFunctionExec(async () => {
      setLoading(true)
      try {
        await _onUpdate(plugin)
      } catch (err: any) {
        dispatch(addError({ title: errors.refresh, err }))
      } finally {
        setLoading(false)
      }
    })
  }, [plugin, dispatch])

  /**
   * Render
   */
  return (
    <Button
      key="refresh"
      loading={loading}
      icon={<ReloadOutlined />}
      onClick={onClick}
      className={`${globalStyle.noBackground} ${globalStyle.noBorder}`}
    >
      Refresh
    </Button>
  )
}

export default Refresh
