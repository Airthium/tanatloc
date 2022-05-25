/** @module Components.Error */

import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { Layout, Typography } from 'antd'

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
function Error({ webStatusCode }: IProps): JSX.Element {
  // Data
  const router = useRouter()

  const urlParams: URLSearchParams = new URLSearchParams(window.location.search)
  const electronStatusCode = urlParams.get('statusCode')

  // Render
  let render = <></>
  if (electronStatusCode) {
    render = (
      <>
        <Typography.Title level={1}>
          {electronStatusCode === '100' &&
            'An error occurred while installing the application'}
          {electronStatusCode === '200' &&
            'An error occurred while loading the database'}
        </Typography.Title>
        <Typography.Title level={2} underline={true}>
          Please, try to run the application again
        </Typography.Title>
      </>
    )
  } else if (webStatusCode) {
    render = (
      <>
        <Typography.Title level={1}>{webStatusCode}</Typography.Title>
        <Typography.Title level={1}>
          An error occurred on the server
        </Typography.Title>
        <Typography.Title
          level={2}
          underline={true}
          onClick={() => router.reload()}
        >
          Please, refresh the page
        </Typography.Title>
      </>
    )
  } else {
    render = (
      <>
        <Typography.Title level={1}>An error occurred</Typography.Title>
        <Typography.Title
          level={2}
          underline={true}
          onClick={() => router.reload()}
        >
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
      <Layout.Content className="NotFound">{render}</Layout.Content>
    </Layout>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  if (res) return { webStatusCode: res.statusCode }
  else if (err) return { webStatusCode: err.statusCode }
  else return { webStatusCode: 404 }
}

export default Error
