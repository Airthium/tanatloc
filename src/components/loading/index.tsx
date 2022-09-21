/** @module Components.Loading */

import { WarningOutlined } from '@ant-design/icons'
import { Card, Layout, Space, Spin, Steps, Typography } from 'antd'

/**
 * Simple
 * @returns Loading.Simple
 */
const Simple = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Space
      style={{
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card>
        <Space>
          <Spin />
          Loading, please wait...
        </Space>
      </Card>
    </Space>
  )
}

export interface IProps {
  text?: string | React.ReactElement | React.ReactElement[]
  status?: string[]
  errors?: string[]
}

/**
 * Loading
 * @returns Loading
 */
const Loading = ({ text, status, errors }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout className="tanatloc-gradient">
      <div className="logo">
        <img src="/images/logo.svg" alt="Tanatloc" />
      </div>
      <Card
        className="Loading"
        bodyStyle={
          !status?.length && !errors?.length
            ? {
                padding: 0
              }
            : undefined
        }
        title={
          <Space>
            {errors?.length ? (
              <>
                <WarningOutlined style={{ fontSize: '32px', color: 'red' }} />
                <Typography.Title level={3} className="no-margin">
                  An error occurs
                </Typography.Title>
              </>
            ) : (
              <>
                <Spin size="large" />

                {text ?? 'Loading, please wait...'}
              </>
            )}
          </Space>
        }
      >
        {errors?.length ? (
          <div className="Loading-errors">
            {errors.map((err, index) => {
              let child = null
              if (
                err.includes('docker: command not found') ||
                err.includes('Is the docker daemon running')
              )
                child = (
                  <Card>
                    There is an error with your Docker installation.
                    <br />
                    Please verify that Docker is correctly installed and
                    running.
                  </Card>
                )
              else if (
                err.includes('EHOSTUNREACH') ||
                err.includes('ENETUNREACH') ||
                err.includes('ETIMEOUT')
              )
                child = (
                  <Card>
                    There is an error with your PostgreSQL installation.
                    <br />
                    Please verify that postgres Docker container
                    &quot;tanatloc-postgres&quot; is correctly installed and
                    running.
                  </Card>
                )

              return (
                <div key={index}>
                  {err}
                  {child}
                </div>
              )
            })}
            <Typography.Title level={5} style={{ color: 'red' }}>
              Please restart the application
            </Typography.Title>
          </div>
        ) : null}
        {status?.length ? (
          <div className="Loading-status">
            <Steps direction="vertical">
              {status.map((desc, index) => (
                <Steps.Step
                  key={index}
                  status={
                    index === status.length - 1
                      ? errors?.length
                        ? 'error'
                        : 'process'
                      : 'finish'
                  }
                  title={desc}
                />
              ))}
            </Steps>
          </div>
        ) : null}
      </Card>
    </Layout>
  )
}

Loading.Simple = Simple
export default Loading
