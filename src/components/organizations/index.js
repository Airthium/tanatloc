/** @module components/organizations */

import { useState } from 'react'
import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import Add from './add'
import List from './list'
import Organization from './organization'

/**
 * Organizations
 */
const Organizations = () => {
  // State
  const [organization, setOrganization] = useState()

  /**
   * Render
   */
  return (
    <Layout className="Workspace">
      <PageHeader
        backIcon={false}
        title={
          <Typography.Title level={2} className="pageheader-name">
            Organizations
          </Typography.Title>
        }
        footer={
          <div>
            <Divider className="Tanatloc-divider" />
          </div>
        }
      />
      <Layout.Content>
        <Space direction="vertical" style={{ width: '100%' }}>
          {organization ? (
            <Organization
              organization={organization}
              onClose={() => setOrganization()}
            />
          ) : (
            <>
              <Add />
              <List setOrganization={setOrganization} />
            </>
          )}
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Organizations
