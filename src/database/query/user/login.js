import query from '../..'

export default async (user) => {
  const response = await query(
    'SELECT id FROM tanatloc_users WHERE email = $1 AND password = crypt($2, password)',
    [user.username, user.password]
  )

  const result = response.rows
  return result
}
