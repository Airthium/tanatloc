import { Layout, Typography } from 'antd'

const EdgeWindows = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={3}>No manipulation needed</Typography.Title>
        <Typography>
          Microsoft Edge has full support for WebGL on all platforms. If you are
          having issues with WebGL on Microsoft Edge, you may need to update to
          the latest version, then restart tour browser.
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

EdgeWindows.propTypes = {}

export default EdgeWindows
