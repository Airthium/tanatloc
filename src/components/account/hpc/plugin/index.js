import PropTypes from 'prop-types'
import { Spin } from 'antd'

import PluginDialog from './dialog'
import List from './list'

import PluginAPI from '@/api/plugin'

/**
 * Plugin
 * @memberof module:components/account
 * @param {Object} props Props
 */
const Plugin = ({ plugin }) => {
  // Data
  const [
    plugins,
    { addOnePlugin, delOnePlugin, mutateOnePlugin, loadingPlugins }
  ] = PluginAPI.usePlugins()

  /**
   * Render
   */
  return loadingPlugins ? (
    <Spin />
  ) : (
    <>
      <PluginDialog plugin={plugin} swr={{ addOnePlugin }} />
      <List
        plugin={plugin}
        plugins={plugins}
        swr={{ delOnePlugin, mutateOnePlugin }}
      />
    </>
  )
}

Plugin.propTypes = {
  plugin: PropTypes.object.isRequired
}

export default Plugin
