import useSWR from 'swr'
import { fetcher } from '../call'

const useProject = (id) => {
  const { data, mutate } = useSWR('/api/project/' + id, fetcher)
  const loading = !data
  const project = data && data.project
  return [project, { mutateProject: mutate, loadingProject: loading }]
}

export default useProject
