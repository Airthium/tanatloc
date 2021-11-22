import { IPlugin } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Delete
 * @memberof API.Plugin
 * @param plugin Plugin
 */
export const del = async (plugin: IPlugin): Promise<void> => {
  await call('/api/plugin', {
    method: 'DELETE',
    body: JSON.stringify(plugin)
  })
}
