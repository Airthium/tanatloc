/** @module API.Organization.UseOrganizations */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontNewOrganization,
  IFrontOrganizations,
  IFrontOrganizationsItem
} from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use organizations
 * @returns Organization
 */
export const useOrganizations = (): [
  IFrontOrganizations,
  {
    addOneOrganization: (organization: IFrontNewOrganization) => void
    delOneOrganization: (organization: Partial<IFrontOrganizationsItem>) => void
    mutateOneOrganization: (
      organization: Partial<IFrontOrganizationsItem>
    ) => void
    errorOrganizations: Error
    loadingOrganizations: boolean
  }
] => {
  const defaultData: IFrontOrganizations = []

  const { data, error, mutate } = useSWR('/api/organizations', fetcher)
  const loading = !data
  const organizations = data?.organizations || defaultData

  /**
   * Add one
   * @param organization Organization
   */
  const addOne = useCallback(
    (organization: IFrontNewOrganization): void => {
      const newOrganizations = [
        ...organizations,
        organization
      ] as IFrontOrganizations
      mutate({ organizations: newOrganizations })
    },
    [organizations, mutate]
  )

  /**
   * Delete one
   * @param organization Organization
   */
  const delOne = useCallback(
    (organization: Partial<IFrontOrganizationsItem>): void => {
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
    (organization: Partial<IFrontOrganizationsItem>): void => {
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
      addOneOrganization: addOne,
      delOneOrganization: delOne,
      mutateOneOrganization: mutateOne,
      errorOrganizations: error,
      loadingOrganizations: loading
    }
  ]
}
