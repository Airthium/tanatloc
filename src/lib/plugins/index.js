/** @module lib/plugins */

let plugins
const load = async () => {
  // Local
  try {
    const Local = await import('tanatloc-ssr-plugin-local')
    plugins.push(Local.default)
  } catch (err) {
    console.error('Plugin local not loaded!')
  }

  // Rescale
  // TODO

  // Denso
  // TODO
}

load().catch(console.error)

const clientList = async (user) => {
  return plugins
    .map((plugin) => {
      if (user.authorizedplugins.includes(plugin.key))
        return {
          category: plugin.category,
          key: plugin.key,
          ...plugin.client
        }
    })
    .filter((p) => p)
}

const serverList = async () => {
  return plugins.map((plugin) => ({
    category: plugin.category,
    key: plugin.key,
    ...plugin.server
  }))
}

export default { clientList, serverList }
