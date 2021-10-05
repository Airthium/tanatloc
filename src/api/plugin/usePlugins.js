import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Uses plugins
 * @memberof API.Plugin
 * @returns {Array} `[plugins, { mutatePlugins, addOnePlugin, delOnePlugin, mutateOnePlugin, errorPlugins, loadingPlugins }]`
 */
const usePlugins = () => {
  const { data, error, mutate } = useSWR('/api/plugin', Caller.fetcher)
  const loading = !data
  const plugins = data?.plugins || []

  const addOne = (plugin) => {
    const newPlugins = [...plugins, plugin]
    mutate({ plugins: newPlugins })
  }

  const delOne = (plugin) => {
    const filteredPlugins = plugins.filter((p) => p.key !== plugin.key)
    mutate({ plugins: filteredPlugins })
  }

  const mutateOne = (plugin) => {
    const mutatedPlugin = plugins.map((p) => {
      if (p.key === plugin.key) p = { ...p, ...plugin }
      return p
    })
    mutate({ plugins: mutatedPlugin })
  }

  return [
    plugins,
    {
      mutatePlugins: mutate,
      addOnePlugin: addOne,
      delOnePlugin: delOne,
      mutateOnePlugin: mutateOne,
      errorPlugins: error,
      loadingPlugins: loading
    }
  ]
}

export default usePlugins
