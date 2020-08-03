import { useRouter } from 'next/router'

import { Layout, Button } from 'antd'

const IndexPage = () => {
  const router = useRouter()

  const handleClick = () => {
    router.push('/login')
  }

  return (
    <Layout>
      <Button onClick={handleClick}>Login</Button>
    </Layout>
  )
}

export default IndexPage
