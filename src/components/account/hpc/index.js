import { useState, useEffect } from 'react'
import { Card, Space, Spin } from 'antd'

import Plugin from './plugin'

import Plugins from '@/plugins'

import UserAPI from '@/api/user'
import PluginAPI from '@/api/plugin'

/**
 * HPC plugins
 */
const HPC = () => {
  // State
  const [list, setList] = useState([])

  // Data
  const [user] = UserAPI.useUser()
  const [, { loadingPlugins }] = PluginAPI.usePlugins()

  // Plugins list
  useEffect(() => {
    if (loadingPlugins) return
    if (!user) return

    // HPC & authorized only
    const HPCPlugins = Object.keys(Plugins)
      .map((key) => {
        const plugin = Plugins[key]
        if (user.authorizedplugins?.includes(key) && plugin.category === 'HPC')
          return plugin
      })
      .filter((p) => p)

    let pluginsList
    if (HPCPlugins.length) {
      // List
      pluginsList = HPCPlugins.map((plugin) => {
        return (
          <Card key={plugin.key} title={plugin.name}>
            <Plugin plugin={plugin} />
          </Card>
        )
      })
    } else {
      pluginsList = (
        <Card>You do not have access to any HPC plugin. Request it.</Card>
      )
    }

    setList(pluginsList)
  }, [loadingPlugins, user])

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {loadingPlugins ? <Spin /> : list}
    </Space>
  )
}

export default HPC
