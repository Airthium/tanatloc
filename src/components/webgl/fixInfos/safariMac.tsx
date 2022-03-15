import { Layout, Typography } from 'antd'

/**
 * Safari Mac
 * @returns SafariMac
 */
const SafariMac = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={3}>1- Check MacOS version</Typography.Title>
        <Typography>
          If you have MacOS version 10.10 Yosemite or a previous one, WebGL
          needs to be activated manually.
        </Typography>
        <Typography.Title level={3}>2- Developpers Settings</Typography.Title>
        <Typography>
          Open your browser, then go to Safari -{'>'} Preferences, click
          "advanced" tab.
        </Typography>
        <Typography.Title level={3}>3- Show new menu</Typography.Title>
        <Typography>
          At the bottom of the window, check the "Show Develop" menu in menu bar
          checkbox.
        </Typography>
        <Typography.Title level={3}>4- Enable WebGL</Typography.Title>
        <Typography>
          Open Develop Tab, check enable WebGL (whether in "Experimental
          feature" or in the main menu)
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

SafariMac.propTypes = {}

export default SafariMac
