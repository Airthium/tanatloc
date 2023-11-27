/** @module API.Plugin.Update */

import { ClientPlugin } from '@/plugins/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @param plugin Plugin
 */
export const update = async (plugin: ClientPlugin): Promise<void> => {
  await call('/api/plugin', {
    method: 'PUT',
    body: JSON.stringify(plugin)
  })
}
