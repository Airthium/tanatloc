/** @module Components.Assets.Group */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'

import { IGroupWithData, IOrganizationWithData } from '@/lib/index.d'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import Delete from './delete'

import GroupAPI from '@/api/group'

export interface IProps {
  userOptions: { label: string; value: string }[]
  organization: IOrganizationWithData
  group?: IGroupWithData
  swr: {
    addOneGroup?: Function
    mutateOneGroup?: Function
  }
}

/**
 * Errors
 */
const errors = {
  addError: 'Unable to add group',
  updateError: 'Unable to update group'
}

/**
 * Group
 * @param props Props
 * @description
 * - userOptions (array) List of users
 * - organization (Object) Organization `{ id }`
 * - group (Object) Group in case of edit `{ id, name, users }`
 * - swr (Object) SWR functions `{ addOneGroup, mutateOneGroup }`
 */
const Group = ({
  userOptions,
  organization,
  group,
  swr
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On add
   * @param values Values
   */
  const onAdd = async (values: {
    name: string
    users: string[]
  }): Promise<void> => {
    setLoading(true)

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

      // Loading
      setLoading(false)

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.addError, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * On update
   * @param values Values
   */
  const onUpdate = async (values: {
    name: string
    users: string[]
  }): Promise<void> => {
    setLoading(true)

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
      if (group.users.map((u) => u.id).toString() !== values.users.toString())
        toUpdate.push({
          key: 'users',
          value: values.users
        })

      // API
      await GroupAPI.update({ id: group.id }, toUpdate)

      // Local
      swr.mutateOneGroup({
        ...group,
        ...values
      })

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.updateError, err)
      setLoading(false)
      throw err
    }
  }

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
            users: group.users.map((u) => u.id)
          }
        }
        onCancel={() => setVisible(false)}
        onOk={group ? onUpdate : onAdd}
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

      <Button
        icon={group ? <EditOutlined /> : <PlusOutlined />}
        onClick={() => setVisible(true)}
      >
        {group ? 'Edit' : 'New group'}
      </Button>
    </>
  )
}

Group.propTypes = {
  userOptions: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  group: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired
  }),
  swr: (props, propName, componentName) => {
    // Missing swr
    if (!props[propName])
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. swr missing'
      )

    if (props['group']) {
      // Missing or invalid swr.mutateOneGroup
      if (
        !props[propName].mutateOneGroup ||
        typeof props[propName].mutateOneGroup !== 'function'
      )
        return new Error(
          'Invalid prop ' +
            propName +
            ' supplied to ' +
            componentName +
            '. mutateOneGroup missing or invalid'
        )
    } else {
      // Missing or invalid swr.addOneGroup
      if (
        !props[propName].addOneGroup ||
        typeof props[propName].addOneGroup !== 'function'
      )
        return new Error(
          'Invalid prop ' +
            propName +
            ' supplied to ' +
            componentName +
            '. addOneGroup missing or invalid'
        )
    }
  }
}

export { Delete }
export default Group
