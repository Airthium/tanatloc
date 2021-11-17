import { IPlugin } from '@/database/index.d'

import { call } from '@/api/call'

/**
 * Add
 * @memberof API.Plugin
 * @param {Object} plugin Plugin
 */
export const add = async (plugin: IPlugin): Promise<void> => {
  await call('/api/plugin', {
    method: 'POST',
    body: JSON.stringify(plugin)
  })
}
