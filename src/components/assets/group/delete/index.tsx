/** @module Components.Assets.Group.Delete */

import { useCallback, useState } from 'react'
import { Typography } from 'antd'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { IFrontGroupsItem, IFrontMutateGroupsItem } from '@/api/index.d'
import GroupAPI from '@/api/group'

/**
 * Props
 */
export interface IProps {
  group: Pick<IFrontGroupsItem, 'id' | 'name'>
  swr: {
    delOneGroup: (group: IFrontMutateGroupsItem) => Promise<void>
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
export const _onDelete = async (
  group: Pick<IFrontGroupsItem, 'id'>,
  swr: { delOneGroup: (group: IFrontMutateGroupsItem) => Promise<void> }
): Promise<void> => {
  try {
    // Delete
    await GroupAPI.del({ id: group.id })

    // Mutate
    await swr.delOneGroup({ id: group.id })
  } catch (err: any) {
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
const Delete = ({ group, swr }: IProps): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * On delete
   */
  const onDelete = useCallback(async () => {
    setLoading(true)
    try {
      await _onDelete(group, swr)
    } finally {
      setLoading(false)
    }
  }, [group, swr])

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
      onDelete={onDelete}
    />
  )
}

export default Delete
