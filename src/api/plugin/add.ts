/** @module API.Plugin.Add */

import { IPlugin } from '@/plugins/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @param plugin Plugin
 * @param extra Extra
 */
export const add = async (plugin: IPlugin, extra?: boolean): Promise<void> => {
  await call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify({ plugin, extra })
  })
}
