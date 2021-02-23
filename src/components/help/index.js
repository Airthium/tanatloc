/** @module 'src/components/help */

import { Card, Layout } from 'antd'

import HPC from './doc/hpc'

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
        </Card>
        <Card title="Support"></Card>
      </Layout.Content>
    </Layout>
  )
}

export default Help
