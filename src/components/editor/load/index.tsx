import { Dispatch, useContext, useState } from 'react'
import { Button, Space, Tabs, Tooltip } from 'antd'

import Dialog from '@/components/assets/dialog'

import Models from '@/models'
import Templates from '@/templates'

import { ErrorNotification } from '@/components/assets/notification'

import { setModel, setTemplate } from '@/context/editor/actions'
import { EditorContext, IEditorAction } from '@/context/editor'
import { FolderOpenOutlined } from '@ant-design/icons'

/**
 * Errors
 */
const errors = {
  load: 'Unable to load model'
}

/**
 * Load model
 * @param key Key
 * @param dispatch Dispatch
 */
export const onLoad = async (
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
 * Load
 * @returns Load
 */
const Load = () => {
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
        <Tabs>
          <Tabs.TabPane tab="Tanatloc models">
            <Space direction="vertical" className="full-width">
              {Models.map((m, index) => (
                <Button
                  key={index}
                  onClick={async () => {
                    setLoading(true)
                    try {
                      await onLoad(index, dispatch)
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
          </Tabs.TabPane>
        </Tabs>
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
