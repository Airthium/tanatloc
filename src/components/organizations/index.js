/** @namespace Components.Organizations */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import Add from './add'
import List from './list'
import Organization from '@/components/assets/organization'

/**
 * Organizations
 * @memberof Components.Organizations
 * @param {Object} props Props `{ user, organizations, swr }`
 */
const Organizations = ({ user, organizations, swr }) => {
  // State
  const [organization, setOrganization] = useState()

  // Organization update
  useEffect(() => {
    if (organization) {
      const currentOrganization = organizations.find(
        (o) => o.id === organization.id
      )
      if (JSON.stringify(currentOrganization) !== JSON.stringify(organization))
        setOrganization(currentOrganization)
    }
  }, [organizations, organization])

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
              organization={{
                id: organization.id,
                name: organization.name,
                owners: organization.owners,
                users: organization.users
              }}
              swr={{
                mutateOneOrganization: swr.mutateOneOrganization,
                loadingOrganizations: swr.loadingOrganizations
              }}
              onClose={() => setOrganization()}
            />
          ) : (
            <>
              <Add swr={{ addOneOrganization: swr.addOneOrganization }} />
              <List
                user={{
                  id: user.id
                }}
                organizations={organizations}
                swr={{
                  delOneOrganization: swr.delOneOrganization,
                  loadingOrganizations: swr.loadingOrganizations
                }}
                setOrganization={setOrganization}
              />
            </>
          )}
        </Space>
      </Layout.Content>
    </Layout>
  )
}

Organizations.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    addOneOrganization: PropTypes.func.isRequired,
    delOneOrganization: PropTypes.func.isRequired,
    mutateOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired
}

export default Organizations
