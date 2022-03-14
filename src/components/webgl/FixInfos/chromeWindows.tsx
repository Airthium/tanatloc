import { Layout, Typography } from 'antd'

const ChromeWindows = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={3}>No manipulation needed</Typography.Title>
        <Typography>
          Chrome has full support for WebGL on all platforms. If you are having
          issues with WebGL on Chrome, you may need to update to the latest
          version of Chrome.
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

ChromeWindows.propTypes = {}

export default ChromeWindows
