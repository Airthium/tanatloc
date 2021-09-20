/** @module lib/template */

import path from 'path'
import ejs from 'ejs'
import isElectron from 'is-electron'

import Tools from '../tools'
import Plugins from '../plugins'

import Templates from '@/templates'

/**
 * Load templates
 */
const loadTemplates = async () => {
  const templatesList = {}
  // Base templates
  await Promise.all(
    Object.keys(Templates).map(async (key) => {
      const content = await Tools.readFile(
        path.join(
          isElectron() ? process.resourcesPath : './',
          'templates',
          Templates[key]
        )
      )
      const func = await ejs.compile(content.toString(), {
        root: path.join(
          isElectron() ? process.resourcesPath : './',
          'templates'
        )
      })
      templatesList[key] = func
    })
  )

  // Plugin templates
  const plugins = await Plugins.serverList()
  await Promise.all(
    plugins.map(async (plugin) => {
      if (plugin.category === 'Model')
        await Promise.all(
          plugin.templates.map(async (template) => {
            const content = await Tools.readFile(
              path.join(
                isElectron() ? process.resourcesPath : './',
                'plugins',
                plugin.key,
                template.file
              )
            )
            const func = await ejs.compile(content.toString(), {
              root: path.join(
                isElectron() ? process.resourcesPath : './',
                'templates'
              )
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
  const template = templates[key]
  if (!template) throw new Error('Unable to find the model!')
  const script = await templates[key](parameters)

  // Save
  if (save) await Tools.writeFile(save.location, save.name, script)

  // Return
  return script
}

const Template = { render }
export default Template
