/** @module Components.Account.HPC */

import { useState, useEffect } from 'react'
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
 * HPC plugins
 * @param props Props
 */
const HPC = (): JSX.Element => {
  // State
  const [list, setList]: [JSX.Element[], Function] = useState([
    <Card key="loading" title="Loading">
      <Spin />
    </Card>
  ])

  // Plugins list
  useEffect(() => {
    PluginsAPI.list()
      .then((plugins) => {
        const HPCPlugins = plugins.filter((plugin) => plugin.category === 'HPC')

        if (HPCPlugins.length) {
          const pluginsList = HPCPlugins.map((plugin) => {
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
          setList(pluginsList)
        } else {
          setList([
            <Card key="no-access" title="No access">
              You do not have access to any HPC plugin. Request it.
            </Card>
          ])
        }
      })
      .catch((err) => {
        ErrorNotification(errors.plugins, err)
      })
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
