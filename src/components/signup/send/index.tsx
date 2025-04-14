/** @module Components.Signup.Send */

import { Card, Layout } from 'antd'

import style from '../index.module.css'

/**
 * Signup send
 * @return Send
 */
const Send: React.FunctionComponent = () => {
  /**
   * Render
   */
  return (
    <Layout>
      <Card variant="outlined" className={style.signup}>
        A validation email has been send at your email address. Please follow
        the link.
      </Card>
    </Layout>
  )
}

export default Send
