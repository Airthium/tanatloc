import query from '..'
import { tables } from '@/config/db'

const add = async ({ email }) => {
  // Create
  query('INSERT INTO ' + tables.WAIT + ' (email) VALUES ($1)', [email])
}

export default add
