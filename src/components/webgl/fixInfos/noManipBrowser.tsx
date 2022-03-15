import { Layout, Typography } from 'antd'

/**
 * No manipulation browser
 * @returns NoManipBrowser
 */
const NoManipBrowser = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={3}>No manipulation needed</Typography.Title>
        <Typography>
          This browser has full support for WebGL on all platforms. If you are
          having issues with WebGL, you may need to update to the latest version
          of your browser.
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

NoManipBrowser.propTypes = {}

export default NoManipBrowser
