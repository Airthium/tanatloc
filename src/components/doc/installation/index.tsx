/** @module Components.Doc.Installation */

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Collapse, Spin, Table, Tabs, Typography } from 'antd'
import { URL } from 'url'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

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
const Desktop: React.FunctionComponent = () => {
  const [release, setRelease] = useState<IRelease>()
  const [releaseError, setReleaseError] = useState<string>('')

  // Release
  useEffect(() => {
    asyncFunctionExec(async () => {
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

        const appImage = assets.find((a: any) => a.name.includes('.AppImage'))
          ?.browser_download_url

        const dmg = assets.find((a: any) => a.name.includes('.dmg'))
          ?.browser_download_url

        const exe = assets.find((a: any) => a.name.includes('.exe'))
          ?.browser_download_url

        setRelease({
          version: latestRelease.name,
          appImage,
          dmg,
          exe
        })
      } catch (err: any) {
        setReleaseError(err.message)
      }
    })
  }, [])

  /**
   * On download Windows
   */
  const onDownloadWindows = useCallback((): void => {
    window.open(release?.exe)
  }, [release])

  /**
   * On download MacOS
   */
  const onDownloadMacOS = useCallback((): void => {
    window.open(release?.dmg)
  }, [release])

  /**
   * On download Linux
   */
  const onDownloadLinux = useCallback((): void => {
    window.open(release?.appImage)
  }, [release])

  /**
   * Render
   */
  return (
    <>
      <Typography className={style.text}>
        <Typography.Title level={4}>Description</Typography.Title>
        <Typography.Text>
          The Tanatloc desktop application is built using{' '}
          <Link href="https://www.electronjs.org/fr/" target="_blank">
            Electron
          </Link>
        </Typography.Text>
        <Typography.Text>
          The source code of the electron build is available on{' '}
          <Link
            href="https://github.com/Airthium/tanatloc-electron"
            target="_blank"
          >
            tanatloc-electron Github repository
          </Link>
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Docker Desktop</Typography.Title>
        <Typography.Text>
          The first step is to install{' '}
          <Link
            href="https://www.docker.com/products/docker-desktop/"
            target="_blank"
          >
            Docker Desktop
          </Link>
        </Typography.Text>
        <Typography.Text>
          Ensure all is working fine before continuing, sometimes Docker Desktop
          needs to install Linux kernel, WSL2 backend, ... and reboot the
          computer
        </Typography.Text>
        <Typography.Text className={style.tips}>
          On Linux, you can activate Docker Desktop autostart using
          <Typography.Text code copyable>
            systemctl --user enable docker-desktop.service
          </Typography.Text>
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
                {/**/}Windows
              </Button>
            ) : null}
            {release.dmg ? (
              <Button
                type="primary"
                onClick={onDownloadMacOS}
                className={style.downloadButton}
              >
                <img src="/images/indexpage/MacOS.svg" alt="" />
                {/**/}MacOS
              </Button>
            ) : null}
            {release.appImage ? (
              <Button
                type="primary"
                onClick={onDownloadLinux}
                className={style.downloadButton}
              >
                <img src="/images/indexpage/Linux.svg" alt="" />
                {/**/}Linux
              </Button>
            ) : null}
            <Typography.Text>Version: {release.version}</Typography.Text>
          </>
        ) : (
          <Spin />
        )}

        <Typography.Text className={style.tips}>
          On Linux, you must allow execution of the AppImage file.
          <br />
          Right-click, Properties, Permissions, Allow executing file as program
          <br />
          <strong>Or</strong>
          <br />
          <Typography.Text code copyable>
            chmod +x ./Tanatloc-{release?.version.replace('v', '')}.AppImage
          </Typography.Text>
        </Typography.Text>

        <Typography.Text className={style.tips}>
          If you want to try a beta version, you can directly look at{' '}
          <Link
            href="https://github.com/Airthium/tanatloc-electron/releases"
            target="_blank"
            rel="noreferrer"
          >
            tanatloc-electron Github releases
          </Link>
        </Typography.Text>
      </Typography>
    </>
  )
}

/**
 * Server
 * @returns Server
 */
