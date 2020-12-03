import { useState, useEffect } from 'react'
import { message, Button, Card, Drawer, Layout, Radio, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Formula from '../../../assets/formula'

import { useSelector, useDispatch } from 'react-redux'
import {
  enable as selectorEnable,
  disable as selectorDisable,
  setType as selectorSetType,
  setPart as selectorSetPart,
  highlight as selectorHighlight,
  unhighlight as selectorUnhighlight,
  select as selectorSelect,
  unselect as selectorUnselect
} from '../../../../store/select/action'

import SimulationAPI from '../../../../../src/api/simulation'

import Sentry from '../../../../../src/lib/sentry'

/**
 * Errors
 */
const errors = {
  updateError: 'Unable to update the simulation'
}

/**
 * Boundary condition
 * @param {Object} props Props
 */
const BoundaryConditions = ({ project, simulation, part, setVisible }) => {
  // State
  const [bcVisible, setBcVisible] = useState(false)
  const [faces, setFaces] = useState(part?.faces || [])
  const [type, setType] = useState()
  const [boundaryCondition, setBoundaryCondition] = useState()
  const [values, setValues] = useState([])

  // Store
  const { highlighted, selected } = useSelector((state) => ({
    highlighted: state.select.highlighted,
    selected: state.select.selected
  }))
  const dispatch = useDispatch()

  // Data
  const [, { mutateOneSimulation }] = SimulationAPI.useSimulations(
    project?.simulations
  )
  const boundaryConditions = simulation?.scheme.configuration.boundaryConditions
  const list = Object.keys(boundaryConditions)
    .map((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return
      return boundaryConditions[key].values?.map((child, index) => {
        return (
          <Card key={index}>
            {child.name}
            <Button>Edit</Button>
            <Button>Delete</Button>
          </Card>
        )
      })
    })
    .filter((l) => l)
  const radios = Object.keys(boundaryConditions)
    .map((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return
      return {
        key,
        ...boundaryConditions[key]
      }
    })
    .filter((r) => r)

  // Cleanup
  useEffect(() => {
    setBoundaryCondition()
    setValues([])
  }, [bcVisible])

  // Selection
  useEffect(() => {
    dispatch(selectorSetType('face'))
    dispatch(selectorSetPart(part?.uuid))

    setFaces(part?.faces || [])
  }, [part])

  const toggleBoundaryCondition = () => {
    if (bcVisible) dispatch(selectorDisable())
    else dispatch(selectorEnable())

    setVisible(bcVisible)
    setBcVisible(!bcVisible)
  }

  const addBoundaryCondition = () => {
    toggleBoundaryCondition()
  }

  const onType = (event) => {
    // Type
    const currentType = event.target.value
    setType(currentType)

    // Boundary condition
    const currentBoundaryCondition = boundaryConditions[currentType]
    setBoundaryCondition(currentBoundaryCondition)

    // Initial values
    const initialValues = new Array(
      currentBoundaryCondition.children.length
    ).fill(0)
    setValues(initialValues)
  }

  const onChange = (value, index) => {
    const currentValues = [...values]
    currentValues[index] = value
    setValues(currentValues)
  }

  const onHighlight = (uuid) => {
    dispatch(selectorHighlight(uuid))
  }

  const onUnhighlight = () => {
    dispatch(selectorUnhighlight())
  }

  const onSelect = (uuid) => {
    if (selected.includes(uuid)) dispatch(selectorUnselect(uuid))
    else dispatch(selectorSelect(uuid))
  }

  const onAdd = () => {
    if (!boundaryCondition.values) boundaryCondition.values = []

    // Selected
    const selectedFaces = faces
      .map((f) => {
        if (selected.includes(f.uuid)) return f.number
      })
      .filter((f) => f)

    // New boundary condition
    const newBoundaryCondition = {
      name:
        boundaryCondition.label +
        ' boundary condition ' +
        (boundaryCondition.values.length + 1),
      selected: selectedFaces,
      values: values
    }

    // New simulation
    const newSimulation = { ...simulation }

    // Update local
    newSimulation.scheme.configuration.boundaryConditions[type].values = [
      ...boundaryCondition.values,
      newBoundaryCondition
    ]

    // Diff
    const diff = {
      ...boundaryConditions,
      done: true
    }

    // Update
    SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'diff',
        path: ['configuration', 'boundaryConditions'],
        value: diff
      }
    ])
      .then(() => {
        // Mutate
        mutateOneSimulation(newSimulation)
      })
      .catch((err) => {
        message.error(errors.updateError)
        console.error(err)
        Sentry.captureException(err)
      })

    toggleBoundaryCondition()
  }

  return (
    <Layout>
      <Layout.Content>
        <Button icon={<PlusCircleOutlined />} onClick={addBoundaryCondition} />
        {list}
        <Drawer
          title="Boundary condition"
          placement="left"
          closable={false}
          visible={bcVisible}
          mask={false}
          maskClosable={false}
          width={300}
        >
          <Card title="Boundary condition type">
            <Radio.Group buttonStyle="solid" onChange={onType}>
              {radios.map((radio) => {
                return (
                  <Radio.Button key={radio.key} value={radio.key}>
                    {radio.label}
                  </Radio.Button>
                )
              })}
            </Radio.Group>
          </Card>
          {boundaryCondition && (
            <Card>
              {boundaryCondition.children?.map((child, index) => {
                return (
                  <div key={index}>
                    {child.label}:
                    <Formula
                      value={
                        values[index] === undefined
                          ? child.default
                          : values[index]
                      }
                      onChange={(value) => onChange(value, index)}
                    />
                  </div>
                )
              })}
            </Card>
          )}
          <div>
            {faces?.map((face, index) => {
              return (
                <Card
                  hoverable
                  key={index}
                  style={{
                    marginBottom:
                      highlighted === face.uuid
                        ? '5px'
                        : selected.includes(face.uuid)
                        ? '5px'
                        : '7px',
                    border:
                      highlighted === face.uuid
                        ? '2px solid #0096C7'
                        : selected.includes(face.uuid)
                        ? '2px solid #c73100'
                        : '1px solid grey'
                  }}
                  bodyStyle={{ padding: '10px' }}
                  onMouseOver={() => onHighlight(face.uuid)}
                  onMouseOut={onUnhighlight}
                  onClick={() => onSelect(face.uuid)}
                >
                  {face.name}
                </Card>
              )
            })}
          </div>
          <Space>
            <Button type="danger" onClick={toggleBoundaryCondition}>
              Cancel
            </Button>
            <Button disabled={!boundaryCondition} onClick={onAdd}>
              Add
            </Button>
          </Space>
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default BoundaryConditions
