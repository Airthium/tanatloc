/** @module Components.Notauthorized */

import { useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button, Card, Layout, Space, Typography } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

/**
 * Errors
 */
const errors = {
  notAllowed: 'You are not authorized to be there.'
}

/**
 * Go home
 * @param router Router
 */
const home = (router: NextRouter): void => {
  router.push('/')
}

/**
 * Not authorized
 * @returns NotAuthorized
 */
const NotAuthorized = (): JSX.Element => {
  // Data
  const router = useRouter()

  // Prefetech
  useEffect(() => {
    router.prefetch('/')
  }, [])

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
              <Button type="link" onClick={() => home(router)}>
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
