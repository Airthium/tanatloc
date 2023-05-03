/** @module Components.Organizations */

import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from 'react'
import { Layout, Space, Typography } from 'antd'

import {
  IFrontUser,
  IFrontOrganizations,
  IFrontOrganizationsItem,
  IFrontNewOrganization,
  IFrontMutateOrganizationsItem
} from '@/api/index.d'

import Organization from '@/components/assets/organization'
import PageHeader from '@/components/assets/pageHeader'

import Add from './add'
import List from './list'

import globalStyle from '@/styles/index.module.css'
import dashboardStyle from '@/components/dashboard/index.module.css'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id'>
  organizations: IFrontOrganizations
  swr: {
    addOneOrganization: (organization: IFrontNewOrganization) => Promise<void>
    delOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
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
   * On close
   */
  const onClose = useCallback((): void => {
    router
      .push({
        pathname: 'dashboard',
        query: {
          page: 'organizations'
        }
      })
      .catch()
    setOrganization(null)
  }, [router])

  /**
   * Set org
   * @param org Organization
   */
  const setOrg = useCallback(
    (org: IFrontOrganizationsItem): void => {
      router
        .push({
          pathname: 'dashboard',
          query: {
            page: 'organizations',
            organizationId: org.id
          }
        })
        .catch()
      setOrganization(org)
    },
    [router]
  )

  /**
   * Render
   */
  return (
    <Layout className={dashboardStyle.inDashboard}>
      <PageHeader
        title={
          <Typography.Title level={2} style={{ marginBottom: '0 !important' }}>
            Organizations
          </Typography.Title>
        }
      />
      <Layout.Content className={globalStyle.noScroll}>
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
            onClose={onClose}
          />
        ) : (
          <Space
            direction="vertical"
            className={globalStyle.fullWidth}
            size={20}
          >
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
              setOrganization={setOrg}
            />
          </Space>
        )}
      </Layout.Content>
    </Layout>
  )
}

export default Organizations
