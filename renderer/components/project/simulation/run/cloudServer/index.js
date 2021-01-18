import { Button, Card, Modal, Space, Typography } from 'antd'
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
                {plugin.configuration.name.value}
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