const Server: React.FunctionComponent = () => {
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
          <Link
            href="https://github.com/Airthium/tanatloc-docker"
            target="_blank"
          >
            tanatloc-docker Github repository
          </Link>
        </Typography.Text>
        <Typography.Text>
          The Docker Compose configuration, and a deployment script are
          available on{' '}
          <Link
            href="https://github.com/Airthium/tanatloc-deploy"
            target="_blank"
          >
            tanatloc-deploy Github repository
          </Link>
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Docker</Typography.Title>
        <Typography.Text>
          Install{' '}
          <Link href="https://docs.docker.com/engine/install/" target="_blank">
            Docker Engine
          </Link>{' '}
          and{' '}
          <Link href="https://docs.docker.com/compose/install/" target="_blank">
            Docker Compose
          </Link>
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Certbot</Typography.Title>
        <Typography.Text>
          If you need an HTTPS certificate, install{' '}
          <Link
            href="https://eff-certbot.readthedocs.io/en/stable/install.html"
            target="_blank"
          >
            Certbot
          </Link>
        </Typography.Text>
      </Typography>

      <Typography className={style.text}>
        <Typography.Title level={4}>Deployment script</Typography.Title>
        <Typography.Text>
          <strong>Clone</strong> the tanatloc-deploy repository
        </Typography.Text>
        <Typography.Text code copyable>
          git clone git@github.com:Airthium/tanatloc-deploy.git
        </Typography.Text>
        <Typography.Text>Move in the directory</Typography.Text>
        <Typography.Text code copyable>
          cd tanatloc-deploy
        </Typography.Text>
        <Typography.Text>
          <strong>Configure</strong> your deployment using{' '}
          <Typography.Text code>tanatloc.sh</Typography.Text> with the following
          options if necessary
        </Typography.Text>
        <Collapse
          items={[
            {
              key: 'set',
              label: <Typography.Text code>./tanatloc.sh set</Typography.Text>,
              children: (
                <Table
                  pagination={false}
                  columns={setColumns}
                  dataSource={setData}
                />
              )
            },
            {
              key: 'add',
              label: <Typography.Text code>./tanatloc.sh add</Typography.Text>,
              children: (
                <Table
                  pagination={false}
                  columns={addColumns}
                  dataSource={addData}
                />
              )
            }
          ]}
        />
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

        <Typography.Title level={4}>Update</Typography.Title>
        <Typography.Text>
          Before updating Tanatloc, make a complete{' '}
          <Typography.Text strong>BACKUP</Typography.Text>
        </Typography.Text>

        <Typography.Title level={5}>Backup</Typography.Title>
        <Typography.Text>
          First, ensure database backup path is correctly defined using
        </Typography.Text>
        <Typography.Text code copyable>
          ./tanatloc.sh set database_backup /existing/path/to/backup
        </Typography.Text>
        <Typography.Text className={style.tips}>
          The default backup path is{' '}
          <Typography.Text code>
            /media/tanatloc-backup/database
          </Typography.Text>
          .<br />
          If you want to use it, create the folder using
          <Typography.Text code copyable>
            mkdir -p /media/tanatloc-backup/database
          </Typography.Text>
        </Typography.Text>

        <Typography.Text>Run the database backup script using</Typography.Text>
        <Typography.Text code copyable>
          ./tanatloc.sh database backup
        </Typography.Text>

        <Typography.Title level={5}>Update</Typography.Title>
        <Typography.Text>Run the update script</Typography.Text>
        <Typography.Text code copyable>
          ./tanatloc.sh update
        </Typography.Text>
        <Typography.Text>
          The update script will stop and delete the currently running docker
          image, pull the new ones and restart Tanatloc.
        </Typography.Text>

        <Typography.Title level={5}>
          Remove and Restore the database
        </Typography.Title>
        <Typography.Text>
          Only if you encounter an error during the update process, delete and
          restore the database
        </Typography.Text>
        <Typography.Text>
          Depending on your database location (docker or system PostgreSQL),
          delete the database.
        </Typography.Text>
        <Typography.Text>
          For docker, juste remove the{' '}
          <Typography.Text code>tanatloc-postgres</Typography.Text> container
          directly in Docker Desktop or in commaand line
        </Typography.Text>
        <Typography.Text code copyable>
          id=$(docker ps -aqf &quot;name=tanatloc-postgres&quot;)
        </Typography.Text>
        <Typography.Text code copyable>
          docker stop $id
        </Typography.Text>
        <Typography.Text code copyable>
          docker rm $id
        </Typography.Text>
        <Typography.Text>For system PostgreSQL:</Typography.Text>
        <Typography.Text code copyable>
          psql -U postgres
        </Typography.Text>
        <Typography.Text code copyable>
          DROP DATABASE tanatloc_postgres
        </Typography.Text>
        <Typography.Text>Restore the database with</Typography.Text>
        <Typography.Text code>
          ./tanatloc.sh database restore /existing/path/to/backup/file-date.sql
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
const Installation: React.FunctionComponent = () => {
  // Data
  const router = useRouter()
  const query = router.query

  /**
   * On change
   * @param key Key
   */
  const onChange = useCallback(
    (key: string) => {
      asyncFunctionExec(async () => {
        await router.push({
          pathname: '/doc',
          query: {
            section: 'installation',
            tab: key
          }
        })
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
        defaultActiveKey={(query.tab as string) ?? 'desktop'}
        items={tabs}
        onChange={onChange}
      />
    </>
  )
}

export default Installation
