import { useContext, useState } from 'react'
import { Button, Modal } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import { IModel } from '@/models/index.d'
import { IFrontUser } from '@/api/index.d'

import { EditorContext } from '@/context/editor'

import { ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'models'>
}

/**
 * Errors
 */
const errors = {
  check: 'Unable to check',
  save: 'Unable to save'
}

/**
 * On save
 * @param model Model
 * @param template Template
 */
const onSave = async (
  user: Pick<IFrontUser, 'id' | 'models'>,
  model: IModel,
  template: string
): Promise<void> => {
  try {
    // Check existing model
    const existing = user.models.find((m) => m.algorithm === model.algorithm)
    if (!existing) {
      Modal.confirm({
        title:
          'A model with the same algorithm entry already exists. Do you want to override it?',
        onOk: async () => {
          // // API
          // await UserAPI.update([
          //   {
          //     key: 'models',
          //     type: 'array',
          //     method: 'append',
          //     value: model
          //   },
          //   {
          //     key: 'templates',
          //     type: 'array',
          //     method: 'append',
          //     value: template
          //   }
          // ])
        }
      })
    }
  } catch (err) {
    ErrorNotification(errors.save, err)
  }
}

const Save = ({ user }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const { model, template } = useContext(EditorContext)

  /**
   * Render
   */
  return (
    <Button
      loading={loading}
      icon={<SaveOutlined />}
      onClick={async () => {
        setLoading(true)
        await onSave(user, model, template)
        setLoading(false)
      }}
    />
  )
}

export default Save
