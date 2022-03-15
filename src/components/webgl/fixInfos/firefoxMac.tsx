/** @module Components.WebGL.FirefoxMac */

import { Layout, Typography } from 'antd'

/**
 * Firefox Mac
 * @returns FirefoxMac
 */
const FirefoxMac = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Typography.Title level={4}>
          No manipulation needed (MacOS)
        </Typography.Title>
        <Typography>
          Firefox on MacOS supports and enables WebGL for all versions from Snow
          Leopard 10.6. If WebGL still does not work, try to update to the last
          version of MacOS.
        </Typography>
        <Typography.Title level={4}>Enable webGL (Linux)</Typography.Title>
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
          Update to the latest version and retry all steps.
        </Typography>
      </Layout.Content>
    </Layout>
  )
}

FirefoxMac.propTypes = {}

export default FirefoxMac
