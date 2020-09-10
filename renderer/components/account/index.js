/** @module renderer/components/account */

import { Card, Layout } from 'antd'

import Information from './information'
import Password from './password'
import Delete from './delete'

/**
 * Account
 */
const Account = () => {
  /**
   * Render
   */
  return (
    <Layout className="Account">
      <Layout.Content>
        <Card title="Personal information">
          <Information />
          <Password />
        </Card>
        <Delete />
      </Layout.Content>
    </Layout>
  )
}

export default Account
