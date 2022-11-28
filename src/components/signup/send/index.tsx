/** @module Components.Signup.Send */

import { Card, Layout } from 'antd'

import style from '../index.style'

/**
 * Signup send
 * @return Send
 */
const Send = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout>
      <Card bordered={true} css={style.signup}>
        A validation email has been send at your email address. Please follow
        the link.
      </Card>
    </Layout>
  )
}

export default Send
