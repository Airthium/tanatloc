import { useState, useEffect } from 'react'
import { message, Button, Card, Drawer, Layout, Radio, Space } from 'antd'
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons'

import Add from './add'
import List from './list'

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
import BoundaryCondition from './boundaryCondition'

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
  const [boundaryConditionVisible, setBoundaryConditionVisible] = useState(
    false
  )
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
  const radios = Object.keys(boundaryConditions)
    .map((key) => {
      if (key === 'index' || key === 'title' || key === 'done') return
      return {
        key,
        ...boundaryConditions[key]
      }
    })
    .filter((r) => r)

  // // Cleanup
  // useEffect(() => {
  //   setBoundaryCondition()
  //   setValues([])
  //   setType()
  // }, [bcVisible])

  // Selection
  useEffect(() => {
    dispatch(selectorSetType('face'))
    dispatch(selectorSetPart(part?.uuid))

    setFaces(part?.faces || [])
  }, [part])

  // /**
  //  * Toggle boundary condition
  //  */
  // const toggleBoundaryCondition = () => {
  //   if (bcVisible) dispatch(selectorDisable())
  //   else dispatch(selectorEnable())

  //   setVisible(bcVisible)
  //   setBcVisible(!bcVisible)
  // }

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
   * On delete
   * @param {number} index Index
   */
  const onDelete = (key, index) => {
    // New simulation
    const newSimulation = { ...simulation }

    // Update local
    boundaryConditions[key].values = [
      ...boundaryConditions[key].values.slice(0, index),
      ...boundaryConditions[key].values.slice(index + 1)
    ]
    newSimulation.scheme.configuration.boundaryConditions = boundaryConditions

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

  // /**
  //  * On edit
  //  * @param {number} index Index
  //  */
  // const onEdit = (key, index) => {
  //   setBoundaryCondition(boundaryConditions[key])
  //   setValues(boundaryConditions[key].values[index].values)
  //   setType(key)

  //   // boundaryConditions[key].values[index].selected.forEach((s) => {
  //   //   dispatch(selectorSelect(s.uuid))
  //   // })

  //   toggleBoundaryCondition()
  // }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Content>
        <Add onAdd={() => setBoundaryConditionVisible(true)} />
        <List project={project} simulation={simulation} />
        <BoundaryCondition
          visible={boundaryConditionVisible}
          boundaryConditions={boundaryConditions}
        />
      </Layout.Content>
    </Layout>
  )
}

export default BoundaryConditions
