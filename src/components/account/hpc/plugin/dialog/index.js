import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { v4 as uuid } from 'uuid'

import { AddButton, EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginAPI from '@/api/plugin'

/**
 * Errors hpc/plugin
 * @memberof module:components/account
 */
const errors = {
  update: 'Unable to update plugins'
}

/**
 * Plugin dialog
 * @param {Object} props Props
 */
const PluginDialog = ({ plugin, swr, edit }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [initialValues, setInitialValues] = useState()
  const [loading, setLoading] = useState(false)

  // Initial values
  useEffect(() => {
    const currentInitialValues = {}
    Object.keys(plugin.configuration).forEach((key) => {
      currentInitialValues[key] = plugin.configuration[key].value
    })
    setInitialValues(currentInitialValues)
  }, [plugin?.configuration])

  /**
   * Build input item
   * @param {Object} item Item
   * @param {string} key Key
   */
  const inputItem = (item, key) => {
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
        <Input id={'input-' + key} autoComplete="off" />
      </Form.Item>
    )
  }

  /**
   * Build password item
   * @param {Object} item Item
   * @param {string} key Key
   */
  const passwordItem = (item, key) => {
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
        <Input id={'input-' + key} type="password" autoComplete="off" />
      </Form.Item>
    )
  }

  /**
   * Build select item
   * @param {Object} item Item
   * @param {string} key Key
   */
  const selectItem = (item, key) => {
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
              <Select.Option key={option} value={option}>
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
  const onFinish = async (values) => {
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

        // Remove logo
        newPlugin.logo && delete newPlugin.logo

        // Remove renderer
        newPlugin.renderer && delete newPlugin.renderer

        // Set uuid
        newPlugin.uuid = uuid()

        // API
        await PluginAPI.add(newPlugin)

        // Local
        swr.addOnePlugin(newPlugin)
      }

      // Finish
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.update, err)
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
    name: PropTypes.string.isRequired,
    configuration: PropTypes.object.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    addOnePlugin: PropTypes.func,
    mutateOnePlugin: PropTypes.func
  }).isRequired,
  edit: PropTypes.bool
}

export default PluginDialog
