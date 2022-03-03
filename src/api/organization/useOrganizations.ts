/** @module API.Organization.UseOrganizations */

import useSWR from 'swr'

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
  const { data, error, mutate } = useSWR('/api/organizations', fetcher)
  const loading = !data
  const organizations = data?.organizations || []

  /**
   * Add one
   * @param organization Organization
   */
  const addOne = (organization: INewOrganization): void => {
    const newOrganizations = [...organizations, organization]
    //@ts-ignore
    mutate({ organizations: newOrganizations })
  }

  /**
   * Delete one
   * @param organization Organization
   */
  const delOne = (organization: IOrganizationWithData): void => {
    const filteredOrganizations = organizations.filter(
      (o) => o.id !== organization.id
    )
    mutate({ organizations: filteredOrganizations })
  }

  /**
   * Mutate one
   * @param organization Organization
   */
  const mutateOne = (organization: IOrganizationWithData): void => {
    const mutatedOrganizations = organizations.map((o) => {
      if (o.id === organization.id) o = { ...o, ...organization }
      return o
    })
    mutate({ organizations: mutatedOrganizations })
  }

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
