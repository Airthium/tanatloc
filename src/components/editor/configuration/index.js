import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Card, Form, List, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import Geometry from './geometry'
import Material from './material'
import Parameters from './parameters'
import BoundaryCondition from '../boundaryCondition'

//TODO
const Initialization = 'div'
const Results = 'div'

/**
 * Configuration
 * @memberof Components.Editor
 * @param {Object} props Props { configuration, onNext }
 */
const Configuration = (props) => {
  const [configuration, setConfiguration] = useState(props.configuration)

  const [geometryVisible, setGeometryVisible] = useState(false)
  const [geometry, setGeometry] = useState()

  const [materialVisible, setMaterialVisible] = useState(false)
  const [material, setMaterial] = useState()

  const [parametersVisible, setParametersVisible] = useState(false)
  const [parameters, setParameters] = useState()

  const [initializationVisible, setInitializationVisible] = useState(false)
  const [initialization, setInitialization] = useState()

  const [boundaryConditionVisible, setBoundaryConditionVisible] =
    useState(false)
  const [boundaryCondition, setBoundaryCondition] = useState()

  const [resultsVisible, setResultsVisible] = useState(false)
  const [results, setResults] = useState()

  /**
   * On geometry open
   */
  const onGeometryOpen = () => {
    setGeometryVisible(true)
  }

  /**
   * On geometry close
   */
  const onGeometryClose = () => {
    setGeometryVisible(false)
    setGeometry()
  }

  /**
   * On geometry
   * @param {Object} values Values
   */
  const onGeometry = (values) => {
    setConfiguration({
      ...configuration,
      geometry: {
        ...values
      }
    })
    onGeometryClose()
  }

  /**
   * On geometry edit
   */
  const onGeometryEdit = () => {
    setGeometry(configuration.geometry)
    setGeometryVisible(true)
  }

  /**
   * On geometry delete
   */
  const onGeometryDelete = () => {
    setConfiguration({
      ...configuration,
      geometry: null
    })
  }

  /**
   * On material open
   */
  const onMaterialOpen = () => {
    setMaterialVisible(true)
  }

  /**
   * On material close
   */
  const onMaterialClose = () => {
    setMaterialVisible(false)
    setMaterial()
  }

  /**
   * On material
   * @param {Object} values Values
   */
  const onMaterial = (values) => {
    if (values.index !== undefined) {
      // Replace
      setConfiguration({
        ...configuration,
        materials: {
          ...configuration.materials,
          children: [
            ...configuration.materials.children.slice(0, values.index),
            {
              ...values,
              htmlEntity: 'formula'
            },
            ...configuration.materials.children.slice(values.index + 1)
          ]
        }
      })
    } else {
      // Add
      setConfiguration({
        ...configuration,
        materials: {
          children: [
            ...(configuration?.materials?.children || []),
            {
              ...values,
              htmlEntity: 'formula'
            }
          ]
        }
      })
    }
  }

  /**
   * On material edit
   * @param {number} index Index
   */
  const onMaterialEdit = (index) => {
    const m = configuration.materials.children[index]
    m.index = index
    setMaterial(m)
    setMaterialVisible(true)
  }

  /**
   * On material delete
   * @param {number} index Index
   */
  const onMaterialDelete = (index) => {
    setConfiguration({
      ...configuration,
      materials: {
        ...configuration.materials,
        children: [
          ...configuration.materials.children.slice(0, index),
          ...configuration.materials.children.slice(index + 1)
        ]
      }
    })
  }

  /**
   * On parameters open
   */
  const onParametersOpen = () => {
    setParametersVisible(true)
  }

  /**
   * On parameters close
   */
  const onParametersClose = () => {
    setParametersVisible(false)
    setParameters()
  }

  /**
   * On parameters
   * @param {Object} values Values
   */
  const onParameters = (values) => {
    if (!values.key && configuration.parameters?.[values.label]) {
      ErrorNotification('Parameters group already exists')
      throw new Error('Parameters group already exists')
    }

    setConfiguration({
      ...configuration,
      parameters: {
        [values.label]: {
          label: values.label,
          children: values.parameters.map((p) => ({
            ...p,
            htmlEntity: 'formula'
          }))
        }
      }
    })
  }

  /**
   * On parameters edit
   * @param {string} key Key
   */
  const onParametersEdit = (key) => {
    const p = configuration.parameters[key]
    p.key = key
    setParameters(p)
    setParametersVisible(true)
  }

  /**
   * On parameters delete
   * @param {string} key Key
   */
  const onParametersDelete = (key) => {
    const c = configuration
    delete c.parameters[key]
    setConfiguration(c)
  }

  /**
   * On initialization open
   */
  const onInitializationOpen = () => {
    setInitializationVisible(true)
  }

  /**
   * On initialization close
   */
  const onInitializationClose = () => {
    setInitializationVisible(false)
    setInitialization()
  }

  /**
   * On intialization
   * @param {Object} values Values
   */
  const onInitialization = (values) => {}

  /**
   * On initialization edit
   * @param {string} key Key
   */
  const onInitializationEdit = (key) => {}

  /**
   * On initialization delete
   * @param {string} key Key
   */
  const onInitializationDelete = (key) => {}

  /**
   * On boundary condition open
   */
  const onBoundaryConditionOpen = () => {
    setBoundaryConditionVisible(true)
  }

  /**
   * On boundary condition close
   */
  const onBoundaryConditionClose = () => {
    setBoundaryConditionVisible(false)
    setBoundaryCondition()
  }

  /**
   * On boundary condition
   * @param {Object} values Values
   */
  const onBoundaryCondition = (values) => {}

  /**
   * On boundary condition edit
   * @param {string} key Key
   */
  const onBoundaryConditionEdit = (key) => {}

  /**
   * On boundary condition delete
   * @param {string} key Key
   */
  const onBoundaryConditionDelete = (key) => {}

  /**
   * On results open
   */
  const onResultsOpen = () => {
    setResultsVisible(true)
  }

  /**
   * On results close
   */
  const onResultsClose = () => {
    setResultsVisible(false)
    setResults()
  }

  /**
   * On results
   * @param {Object} values Values
   */
  const onResults = (values) => {}

  /**
   * On results edit
   */
  const onResultsEdit = () => {}

  /**
   * On results delete
   */
  const onResultsDelete = () => {}

  const listRender = (items) => {
    const item = items.split(':')
    return (
      <List.Item>
        <Typography.Text>{item[0]}</Typography.Text>
        <Typography.Text code>{item[1]}</Typography.Text>
      </List.Item>
    )
  }

  /**
   * Render
   */
  return (
    <>
      <Geometry
        visible={geometryVisible}
        geometry={
          geometry && {
            meshable: geometry.meshable,
            name: geometry.name
          }
        }
        onOk={onGeometry}
        onClose={onGeometryClose}
      />
      <Material
        visible={materialVisible}
        material={material}
        onOk={onMaterial}
        onClose={onMaterialClose}
      />
      <Parameters
        visible={parametersVisible}
        parameters={parameters}
        onOk={onParameters}
        onClose={onParametersClose}
      />
      <Initialization
        visible={initializationVisible}
        initialization={initialization}
        onOk={onInitialization}
        onClose={onInitializationClose}
      />
      <BoundaryCondition
        visible={boundaryConditionVisible}
        boundaryCondition={boundaryCondition}
        onOk={onBoundaryCondition}
        onClose={onBoundaryConditionClose}
      />
      <Results
        visible={resultsVisible}
        results={results}
        onOk={onResults}
        onClose={onResultsClose}
      />
      <Form
        layout="horizontal"
        labelCol={{ offset: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={configuration}
        onFinish={() => props.onNext(configuration)}
      >
        <Form.Item
          name="geometry"
          label="Geometry"
          style={{ marginBottom: 10 }}
        >
          <Button
            disabled={configuration.geometry}
            icon={<PlusOutlined />}
            onClick={onGeometryOpen}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          {configuration?.geometry && (
            <Card>
              <strong>Geometry</strong>
              <List
                dataSource={[
                  `Meshable: ${configuration.geometry.meshable ? 'yes' : 'no'}`,
                  `Name: ${configuration.geometry.name}`
                ]}
                bordered
                renderItem={listRender}
              />
              <Button.Group>
                <Button icon={<EditOutlined />} onClick={onGeometryEdit} />
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={onGeometryDelete}
                />
              </Button.Group>
            </Card>
          )}
        </Form.Item>
        <Form.Item
          name="materials"
          label="Material parameters"
          style={{ marginBottom: 10 }}
        >
          <Button icon={<PlusOutlined />} onClick={onMaterialOpen} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          {configuration?.materials?.children?.map((m, index) => (
            <Card key={index}>
              <strong>Material {index + 1}</strong>
              <List
                dataSource={[
                  `Label: ${m.label}`,
                  `Symbol: ${m.symbol}`,
                  `Default value: ${m.default}`,
                  `Unit: ${m.unit}`
                ]}
                bordered
                renderItem={listRender}
              />
              <Button.Group>
                <Button
                  icon={<EditOutlined onClick={() => onMaterialEdit(index)} />}
                />
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={() => onMaterialDelete(index)}
                />
              </Button.Group>
            </Card>
          ))}
        </Form.Item>
        <Form.Item
          name="parameters"
          label="Physical parameters"
          style={{ marginBottom: 10 }}
        >
          <Button icon={<PlusOutlined />} onClick={onParametersOpen} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          {configuration?.parameters &&
            Object.keys(configuration.parameters)
              .map((key) => {
                if (!key || key === 'index' || key === 'title') return
                const p = configuration.parameters[key]
                return (
                  <Card key={key}>
                    <strong>Parameters group «{key}»</strong>
                    {p.children.map((child) => (
                      <div key={child.label}>
                        <List
                          dataSource={[
                            `Label: ${child.label}`,
                            `Default value: ${child.default}`,
                            `Unit: ${child.unit}`
                          ]}
                          bordered
                          renderItem={listRender}
                        />
                      </div>
                    ))}
                    <Button.Group>
                      <Button
                        icon={
                          <EditOutlined onClick={() => onParametersEdit(key)} />
                        }
                      />
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => onParametersDelete(key)}
                      />
                    </Button.Group>
                  </Card>
                )
              })
              .filter((k) => k)}
        </Form.Item>
        <Form.Item
          name="initialization"
          label="Initialization"
          style={{ marginBottom: 10 }}
        >
          <Button
            disabled={true}
            icon={<PlusOutlined />}
            onClick={onInitializationOpen}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}></Form.Item>
        <Form.Item
          name="boundaryConditions"
          label="Boundary conditions"
          style={{ marginBottom: 10 }}
        >
          <Button
            disabled={true}
            icon={<PlusOutlined />}
            onClick={onBoundaryConditionOpen}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}></Form.Item>
        <Form.Item name="results" label="Results" style={{ marginBottom: 10 }}>
          <Button
            disabled={true}
            icon={<PlusOutlined />}
            onClick={onResultsOpen}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}></Form.Item>
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary" htmlType="submit">
            Next
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

Configuration.propTypes = {
  configuration: PropTypes.exact({
    geometry: PropTypes.object,
    materials: PropTypes.object,
    parameters: PropTypes.object,
    initialization: PropTypes.object,
    boundaryConditions: PropTypes.object,
    results: PropTypes.object
  }).isRequired,
  onNext: PropTypes.func.isRequired
}

export default Configuration
