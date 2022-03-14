import { Layout, Typography } from 'antd'

const FirefoxWindows = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={3}>1- Enter config</Typography.Title>
        <Typography>
          Open mozilla and enter 'about:config' in your search bar
        </Typography>
        <Typography.Title level={3}>2- Check if enabled</Typography.Title>
        <Typography>
          Search for 'webgl.force-enabled' and switch value to 'true' (double
          click on the value)
        </Typography>
        <Typography.Title level={3}>
          3- Check if force disabled
        </Typography.Title>
        <Typography>
          Search for 'webgl.disabled' and switch value to 'false' (double click
          on the value)
        </Typography>
        <Typography.Title level={3}>4- Still not working</Typography.Title>
        <Typography>
          Update to the latest version and retry all steps, if the problem
          persists, switch to another web browser.
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

FirefoxWindows.propTypes = {}

export default FirefoxWindows
