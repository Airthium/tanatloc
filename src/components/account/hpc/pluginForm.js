import { useState } from 'react'
import { Button, Form, Input, Select, Space } from 'antd'

/**
 * Plugin form
 * @param {Object} props Props
 */
const PluginForm = ({ plugin, onFinish, onCancel }) => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 8 }
  }
  const tailLayout = {
    wrapperCol: { offset: 6, span: 8 }
  }

  /**
   * Build input item
   * @param {Object} item Item
   * @param {string} key Key
   */
  const inputItem = (item, key) => {
    return (
      <Form.Item
        {...layout}
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
        {...layout}
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
        {...layout}
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
  const onFinishInternal = async (values) => {
    setLoading(true)
    try {
      await onFinish(values)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Initial values
  const initialValues = {}
  Object.keys(plugin.configuration).forEach((key) => {
    initialValues[key] = plugin.configuration[key].value
  })

  /**
   * Render
   */
  return (
    <Form
      {...layout}
      onFinish={onFinishInternal}
      initialValues={initialValues}
      autoComplete="off"
    >
      {Object.keys(plugin.configuration).map((key) => {
        const item = plugin.configuration[key]
        if (item.type === 'input') return inputItem(item, key)
        else if (item.type === 'password') return passwordItem(item, key)
        else if (item.type === 'select') return selectItem(item, key)
      })}
      <Form.Item {...tailLayout}>
        <Space>
          <Button loading={loading} type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default PluginForm
