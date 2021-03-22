import PropTypes from 'prop-types'
import { Space } from 'antd'

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
    { addOnePlugin, delOnePlugin, mutateOnePlugin }
  ] = PluginAPI.usePlugins()

  /**
   * Render
   */
  return (
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
