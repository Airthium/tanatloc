/** @module API.Plugin.Extra */

import { IPlugin } from '@/plugins/index.d'

import { call } from '@/api/call'

/**
 * Extra
 * @param plugin Plugin
 * @param action Action
 */
export const extra = async (plugin: IPlugin, action: string): Promise<void> => {
  await call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify({ plugin, extra: action })
  })
}
