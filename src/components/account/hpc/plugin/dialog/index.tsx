/** @module Components.Account.HPC.Plugin.Dialog */

import {
  useState,
  useEffect,
  useRef,
  RefObject,
  useCallback,
  useMemo
} from 'react'
import { Form, Input, InputRef, Select, Typography } from 'antd'
import parse from 'html-react-parser'

import { IClientPlugin } from '@/plugins/index.d'

import { AddButton, EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import PluginAPI from '@/api/plugin'

/**
 * Props
 */
export interface IProps {
  plugin: IClientPlugin
  swr: {
    addOnePlugin?: (plugin: IClientPlugin) => void
    mutateOnePlugin?: (plugin: IClientPlugin) => void
  }
  edit?: boolean
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update plugins'
}

/**
 * Build input item
 * @param item Item
 * @param key Key
 */
export const _inputItem = (
  item: IClientPlugin['configuration']['key'],
  key: string,
  inputRef?: RefObject<InputRef>
): React.ReactElement => {
  return (
    <Form.Item
      key={key}
      name={key}
      label={item.label}
      htmlFor={'input-' + key}
      tooltip={item.tooltip}
      rules={item.rules}
    >
      <Input
        ref={inputRef}
        id={'input-' + key}
        autoComplete="off"
        {...(item.props ?? {})}
      />
    </Form.Item>
  )
}

/**
 * Build textarea item
 * @param item Item
 * @param key Key
 */
export const _textareaItem = (
  item: IClientPlugin['configuration']['key'],
  key: string
): React.ReactElement => {
  return (
    <Form.Item
      key={key}
      name={key}
      label={item.label}
      htmlFor={'input-' + key}
      tooltip={item.tooltip}
      rules={item.rules}
    >
      <Input.TextArea
        id={'input-' + key}
        autoComplete="off"
        {...(item.props ?? {})}
      />
    </Form.Item>
  )
}

/**
 * Build password item
 * @param item Item
 * @param key Key
 */
export const _passwordItem = (
  item: IClientPlugin['configuration']['key'],
  key: string
): React.ReactElement => {
  return (
    <Form.Item
      key={key}
      name={key}
      label={item.label}
      htmlFor={'input-' + key}
      tooltip={item.tooltip}
      rules={item.rules}
    >
      <Input
        id={'input-' + key}
        type="password"
        autoComplete="off"
        {...(item.props ?? {})}
      />
    </Form.Item>
  )
}

/**
 * Build select item
 * @param item Item
 * @param key Key
 */
export const _selectItem = (
  item: IClientPlugin['configuration']['key'],
  key: string
): React.ReactElement => {
  return (
    <Form.Item
      key={key}
      name={key}
      label={item.label}
      htmlFor={'select-' + key}
      tooltip={item.tooltip}
      rules={item.rules}
    >
      <Select id={'select-' + key}>
        {item.options.map((option: string[]) => (
          <Select.Option key={option} value={option} {...(item.props ?? {})}>
            {option}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  )
}

/**
 * On finish
 * @param plugin Plugin
 * @param edit Edit
 * @param values Values
 * @param swr SWR
 */
export const _onFinish = async (
  plugin: IClientPlugin,
  edit: boolean,
  values: {},
  swr: {
    addOnePlugin?: (plugin: IClientPlugin) => void
    mutateOnePlugin?: (plugin: IClientPlugin) => void
  }
): Promise<void> => {
  try {
    if (edit) {
      const initialPlugin = Utils.deepCopy(plugin)

      // Set values
      Object.keys(values).forEach((key) => {
        initialPlugin.configuration[key].value = values[key as keyof {}]
      })

      initialPlugin.needReInit = true

      // API
      await PluginAPI.update(initialPlugin)

      // Mutate
      swr.mutateOnePlugin?.(initialPlugin)
    } else {
      // New plugin
      const newPlugin = Utils.deepCopy(plugin)
      newPlugin.uuid = 'add'

      // Set values
      Object.keys(values).forEach((key) => {
        newPlugin.configuration[key].value = values[key as keyof {}]
      })

      // API
      await PluginAPI.add(newPlugin)

      // Local
      swr.addOnePlugin?.(newPlugin)
    }
  } catch (err: any) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Plugin dialog
 * @param props Props
 * @returns PluginDialog
 */
const PluginDialog = ({ plugin, swr, edit }: IProps): JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<{}>({})

  // Initial values
  useEffect(() => {
    const currentInitialValues: any = {}
    Object.keys(plugin.configuration).forEach((key) => {
      currentInitialValues[key] =
        plugin.configuration[key].value ?? plugin.configuration[key].default
    })
    setInitialValues(currentInitialValues)
  }, [plugin?.configuration])

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => {
    setVisible(true)
  }, [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => {
    setVisible(false)
  }, [])

  /**
   * On finish
   * @param values Values
   */
  const onFinish = useCallback(
    async (values: {}): Promise<void> => {
      setLoading(true)
      try {
        await _onFinish(plugin, !!edit, values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
        throw err
      }
    },
    [plugin, swr, edit]
  )

  const dialogContent = useMemo(
    () =>
      Object.keys(plugin.configuration).map((key, index) => {
        const item = plugin.configuration[key]
        if (item.type === 'input')
          return _inputItem(item, key, index === 0 ? inputRef : undefined)
        else if (item.type === 'textarea') return _textareaItem(item, key)
        else if (item.type === 'password') return _passwordItem(item, key)
        else if (item.type === 'select') return _selectItem(item, key)
        else return <div key={key}></div>
      }),
    [plugin.configuration]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title={plugin.name}
        visible={visible}
        initialValues={initialValues}
        onCancel={setVisibleFalse}
        onOk={onFinish}
        loading={loading}
      >
        <>
          <Typography.Text>{parse(plugin.description ?? '')}</Typography.Text>
          {dialogContent}
        </>
      </Dialog>
      {edit ? (
        <EditButton onEdit={setVisibleTrue}>Edit</EditButton>
      ) : (
        <AddButton onAdd={setVisibleTrue}>
          Add a new «{plugin.name}» configuration
        </AddButton>
      )}
    </>
  )
}

export default PluginDialog
