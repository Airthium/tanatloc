import query from '..'
import { tables } from '@/config/db'

/**
 * Add
 * @memberof Database.Geometry
 * @param {Object} project Project `{ id }`
 * @param {Object} geometry Geometry `{ name, uid }`
 * @returns {Object} Geometry `{ id, name, originalfilename, extension, uploadfilename }`
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
  geometry && (geometry.name = name)
  geometry && (geometry.originalfilename = name)
  geometry && (geometry.extension = extension)
  geometry && (geometry.uploadfilename = uploadFileName)

  return geometry
}

export default add
