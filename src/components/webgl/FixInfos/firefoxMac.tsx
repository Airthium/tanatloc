import { Layout, Typography } from 'antd'

const FirefoxMac = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={3}>No manipulation needed</Typography.Title>
        <Typography>
          Firefox on MacOS supports and enables WebGL for all versions from Snow
          Leopard 10.6. If WebGL still doesn't work, tru to update to the last
          version of MacOS.
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

FirefoxMac.propTypes = {}

export default FirefoxMac
