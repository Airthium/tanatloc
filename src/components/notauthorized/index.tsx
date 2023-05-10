/** @module Components.Notauthorized */

import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Layout, Space, Typography } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

/**
 * Errors
 */
export const errors = {
  notAllowed: 'You are not allowed to be here.'
}

/**
 * Not authorized
 * @returns NotAuthorized
 */
const NotAuthorized = (): React.JSX.Element => {
  // Data
  const router = useRouter()

  /**
   * Home
   */
  const home = useCallback((): void => {
    ;(async () => {
      await router.push('/')
    })()
  }, [router])

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
