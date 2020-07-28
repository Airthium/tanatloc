export default async (route, parameters) => {
  const response = await fetch('localhost:3000/' + route, parameters)
  const res = await response.json()
  return res
}
