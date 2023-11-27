/** @module API.Plugin.UsePlugins */

import useSWR from 'swr'
import { useCallback } from 'react'

import { fetcher } from '@/api/call'

import { HPCClientPlugin } from '@/plugins/index.d'

/**
 * Uses plugins
 * @returns Plugins
 */
export const usePlugins = (): [
  HPCClientPlugin[],
  {
    addOnePlugin: (plugin: HPCClientPlugin) => Promise<void>
    delOnePlugin: (plugin: Pick<HPCClientPlugin, 'key'>) => Promise<void>
    mutateOnePlugin: (plugin: Partial<HPCClientPlugin>) => Promise<void>
    errorPlugins: Error
    loadingPlugins: boolean
  }
] => {
  const defaultData: HPCClientPlugin[] = []

  const { data, error, mutate } = useSWR('/api/plugin', fetcher)
  const loading = !data
  const plugins = data?.plugins ?? defaultData

  const addOne = useCallback(
    async (plugin: HPCClientPlugin): Promise<void> => {
      const newPlugins = [...plugins, plugin]
      await mutate({ plugins: newPlugins })
    },
    [plugins, mutate]
  )

  const delOne = useCallback(
    async (plugin: Pick<HPCClientPlugin, 'key'>): Promise<void> => {
      const filteredPlugins = plugins.filter((p) => p.key !== plugin.key)
      await mutate({ plugins: filteredPlugins })
    },
    [plugins, mutate]
  )

  const mutateOne = useCallback(
    async (plugin: Partial<HPCClientPlugin>): Promise<void> => {
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
