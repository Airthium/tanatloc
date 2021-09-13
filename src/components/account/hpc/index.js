import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Space } from 'antd'

import Plugin from './plugin'

import PluginsAPI from '@/api/plugins'

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
          setList(
            <Card>You do not have access to any HPC plugin. Request it.</Card>
          )
        }
      })
      .catch(console.log)
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
  user: PropTypes.exact({
    authorizedplugins: PropTypes.array.isRequired
  }).isRequired
}

export default HPC
