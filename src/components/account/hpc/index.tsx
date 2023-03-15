/** @module Components.Account.HPC */

import { useState, useEffect } from 'react'
import { Card, Space, Spin } from 'antd'

import { ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'

import Plugin from './plugin'

import globalStyle from '@/styles/index.module.css'

/**
 * Errors
 */
export const errors = {
  plugins: 'Unable to load plugins'
}

/**
 * Plugins list
 * @returns List
 */
export const _pluginsList = async (): Promise<JSX.Element[]> => {
  try {
    const plugins = await PluginsAPI.list()

    const HPCPlugins = plugins.filter((plugin) => plugin.category === 'HPC')

    if (HPCPlugins.length) {
      return HPCPlugins.map((plugin) => {
        return (
          <Card key={plugin.key} title={plugin.name}>
            <Plugin
              plugin={{
                key: plugin.key,
                name: plugin.name,
                description: plugin.description,
                haveInit: plugin.haveInit,
                configuration: plugin.configuration,
                inUseConfiguration: plugin.inUseConfiguration
              }}
            />
          </Card>
        )
      })
    } else {
      return [
        <Card key="no-access" title="No access">
          You do not have access to any HPC plugin. Request it.
        </Card>
      ]
    }
  } catch (err) {
    ErrorNotification(errors.plugins, err)
    return [
      <Card key="error" title="Error">
        Something led to an error. Please try again later.
      </Card>
    ]
  }
}

/**
 * HPC plugins
 * @param props Props
 * @returns HPC
 */
const HPC = (): JSX.Element => {
  // State
  const [list, setList] = useState<JSX.Element[]>([
    <Card key="loading" title="Loading">
      <Spin />
    </Card>
  ])

  // Plugins list
  useEffect(() => {
    _pluginsList().then(setList)
  }, [])

  /**
   * Render
   */
  return (
    <Space
      direction="vertical"
      className={`${globalStyle.fullWidth} ${globalStyle.scroll}`}
      size={20}
    >
      {list}
    </Space>
  )
}

export default HPC
