import useSWR from 'swr'

import { fetcher } from '@/api/call'

import { IPlugin } from '@/database/index.d'

/**
 * Uses plugins
 * @memberof API.Plugin
 * @returns {Array} `[plugins, { mutatePlugins, addOnePlugin, delOnePlugin, mutateOnePlugin, errorPlugins, loadingPlugins }]`
 */
export const usePlugins = (): [
  IPlugin[],
  {
    mutatePlugins: (data: { plugins: IPlugin[] }) => void
    addOnePlugin: (plugin: IPlugin) => void
    delOnePlugin: (plugin: IPlugin) => void
    mutateOnePlugin: (plugin: IPlugin) => void
    errorPlugins: Error
    loadingPlugins: boolean
  }
] => {
  const { data, error, mutate } = useSWR('/api/plugin', fetcher)
  const loading = !data
  const plugins = data?.plugins || []

  const addOne = (plugin: IPlugin) => {
    const newPlugins = [...plugins, plugin]
    mutate({ plugins: newPlugins })
  }

  const delOne = (plugin: IPlugin) => {
    const filteredPlugins = plugins.filter((p) => p.key !== plugin.key)
    mutate({ plugins: filteredPlugins })
  }

  const mutateOne = (plugin: IPlugin) => {
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
