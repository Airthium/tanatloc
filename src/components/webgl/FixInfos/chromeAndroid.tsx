import { Layout, Typography } from 'antd'

const ChromeAndroid = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={3}>No manipulation needed</Typography.Title>
        <Typography>
          WebGL is supported by any version of Chrome from version 37. If it
          doesn't work, try to update to a newer version.
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

ChromeAndroid.propTypes = {}

export default ChromeAndroid
