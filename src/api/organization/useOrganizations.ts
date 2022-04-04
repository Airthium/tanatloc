/** @module API.Organization.UseOrganizations */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IOrganizationWithData } from '@/lib/index.d'
import { INewOrganization } from '@/database/index.d'

import { fetcher } from '@/api/call'

/**
 * Use organizations
 * @returns Organization
 */
export const useOrganizations = (): [
  IOrganizationWithData[],
  {
    mutateOrganizations: (data: {
      organizations: IOrganizationWithData[]
    }) => void
    addOneOrganization: (organization: INewOrganization) => void
    delOneOrganization: (organization: IOrganizationWithData) => void
    mutateOneOrganization: (organization: IOrganizationWithData) => void
    errorOrganizations: Error
    loadingOrganizations: boolean
  }
] => {
  const defaultData = []

  const { data, error, mutate } = useSWR('/api/organizations', fetcher)
  const loading = !data
  const organizations = data?.organizations || defaultData

  /**
   * Add one
   * @param organization Organization
   */
  const addOne = useCallback(
    (organization: INewOrganization): void => {
      const newOrganizations = [...organizations, organization]
      //@ts-ignore
      mutate({ organizations: newOrganizations })
    },
    [organizations, mutate]
  )

  /**
   * Delete one
   * @param organization Organization
   */
  const delOne = useCallback(
    (organization: IOrganizationWithData): void => {
      const filteredOrganizations = organizations.filter(
        (o) => o.id !== organization.id
      )
      mutate({ organizations: filteredOrganizations })
    },
    [organizations, mutate]
  )

  /**
   * Mutate one
   * @param organization Organization
   */
  const mutateOne = useCallback(
    (organization: IOrganizationWithData): void => {
      const mutatedOrganizations = organizations.map((o) => {
        if (o.id === organization.id) o = { ...o, ...organization }
        return o
      })
      mutate({ organizations: mutatedOrganizations })
    },
    [organizations, mutate]
  )

  return [
    organizations,
    {
      mutateOrganizations: mutate,
      addOneOrganization: addOne,
      delOneOrganization: delOne,
      mutateOneOrganization: mutateOne,
      errorOrganizations: error,
      loadingOrganizations: loading
    }
  ]
}
