/** @module Components.Doc.Dashboard.Account */

import { Typography } from 'antd'

import Carousel from '@/components/assets/carousel'

import style from '../../index.module.css'

const Account = (): React.JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>Account Settings</Typography.Title>

      <Typography className={style.text}>
        <Typography.Text>
          Account settings allow you to:
          <ul>
            <li>modify your email, first name, last name, avatar</li>
            <li>delete your account</li>
            <li>modify your password</li>
            <li>manage your HPC providers</li>
          </ul>
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'personal',
            src: '/doc/account_personal.jpg',
            caption: 'Personal Information'
          },
          {
            key: 'security',
            src: '/doc/account_security.jpg',
            caption: 'Security'
          },
          {
            key: 'hpc',
            src: '/doc/account_hpc.jpg',
            caption: 'HPC Providers'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Text className={style.warnings}>
          Deleting your account is not reversible. If you delete your account,
          all data will be lose
        </Typography.Text>
      </Typography>
    </>
  )
}

export default Account
