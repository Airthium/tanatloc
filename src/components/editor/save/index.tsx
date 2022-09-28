import { useContext, useState } from 'react'
import { Button } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

import { EditorContext } from '@/context/editor'

import UserAPI from '@/api/user'
import { ErrorNotification } from '@/components/assets/notification'

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
const onSave = async (model: string, template: string): Promise<void> => {
  try {
    // API
    await UserAPI.update([
      {
        key: 'models',
        type: 'array',
        method: 'append',
        value: model
      },
      {
        key: 'templates',
        type: 'array',
        method: 'append',
        value: template
      }
    ])
  } catch (err) {
    ErrorNotification(errors.save, err)
  }
}

const Save = (): JSX.Element => {
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
        await onSave(model, template)
        setLoading(false)
      }}
    />
  )
}

export default Save
