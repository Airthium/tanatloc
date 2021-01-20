import { useState } from 'react'
import {
  notification,
  Avatar,
  Button,
  Form,
  Input,
  Space,
  Upload,
  Card,
  Row,
  Col
} from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'
import AvatarAPI from '@/api/avatar'

/**
 * Errors account/information
 * @memberof module:renderer/components/account
 */
const errors = {
  updateError: 'Unable to update informations',
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
  const [user, { mutateUser }] = UserAPI.useUser()

  // Layout
  const avatarLayout = {
    wrapperCol: { offset: 0, span: 4 }
  }
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 5, span: 8 }
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
      await UserAPI.update(toUpdate)

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
      Error(errors.updateError, err)
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
    if (!goodFormat) notification.error({ message: errors.badFormat })

    const goodSize = file.size / 1024 / 1024 < 5
    if (!goodSize) notification.error({ message: errors.badSize })

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
        mutateUser({
          user: {
            ...user,
            avatar: img
          }
        })
      } catch (err) {
        Error(err.message, err)
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
    <Card title="Contact Details" className="Vertical-gutter">
      <Form
        {...layout}
        form={form}
        initialValues={{
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        }}
        onFinish={onFinish}
        name="personalForm"
      >
        <Row>
          <Col span={4}>
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
          </Col>
          <Col span={20}>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            {/* TODO : Disabled for now (add username in dB)
            <Form.Item label="User name" name="username">
              <Input disabled={true} />
            </Form.Item>
            */}
            <Form.Item label="First name" name="firstname">
              <Input />
            </Form.Item>
            <Form.Item label="Last name" name="lastname">
              <Input />
            </Form.Item>
            <Form.Item {...buttonLayout} style={{ marginBottom: 'unset' }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Apply changes
                </Button>
                <Button type="text" onClick={onCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default Information
