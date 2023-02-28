/** @module Components.Doc.Installation */

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Collapse, Spin, Table, Tabs, Typography } from 'antd'
import { URL } from 'url'

import style from '../index.module.css'

// Local interfaces
export interface IRelease {
  version: string
  appImage: URL
  dmg: URL
  exe: URL
}

/**
 * Desktop
 * @returns Desktop
 */
const Desktop = (): JSX.Element => {
  const [release, setRelease] = useState<IRelease>()
  const [releaseError, setReleaseError] = useState<string>('')

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
   * On download Windows
   */
  const onDownloadWindows = useCallback(
    () => window.open(release?.exe),
    [release]
  )

  /**
   * On download MacOS
   */
  const onDownloadMacOS = useCallback(
    () => window.open(release?.dmg),
    [release]
  )

  /**
   * On download Linux
   */
  const onDownloadLinux = useCallback(
    () => window.open(release?.appImage),
    [release]
  )

  /**
   * Render
   */
  return (
    <>
      <Typography className={style.text}>
        <Typography.Title level={4}>Description</Typography.Title>
        <Typography.Text>
          The Tanatloc desktop application is build using{' '}
          <a
            href="https://www.electronjs.org/fr/"
            target="_blank"
            rel="noreferrer"
          >
            Electron
          </a>
        </Typography.Text>
        <Typography.Text>
          The source code of the electron build is available on{' '}
          <a
            href="https://github.com/Airthium/tanatloc-electron"
            target="_blank"
            rel="noreferrer"
          >
            tanatloc-electron Github repository
          </a>
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Docker Desktop</Typography.Title>
        <Typography.Text>
          The first step is to install{' '}
          <a
            href="https://www.docker.com/products/docker-desktop/"
            target="_blank"
            rel="noreferrer"
          >
            Docker Desktop
          </a>
        </Typography.Text>
        <Typography.Text>
          Ensure all is working fine before continue, sometimes Docker Desktop
          needs to install Linux kernel, WSL2 backend, ... and reboot the
          computer
        </Typography.Text>
        <Typography.Text className={style.tips}>
          Docker Desktop must display &apos;Docker Desktop Running&apos;
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Download the app</Typography.Title>
        <Typography.Text>
          Download the latest app version for your OS, and run it
        </Typography.Text>

        {releaseError}
        {release ? (
          <>
            {release.exe ? (
              <Button
                type="primary"
                onClick={onDownloadWindows}
                className={style.downloadButton}
              >
                <img src="/images/indexpage/windows.svg" alt="" />
                Windows
              </Button>
            ) : null}
            {release.dmg ? (
              <Button
                type="primary"
                onClick={onDownloadMacOS}
                className={style.downloadButton}
              >
                <img src="/images/indexpage/MacOS.svg" alt="" />
                MacOS
              </Button>
            ) : null}
            {release.appImage ? (
              <Button
                type="primary"
                onClick={onDownloadLinux}
                className={style.downloadButton}
              >
                <img src="/images/indexpage/Linux.svg" alt="" />
                Linux
              </Button>
            ) : null}
            <Typography.Text>Version: {release.version}</Typography.Text>
          </>
        ) : (
          <>
            <Spin />
          </>
        )}

        <Typography.Text className={style.tips}>
          On Linux, you must allow execution of the AppImage file.
          <br />
          Right-click, Properties, Permissions, Allow executing file as program
          <br />
          <strong>Or</strong>
          <br />
          <Typography.Text code>
            chmod +x ./Tanatloc-{release?.version.replace('v', '')}.AppImage
          </Typography.Text>
        </Typography.Text>

        <Typography.Text className={style.tips}>
          If you want to try a beta version, you can directly look at{' '}
          <a
            href="https://github.com/Airthium/tanatloc-electron/releases"
            target="_blank"
            rel="noreferrer"
          >
            tanatloc-electron Github release
          </a>
        </Typography.Text>
      </Typography>
    </>
  )
}

/**
 * Server
 * @returns Server
 */
