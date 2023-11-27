/** @module API.Plugin.Add */

import { ClientPlugin } from '@/plugins/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @param plugin Plugin
 */
export const add = async (plugin: ClientPlugin): Promise<void> => {
  await call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify({ plugin })
  })
}
