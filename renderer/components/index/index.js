/** @module renderer/components/index */

import { useRouter } from 'next/router'

import { Button, Layout } from 'antd'

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

  /**
   * Render
   */
  return (
    <Layout>
      <Button onClick={handleClick}>Login</Button>
    </Layout>
  )
}

export default Index
