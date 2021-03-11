/** @module 'src/components/notfound */

import { useRouter } from 'next/router'
import { Layout, Typography } from 'antd'

/**
 * 404
 */
const NotFound = () => {
  // Router
  const router = useRouter()

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content className="NotFound">
        <Typography.Title level={1}>404</Typography.Title>
        <Typography.Title level={1}>Page not found</Typography.Title>
        <Typography.Title
          level={2}
          underline={true}
          onClick={() => router.push('/')}
          style={{ cursor: 'pointer' }}
        >
          Come back home
        </Typography.Title>
      </Layout.Content>
    </Layout>
  )
}

export default NotFound
