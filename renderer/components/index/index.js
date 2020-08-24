/** @module renderer/components/index */

import { useRouter } from 'next/router'

import { Layout, Button } from 'antd'

/**
 * Index
 */
const Index = () => {
  // Router
  const router = useRouter()

  /**
   * Handle click
   */
  const handleClick = () => {
    router.push('/login')
  }

  return (
    <Layout>
      <Button onClick={handleClick}>Login</Button>
    </Layout>
  )
}

export default Index
