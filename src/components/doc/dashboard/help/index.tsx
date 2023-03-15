/** @module Components.Doc.Dashboard.Help */

import { Typography } from 'antd'

import Carousel from '@/components/assets/carousel'

import style from '../../index.module.css'

/**
 * Help
 * @returns Help
 */
const Help = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>Help</Typography.Title>

      <Typography className={style.text}>
        <Typography.Text>
          You will find the link to this documentation, and to Github Issues
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'help',
            src: '/doc/help.jpg',
            caption: 'Help'
          }
        ]}
      />
    </>
  )
}

export default Help
