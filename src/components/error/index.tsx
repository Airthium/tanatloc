/** @module Components.Error */

import { ReactNode, useCallback } from 'react'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { Layout, Typography } from 'antd'

import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  webStatusCode?: number
}

/**
 * Error page
 * @param props Props
 * @return Error
 */
const ErrorPage = ({ webStatusCode }: Readonly<IProps>): ReactNode => {
  // Data
  const router = useRouter()
  const {
    electronStatusCode,
    err
  }: { electronStatusCode?: string; err?: string } = router.query

  /**
   * Reload
   */
  const reload = useCallback((): void => router.reload(), [router])

  // Render
  let render: ReactNode
  if (electronStatusCode) {
    if (electronStatusCode === '100')
      render = (
        <>
          <Typography.Title level={3}>
            An error occurred while installing the application
          </Typography.Title>
          <Typography.Text code>Error: {err}</Typography.Text>
          <br />
          <Typography.Text>
            Please, check the database and the storage folders and try to run
            the application again
          </Typography.Text>
        </>
      )
    else
      render = (
        <>
          <Typography.Title level={3}>
            An error occurred while loading the database
          </Typography.Title>
          <Typography.Text code>Error: {err}</Typography.Text>
          <br />
          <Typography.Text>
            Please, check the database and try to run the application again
          </Typography.Text>
        </>
      )
  } else if (webStatusCode) {
    render = (
      <>
        <Typography.Title level={1}>{webStatusCode}</Typography.Title>
        <Typography.Title level={1}>
          An error occurred on the server
        </Typography.Title>
        <Typography.Title level={2} underline={true} onClick={reload}>
          Please, refresh the page
        </Typography.Title>
      </>
    )
  } else {
    render = (
      <>
        <Typography.Title level={1}>An error occurred</Typography.Title>
        <Typography.Title level={2} underline={true} onClick={reload}>
          Please, refresh the page
        </Typography.Title>
      </>
    )
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content className={style.error}>{render}</Layout.Content>
    </Layout>
  )
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  if (res) return { webStatusCode: res.statusCode }
  else if (err) return { webStatusCode: err.statusCode }
  else return { webStatusCode: 404 }
}

export default ErrorPage
