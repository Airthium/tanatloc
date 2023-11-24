/** @module Components.Doc */

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { Layout, Menu, Typography } from 'antd'

import Utils from '@/lib/utils'

import packageJson from '../../../package.json'

import Installation from './installation'
import Changelog from './changelog'
import Workflow from './workflow'
import Dashboard from './dashboard'
import Project from './project'
import Editor from './editor'
import Plugins from './plugins'

import style from './index.module.css'
import globalStyle from '@/styles/index.module.css'

/**
 * Doc
 * @returns Doc
 */
const Doc = () => {
  // Ref
  const navRef = useRef<{ section: string; tab: string }>()

  // State
  const [content, setContent] = useState<React.JSX.Element>()

  // Data
  const router = useRouter()
  const query = router.query

  /**
   * On tanatloc
   */
  const onTanatloc = useCallback(() => {
    ;(async () => {
      await router.push('/')
    })()
  }, [router])

  /**
   * On key up (ghost function)
   */
  const onKeyUp = useCallback((): void => undefined, [])

  /**
   * On router
   * @param route Route
   */
  const onRouter = useCallback(
    (route: {
      pathname: string
      query?: { section: string; tab?: string }
    }): void => {
      ;(async () => {
        await router.push(route)
      })()
    },
    [router]
  )

  /**
   * On menu click
   * @param param { keyPath }
   */
  const onMenuClick = useCallback(
    ({ keyPath }: { keyPath: string[] }): void => {
      let key = keyPath.pop()
      if (key === 'rc-menu-more') key = keyPath.pop()
      const subKey = keyPath.pop()

      switch (key) {
        case 'installation':
          onRouter({
            pathname: '/doc',
            query: {
              section: 'installation',
              tab: subKey
            }
          })
          setContent(<Installation />)
          break
        case 'changelog':
          onRouter({
            pathname: '/doc',
            query: {
              section: 'changelog'
            }
          })
          setContent(<Changelog />)
          break
        case 'workflow':
          onRouter({
            pathname: '/doc',
            query: {
              section: 'workflow'
            }
          })
          setContent(<Workflow />)
          break
        case 'dashboard':
          onRouter({
            pathname: '/doc',
            query: {
              section: 'dashboard',
              tab: subKey
            }
          })
          setContent(<Dashboard />)
          break
        case 'project':
          onRouter({
            pathname: '/doc',
            query: {
              section: 'project',
              tab: subKey
            }
          })
          setContent(<Project />)
          break
        case 'modelEditor':
          onRouter({
            pathname: '/doc',
            query: {
              section: 'modelEditor',
              tab: subKey
            }
          })
          setContent(<Editor />)
          break
        case 'plugins':
          onRouter({
            pathname: '/doc',
            query: {
              section: 'plugins',
              tab: subKey
            }
          })
          setContent(<Plugins />)
          break
        default:
          onRouter({
            pathname: '/doc'
          })
          setContent(undefined)
          break
      }
    },
    [onRouter]
  )

  // Init
  useEffect(() => {
    if (
      query.section !== navRef.current?.section ||
      query.tab !== navRef.current?.tab
    ) {
      navRef.current = {
        section: query.section as string,
        tab: query.tab as string
      }
      onMenuClick({ keyPath: [query.tab as string, query.section as string] })
    }
  }, [query, onMenuClick])

  // Menu items
  const menuItems = useMemo(
    () => [
      {
        key: 'introduction',
        label: 'Introduction'
      },
      {
        key: 'installation',
        label: 'Installation',
        onTitleClick: () => onMenuClick({ keyPath: ['installation'] }),
        children: [
          {
            key: 'desktop',
            label: 'Desktop Application'
          },
          {
            key: 'server',
            label: 'Server'
          }
        ]
      },
      {
        key: 'changelog',
        label: 'CHANGELOG'
      },
      {
        key: 'workflow',
        label: 'Workflow'
      },
      {
        key: 'dashboard',
        label: 'Dashboard usage',
        onTitleClick: () => onMenuClick({ keyPath: ['dashboard'] }),
        children: [
          {
            key: 'workspaces',
            label: 'Workspaces & Projects'
          },
          {
            key: 'account',
            label: 'Account Settings'
          },
          {
            key: 'organizations',
            label: 'Organizations'
          },
          {
            key: 'administration',
            label: 'Administration'
          },
          {
            key: 'editor',
            label: 'Model Editor'
          },
          {
            key: 'Help',
            label: 'Help'
          }
        ]
      },
      {
        key: 'project',
        label: 'Project usage',
        onTitleClick: () => onMenuClick({ keyPath: ['project'] }),
        children: [
          {
            key: 'geometry',
            label: 'Geometry'
          },
          {
            key: 'simulation',
            label: 'Simulation'
          },
          {
            key: 'view',
            label: 'View tools'
          }
        ]
      },
      {
        key: 'modelEditor',
        label: 'Model Editor'
      },
      {
        key: 'plugins',
        label: 'Plugins',
        onTitleClick: () => onMenuClick({ keyPath: ['plugins'] }),
        children: [
          {
            key: 'hpc',
            label: 'HPC plugins'
          },
          {
            key: 'model',
            label: 'Model plugins'
          }
        ]
      }
    ],
    [onMenuClick]
  )

  /**
   * Render
   */
  return (
    <Layout className={globalStyle.noScroll}>
      <Layout.Header className={style.header}>
        <img
          className={style.logo}
          src="/images/logo.svg"
          alt="Tanatloc"
          onClick={onTanatloc}
          onKeyUp={onKeyUp}
        />
        <Typography.Title level={1}>Doc</Typography.Title>

        <Link
          href="https://github.com/Airthium/tanatloc"
          target="_blank"
          className={style.github}
        >
          <img src="/images/github-mark.svg" alt="Github Airthium/tanatloc" />
        </Link>
      </Layout.Header>
      <Layout>
        <Layout.Header className={style.menu}>
          <Menu
            mode="horizontal"
            selectedKeys={[(query.section as string) ?? 'introduction']}
            onClick={onMenuClick}
            items={menuItems}
          />
        </Layout.Header>
        <Layout.Content className={`${globalStyle.scroll} ${style.content}`}>
          {content ?? (
            <>
              <div
                className={globalStyle.logo}
                style={{ display: 'inline-flex' }}
              >
                <img src="/images/logo.svg" alt="Tanatloc" />
              </div>
              <Typography.Title level={3}>
                See the world the way it really is!
              </Typography.Title>

              <Typography className={style.text}>
                <Typography.Text>
                  Tanatloc is a graphical interface for FreeFEM, a powerful PDE
                  solver.
                </Typography.Text>
                <Typography.Text>
                  Run your numerical simulations locally using the provided
                  physics models (linear elasticity, Navier-Stokes, and more) or
                  write your own using the{' '}
                  <Link href="https://freefem.org/" target="_blank">
                    FreeFEM language
                  </Link>
                  !
                </Typography.Text>
              </Typography>

              <Typography className={style.text}>
                <Typography.Text>
                  Tanatloc is an open-source project by{' '}
                  <Link href="https://airthium.com" target="_blank">
                    Airthium
                  </Link>
                  , a deeptech startup working on decarbonizing the planet{' '}
                  <img src="/images/earth.png" alt="earth" />.
                </Typography.Text>
                {/* <Typography.Text>
                  Learn more and support our efforts by investing in our{' '}
                  <Link
                    href="https://wefunder.com/airthium"
                    target="_blank"
                  >
                    crowdfunding
                  </Link>
                  !
                </Typography.Text> */}
              </Typography>

              <Typography className={style.text}>
                <Typography.Title level={3}>
                  Local app - Electron
                </Typography.Title>
                <Typography.Text>
                  You can run Tanatloc locally using the Electron app, download
                  the latest release from the{' '}
                  <Link
                    href="https://github.com/Airthium/tanatloc-electron"
                    target="_blank"
                    rel="noreferrer"
                  >
                    tanatloc-electron repository
                  </Link>
                  .
                </Typography.Text>
                <Typography.Text>
                  See{' '}
                  <Link href="/doc?section=installation&tab=desktop">
                    Installation
                  </Link>
                </Typography.Text>
              </Typography>

              <Typography className={style.text}>
                <Typography.Title level={3}>
                  Server deployment - Docker
                </Typography.Title>
                <Typography.Text>
                  If you want to run Tanatloc on a server, you can use the{' '}
                  <Link
                    href="https://github.com/Airthium/tanatloc-deploy#readme"
                    target="_blank"
                  >
                    tanatloc-deploy script
                  </Link>
                  .
                </Typography.Text>
                <Typography.Text>
                  The Tanatloc-deploy script uses the{' '}
                  <Link
                    href="https://github.com/Airthium/tanatloc-docker#readme"
                    target="_blank"
                  >
                    tanatloc-docker repository
                  </Link>
                  .
                </Typography.Text>
                <Typography.Text>
                  See{' '}
                  <Link href="/doc?section=installation&tab=server">
                    Installation
                  </Link>
                </Typography.Text>
              </Typography>

              <Typography className={style.text}>
                <Typography.Title level={3}>
                  Bug report / Feature request
                </Typography.Title>
                <Typography.Text>
                  <Link
                    href="https://github.com/Airthium/tanatloc/issues/new/choose"
                    target="_blank"
                  >
                    Open an issue
                  </Link>{' '}
                  on Github
                </Typography.Text>
              </Typography>

              <Typography className={style.text}>
                <Typography.Title level={3}>About</Typography.Title>
                <Typography.Text>
                  Version:{' '}
                  <Typography.Text code>{packageJson.version}</Typography.Text>
                </Typography.Text>
                <Typography.Text>
                  Git version:{' '}
                  <Typography.Text code>
                    {Utils.getGitVersion()}
                  </Typography.Text>
                </Typography.Text>
              </Typography>

              <Typography className={style.text}>
                <Typography.Title level={3}>Development</Typography.Title>
                <Typography.Text>
                  See{' '}
                  <Link
                    href="https://github.com/Airthium/tanatloc/blob/master/.github/CONTRIBUTING.md"
                    target="_blank"
                  >
                    CONTRIBUTING.md
                  </Link>
                  .
                </Typography.Text>
                <Typography.Text>
                  <Link
                    href="https://airthium.github.io/tanatloc-doc/"
                    target="_blank"
                  >
                    Developer documentation
                  </Link>
                </Typography.Text>
              </Typography>
            </>
          )}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}

export default Doc
