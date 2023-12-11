/** @module Components.Workspace.Sample */

import { ReactNode, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { List } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { v4 as uuid } from 'uuid'

import {
  IFrontNewGeometry,
  IFrontNewProject,
  IFrontNewSimulation,
  IFrontNewWorkspace,
  IFrontProject,
  IFrontUser,
  IFrontWorkspacesItem
} from '@/api/index.d'

import Models from '@/models'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Dialog from '@/components/assets/dialog'

import WorkspaceAPI from '@/api/workspace'
import ProjectAPI from '@/api/project'
import GeometryAPI from '@/api/geometry'
import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  user: Pick<IFrontUser, 'id' | 'plugins'>
  swr: {
    addOneWorkspace: (workspace: IFrontNewWorkspace) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  addWorkspace: 'Unable to add workspace',
  addProject: 'Unable to add project',
  addGeometry: 'Unable to add geometry'
}

/**
 * On workspace add
 * @param values Values
 * @returns Workspace
 */
export const _onWorkspaceAdd = async (
  values: Pick<IFrontWorkspacesItem, 'name'>
): Promise<IFrontNewWorkspace> => {
  const workspace = await WorkspaceAPI.add(values)
  return workspace
}

/**
 * On project add
 * @param workspace Workspace
 * @param values Values
 * @returns Project
 */
export const _onProjectAdd = async (
  workspace: Pick<IFrontWorkspacesItem, 'id'>,
  values: Pick<IFrontNewProject, 'title' | 'description'>
): Promise<IFrontNewProject> => {
  // Add
  const project = await ProjectAPI.add({ id: workspace.id }, values)

  return project
}

/**
 * Get file
 * @returns File
 */
export const _getFile = async (): Promise<ArrayBuffer> => {
  const response = await fetch('/doc/cube.stp')
  const blob = await response.blob()
  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.addEventListener('load', () => {
      resolve(reader.result as ArrayBuffer)
    })
    reader.readAsArrayBuffer(blob)
  })
}

/**
 * On geometry add
 * @param project Project
 * @returns Geometry
 */
export const _onGeometryAdd = async (
  project: Pick<IFrontProject, 'id'>
): Promise<IFrontNewGeometry> => {
  const buffer = await _getFile()

  // API
  const geometry = await GeometryAPI.add(
    { id: project.id },
    {
      name: 'cube.stp',
      uid: uuid(),
      buffer: Buffer.from(buffer)
    }
  )
  return geometry
}

/**
 * On simulation add
 * @param user User
 * @param project Project
 * @returns Simulation
 */
export const _onSimulationAdd = async (
  user: Pick<IFrontUser, 'id' | 'plugins'>,
  project: Pick<IFrontProject, 'id'>,
  geometry: IFrontNewGeometry
): Promise<IFrontNewSimulation> => {
  const scheme = Models.find((m) => m.algorithm === 'poisson')!
  // Geometry
  scheme.configuration.geometry.children = [
    {
      ...scheme.configuration.geometry.children[0],
      value: geometry.id
    }
  ]
  scheme.configuration.geometry.done = true

  // Parameters
  scheme.configuration.parameters.done = true

  // Boundary conditions
  //@ts-ignore
  scheme.configuration.boundaryConditions.dirichlet.values = [
    {
      uuid: '0',
      name: 'Boundary 0',
      type: {
        key: 'dirichlet',
        label: 'Dirichlet',
        children: [
          {
            label: 'u',
            htmlEntity: 'formula',
            default: '0'
          }
        ]
      },
      geometry: geometry.id,
      selected: [
        {
          label: 2,
          uuid: geometry.summary.faces?.find((face) => face.label === 2)?.uuid
        }
      ],
      values: [
        {
          checked: true,
          value: 0
        }
      ]
    },
    {
      uuid: '1',
      name: 'Boundary 1',
      type: {
        key: 'dirichlet',
        label: 'Dirichlet',
        children: [
          {
            label: 'u',
            htmlEntity: 'formula',
            default: '0'
          }
        ]
      },
      geometry: geometry.id,
      selected: [
        {
          label: 4,
          uuid: geometry.summary.faces?.find((face) => face.label === 4)?.uuid
        }
      ],
      values: [
        {
          checked: true,
          value: 1
        }
      ]
    }
  ]
  scheme.configuration.boundaryConditions.done = true

  // Run
  const localPlugin = user.plugins.find((plugin) => plugin.key === 'local')
  scheme.configuration.run.cloudServer = localPlugin

  // API
  const simulation = await SimulationAPI.add(
    { id: project.id },
    { name: scheme.name, scheme }
  )
  return simulation
}

/**
 * SampleWorkspace
 * @returns SampleWorkspace
 */
const SampleWorkspace: React.FunctionComponent<IProps> = ({
  visible,
  setVisible,
  user,
  swr
}) => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const router = useRouter()

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [setVisible])

  /**
   * On ok
   */
  const onOk = useCallback(async () => {
    setLoading(true)

    try {
      // Workspace
      let workspace
      try {
        workspace = await _onWorkspaceAdd({ name: 'Example Workspace' })
      } catch (err: any) {
        dispatch(addError({ title: errors.addWorkspace, err }))
        throw err
      }

      // Project
      let project
      try {
        project = await _onProjectAdd(workspace, {
          title: 'Example Project',
          description:
            "This is an example project solving the Poisson's equation"
        })
      } catch (err: any) {
        dispatch(addError({ title: errors.addProject, err }))
        throw err
      }

      // Geometry
      let geometry
      try {
        geometry = await _onGeometryAdd(project)
      } catch (err: any) {
        dispatch(addError({ title: errors.addGeometry, err }))
        throw err
      }

      // Simulation
      try {
        await _onSimulationAdd(user, project, geometry)
      } catch (err: any) {
        dispatch(addError({ title: errors.addProject, err }))
        throw err
      }

      // Mutate
      swr.addOneWorkspace(workspace)

      // Close
      setLoading(false)
      setVisibleFalse()

      // Router
      await router.push({
        pathname: '/dashboard',
        query: { page: 'workspaces', workspaceId: workspace.id }
      })
    } catch (err) {
      setLoading(false)
      throw err
    }
  }, [router, user, swr, setVisibleFalse, dispatch])

  /**
   * Render item
   * @param item Item
   * @returns Render
   */
  const renderItem = useCallback(
    (item: string): ReactNode => (
      <List.Item>
        {item && (
          <div>
            <ArrowRightOutlined style={{ margin: '0 10px' }} />
            {item}
          </div>
        )}
      </List.Item>
    ),
    []
  )

  /**
   * Render
   */
  return (
    <Dialog
      visible={visible}
      loading={loading}
      title="Sample workspace"
      onCancel={setVisibleFalse}
      onOk={onOk}
    >
      <>
        Create a new workspace with predefined configuration:
        <List
          dataSource={[
            '',
            'Cube geometry',
            "Poisson's equation",
            '0 & 1 dirichlet boundary conditions',
            'Local computing server',
            ''
          ]}
          renderItem={renderItem}
        />
        You just have to run the simulation!
      </>
    </Dialog>
  )
}

export default SampleWorkspace
