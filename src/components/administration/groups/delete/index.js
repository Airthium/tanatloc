import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import GroupAPI from '@/api/group'

/**
 * Delete errors
 * @memberof module:components/administration
 */
const errors = {
  delError: 'Unable to delete group'
}

/**
 * Delete
 * @memberof module:components/administration
 * @param {Object} props Props
 */
const Delete = ({ group, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)

    try {
      // Delete
      await GroupAPI.delById(group.id)

      // Mutate
      swr.delOneGroup({ id: group.id })

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
        title="Delete group"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        Delete {group.name}?
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    delOneGroup: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
