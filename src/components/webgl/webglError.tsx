/** @module Components.Notauthorized */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Modal, Layout, Space, Typography } from 'antd'
import { AlertOutlined } from '@ant-design/icons'
import NoManipBrowser from './FixInfos/noManipBrowser'
import FirefoxWindows from './FixInfos/firefoxWindows'
import FirefoxMac from './FixInfos/firefoxMac'
import SafariMac from './FixInfos/safariMac'

/**
 * Errors
 */
export const errors = {
  webGL: 'WebGL is not enabled on your device. Please enable it.'
}

const WebGLError = (): JSX.Element => {
  // Data
  const router = useRouter()

  // State
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(null)

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
                Return to previous page
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
                    onClick={() => {
                      setContent(NoManipBrowser)
                      setVisible(true)
                      setTitle('Chrome windows')
                    }}
                  >
                    Google Chrome
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() => {
                      setContent(FirefoxWindows)
                      setVisible(true)
                      setTitle('Firefox windows')
                    }}
                  >
                    Mozilla Firefox
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() => {
                      setContent(NoManipBrowser)
                      setVisible(true)
                      setTitle('Microsoft Edge windows')
                    }}
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
                    onClick={() => {
                      setContent(NoManipBrowser)
                      setVisible(true)
                      setTitle('Google Chrome MacOS / Linux')
                    }}
                  >
                    Google Chrome
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() => {
                      setContent(FirefoxMac)
                      setVisible(true)
                      setTitle('Firefox MacOS')
                    }}
                  >
                    Mozilla Firefox
                  </Button>
                </li>
                <li>
                  <Button
                    type="text"
                    onClick={() => {
                      setContent(SafariMac)
                      setVisible(true)
                      setTitle('Safari MacOS')
                    }}
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
              <a href="https://get.webgl.org" target="_blank">
                {' '}
                this website
              </a>{' '}
              to check if WebGL is enabled on your device
            </Typography.Text>
          </Space>
        </Card>
      </Layout.Content>
      <Modal
        title={title}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        style={{ height: 'calc(100vh - 200px)' }}
        bodyStyle={{ overflowY: 'auto', height: 'calc(100vh - 400px)' }}
      >
        {content}
      </Modal>
    </Layout>
  )
}

WebGLError.propTypes = {}

export default WebGLError
