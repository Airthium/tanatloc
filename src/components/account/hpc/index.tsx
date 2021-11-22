import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Space } from 'antd'

import { IUserWithData } from '@/lib/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'

import Plugin from './plugin'

interface IProps {
  user: IUserWithData
}

const errors = {
  plugins: 'Unable to load plugins'
}

/**
 * HPC plugins
 * @memberof Components.Account
 * @param props Props
 */
const HPC = ({ user }: IProps): JSX.Element => {
  // State
  const [list, setList]: [JSX.Element[], Function] = useState([])

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
            <Card key="0">
              You do not have access to any HPC plugin. Request it.
            </Card>
          ])
        }
      })
      .catch((err) => {
        ErrorNotification(errors.plugins, err)
      })
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
