/** @module 'src/components/help */

import { Card, Layout } from 'antd'

import HPC from './doc/hpc'
import Administration from './doc/administration'

/**
 * Help
 */
const Help = () => {
  /**
   * Render
   */
  return (
    <Layout className="Help">
      <Layout.Content>
        <Card title="Documentation">
          <HPC />
          <Administration />
        </Card>
        <Card title="Support"></Card>
      </Layout.Content>
    </Layout>
  )
}

export default Help
