/** @module Components.Account.Information */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Avatar, Button, Card, Form, Space, Typography, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'

import { IUserWithData } from '@/lib/index.d'

import {
  Success as SuccessNotification,
  Error as ErrorNotification
} from '@/components/assets/notification'

import Utils from '@/lib/utils'

import UserAPI from '@/api/user'
import AvatarAPI from '@/api/avatar'

export interface IProps {
  user: IUserWithData
  swr: {
    mutateUser: (user: IUserWithData) => void
  }
}

/**
 * Errors
 */
const errors = {
  update: 'Unable to update informations',
  badFormat: 'Supported format: jpg, png',
  badSize: 'Image must be smaller than 5MB'
}

/**
 * Information
 * @param props Props
 *
 * @category Components.Account
 */
const Information = ({ user, swr }: IProps): JSX.Element => {
  // State
  const [uploading, setUploading]: [boolean, Function] = useState(false)

  // Layout
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }

  /**
   * Before upload
   * @param file File
   */
  const beforeUpload = (file: { type: string; size: number }): boolean => {
    const goodFormat = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!goodFormat) ErrorNotification(errors.badFormat)

    const goodSize = file.size / 1024 / 1024 < 4
    if (!goodSize) ErrorNotification(errors.badSize)

    return goodFormat && goodSize
  }

  /**
   * On avatar change
   * @param info Info
   */
  const onChange = async (info: UploadChangeParam<any>) => {
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

        setUploading(false)
      } catch (err) {
        ErrorNotification(err.message, err)
      } finally {
        setUploading(false)
      }
    }
  }

  /**
   * Read base64 image
   * @param file File
   */
  const getBase64 = async (file: Blob): Promise<any> => {
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
   * @param value Value
   */
  const onFirstName = async (value: string): Promise<void> => {
    try {
      // Check diff
      if (user.firstname === value) return

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
   * @param value Value
   */
  const onLastName = async (value: string): Promise<void> => {
    try {
      // Check diff
      if (user.lastname === value) return

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
   * @param value Value
   */
  const onEmail = async (value: string): Promise<void> => {
    try {
      // Check diff
      if (user.email === value) return

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
      <Space direction="horizontal" className="Account-Information">
        <div>
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
            <Button icon={<UploadOutlined />} loading={uploading}>
              Upload new
            </Button>
          </Upload>
        </div>
        <div>
          <Form {...layout}>
            <Form.Item label="Email">
              <Typography.Text
                editable={{
                  onChange: onEmail
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
        </div>
      </Space>
    </Card>
  )
}

Information.propTypes = {
  user: PropTypes.exact({
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    avatar: PropTypes.object
  }).isRequired,
  swr: PropTypes.exact({
    mutateUser: PropTypes.func.isRequired
  }).isRequired
}

export default Information
