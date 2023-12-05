/** @module Components.Signup.Send */

import { ReactNode } from 'react'
import { Card, Layout } from 'antd'

import style from '../index.module.css'

/**
 * Signup send
 * @return Send
 */
const Send = (): ReactNode => {
  /**
   * Render
   */
  return (
    <Layout>
      <Card bordered={true} className={style.signup}>
        A validation email has been send at your email address. Please follow
        the link.
      </Card>
    </Layout>
  )
}

export default Send
