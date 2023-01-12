/** @module Components.Help.Doc.Workflow */

import { useCallback } from 'react'
import { Card, List } from 'antd'

const Workflow = () => {
  // Data
  const list = [
    'Go to account settings',
    'Fill your first name, last name, change your password if needed',
    'Create an HPC provider, you will need that to run a simulation',
    'Create a new workspace',
    'Create a new project',
    'Upload a geometry (STEP file for 3D or DXF file for 2D)',
    'Select a simulation model',
    'Configure your simulation: geometry, materials, parameters, boundary conditions, depending on your simulation, HPC resource',
    'Run your simulation',
    'Display the results',
    'Depending on your simulation, visualize data',
    'Depending on your simulation, post-process the result'
  ]

  /**
   * Render item
   * @param item Item
   * @returns Item
   */
  const renderItem = useCallback(
    (item: string): JSX.Element => <List.Item> - {item}</List.Item>,
    []
  )

  /**
   * Render
   */
  return (
    <Card title="Standard workflow">
      <List dataSource={list} renderItem={renderItem}></List>
    </Card>
  )
}

export default Workflow
