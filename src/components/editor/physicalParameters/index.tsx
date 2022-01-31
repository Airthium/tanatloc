import PropTypes from 'prop-types'
import { Button, Card, Form, Layout } from 'antd'

import { IConfiguration } from '..'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ numericalParameters }) => void
}

const PhysicalParameters = ({ configuration, onNext }: IProps): JSX.Element => {
  return (
    <Layout>
      <Layout.Content>
        <Card size="small">
          <Form
            layout="vertical"
            initialValues={configuration.numericalParameters}
            onFinish={(values) => onNext({ numericalParameters: values })}
          >
            <Form.Item>
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

PhysicalParameters.propTypes = {
  configuration: PropTypes.shape({
    numericalParameters: PropTypes.object
  }),
  onNext: PropTypes.func.isRequired
}

export default PhysicalParameters
