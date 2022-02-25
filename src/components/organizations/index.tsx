/** @module Components.Organizations */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import { IOrganizationWithData, IUserWithData } from '@/lib/index.d'

import Add from './add'
import List from './list'
import Organization from '@/components/assets/organization'

export interface IProps {
  user: IUserWithData
  organizations: IOrganizationWithData[]
  swr: {
    addOneOrganization: Function
    delOneOrganization: Function
    mutateOneOrganization: Function
    loadingOrganizations: boolean
  }
}

/**
 * Organizations
 * @param props Props
 */
const Organizations = ({ user, organizations, swr }: IProps): JSX.Element => {
  // State
  const [organization, setOrganization]: [IOrganizationWithData, Function] =
    useState()

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
    <Layout className="inDashboard Organization">
      <PageHeader
        className="inDashboard-PageHeader"
        backIcon={false}
        title={
          <Typography.Title level={2} className="inDashboard-PageHeader-title">
            Organizations
          </Typography.Title>
        }
        footer={<Divider />}
      />
      <Layout.Content>
        <Space direction="vertical" className="full-width">
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
