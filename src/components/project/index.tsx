/** @module Components.Project */

import {
  MouseEvent,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Button, Layout, Menu, MenuProps, Tooltip, Typography } from 'antd'
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

import {
  IFrontGeometriesItem,
  IFrontProject,
  IFrontNewSimulation,
  IFrontSimulationsItem,
  IFrontResult,
  IFrontUserModel
} from '@/api/index.d'
import {
  IModel,
  IModelBoundaryConditions,
  IModelGeometry,
  IModelInitialization,
  IModelMaterials,
  IModelParameters
} from '@/models/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'
import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import Loading from '@/components/loading'
import NotAuthorized from '@/components/notauthorized'

import { GoBack } from '@/components/assets/button'

import SelectProvider from '@/context/select'

import UserAPI from '@/api/user'
import ProjectAPI from '@/api/project'
import SimulationAPI from '@/api/simulation'
import GeometryAPI from '@/api/geometry'

import Panel from './panel'
import Geometry from './geometry'
import GeometryAdd from './geometry/add'
import View from './view'
import Simulation from './simulation'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

// Data
const Data = dynamic(() => import('./data'), { ssr: false })

/**
 * Props
 */
export interface IGeometryProps {
  visible: boolean
  geometry: IFrontGeometriesItem
  panel: ReactElement<{ children: any }> | undefined
  add: (geometry: IFrontGeometriesItem) => void
  del: (geometry: IFrontGeometriesItem) => void
  close: () => void
}

export interface ISimulationProps {
  simulation: IFrontSimulationsItem
}

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
 * On selector
 * @param project Project
 * @param scheme Simulation scheme
 * @param swr SWR
 */
export const _onSelector = async (
  project: IFrontProject,
  scheme: IModel,
  swr: {
    addOneSimulation: (simulation: IFrontNewSimulation) => Promise<void>
    mutateProject: (project: Partial<IFrontProject>) => Promise<void>
  }
): Promise<void> => {
  // Add
  const simulation = await SimulationAPI.add(
    { id: project.id },
    { name: scheme.name, scheme }
  )

  // Mutate
  await swr.addOneSimulation(simulation)
  await swr.mutateProject({
    id: project.id,
    simulations: [...(project.simulations ?? []), simulation.id]
  })
}

/**
 * GeometryLabel
 * @param props Props
 * @returns GeometryLabel
 */
const GeometryLabel: React.FunctionComponent<IGeometryProps> = ({
  visible,
  geometry,
  panel,
  add,
  del,
  close
}) => {
  /**
   * On delete
   * @param e Event
   */
  const onDelete = useCallback(
    (e: MouseEvent<HTMLSpanElement>): void => {
      e.stopPropagation()
      if (panel?.props?.children?.type?.name === Geometry.name) close()
      del(geometry)
    },
    [geometry, panel, del, close]
  )

  /**
   * On add
   * @param e Event
   */
  const onAdd = useCallback(
    (e: MouseEvent<HTMLSpanElement>): void => {
      e.stopPropagation()
      add(geometry)
    },
    [geometry, add]
  )

  /**
   * Render
   */
  return (
    <div>
      <Typography.Text ellipsis={{ tooltip: true }}>
        {geometry.name}
      </Typography.Text>
      {visible ? (
        <EyeOutlined onClick={onDelete} />
      ) : (
        <EyeInvisibleOutlined onClick={onAdd} />
      )}
    </div>
  )
}

/**
 * SimulationLabel
 * @param props Props
 * @returns SimulationLabel
 */
const SimulationLabel: React.FunctionComponent<ISimulationProps> = ({
  simulation
}) => {
  /**
   * Render
   */
  if (simulation.scheme.userModelId)
    return (
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
        <Typography.Text ellipsis>{simulation.name}</Typography.Text>
      </>
    )
  return <>{simulation.name}</>
}

/**
 * Project
 * @returns Project
 */
