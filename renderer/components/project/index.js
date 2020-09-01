// /** @module renderer/components/project */

import { useRouter } from 'next/router'
import { Layout } from 'antd'

import View from './view'

const Project = () => {
  // Router
  const router = useRouter()
  const { id } = router.query
  console.log('project id: ' + id)

  return (
    <Layout>
      Project page TODO
      <Layout>
        <View />
      </Layout>
    </Layout>
  )
}

export default Project
