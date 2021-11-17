import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

import { IClientPlugin } from '@/database/index.d'

import { AddButton, EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'

interface IProps {
  plugin: IClientPlugin
  swr: {
    addOnePlugin?: Function
    mutateOnePlugin?: Function
  }
  edit?: boolean
}

/**
 * Errors (dialog)
 * @memberof Components.Account.HPC.Plugin
 */
const errors = {
  update: 'Unable to update plugins'
}

/**
 * Plugin dialog
 * @memberof Components.Account.HPC.Plugin
 * @param {Object} props Props `{ plugin, swr, edit }`
 */
const PluginDialog = ({ plugin, swr, edit }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState(false)
  const [initialValues, setInitialValues] = useState({})
  const [loading, setLoading] = useState(false)

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
   * Build input item
   * @param {Object} item Item
   * @param {string} key Key
   */
  const inputItem = (
    item: { required?: boolean; label: string; props?: object },
    key: string
  ): JSX.Element => {
    return (
      <Form.Item
        key={item.label}
        name={key}
        label={item.label}
        htmlFor={'input-' + key}
        rules={[
          {
            required: item.required,
            message: "'" + item.label + "' is required"
          }
        ]}
      >
        <Input id={'input-' + key} autoComplete="off" {...(item.props || {})} />
      </Form.Item>
    )
  }

  /**
   * Build textarea item
   * @param {Object} item Item
   * @param {string} key Key
   */
  const textareaItem = (
    item: { required?: boolean; label: string; props?: object },
    key: string
  ): JSX.Element => {
    return (
      <Form.Item
        key={item.label}
        name={key}
        label={item.label}
        htmlFor={'input-' + key}
        rules={[
          {
            required: item.required,
            message: "'" + item.label + "' is required"
          }
        ]}
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
   * @param {Object} item Item
   * @param {string} key Key
   */
  const passwordItem = (
    item: { required?: boolean; label: string; props?: object },
    key: string
  ): JSX.Element => {
    return (
      <Form.Item
        key={item.label}
        name={key}
        label={item.label}
        htmlFor={'input-' + key}
        rules={[
          {
            required: item.required,
            message: "'" + item.label + "' is required"
          }
        ]}
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
   * @param {Object} item Item
   * @param {string} key Key
   */
  const selectItem = (
    item: {
      required?: boolean
      label: string
      options: string[]
      props?: object
    },
    key: string
  ): JSX.Element => {
    return (
      <Form.Item
        key={item.label}
        name={key}
        label={item.label}
        htmlFor={'select-' + key}
        rules={[
          {
            required: item.required,
            message: "'" + item.label + "' is required"
          }
        ]}
      >
        <Select id={'select-' + key}>
          {item.options.map((option) => {
            return (
              <Select.Option
                key={option}
                value={option}
                {...(item.props || {})}
              >
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
   * @param {Object} values Values
   */
  const onFinish = async (values: {}): Promise<void> => {
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
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.update, err)
      throw err
    } finally {
      setLoading(false)
    }
  }

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
        onOk={onFinish}
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
    inUseConfiguration: PropTypes.object
  }).isRequired,
  swr: PropTypes.exact({
    addOnePlugin: PropTypes.func,
    mutateOnePlugin: PropTypes.func
  }).isRequired,
  edit: PropTypes.bool
}

export default PluginDialog
