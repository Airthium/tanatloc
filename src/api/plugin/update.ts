/** @module API.Plugin.Update */

import { IPlugin } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @param plugin Plugin
 */
export const update = async (plugin: IPlugin): Promise<void> => {
  await call('/api/plugin', {
    method: 'PUT',
    body: JSON.stringify(plugin)
  })
}
