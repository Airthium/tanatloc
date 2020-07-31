import { useRouter } from 'next/router'

import { Layout, Button } from 'antd'

export default () => {
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
