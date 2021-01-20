import useSWR from 'swr'
import Caller from '@/api/call'

const usePlugins = () => {
  const { data, mutate } = useSWR('/api/plugin', Caller.fetcher)
  const loading = !data
  const plugins = (data && data.plugins) || []

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
      loadingPlugins: loading
    }
  ]
}

export default usePlugins
