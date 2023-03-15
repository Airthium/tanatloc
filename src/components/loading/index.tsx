/** @module Components.Loading */

import { useEffect, useRef, useState } from 'react'
import { Card, Layout, Space, Spin, Steps, Typography } from 'antd'
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

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

    setStatusDisplay(
      <div className={style.status}>
        <Steps
          direction="vertical"
          items={status
            .map((desc, index) => ({
              key: index,
              status: 'finish' as 'finish',
              icon:
                index === status.length - 1 ? <LoadingOutlined /> : undefined,
              title: desc
            }))
            .reverse()}
        />
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
      <div className={style.errors}>
        {errors.map((err) => {
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
            <div key={err}>
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
    <Layout>
      <div className={globalStyle.logo}>
        <img src="/images/logo.svg" alt="Tanatloc" />
      </div>
      <Card
        className={style.loading}
        bodyStyle={{ padding: 0 }}
        title={
          <Space>
            {errors?.length ? (
              <>
                <WarningOutlined style={{ fontSize: '32px', color: 'red' }} />
                <Typography.Title level={3} style={{ margin: '0' }}>
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
                <Spin size="large" indicator={<LoadingOutlined />} />

                {text ?? 'Loading, please wait...'}
              </>
            )}
          </Space>
        }
      >
        {display ? (
          <div ref={contentRef} className={style.content}>
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
