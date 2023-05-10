/** @module Components.Editor.Browser */

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react'
import { Button, Space, Tabs, Tooltip } from 'antd'
import { FileSearchOutlined, FileTextOutlined } from '@ant-design/icons'

import { IFrontMutateUser, IFrontUser } from '@/api/index.d'
import { IModel } from '@/models/index.d'

import { setModel, setTemplate } from '@/context/editor/actions'
import { EditorContext, IEditorAction } from '@/context/editor'

import Models from '@/models'
import Templates from '@/templates'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import Delete from '../delete'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'models' | 'templates'>
  swr: {
    mutateUser: (user: Partial<IFrontMutateUser>) => Promise<void>
  }
}

export interface ITanatlocModelProps {
  model: IModel
  setLoading: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
  dispatch: Dispatch<IEditorAction>
}

export interface IUserModelProps {
  user: Pick<IFrontUser, 'id' | 'models' | 'templates'>
  index: number
  swr: {
    mutateUser: (user: Partial<IFrontMutateUser>) => Promise<void>
  }
  setLoading: Dispatch<SetStateAction<boolean>>
  setVisible: Dispatch<SetStateAction<boolean>>
  dispatch: Dispatch<IEditorAction>
}

/**
 * Errors
 */
export const errors = {
  load: 'Unable to load current model'
}

/**
 * Load tanatloc model
 * @param key Key
 * @param dispatch Dispatch
 */
export const _onTanatlocLoad = async (
  model: IModel,
  dispatch: Dispatch<IEditorAction>
): Promise<void> => {
  try {
    // Model
    dispatch(setModel(JSON.stringify(model, null, '\t')))

    // Template
    const modelKey = model.algorithm
    const templateFile = Templates[modelKey as keyof typeof Templates]
    const res = await fetch('/templates/' + templateFile)
    const text = await res.text()
    dispatch(setTemplate(text))
  } catch (err: any) {
    ErrorNotification(errors.load, err)
  }
}

/**
 * Load personal model
 * @param model Model
 * @param template Template
 * @param dispatch Dispatch
 */
export const _onMyLoad = async (
  model: IModel,
  template: string,
  dispatch: Dispatch<IEditorAction>
): Promise<void> => {
  try {
    model.user && delete model.user
    dispatch(setModel(JSON.stringify(model, null, '\t')))
    dispatch(setTemplate(template))
  } catch (err: any) {
    ErrorNotification(errors.load, err)
  }
}

/**
 * Tanatloc model
 * @param props Props
 * @returns TanatlocModel
 */
const TanatlocModel = ({
  model,
  setLoading,
  setVisible,
  dispatch
}: ITanatlocModelProps): React.JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        await _onTanatlocLoad(model, dispatch)
      } finally {
        setLoading(false)
        setVisible(false)
      }
    })()
  }, [model, setLoading, setVisible, dispatch])

  /**
   * Render
   */
  return (
    <div
      className={globalStyle.displayFlex}
      style={{
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      {model.name}
      <Tooltip title="Open">
        <Button onClick={onClick} icon={<FileTextOutlined />} />
      </Tooltip>
    </div>
  )
}

const UserModel = ({
  user,
  index,
  swr,
  setLoading,
  setVisible,
  dispatch
}: IUserModelProps): React.JSX.Element => {
  // Data
  const model = useMemo(() => user.models[index], [user, index])
  const template = useMemo(() => user.templates[index], [user, index])

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    ;(async () => {
      setLoading(true)
      try {
        await _onMyLoad(model, template, dispatch)
      } finally {
        setLoading(false)
        setVisible(false)
      }
    })()
  }, [model, template, setLoading, setVisible, dispatch])

  /**
   * Render
   */
  return (
    <div
      className={globalStyle.displayFlex}
      style={{
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      {model.name}
      <div>
        <Tooltip title="Open">
          <Button onClick={onClick} icon={<FileTextOutlined />} />
        </Tooltip>
        <Delete user={user} index={index} swr={swr} />
      </div>
    </div>
  )
}

/**
 * Load
 * @param props Props
 * @returns Load
 */
const Browser = ({ user, swr }: IProps): React.JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const { dispatch } = useContext(EditorContext)

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  // Tanatloc models
  const tanatlocModels = useMemo(
    () =>
      Models.map((m) => (
        <TanatlocModel
          key={m.algorithm}
          model={m}
          setLoading={setLoading}
          setVisible={setVisible}
          dispatch={dispatch}
        />
      )),
    [dispatch]
  )

  // User models
  const userModels = useMemo(
    () =>
      user.models.map((model, index) => (
        <UserModel
          key={model.algorithm}
          user={user}
          index={index}
          swr={swr}
          setLoading={setLoading}
          setVisible={setVisible}
          dispatch={dispatch}
        />
      )),
    [user, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Models browser"
        visible={visible}
        loading={loading}
        onCancel={setVisibleFalse}
      >
        <Tabs
          items={[
            {
              key: 'models',
              label: 'Tanatloc models',
              children: (
                <Space direction="vertical" className={globalStyle.fullWidth}>
                  {tanatlocModels}
                </Space>
              )
            },
            {
              key: 'personalModels',
              label: 'My models',
              children: (
                <Space direction="vertical" className={globalStyle.fullWidth}>
                  {userModels}
                </Space>
              )
            }
          ]}
        />
      </Dialog>
      <Tooltip title="Browse existing models">
        <Button
          icon={<FileSearchOutlined />}
          onClick={setVisibleTrue}
          id="browser"
        />
      </Tooltip>
    </>
  )
}

export default Browser
