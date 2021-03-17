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
  delError: 'Unable to delete the organization'
}

/**
 * Delete
 * @memberof module:components/organizations
 * @param {Object} props Props
 */
const Delete = ({ organization, swr }) => {
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
      await OrganizationAPI.del({ id: organization.id })

      // Local
      swr.delOneOrganization({ id: organization.id })

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.delError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button
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
        Delete {organization?.name}?
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  organization: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Delete
