import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Delete errors
 * @memberof module:components/organizations
 */
const errors = {
  delError: 'Unable to delete user'
}

/**
 * Delete user
 * @memberof module:components/organizations
 * @param {Object} props Props
 */
const Delete = ({ disabled, user, dBkey, organization, swr }) => {
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
      Error(errors.delError, err)
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
        Delete {user?.email}?
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  disabled: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string
  }).isRequired,
  dBkey: PropTypes.string.isRequired,
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
