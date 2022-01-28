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
            <Typography.Text code>func {child.name}</Typography.Text>
          ))}
        </List.Item>
      )}
    </List>
  )
}

export default Variables
