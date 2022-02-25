/** @module Components.Assets.Group.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { IGroupWithData } from '@/lib/index.d'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import GroupAPI from '@/api/group'

export interface IProps {
  group: IGroupWithData
  swr: {
    delOneGroup: Function
  }
}

/**
 * Errors (delete)
 * @memberof Components.Assets.Group
 */
const errors = {
  del: 'Unable to delete group'
}

/**
 * Delete group
 * @param props Props
 * @description
 * Props:
 * - group (Object) Group `{ id, name }`
 * - swr (Object) SWR function `{ delOneGroup }`
 */
const Delete = ({ group, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)

    try {
      // Delete
      await GroupAPI.del({ id: group.id })

      // Mutate
      swr.delOneGroup({ id: group.id })

      // Close
      setLoading(false)
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
        danger
        onClick={() => setVisible(true)}
      />
      <DeleteDialog
        visible={visible}
        loading={loading}
        title="Delete group"
        onCancel={() => setVisible(false)}
        onOk={onDelete}
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
