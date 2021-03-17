/** @module components/organizations */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import Add from './add'
import List from './list'
import Organization from './organization'

/**
 * Organizations
 * @param {Object} props Props
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
      if (currentOrganization && currentOrganization !== organization)
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
              organization={organization}
              swr={{
                reloadOrganizations: swr.reloadOrganizations,
                mutateOneOrganization: swr.mutateOneOrganization,
                loadingOrganizations: swr.loadingOrganizations
              }}
              onClose={() => setOrganization()}
            />
          ) : (
            <>
              <Add swr={{ addOneOrganization: swr.addOneOrganization }} />
              <List
                user={user}
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
  user: PropTypes.object.isRequired,
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.object.isRequired
}

export default Organizations
