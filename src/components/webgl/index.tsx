/** @module Components.WebGL */

import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Modal, Layout, Space, Typography } from 'antd'
import { AlertOutlined } from '@ant-design/icons'

import { globalStyle } from '@/styles'
import style from './index.style'

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
   * Back
   */
  const back = useCallback(() => router.back(), [router])

  /**
   * Chrome Windows
   */
  const chromeWindows = useCallback(() => {
    Modal.info({
      title: 'Google Chrome (Windows)',
      content: <NoManipBrowser />
    })
  }, [])

  /**
   * Chrome Mac/Linux
   */
  const chromeMacLinux = useCallback(
    () =>
      Modal.info({
        title: 'Google Chrome (MacOS / Linux)',
        content: <NoManipBrowser />
      }),
    []
  )

  /**
   * Firefox Windows
   */
  const firefoxWindows = useCallback(
    () =>
      Modal.info({
        title: 'Firefox (Windows)',
        content: <FirefoxWindows />
      }),
    []
  )

  /**
   * Firefox Mac/Linux
   */
  const firefoxMacLinux = useCallback(
    () =>
      Modal.info({
        title: 'Firefox (MacOS / Linux)',
        content: <FirefoxMac />
      }),
    []
  )

  /**
   * Edge windows
   */
  const edgeWindows = useCallback(
    () =>
      Modal.info({
        title: 'Microsoft Edge (Windows)',
        content: <NoManipBrowser />
      }),
    []
  )

  /**
   * Safari Mac
   */
  const safariMac = useCallback(
    () =>
      Modal.info({
        title: 'Safari (MacOS)',
        content: <SafariMac />
      }),
    []
  )

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Header css={style.header}>
        <div css={globalStyle.logo}>
          <img src="/images/logo.svg" alt="Tanatloc" />
        </div>
      </Layout.Header>
      <Layout.Content style={{ padding: '0 20px' }}>
        <Space direction="vertical" size={20} css={globalStyle.fullWidth}>
          <Card title="WebGL Error">
            <Space direction="vertical">
              <Typography.Text>
                <AlertOutlined style={{ color: 'red' }} /> {errors.webGL}
              </Typography.Text>
              <Typography.Text>
                <Button type="link" onClick={back}>
                  Return to the previous page
                </Button>
              </Typography.Text>
            </Space>
          </Card>
          <Card title="How to enable WebGL">
            <Space css={style.content}>
              <Card title="Windows">
                <ul>
                  <li>
                    <Button type="text" onClick={chromeWindows}>
                      Google Chrome
                    </Button>
                  </li>
                  <li>
                    <Button type="text" onClick={firefoxWindows}>
                      Mozilla Firefox
                    </Button>
                  </li>
                  <li>
                    <Button type="text" onClick={edgeWindows}>
                      Microsoft Edge
                    </Button>
                  </li>
                </ul>
              </Card>
              <Card title="MacOS / Linux">
                <ul>
                  <li>
                    <Button type="text" onClick={chromeMacLinux}>
                      Google Chrome
                    </Button>
                  </li>
                  <li>
                    <Button type="text" onClick={firefoxMacLinux}>
                      Mozilla Firefox
                    </Button>
                  </li>
                  <li>
                    <Button type="text" onClick={safariMac}>
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
                <a
                  href="https://get.webgl.org"
                  target="_blank"
                  rel="noreferrer"
                >
                  {' '}
                  this website
                </a>{' '}
                to check if WebGL is enabled on your device
              </Typography.Text>
            </Space>
          </Card>
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default WebGLError
