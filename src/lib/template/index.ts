/** @module Lib.Template */

import path from 'path'
import ejs, { AsyncTemplateFunction } from 'ejs'
import isElectron from 'is-electron'

import Tools from '../tools'
import Plugins from '../plugins'

import Templates from '@/templates'
import { indent } from '@/templates/tools'

export interface ITemplates {
  [key: string]: AsyncTemplateFunction
}

/**
 * Load templates
 */
export const loadTemplates = async (): Promise<ITemplates> => {
  console.info('Loading templates...')

  const templates: ITemplates = {}
  // Base templates
  await Promise.all(
    Object.keys(Templates).map(async (key) => {
      const content = await Tools.readFile(
        path.join(
          isElectron() ? process.resourcesPath : './dist',
          'templates',
          Templates[key as keyof typeof Templates]
        )
      )
      const func = ejs.compile(content.toString(), {
        root: path.join(
          isElectron() ? process.resourcesPath : './dist',
          'templates'
        )
      })
      templates[key] = func as unknown as AsyncTemplateFunction
      console.info(' - Template ' + key + ' loaded')
    })
  )

  // Plugin templates
  const plugins = await Plugins.serverList()
  await Promise.all(
    plugins.map(async (plugin) => {
      if (plugin.category === 'Model')
        await Promise.all(
          plugin.templates.map(
            async (template: { key: string; file: string }) => {
              const content = await Tools.readFile(
                path.join(
                  isElectron() ? process.resourcesPath : './',
                  'plugins',
                  plugin.key as string,
                  template.file
                )
              )
              const func = ejs.compile(content.toString(), {
                root: path.join(
                  isElectron() ? process.resourcesPath : './',
                  'templates'
                )
              })
              templates[template.key] = func as unknown as AsyncTemplateFunction
              console.info(
                ' - Template ' +
                  template.key +
                  ' loaded (from ' +
                  plugin.key +
                  ')'
              )
            }
          )
        )
    })
  )

  return templates
}

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
  // Compile
  const template = tanatloc?.templates?.[key]
  if (!template) throw new Error('Unable to find the model!')
  const script = await template({
    helpers: { indent },
    ...parameters
  })

  // Save
  if (save) await Tools.writeFile(save.location, save.name, script)

  // Return
  return script
}

const Template = { render }
export default Template
