/** @module Lib.Template */

import path from 'path'
import ejs from 'ejs'
import isElectron from 'is-electron'

import Tools from '../tools'
import Plugins from '../plugins'

import Templates from '@/templates'

import init from 'src/init'

let templates: { [key: string]: (parameters: object) => Promise<string> }

/**
 * Load templates
 */
export const loadTemplates = async (): Promise<void> => {
  if (templates) return

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
      const func = ejs.compile(content.toString(), {
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
            const func = ejs.compile(content.toString(), {
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

  templates = templatesList

  global.initialization = {
    ...(global.initialization || {}),
    templates: true
  }
}

init()

/**
 * Render
 * @param key Key
 * @param parameters Parameters
 * @param save Save
 * @returns Script
 */
const render = async (
  key: string,
  parameters: object,
  save?: { location: string; name: string }
): Promise<string> => {
  // Check
  while (!templates) await new Promise((resolve) => setTimeout(resolve, 10))

  // Compile
  const template = templates[key]
  if (!template) throw new Error('Unable to find the model!')
  const script = await template(parameters)

  // Save
  if (save) await Tools.writeFile(save.location, save.name, script)

  // Return
  return script
}

const Template = { render }
export default Template
