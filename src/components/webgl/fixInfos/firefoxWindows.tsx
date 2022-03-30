/** @module Components.WebGL.FixInfos.Windows */

import { Layout, Typography } from 'antd'

/**
 * Firefox Windows
 * @returns FirefoxWindows
 */
const FirefoxWindows = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={5} mark={true}>
          1- Enter config
        </Typography.Title>
        <Typography>
          Open mozilla and enter{' '}
          <Typography.Text code>about:config</Typography.Text> in your search
          bar
        </Typography>
        <Typography.Title level={5} mark={true}>
          2- Check if enabled
        </Typography.Title>
        <Typography>
          Search for <Typography.Text code>webgl.force-enabled</Typography.Text>{' '}
          and switch value to <Typography.Text code>true</Typography.Text>{' '}
          (double click on the value)
        </Typography>
        <Typography.Title level={5} mark={true}>
          3- Check if force disabled
        </Typography.Title>
        <Typography>
          Search for <Typography.Text code>webgl.disabled</Typography.Text> and
          switch value to <Typography.Text code>false</Typography.Text> (double
          click on the value)
        </Typography>
        <Typography.Title level={5} mark={true}>
          4- Still not working
        </Typography.Title>
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
