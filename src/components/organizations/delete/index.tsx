/** @module Components.Organizations.Edit */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { IOrganizationWithData } from '@/lib/index.d'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

export interface IProps {
  organization: IOrganizationWithData
  swr: {
    delOneOrganization: Function
  }
}

/**
 * Errors (delete)
 */
const errors = {
  delError: 'Unable to delete the organization'
}

/**
 * Delete
 * @param props Props
 */
const Delete = ({ organization, swr }: IProps): JSX.Element => {
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
        danger
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
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    delOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
