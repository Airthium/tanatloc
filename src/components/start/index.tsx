/** @module Components.Start */

import { Typography } from 'antd'
import { useRouter } from 'next/router'

import Loading from '../loading'

/**
 * Start
 * @returns Start
 */
const Start = () => {
  //Data
  const router = useRouter()
  const { status, err }: { status?: string; err?: string } = router.query

  /**
   * Render
   */
  return (
    <>
      <Loading
        text={
          <Typography.Title level={3} className="no-margin">
            Tanatloc is starting, please wait...
          </Typography.Title>
        }
        description={status?.length ? status?.split(';') : []}
        errors={err?.length ? err?.split(';') : []}
      />
    </>
  )
}

export default Start
