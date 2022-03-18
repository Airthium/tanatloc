/** @module Components.Organizations */

import PropTypes from 'prop-types'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import { IOrganizationWithData, IUserWithData } from '@/lib/index.d'
import { INewOrganization } from '@/database/index.d'

import Organization from '@/components/assets/organization'

import Add from './add'
import List from './list'

/**
 * Props
 */
export interface IProps {
  user: IUserWithData
  organizations: IOrganizationWithData[]
  swr: {
    addOneOrganization: (organization: INewOrganization) => void
    delOneOrganization: (organization: IOrganizationWithData) => void
    mutateOneOrganization: (organization: IOrganizationWithData) => void
    loadingOrganizations: boolean
  }
}

/**
 * Organizations
 * @param props Props
 * @returns Organizations
 */
const Organizations = ({ user, organizations, swr }: IProps): JSX.Element => {
  // State
  const [organization, setOrganization]: [
    IOrganizationWithData,
    Dispatch<SetStateAction<IOrganizationWithData>>
  ] = useState()

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
        <Space direction="vertical" className="full-width" size={20}>
          {organization ? (
            <Organization
              organization={{
                id: organization.id,
                name: organization.name,
                owners: organization.owners,
                users: organization.users,
                groups: organization.groups
              }}
              swr={{
                mutateOneOrganization: swr.mutateOneOrganization,
                loadingOrganizations: swr.loadingOrganizations
              }}
              onClose={() => setOrganization(null)}
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
  organizations: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      owners: PropTypes.array.isRequired,
      users: PropTypes.array,
      groups: PropTypes.array
    })
  ).isRequired,
  swr: PropTypes.exact({
    addOneOrganization: PropTypes.func.isRequired,
    delOneOrganization: PropTypes.func.isRequired,
    mutateOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired
}

export default Organizations
