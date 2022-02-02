import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Layout,
  Select,
  Typography
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

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
  const [finiteElementSpaceOptions, setFiniteElementSpaceOptions]: [
    { label: string; value: string }[],
    Function
  ] = useState([])
  const [FELabel, setFELabel]: [string, Function] = useState()
  const [FEValue, setFEValue]: [string, Function] = useState()

  const [solverOptions, setSolverOptions]: [
    { label: string; value: string }[],
    Function
  ] = useState([])
  const [solverValue, setSolverValue]: [string, Function] = useState()

  // Options
  useEffect(() => {
    if (configuration.numericalParameters) {
      setFiniteElementSpaceOptions(
        configuration.numericalParameters.finiteElementSpace.options
      )
      setSolverOptions(configuration.numericalParameters.solver.options)
    }
  }, [configuration])

  /**
   * On finite element space option add
   */
  const onFEOptionAdd = (): void => {
    setFiniteElementSpaceOptions([
      ...finiteElementSpaceOptions,
      { label: FELabel, value: FEValue }
    ])

    setFELabel()
    setFEValue()
  }

  /**
   * On finite element space option remove
   * @param option Option
   */
  const onFEOptionDelete = (option: { label: string; value: string }): void => {
    const index = finiteElementSpaceOptions.findIndex(
      (o) => o.label === option.label
    )
    setFiniteElementSpaceOptions([
      ...finiteElementSpaceOptions.slice(0, index),
      ...finiteElementSpaceOptions.slice(index + 1)
    ])
  }

  /**
   * On solver option add
   */
  const onSolverOptionAdd = (): void => {
    setSolverOptions([
      ...solverOptions,
      { label: solverValue, value: solverValue }
    ])

    setSolverValue()
  }

  /**
   * On solver option remove
   * @param option Option
   */
  const onSolverOptionDelete = (option: { label: string; value: string }) => {
    const index = solverOptions.findIndex((s) => s === option)
    setSolverOptions([
      ...solverOptions.slice(0, index),
      ...solverOptions.slice(index + 1)
    ])
  }

  const onFinish = (values) => {
    console.log(values)

    const numericalParameters = {
      finiteElementSpace: {
        name: values.finiteElementSpace.name,
        default: values.finiteElementSpace.options,
        options: finiteElementSpaceOptions
      },
      solver: {
        default: values.solver.options,
        options: solverOptions
      }
    }

    onNext({ numericalParameters })
  }

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
            onFinish={onFinish}
          >
            <Typography.Text strong>Finite element space</Typography.Text>
            <br />
            <Form.Item
              name={['finiteElementSpace', 'name']}
              label="Name"
              tooltip="Finite element space name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Options"
              name={['finiteElementSpace', 'options']}
              tooltip="Finite element space options. The default finite element space will be the selected option"
              rules={[{ required: true }]}
            >
              <Select
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        justifyContent: 'flex-end',
                        paddingRight: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Input
                          value={FELabel}
                          placeholder="Label"
                          onChange={(e) => setFELabel(e.target.value)}
                        />
                        <Input
                          value={FEValue}
                          placeholder="Value"
                          onChange={(e) => setFEValue(e.target.value)}
                        />
                      </div>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onFEOptionAdd}
                      />
                    </div>
                  </>
                )}
                optionLabelProp="label"
              >
                {finiteElementSpaceOptions.map((option) => (
                  <Select.Option
                    key={option.label}
                    value={option.value}
                    label={option.label}
                  >
                    <div>
                      {option.label}{' '}
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => onFEOptionDelete(option)}
                      />
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="unknownFunction"
              label="Unknown function"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="testFunction" label="Test function">
              <Input />
            </Form.Item>
            <Typography.Text strong>Solver</Typography.Text>
            <br />
            <Form.Item
              label="Options"
              name={['solver', 'options']}
              tooltip="Solver options. The default solver will be the selected option"
              rules={[{ required: true }]}
            >
              <Select
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        justifyContent: 'flex-end',
                        paddingRight: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Input
                          value={solverValue}
                          placeholder="Solver"
                          onChange={(e) => setSolverValue(e.target.value)}
                        />
                      </div>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onSolverOptionAdd}
                      />
                    </div>
                  </>
                )}
                optionLabelProp="label"
              >
                {solverOptions.map((option) => (
                  <Select.Option
                    key={option.label}
                    value={option.value}
                    label={option.label}
                  >
                    <div>
                      {option.label}{' '}
                      <Button
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => onSolverOptionDelete(option)}
                      />
                    </div>
                  </Select.Option>
                ))}
              </Select>
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
