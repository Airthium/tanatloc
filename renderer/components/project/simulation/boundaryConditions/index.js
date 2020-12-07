import { useState, useEffect } from 'react'
import {
  message,
  Button,
  Card,
  Drawer,
  Layout,
  Popconfirm,
  Radio,
  Space
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons'

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
 * Errors simulation/boundaryConditions
 * @memberof module:renderer/components/project/simulation
 */
const errors = {
  updateError: 'Unable to update the simulation'
}

/**
 * Boundary condition
 * @memberof module:renderer/components/project/simulation
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
          <Card
            key={index}
            hoverable
            style={{ marginTop: '5px' }}
            onMouseEnter={() => highlightCurrent(key, index)}
            onMouseLeave={() => unhighlightCurrent()}
          >
            {child.name}
            <Button
              icon={<EditOutlined />}
              onClick={() => onEdit(key, index)}
            />
            <Popconfirm
              title="Are you sure"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => onDelete(key, index)}
            >
              <Button icon={<DeleteOutlined />} />
            </Popconfirm>
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
    setType()
  }, [bcVisible])

  // Selection
  useEffect(() => {
    dispatch(selectorSetType('face'))
    dispatch(selectorSetPart(part?.uuid))

    setFaces(part?.faces || [])
  }, [part])

  /**
   * Toggle boundary condition
   */
  const toggleBoundaryCondition = () => {
    if (bcVisible) dispatch(selectorDisable())
    else dispatch(selectorEnable())

    setVisible(bcVisible)
    setBcVisible(!bcVisible)
  }

  /**
   * Add boundary condition
   */
  const addBoundaryCondition = () => {
    toggleBoundaryCondition()
  }

  /**
   * On type
   * @param {Object} event Event
   */
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

  /**
   * On change
   * @param {string} value Value
   * @param {number} index Index
   */
  const onChange = (value, index) => {
    const currentValues = [...values]
    currentValues[index] = value
    setValues(currentValues)
  }

  /**
   * On highlight
   * @param {string} uuid UUID
   */
  const onHighlight = (uuid) => {
    dispatch(selectorHighlight(uuid))
  }

  /**
   * On unhighlight
   */
  const onUnhighlight = () => {
    dispatch(selectorUnhighlight())
  }

  /**
   * On select
   * @param {string} uuid UUID
   */
  const onSelect = (uuid) => {
    if (selected.includes(uuid)) dispatch(selectorUnselect(uuid))
    else dispatch(selectorSelect(uuid))
  }

  /**
   * On add
   */
  const onAdd = () => {
    if (!boundaryCondition.values) boundaryCondition.values = []

    // Selected
    const selectedFaces = faces
      .map((f) => {
        if (selected.includes(f.uuid))
          return {
            uuid: f.uuid,
            label: f.number
          }
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

  /**
   * Highlight current
   * @param {string} key Key
   * @param {number} index Index
   */
  const highlightCurrent = (key, index) => {
    dispatch(selectorEnable())
    const selected = boundaryConditions[key]?.values[index]?.selected
    selected.forEach((s) => {
      dispatch(selectorSelect(s.uuid))
    })
  }

  /**
   * Unhighlight current
   */
  const unhighlightCurrent = () => {
    dispatch(selectorDisable())
  }

  /**
   * On delete
   * @param {number} index Index
   */
  const onDelete = (key, index) => {
    // New simulation
    const newSimulation = { ...simulation }

    // Update local
    newSimulation.scheme.configuration.boundaryConditions[key].values = [
      ...simulation.scheme.configuration.boundaryConditions[key].values.slice(
        0,
        index
      ),
      ...simulation.scheme.configuration.boundaryConditions[key].values.slice(
        index + 1
      )
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
  }

  /**
   * On edit
   * @param {number} index Index
   */
  const onEdit = (key, index) => {
    console.log(boundaryCondition)
  }

  /**
   * Render
   */
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
