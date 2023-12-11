/** @module Components.Loading */

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Layout, Space, Spin, StepProps, Steps, Typography } from 'antd'
import { LoadingOutlined, WarningOutlined } from '@ant-design/icons'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Simple
 * @returns Loading.Simple
 */
const Simple: React.FunctionComponent = () => {
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
  text?: ReactNode
  status?: string[]
  errors?: string[]
}

/**
 * Loading
 * @returns Loading
 */
const Loading: React.FunctionComponent<IProps> & {
  Simple: React.FunctionComponent
} = ({ text, status, errors }) => {
  // State
  const [steps, setSteps] = useState<(StepProps & { index: number })[]>([])
  const [errorMessages, setErrorMessages] = useState<ReactNode[]>([])

  // Status
  useEffect(() => {
    if (!status?.length) {
      setSteps([])
      return
    }

    // New step
    const newSteps = status
      .map((desc, index) => {
        return {
          index: index,
          status: 'finish' as StepProps['status'],
          icon: index === 0 ? <LoadingOutlined /> : undefined,
          title: desc
        }
      })
      .filter((s) => s)

    // Update
    setSteps(newSteps)
  }, [status])

  // Errors
  useEffect(() => {
    if (!errors?.length) {
      setErrorMessages([])
      return
    }

    setErrorMessages(
      errors.map((err) => {
        let child = null
        if (
          err.includes('docker: command not found') ||
          err.includes('Is the docker daemon running')
        )
          child = (
            <Card className={style.errorCard}>
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
            <Card className={style.errorCard}>
              There is an error with your PostgreSQL installation.
              <br />
              Please verify that postgres Docker container
              &quot;tanatloc-postgres&quot; is correctly installed and running.
            </Card>
          )

        return (
          <div key={err}>
            {err}
            {child}
          </div>
        )
      })
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
          <div className={style.title}>
            {errors?.length ? (
              <>
                <WarningOutlined className="warning" />
                <Typography.Title level={3} style={{ margin: '0' }}>
                  An error occurs
                </Typography.Title>
                <Link
                  href="https://github.com/Airthium/tanatloc/issues/new/choose"
                  target="_blank"
                >
                  Open an issue
                </Link>
              </>
            ) : (
              <>
                <Spin size="large" indicator={<LoadingOutlined />} />

                {text ?? 'Loading, please wait...'}
              </>
            )}
          </div>
        }
      >
        {display ? (
          <div className={style.content}>
            {errorMessages.length ? (
              <div className={style.errors}>
                {errorMessages.map((err) => err)}
                <Typography.Title level={5}>
                  Please restart the application
                </Typography.Title>
              </div>
            ) : null}
            <div className={style.status}>
              <Steps direction="vertical" items={steps} />
            </div>
          </div>
        ) : null}
      </Card>
    </Layout>
  )
}

Loading.Simple = Simple
export default Loading
