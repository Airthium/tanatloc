/** @module Lib.Template */

import path from 'path'
import ejs, { AsyncTemplateFunction } from 'ejs'
import isElectron from 'is-electron'

import UserModel from '../userModel'
import Tools from '../tools'
import Plugins from '../plugins'

import Templates from '@/templates'
import { indent } from '@/templates/tools'

export interface ITemplates {
  [key: string]: AsyncTemplateFunction
}

/**
 * Load Tanatloc templates
 * @returns Templates
 */
const loadTanatlocTemplates = async (): Promise<ITemplates> => {
  const templates: ITemplates = {}

  // Base templates
  for (const key of Object.keys(Templates)) {
    process.stdout.write(' - Template ' + key)
    const content = await Tools.readFile(
      path.join(
        isElectron()
          ? process.resourcesPath + '/extra/server/tanatloc'
          : './dist',
        'templates',
        Templates[key as keyof typeof Templates]
      )
    )
    const func = ejs.compile(content.toString(), {
      root: path.join(
        isElectron()
          ? process.resourcesPath + '/extra/server/tanatloc'
          : './dist',
        'templates'
      )
    })
    templates[key] = func as unknown as AsyncTemplateFunction
    process.stdout.write(' loaded\n')
  }

  return templates
}

/**
 * Load plugins templates
 * @returns Templates
 */
const loadPluginsTemplates = async (): Promise<ITemplates> => {
  const templates: ITemplates = {}

  const plugins = await Plugins.serverList()
  for (const plugin of plugins) {
    if (plugin.category !== 'Model') continue

    for (const template of plugin.templates) {
      process.stdout.write(
        ' - Template ' + template.key + '(from ' + plugin.key + ')'
      )
      const content = await Tools.readFile(
        path.join(
          isElectron()
            ? process.resourcesPath + '/extra/server/tanatloc'
            : './',
          'plugins',
          plugin.key as string,
          template.file
        )
      )
      const func = ejs.compile(content.toString(), {
        root: path.join(
          isElectron()
            ? process.resourcesPath + '/extra/server/tanatloc'
            : './',
          'templates'
        )
      })
      templates[template.key] = func as unknown as AsyncTemplateFunction
      process.stdout.write(' loaded\n')
    }
  }

  return templates
}

/**
 * Load templates
 * @returns Templates
 */
export const loadTemplates = async (): Promise<ITemplates> => {
  console.info('Loading templates...')

  // Base templates
  const tanatlocTemplates = await loadTanatlocTemplates()

  // Plugin templates
  const pluginsTemplates = await loadPluginsTemplates()

  return {
    ...tanatlocTemplates,
    ...pluginsTemplates
  }
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
  userModelId: string | undefined,
  parameters: object,
  save?: { location: string; name: string }
): Promise<string> => {
  let script: string = ''
  if (userModelId) {
    const userModel = await UserModel.getWithData(userModelId, ['template'])
    if (!userModel?.template) throw new Error('Unable to find the model!')

    const template = userModel.template
    script = ejs.render(
      template,
      {
        helpers: { indent },
        ...parameters
      },
      {
        root: path.join(
          isElectron()
            ? process.resourcesPath + '/extra/server/tanatloc'
            : './dist',
          'templates'
        )
      }
    )
  } else {
    // Compile
    const template = tanatloc?.templates?.[key]
    if (!template) throw new Error('Unable to find the model!')
    script = await template({
      helpers: { indent },
      ...parameters
    })
  }

  // Save
  if (save) await Tools.writeFile(save.location, save.name, script)

  // Return
  return script
}

const Template = { render }
export default Template
