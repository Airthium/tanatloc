/** @module API.Plugin.UsePlugins */

import useSWR from 'swr'

import { fetcher } from '@/api/call'

import { IClientPlugin } from '@/database/index.d'

/**
 * Uses plugins
 * @returns Plugins
 */
export const usePlugins = (): [
  IClientPlugin[],
  {
    mutatePlugins: (data: { plugins: IClientPlugin[] }) => void
    addOnePlugin: (plugin: IClientPlugin) => void
    delOnePlugin: (plugin: IClientPlugin) => void
    mutateOnePlugin: (plugin: IClientPlugin) => void
    errorPlugins: Error
    loadingPlugins: boolean
  }
] => {
  const { data, error, mutate } = useSWR('/api/plugin', fetcher)
  const loading = !data
  const plugins = data?.plugins || []

  const addOne = (plugin: IClientPlugin): void => {
    const newPlugins = [...plugins, plugin]
    mutate({ plugins: newPlugins })
  }

  const delOne = (plugin: IClientPlugin): void => {
    const filteredPlugins = plugins.filter((p) => p.key !== plugin.key)
    mutate({ plugins: filteredPlugins })
  }

  const mutateOne = (plugin: IClientPlugin): void => {
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
