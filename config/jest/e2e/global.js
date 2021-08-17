import { tables } from '@/config/db'

import query from '@/database'
import UserDB from '@/database/user'

// Valid PostgreSQL UUID
const validUUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

/**
 * Initialize
 * @returns Administrator id
 */
const initialize = async () => {
  const admin = await UserDB.get('admin', ['id'], 'email')
  return admin.id
}

/**
 * Clean
 */
const clean = async () => {
  await query('DELETE FROM ' + tables.ORGANIZATIONS)
  await query('DELETE FROM ' + tables.GROUPS)
  await query('DELETE FROM ' + tables.WORKSPACES)
  await query('DELETE FROM ' + tables.PROJECTS)
  await query('DELETE FROM ' + tables.GEOMETRIES)
  await query('DELETE FROM ' + tables.SIMULATIONS)
  await query('DELETE FROM ' + tables.AVATARS)
  await query('DELETE FROM ' + tables.LINKS)

  await query(
    'UPDATE ' +
      tables.USERS +
      ' set lastname=$1, firstname=$2, email=$3, avatar=$4, isvalidated=$5, superuser=$6, password=$7, organizations=$8, workspaces=$9, authorizedplugins=$10, plugins=$11',
    [null, null, 'admin', null, true, false, 'password', null, null, null, null]
  )
}

// Export
export { initialize, clean, validUUID }
