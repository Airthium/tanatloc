import { IPlugin } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Update
 * @memberof API.Plugin
 * @param {Object} plugin Plugin
 */
export const update = async (plugin: IPlugin): Promise<void> => {
  await call('/api/plugin', {
    method: 'PUT',
    body: JSON.stringify(plugin)
  })
}
