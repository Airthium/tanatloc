import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Card, Form, List, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import { IConfiguration } from '..'

import Geometry from './geometry'
import Material from './material'
import Parameters from './parameters'
import BoundaryCondition from './boundaryCondition'
import Initialization from './initialization'
import Results from './results'

export interface IProps {
  configuration: IConfiguration
  onNext: Function
}

/**
 * Configuration
 * @memberof Components.Editor
 * @param {Object} props Props { configuration, onNext }
 */
const Configuration = (props: IProps): JSX.Element => {
  const [configuration, setConfiguration]: [IConfiguration, Function] =
    useState(props.configuration)

  const [geometryVisible, setGeometryVisible]: [boolean, Function] =
    useState(false)
  const [geometry, setGeometry]: [IConfiguration['geometry'], Function] =
    useState()

  const [materialVisible, setMaterialVisible]: [boolean, Function] =
    useState(false)
  const [material, setMaterial]: [
    IConfiguration['materials']['children'][0],
    Function
  ] = useState()

  const [parametersVisible, setParametersVisible]: [boolean, Function] =
    useState(false)
  const [parameters, setParameters]: [
    IConfiguration['parameters']['key'],
    Function
  ] = useState()

  const [initializationVisible, setInitializationVisible]: [boolean, Function] =
    useState(false)
  const [initialization, setInitialization]: [
    IConfiguration['initialization'],
    Function
  ] = useState()

  const [boundaryConditionVisible, setBoundaryConditionVisible]: [
    boolean,
    Function
  ] = useState(false)
  const [boundaryCondition, setBoundaryCondition]: [
    IConfiguration['boundaryConditions'],
    Function
  ] = useState()

  const [resultsVisible, setResultsVisible]: [boolean, Function] =
    useState(false)
  const [results, setResults]: [IConfiguration['results'], Function] =
    useState()

  /**
   * On geometry open
   */
  const onGeometryOpen = (): void => {
    setGeometryVisible(true)
  }

  /**
   * On geometry close
   */
  const onGeometryClose = (): void => {
    setGeometryVisible(false)
    setGeometry()
  }

  /**
   * On geometry
   * @param {Object} values Values
   */
  const onGeometry = (values: IConfiguration['geometry']): void => {
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
  const onGeometryEdit = (): void => {
    setGeometry(configuration.geometry)
    onGeometryOpen()
  }

  /**
   * On geometry delete
   */
  const onGeometryDelete = (): void => {
    setConfiguration({
      ...configuration,
      geometry: null
    })
  }

  /**
   * On material open
   */
  const onMaterialOpen = (): void => {
    setMaterialVisible(true)
  }

  /**
   * On material close
   */
  const onMaterialClose = (): void => {
    setMaterialVisible(false)
    setMaterial()
  }

  /**
   * On material
   * @param {Object} values Values
   */
  const onMaterial = (
    values: IConfiguration['materials']['children'][0]
  ): void => {
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
    onMaterialClose()
  }

  /**
   * On material edit
   * @param index Index
   */
  const onMaterialEdit = (index: number): void => {
    const m = configuration.materials.children[index]
    m.index = index
    setMaterial(m)
    onMaterialOpen()
  }

  /**
   * On material delete
   * @param index Index
   */
  const onMaterialDelete = (index: number): void => {
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
  const onParametersOpen = (): void => {
    setParametersVisible(true)
  }

  /**
   * On parameters close
   */
  const onParametersClose = (): void => {
    setParametersVisible(false)
    setParameters()
  }

  /**
   * On parameters
   * @param values Values
   */
  const onParameters = (values: {
    key?: string
    label: string
    parameters: IConfiguration['parameters']['key']['children']
  }): void => {
    if (!values.key && configuration.parameters?.[values.label]) {
      ErrorNotification('Parameters group already exists')
      throw new Error('Parameters group already exists')
    }

    setConfiguration({
      ...configuration,
      parameters: {
        ...configuration.parameters,
        [values.label]: {
          label: values.label,
          children: values.parameters.map((p) => ({
            ...p,
            htmlEntity: 'formula'
          }))
        }
      }
    })
    onParametersClose()
  }

  /**
   * On parameters edit
   * @param key Key
   */
  const onParametersEdit = (key: string): void => {
    const p = configuration.parameters[key]
    p.key = key
    setParameters(p)
    setParametersVisible(true)
  }

  /**
   * On parameters delete
   * @param key Key
   */
  const onParametersDelete = (key: string): void => {
    const c = configuration
    delete c.parameters[key]
    setConfiguration(c)
  }

  /**
   * On initialization open
   */
  const onInitializationOpen = (): void => {
    setInitializationVisible(true)
  }

  /**
   * On initialization close
   */
  const onInitializationClose = (): void => {
    setInitializationVisible(false)
    setInitialization()
  }

  /**
   * On intialization
   * @param {Object} values Values
   */
  const onInitialization = (values): void => {
    //TODO
    onInitializationClose()
  }

  /**
   * On initialization edit
   * @param {string} key Key
   */
  const onInitializationEdit = (key): void => {}

  /**
   * On initialization delete
   * @param {string} key Key
   */
  const onInitializationDelete = (key): void => {}

  /**
   * On boundary condition open
   */
  const onBoundaryConditionOpen = (): void => {
    setBoundaryConditionVisible(true)
  }

  /**
   * On boundary condition close
   */
  const onBoundaryConditionClose = (): void => {
    setBoundaryConditionVisible(false)
    setBoundaryCondition()
  }

  /**
   * On boundary condition
   * @param {Object} values Values
   */
  const onBoundaryCondition = (values): void => {
    //TODO
    onBoundaryConditionClose()
  }

  /**
   * On boundary condition edit
   * @param {string} key Key
   */
  const onBoundaryConditionEdit = (key): void => {}

  /**
   * On boundary condition delete
   * @param {string} key Key
   */
  const onBoundaryConditionDelete = (key): void => {}

  /**
   * On results open
   */
  const onResultsOpen = (): void => {
    setResultsVisible(true)
  }

  /**
   * On results close
   */
  const onResultsClose = (): void => {
    setResultsVisible(false)
    setResults()
  }

  /**
   * On results
   * @param {Object} values Values
   */
  const onResults = (values): void => {
    //TODO
    onResultsClose()
  }

  /**
   * On results edit
   */
  const onResultsEdit = (): void => {}

  /**
   * On results delete
   */
  const onResultsDelete = (): void => {}

  const listRender = (items: string): JSX.Element => {
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
            disabled={!!configuration.geometry}
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
                  danger
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
                  icon={<EditOutlined />}
                  onClick={() => onMaterialEdit(index)}
                />
                <Button
                  danger
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
                        icon={<EditOutlined />}
                        onClick={() => onParametersEdit(key)}
                      />
                      <Button
                        danger
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
          <Button icon={<PlusOutlined />} onClick={onInitializationOpen} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}></Form.Item>
        <Form.Item
          name="boundaryConditions"
          label="Boundary conditions"
          style={{ marginBottom: 10 }}
        >
          <Button icon={<PlusOutlined />} onClick={onBoundaryConditionOpen} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}></Form.Item>
        <Form.Item name="results" label="Results" style={{ marginBottom: 10 }}>
          <Button icon={<PlusOutlined />} onClick={onResultsOpen} />
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
