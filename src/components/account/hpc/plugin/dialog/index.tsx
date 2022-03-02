/** @module Components.Account.HPC.Plugin.Dialog */

import PropTypes from 'prop-types'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Form, Input, Select } from 'antd'

import { IClientPlugin } from '@/database/index.d'

import { AddButton, EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

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
const errors = {
  update: 'Unable to update plugins'
}

/**
 * Build input item
 * @param item Item
 * @param key Key
 */
export const inputItem = (
  item: IClientPlugin['configuration']['key'],
  key: string
): JSX.Element => {
  return (
    <Form.Item
      key={item.label}
      name={key}
      label={item.label}
      htmlFor={'input-' + key}
      rules={item.rules}
    >
      <Input id={'input-' + key} autoComplete="off" {...(item.props || {})} />
    </Form.Item>
  )
}

/**
 * Build textarea item
 * @param item Item
 * @param key Key
 */
export const textareaItem = (
  item: IClientPlugin['configuration']['key'],
  key: string
): JSX.Element => {
  return (
    <Form.Item
      key={item.label}
      name={key}
      label={item.label}
      htmlFor={'input-' + key}
      rules={item.rules}
    >
      <Input.TextArea
        id={'input-' + key}
        autoComplete="off"
        {...(item.props || {})}
      />
    </Form.Item>
  )
}

/**
 * Build password item
 * @param item Item
 * @param key Key
 */
export const passwordItem = (
  item: IClientPlugin['configuration']['key'],
  key: string
): JSX.Element => {
  return (
    <Form.Item
      key={item.label}
      name={key}
      label={item.label}
      htmlFor={'input-' + key}
      rules={item.rules}
    >
      <Input
        id={'input-' + key}
        type="password"
        autoComplete="off"
        {...(item.props || {})}
      />
    </Form.Item>
  )
}

/**
 * Build select item
 * @param item Item
 * @param key Key
 */
export const selectItem = (
  item: IClientPlugin['configuration']['key'],
  key: string
): JSX.Element => {
  return (
    <Form.Item
      key={item.label}
      name={key}
      label={item.label}
      htmlFor={'select-' + key}
      rules={item.rules}
    >
      <Select id={'select-' + key}>
        {item.options.map((option) => {
          return (
            <Select.Option key={option} value={option} {...(item.props || {})}>
              {option}
            </Select.Option>
          )
        })}
      </Select>
    </Form.Item>
  )
}

/**
 * On finish
 * @param plugin Plugin
 * @param edit Edit
 * @param values Values
 * @param setLoading Set loading
 * @param setVisible Set visible
 * @param swr SWR
 */
export const onFinish = async (
  plugin: IClientPlugin,
  edit: boolean,
  values: object,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setVisible: Dispatch<SetStateAction<boolean>>,
  swr: {
    addOnePlugin?: (plugin: IClientPlugin) => void
    mutateOnePlugin?: (plugin: IClientPlugin) => void
  }
): Promise<void> => {
  setLoading(true)
  try {
    if (edit) {
      const initialPlugin = { ...plugin }

      // Set values
      Object.keys(values).forEach((key) => {
        initialPlugin.configuration[key].value = values[key]
      })

      initialPlugin.needReInit = true

      // API
      await PluginAPI.update(initialPlugin)

      // Mutate
      swr.mutateOnePlugin(initialPlugin)
    } else {
      // New plugin
      const newPlugin = { ...plugin }

      // Set values
      Object.keys(values).forEach((key) => {
        newPlugin.configuration[key].value = values[key]
      })

      // API
      await PluginAPI.add(newPlugin)

      // Local
      swr.addOnePlugin(newPlugin)
    }

    // Finish
    setLoading(false)
    setVisible(false)
  } catch (err) {
    ErrorNotification(errors.update, err)
    setLoading(false)
    throw err
  }
}

/**
 * Plugin dialog
 * @param props Props
 * @returns PluginDialog
 */
const PluginDialog = ({ plugin, swr, edit }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [initialValues, setInitialValues]: [
    any,
    Dispatch<SetStateAction<any>>
  ] = useState({})

  // Initial values
  useEffect(() => {
    const currentInitialValues = {}
    Object.keys(plugin.configuration).forEach((key) => {
      currentInitialValues[key] =
        plugin.configuration[key].value !== undefined
          ? plugin.configuration[key].value
          : plugin.configuration[key].default
    })
    setInitialValues(currentInitialValues)
  }, [plugin?.configuration])

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title={plugin.name}
        visible={visible}
        initialValues={initialValues}
        onCancel={() => setVisible(false)}
        onOk={async (values) =>
          onFinish(plugin, edit, values, setLoading, setVisible, swr)
        }
        loading={loading}
      >
        {Object.keys(plugin.configuration).map((key) => {
          const item = plugin.configuration[key]
          if (item.type === 'input') return inputItem(item, key)
          else if (item.type === 'textarea') return textareaItem(item, key)
          else if (item.type === 'password') return passwordItem(item, key)
          else if (item.type === 'select') return selectItem(item, key)
        })}
      </Dialog>
      {edit ? (
        <EditButton onEdit={() => setVisible(true)}>Edit</EditButton>
      ) : (
        <AddButton onAdd={() => setVisible(true)}>
          Add a new «{plugin.name}» configuration
        </AddButton>
      )}
    </>
  )
}

PluginDialog.propTypes = {
  plugin: PropTypes.exact({
    uuid: PropTypes.string,
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    needInit: PropTypes.bool,
    configuration: PropTypes.object.isRequired,
    inUseConfiguration: PropTypes.object.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    addOnePlugin: PropTypes.func,
    mutateOnePlugin: PropTypes.func
  }).isRequired,
  edit: PropTypes.bool
}

export default PluginDialog
