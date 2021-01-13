import { Button, Card, Form, Input, Select } from 'antd'
import Plugins from '../../../../plugin'

/**
 * HPC plugins
 */
const HPC = () => {
  const HPCPlugins = Object.keys(Plugins)
    .map((key) => {
      const plugin = Plugins[key]
      if (plugin.category === 'HPC') return plugin
    })
    .filter((p) => p)

  const passwordItem = (item, key) => {
    return (
      <Form.Item
        key={item.label}
        name={item.label}
        label={item.label}
        htmlFor={'input-' + key}
        rules={[{ required: true }]}
      >
        <Input id={'input-' + key} type="password" />
      </Form.Item>
    )
  }

  const selectItem = (item, key) => {
    return (
      <Form.Item
        key={item.label}
        name={item.label}
        label={item.label}
        htmlFor={'select-' + key}
        rules={[{ required: true }]}
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

  const plugins = HPCPlugins.map((plugin) => {
    return (
      <Card key={plugin.name} title={plugin.name}>
        <div dangerouslySetInnerHTML={{ __html: plugin.description }} />

        {plugin.configuration && (
          <Form onFinish={(values) => console.log(values)}>
            {Object.keys(plugin.configuration).map((key) => {
              const item = plugin.configuration[key]
              if (item.type === 'password') return passwordItem(item, key)
              else if (item.type === 'select') return selectItem(item, key)
            })}
            <Form.Item>
              <Button htmlType="submit">Save</Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    )
  })

  return <>{plugins}</>
}

export default HPC
