/** @module API.Plugin.Del */

import { ClientPlugin } from '@/plugins/index.d'

import { call } from '@/api/call'

/**
 * Delete
 * @param plugin Plugin
 */
export const del = async (
  plugin: Pick<ClientPlugin, 'uuid'>
): Promise<void> => {
  await call('/api/plugin', {
    method: 'DELETE',
    body: JSON.stringify(plugin)
  })
}
