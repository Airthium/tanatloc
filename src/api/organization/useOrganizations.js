import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use organizations
 * @memberof API.Organization
 * @returns {Array} `[organizations, {mutateOrganizations, addOneOrganization, delOneOrganization, mutateOneOrganization, errorOrganizations, loadingOrganizations }]`
 */
const useOrganizations = () => {
  const { data, error, mutate } = useSWR('/api/organizations', Caller.fetcher)
  const loading = !data
  const organizations = data?.organizations || []

  /**
   * Add one
   * @param {Object} organization Organization
   */
  const addOne = (organization) => {
    const newOrganizations = [...organizations, organization]
    mutate({ organizations: newOrganizations })
  }

  /**
   * Delete one
   * @param {Object} organization Organization
   */
  const delOne = (organization) => {
    const filteredOrganizations = organizations.filter(
      (o) => o.id !== organization.id
    )
    mutate({ organizations: filteredOrganizations })
  }

  /**
   * Mutate one
   * @param {Object} organization Organization
   */
  const mutateOne = (organization) => {
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

export default useOrganizations
