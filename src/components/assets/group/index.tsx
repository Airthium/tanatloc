/** @module Components.Assets.Group */

import { useState } from 'react'
import { Form, Input, Select } from 'antd'

import { AddButton, EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import {
  IFrontOrganizationsItem,
  IFrontGroupsItem,
  IFrontMutateOrganizationsItem,
  IFrontNewGroup,
  IFrontMutateGroupsItem
} from '@/api/index.d'
import GroupAPI from '@/api/group'

import Delete from './delete'

/**
 * Props
 */
export interface IProps {
  userOptions: { label: string; value: string }[]
  organization: Pick<IFrontOrganizationsItem, 'id' | 'groups'>
  group?: Pick<IFrontGroupsItem, 'id' | 'name' | 'users'>
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
    addOneGroup?: (group: IFrontNewGroup) => void
    mutateOneGroup?: (group: IFrontMutateGroupsItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add group',
  update: 'Unable to update group'
}

/**
 * On add
 * @param organization Organization
 * @param values Values
 * @param swr SWR
 */
export const onAdd = async (
  organization: Pick<IFrontOrganizationsItem, 'id' | 'groups'>,
  values: {
    name: string
    users: string[]
  },
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
    addOneGroup: (group: IFrontNewGroup) => void
  }
): Promise<void> => {
  try {
    // API
    const newGroup = await GroupAPI.add(
      { id: organization.id },
      { name: values.name, users: values.users }
    )

    // Local
    swr.addOneGroup({
      ...newGroup,
      name: values.name,
      users: values.users
    })

    swr.mutateOneOrganization({
      id: organization.id,
      groups: [
        ...organization.groups,
        newGroup
      ] as IFrontOrganizationsItem['groups']
    })
  } catch (err) {
    ErrorNotification(errors.add, err)
    throw err
  }
}

/**
 * On update
 * @param organization Organization
 * @param group Group
 * @param values Values
 * @param swr SWR
 */
export const onUpdate = async (
  organization: Pick<IFrontOrganizationsItem, 'id' | 'groups'>,
  group: Pick<IFrontGroupsItem, 'id' | 'name' | 'users'>,
  values: {
    name: string
    users: string[]
  },
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
    mutateOneGroup: (group: IFrontMutateGroupsItem) => void
  }
): Promise<void> => {
  try {
    // Check update
    const toUpdate = []

    // Name
    if (group.name !== values.name)
      toUpdate.push({
        key: 'name',
        value: values.name
      })

    // Users
    if (group.users?.map((u) => u.id).toString() !== values.users.toString())
      toUpdate.push({
        key: 'users',
        value: values.users
      })

    if (!toUpdate.length) return

    // API
    await GroupAPI.update({ id: group.id }, toUpdate)

    // Local
    swr.mutateOneGroup({
      ...group,
      ...(values as any)
    })

    const groupIndex = organization.groups?.findIndex((g) => g.id === group.id)
    swr.mutateOneOrganization({
      id: organization.id,
      groups: [
        ...organization.groups?.slice(0, groupIndex),
        group,
        ...organization.groups?.slice(groupIndex + 1)
      ]
    })
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Group
 * @param props Props
 * @description
 * - userOptions (array) List of users
 * - organization (Object) Organization `{ id }`
 * - group (Object) Group in case of edit `{ id, name, users }`
 * - swr (Object) SWR functions `{ addOneGroup, mutateOneGroup }`
 * @returns Group
 */
const Group = ({
  userOptions,
  organization,
  group,
  swr
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title={group ? 'Edit group' : 'New group'}
        visible={visible}
        initialValues={
          group && {
            name: group.name,
            users: group.users?.map((u) => u.id)
          }
        }
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            if (group) {
              await onUpdate(organization, group, values, {
                mutateOneOrganization: swr.mutateOneOrganization,
                mutateOneGroup: swr.mutateOneGroup!
              })
            } else {
              await onAdd(organization, values, {
                mutateOneOrganization: swr.mutateOneOrganization,
                addOneGroup: swr.addOneGroup!
              })
            }

            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
        loading={loading}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is requried' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="users"
          label="Users"
          rules={[{ required: true, message: 'Users selection is required' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select users"
            options={userOptions}
          />
        </Form.Item>
      </Dialog>

      {group ? (
        <EditButton bordered onEdit={() => setVisible(true)}>
          Edit
        </EditButton>
      ) : (
        <AddButton onAdd={() => setVisible(true)}>New group</AddButton>
      )}
    </>
  )
}

export { Delete }
export default Group
