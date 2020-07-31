// import call from './call'

export default async ({ username, password }) => {
  // return await call('api/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ username: username, password: password })
  // })
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  console.log(res.status)
  // console.log(await res.text())

  if (res.status === 200) {
    const user = await res.json()
    // set user to useSWR state
    // mutate(userObj)
    console.log(user)
    return user
  } else {
    console.log('Incorrect username or password. Try better!')
  }
}
