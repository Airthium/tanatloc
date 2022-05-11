/** @module Components.Start */

import { Typography } from 'antd'
import Loading from '../loading'

const Start = () => {
  return (
    <Loading
      text={
        <Typography.Title level={3} className="no-margin">
          Tanatloc is starting, please wait...
        </Typography.Title>
      }
    />
  )
}

export default Start
