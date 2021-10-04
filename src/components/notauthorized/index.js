/** @namespace Components.Notauthorized */

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Layout, Space, Typography } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

/**
 * Errors
 * @memberof Components.Notauthorized
 */
const errors = {
  notAllowed: 'You are not authorized to be there.'
}

/**
 * Not authorized
 * @memberof Components.Notauthorized
 */
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
          <Space direction="vertical">
            <Typography.Text>
              <AlertOutlined style={{ color: 'red' }} /> {errors.notAllowed}
            </Typography.Text>
            <Typography.Text>
              Go back{' '}
              <Button type="link" onClick={home}>
                home
              </Button>
            </Typography.Text>
          </Space>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

export default NotAuthorized
