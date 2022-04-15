/** @module Components.Assets.Group.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'

import { IGroupWithData } from '@/lib/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import GroupAPI from '@/api/group'
import { Typography } from 'antd'

/**
 * Props
 */
export interface IProps {
  group: IGroupWithData
  swr: {
    delOneGroup: (group: IGroupWithData) => void
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete group'
}

/**
 * On delete
 * @param group Group
 * @param swr SWR
 */
export const onDelete = async (
  group: IGroupWithData,
  swr: { delOneGroup: (group: IGroupWithData) => void }
): Promise<void> => {
  try {
    // Delete
    await GroupAPI.del({ id: group.id })

    // Mutate
    swr.delOneGroup({ id: group.id })
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @description
 * Props:
 * - group (Object) Group `{ id, name }`
 * - swr (Object) SWR function `{ delOneGroup }`
 * @returns Delete
 */
const Delete = ({ group, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      bordered
      title="Delete group"
      text={
        <>
          Are you sure you want to delete the group{' '}
          <Typography.Text strong>{group.name}</Typography.Text>?
        </>
      }
      loading={loading}
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(group, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
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
