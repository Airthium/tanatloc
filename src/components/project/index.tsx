/** @module Components.Project */

import dynamic from 'next/dynamic'
import { NextRouter, useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Layout, Menu, Tooltip, Typography } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import {
  CodeSandboxOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  UploadOutlined,
  PlusCircleOutlined,
  AuditOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons'
import { css } from '@emotion/react'

import { IModel } from '@/models/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'
import { GoBack } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import Loading from '@/components/loading'
import NotAuthorized from '@/components/notauthorized'

import SelectProvider from '@/context/select'

import {
  IFrontGeometriesItem,
  IFrontProject,
  IFrontNewSimulation,
  IFrontSimulationsItem,
  IFrontResult
} from '@/api/index.d'
import UserAPI from '@/api/user'
import ProjectAPI from '@/api/project'
import SimulationAPI from '@/api/simulation'
import GeometryAPI from '@/api/geometry'

import { globalStyle } from '@/styles'
import style from './index.style'

import Panel from './panel'
import Geometry from './geometry'
import View from './view'
import Simulation from './simulation'

const Data = dynamic(() => import('./data'), { ssr: false })

/**
 * Menu items
 */
export const menuItems = {
  dashboard: {
    key: 'dashboard'
  },
  geometries: {
    label: 'GEOMETRIES',
    key: 'geometries'
  },
  simulations: {
    label: 'SIMULATIONS',
    key: 'simulations'
  }
}

/**
 * Errors
 */
export const errors = {
  user: 'Unable to get user',
  project: 'Unable to get project',
  simulations: 'Unable to get simulations',
  geometries: 'Unable to get geometries',
  add: 'Unable to add simulation'
}

/**
 * Handle dashboard
 * @param router Router
 * @param page Page
 * @param workspaceId Workspace id
 */
export const handleDashboard = (
  router: NextRouter,
  page?: string,
  workspaceId?: string
): void => {
  router.push({
    pathname: '/dashboard',
    query: { page, workspaceId }
  })
}

/**
 * On selector
 * @param project Project
 * @param scheme Simulation scheme
 * @param swr SWR
 */
export const onSelector = async (
  project: IFrontProject,
  scheme: IModel,
  swr: {
    addOneSimulation: (simulation: IFrontNewSimulation) => void
    mutateProject: (project: Partial<IFrontProject>) => void
  }
): Promise<void> => {
  try {
    // Add
    const simulation = await SimulationAPI.add(
      { id: project.id },
      { name: scheme.name, scheme }
    )

    // Mutate
    swr.addOneSimulation(simulation)
    swr.mutateProject({
      id: project.id,
      simulations: [...(project.simulations || []), simulation.id]
    })
  } catch (err) {
    ErrorNotification(errors.add, err)
    throw err
  }
}

/**
 * Project
 * @returns Project
 */
const Project = (): JSX.Element => {
  // Router
  const router = useRouter()
  const {
    page,
    workspaceId,
    projectId
  }: { page?: string; workspaceId?: string; projectId?: string } = router.query

  // State
  const [geometryAddVisible, setGeometryAddVisible] = useState<boolean>(false)
  const [geometries, setGeometries] = useState<IFrontGeometriesItem[]>([])

  const [simulationSelectorVisible, setSimulationSelectorVisible] =
    useState<boolean>(false)
  const [simulation, setSimulation] = useState<IFrontSimulationsItem>()

  const [result, setResult] = useState<IFrontResult>()

  const [postprocessing, setPostprocessing] = useState<IFrontResult>()

  const [menuKey, setMenuKey] = useState<{
    key: string
    id: string
    item?: string
  }>()

  const [panel, setPanel] = useState<JSX.Element>()
  const [panelVisible, setPanelVisible] = useState<boolean>(true)

  // Data
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()
  const [project, { mutateProject, errorProject, loadingProject }] =
    ProjectAPI.useProject(projectId)

  const [
    loadedSimulations,
    {
      addOneSimulation,
      delOneSimulation,
      mutateOneSimulation,
      errorSimulations,
      loadingSimulations
    }
  ] = SimulationAPI.useSimulations(project?.simulations)
  const [
    loadedGeometries,
    {
      addOneGeometry,
      delOneGeometry,
      mutateOneGeometry,
      errorGeometries,
      loadingGeometries
    }
  ] = GeometryAPI.useGeometries(project?.geometries)

  /**
   * Add geometry
   * @param geometry Geoemtry
   */
  const addGeometry = useCallback((geometry: IFrontGeometriesItem): void => {
    setGeometries((prev) => [...prev, geometry])
  }, [])

  /**
   * Del geometry
   * @param geometry Geometry
   */
  const delGeometry = useCallback(
    (geometry: IFrontGeometriesItem): void => {
      const index = geometries.findIndex((g) => g.id === geometry.id)
      if (index === -1) return
      setGeometries((prev) => [
        ...prev.slice(0, index),
        ...prev.slice(index + 1)
      ])
    },
    [geometries]
  )

  /**
   * On panel close
   */
  const onPanelClose = useCallback((): void => {
    setPanel(undefined)
    setMenuKey(undefined)
  }, [])

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser, router])

  // Errors
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
    if (errorProject) ErrorNotification(errors.project, errorProject)
    if (errorSimulations)
      ErrorNotification(errors.simulations, errorSimulations)
    if (errorGeometries) ErrorNotification(errors.geometries, errorGeometries)
  }, [errorUser, errorProject, errorSimulations, errorGeometries])

  // Auto open geometry add
  useCustomEffect(() => {
    if (!loadingProject && !loadingGeometries) {
      if (!loadedGeometries.length) setGeometryAddVisible(true)
      else setGeometryAddVisible(false)
    } else {
      setGeometryAddVisible(false)
    }
  }, [loadingProject, loadingGeometries, loadedGeometries])

  // Update geometry
  useCustomEffect(
    () => {
      if (loadingGeometries) return

      if (geometries.length) {
        let needUpdate = false
        const newGeometries = geometries
          .map((geometry) => {
            const current = loadedGeometries.find((g) => g.id === geometry?.id)
            if (current) {
              if (
                JSON.stringify({ ...current, visible: undefined }) !==
                JSON.stringify({ ...geometry, visible: undefined })
              ) {
                // Update
                needUpdate = true
                return current
              }
              return geometry
            } else {
              // Remove
              needUpdate = true
              return null
            }
          })
          .filter((g) => g) as IFrontGeometriesItem[]

        if (needUpdate) setGeometries(newGeometries)
      } else {
        setGeometries(loadedGeometries[0] ? [loadedGeometries[0]] : [])
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [loadingGeometries, loadedGeometries, geometries],
    [setGeometries]
  )

  // Update simulation
  useCustomEffect(
    () => {
      if (!loadingSimulations && simulation) {
        const current = loadedSimulations.find((s) => s.id === simulation?.id)
        if (current) {
          if (JSON.stringify(current) !== JSON.stringify(simulation)) {
            setSimulation(current)

            if (menuKey && menuKey.key === menuItems.simulations.key)
              setSimulationPanel(menuKey.id, menuKey.item!)
          }
        } else {
          onPanelClose()
          setSimulation(undefined)
        }
      }
    },
    [loadedSimulations, loadingSimulations, simulation, menuKey],
    [setSimulation, onPanelClose]
  )

  /**
   * On geometry cleanup
   * @param id Id
   */
  const onGeometryCleanup = useCallback(
    (id: string): void => {
      const index = loadedGeometries.findIndex((geometry) => geometry.id === id)
      if (index !== -1)
        setGeometries((prev) => [
          ...prev.slice(0, index),
          { id: '0', needCleanup: true } as IFrontGeometriesItem,
          ...prev.slice(index + 1)
        ])
    },
    [loadedGeometries]
  )

  /**
   * Set geometry panel
   * @param id Geometry id
   */
  const setGeometryPanel = useCallback(
    (id: string): void => {
      const toDisplay = loadedGeometries.find((g) => g.id === id)
      if (!toDisplay) return

      const geometry = geometries.find((g) => g.id === id)
      if (!geometry) {
        setGeometries((prev) => [...prev, { ...toDisplay, visible: true }])
      }

      setPanel(
        <Panel visible={true} title={'Geometry'} onClose={onPanelClose}>
          <Geometry
            project={{
              id: project.id,
              geometries: project.geometries
            }}
            geometry={{
              id: toDisplay.id,
              name: toDisplay.name,
              summary: toDisplay.summary
            }}
            swr={{ mutateProject, mutateOneGeometry, delOneGeometry }}
            close={onPanelClose}
            onCleanup={onGeometryCleanup}
          />
        </Panel>
      )
    },
    [
      project,
      loadedGeometries,
      geometries,
      mutateProject,
      mutateOneGeometry,
      delOneGeometry,
      onGeometryCleanup,
      onPanelClose
    ]
  )

  /**
   * Set simulation panel About
   * @param current Current simulation
   */
  const setSimulationPanelAbout = useCallback(
    (current: IFrontSimulationsItem): void => {
      setPanel(
        <Panel visible={true} title={'About'} onClose={onPanelClose}>
          <Simulation.About
            project={{
              id: project.id,
              simulations: project.simulations
            }}
            simulation={{
              id: current.id,
              name: current.name,
              scheme: current.scheme
            }}
            swr={{
              mutateProject,
              addOneSimulation,
              delOneSimulation,
              mutateOneSimulation
            }}
          />
        </Panel>
      )
    },
    [
      project,
      mutateProject,
      addOneSimulation,
      delOneSimulation,
      mutateOneSimulation,
      onPanelClose
    ]
  )

  /**
   * Set simulation panel Geometry
   * @param current Current simulation
   */
  const setSimulationPanelGeometry = useCallback(
    (current: IFrontSimulationsItem): void => {
      setPanel(
        <Panel visible={true} title={'Geometry'} onClose={onPanelClose}>
          <Simulation.Geometry
            loadedGeometries={loadedGeometries}
            geometries={geometries.map((geometry) => ({
              id: geometry.id,
              summary: geometry.summary
            }))}
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            setGeometries={setGeometries}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [loadedGeometries, geometries, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Parameters
   * @param current Current simulation
   */
  const setSimulationPanelParameters = useCallback(
    (current: IFrontSimulationsItem): void => {
      setPanel(
        <Panel visible={true} title={'Parameters'} onClose={onPanelClose}>
          <Simulation.Parameters
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Materials
   * @param current Current simulation
   */
  const setSimulationPanelMaterials = useCallback(
    (current: IFrontSimulationsItem): void => {
      setPanel(
        <Panel
          visible={panelVisible}
          title={'Materials'}
          onClose={onPanelClose}
        >
          <Simulation.Materials
            geometries={geometries.map((geometry) => ({
              id: geometry.id,
              name: geometry.name,
              summary: geometry.summary
            }))}
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            swr={{
              mutateOneSimulation
            }}
            setVisible={(visible) => setPanelVisible(visible)}
          />
        </Panel>
      )
    },
    [geometries, panelVisible, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Initialization
   * @param current Current simulation
   */
  const setSimulationPanelInitialization = useCallback(
    (current: IFrontSimulationsItem): void => {
      setPanel(
        <Panel visible={true} title={'Initialization'} onClose={onPanelClose}>
          <Simulation.Initialization
            simulations={loadedSimulations}
            simulation={current}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [loadedSimulations, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Boundary conditions
   * @param current Current simulation
   */
  const setSimulationPanelBoundaryConditions = useCallback(
    (current: IFrontSimulationsItem): void => {
      setPanel(
        <Panel
          visible={panelVisible}
          title={'Boundary conditions'}
          onClose={onPanelClose}
        >
          <Simulation.BoundaryConditions
            geometries={geometries.map((geometry) => ({
              id: geometry.id,
              name: geometry.name,
              summary: geometry.summary
            }))}
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            swr={{
              mutateOneSimulation
            }}
            setVisible={(visible) => setPanelVisible(visible)}
          />
        </Panel>
      )
    },
    [geometries, panelVisible, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel Run
   * @param current Current simulation
   */
  const setSimulationPanelRun = useCallback(
    (current: IFrontSimulationsItem): void => {
      setPanel(
        <Panel visible={panelVisible} title={'Run'} onClose={onPanelClose}>
          <Simulation.Run
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            result={
              result && {
                name: result.name,
                fileName: result.fileName
              }
            }
            setResult={setResult}
            setPostprocessing={setPostprocessing}
            setVisible={(visible) => setPanelVisible(visible)}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [result, panelVisible, mutateOneSimulation, onPanelClose]
  )

  /**
   * Set simulation panel
   * @param id Simulation id
   * @param item Item
   */
  const setSimulationPanel = useCallback(
    (id: string, item: string) => {
      const current = loadedSimulations.find(
        (s) => s.id === id
      ) as IFrontSimulationsItem
      if (!current) return

      setSimulation(current)

      // Display geometries
      const geometryId = current.scheme?.configuration?.geometry?.value
      const geometriesIds = current.scheme?.configuration?.geometry?.values
      if (geometryId) {
        const newGeometry = loadedGeometries.find((g) => g.id === geometryId)
        if (newGeometry) setGeometries([newGeometry])
      } else if (geometriesIds) {
        const newGeometries = loadedGeometries.filter((g) =>
          geometriesIds.includes(g.id)
        )
        setGeometries(newGeometries)
      }

      switch (item) {
        case 'about':
          setSimulationPanelAbout(current)
          break
        case 'geometry':
          setSimulationPanelGeometry(current)
          break
        case 'parameters':
          setSimulationPanelParameters(current)
          break
        case 'materials':
          setSimulationPanelMaterials(current)
          break
        case 'initialization':
          setSimulationPanelInitialization(current)
          break
        case 'boundaryConditions':
          setSimulationPanelBoundaryConditions(current)
          break
        case 'run':
          setSimulationPanelRun(current)
          break
        default:
          setPanel(undefined)
      }
    },
    [
      loadedGeometries,
      loadedSimulations,
      setSimulationPanelAbout,
      setSimulationPanelGeometry,
      setSimulationPanelParameters,
      setSimulationPanelMaterials,
      setSimulationPanelInitialization,
      setSimulationPanelBoundaryConditions,
      setSimulationPanelRun
    ]
  )

  // Update panel
  useCustomEffect(
    () => {
      if (!menuKey) return

      if (menuKey.key === menuItems.geometries.key) {
        setGeometryPanel(menuKey.id)
      } else {
        //menuKey.key === menuItems.simulations.key)
        setSimulationPanel(menuKey.id, menuKey.item!)

        // Force geometry
        if (menuKey.item !== 'run') {
          setResult(undefined)
          setPostprocessing(undefined)
        }
      }
    },
    [menuKey, panelVisible, result],
    [setGeometryPanel, setSimulationPanel, onPanelClose]
  )

  // Close result
  useEffect(() => {
    if (!result && postprocessing) setPostprocessing(undefined)
  }, [result, postprocessing])

  /**
   * On menu click
   * @param data Data
   */
  const onMenuClick = useCallback(
    ({ keyPath }: { keyPath: string[] }): void => {
      const key = keyPath.pop() as string
      const subKey = keyPath.pop() as string
      const subSubKey = keyPath.pop()

      let item
      if (subSubKey) {
        item = subSubKey.split('&').pop()
      }

      setMenuKey({
        key,
        id: subKey,
        item
      })
    },
    []
  )

  // Geometries render build
  const geometriesRender = useMemo(
    () =>
      loadedGeometries.map((g) => {
        const visible = geometries.find((geometry) => geometry.id === g.id)
        return {
          key: g.id,
          icon: <PieChartOutlined />,
          label: (
            <div>
              {g.name}
              {visible ? (
                <EyeOutlined
                  onClick={(e) => {
                    e.stopPropagation()
                    if (
                      panel?.props?.children?.type?.componentName ===
                      Geometry.componentName
                    )
                      onPanelClose()
                    delGeometry(g)
                  }}
                />
              ) : (
                <EyeInvisibleOutlined
                  onClick={(e) => {
                    e.stopPropagation()
                    addGeometry(g)
                  }}
                />
              )}
            </div>
          )
        }
      }),
    [
      loadedGeometries,
      geometries,
      panel,
      addGeometry,
      delGeometry,
      onPanelClose
    ]
  )

  // Simulations render build
  const simulationsRender = useMemo(
    () =>
      loadedSimulations.map((s) => {
        const configuration = s.scheme.configuration || {}
        const categories: ItemType[] = []
        Object.keys(configuration).forEach((key) => {
          if (key === 'dimension') return
          const child = configuration[key]
          let icon = <CheckCircleOutlined style={{ color: 'green' }} />
          if (child.error)
            icon = <CloseCircleOutlined style={{ color: 'red' }} />
          if (!child.done)
            icon = <ExclamationCircleOutlined style={{ color: 'orange' }} />

          // Deleted simulation's geometry
          if (
            key === 'geometry' &&
            !loadedGeometries.filter((g) => g.id === child.value).length &&
            !loadingGeometries
          ) {
            icon = <ExclamationCircleOutlined style={{ color: 'orange' }} />
            child.done = null
          }

          categories[child.index] = {
            key: s.id + '&' + key,
            disabled: !geometries.length,
            icon: icon,
            label: child.title
          }
        })

        let label = s.name
        if (s.scheme.user)
          label = (
            <>
              <Tooltip title="User algorithm" placement="right">
                <AuditOutlined
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 14,
                    fontSize: 14,
                    color: '#fad114'
                  }}
                />
              </Tooltip>
              {s.name}
            </>
          )

        return {
          key: s.id,
          icon: <CodeSandboxOutlined />,
          label: label,
          children: [
            {
              key: s.id + '&about',
              disabled: !geometries.length,
              icon: <CheckCircleOutlined style={{ color: 'green' }} />,
              label: 'About'
            },
            ...categories
          ]
        }
      }),
    [geometries, loadingGeometries, loadedGeometries, loadedSimulations]
  )

  /**
   * Render
   */
  if (!user || loadingUser || loadingProject) return <Loading.Simple />
  if (project.id === '0') return <NotAuthorized />
  return (
    <SelectProvider>
      <Layout hasSider={true}>
        <Layout.Sider theme="light" css={style.sider} width={256}>
          <div css={globalStyle.logo}>
            <img src="/images/logo.svg" alt="Tanatloc" />
          </div>
          <Menu
            css={style.menu1}
            mode="inline"
            items={[
              {
                key: 'menu-go-back',
                disabled: true,
                style: { cursor: 'unset', margin: '10px 0', paddingLeft: 10 },
                label: (
                  <GoBack
                    buttonCss={globalStyle.fullWidth}
                    onClick={() => handleDashboard(router, page, workspaceId)}
                  >
                    Return to dashboard
                  </GoBack>
                )
              },
              {
                type: 'divider'
              },
              {
                key: 'title',
                disabled: true,
                className: 'Menu-title',
                label: (
                  <Typography.Paragraph ellipsis={{ tooltip: true, rows: 2 }}>
                    {project.title}
                  </Typography.Paragraph>
                )
              }
            ]}
          />
          <div css={style.menuScroll}>
            <Menu
              mode="inline"
              css={style.menu2}
              defaultOpenKeys={[
                menuItems.geometries.key,
                menuItems.simulations.key
              ]}
              items={[
                {
                  key: menuItems.geometries.key,
                  className: 'SubMenu',
                  icon: loadingGeometries ? (
                    <LoadingOutlined />
                  ) : (
                    <PieChartOutlined />
                  ),
                  label: (
                    <Typography.Text strong>
                      {menuItems.geometries.label} ({loadedGeometries.length})
                    </Typography.Text>
                  ),
                  children: [
                    {
                      key: 'new_geometry',
                      disabled: true,
                      label: (
                        <Button
                          icon={<UploadOutlined />}
                          onClick={() => setGeometryAddVisible(true)}
                        >
                          New Geometry
                        </Button>
                      )
                    },
                    {
                      key: 'geometry-needed',
                      disabled: true,
                      className: geometries.length ? 'display-none' : '',
                      icon: (
                        <ExclamationCircleOutlined style={{ color: 'red' }} />
                      ),
                      label: 'A Geometry is needed'
                    },
                    ...geometriesRender
                  ]
                },
                {
                  key: menuItems.simulations.key,
                  className: 'SubMenu',
                  icon: loadingSimulations ? (
                    <LoadingOutlined />
                  ) : (
                    <CodeSandboxOutlined />
                  ),
                  label: (
                    <Typography.Text strong>
                      {menuItems.simulations.label} ({loadedSimulations.length})
                    </Typography.Text>
                  ),
                  children: [
                    {
                      key: 'new_simulation',
                      disabled: true,
                      label: (
                        <Button
                          disabled={!loadedGeometries.length}
                          icon={<PlusCircleOutlined />}
                          onClick={() => setSimulationSelectorVisible(true)}
                        >
                          New Simulation
                        </Button>
                      )
                    },
                    ...simulationsRender
                  ]
                }
              ]}
              onClick={onMenuClick}
            />
          </div>
        </Layout.Sider>
        <Layout.Content
          css={css([globalStyle.noScroll, { position: 'relative' }])}
        >
          <Geometry.Add
            visible={geometryAddVisible}
            project={{
              id: project.id,
              geometries: project.geometries
            }}
            swr={{ mutateProject, addOneGeometry }}
            setVisible={(visible) => setGeometryAddVisible(visible)}
          />

          <Simulation.Selector
            user={{
              authorizedplugins: user.authorizedplugins,
              models: user.models
            }}
            visible={simulationSelectorVisible}
            onOk={async (scheme) => {
              try {
                await onSelector(project, scheme, {
                  addOneSimulation,
                  mutateProject
                })

                // Close selector
                setSimulationSelectorVisible(false)
              } catch (err) {}
            }}
            onCancel={() => setSimulationSelectorVisible(false)}
          />

          <Simulation.Updater
            user={{
              authorizedplugins: user.authorizedplugins
            }}
            simulation={
              simulation && {
                id: simulation.id,
                scheme: simulation.scheme
              }
            }
            swr={{
              mutateOneSimulation
            }}
          />

          {panel}

          <View
            project={{
              id: project.id,
              title: project.title
            }}
            simulation={
              simulation && {
                id: simulation.id
              }
            }
            geometries={geometries.map((geometry) => ({
              id: geometry.id,
              needCleanup: geometry.needCleanup
            }))}
            result={
              result && {
                glb: result.glb,
                originPath: result.originPath
              }
            }
            postprocessing={
              postprocessing && {
                glb: postprocessing.glb,
                originPath: postprocessing.originPath
              }
            }
          />
          <Data
            simulation={
              simulation && {
                id: simulation.id,
                name: simulation.name
              }
            }
          />
          <Simulation.Postprocessing
            simulation={
              simulation && {
                id: simulation.id,
                scheme: simulation.scheme
              }
            }
            result={
              result && {
                name: result.name,
                fileName: result.fileName,
                originPath: result.originPath
              }
            }
            postprocessing={
              postprocessing && {
                name: postprocessing.name,
                fileName: postprocessing.fileName
              }
            }
            setResult={setPostprocessing}
          />
        </Layout.Content>
      </Layout>
    </SelectProvider>
  )
}

export default Project
