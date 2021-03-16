/** @module components/organizations */

import { useState } from 'react'
import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import Add from './add'
import List from './list'
import Organization from './organization'

import OrganizationAPI from '@/api/organization'

/**
 * Organizations
 */
const Organizations = () => {
  // State
  const [organization, setOrganization] = useState()

  // Data
  const [
    organizations,
    {
      addOneOrganization,
      delOneOrganization,
      mutateOneOrganization,
      loadingOrganizations
    }
  ] = OrganizationAPI.useOrganizations()

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
              swr={{
                mutateOneOrganization
              }}
              onClose={() => setOrganization()}
            />
          ) : (
            <>
              <Add swr={{ addOneOrganization }} />
              <List
                setOrganization={setOrganization}
                swr={{
                  organizations,
                  delOneOrganization,
                  loadingOrganizations
                }}
              />
            </>
          )}
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Organizations
