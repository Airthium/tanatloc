/** @module Components.WebGL */

import { useRouter } from 'next/router'
import { Button, Card, Modal, Layout, Space, Typography } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

import NoManipBrowser from './fixInfos/noManipBrowser'
import FirefoxWindows from './fixInfos/firefoxWindows'
import FirefoxMac from './fixInfos/firefoxMac'
import SafariMac from './fixInfos/safariMac'

/**
 * Errors
 */
export const errors = {
  webGL: 'WebGL is not enabled on your device. Please enable it.'
}

/**
 * WebGL error
 * @returns WebGLError
 */
const WebGLError = (): JSX.Element => {
  // Data
  const router = useRouter()

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <div className="logo">
          <img src="/images/logo.svg" alt="Tanatloc" />
        </div>
        <Card title="WebGL Error">
          <Space direction="vertical">
            <Typography.Text>
              <AlertOutlined style={{ color: 'red' }} /> {errors.webGL}
            </Typography.Text>
            <Typography.Text>
              <Button type="link" onClick={() => router.back()}>
                Return to the previous page
              </Button>
            </Typography.Text>
          </Space>
        </Card>
        <Card title="How to enable WebGL">
          <Space className="webgl-Space">
            <Card title="Windows">
              <ul>
                <li>
                  <Button
                    type="text"
                    onClick={() =>
                      Modal.info({
                        title: 'Google Chrome',
                        content: <NoManipBrowser />
                      })
                    }
                  >
                    Google Chrome
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() =>
                      Modal.info({
                        title: 'Firefox',
                        content: <FirefoxWindows />
                      })
                    }
                  >
                    Mozilla Firefox
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() =>
                      Modal.info({
                        title: 'Microsoft Edge',
                        content: <NoManipBrowser />
                      })
                    }
                  >
                    Microsoft Edge
                  </Button>
                </li>
              </ul>
            </Card>
            <Card title="MacOS / Linux">
              <ul>
                <li>
                  <Button
                    type="text"
                    onClick={() =>
                      Modal.info({
                        title: 'Google Chrome',
                        content: <NoManipBrowser />
                      })
                    }
                  >
                    Google Chrome
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() =>
                      Modal.info({
                        title: 'Firefox',
                        content: <FirefoxMac />
                      })
                    }
                  >
                    Mozilla Firefox
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() =>
                      Modal.info({
                        title: 'Safari',
                        content: <SafariMac />
                      })
                    }
                  >
                    Safari
                  </Button>
                </li>
              </ul>
            </Card>
          </Space>
        </Card>
        <Card title="WebGL Check">
          <Space direction="vertical">
            <Typography.Text>
              Visit{' '}
              <a href="https://get.webgl.org" target="_blank" rel="noreferrer">
                {' '}
                this website
              </a>{' '}
              to check if WebGL is enabled on your device
            </Typography.Text>
          </Space>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

WebGLError.propTypes = {}

export default WebGLError
