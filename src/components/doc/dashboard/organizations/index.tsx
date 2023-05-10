/** @module Components.Doc.Dashboard.Organization */

import { Button, Typography } from 'antd'
import { ControlOutlined } from '@ant-design/icons'

import Carousel from '@/components/assets/carousel'
import { AddButton } from '@/components/assets/button'

import style from '../../index.module.css'

/**
 * Organizations
 * @returns Organizations
 */
const Organizations = (): React.JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>Organizations</Typography.Title>
      <Typography className={style.text}>
        <Typography.Text>
          Allow you to manage an organization, and associated users and groups
          for sharing purpose.
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Create organization</Typography.Title>
        <Typography.Text>
          To create an organization, use{' '}
          <AddButton onAdd={() => undefined}>New organization</AddButton>
        </Typography.Text>
        <Typography.Text>
          You just have to fill the name to create it
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'empty',
            src: '/doc/organizations_empty.jpg',
            caption: 'Empty organizations'
          },
          {
            key: 'create',
            src: '/doc/organizations_create.jpg',
            caption: 'Create organization'
          },
          {
            key: 'show',
            src: '/doc/organizations_show.jpg',
            caption: 'First organization'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={4}>Organization</Typography.Title>
        <Typography.Text>
          Click on <Button icon={<ControlOutlined />}>Manage</Button> to enter
          the organization
        </Typography.Text>
        <Typography.Text>
          You can add an user with{' '}
          <AddButton onAdd={() => undefined}>New user</AddButton>, and fill the
          email
        </Typography.Text>
        <Typography.Text>
          The added user is in &apos;Pending&apos; status until he accepts the
          invitation
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'organization',
            src: '/doc/organizations_organization.jpg',
            caption: 'Manage organization'
          },
          {
            key: 'user',
            src: '/doc/organizations_organization_user.jpg',
            caption: 'Add user'
          },
          {
            key: 'user_pending',
            src: '/doc/organizations_organization_user_pending.jpg',
            caption: 'Add user'
          },
          {
            key: 'user_accepted',
            src: '/doc/organizations_organization_user_accepted.jpg',
            caption: 'Accepted user'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={4}>User invitation</Typography.Title>
        <Typography.Text>
          On the invited user side, the user has to accept or decline the
          invitation
        </Typography.Text>
        <Typography.Text>
          Once accepted, he is inside the organization
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'invitation',
            src: '/doc/organizations_organization_user_accept.jpg',
            caption: 'Organization invitation'
          },
          {
            key: 'in',
            src: '/doc/organizations_organization_user_in.jpg',
            caption: 'Organization user'
          }
        ]}
      />

      <Typography className={style.text}>
        <Typography.Title level={4}>Groups</Typography.Title>
        <Typography.Text>
          Use the &apos;Group&apos; tab item to go to group
        </Typography.Text>
        <Typography.Text>
          Use <AddButton onAdd={() => undefined}>New group</AddButton> to create
          a new group, fill the name and select the users
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'empty',
            src: '/doc/organizations_organization_group.jpg',
            caption: 'Empty organization groups'
          },
          {
            key: 'create',
            src: '/doc/organizations_organization_group_add.jpg',
            caption: 'Create group'
          },
          {
            key: 'list',
            src: '/doc/organizations_organization_group_show.jpg',
            caption: 'Organization groups'
          }
        ]}
      />
    </>
  )
}

export default Organizations
