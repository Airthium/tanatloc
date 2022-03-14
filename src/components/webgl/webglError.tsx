/** @module Components.Notauthorized */

import { useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Button, Card, Layout, Space, Typography } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

/**
 * Errors
 */
export const errors = {
  webGL: 'WebGL is not enabled on your device. Please enable it.'
}

/**
 * Go home
 * @param router Router
 */
export const home = (router: NextRouter): void => {
  router.push('/')
}

/**
 * Not authorized
 * @returns NotAuthorized
 */
const WebGLError = (): JSX.Element => {
  // Data
  const router = useRouter()

  // Prefetech
  useEffect(() => {
    router.prefetch('/')
  }, [router])

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card title="WebGL Error">
          <Space direction="vertical">
            <Typography.Text>
              <AlertOutlined style={{ color: 'red' }} /> {errors.webGL}
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

WebGLError.propTypes = {}

export default WebGLError