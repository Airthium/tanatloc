/** @module Components.Index */

import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  Checkbox,
  Collapse,
  Drawer,
  Layout,
  List,
  Menu,
  Popover,
  Space,
  Steps,
  Typography
} from 'antd'
import { ItemType } from 'antd/es/menu/hooks/useItems'
import { BarsOutlined, BugOutlined, SettingOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import isElectron from 'is-electron'

import packageJson from '../../../package.json'

import { login } from '@/api/login'
import UserAPI from '@/api/user'

import Side from '@/components/assets/side'
import Footer from '@/components/footer'

import { globalStyle, variables } from '@/styles'
import style from './index.style'

/**
 * Scroll to view
 * @param id
 */
const scrollToView = (id: string): void => {
  const header = document.getElementById('header')
  const target = document.getElementById(id)

  const index = document.getElementById('index')
  if (target && header) {
    const y = target?.offsetTop - header?.offsetHeight - 10
    index?.scrollTo?.({ top: y, behavior: 'smooth' })
  }
}

/**
 * Index
 * @returns Index
 */
const Index = (): JSX.Element => {
  // State
  const [dockerOpen, setDockerOpen] = useState<boolean>(false)
  const [troubleshootingOpen, setTroubleshootingOpen] = useState<boolean>(false)

  // Data
  const router = useRouter()
  const [user, { loadingUser }] = UserAPI.useUser()

  // Electron
  useEffect(() => {
    if (isElectron()) {
      login({
        email: 'admin',
        password: 'password'
      })
        .then(() => {
          router.push('/dashboard')
        })
        .catch()
    }
  }, [router])

  /**
   * Get started
   */
  const getStarted = useCallback(() => {
    if (process.env.NEXT_PUBLIC_SERVER_MODE === 'frontpage') {
      scrollToView('getStarted')
    } else {
      router.push('/signup')
    }
  }, [router])

  /**
   * On download
   * @param key Key
   */
  const onDownload = useCallback(
    (key: string) => {
      switch (key) {
        case 'Windows':
          router.push(
            'https://github.com/Airthium/tanatloc-electron/releases/download/v' +
              packageJson.version +
              '/Tanatloc.Setup.' +
              packageJson.version +
              '.exe'
          )
          break
        case 'MacOS':
          router.push(
            'https://github.com/Airthium/tanatloc-electron/releases/download/v' +
              packageJson.version +
              '/Tanatloc-' +
              packageJson.version +
              '.dmg'
          )
          break
        case 'Linux':
          router.push(
            'https://github.com/Airthium/tanatloc-electron/releases/download/v' +
              packageJson.version +
              '/Tanatloc-' +
              packageJson.version +
              '.AppImage'
          )
          break
      }
    },
    [router]
  )

  // Get started button
  let getStartedButton = null
  if (!user)
    getStartedButton = (
      <Button
        css={css({ display: 'none' })}
        type="primary"
        onClick={getStarted}
      >
        Get Started
      </Button>
    )

  // Login button
  let loginButton = null
  if (process.env.NEXT_PUBLIC_SERVER_MODE !== 'frontpage' && !loadingUser) {
    if (user)
      loginButton = (
        <Button
          type="primary"
          className="Index-login-button"
          onClick={() => router.push('/dashboard')}
        >
          Dashboard
        </Button>
      )
    else
      loginButton = (
        <Button
          className="Index-login-button"
          onClick={() => router.push('/login')}
        >
          Login
        </Button>
      )
  }

  const menuItems = [
    {
      key: 'features',
      label: (
        <Button type="text" onClick={() => scrollToView('features')}>
          Features
        </Button>
      )
    },
    {
      key: 'caseStudy',
      label: (
        <Button type="text" onClick={() => scrollToView('caseStudy')}>
          Case Studies
        </Button>
      )
    },
    {
      key: 'aboutUs',
      label: (
        <Button type="text" onClick={() => scrollToView('aboutUs')}>
          About us
        </Button>
      )
    },
    {
      key: 'developers',
      label: (
        <Button
          type="text"
          onClick={() => window.open('https://github.com/Airthium', '_blank')}
        >
          Developers
        </Button>
      )
    },
    !user && { key: 'getStarted', label: getStartedButton },
    process.env.NEXT_PUBLIC_SERVER_MODE !== 'frontpage' &&
      !loadingUser && { key: 'login', label: loginButton }
  ].filter((m) => m) as ItemType[]

  /**
   * Render
   */
  return (
    <Layout id="index" css={style.index}>
      <Drawer
        open={dockerOpen}
        title="Docker Desktop installation instruction"
        width={500}
        bodyStyle={{ marginTop: 16 }}
        onClose={() => setDockerOpen(false)}
      >
        <Typography>
          Once Docker Desktop is installed and you have reboooted your computer,
          open Docker Desktop.
        </Typography>
        <br />
        <List bordered>
          <List.Item>
            <Collapse>
              <Collapse.Panel
                key="access"
                header='If you have "Docker Desktop - Access denied"'
              >
                <Typography>
                  You must add the{' '}
                  <Typography.Text code>docker-users</Typography.Text> group to
                  the current user.
                </Typography>
                <Typography>
                  Run <strong>Computer Management</strong> as an administrator
                  and navigate to <strong>Local Users and Groups</strong> &gt;{' '}
                  <strong>Groups</strong> &gt; <strong>docker-users</strong>.
                  Then, right-click to add user to the group.
                </Typography>
                <Typography>Log out and log back in.</Typography>
                <Typography>You can now start Docker Desktop</Typography>
                <a
                  href="https://docs.docker.com/desktop/faqs/windowsfaqs/#why-do-i-see-the-docker-desktop-access-denied-error-message-when-i-try-to-start-docker-desktop"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source
                </a>
              </Collapse.Panel>
            </Collapse>
          </List.Item>
          <List.Item>Accept the terms and conditions</List.Item>
          <List.Item>
            Install missing dependencies if needed (WSL2 backend)
          </List.Item>
          <List.Item>
            Docker Desktop should display &quot;Docker Desktop running&quot;
          </List.Item>
        </List>
        <br />
        <Typography>
          In case of trouble, you can have a look on the{' '}
          <a
            href="https://docs.docker.com/desktop/faqs/general/"
            target="_blank"
            rel="noreferrer"
          >
            Docker Desktop FAQ
          </a>{' '}
          or on the Tanatloc electron{' '}
          <a
            href="https://github.com/Airthium/tanatloc-electron/issues"
            target="_blank"
            rel="noreferrer"
          >
            Github Issues
          </a>
          .
        </Typography>
      </Drawer>
      <Drawer
        open={troubleshootingOpen}
        title="Troubleshooting"
        width={500}
        bodyStyle={{ marginTop: 16 }}
        onClose={() => setTroubleshootingOpen(false)}
      >
        <Collapse>
          <Collapse.Panel key="appiamge" header="Linux AppImage">
            <Typography>Allow execution of the AppImage using:</Typography>
            <Typography.Text code>
              chmod +x ./Tanatloc-{packageJson.version}.AppImage
            </Typography.Text>
            <Typography>
              Or right-click{' '}
              <strong>Tanatloc-{packageJson.version}.AppImage</strong> &gt;
              <strong>Properties</strong> &gt; <strong>Permissions</strong> and
              check Allow executing file as program
            </Typography>
          </Collapse.Panel>
          <Collapse.Panel
            key="docker"
            header='"There is an error with your Docker installation." error'
          >
            <Typography>
              Open Docker Desktop and check all is working fine.
            </Typography>
            <Typography>
              Have a look at the{' '}
              <Button
                size="small"
                onClick={() => {
                  setTroubleshootingOpen(false)
                  setDockerOpen(true)
                }}
              >
                Docker Desktop instructions
              </Button>
              .
            </Typography>
          </Collapse.Panel>
          <Collapse.Panel
            key="postgres"
            header='"There is an error with your PostgreSQL installation." error'
          >
            <Typography>Open Docker Desktop &gt; Containers</Typography>
            <Typography>
              You should see a container named &quot;tanatloc-postgres&quot;, if
              not try to restart the Tanatloc app.
            </Typography>
          </Collapse.Panel>
        </Collapse>
      </Drawer>
      <Layout.Header id="header" css={style.indexHeader}>
        <img src="/images/logo.svg" alt="Tanatloc" />
        <Menu mode="horizontal" className="Index-Menu" items={menuItems} />
        <div className="Index-Menu-mobile">
          <Popover
            content={<Menu mode="inline" items={menuItems} />}
            placement="leftBottom"
          >
            <BarsOutlined style={{ fontSize: 32 }} />
          </Popover>
        </div>

        {getStartedButton}
        {loginButton}
      </Layout.Header>

      <Layout.Content css={style.indexContent}>
        <Space direction="vertical" size={90} css={globalStyle.fullWidth}>
          <Side
            left={
              <Space direction="vertical" size={20}>
                <Typography.Title style={{ marginBottom: 0 }}>
                  Solve your toughest numerical simulation problems
                </Typography.Title>
                <Typography.Text className="Index-text">
                  Tanatloc is a multi-physics FEA software for engineers and
                  researchers.
                </Typography.Text>

                <Typography.Text className="Index-text">
                  Use the provided models for the most common problems, make
                  your own, or partner with our experts to build one tailored to
                  your needs.
                </Typography.Text>

                <Button type="primary" onClick={getStarted}>
                  Get Started
                </Button>
              </Space>
            }
            right={
              <img
                src="images/indexpage/capture1.png"
                alt="tanatloc"
                className="img-shadow"
              />
            }
            leftCss={css({ ...style.leftCss, ...{ marginBottom: '50px' } })}
          />

          <Side
            left={
              <Typography.Title level={2}>
                The most common multi-physics models at your fingertips
              </Typography.Title>
            }
            right={
              <>
                <Checkbox
                  checked={true}
                  style={{ pointerEvents: 'none', fontSize: '20px' }}
                >
                  Linear elasticity
                </Checkbox>
                <Checkbox
                  checked={true}
                  style={{ pointerEvents: 'none', fontSize: '20px' }}
                >
                  Linear elasticity over time
                </Checkbox>
                <Checkbox
                  checked={true}
                  style={{ pointerEvents: 'none', fontSize: '20px' }}
                >
                  Poisson
                </Checkbox>
                <Checkbox
                  checked={true}
                  style={{ pointerEvents: 'none', fontSize: '20px' }}
                >
                  Stokes
                </Checkbox>
                <Checkbox
                  checked={true}
                  style={{ pointerEvents: 'none', fontSize: '20px' }}
                >
                  Navier-Stokes over time
                </Checkbox>
                <Checkbox
                  checked={true}
                  style={{ pointerEvents: 'none', fontSize: '20px' }}
                >
                  Thermal diffusion
                </Checkbox>
              </>
            }
            css={css({ backgroundColor: variables.colorPrimary })}
            rightCss={css({ ...style.rightCss, ...{ padding: '50px' } })}
            leftCss={css({ padding: '50px' })}
            id="features"
          />

          <div id="developers">
            <div css={css({ padding: '50px' })}>
              <Typography.Title level={2}>
                Solve your numerical problems locally or in the cloud, using
                dedicated plugins
              </Typography.Title>
              <div className="Index-plugins">
                <div>
                  <Avatar
                    size={64}
                    shape="square"
                    src="images/indexpage/logo-rescale.svg"
                  />
                  <Typography.Title level={4}>Rescale</Typography.Title>
                  <Typography.Text className="text-light">
                    Paid feature
                  </Typography.Text>
                  <a href="mailto:contact@airthium.com">
                    <Button type="link">Contact us</Button>
                  </a>
                </div>
                <div>
                  <Avatar
                    size={64}
                    shape="square"
                    src="images/indexpage/logo-ancl.jpg"
                  />
                  <Typography.Title level={4}>ANCL Sharetask</Typography.Title>
                  <Typography.Text className="text-light">
                    Paid feature
                  </Typography.Text>
                  <a href="mailto:contact@airthium.com">
                    <Button type="link">Contact us</Button>
                  </a>
                </div>
                <div>
                  <Avatar
                    size={64}
                    shape="square"
                    src="images/indexpage/logo-slurm.svg"
                  />
                  <Typography.Title level={4}>Slurm</Typography.Title>
                  <Typography.Text className="text-light">
                    Upcoming
                  </Typography.Text>
                </div>
                <div>
                  <Avatar
                    size={64}
                    shape="square"
                    src="images/indexpage/logo-qarnot.svg"
                  />
                  <Typography.Title level={4}>Qarnot HPC</Typography.Title>
                  <Typography.Text className="text-light">
                    Upcoming
                  </Typography.Text>
                </div>
                <div>
                  <Avatar size={64} shape="square" icon={<SettingOutlined />} />
                  <Typography.Title level={4}>Your own plugin</Typography.Title>
                  <Typography.Text className="text-light">
                    Paid feature
                  </Typography.Text>
                </div>
              </div>
            </div>
          </div>

          <div id="electron">
            <Typography.Title level={2}>
              Tanatloc is an FEA software based on FreeFEM, an extremely
              powerful and versatile open-source PDE solver. It runs locally
              using an electron build.
            </Typography.Title>
            <img
              src="images/indexpage/capture2.png"
              alt="tanatloc"
              className="img-shadow text-center"
            />
          </div>

          <Side
            left={
              <Space direction="vertical" size={20}>
                <div>
                  <Typography.Title level={2}>Case Study</Typography.Title>
                  <Typography.Title
                    level={3}
                    className="text-light"
                    style={{ marginBottom: 0 }}
                  >
                    DENSO
                  </Typography.Title>
                </div>

                <Typography.Text className="Index-text">
                  DENSO is a leading Japanese automotive and Fortune 500
                  company.
                </Typography.Text>

                <Typography.Text className="Index-text">
                  Hiroshi Ogawa, at DENSO’s Heat Exchanger R&D Division,
                  implemented a custom FreeFEM model on TANATLOC with the help
                  of Professor Atsushi Suzuki from Osaka University.
                </Typography.Text>

                <Typography.Text className="Index-text">
                  DENSO’s Solder Filling model was added to TANATLOC, and the
                  calculations are deployed seamlessly on the cloud or on
                  on-premise server via the ANCL Sharetask plug-in.
                </Typography.Text>
              </Space>
            }
            right={
              <img
                src="images/indexpage/denso.jpg"
                alt="tanatloc"
                className="Index-case-study Index-padding-50"
              />
            }
            css={css({
              ...style.indexCaseStudy,
              ...{
                marginTop: '50px',
                marginBottom: '50px'
              }
            })}
            leftCss={css([
              style.indexCaseStudyLeft,
              globalStyle.fullWidth,
              { padding: '50px !important' }
            ])}
            // leftClassName="Index-casestudy-left Index-padding-50 full-width"
            id="caseStudy"
          />

          <div id="getStarted" className="margin-bottom-50">
            <Typography.Title level={2}>Get started</Typography.Title>
            <br />
            <Steps direction="vertical" className="Index-steps">
              <Steps.Step
                title="Install Docker Desktop"
                description={
                  <>
                    <Typography>
                      Follow the Docker installation instruction at{' '}
                      <a
                        href="https://docs.docker.com/get-docker/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        docs.docker.com/get-docker
                      </a>{' '}
                      and reboot your computer.
                    </Typography>
                    <Typography>
                      Start Docker Desktop and make sure{' '}
                      <Button size="small" onClick={() => setDockerOpen(true)}>
                        everything is working
                      </Button>
                      .
                    </Typography>
                  </>
                }
                status="process"
              />
              <Steps.Step
                title="Disk space"
                description={
                  <>
                    <Typography>
                      Make sure you have at least 10GB of free disk space.
                    </Typography>
                    <Typography>
                      This space is used for the installation only, make sure
                      you have enough space to store the upcoming simulations
                      results
                    </Typography>
                  </>
                }
                status="process"
              />
              <Steps.Step
                title="Download the latest app"
                description={
                  <>
                    <Typography>
                      Download the latest app for Linux, MacOS or Windows.
                    </Typography>
                    <Button
                      type="primary"
                      className="download"
                      onClick={() => onDownload('Windows')}
                    >
                      <img src="/images/indexpage/windows.svg" alt="" />
                      Windows
                    </Button>
                    <Button
                      type="primary"
                      className="download"
                      onClick={() => onDownload('MacOS')}
                    >
                      <img src="/images/indexpage/MacOS.svg" alt="" />
                      MacOS
                    </Button>
                    <Button
                      type="primary"
                      className="download"
                      onClick={() => onDownload('Linux')}
                    >
                      <img src="/images/indexpage/Linux.svg" alt="" />
                      Linux
                    </Button>
                    <br />
                    <Button
                      size="small"
                      icon={<BugOutlined />}
                      onClick={() => setTroubleshootingOpen(true)}
                    >
                      Troubleshooting
                    </Button>
                  </>
                }
                status="process"
              />
            </Steps>
          </div>

          <Side
            left={
              <img
                src="images/indexpage/TanatlocByAirthium.png"
                alt="airthium"
              />
            }
            right={
              <Space direction="vertical" size={20}>
                <Typography.Text className="Index-text">
                  TANATLOC is maintained by Airthium, a US/France based deeptech
                  startup. We build a very robust and highly efficient electric
                  heat engine to decarbonise the planet.
                </Typography.Text>

                <a
                  href="https://airthium.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button type="primary">Discover the project</Button>
                </a>
              </Space>
            }
            top={
              <Side
                left={<></>}
                right={
                  <>
                    <Typography.Title level={2}>
                      Support our fight against climate change
                    </Typography.Title>
                    <a
                      href="https://wefunder.com/airthium"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="large">
                        <strong>Invest in our crowdfounding</strong>
                      </Button>
                    </a>
                  </>
                }
                // className="background-primary"
                // leftClassName="Index-about-turbine"
                // rightClassName="Index-padding-50 Index-crowdfunding"
              />
            }
            // className="Index-about"
            // leftClassName="Index-padding-50"
            // rightClassName="Index-padding-50"
            id="aboutUs"
          />
        </Space>
      </Layout.Content>
      <Footer scroll={scrollToView} />
    </Layout>
  )
}

export default Index
