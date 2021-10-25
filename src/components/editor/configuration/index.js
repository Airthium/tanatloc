import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Card, Form, Input, List, Typography } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

import Geometry from './geometry'

// TODO continue materials

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

  const [parameterVisible, setParameterVisible] = useState(false)

  const onGeometryOpen = () => {
    setGeometryVisible(true)
  }

  const onGeometryClose = () => {
    setGeometryVisible(false)
  }

  const onGeometry = (values) => {
    setConfiguration({
      ...configuration,
      geometry: {
        index: 1,
        title: 'Geometry',
        ...values
      }
    })
    onGeometryClose()
  }

  const onGeometryEdit = () => {
    setGeometry(configuration.geometry)
    setGeometryVisible(true)
  }

  const onGeometryDelete = () => {
    setConfiguration({
      ...configuration,
      geometry: null
    })
  }

  const onMaterialOpen = () => {
    setMaterialVisible(true)
  }

  const onMaterialClose = () => {
    setMaterialVisible(false)
  }

  const onMaterial = (values) => {
    setConfiguration({
      ...configuration,
      materials: {
        index: 2,
        title: 'Materials',
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

  const onMaterialEdit = () => {}
  const onMaterialDelete = () => {}

  //   const onParametersOpen = () => {
  //     setParameters(true)
  //   }

  //   const onParametersClose = () => {
  //     setParameters(false)
  //   }

  //   const onParameters = (values) => {
  //     console.log(values)
  //   }

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
      <Form
        layout="horizontal"
        labelCol={{ offset: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={configuration}
        onFinish={props.onNext}
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
              <strong>Geometry:</strong>
              <List
                dataSource={[
                  `Meshable: ${configuration.geometry.meshable ? 'yes' : 'no'}`,
                  `Name: ${configuration.geometry.name}`
                ]}
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
          label="Materials"
          style={{ marginBottom: 10 }}
        >
          <Button icon={<PlusOutlined />} onClick={onMaterialOpen} />
        </Form.Item>
        <Form.Item>
          {configuration?.materials?.children?.map((material, index) => (
            <Card key={index}>
              <strong>Material {index + 1}</strong>
              <List
                dataSource={[
                  `Label: ${material.label}`,
                  `Symbol: ${material.symbol}`,
                  `Default value: ${material.default}`,
                  `Unit: ${material.unit}`
                ]}
                renderItem={listRender}
              />
              <Button.Group>
                <Button icon={<EditOutlined onClick={onMaterialEdit} />} />
                <Button
                  type="danger"
                  icon={<DeleteOutlined />}
                  onClick={onMaterialDelete}
                />
              </Button.Group>
            </Card>
          ))}
        </Form.Item>
        {/* <Form.Item>
          <Button onClick={onParametersOpen}>Parameters</Button>
        </Form.Item>
        <Form.Item>
          <Button disabled={true}>Initialization</Button>
        </Form.Item>
        <Form.Item>
          <Button disabled={true}>Boundary conditions</Button>
        </Form.Item>
        <Form.Item>
          <Button disabled={true}>Results</Button>
        </Form.Item>
        <Form.Item name="configuration" noStyle rules={[{ required: true }]}>
          <Input value={configuration} style={{ display: 'none' }} />
        </Form.Item> */}
        <Form.Item wrapperCol={{ offset: 4 }}>
          <Button type="primary">Next</Button>
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
