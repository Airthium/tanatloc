import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { IOrganizationWithData, IUserWithData } from '@/lib/index.d'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

export interface IProps {
  disabled?: boolean
  user: IUserWithData
  organization: IOrganizationWithData
  dBkey: 'owners' | 'users'
  swr: {
    mutateOneOrganization: Function
  }
}

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
 * @param props Props
 * @description
 * Props list:
 * - disabled (boolean) Set disabled state
 * - user (Object) User `{ id, email, [firstname], [lastname] }`
 * - organization (Object) Organization `{ id, [dBkey] }`
 * - dbKey (string) Database key, must be `owners` or `users`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 */
const Delete = ({
  disabled,
  user,
  organization,
  dBkey,
  swr
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)
    try {
      // API
      await OrganizationAPI.update(organization, [
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
        danger
        onClick={() => setVisible(true)}
      />
      <DeleteDialog
        visible={visible}
        loading={loading}
        title="Delete organization"
        onCancel={() => setVisible(false)}
        onOk={onDelete}
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