const Server = (): JSX.Element => {
  // Set data
  const setColumns = [
    {
      key: 'variable',
      dataIndex: 'variable',
      title: 'Variable',
      render: (text: string) => <Typography.Text code>{text}</Typography.Text>
    },
    { key: 'description', dataIndex: 'description', title: 'Description' },
    {
      key: 'default',
      dataIndex: 'default',
      title: 'Default',
      render: (text: string) =>
        text && <Typography.Text code>{text}</Typography.Text>
    }
  ]

  const setData = [
    {
      variable: 'tanatloc_tag',
      description: 'Tanatloc Docker tag',
      default: 'latest'
    },
    {
      variable: 'database_password',
      description: 'Database password',
      default: 'password'
    },
    {
      variable: 'database_backup',
      description: 'Database backup path, must be absolute',
      default: '/media/tanatloc-backup/database'
    },
    {
      variable: 'domain',
      description: 'Custom domaine name, must start with http:// or https://'
    },
    {
      variable: 'ipv6',
      description: 'ON or OFF',
      default: 'ON'
    },
    {
      variable: 'http_port',
      description: 'HTTP port',
      default: '80'
    },
    {
      variable: 'https_port',
      description: 'HTTPS port',
      default: '443'
    },
    {
      variable: 'http_proxy',
      description: 'HTTP proxy url'
    },
    {
      variable: 'https_proxy',
      description: 'HTTPS proxy url'
    },
    {
      variable: 'storage',
      description: 'Storage path, must be absolute',
      default: 'docker volume'
    },
    {
      variable: 'storage_backup',
      description: 'Storage backup path, must be absolute',
      default: '/media/tanatloc-backup/storage'
    },
    {
      variable: 'additional_path',
      description: 'Additional $PATH'
    },
    {
      variable: 'sharetask_jvm',
      description: 'SHARETASK_JVM environment variable'
    }
  ]

  // Add data
  const addColumns = [
    {
      key: 'variable',
      dataIndex: 'variable',
      title: 'Variable'
    },
    {
      key: 'description',
      dataIndex: 'description',
      title: 'Description'
    },
    {
      key: 'parameters',
      dataIndex: 'parameters',
      title: 'Parameters'
    }
  ]

  const addData = [
    {
      variable: 'volume',
      description: 'Add a volume in Tanatloc service',
      parameters: 'type, source, target'
    },
    {
      variable: 'dns',
      description: 'Add a DNS in Tanatloc service',
      parameters: 'dns'
    },
    {
      variable: 'extra_host',
      description: 'Add an extra host in Tanatloc service',
      parameters: 'extra_host'
    }
  ]

  /**
   * Render
   */
  return (
    <>
      <Typography className={style.text}>
        <Typography.Title level={4}>Description</Typography.Title>
        <Typography.Text>
          The Tanatloc server runs through a Docker, with Docker Compose.
        </Typography.Text>
        <Typography.Text>
          The source code of the Docker build is available on{' '}
          <a
            href="https://github.com/Airthium/tanatloc-docker"
            target="_blank"
            rel="noreferrer"
          >
            tanatloc-docker Github repository
          </a>
        </Typography.Text>
        <Typography.Text>
          The Docker Compose configuration, and a deployment script are
          available on{' '}
          <a
            href="https://github.com/Airthium/tanatloc-deploy"
            target="_blank"
            rel="noreferrer"
          >
            tanatloc-deploy Github repository
          </a>
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Docker</Typography.Title>
        <Typography.Text>
          Install{' '}
          <a
            href="https://docs.docker.com/engine/install/"
            target="_blank"
            rel="noreferrer"
          >
            Docker Engine
          </a>{' '}
          and{' '}
          <a
            href="https://docs.docker.com/compose/install/"
            target="_blank"
            rel="noreferrer"
          >
            Docker Compose
          </a>
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Certbot</Typography.Title>
        <Typography.Text>
          If you need an HTTPS certificate, install{' '}
          <a
            href="https://eff-certbot.readthedocs.io/en/stable/install.html"
            target="_blank"
            rel="noreferrer"
          >
            Certbot
          </a>
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Deployment script</Typography.Title>
        <Typography.Text>
          <strong>Clone</strong> the tanatloc-deploy repository
        </Typography.Text>
        <Typography.Text code>
          git clone git@github.com:Airthium/tanatloc-deploy.git
        </Typography.Text>
        <Typography.Text>Move in the directory</Typography.Text>
        <Typography.Text code>cd tanatloc-deploy</Typography.Text>
        <Typography.Text>
          <strong>Configure</strong> your deployment using{' '}
          <Typography.Text code>tanatloc.sh</Typography.Text> with the following
          options if necessary
        </Typography.Text>
        <Collapse>
          <Collapse.Panel
            key="set"
            header={<Typography.Text code>./tanatloc.sh set</Typography.Text>}
          >
            <Table
              pagination={false}
              columns={setColumns}
              dataSource={setData}
            />
          </Collapse.Panel>
          <Collapse.Panel
            key="add"
            header={<Typography.Text code>./tanatloc.sh add</Typography.Text>}
          >
            <Table
              pagination={false}
              columns={addColumns}
              dataSource={addData}
            />
          </Collapse.Panel>
        </Collapse>
        <Typography.Text>
          <strong>Start</strong> Tanatloc
        </Typography.Text>
        <Typography.Text code>./tanatloc.sh start</Typography.Text>
        <Typography.Text className={style.warnings}>
          The first start can take time, you will not have access to Tanatloc
          before the start process ends.
        </Typography.Text>
        <Typography.Text className={style.tips}>
          You can have a look on the log using{' '}
          <Typography.Text code>./tanatloc.sh log</Typography.Text>
        </Typography.Text>
        <Typography.Text className={style.tips}>
          You can display all available commands of{' '}
          <Typography.Text code>./tanatloc.sh</Typography.Text> using{' '}
          <Typography.Text code>./tanatloc.sh help</Typography.Text>
        </Typography.Text>
      </Typography>
    </>
  )
}

/**
 * Tabs
 */
const tabs = [
  {
    key: 'desktop',
    label: 'Desktop application',
    children: <Desktop />
  },
  {
    key: 'server',
    label: 'Server',
    children: <Server />
  }
]

/**
 * Installation
 * @returns Installation
 */
const Installation = (): JSX.Element => {
  // Data
  const router = useRouter()
  const query = router.query

  /**
   * On change
   * @param key Key
   */
  const onChange = useCallback(
    (key: string) => {
      router.push({
        pathname: '/doc',
        query: {
          section: 'installation',
          tab: key
        }
      })
    },
    [router]
  )

  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={3}>Installation</Typography.Title>
      <Tabs
        activeKey={(query.tab as string) || 'desktop'}
        items={tabs}
        onChange={onChange}
      />
    </>
  )
}

export default Installation
