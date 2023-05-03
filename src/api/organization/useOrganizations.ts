/** @module API.Organization.UseOrganizations */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontMutateOrganizationsItem,
  IFrontNewOrganization,
  IFrontOrganizations
} from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use organizations
 * @returns Organization
 */
export const useOrganizations = (): [
  IFrontOrganizations,
  {
    addOneOrganization: (organization: IFrontNewOrganization) => Promise<void>
    delOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
    errorOrganizations: Error
    loadingOrganizations: boolean
  }
] => {
  const defaultData: IFrontOrganizations = []

  const { data, error, mutate } = useSWR('/api/organizations', fetcher)
  const loading = !data
  const organizations = data?.organizations ?? defaultData

  /**
   * Add one
   * @param organization Organization
   */
  const addOne = useCallback(
    async (organization: IFrontNewOrganization): Promise<void> => {
      const newOrganizations = [
        ...organizations,
        {
          ...organization,
          pendingowners: [],
          users: [],
          pendingusers: [],
          groups: []
        }
      ] as IFrontOrganizations
      await mutate({ organizations: newOrganizations })
    },
    [organizations, mutate]
  )

  /**
   * Delete one
   * @param organization Organization
   */
  const delOne = useCallback(
    async (organization: IFrontMutateOrganizationsItem): Promise<void> => {
      const filteredOrganizations = organizations.filter(
        (o) => o.id !== organization.id
      )
      await mutate({ organizations: filteredOrganizations })
    },
    [organizations, mutate]
  )

  /**
   * Mutate one
   * @param organization Organization
   */
  const mutateOne = useCallback(
    async (organization: IFrontMutateOrganizationsItem): Promise<void> => {
      const mutatedOrganizations = organizations.map((o) => {
        if (o.id === organization.id) o = { ...o, ...organization }
        return o
      })
      await mutate({ organizations: mutatedOrganizations })
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
