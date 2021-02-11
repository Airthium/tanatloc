import { useState, useEffect } from 'react'
import { Card, Spin } from 'antd'

import Plugin from './plugin'

import Plugins from '@/plugins'

import PluginAPI from '@/api/plugin'

/**
 * HPC plugins
 */
const HPC = () => {
  // State
  const [list, setList] = useState([])

  // Data
  const [, { loadingPlugins }] = PluginAPI.usePlugins()

  // Plugins list
  useEffect(() => {
    if (loadingPlugins) return

    // HPC only
    const HPCPlugins = Object.keys(Plugins)
      .map((key) => {
        const plugin = Plugins[key]
        if (plugin.category === 'HPC') return plugin
      })
      .filter((p) => p)

    // List
    const pluginsList = HPCPlugins.map((plugin) => {
      return (
        <Card key={plugin.key} title={plugin.name}>
          <Plugin plugin={plugin} />
        </Card>
      )
    })

    setList(pluginsList)
  }, [loadingPlugins])

  /**
   * Render
   */
  return <>{loadingPlugins ? <Spin /> : list}</>
}

export default HPC
