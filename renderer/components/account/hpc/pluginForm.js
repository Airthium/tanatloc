import { useState } from 'react'
import { Button, Form, Input, Select } from 'antd'

/**
 * Plugin form
 * @param {Object} props Props
 */
const PluginForm = ({ plugin, onFinish }) => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 }
  }
  const tailLayout = {
    wrapperCol: { offset: 2, span: 8 }
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
          { required: true, message: "'" + item.label + "' is required" }
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
          { required: true, message: "'" + item.label + "' is required" }
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
          { required: true, message: "'" + item.label + "' is required" }
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
    console.log(plugin.configuration[key])
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
        <Button loading={loading} type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

export default PluginForm
