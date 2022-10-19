/** @module Components.Loading */

import { useEffect, useRef, useState } from 'react'
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

  // State
  const [statusDisplay, setStatusDisplay] = useState<JSX.Element>()
  const [errorsDisplay, setErrorsDisplay] = useState<JSX.Element>()

  // Status
  useEffect(() => {
    if (!status?.length) {
      setStatusDisplay(undefined)
      return
    }

    const currentStatus = errors?.length ? 'error' : 'process'

    setStatusDisplay(
      <div className="Loading-status">
        <Steps direction="vertical">
          {status
            .map((desc, index) => (
              <Steps.Step
                key={index}
                status={index === status.length - 1 ? currentStatus : 'finish'}
                title={desc}
              />
            ))
            .reverse()}
        </Steps>
      </div>
    )
  }, [status, errors])

  // Errors
  useEffect(() => {
    if (!errors?.length) {
      setErrorsDisplay(undefined)
      return
    }

    setErrorsDisplay(
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
                Please verify that Docker is correctly installed and running.
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
    )
  }, [errors])

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
                <a
                  href="https://github.com/Airthium/tanatloc/issues/new/choose"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open an issue
                </a>
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
            {errorsDisplay}
            {statusDisplay}
          </div>
        ) : null}
      </Card>
    </Layout>
  )
}

Loading.Simple = Simple
export default Loading
