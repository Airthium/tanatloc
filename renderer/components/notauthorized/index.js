import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Layout } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

const NotAuthorized = () => {
  // Data
  const router = useRouter()

  // Prefetech
  useEffect(() => {
    router.prefetch('/')
  }, [])

  /**
   * Go home
   */
  const home = () => {
    router.push('/')
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card title="Not allowed">
          <p>
            <AlertOutlined style={{ color: 'red' }} /> You are not authorized to
            be there.
          </p>
          <p>
            Go back
            <Button type="link" onClick={home}>
              home
            </Button>
          </p>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default NotAuthorized
