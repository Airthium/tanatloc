import { Dispatch, useContext, useState } from 'react'
import { Button, Space, Tabs, Tooltip } from 'antd'
import { FolderOpenOutlined } from '@ant-design/icons'

import { IFrontUser } from '@/api/index.d'
import { IModel } from '@/models/index.d'

import { setModel, setTemplate } from '@/context/editor/actions'
import { EditorContext, IEditorAction } from '@/context/editor'

import Models from '@/models'
import Templates from '@/templates'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'models' | 'templates'>
}

/**
 * Errors
 */
export const errors = {
  load: 'Unable to load model'
}

/**
 * Load tanatloc model
 * @param key Key
 * @param dispatch Dispatch
 */
export const onTanatlocLoad = async (
  key: number,
  dispatch: Dispatch<IEditorAction>
): Promise<void> => {
  try {
    // Model
    const currentModel = Models[key]
    dispatch(setModel(JSON.stringify(currentModel, null, '\t')))

    // Template
    const modelKey = currentModel.algorithm
    const templateFile = Templates[modelKey as keyof typeof Templates]
    const res = await fetch('/templates/' + templateFile)
    const text = await res.text()
    dispatch(setTemplate(text))
  } catch (err) {
    ErrorNotification(errors.load, err)
  }
}

/**
 * Load personal model
 * @param model Model
 * @param template Template
 * @param dispatch Dispatch
 */
export const onMyLoad = async (
  model: IModel,
  template: string,
  dispatch: Dispatch<IEditorAction>
): Promise<void> => {
  try {
    dispatch(setModel(JSON.stringify(model, null, '\t')))
    dispatch(setTemplate(template))
  } catch (err) {
    ErrorNotification(errors.load, err)
  }
}

/**
 * Load
 * @param props Props
 * @returns Load
 */
const Load = ({ user }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const { dispatch } = useContext(EditorContext)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Open model"
        visible={visible}
        loading={loading}
        onCancel={() => setVisible(false)}
      >
        <Tabs
          items={[
            {
              key: 'models',
              label: 'Tanatloc models',
              children: (
                <Space direction="vertical" className="full-width">
                  {Models.map((m, index) => (
                    <Button
                      key={index}
                      onClick={async () => {
                        setLoading(true)
                        try {
                          await onTanatlocLoad(index, dispatch)
                        } finally {
                          setLoading(false)
                          setVisible(false)
                        }
                      }}
                      className="full-width"
                    >
                      {m.name}
                    </Button>
                  ))}
                </Space>
              )
            },
            {
              key: 'personalModels',
              label: 'My models',
              children: (
                <Space direction="vertical" className="full-width">
                  {user.models.map((m, index) => (
                    <Button
                      key={index}
                      onClick={async () => {
                        setLoading(true)
                        try {
                          await onMyLoad(m, user.templates[index], dispatch)
                        } finally {
                          setLoading(false)
                          setVisible(false)
                        }
                      }}
                      className="full-width"
                    >
                      {m.name}
                    </Button>
                  ))}
                </Space>
              )
            }
          ]}
        />
      </Dialog>
      <Tooltip title="Open model">
        <Button
          icon={<FolderOpenOutlined />}
          onClick={() => setVisible(true)}
        />
      </Tooltip>
    </>
  )
}

export default Load
