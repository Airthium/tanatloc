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
  await query('DELETE FROM ' + tables.AVATARS)
}

// Export
export { initialize, clean, validUUID }
