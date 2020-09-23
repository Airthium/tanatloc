import { useState } from 'react'
import { message, Avatar, Button, Form, Input, Space, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { useUser, update } from '../../../../src/api/user'
import { add } from '../../../../src/api/avatar'

import Sentry from '../../../../src/lib/sentry'

/**
 * Errors
 */
const errors = {
  badFormat: 'Supported format: jpg, png',
  badSize: 'Image must be smaller than 5MB'
}

/**
 * Information
 * @memberof module:renderer/components/account
 */
const Information = () => {
  // State
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form
  const [form] = Form.useForm()

  // Data
  const [user, { mutateUser }] = useUser()

  // Layout
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }
  const avatarLayout = {
    wrapperCol: { offset: 10, span: 6 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 14, span: 6 }
  }

  /**
   * On finish
   * @param {Object} data Data
   */
  const onFinish = async (data) => {
    setLoading(true)

    try {
      const toUpdate = []
      // TODO disable for now
      // if (data.username !== user.email)
      //   toUpdate.push({ key: 'email', value: data.username })
      if (data.firstname !== user.firstname)
        toUpdate.push({ key: 'firstname', value: data.firstname })
      if (data.lastname !== user.lastname)
        toUpdate.push({ key: 'lastname', value: data.lastname })
      if (data.email !== user.email)
        toUpdate.push({ key: 'email', value: data.email })

      // Update
      await update(toUpdate)

      // Mutate user
      mutateUser({
        user: {
          ...user,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email
        }
      })
    } catch (err) {
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
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
    if (!goodFormat) message.error(errors.badFormat)

    const goodSize = file.size / 1024 / 1024 < 5
    if (!goodSize) message.error(errors.badSize)

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
        await add({
          name: info.file.name,
          uid: info.file.uid,
          data: img
        })

        // Mutate user
        mutateUser({
          user: {
            ...user,
            avatar: img
          }
        })
      } catch (err) {
        message.error(err.message)
        console.error(err)
        Sentry.captureException(err)
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
    const img = await new Promise((resolve) => {
      reader.addEventListener('load', () => {
        resolve(reader.result)
      })
      reader.readAsDataURL(file)
    })
    return img
  }

  /**
   * Render
   */
  return (
    <Form
      {...layout}
      form={form}
      initialValues={{
        username: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }}
      onFinish={onFinish}
      name="personalForm"
    >
      <Form.Item {...avatarLayout}>
        <Space direction="vertical" className="Account-avatar">
          <Avatar size={128} src={user.avatar} />
          <Upload
            accept={'.jpg,.png'}
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={onChange}
          >
            <Button size="small" icon={<UploadOutlined />} loading={uploading}>
              Upload new
            </Button>
          </Upload>
        </Space>
      </Form.Item>
      <Form.Item label="User name" name="username">
        <Input disabled={true} />
        {/* Disabled for now (add username in dB) */}
      </Form.Item>
      <Form.Item label="First name" name="firstname">
        <Input />
      </Form.Item>
      <Form.Item label="Last name" name="lastname">
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Form.Item {...buttonLayout} style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Apply changes
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Information
