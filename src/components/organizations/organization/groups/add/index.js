import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import GroupAPI from '@/api/group'

/**
 * Add errors
 * @memberof module:components/organizations
 */
const errors = {
  addError: 'Unable to add group'
}

/**
 * Add group
 * @memberof module:components/organizations
 * @param {Object} props Props
 */
const Add = ({ organization, swr }) => {
  // State
  const [userOptions, setUserOptions] = useState([])
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // User options
  useEffect(() => {
    const owners = organization?.owners
    const users = organization?.users

    const allUsers = [...(owners || []), ...(users || [])]

    const options = allUsers.map((user, index) => {
      let name = ''
      if (user.firstname || user.lastname)
        name = user.firstname + ' ' + user.lastname
      else name = user.email
      return <Select.Option key={user.id || index}>{name}</Select.Option>
    })
    setUserOptions(options)
  }, [organization])

  /**
   * On add
   * @param {Object} values Values
   */
  const onAdd = async (values) => {
    setLoading(true)

    try {
      // API
      const newGroup = await GroupAPI.add({ id: organization.id }, values)

      // Local
      newGroup.name = values.name
      newGroup.users = values.users
      swr.addOneGroup(newGroup)

      // Close
      setVisible(false)

      // Reload
      swr.reloadOrganizations()
    } catch (err) {
      Error(errors.addError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="New group"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onAdd}
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

      <Button icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        Add group
      </Button>
    </>
  )
}

Add.propTypes = {
  organization: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Add
