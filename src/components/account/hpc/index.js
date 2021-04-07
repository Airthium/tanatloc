import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Space } from 'antd'

import Plugin from './plugin'

import Plugins from '@/plugins'

/**
 * HPC plugins
 * @memberof module:components/account
 * @param {Object} props Props
 */
const HPC = ({ user }) => {
  // State
  const [list, setList] = useState([])

  // Plugins list
  useEffect(() => {
    // HPC & authorized only
    const HPCPlugins = Object.keys(Plugins)
      .map((key) => {
        const plugin = Plugins[key]
        if (
          user.authorizedplugins?.includes(plugin.key) &&
          plugin.category === 'HPC'
        )
          return plugin
      })
      .filter((p) => p)

    if (HPCPlugins.length) {
      // List
      const pluginsList = HPCPlugins.map((plugin) => {
        return (
          <Card key={plugin.key} title={plugin.name}>
            <Plugin plugin={plugin} />
          </Card>
        )
      })
      setList(pluginsList)
    } else {
      setList(
        <Card>You do not have access to any HPC plugin. Request it.</Card>
      )
    }
  }, [user])

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {list}
    </Space>
  )
}

HPC.propTypes = {
  user: PropTypes.shape({
    authorizedplugins: PropTypes.array.isRequired
  }).isRequired
}

export default HPC
