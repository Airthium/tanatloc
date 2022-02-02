import { Button, List, Typography } from 'antd'
import { CodeOutlined } from '@ant-design/icons'

import { IConfiguration } from '..'

export interface IProps {
  configuration: IConfiguration
  addCode: (code: string) => void
}

const safeCode = (str) => str?.replace(/[^A-Z0-9]+/gi, '')

const Variables = ({ configuration, addCode }: IProps): JSX.Element => {
  /**
   * Append button
   * @param code Code
   * @returns Element
   */
  const appendButton = (code: string): JSX.Element => (
    <Button
      size="small"
      icon={<CodeOutlined />}
      onClick={() => addCode(code)}
    />
  )

  /**
   * Render
   */
  return (
    <List
      header={<Typography.Text strong>Variables list</Typography.Text>}
      itemLayout="vertical"
    >
      <List.Item>
        <Typography.Text strong>Global</Typography.Text>
        <br />
        {appendButton('appendLog("");')}
        <Typography.Text code>func appendLog(string)</Typography.Text>
        <br />
        {appendButton('appendError("");')}
        <Typography.Text code>func appendError(string)</Typography.Text>
        <br />
        {appendButton('meshN ')}
        <Typography.Text code>meshN</Typography.Text>
        <br />
        {appendButton('intN(' + configuration.geometry?.name + ')(\n\t\n)')}
        <Typography.Text code>intN</Typography.Text>
        <br />
        {appendButton('intN1(' + configuration.geometry?.name + ')(\n\t\n)')}
        <Typography.Text code>intN1</Typography.Text>
      </List.Item>

      {configuration.geometry && (
        <List.Item>
          <Typography.Text strong>Geometry</Typography.Text>
          <br />
          {appendButton(safeCode(configuration.geometry.name))}
          <Typography.Text code>
            meshN {safeCode(configuration.geometry.name)}
          </Typography.Text>
        </List.Item>
      )}

      {configuration.numericalParameters && (
        <List.Item>
          <Typography.Text strong>Numerical parameters</Typography.Text>
          <br />
          {configuration.numericalParameters.finiteElementSpace && (
            <>
              {appendButton(
                safeCode(
                  configuration.numericalParameters.finiteElementSpace.name
                )
              )}
              <Typography.Text code>
                fespace{' '}
                {safeCode(
                  configuration.numericalParameters.finiteElementSpace.name
                )}
              </Typography.Text>
            </>
          )}
          <br />
          {configuration.numericalParameters.solver && (
            <>
              {appendButton('solver')}
              <Typography.Text code>func solver</Typography.Text>
            </>
          )}
        </List.Item>
      )}

      {configuration.materials && (
        <List.Item>
          <Typography.Text strong>Materials</Typography.Text>
          <br />
          {configuration.materials.children?.map((child) => (
            <>
              {appendButton(safeCode(child.name))}
              <Typography.Text key={child.name} code>
                func {safeCode(child.name)}
              </Typography.Text>
            </>
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
                  real {safeCode(parameter.name)}
                  {safeCode(child.name)}
                </Typography.Text>
                <br />
              </div>
            ))
          })}
        </List.Item>
      )}

      {configuration.boundaryConditions && (
        <List.Item>
          <Typography.Text strong>Boundary conditions</Typography.Text>
          <br />
          {Object.keys(configuration.boundaryConditions)?.map((key) => {
            const boundaryCondition = configuration.boundaryConditions[key]
            return boundaryCondition?.children.map((child) => (
              <div key={child.name}>
                <Typography.Text code>
                  {safeCode(boundaryCondition.name)}
                  {safeCode(child.name)}
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
