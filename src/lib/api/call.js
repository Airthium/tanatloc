export default async (route, parameters) => {
  const response = await fetch(route, parameters)
  const res = await response.json()
  return res
}
