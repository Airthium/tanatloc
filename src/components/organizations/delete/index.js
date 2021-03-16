import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

const errors = {
  delError: 'Unable to delete the organization'
}

/**
 * Delete
 * @memberof components/organizations
 * @param {Object} props Props
 */
const Delete = ({ organization }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [, { delOneOrganization }] = OrganizationAPI.useOrganizations()

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)

    try {
      // API
      await OrganizationAPI.del({ id: organization.id })

      // Update local
      delOneOrganization({ id: organization.id })
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
  organization: PropTypes.object.isRequired
}

export default Delete
