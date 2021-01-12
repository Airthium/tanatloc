import { Button, Card, Form, Input } from 'antd'
import Plugins from '../../../../plugin'
console.log(Plugins)
const HPC = () => {
  return (
    <>
      {Object.keys(Plugins).map((pluginKey) => {
        const plugin = Plugins[pluginKey]
        if (plugin.category !== 'HPC') return
        return (
          <Card key={plugin.name} title={plugin.name}>
            <div dangerouslySetInnerHTML={{ __html: plugin.description }} />
            {Object.keys(plugin.configuration).map((configurationKey) => {
              const item = plugin.configuration[configurationKey]
              if (item.type === 'password')
                return (
                  <Form onFinish={(values) => console.log(values)}>
                    <Form.Item
                      name={item.label}
                      label={item.label}
                      htmlFor={'input-' + configurationKey}
                      rules={[{ required: true }]}
                    >
                      <Input id={'input-' + configurationKey} type="password" />
                    </Form.Item>
                    <Form.Item>
                      <Button htmlType="submit">Save</Button>
                    </Form.Item>
                  </Form>
                )
            })}
          </Card>
        )
      })}
    </>
  )
}

export default HPC
