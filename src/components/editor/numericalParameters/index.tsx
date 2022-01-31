import PropTypes from 'prop-types'
import { Button, Card, Form, Input, Layout, Space, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { IConfiguration } from '..'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ numericalParameters: { finiteElementSpace, solver } }) => void
}

/**
 * Numerical parameters
 * @param props Props
 */
const NumericalParameters = ({
  configuration,
  onNext
}: IProps): JSX.Element => {
  /**
   * Validator
   * @param _ Unused
   * @param value Value
   * @returns Promise
   */
  const validator = (_, value) => {
    if (!value?.length) return Promise.reject(new Error('Options are required'))
    return Promise.resolve()
  }

  /**
   * Build options
   * @param identifier Identifier
   * @returns Options
   */
  const options = (identifier: string) => (
    <Form.List name={[identifier, 'options']} rules={[{ validator }]}>
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div key={key}>
              <Form.Item
                {...restField}
                label={
                  <Space>
                    Input {name + 1}
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Space>
                }
                name={[name]}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </div>
          ))}
          <Button
            className={!fields.length && 'required'}
            onClick={() => add()}
          >
            Add options
          </Button>
          <Form.ErrorList errors={errors} />
        </>
      )}
    </Form.List>
  )

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Form
            layout="vertical"
            initialValues={configuration.numericalParameters}
            onFinish={(values) => onNext({ numericalParameters: values })}
          >
            <Typography.Text strong>Finite element space</Typography.Text>
            <br />
            <Form.Item
              name={['finiteElementSpace', 'name']}
              label="Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            {options('finiteElementSpace')}
            <Form.Item
              name={['finiteElementSpace', 'default']}
              label="Default"
              tooltip=""
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Typography.Text strong>Solver</Typography.Text>
            <br />
            {options('solver')}
            <Form.Item
              name={['solver', 'default']}
              label="Default"
              tooltip=""
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

NumericalParameters.propTypes = {
  configuration: PropTypes.shape({
    numericalParameters: PropTypes.exact({
      finiteElementSpace: PropTypes.exact({
        name: PropTypes.string,
        options: PropTypes.array,
        default: PropTypes.string
      }).isRequired,
      solver: PropTypes.exact({
        options: PropTypes.array,
        default: PropTypes.string
      }).isRequired
    })
  }).isRequired,
  onNext: PropTypes.func.isRequired
}

export default NumericalParameters
