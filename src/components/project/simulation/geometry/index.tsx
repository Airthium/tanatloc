import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Card, Collapse, Select, Space, Typography } from 'antd'
import { SelectOutlined } from '@ant-design/icons'
import { MathJax } from 'better-react-mathjax'

import { IGeometry, ISimulation } from '@/database/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'
import Formula from '@/components/assets/formula'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  geometries: IGeometry[]
  geometry?: IGeometry
  simulation: ISimulation
  setGeometry: Function
  swr: {
    mutateOneSimulation: Function
  }
}

/**
 * Errors (geometry)
 * @memberof Components.Project.Simulation
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * Geometry
 * @memberof Components.Project.Simulation
 * @param props Props
 */
const Geometry = ({
  geometries,
  geometry,
  simulation,
  setGeometry,
  swr
}: IProps): JSX.Element => {
  // State
  const [geometriesList, setGeometryList]: [IGeometry[], Function] = useState(
    []
  )
  const [meshGlobal, setMeshGlobal]: [
    { type: string; value: string },
    Function
  ] = useState({ type: 'auto', value: 'normal' })

  useEffect(() => {
    const simulationGeometryId = simulation.scheme.configuration.geometry.value
    if (!simulationGeometryId) onSelect(geometry?.id)
  }, [simulation])

  useEffect(() => {
    const list = geometries.map((g) => (
      <Collapse key={g.id} expandIconPosition="right">
        <Collapse.Panel
          key={g.id}
          header={g.name}
          extra={
            <SelectOutlined
              onClick={(event) => {
                event.stopPropagation()
                onSelect(g.id)
              }}
            />
          }
          style={{
            backgroundColor: g.id === geometry?.id && 'rgba(254, 226, 61, 0.5)'
          }}
        >
          <Space direction="vertical">
            <Typography.Title level={5}>Informations</Typography.Title>
            <Typography.Text>File: {g.name} </Typography.Text>
            <Typography.Text>
              Unit:{' '}
              <MathJax inline dynamic>
                $m$
              </MathJax>
            </Typography.Text>
            {g.summary ? (
              <>
                {g.summary.solids && (
                  <Typography.Text>
                    Number of solids: {g.summary.solids.length}
                  </Typography.Text>
                )}
                {g.summary.faces && (
                  <Typography.Text>
                    Number of faces: {g.summary.faces.length}
                  </Typography.Text>
                )}
                {g.summary.edges && (
                  <Typography.Text>
                    Number of edges: {g.summary.edges.length}
                  </Typography.Text>
                )}
              </>
            ) : (
              <Typography.Text>No summary available</Typography.Text>
            )}
          </Space>
        </Collapse.Panel>
      </Collapse>
    ))
    setGeometryList(list)
  }, [geometry, geometries])

  /**
   * On select
   * @param {number} index Index
   */
  const onSelect = async (id: string): Promise<void> => {
    try {
      const newSimulation = { ...simulation }

      // Update
      newSimulation.scheme.configuration.geometry.value = id
      newSimulation.scheme.configuration.geometry.meshParameters = meshGlobal

      const diff = {
        ...newSimulation.scheme.configuration.geometry,
        done: true
      }

      // API
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'geometry'],
          value: diff
        }
      ])

      // Local
      swr.mutateOneSimulation(newSimulation)

      // Display
      const newGeometry = geometries.find((g) => g.id === id)
      setGeometry(newGeometry)
    } catch (err) {
      ErrorNotification(errors.update, err)
    }
  }

  console.log(meshGlobal)

  /**
   * Render
   */
  return geometries.length ? (
    <>
      {geometriesList}
      {simulation.scheme.configuration.geometry.meshable && (
        <Card title="Mesh refinement" size="small">
          <Space direction="vertical">
            <Typography.Text>
              Type:
              <br />
              <Select
                value={meshGlobal.type}
                onChange={(type) =>
                  setMeshGlobal({
                    type,
                    value: type === 'auto' ? 'normal' : '1'
                  })
                }
              >
                <Select.Option value="auto">Automatic</Select.Option>
                <Select.Option value="manual">Manual</Select.Option>
              </Select>
            </Typography.Text>
            {meshGlobal.type === 'auto' && (
              <Typography.Text>
                Size:
                <br />
                <Select
                  defaultValue="normal"
                  onChange={(value) =>
                    setMeshGlobal({ type: meshGlobal.type, value })
                  }
                >
                  <Select.Option value="verycoarse">Very coarse</Select.Option>
                  <Select.Option value="coarse">Coarse</Select.Option>
                  <Select.Option value="normal">Normal</Select.Option>
                  <Select.Option value="fine">Fine</Select.Option>
                  <Select.Option value="veryfine">Very fine</Select.Option>
                </Select>
              </Typography.Text>
            )}
            {meshGlobal.type === 'manual' && (
              <Typography.Text>
                Size:
                <br />
                <Formula
                  defaultValue={meshGlobal.value}
                  onValueChange={(value) =>
                    setMeshGlobal({ type: meshGlobal.type, value })
                  }
                  unit="$m$"
                />
              </Typography.Text>
            )}
          </Space>
        </Card>
      )}
    </>
  ) : (
    <Typography.Text>Please upload a geometry first</Typography.Text>
  )
}

Geometry.propTypes = {
  geometries: PropTypes.array.isRequired,
  geometry: PropTypes.object,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        geometry: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Geometry
