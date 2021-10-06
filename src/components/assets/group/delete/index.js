import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import GroupAPI from '@/api/group'

/**
 * Errors (delete)
 * @memberof Components.Assets.Group
 */
const errors = {
  del: 'Unable to delete group'
}

/**
 * Delete group
 * @memberof Components.Assets.Group
 * @param {Object} props Props `{ group, swr }`
 * @description
 * Props:
 * - group (Object) Group `{ id, name }`
 * - swr (Object) SWR function `{ delOneGroup }`
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
      await GroupAPI.del({ id: group.id })

      // Mutate
      swr.delOneGroup({ id: group.id })

      // Close
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.del, err)
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
  group: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    delOneGroup: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
