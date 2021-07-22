import PropTypes from 'prop-types'
import { useState } from 'react'
import { Avatar, Button, Card, Form, Input, Space, Upload } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'
import AvatarAPI from '@/api/avatar'

/**
 * Errors account/information
 * @memberof module:components/account
 */
const errors = {
  update: 'Unable to update informations',
  badFormat: 'Supported format: jpg, png',
  badSize: 'Image must be smaller than 5MB'
}

/**
 * Information
 * @memberof module:components/account
 * @param {Object} props Props
 */
const Information = ({ user, swr }) => {
  // State
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form
  const [form] = Form.useForm()

  // Layout
  const layout = {
    layout: 'vertical',
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }
  const avatarLayout = {
    wrapperCol: { offset: 4, span: 16 }
  }
  const inputLayout = {
    labelCol: { offset: 4 },
    wrapperCol: { offset: 4, span: 16 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 4 }
  }

  /**
   * On finish
   * @param {Object} data Data
   */
  const onFinish = async (data) => {
    setLoading(true)

    try {
      const toUpdate = []
      if (data.firstname !== user.firstname)
        toUpdate.push({ key: 'firstname', value: data.firstname })
      if (data.lastname !== user.lastname)
        toUpdate.push({ key: 'lastname', value: data.lastname })
      if (data.email !== user.email)
        toUpdate.push({ key: 'email', value: data.email })

      // Update
      await UserAPI.update(toUpdate)

      // Mutate user
      swr.mutateUser({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email
      })
    } catch (err) {
      ErrorNotification(errors.update, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    form.resetFields()
  }

  /**
   * Before upload
   * @param {File} file File
   */
  const beforeUpload = (file) => {
    const goodFormat = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!goodFormat) ErrorNotification(errors.badFormat)

    const goodSize = file.size / 1024 / 1024 < 5
    if (!goodSize) ErrorNotification(errors.badSize)

    return goodFormat && goodSize
  }

  /**
   * On avatar change
   * @param {Object} info Info
   */
  const onChange = async (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true)
    }

    if (info.file.status === 'done') {
      try {
        // Read image
        const img = await getBase64(info.file.originFileObj)

        // Add avatar
        await AvatarAPI.add({
          name: info.file.name,
          uid: info.file.uid,
          data: img
        })

        // Mutate user
        swr.mutateUser({
          ...user,
          avatar: Buffer.from(img)
        })
      } catch (err) {
        ErrorNotification(err.message, err)
      } finally {
        setUploading(false)
      }
    }
  }

  /**
   * Read base64 image
   * @param {File} file File
   */
  const getBase64 = async (file) => {
    const reader = new FileReader()
    return new Promise((resolve) => {
      reader.addEventListener('load', () => {
        resolve(reader.result)
      })
      reader.readAsDataURL(file)
    })
  }

  /**
   * Render
   */
  return (
    <Card title="Contact Details">
      <Form
        {...layout}
        form={form}
        initialValues={{
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        }}
        onFinish={onFinish}
      >
        <Form.Item {...avatarLayout}>
          <Space direction="vertical" className="Account-avatar">
            <Avatar
              size={128}
              src={user.avatar && Buffer.from(user.avatar).toString()}
              icon={<UserOutlined />}
            />
            <Upload
              accept={'.jpg,.png'}
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={onChange}
            >
              <Button
                size="small"
                icon={<UploadOutlined />}
                loading={uploading}
              >
                Upload new
              </Button>
            </Upload>
          </Space>
        </Form.Item>

        <Form.Item {...inputLayout} label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item {...inputLayout} label="First name" name="firstname">
          <Input />
        </Form.Item>
        <Form.Item {...inputLayout} label="Last name" name="lastname">
          <Input />
        </Form.Item>
        <Form.Item {...buttonLayout}>
          <Space direction="">
            <Button type="primary" htmlType="submit" loading={loading}>
              Apply changes
            </Button>
            <Button type="text" onClick={onCancel}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

Information.propTypes = {
  user: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    avatar: PropTypes.object
  }).isRequired,
  swr: PropTypes.shape({
    mutateUser: PropTypes.func.isRequired
  }).isRequired
}

export default Information
