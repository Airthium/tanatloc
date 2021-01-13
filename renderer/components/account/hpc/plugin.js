import { Form } from 'antd'

const Plugin = ({ plugin }) => {
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
        <Input id={'input-' + key} />
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
        <Input id={'input-' + key} type="password" />
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
  const onFinish = async (values) => {
    setLoading(true)

    try {
      // Set values
      Object.keys(values).forEach((key) => {
        plugin.configuration[key].value = values[key]
      })

      // Remove logo
      plugin.logo && delete plugin.logo

      // Set uuid
      plugin.uuid = uuid()

      // New plugins
      const newPlugins = [...plugins, plugin]

      // API
      await PluginAPI.update(newPlugins)

      // Mutate
      addOnePlugin(plugin)
    } catch (err) {
      message.error(errors.updateError)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...layout} onFinish={onFinish}>
      {Object.keys(plugin.configuration).map((key) => {
        const item = plugin.configuration[key]
        if (item.type === 'input') return inputItem(item, key)
        else if (item.type === 'password') return passwordItem(item, key)
        else if (item.type === 'select') return selectItem(item, key)
      })}
      <Form.Item {...tailLayout}>
        <Button loading={loading} type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Plugin
