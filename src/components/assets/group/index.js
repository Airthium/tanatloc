/** @module components/assets/group */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import Delete from './delete'

import GroupAPI from '@/api/group'

/**
 * Group errors
 */
const errors = {
  addError: 'Unable to add group',
  updateError: 'Unable to update group'
}

/**
 * Group
 * @param {Object} props Props
 *
 * @description
 * - userOptions: List of users
 * - organization: Organization { id }
 * - group: Group in case of edit { id, name, users }
 * - swr: SWR functions { reloadOrganizations, addOneGroup, mutateOneGroup }
 */
const Group = ({ userOptions, organization, group, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On add
   * @param {Object} values Values
   */
  const onAdd = async (values) => {
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
      swr.reloadOrganizations()

      // Loading
      setLoading(false)

      // Close
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.addError, err)
      setLoading(false)
    }
  }

  /**
   * On update
   * @param {Object} values Values
   */
  const onUpdate = async (values) => {
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
      await GroupAPI.update(group.id, toUpdate)

      // Local
      swr.mutateOneGroup({
        ...group,
        ...values
      })
      swr.reloadOrganizations()

      // Close
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.updateError, err)
      setLoading(false)
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
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="users"
          label="Users"
          rules={[{ required: true, message: 'Please enter users' }]}
        >
          <Select mode="multiple" placeholder="Select users">
            {userOptions}
          </Select>
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
  userOptions: PropTypes.array.isRequired,
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

    // Missing or invalid swr.reloadOrgnizations
    if (
      !props[propName].reloadOrganizations ||
      typeof props[propName].reloadOrganizations !== 'function'
    )
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. reloadOrganizations missing or invalid'
      )
  }
}

export { Delete }
export default Group
