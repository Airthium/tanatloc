/** @module API.Plugin.UsePlugins */

import useSWR from 'swr'
import { useCallback } from 'react'

import { fetcher } from '@/api/call'

import { IClientPlugin } from '@/plugins/index.d'

/**
 * Uses plugins
 * @returns Plugins
 */
export const usePlugins = (): [
  IClientPlugin[],
  {
    addOnePlugin: (plugin: IClientPlugin) => Promise<void>
    delOnePlugin: (plugin: IClientPlugin) => Promise<void>
    mutateOnePlugin: (plugin: IClientPlugin) => Promise<void>
    errorPlugins: Error
    loadingPlugins: boolean
  }
] => {
  const defaultData: IClientPlugin[] = []

  const { data, error, mutate } = useSWR('/api/plugin', fetcher)
  const loading = !data
  const plugins = data?.plugins ?? defaultData

  const addOne = useCallback(
    async (plugin: IClientPlugin): Promise<void> => {
      const newPlugins = [...plugins, plugin]
      await mutate({ plugins: newPlugins })
    },
    [plugins, mutate]
  )

  const delOne = useCallback(
    async (plugin: IClientPlugin): Promise<void> => {
      const filteredPlugins = plugins.filter((p) => p.key !== plugin.key)
      await mutate({ plugins: filteredPlugins })
    },
    [plugins, mutate]
  )

  const mutateOne = useCallback(
    async (plugin: IClientPlugin): Promise<void> => {
      const mutatedPlugin = plugins.map((p) => {
        if (p.key === plugin.key) p = { ...p, ...plugin }
        return p
      })
      await mutate({ plugins: mutatedPlugin })
    },
    [plugins, mutate]
  )

  return [
    plugins,
    {
      addOnePlugin: addOne,
      delOnePlugin: delOne,
      mutateOnePlugin: mutateOne,
      errorPlugins: error,
      loadingPlugins: loading
    }
  ]
}
