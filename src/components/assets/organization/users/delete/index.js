import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

import { Error as ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Errors (delete)
 * @memberof Components.Assets.Organization.Users
 */
const errors = {
  delError: 'Unable to delete user'
}

/**
 * Delete user
 * @memberof Components.Assets.Organization.Users
 * @param {Object} props Props
 * @description
 * Props list:
 * - disabled (boolean) Set disabled state
 * - user (Object) User `{ id, email, [firstname], [lastname] }`
 * - organization (Object) Organization `{ id, [dBkey] }`
 * - dbKey (string) Database key, must be `owners` or `users`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 */
const Delete = ({ disabled, user, organization, dBkey, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)
    try {
      // API
      await OrganizationAPI.update(organization.id, [
        {
          key: dBkey,
          type: 'array',
          method: 'remove',
          value: user.id
        }
      ])

      // Local
      const newOrganization = { ...organization }
      newOrganization[dBkey] = newOrganization[dBkey].filter(
        (u) => u.id !== user.id
      )
      swr.mutateOneOrganization(newOrganization)

      // Close
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.delError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        disabled={disabled || !user.id}
        icon={<DeleteOutlined />}
        type="danger"
        onClick={() => setVisible(true)}
      />
      <DeleteDialog
        title="Delete organization"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        Delete{' '}
        {user.firstname || user.lastname
          ? user.firstname + ' ' + user.lastname
          : user.email}
        ?
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  disabled: PropTypes.bool,
  user: PropTypes.exact({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string
  }).isRequired,
  organization: (props, propName, componentName) => {
    // Missing organization
    if (!props[propName])
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. organization missing'
      )

    // Missing or invalid id
    if (!props[propName].id || typeof props[propName].id !== 'string')
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. id missing or invalid'
      )

    // Missing of invalid owners
    if (props['dBkey'] === 'owners') {
      if (!props[propName].owners || !Array.isArray(props[propName].owners))
        return new Error(
          'Invalid prop ' +
            propName +
            ' supplied to ' +
            componentName +
            '. owners missing or invalid'
        )
    }

    // Missing of invalid users
    if (props['dBkey'] === 'users') {
      if (!props[propName].users || !Array.isArray(props[propName].users))
        return new Error(
          'Invalid prop ' +
            propName +
            ' supplied to ' +
            componentName +
            '. users missing or invalid'
        )
    }
  },
  dBkey: PropTypes.oneOf(['owners', 'users']),
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
