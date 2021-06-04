import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof module:database/geometry
 * @param {Object} project Project { id }
 * @param {Object} geometry Geometry { name, uid }
 */
const add = async (project, { name, uid }) => {
  const extension = name.split('.').pop()
  const response = await query(
    'INSERT INTO ' +
      tables.GEOMETRIES +
      ' (name, originalfilename, extension, uploadfilename, project) VALUES ($1, $1, $2, $3, $4) RETURNING id',
    [name, name, extension, uid, project.id]
  )

  const geometry = response.rows[0]
  geometry.name = name
  geometry.originalfilename = name
  geometry.extension = extension
  geometry.uploadfilename = uid
}

export default add
