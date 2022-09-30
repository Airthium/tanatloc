/** @module Components.Loading */

import { useEffect, useRef } from 'react'
import { Card, Layout, Space, Spin, Steps, Typography } from 'antd'
import { WarningOutlined } from '@ant-design/icons'

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
  // Ref
  const contentRef = useRef<HTMLDivElement>(null)

  // Data
  const lastStatus = errors?.length ? 'error' : 'process'

  // Scroll down
  useEffect(() => {
    const content = contentRef.current
    if (!content) return
    if (errors?.length) content.scrollTo({ top: 0, behavior: 'smooth' })
    else content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' })
  }, [status, errors])

  // Display
  const display = !!status?.length || !!errors?.length

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
        bodyStyle={{ padding: 0 }}
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
        {display ? (
          <div ref={contentRef} className="Loading-content">
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
                        index === status.length - 1 ? lastStatus : 'finish'
                      }
                      title={desc}
                    />
                  ))}
                </Steps>
              </div>
            ) : null}
          </div>
        ) : null}
      </Card>
    </Layout>
  )
}

Loading.Simple = Simple
export default Loading
