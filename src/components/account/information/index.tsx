/** @module Components.Account.Information */

import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Space,
  Typography,
  Upload
} from 'antd'
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
  const [localEmail, setLocalEmail]: [string, Function] = useState(user.email)
  const [localFirstname, setLocalFirstname]: [string, Function] = useState(
    user.firstname || ''
  )
  const [localLastname, setLocalLastname]: [string, Function] = useState(
    user.lastname || ''
  )

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

      SuccessNotification('New firstname saved')
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

      SuccessNotification('New lastname saved')
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

  const onSubmit = (e) => {
    e.preventDefault()
    onEmail(localEmail)
    onFirstName(localFirstname)
    onLastName(localLastname)
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
            <Form.Item
              label="Email"
              initialValue={user.email}
              wrapperCol={{ span: 6 }}
            >
              <Input
                defaultValue={user.email}
                maxLength={50}
                onChange={(e) => setLocalEmail(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="First name"
              initialValue={user.firstname || ''}
              wrapperCol={{ span: 6 }}
            >
              <Input
                defaultValue={user.firstname || ''}
                maxLength={50}
                onChange={(e) => setLocalFirstname(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Last name"
              initialValue={user.lastname || ''}
              wrapperCol={{ span: 6 }}
            >
              <Input
                defaultValue={user.lastname || ''}
                maxLength={50}
                onChange={(e) => setLocalLastname(e.target.value)}
              />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={(e) => onSubmit(e)}
              >
                Save changes
              </Button>
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
