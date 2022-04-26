/** @module Components.Organizations */

import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import {
  IFrontUser,
  IFrontOrganizations,
  IFrontOrganizationsItem,
  IFrontNewOrganization,
  IFrontMutateOrganizationsItem
} from '@/api/index.d'

import Organization from '@/components/assets/organization'

import Add from './add'
import List from './list'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id'>
  organizations: IFrontOrganizations
  swr: {
    addOneOrganization: (organization: IFrontNewOrganization) => void
    delOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
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
  const [organization, setOrganization] =
    useState<IFrontOrganizationsItem | null>()

  // Data
  const router = useRouter()
  const { organizationId } = router.query

  // Organization selected
  useEffect(() => {
    if (organizationId) {
      const currentOrganization = organizations.find(
        (o) => o.id === organizationId
      )
      setOrganization(currentOrganization)
    }
  }, [organizationId, organizations])

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
      <Layout.Content className="no-scroll">
        {organization ? (
          <Organization
            organization={{
              id: organization.id,
              name: organization.name,
              owners: organization.owners,
              pendingowners: organization.pendingowners,
              users: organization.users,
              pendingusers: organization.pendingusers,
              groups: organization.groups
            }}
            swr={{
              mutateOneOrganization: swr.mutateOneOrganization,
              loadingOrganizations: swr.loadingOrganizations
            }}
            onClose={() => {
              router.push({
                pathname: 'dashboard',
                query: {
                  page: 'organizations'
                }
              })
              setOrganization(null)
            }}
          />
        ) : (
          <Space direction="vertical" className="full-width" size={20}>
            <Add swr={{ addOneOrganization: swr.addOneOrganization }} />
            <List
              user={{
                id: user.id
              }}
              organizations={organizations}
              swr={{
                mutateOneOrganization: swr.mutateOneOrganization,
                delOneOrganization: swr.delOneOrganization,
                loadingOrganizations: swr.loadingOrganizations
              }}
              setOrganization={(org) => {
                router.push({
                  pathname: 'dashboard',
                  query: {
                    page: 'organizations',
                    organizationId: org.id
                  }
                })
                setOrganization(org)
              }}
            />
          </Space>
        )}
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
      pendingowners: PropTypes.array,
      users: PropTypes.array,
      pendingusers: PropTypes.array,
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
