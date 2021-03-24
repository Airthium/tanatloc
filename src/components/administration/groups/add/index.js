import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import GroupAPI from '@/api/group'

/**
 * Add errors
 * @memberof module:components/administration
 */
const errors = {
  addError: 'Unable to add group'
}

/**
 * Add
 * @memberof module:components/administration
 * @param {Object} props Props
 */
const Add = ({ userOptions, swr }) => {
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

      // Update local
      newGroup.name = values.name
      newGroup.users = values.users

      //Mutate
      swr.addOneGroup(newGroup)

      // Close
      setVisible(false)
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
        New group
      </Button>
    </>
  )
}

Add.propTypes = {
  userOptions: PropTypes.array.isRequired,
  swr: PropTypes.shape({
    addOneGroup: PropTypes.func.isRequired
  }).isRequired
}

export default Add
