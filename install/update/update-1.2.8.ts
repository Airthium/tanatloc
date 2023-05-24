/** @module Install.Update.Update128 */

import { tables } from '@/config/db'

import { query, updater } from '@/database'

/**
 * Update
 */
const update = async (): Promise<void> => {
  console.info(' - Update for v1.2.8')
  // Move user models/templates to MODELS table
  try {
    // Get exiting models and templates by user
    const { rows: users } = await query(
      'SELECT (id, models, templates) FROM ' + tables.USERS,
      []
    )

    for (const user of users) {
      const models = user.models
      const templates = user.templates
      if (!models?.length || models?.length !== templates?.length) continue

      for (let i = 0; i < models.length; ++i) {
        const model = models[i]
        const template = templates[i]

        // Create new MODEL
        const { rows: insert } = await query(
          'INSERT INTO ' +
            tables.MODELS +
            ' (model, template, owners) VALUES ($1, $2, $3) RETURNING id',
          [model, template, [user.id]]
        )

        // Update user
        await updater(tables.USERS, user.id, [
          {
            type: 'array',
            method: 'append',
            key: 'usermodels',
            value: insert[0].id
          }
        ])
      }
    }
  } catch (err: any) {
    console.error('   ⚠ Update 1.2.8 failed')
    console.error(err)
  }
}

export default update
