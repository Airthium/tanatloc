/** @module Components.Account.HPC */

import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Card, Space, Spin } from 'antd'

import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'

import Plugin from './plugin'

/**
 * Errors
 */
const errors = {
  plugins: 'Unable to load plugins'
}

/**
 * Plugins list
 * @returns List
 */
export const pluginsList = async (): Promise<JSX.Element[]> => {
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
                needInit: !!plugin.needInit,
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
  }
}

/**
 * HPC plugins
 * @param props Props
 * @returns HPC
 */
const HPC = (): JSX.Element => {
  // State
  const [list, setList]: [
    JSX.Element[],
    Dispatch<SetStateAction<JSX.Element[]>>
  ] = useState([
    <Card key="loading" title="Loading">
      <Spin />
    </Card>
  ])

  // Plugins list
  useEffect(() => {
    pluginsList().then(setList)
  }, [])

  /**
   * Render
   */
  return (
    <Space direction="vertical" className="full-width scroll" size={20}>
      {list}
    </Space>
  )
}

HPC.propTypes = {}

export default HPC