const Project: React.FunctionComponent = () => {
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

  const [results, setResults] = useState<IFrontResult[]>([])

  const [postprocessing, setPostprocessing] = useState<IFrontResult>()

  const [menuKey, setMenuKey] = useState<{
    key: string
    id: string
    item?: string
  }>()

  const [panel, setPanel] = useState<ReactElement<{ children: any }>>()
  const [panelVisible, setPanelVisible] = useState<boolean>(true)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()
  const [project, { mutateProject, errorProject, loadingProject }] =
    ProjectAPI.useProject(projectId)

  // Valid project
  const validProject = useMemo(
    () => (project.id === '0' ? undefined : (project as IFrontProject)),
    [project]
  )

  const [
    loadedSimulations,
    {
      addOneSimulation,
      delOneSimulation,
      mutateOneSimulation,
      errorSimulations,
      loadingSimulations
    }
  ] = SimulationAPI.useSimulations(validProject?.simulations)
  const [
    loadedGeometries,
    {
      addOneGeometry,
      delOneGeometry,
      mutateOneGeometry,
      errorGeometries,
      loadingGeometries
    }
  ] = GeometryAPI.useGeometries(validProject?.geometries)

  /**
   * Set geometry add visible true
   */
  const setGeometryAddVisibleTrue = useCallback(
    () => setGeometryAddVisible(true),
    []
  )

  /**
   * Set simulation selector visible true
   */
  const setSimulationSelectorVisibleTrue = useCallback(
    () => setSimulationSelectorVisible(true),
    []
  )

  /**
   * Set simulation selector visible false
   */
  const setSimulationSelectorVisibleFalse = useCallback(
    () => setSimulationSelectorVisible(false),
    []
  )

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
      /* istanbul ignore next */
      if (index !== -1)
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

  /**
   * On geometry cleanup
   * @param id Id
   */
  const onGeometryCleanup = useCallback(
    (id: string): void => {
      const index = loadedGeometries.findIndex((geometry) => geometry.id === id)
      /* istanbul ignore next */
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
      /* istanbul ignore next */
      if (!toDisplay) return

      const geometry = geometries.find((g) => g.id === id)
      if (!geometry)
        setGeometries((prev) => [...prev, { ...toDisplay, visible: true }])

      const project = validProject as IFrontProject
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
      validProject,
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
      const project = validProject as IFrontProject
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
      validProject,
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
            geometries={loadedGeometries}
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
    [loadedGeometries, mutateOneSimulation, onPanelClose]
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
    (
      current: IFrontSimulationsItem,
      geometries: IFrontGeometriesItem[]
    ): void => {
      setPanel(
        <Panel
          visible={panelVisible}
          title={'Materials'}
          onClose={onPanelClose}
        >
          <Simulation.Materials
            geometries={geometries}
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            swr={{
              mutateOneSimulation
            }}
            setVisible={setPanelVisible}
          />
        </Panel>
      )
    },
    [panelVisible, mutateOneSimulation, onPanelClose]
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
    (
      current: IFrontSimulationsItem,
      geometries: IFrontGeometriesItem[]
    ): void => {
      setPanel(
        <Panel
          visible={panelVisible}
          title={'Boundary conditions'}
          onClose={onPanelClose}
        >
          <Simulation.BoundaryConditions
            geometries={geometries}
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            swr={{
              mutateOneSimulation
            }}
            setVisible={setPanelVisible}
          />
        </Panel>
      )
    },
    [panelVisible, mutateOneSimulation, onPanelClose]
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
            geometries={geometries}
            simulation={{
              id: current.id,
              scheme: current.scheme
            }}
            results={results}
            setResults={setResults}
            setPostprocessing={setPostprocessing}
            setVisible={setPanelVisible}
            swr={{ mutateOneSimulation }}
          />
        </Panel>
      )
    },
    [geometries, results, panelVisible, mutateOneSimulation, onPanelClose]
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
      /* istanbul ignore next */
      if (!current) return

      setSimulation(current)

      // Display geometries
      const children = current.scheme.configuration?.geometry.children ?? []
      const toDisplay = children
        .map((child) => {
          const id = child.value
          if (!id) return
          return loadedGeometries.find((g) => g.id === id)
        })
        .filter((g) => g) as IFrontGeometriesItem[]
      if (toDisplay.length) setGeometries(toDisplay)

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
          setSimulationPanelMaterials(current, toDisplay)
          break
        case 'initialization':
          setSimulationPanelInitialization(current)
          break
        case 'boundaryConditions':
          setSimulationPanelBoundaryConditions(current, toDisplay)
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

  /**
   * Dashboard
   */
  const dashboard = useCallback((): void => {
    asyncFunctionExec(async () => {
      await router.push({
        pathname: '/dashboard',
        query: { page, workspaceId }
      })
    })
  }, [router, page, workspaceId])

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

  /**
   * On selector ok
   * @param scheme Scheme
   */
  const onSelectorOk = useCallback(
    async (userModel: IFrontUserModel): Promise<void> => {
      try {
        const project = validProject as IFrontProject
        await _onSelector(project, userModel.model, {
          addOneSimulation,
          mutateProject
        })

        // Close selector
        setSimulationSelectorVisible(false)
      } catch (err: any) {
        dispatch(addError({ title: errors.add, err }))
      }
    },
    [validProject, addOneSimulation, mutateProject, dispatch]
  )

  /**
   * Check geometries
   * @param geometry Geometry
   * @returns Check
   */
  const checkGeometries = useCallback(
    (geometry: IModelGeometry): boolean => {
      if (loadingGeometries) return true

      let res = true
      const children = geometry.children
      for (const child of children) {
        const value = child.value

        if (value && !loadedGeometries.filter((g) => g.id === value).length) {
          geometry.done = false
          res = false
        }
      }

      return res
    },
    [loadedGeometries, loadingGeometries]
  )

  // Not logged -> go to login page
  useEffect(() => {
    asyncFunctionExec(async () => {
      if (!loadingUser && !user) await router.replace('/login')
    })
  }, [user, loadingUser, router])

  // Errors
  useEffect(() => {
    if (errorUser) dispatch(addError({ title: errors.user, err: errorUser }))
    if (errorProject)
      dispatch(addError({ title: errors.project, err: errorProject }))
    if (errorSimulations)
      dispatch(addError({ title: errors.simulations, err: errorSimulations }))
    if (errorGeometries)
      dispatch(addError({ title: errors.geometries, err: errorGeometries }))
  }, [errorUser, errorProject, errorSimulations, errorGeometries, dispatch])

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
          setResults([])
          setPostprocessing(undefined)
        }
      }
    },
    [menuKey, panelVisible, results],
    [setGeometryPanel, setSimulationPanel, onPanelClose]
  )

  // Close result
  useEffect(() => {
    if (!results.length && postprocessing) setPostprocessing(undefined)
  }, [results, postprocessing])

  // Geometries render build
  const geometriesRender = useMemo(
    () =>
      loadedGeometries.map((g) => {
        const visible = geometries.find((geometry) => geometry.id === g.id)
        return {
          key: g.id,
          icon: <PieChartOutlined />,
          label: (
            <GeometryLabel
              visible={!!visible}
              geometry={g}
              panel={panel}
              add={addGeometry}
              del={delGeometry}
              close={onPanelClose}
            />
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
        const categories: MenuProps['items'] = []
        Object.keys(configuration).forEach((key) => {
          if (key === 'dimension') return
          const child = configuration[key as keyof IModel['configuration']] as
            | IModelGeometry
            | IModelParameters
            | IModelMaterials
            | IModelInitialization
            | IModelBoundaryConditions

          let icon = <CheckCircleOutlined style={{ color: 'green' }} />
          if (child.error)
            icon = <CloseCircleOutlined style={{ color: 'red' }} />
          else if (!child.done)
            icon = <ExclamationCircleOutlined style={{ color: 'orange' }} />

          // Deleted simulation's geometry
          if (key === 'geometry')
            if (!checkGeometries(child as IModelGeometry))
              icon = <ExclamationCircleOutlined style={{ color: 'orange' }} />

          categories[child.index] = {
            key: s.id + '&' + key,
            disabled: !geometries.length,
            icon: icon,
            label: child.title
          }
        })

        return {
          key: s.id,
          icon: <CodeSandboxOutlined />,
          label: <SimulationLabel simulation={s} />,
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
    [geometries, loadedSimulations, checkGeometries]
  )

  /**
   * Render
   */
  if (!user || loadingUser || loadingProject) return <Loading.Simple />
  if (!validProject) return <NotAuthorized />
  return (
    <SelectProvider>
      <Layout hasSider={true}>
        <Layout.Sider theme="light" className={style.sider} width={256}>
          <div className={globalStyle.logo}>
            <img src="/images/logo.svg" alt="Tanatloc" />
          </div>
          <Menu
            className={style.menu1}
            mode="inline"
            items={[
              {
                key: 'menu-go-back',
                disabled: true,
                style: { cursor: 'unset', margin: '10px 0', paddingLeft: 10 },
                label: (
                  <GoBack className={globalStyle.fullWidth} onClick={dashboard}>
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
                    {validProject.title}
                  </Typography.Paragraph>
                )
              }
            ]}
          />
          <div className={style.menuScroll}>
            <Menu
              mode="inline"
              className={style.menu2}
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
                          onClick={setGeometryAddVisibleTrue}
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
                          onClick={setSimulationSelectorVisibleTrue}
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
          className={globalStyle.noScroll}
          style={{ position: 'relative' }}
        >
          <GeometryAdd
            visible={geometryAddVisible}
            project={{
              id: validProject.id,
              geometries: validProject.geometries
            }}
            swr={{ mutateProject, addOneGeometry }}
            setVisible={setGeometryAddVisible}
          />

          <Simulation.Selector
            user={{
              id: user.id,
              authorizedplugins: user.authorizedplugins,
              usermodels: user.usermodels
            }}
            visible={simulationSelectorVisible}
            onOk={onSelectorOk}
            onCancel={setSimulationSelectorVisibleFalse}
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
              id: validProject.id,
              title: validProject.title
            }}
            simulation={
              simulation && {
                id: simulation.id,
                scheme: simulation.scheme
              }
            }
            geometries={
              geometries
                .map((geometry) => {
                  if (geometry.id === '0') return
                  return {
                    id: geometry.id,
                    needCleanup: geometry.needCleanup
                  }
                })
                .filter((g) => g) as Pick<
                IFrontGeometriesItem,
                'id' | 'needCleanup'
              >[]
            }
            results={results.map((result) => ({
              name: result.name,
              glb: result.glb,
              originPath: result.originPath,
              extra: result.extra
            }))}
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
            results={results.map((result) => ({
              name: result.name,
              fileName: result.fileName,
              originPath: result.originPath
            }))}
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
