/** @module Components.Workspace.List */

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import {
  Button,
  Empty,
  Form,
  Input,
  InputRef,
  Layout,
  Tabs,
  Tooltip,
  Typography
} from 'antd'
import {
  ExperimentOutlined,
  PlusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'

import {
  IFrontMutateWorkspacesItem,
  IFrontNewWorkspace,
  IFrontOrganizationsItem,
  IFrontUser,
  IFrontWorkspacesItem
} from '@/api/index.d'

import { LIMIT50 } from '@/config/string'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import Dialog from '@/components/assets/dialog'
import PageHeader from '@/components/assets/pageHeader'
import { menuItems } from '@/components/dashboard'

import WorkspaceAPI from '@/api/workspace'

import Add from '../add'
import Workspace from '..'
import SampleWorkspace from '../sample'

import dashboardStyle from '@/components/dashboard/index.module.css'
import globalStyle from '@/styles/index.module.css'
import style from '../index.module.css'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id' | 'plugins'>
  workspaces: Pick<
    IFrontWorkspacesItem,
    'id' | 'name' | 'projects' | 'owners' | 'users' | 'groups'
  >[]
  organizations: Pick<
    IFrontOrganizationsItem,
    'id' | 'name' | 'owners' | 'users' | 'groups'
  >[]
  swr: {
    addOneWorkspace: (workspace: IFrontNewWorkspace) => Promise<void>
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add workspace'
}

/**
 * On confirm
 * @param router Router
 * @param values Values
 * @param swr SWR
 */
export const _onOk = async (
  router: NextRouter,
  values: Pick<IFrontWorkspacesItem, 'name'>,
  swr: { addOneWorkspace: (workspace: IFrontNewWorkspace) => Promise<void> }
): Promise<void> => {
  // Add
  const workspace = await WorkspaceAPI.add(values)

  // Mutate
  await swr.addOneWorkspace(workspace)

  await router
    .push({
      pathname: '/dashboard',
      query: { page: 'workspaces', workspaceId: workspace.id }
    })
    .catch()
}

/**
 * Workspace list
 * @param props Props
 * @returns WorkspaceList
 */
const WorkspacesList: React.FunctionComponent<IProps> = ({
  user,
  workspaces,
  organizations,
  swr
}) => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [sampleVisible, setSampleVisible] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Router
  const router = useRouter()
  const { page, workspaceId }: { page?: string; workspaceId?: string } =
    router.query

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => {
    setVisible(false)
  }, [])

  /**
   * Set sample visible true
   */
  const setSampleVisibleTrue = useCallback((): void => {
    setSampleVisible(true)
  }, [])

  /**
   * On change
   * @param activeKey Active key
   */
  const onChange = useCallback(
    (activeKey: string): void => {
      asyncFunctionExec(async () => {
        if (activeKey === 'add') setVisible(true)
        else if (activeKey === 'sample') setSampleVisible(true)
        else
          await router.push({
            pathname: '/dashboard',
            query: { page: 'workspaces', workspaceId: activeKey }
          })
      })
    },
    [router]
  )

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: Pick<IFrontWorkspacesItem, 'name'>): Promise<void> => {
      setLoading(true)
      try {
        await _onOk(router, values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err: any) {
        dispatch(addError({ title: errors.add, err }))
        setLoading(false)
        throw err
      }
    },
    [router, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <Layout className={`${dashboardStyle.inDashboard} ${globalStyle.noScroll}`}>
      <PageHeader
        title={
          <Typography.Title level={2} style={{ marginBottom: '0 !important' }}>
            Workspaces
          </Typography.Title>
        }
      />
      <Layout.Content className={globalStyle.noScroll}>
        <SampleWorkspace
          visible={sampleVisible}
          setVisible={setSampleVisible}
          user={user}
          swr={{
            addOneWorkspace: swr.addOneWorkspace
          }}
        />
        {workspaces.length ? (
          <>
            <Dialog
              visible={visible}
              loading={loading}
              title="Create a new workspace"
              onCancel={setVisibleFalse}
              onOk={onOk}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'Name is required' },
                  {
                    max: LIMIT50,
                    message: 'Max ' + LIMIT50 + ' characters'
                  }
                ]}
              >
                <Input ref={inputRef} placeholder="Workspace's name" />
              </Form.Item>
            </Dialog>
            <Tabs
              type="editable-card"
              hideAdd={true}
              className={`${globalStyle.noScroll} ${dashboardStyle.inDashboardTabs} ${style.tabs}`}
              items={[
                ...workspaces.map((workspace) => ({
                  key: workspace.id,
                  label: workspace.name,
                  css: globalStyle.noScroll,
                  closable: false,
                  children: (
                    <Workspace
                      user={user}
                      page={page ?? menuItems.workspaces.key}
                      workspace={{
                        id: workspace.id,
                        name: workspace.name,
                        projects: workspace.projects,
                        owners: workspace.owners,
                        users: workspace.users,
                        groups: workspace.groups
                      }}
                      organizations={organizations}
                      swr={{
                        delOneWorkspace: swr.delOneWorkspace,
                        mutateOneWorkspace: swr.mutateOneWorkspace
                      }}
                    />
                  )
                })),
                {
                  key: 'add',
                  label: (
                    <Tooltip title="New workspace">
                      <PlusOutlined />
                    </Tooltip>
                  ),
                  closable: false
                },
                {
                  key: 'sample',
                  label: (
                    <Tooltip title="Sample workspace">
                      <ExperimentOutlined />
                    </Tooltip>
                  ),
                  closable: false
                }
              ]}
              defaultActiveKey={'1'}
              activeKey={workspaceId}
              onChange={onChange}
            />
          </>
        ) : (
          <Empty
            className={style.empty}
            image="images/empty.svg"
            description={'No workspace for now. Get started !'}
          >
            <Add
              swr={{
                addOneWorkspace: swr.addOneWorkspace
              }}
            />
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={setSampleVisibleTrue}
            >
              Create a sample workspace
            </Button>
          </Empty>
        )}
      </Layout.Content>
    </Layout>
  )
}

export default WorkspacesList
