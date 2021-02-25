/** @module src/lib/template */

import path from 'path'
import ejs from 'ejs'

import Tools from '../tools'

import Templates from '@/templates'
import PluginTemplates from '@/plugins/templates'

/**
 * Load templates
 */
const loadTemplates = async () => {
  const templatesList = {}
  // Base templates
  await Promise.all(
    Object.keys(Templates).map(async (key) => {
      const content = await Tools.readFile(
        path.join('./templates/', Templates[key])
      )
      const func = await ejs.compile(content.toString(), {
        root: './templates'
      })
      templatesList[key] = func
    })
  )

  // Plugin templates
  await Promise.all(
    Object.keys(PluginTemplates).map(async (key) => {
      const plugin = PluginTemplates[key]
      await Promise.all(
        plugin.templates.map(async (template) => {
          const content = await Tools.readFile(
            path.join(plugin.path, template.file)
          )
          const func = await ejs.compile(content.toString(), {
            root: './templates'
          })
          templatesList[template.key] = func
        })
      )
    })
  )

  return templatesList
}

let templates = []
loadTemplates()
  .then((res) => (templates = res))
  .catch((err) => console.warn(err))

const render = async (key, parameters, save) => {
  // Compile
  const script = await templates[key](parameters)

  // Save
  if (save) await Tools.writeFile(save.location, save.name, script)

  // Return
  return script
}

export default { render }
