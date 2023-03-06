/** @module Components.Doc.Dashboard.Administration */

import { Typography } from 'antd'

import Carousel from '@/components/assets/carousel'
import { AddButton, DeleteButton, EditButton } from '@/components/assets/button'

import style from '../../index.style'

/**
 * Administration
 * @returns Administration
 */
const Administration = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>Administration</Typography.Title>
      <Typography css={style.text}>
        Your need to be an administrator to have acces to this part
      </Typography>

      <Typography css={style.text}>
        <Typography.Title level={4}>Users management</Typography.Title>
        <Typography.Text>
          The first tab of Administration is the users management
        </Typography.Text>
        <Typography.Text>
          You can add an user using{' '}
          <AddButton onAdd={() => undefined}>New user</AddButton>. You have to
          provide an email and a password, and optionally a first name, a last
          name, some plugins authorization and the administrator status
        </Typography.Text>
        <Typography.Text>
          You can edit user using{' '}
          <EditButton bordered onEdit={() => undefined}>
            Edit
          </EditButton>
        </Typography.Text>
        <Typography.Text>
          You can delete an user using{' '}
          <DeleteButton bordered onDelete={async () => undefined} />
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'user',
            src: '/doc/administration_user.jpg',
            caption: 'Users'
          },
          {
            key: 'add',
            src: '/doc/administration_user_add.jpg',
            caption: 'Add user'
          },
          {
            key: 'edit',
            src: '/doc/administration_user_edit.jpg',
            caption: 'Edit user'
          }
        ]}
      />

      <Typography css={style.text}>
        <Typography.Title level={4}>Registration</Typography.Title>
        <Typography.Text>
          You can manage registration parameters in the Registration tab
        </Typography.Text>
        <ul>
          <li>Allow registration</li>
          <li>Require a minimal and maximal password length</li>
          <li>Require letters, numbers or/and symbols in the password</li>
        </ul>
      </Typography>
      <Carousel
        items={[
          {
            key: 'registration',
            src: '/doc/administration_registration.jpg',
            caption: 'Registration'
          }
        ]}
      />

      <Typography css={style.text}>
        <Typography.Title level={4}>Plugins</Typography.Title>
        <Typography.Text>
          The plugins tab allows you to manage default enabled plugins at user
          creation
        </Typography.Text>
        <Typography.Text>
          If a plugin is checked, it will be available directly when an user is
          created
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'plugins',
            src: '/doc/administration_plugins.jpg',
            caption: 'Plugins'
          }
        ]}
      />
    </>
  )
}

export default Administration
