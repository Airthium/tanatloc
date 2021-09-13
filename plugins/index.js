const pluginsList = ['local', 'rescale', 'denso']

const loadPlugins = async () => {
  const list = await Promise.all(
    pluginsList.map(async (plugin) => {
      try {
        const p = await import(`./${plugin}`)
        return p.default
      } catch (err) {
        console.error(`Plugin ${plugin} not loaded!`)
      }
    })
  )

  return list.filter((l) => l)
}

export default loadPlugins
