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
  Space,
  Spin,
  Steps,
  Typography
} from 'antd'
import { BugOutlined, SettingOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'
import isElectron from 'is-electron'
import { Url } from 'url'

import packageJson from '../../../package.json'

import { login } from '@/api/login'

import Side from '@/components/assets/side'

import Menu, { scrollToView } from './menu'
import Footer from './footer'

import { globalStyle, globalStyleFn, variables } from '@/styles'
import style from './index.style'

// Local interfaces
export interface IRelease {
  version: string
  appImage: Url
  dmg: Url
  exe: Url
}

/**
 * Index
 * @returns Index
 */
const Index = (): JSX.Element => {
  // State
  const [dockerOpen, setDockerOpen] = useState<boolean>(false)
  const [troubleshootingOpen, setTroubleshootingOpen] = useState<boolean>(false)
  const [release, setRelease] = useState<IRelease>()
  const [releaseError, setReleaseError] = useState<string>('')

  // Data
  const router = useRouter()

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

  // Release
  useEffect(() => {
    new Promise(async (resolve, reject) => {
      try {
        const releaseResponse = await fetch(
          'https://api.github.com/repos/Airthium/tanatloc-electron/releases'
        )
        const releases = await releaseResponse.json()
        const latestRelease = releases.find(
          (r: any) => !r.name.includes('-beta') && !r.name.includes('-alpha')
        )

        const assetsResponse = await fetch(latestRelease.assets_url)
        const assets = await assetsResponse.json()

        const appImage = assets.find((a: any) =>
          a.name.includes('.AppImage')
        )?.browser_download_url

        const dmg = assets.find((a: any) =>
          a.name.includes('.dmg')
        )?.browser_download_url

        const exe = assets.find((a: any) =>
          a.name.includes('.exe')
        )?.browser_download_url

        resolve({
          version: latestRelease.name,
          appImage,
          dmg,
          exe
        })
      } catch (err) {
        reject(err)
      }
    })
      .then((newRelease) => {
        setRelease(newRelease as IRelease)
      })
      .catch((err) => {
        setReleaseError(err.message)
      })
  }, [])

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
          router.push(release!.exe)
          break
        case 'MacOS':
          router.push(release!.dmg)
          break
        case 'Linux':
          router.push(release!.appImage)
          break
      }
    },
    [router, release]
  )

  /**
   * Set docker open true
   */
  const setDockerOpenTrue = useCallback(() => setDockerOpen(true), [])

  /**
   * Set docker open false
   */
  const setDockerOpenFalse = useCallback(() => setDockerOpen(false), [])

  /**
   * Set troubleshooting open true
   */
  const setTroubleshootingOpenTrue = useCallback(
    () => setTroubleshootingOpen(true),
    []
  )

  /**
   * Set troubleshooting open false
   */
  const setTroubleshootingOpenFalse = useCallback(
    () => setTroubleshootingOpen(false),
    []
  )

  /**
   * Switch to docker
   */
  const switchToDocker = useCallback(() => {
    setTroubleshootingOpen(false)
    setDockerOpen(true)
  }, [])

  /**
   * On download Windows
   */
  const onDownloadWindows = useCallback(
    () => onDownload('Windows'),
    [onDownload]
  )

  /**
   * On download MacOS
   */
  const onDownloadMacOS = useCallback(() => onDownload('MacOS'), [onDownload])

  /**
   * On download Linux
   */
  const onDownloadLinux = useCallback(() => onDownload('Linux'), [onDownload])

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
        onClose={setDockerOpenFalse}
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
        onClose={setTroubleshootingOpenFalse}
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
              <Button size="small" onClick={switchToDocker}>
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
      <Menu />

      <Layout.Content css={style.content}>
        <Space direction="vertical" size={90} css={globalStyle.fullWidth}>
          <Side
            left={
              <Space direction="vertical" size={20}>
                <Typography.Title style={{ marginBottom: 0 }}>
                  Solve your toughest numerical simulation problems
                </Typography.Title>
                <Typography.Text>
                  Tanatloc is a multi-physics FEA software for engineers and
                  researchers.
                </Typography.Text>

                <Typography.Text>
                  Use the provided models for the most common problems, make
                  your own, or partner with our experts to build one tailored to
                  your needs.
                </Typography.Text>

                <Button type="primary" onClick={getStarted}>
                  Get Started
                </Button>
              </Space>
            }
            right={<img src="images/indexpage/capture1.png" alt="tanatloc" />}
            leftCss={css([style.solveLeft, globalStyleFn.marginBottom(50)])}
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
            sideCss={css({ backgroundColor: variables.colorPrimary })}
            rightCss={css([style.models, style.indexPadding])}
            leftCss={style.indexPadding}
            id="features"
          />

          <div id="developers">
            <div css={style.indexPadding}>
              <Typography.Title level={2}>
                Solve your numerical problems locally or in the cloud, using
                dedicated plugins
              </Typography.Title>
              <div css={style.indexPlugins}>
                <div>
                  <Avatar
                    size={64}
                    shape="square"
                    src="images/indexpage/logo-rescale.svg"
                  />
                  <Typography.Title level={4}>Rescale</Typography.Title>
                  <Typography.Text css={globalStyle.textLight}>
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
                  <Typography.Text css={globalStyle.textLight}>
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
                  <Typography.Text css={globalStyle.textLight}>
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
                  <Typography.Text css={globalStyle.textLight}>
                    Upcoming
                  </Typography.Text>
                </div>
                <div>
                  <Avatar size={64} shape="square" icon={<SettingOutlined />} />
                  <Typography.Title level={4}>Your own plugin</Typography.Title>
                  <Typography.Text css={globalStyle.textLight}>
                    Paid feature
                  </Typography.Text>
                </div>
              </div>
            </div>
          </div>

          <div id="electron" css={style.electron}>
            <Typography.Title level={2}>
              Tanatloc is an FEA software based on FreeFEM, an extremely
              powerful and versatile open-source PDE solver. It runs locally
              using an electron build.
            </Typography.Title>
            <img
              src="images/indexpage/capture2.png"
              alt="tanatloc"
              css={css([style.imgShadow, globalStyle.textAlignCenter])}
            />
          </div>

          <Side
            left={
              <Space direction="vertical" size={20}>
                <div>
                  <Typography.Title level={2}>Case Study</Typography.Title>
                  <Typography.Title
                    level={3}
                    css={globalStyle.textLight}
                    style={{ marginBottom: 0 }}
                  >
                    DENSO
                  </Typography.Title>
                </div>

                <Typography.Text>
                  DENSO is a leading Japanese automotive and Fortune 500
                  company.
                </Typography.Text>

                <Typography.Text>
                  Hiroshi Ogawa, at DENSO’s Heat Exchanger R&D Division,
                  implemented a custom FreeFEM model on TANATLOC with the help
                  of Professor Atsushi Suzuki from Osaka University.
                </Typography.Text>

                <Typography.Text>
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
                css={style.indexPadding}
              />
            }
            sideCss={css([
              style.caseStudy,
              globalStyleFn.marginTop(50),
              globalStyleFn.marginBottom(50)
            ])}
            leftCss={css([
              style.caseStudyLeft,
              globalStyle.fullWidth,
              style.indexPadding
            ])}
            rightCss={style.caseStudyRight}
            id="caseStudy"
          />

          <div id="getStarted" css={globalStyleFn.marginBottom(50)}>
            <Typography.Title level={2}>Get started</Typography.Title>
            <br />
            <Steps
              direction="vertical"
              css={style.steps}
              items={[
                {
                  title: 'Install Docker Desktop',
                  description: (
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
                        <Button size="small" onClick={setDockerOpenTrue}>
                          everything is working
                        </Button>
                        .
                      </Typography>
                    </>
                  ),
                  status: 'process'
                },
                {
                  title: 'Disk space',
                  description: (
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
                  ),
                  status: 'process'
                },
                {
                  title: 'Download the latest app',
                  description: (
                    <>
                      <Typography>
                        Download the latest app for Linux, MacOS or Windows.
                      </Typography>
                      {releaseError}
                      {release ? (
                        <>
                          <Button
                            type="primary"
                            className="download"
                            onClick={onDownloadWindows}
                          >
                            <img src="/images/indexpage/windows.svg" alt="" />
                            Windows
                          </Button>
                          <Button
                            type="primary"
                            className="download"
                            onClick={onDownloadMacOS}
                          >
                            <img src="/images/indexpage/MacOS.svg" alt="" />
                            MacOS
                          </Button>
                          <Button
                            type="primary"
                            className="download"
                            onClick={onDownloadLinux}
                          >
                            <img src="/images/indexpage/Linux.svg" alt="" />
                            Linux
                          </Button>
                          <br />
                        </>
                      ) : (
                        <>
                          <Spin />
                          <br />
                        </>
                      )}
                      <span css={globalStyleFn.marginRight(10)}>
                        Version: {release ? release.version : <Spin />}
                      </span>
                      <Button
                        size="small"
                        icon={<BugOutlined />}
                        onClick={setTroubleshootingOpenTrue}
                      >
                        Troubleshooting
                      </Button>
                    </>
                  ),
                  status: 'process'
                }
              ]}
            />
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
                <Typography.Text>
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
                        <strong>Invest in our crowdfunding</strong>
                      </Button>
                    </a>
                  </>
                }
                sideCss={css({
                  backgroundColor: variables.colorPrimary
                })}
                leftCss={style.turbine}
                rightCss={css([style.indexPadding, style.crowdfunding])}
              />
            }
            sideCss={style.about}
            leftCss={style.indexPadding}
            rightCss={style.indexPadding}
            id="aboutUs"
          />
        </Space>
      </Layout.Content>
      <Footer scroll={scrollToView} />
    </Layout>
  )
}

export default Index
