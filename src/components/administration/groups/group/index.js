import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import GroupAPI from '@/api/group'

/**
 * Groups/Group errors
 * @memberof module:components/administration
 */
const errors = {
  addError: 'Unable to add group',
  updateError: 'Unable to update group'
}

/**
 * Groups/Group
 * @memberof module:components/administration
 * @param {Object} props Props
 *
 * @description
 * - userOptions: List of users
 * - group: Group in case of edit
 * - swr: SWR functions
 */
const Edit = ({ userOptions, group, swr }) => {
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
      const newGroup = await GroupAPI.add(values)

      // Local
      swr.addOneGroup({
        ...newGroup,
        name: values.name,
        users: values.users
      })

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.addError, err)
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

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.updateError, err)
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

      <Button icon={<EditOutlined />} onClick={() => setVisible(true)}>
        {group ? 'Edit' : 'New group'}
      </Button>
    </>
  )
}

Edit.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired
  }),
  userOptions: PropTypes.array.isRequired,
  swr: PropTypes.shape({
    addOneGroup: PropTypes.func.isRequired,
    mutateOneGroup: PropTypes.func.isRequired
  }).isRequired
}

export default Edit
