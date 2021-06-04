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
  const uploadFileName = uid + '.' + extension

  const response = await query(
    'INSERT INTO ' +
      tables.GEOMETRIES +
      ' (name, originalfilename, extension, uploadfilename, project) VALUES ($1, $1, $2, $3, $4) RETURNING id',
    [name, extension, uploadFileName, project.id]
  )

  const geometry = response.rows[0]
  geometry.name = name
  geometry.originalfilename = name
  geometry.extension = extension
  geometry.uploadfilename = uploadFileName

  return geometry
}

export default add
