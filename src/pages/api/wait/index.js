import route from '@/route/wait'

const api = async (req, res) => {
  await route(req, res)
}

export default api
