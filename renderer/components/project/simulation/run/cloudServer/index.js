import {
  Button,
  Card,
  Form,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Typography
} from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import PluginAPI from '../../../../../../src/api/plugin'

const CloudServer = ({ visible, onCancel }) => {
  // Data
  const [plugins] = PluginAPI.usePlugins()

  return (
    <Modal
      visible={visible}
      title="Cloud server"
      onOk={() => {}}
      onCancel={onCancel}
    >
      <Space align="start" direction="horizontal">
        <Card title="Local">
          <Space>
            <Typography.Text>For desktop version only!</Typography.Text>
            <Button disabled={true} type="primary" icon={<SelectOutlined />} />
          </Space>
        </Card>
        {plugins?.map((plugin) => {
          console.log(plugin)
          return (
            <Card key={plugin.uuid} title={plugin.name}>
              <Space>
                <Space direction="vertical">
                  {plugin.configuration.name.value}
                  <Form>
                    {Object.keys(plugin.inUseConfiguration).map((key) => {
                      const item = plugin.inUseConfiguration[key]
                      console.log(item)
                      if (item.type === 'label')
                        return (
                          <div
                            dangerouslySetInnerHTML={{ __html: item.label }}
                          />
                        )
                      else if (item.type === 'number')
                        return (
                          <Form.Item htmlFor={key} label={item.label}>
                            <InputNumber id={key} defaultValue={item.default} />
                          </Form.Item>
                        )
                      else if (item.type === 'select')
                        return (
                          <Form.Item label={item.label}>
                            <Select id={key} options={item.options} />
                          </Form.Item>
                        )
                      else if (item.type === 'radio')
                        return (
                          <Form.Item label={item.label} htmlFor={key}>
                            <Radio.Group id={key}>
                              {item.options.map((o) => (
                                <Radio value={o.value}>{o.label}</Radio>
                              ))}
                            </Radio.Group>
                          </Form.Item>
                        )
                    })}
                  </Form>
                </Space>
                <Button type="primary" icon={<SelectOutlined />} />
              </Space>
            </Card>
          )
        })}
      </Space>
    </Modal>
  )
}

export default CloudServer
