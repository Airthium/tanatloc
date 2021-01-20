/** @module renderer/components/help */

import { Card, Layout } from 'antd'

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
        <Card title="Documentation"></Card>
        <Card title="Support"></Card>
      </Layout.Content>
    </Layout>
  )
}

export default Help
