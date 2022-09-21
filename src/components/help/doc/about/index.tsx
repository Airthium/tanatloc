import { Card, Typography } from 'antd'
import os from 'os'

import packageJson from '../../../../../package.json'

import Utils from '@/lib/utils'

/**
 * About
 * @returns About
 */
const About = () => {
  /**
   * Render
   */
  return (
    <Card title="About">
      <Typography>
        Version: <Typography.Text code>{packageJson.version}</Typography.Text>
      </Typography>
      <br />
      <Typography>
        Git version:{' '}
        <Typography.Text code>{Utils.getGitVersion()}</Typography.Text>
      </Typography>
      <br />
      <Typography>
        Browser: <Typography.Text code>{navigator.userAgent}</Typography.Text>
      </Typography>
      <br />
      <Typography>
        OS: <Typography.Text code>{os.platform()}</Typography.Text>
      </Typography>
    </Card>
  )
}

export default About
