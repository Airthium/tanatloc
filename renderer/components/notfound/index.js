/** renderer/components/notfound */

import { useRouter } from 'next/router'
import { Button, Layout, Typography } from 'antd'

/**
 * 404
 */
const NotFound = () => {
  // Router
  const router = useRouter()

  return (
    <Layout>
      <Layout.Content className="NotFound">
        <Typography.Title level={1} code={true} type="warning">
          404
        </Typography.Title>
        <Typography.Title level={1} code={true} type="warning">
          Page not found
        </Typography.Title>
        <Typography.Title
          level={2}
          code={true}
          type="warning"
          underline={true}
          onClick={() => router.push('/')}
        >
          Come back home
        </Typography.Title>
      </Layout.Content>
    </Layout>
  )
}

export default NotFound
