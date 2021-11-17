import useSWR from 'swr'
import { fetcher } from '@/api/call'
import { IOrganizationWithData } from '@/lib'

/**
 * Use organizations
 * @memberof API.Organization
 * @returns {Array} `[organizations, {mutateOrganizations, addOneOrganization, delOneOrganization, mutateOneOrganization, errorOrganizations, loadingOrganizations }]`
 */
export const useOrganizations = (): [
  IOrganizationWithData[],
  {
    mutateOrganizations: (data: {
      organizations: IOrganizationWithData[]
    }) => void
    addOneOrganization: (organization: IOrganizationWithData) => void
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
   * @param {Object} organization Organization
   */
  const addOne = (organization: IOrganizationWithData) => {
    const newOrganizations = [...organizations, organization]
    mutate({ organizations: newOrganizations })
  }

  /**
   * Delete one
   * @param {Object} organization Organization
   */
  const delOne = (organization: IOrganizationWithData) => {
    const filteredOrganizations = organizations.filter(
      (o) => o.id !== organization.id
    )
    mutate({ organizations: filteredOrganizations })
  }

  /**
   * Mutate one
   * @param {Object} organization Organization
   */
  const mutateOne = (organization: IOrganizationWithData) => {
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
