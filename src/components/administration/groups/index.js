import { useState, useEffect } from 'react'
import {
  Avatar,
  Button,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tooltip
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons'

import { Error } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import UserAPI from '@/api/user'
import GroupAPI from '@/api/group'

const errors = {
  addError: 'Unable to add group',
  updateError: 'Unable to update group',
  deleteError: 'Unable to delete group'
}

const Groups = () => {
  // State
  const [edit, setEdit] = useState(false)
  const [userOptions, setUserOptions] = useState([])

  // Data
  const [users] = UserAPI.useUsers()
  const [
    groups,
    { addOneGroup, mutateOneGroup, delOneGroup }
  ] = GroupAPI.useGroups()

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 }
  }

  const tailLayout = {
    wrapperCol: { offset: 4, span: 12 }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (u) => (
        <Avatar.Group>
          {u.map((user) => {
            const avatar = user.avatar && Buffer.from(user.avatar).toString()
            let name = ''
            let abbrev = ''
            if (user.firstname || user.lastname) {
              name = user.firstname + ' ' + user.lastname
              abbrev =
                (user.firstname && user.firstname[0]) +
                (user.lastname && user.lastname[0])
            } else if (user.email) {
              name = user.email
              abbrev = user.email[0]
            }
            return (
              <Tooltip key={user.id || user} title={name}>
                <Avatar
                  src={avatar}
                  style={{ backgroundColor: Utils.stringToColor(name) }}
                >
                  {abbrev.toUpperCase()}
                </Avatar>
              </Tooltip>
            )
          })}
        </Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Button
            disabled={edit}
            icon={<EditOutlined />}
            onClick={() => setEdit(record)}
          />
          <Button
            type="danger"
            disabled={edit}
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record)}
          />
        </Space>
      )
    }
  ]

  // User options
  useEffect(() => {
    const options = users.map((user) => {
      let name = ''
      if (user.firstname || user.lastname)
        name = user.firstname + ' ' + user.lastname
      else name = user.email
      return <Select.Option key={user.id}>{name}</Select.Option>
    })
    setUserOptions(options)
  }, [JSON.stringify(users)])

  /**
   * On add
   * @param {Object} values Values
   */
  const onAdd = async (values) => {
    try {
      // Add group
      const newGroup = await GroupAPI.add(values)

      // Update local
      newGroup.name = values.name
      newGroup.users = values.users

      //Mutate
      addOneGroup(newGroup)

      // Close
      setEdit(false)
    } catch (err) {
      Error(errors.addError, err)
    }
  }

  /**
   * On update
   * @param {Object} values Values
   */
  const onUpdate = async (values) => {
    try {
      // Update
      const toUpdate = Object.keys(values)
        .map((key) => {
          const value = values[key]
          return { key, value }
        })
        .filter((u) => u)
      await GroupAPI.update(edit.id, toUpdate)

      // Mutate
      const group = {
        ...edit,
        ...values
      }
      mutateOneGroup(group)

      // Close
      setEdit(false)
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * On delete
   * @param {Object} values Values
   */
  const onDelete = async (values) => {
    try {
      // Delete
      await GroupAPI.del({ id: values.id })

      // Mutate
      delOneGroup({ id: values.id })
    } catch (err) {
      Error(errors.deleteError, err)
    }
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {edit ? (
        <Form
          {...layout}
          initialValues={{
            name: edit.name,
            users: edit?.users?.map((u) => u.id) || []
          }}
          onFinish={edit === true ? onAdd : onUpdate}
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
          <Form.Item {...tailLayout}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CheckOutlined />}
              />
              <Button
                type="danger"
                icon={<CloseOutlined />}
                onClick={() => setEdit(false)}
              />
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <Button icon={<PlusOutlined />} onClick={() => setEdit(true)}>
          Add group
        </Button>
      )}
      <Table
        columns={columns}
        dataSource={groups.map((g) => ({ ...g, key: g.id }))}
      />
    </Space>
  )
}

export default Groups
