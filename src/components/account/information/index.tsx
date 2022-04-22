/** @module Components.Account.Information */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Avatar, Button, Card, Form, Input, Space, Upload } from 'antd'
import { UploadChangeParam } from 'antd/lib/upload'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'

import { LIMIT } from '@/config/string'

import {
  SuccessNotification,
  ErrorNotification,
  FormError
} from '@/components/assets/notification'

import { IFrontUser } from '@/api/index.d'
import { APIError } from '@/api/error'
import UserAPI from '@/api/user'
import AvatarAPI from '@/api/avatar'

/**
 * Props
 */
export interface IProps {
  user: Partial<IFrontUser>
  swr: {
    mutateUser: (user: Partial<IFrontUser>) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update informations',
  upload: 'Unable to upload image',
  badFormat: 'Supported format: jpg, png',
  badSize: 'Image must be smaller than 5MB'
}

/**
 * Before upload
 * @param file File
 */
export const beforeUpload = (file: { type: string; size: number }): boolean => {
  const goodFormat = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!goodFormat) ErrorNotification(errors.badFormat)

  const goodSize = file.size / 1024 / 1024 < 1
  if (!goodSize) ErrorNotification(errors.badSize)

  return goodFormat && goodSize
}

/**
 * Read base64 image
 * @param file File
 */
export const getBase64 = async (file: Blob): Promise<any> => {
  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.readAsDataURL(file)
  })
}

/**
 * On avatar change
 * @param user User
 * @param info Info
 * @param swr SWR
 */
export const onChange = async (
  user: Partial<IFrontUser>,
  info: UploadChangeParam<any>,
  swr: {
    mutateUser: (user: Partial<IFrontUser>) => void
  }
): Promise<boolean> => {
  if (info.file.status === 'uploading') {
    return true
  } else if (info.file.status === 'done') {
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
      ErrorNotification(errors.upload, err)
    }

    return false
  } else {
    return false
  }
}

/**
 * On finish
 * @param user User
 * @param values Values
 * @param swr SWR
 */
export const onFinish = async (
  user: Partial<IFrontUser>,
  values: {
    email: string
    firstname: string
    lastname: string
  },
  swr: {
    mutateUser: (user: Partial<IFrontUser>) => void
  }
): Promise<void> => {
  try {
    const toUpdate = []

    // Check email
    if (user.email !== values.email)
      toUpdate.push({
        key: 'email',
        value: values.email
      })

    // Check firstname
    if (user.firstname !== values.firstname)
      toUpdate.push({
        key: 'firstname',
        value: values.firstname
      })

    // Check lastname
    if (user.lastname !== values.lastname)
      toUpdate.push({
        key: 'lastname',
        value: values.lastname
      })

    if (!toUpdate.length) return

    await UserAPI.update(toUpdate)

    // Local
    swr.mutateUser({
      email: values.email,
      firstname: values.firstname,
      lastname: values.lastname
    })

    if (toUpdate.find((u) => u.key === 'email'))
      SuccessNotification(
        'Changes saved',
        'A validation email has been send to ' + values.email
      )
  } catch (err) {
    throw new APIError({ title: errors.update, err })
  }
}

/**
 * Information
 * @param props Props
 * @returns Information
 */
const Information = ({ user, swr }: IProps): JSX.Element => {
  // State
  const [uploading, setUploading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<APIError | null>()

  // Layout
  const layout = {
    labelCol: { span: 4 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 4 }
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
            action={'/api/noop'}
            accept={'.jpg,.png'}
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={async (info) => {
              const upload = await onChange(user, info, swr)
              setUploading(upload)
            }}
          >
            <Button loading={uploading} icon={<UploadOutlined />}>
              Upload new
            </Button>
          </Upload>
        </div>
        <div>
          <Form
            {...layout}
            className="max-width-500"
            initialValues={{
              email: user.email,
              firstname: user.firstname || '',
              lastname: user.lastname || ''
            }}
            onFinish={async (values) => {
              setLoading(true)
              try {
                await onFinish(user, values, swr)
                setFormError(null)
              } catch (err: any) {
                setFormError(err)
              } finally {
                setLoading(false)
              }
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: 'email', message: 'This is not a valid email' },
                { max: LIMIT, message: 'Max ' + LIMIT + ' characters' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="First name"
              name="firstname"
              rules={[{ max: LIMIT, message: 'Max ' + LIMIT + ' characters' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Last name"
              name="lastname"
              rules={[{ max: LIMIT, message: 'Max ' + LIMIT + ' characters' }]}
            >
              <Input />
            </Form.Item>
            <FormError error={formError} />
            <Form.Item {...buttonLayout}>
              <Button loading={loading} type="primary" htmlType="submit">
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
