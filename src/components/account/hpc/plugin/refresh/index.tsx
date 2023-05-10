/** @module Components.Account.HPC.Plugin.Refresh */

import { useCallback, useState } from 'react'
import { Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

import { IClientPlugin } from '@/plugins/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import PluginAPI from '@/api/plugin'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  plugin: IClientPlugin
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
export const _onUpdate = async (plugin: IClientPlugin): Promise<void> => {
  try {
    // Local
    const initialPlugin = Utils.deepCopy(plugin)
    initialPlugin.needReInit = true

    // API
    await PluginAPI.update(initialPlugin)
  } catch (err: any) {
    ErrorNotification(errors.refresh, err)
  }
}

/**
 * Refresh
 * @param props Props
 * @returns Refresh
 */
const Refresh = ({ plugin }: IProps): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      await _onUpdate(plugin)
      setLoading(false)
    })()
  }, [plugin])

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
