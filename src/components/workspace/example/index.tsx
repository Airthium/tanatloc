import React from 'react'
import WorkspaceAPI from '@/api/workspace'
import ProjectAPI from '@/api/project'
import GeometryAPI from '@/api/geometry'
import SimulationAPI from '@/api/simulation'
import {
  IFrontNewGeometry,
  IFrontNewProject,
  IFrontNewSimulation,
  IFrontNewWorkspace,
  IFrontProject,
  IFrontWorkspacesItem
} from '@/api/index.d'
import Models from '@/models'
import { ErrorNotification } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

export const errors = {
  addWorkspace: 'Unable to add workspace',
  addProject: 'Unable to add project',
  addGeometry: 'Unable to add geometry'
}

export const _onWorkspaceAdd = async (
  values: Pick<IFrontWorkspacesItem, 'name'>
): Promise<IFrontNewWorkspace> => {
  try {
    const workspace = await WorkspaceAPI.add(values)
    return workspace
  } catch (err: any) {
    ErrorNotification(errors.addWorkspace, err)
    throw err
  }
}

export const _onProjectAdd = async (
  workspace: Pick<IFrontWorkspacesItem, 'id'>,
  values: Pick<IFrontNewProject, 'title' | 'description'>
): Promise<IFrontNewProject> => {
  try {
    // Add
    const project = await ProjectAPI.add({ id: workspace.id }, values)

    return project
  } catch (err: any) {
    ErrorNotification(errors.addProject, err)
    throw err
  }
}

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

export const _onGeometryAdd = async (
  project: Pick<IFrontProject, 'id'>
): Promise<IFrontNewGeometry> => {
  const buffer = await _getFile()
  try {
    // API
    const geometry = await GeometryAPI.add(
      { id: project.id },
      {
        name: 'cube.stp',
        uid: 'fa429ac2-1731-11ee-be56-0242ac120002',
        buffer: Buffer.from(buffer)
      }
    )
    return geometry
  } catch (err: any) {
    ErrorNotification(errors.addGeometry, err)
    throw err
  }
}

export const _onSimulationAdd = async (
  project: Pick<IFrontProject, 'id'>
): Promise<IFrontNewSimulation> => {
  try {
    const scheme = Models.find((m) => m.algorithm === 'poisson')!
    const simulation = await SimulationAPI.add(
      { id: project.id },
      { name: scheme.name, scheme }
    )
    return simulation
  } catch (err: any) {
    ErrorNotification(errors.addProject, err)
    throw err
  }
}

const onClick = async () => {
  const workspace = await _onWorkspaceAdd({ name: 'Example Workspace' })
  const project = await _onProjectAdd(workspace, {
    title: 'Example Project',
    description: 'This is an example project'
  })
  await _onGeometryAdd(project)
  await _onSimulationAdd(project)
  window.location.reload()
}

function AddExample() {
  return (
    <AddButton primary={false} dark onAdd={onClick}>
      Create a new workspace with predefined configuration
    </AddButton>
  )
}

export default AddExample
