import { List, Typography } from 'antd'

import { IConfiguration } from '..'

export interface IProps {
  configuration: IConfiguration
}

const Variables = ({ configuration }: IProps): JSX.Element => {
  return (
    <List
      header={<Typography.Text strong>Variables list</Typography.Text>}
      itemLayout="vertical"
    >
      <List.Item>
        <Typography.Text strong>Global</Typography.Text>
        <br />
        <Typography.Text code>func appendLog(string)</Typography.Text>
        <br />
        <Typography.Text code>func appendError(string)</Typography.Text>
        <br />
        <Typography.Text code>meshN</Typography.Text>
        <br />
        <Typography.Text code>intN</Typography.Text>
        <br />
        <Typography.Text code>intN1</Typography.Text>
      </List.Item>

      {configuration.geometry && (
        <List.Item>
          <Typography.Text strong>Geometry</Typography.Text>
          <br />
          <Typography.Text code>
            meshN {configuration.geometry.name}
          </Typography.Text>
        </List.Item>
      )}

      {configuration.numericalParameters && (
        <List.Item>
          <Typography.Text strong>Numerical parameters</Typography.Text>
          <br />
          {configuration.numericalParameters.finiteElementSpace && (
            <Typography.Text code>
              fespace{' '}
              {configuration.numericalParameters.finiteElementSpace.name}
            </Typography.Text>
          )}
          <br />
          {configuration.numericalParameters.solver && (
            <Typography.Text code>func solver</Typography.Text>
          )}
        </List.Item>
      )}

      {configuration.materials && (
        <List.Item>
          <Typography.Text strong>Materials</Typography.Text>
          <br />
          {configuration.materials.children?.map((child) => (
            <Typography.Text key={child.name} code>
              func {child.name}
            </Typography.Text>
          ))}
        </List.Item>
      )}

      {configuration.parameters && (
        <List.Item>
          <Typography.Text strong>Parameters</Typography.Text>
          <br />
          {Object.keys(configuration.parameters)?.map((key) => {
            const parameter = configuration.parameters[key]
            return parameter.children.map((child) => (
              <div key={child.name}>
                <Typography.Text code>
                  real {parameter.name}
                  {child.name}
                </Typography.Text>
                <br />
              </div>
            ))
          })}
        </List.Item>
      )}
    </List>
  )
}

export default Variables
