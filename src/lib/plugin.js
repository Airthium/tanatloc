import User from './user'

/**
 * Get by user
 * @param {string} user User { id }
 */
const getByUser = async ({ id }) => {
  // Get plugins
  const user = await User.get(id, ['plugins'])

  return user.plugins || []
}

/**
 * Update
 * @param {User} user User { id }
 * @param {Array} plugins Plugins
 */
const update = async ({ id }, plugins) => {
  await User.update({ id }, [
    {
      key: 'plugins',
      value: plugins
    }
  ])
}

export default { getByUser, update }
