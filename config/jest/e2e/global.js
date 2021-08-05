import { tables } from '@/config/db'

import query from '@/database'
import UserDB from '@/database/user'

// Valid PostgreSQL UUID
const validUUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

// Initialize
const initialize = async () => {
  const admin = await UserDB.get('admin', ['id'], 'email')
  return admin.id
}

const clean = async () => {
  await query('DELETE FROM ' + tables.ORGANIZATIONS)
  await query('DELETE FROM ' + tables.GROUPS)
  await query('DELETE FROM ' + tables.WORKSPACES)
  await query('DELETE FROM ' + tables.PROJECTS)
  await query('DELETE FROM ' + tables.GEOMETRIES)
  await query('DELETE FROM ' + tables.SIMULATIONS)
  await query('DELETE FROM ' + tables.AVATARS)
  await query('DELETE FROM ' + tables.LINKS)
}

// Export
export { initialize, clean, validUUID }
