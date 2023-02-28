/** @module Components.WebGL.FixInfos.SafariMac */

import { Layout, Typography } from 'antd'

import globalStyle from '@/styles/index.module.css'

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
        <Typography.Title level={5} mark>
          1- Check MacOS version
        </Typography.Title>
        <Typography>
          If you have MacOS version 10.10 Yosemite or a previous one, WebGL
          needs to be activated manually.
        </Typography>
        <Typography.Title level={5} mark>
          2- Developpers Settings
        </Typography.Title>
        <Typography>
          Open your browser, then go to Safari -{'>'} Preferences, click
          <span className={globalStyle.textLight}>Advanced</span> tab.
        </Typography>
        <Typography.Title level={5} mark>
          3- Show new menu
        </Typography.Title>
        <Typography>
          At the bottom of the window, check the{' '}
          <span className={globalStyle.textLight}>Show Develop</span> menu in
          menu bar checkbox.
        </Typography>
        <Typography.Title level={5} mark>
          4- Enable WebGL
        </Typography.Title>
        <Typography>
          Open Develop Tab, check enable WebGL (whether in{' '}
          <span className={globalStyle.textLight}>Experimental feature</span> or
          in the main menu)
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

export default SafariMac
