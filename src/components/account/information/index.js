import PropTypes from 'prop-types'
import { useState } from 'react'
import { Avatar, Button, Card, Form, Space, Typography, Upload } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'

import {
  Success as SuccessNotification,
  Error as ErrorNotification
} from '@/components/assets/notification'

import Utils from '@/lib/utils'

import UserAPI from '@/api/user'
import AvatarAPI from '@/api/avatar'

/**
 * Errors (information)
 * @memberof Components.Account
 */
const errors = {
  update: 'Unable to update informations',
  badFormat: 'Supported format: jpg, png',
  badSize: 'Image must be smaller than 5MB'
}

/**
 * Information
 * @memberof Components.Account
 * @param {Object} props Props
 */
const Information = ({ user, swr }) => {
  // State
  const [uploading, setUploading] = useState(false)

  // Layout
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
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
   * On firstname
   * @param {string} value Value
   */
  const onFirstName = async (value) => {
    try {
      // API
      await UserAPI.update([
        {
          key: 'firstname',
          value
        }
      ])

      // Local
      swr.mutateUser({
        firstname: value
      })

      SuccessNotification('Change saved')
    } catch (err) {
      ErrorNotification(errors.update, err)
    }
  }

  /**
   * On lastname
   * @param {string} value Value
   */
  const onLastName = async (value) => {
    try {
      // API
      await UserAPI.update([
        {
          key: 'lastname',
          value
        }
      ])

      // Local
      swr.mutateUser({
        lastname: value
      })

      SuccessNotification('Change saved')
    } catch (err) {
      ErrorNotification(errors.update, err)
    }
  }

  /**
   * On email
   * @param {string} value Value
   */
  const onEmail = async (value) => {
    try {
      // Check email
      if (!Utils.validateEmail(value))
        throw new Error('Email address wrong format.')

      // API
      await UserAPI.update([
        {
          key: 'email',
          value
        }
      ])

      // Local
      swr.mutateUser({
        email: value
      })

      SuccessNotification(
        'Changes saved',
        'A validation email has been send to ' + value
      )
    } catch (err) {
      ErrorNotification(errors.update, err)
    }
  }

  /**
   * Render
   */
  return (
    <Card title="Contact Details">
      <Space direction="horizontal" className="Account">
        <Space direction="vertical">
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
            <Button size="small" icon={<UploadOutlined />} loading={uploading}>
              Upload new
            </Button>
          </Upload>
        </Space>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Form {...layout}>
            <Form.Item label="Email">
              <Typography.Text
                editable={{
                  onChange: onEmail,
                  icon: 'Modify your email'
                }}
              >
                {user.email}
              </Typography.Text>
            </Form.Item>

            <Form.Item label="First name">
              <Typography.Text editable={{ onChange: onFirstName }}>
                {user.firstname || ''}
              </Typography.Text>
            </Form.Item>

            <Form.Item label="Last name">
              <Typography.Text editable={{ onChange: onLastName }}>
                {user.lastname || ''}
              </Typography.Text>
            </Form.Item>
          </Form>
        </Space>
      </Space>
    </Card>
  )
}

Information.propTypes = {
  user: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.object
  }).isRequired,
  swr: PropTypes.shape({
    mutateUser: PropTypes.func.isRequired
  }).isRequired
}

export default Information
