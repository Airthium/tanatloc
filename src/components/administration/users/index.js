import { useState } from 'react'
import {
  notification,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Table,
  Space
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons'

import UserAPI from '@/api/user'
import SystemAPI from '@/api/system'

import { PasswordItem } from '@/components/assets/input'
import { Error } from '@/components/assets/notification'

const errors = {
  addError: 'Unable to add user',
  updateError: 'Unable to update user',
  deleteError: 'Unable to delete user',
  passwordTooSmall: 'Your password is too small',
  passwordTooLong: 'Your password is too long',
  passwordRequireLetter: 'Your password must contain a letter',
  passwordRequireNumber: 'Your password must contain a number',
  passwordRequireSymbol: 'Your password must contain a symbol'
}

const Users = () => {
  // State
  const [edit, setEdit] = useState(false)

  // Data
  const [users, { addOneUser, mutateOneUser, delOneUser }] = UserAPI.useUsers()
  const [system] = SystemAPI.useSystem()

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
  }

  const columns = [
    {
      title: 'First name',
      dataIndex: 'firstname',
      key: 'firstname',
      sorter: (a, b) => a.firstname - b.firstname
    },
    {
      title: 'Last name',
      dataIndex: 'lastname',
      key: 'lastname',
      sorter: (a, b) => a.lastname - b.lastname
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email - b.email
    },
    {
      title: 'Password',
      key: 'password',
      render: () => '******'
    },
    {
      title: 'Administrator',
      dataIndex: 'superuser',
      key: 'superuser',
      render: (superuser) =>
        superuser && <CheckOutlined style={{ color: 'green' }} />
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

  /**
   * On add
   * @param {Object} values Values
   */
  const onAdd = async (values) => {
    try {
      // Add user
      const newUser = await UserAPI.add({
        username: values.email,
        password: values.password
      })
      if (newUser.alreadyExists) {
        notification.error('Use already exists')
        return
      }

      // Update informations
      await UserAPI.updateById(newUser.id, [
        {
          key: 'firstname',
          value: values.firstname
        },
        {
          key: 'lastname',
          value: values.lastname
        },
        {
          key: 'superuser',
          value: !!values.superuser
        }
      ])

      // Mutate
      newUser.email = newUser.username
      newUser.firstname = values.firstname
      newUser.lastname = values.lastname
      newUser.superuser = values.superuser
      addOneUser(newUser)

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
          if (value !== undefined && value !== '******')
            return { key, value, type: key === 'password' && 'crypt' }
        })
        .filter((u) => u)
      await UserAPI.updateById(edit.id, toUpdate)

      // Mutate
      const user = {
        ...edit,
        ...values
      }
      delete user.password
      mutateOneUser(user)

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
      await UserAPI.delById(values.id)

      // Mutate
      delOneUser({ id: values.id })
    } catch (err) {
      Error(errors.deleteError, err)
    }
  }

  /**
   * Render
   */
  return (
    <Card title="Users" className="Vertical-gutter">
      <Space direction="vertical">
        {edit ? (
          <Form
            {...layout}
            initialValues={{ ...edit, password: '******' }}
            onFinish={edit === true ? onAdd : onUpdate}
          >
            <Form.Item
              name="firstname"
              label="First name"
              rules={[{ required: true, message: 'Please enter a first name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Last name"
              rules={[{ required: true, message: 'Please enter a last name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please enter an email' }]}
            >
              <Input />
            </Form.Item>
            <PasswordItem name="password" />
            <Form.Item
              name="superuser"
              label="Administrator"
              valuePropName="checked"
            >
              <Checkbox />
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
            Add user
          </Button>
        )}
        <Table
          columns={columns}
          dataSource={users.map((u) => ({ ...u, key: u.id }))}
        />
      </Space>
    </Card>
  )
}

export default Users
