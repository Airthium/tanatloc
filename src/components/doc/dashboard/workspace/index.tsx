/** @module Components.Doc.Dashboard.Workspace */

import Link from 'next/link'
import { Button, Typography } from 'antd'
import {
  HddOutlined,
  ImportOutlined,
  PlusOutlined,
  ShareAltOutlined
} from '@ant-design/icons'

import Carousel from '@/components/assets/carousel'
import { AddButton, DeleteButton, EditButton } from '@/components/assets/button'

import style from '../../index.style'
import { globalStyle } from '@/styles'

/**
 * Workspace
 * @returns Workspace
 */
const Workspace = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={4}>Workspaces & Projects</Typography.Title>

      <Typography css={style.text}>
        <Typography.Text>
          The workspace is the place where all the projects are. You can create
          several workspaces to sort your different projects.
        </Typography.Text>
        <Typography.Text>
          You can share your workspace with other users or groups throught
          organizations.
        </Typography.Text>
        <Typography.Text>
          At the beginning, there is no workspace
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'empty',
            src: '/doc/workspace_empty.jpg',
            alt: 'Empty workspace',
            caption: 'First start'
          }
        ]}
      />

      <Typography css={style.text}>
        <Typography.Title level={4}>Workspace creation</Typography.Title>
        <Typography.Text>
          In order to create a workspace:
          <ul>
            <li>
              If there is no workspace, click on &apos;Create a new
              workspace&apos;
            </li>
            <li>
              If you already have workspace, click on the <PlusOutlined />{' '}
              button in the tab bar
            </li>
          </ul>
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'first',
            src: '/doc/workspace_create.jpg',
            caption: 'First workspace'
          },
          {
            key: 'plus',
            src: '/doc/workspace_plus.jpg',
            caption: 'Add workspace'
          }
        ]}
      />

      <Typography css={style.text}>
        <Typography.Title level={4}>
          Workspace edit, share, delete
        </Typography.Title>
        <Typography.Text>
          You can edit the workspace&apos;s name using the{' '}
          <EditButton bordered onEdit={() => undefined} />
        </Typography.Text>
        <Typography.Text>
          You can share the workspace with organizations groups and members
          using the <Button icon={<ShareAltOutlined />} />
        </Typography.Text>
        <Typography.Text css={style.tips}>
          You must create an organization with users and groups before share a
          workspace
        </Typography.Text>
        <Typography.Text>
          You can delete the workspace using the{' '}
          <DeleteButton bordered onDelete={async () => undefined} />
        </Typography.Text>
        <Typography.Text css={style.warnings}>
          Delete a workspace will delete all workspace&apos;s projects
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'edit',
            src: '/doc/workspace_edit.jpg',
            caption: 'Edit workspace'
          },
          {
            key: 'share',
            src: '/doc/workspace_share.jpg',
            caption: 'Share workspace'
          },
          {
            key: 'delete',
            src: '/doc/workspace_delete.jpg',
            caption: 'Delete workspace'
          }
        ]}
      />

      <Typography css={style.text}>
        <Typography.Title level={4}>Project creation</Typography.Title>
        <Typography.Text>
          The project is used to manage geometries, simulation and results.
        </Typography.Text>
        <Typography.Text>
          Once the workspace is created, yan can create a new project using{' '}
          <AddButton primary={false} dark onAdd={() => undefined}>
            Create a new project
          </AddButton>
        </Typography.Text>
        <Typography.Text>
          When the project is created, the project page automatically opens, see{' '}
          <Link href="/doc?section=project">Project</Link>
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'create',
            src: '/doc/project_create.jpg',
            caption: 'First project'
          },
          {
            key: 'show',
            src: '/doc/project_show.jpg',
            caption: 'Project display'
          }
        ]}
      />

      <Typography css={style.text}>
        <Typography.Title level={4}>
          Project edit, share, archive, delete
        </Typography.Title>
        <Typography.Text>
          You can edit the project&apos;name and description using the{' '}
          <EditButton onEdit={() => undefined} />
        </Typography.Text>
        <Typography.Text>
          You can share the project with organizations groups and memebers using
          the <Button icon={<ShareAltOutlined />} css={globalStyle.noBorder} />
        </Typography.Text>
        <Typography.Text css={style.tips}>
          You must create an organization with users and groups before share a
          project
        </Typography.Text>
        <Typography.Text>
          You can archive a project using the{' '}
          <Button type="link" icon={<HddOutlined />} />. Once a project is
          archived, you can restore it using the{' '}
          <Button type="link" icon={<ImportOutlined />} />
        </Typography.Text>
        <Typography.Text>
          You can restore a project from the server backup, automatically
          created during the archive process, or from your local copy. You can
          also delete the server backup.
        </Typography.Text>
        <Typography.Text>
          You can delete the project using the{' '}
          <DeleteButton bordered onDelete={async () => undefined} />
        </Typography.Text>
        <Typography.Text css={style.warnings}>
          Delete a project will delete all project&apos;s geometries,
          simulations and results
        </Typography.Text>
      </Typography>
      <Carousel
        items={[
          {
            key: 'edit',
            src: '/doc/project_edit.jpg',
            caption: 'Edit project'
          },
          {
            key: 'share',
            src: '/doc/project_share.jpg',
            caption: 'Share project'
          },
          {
            key: 'archive',
            src: '/doc/project_archive.jpg',
            caption: 'Archive project'
          },

          {
            key: 'archived',
            src: '/doc/project_archived.jpg',
            caption: 'Archived project'
          },
          {
            key: 'restore',
            src: '/doc/project_restore.jpg',
            caption: 'Restore project'
          },
          {
            key: 'delete',
            src: '/doc/project_delete.jpg',
            caption: 'Delete project'
          }
        ]}
      />
    </>
  )
}

export default Workspace
