import PropTypes from 'prop-types'
import { Button, Card, Form, Input, Layout, Switch } from 'antd'

import { IConfiguration } from '../'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ geometry: { meshable, name } }) => void
}

const Geometry = ({ configuration, onNext }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Form
            layout="vertical"
            initialValues={{
              meshable: configuration.geometry?.meshable || false,
              name: configuration.geometry?.name
            }}
            onFinish={(values) => onNext({ geometry: values })}
          >
            <Form.Item
              name="meshable"
              label="Meshable"
              tooltip="Enable automatic geometry meshing before FreeFEM script launch"
              valuePropName="checked"
              rules={[{ required: true }]}
            >
              <Switch checkedChildren="ON" unCheckedChildren="OFF" />
            </Form.Item>
            <Form.Item
              name="name"
              label="Mesh name"
              tooltip="Geometry variable name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

Geometry.propTypes = {
  configuration: PropTypes.shape({
    geometry: PropTypes.exact({
      meshable: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired
    })
  }).isRequired,
  onNext: PropTypes.func.isRequired
}

export default Geometry
