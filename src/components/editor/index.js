/** @namespace Components.Editor */

import { useState, useEffect } from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Layout,
  Select,
  Space,
  Typography
} from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import SimpleEditor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import './prism/prism-freefem.js'

import Dialog from '@/components/assets/dialog'

import 'prism-themes/themes/prism-vs.css'

const headersLine = `//TANATLOC HEADERS (mandatory)
// You can now use:
// - function: appendLog(string)
// - function: appendError(string)\n\n`

const dimensionLine = `//TANATLOC DIMENSION (mandatory)
// You can now use:
// - type: meshN (2D: mesh, 3D: mesh3)
// - function: intN (2D: int2d, 3D: int3d)
// - function: intN1 (2D: int1d, 3D, int2d)\n\n`

const existingCategories = ['Academic', 'Fluid', 'Mechanics']
const existingMaterialSymbols = ['Rho', 'Mu'] // must match the material database
// TODO get real datas

/**
 * Editor
 * @memberof Components.Editor
 */
const Editor = () => {
  // State
  const [code, setCode] = useState(headersLine + dimensionLine)
  const [category, setCategory] = useState()
  const [configuration, setConfiguration] = useState({})

  const [geometry, setGeometry] = useState(false)
  const [materials, setMaterials] = useState(false)
  const [parameters, setParameters] = useState(false)

  useEffect(() => {
    let newCode = code

    // Dimension
    if (!newCode.includes(dimensionLine)) newCode = dimensionLine + newCode

    // Headers
    if (!newCode.includes(headersLine)) newCode = headersLine + newCode

    // Geometry
    if (configuration.geometry && !newCode.includes('//TANATLOC GEOMETRY')) {
      newCode += '//TANATLOC GEOMETRY\n'
      newCode += '// You can now use:\n'
      newCode += '// - mesh variable: ' + configuration.geometry.name + '\n\n'
    }
    if (!configuration.geometry && newCode.includes('//TANATLOC GEOMETRY')) {
      const lines = newCode.split('\n')
      const index = lines.findIndex((l) => l === '//TANATLOC GEOMETRY')
      lines.splice(index, 4)
      newCode = lines.join('\n')
    }

    // TODO materials, parameters, ...

    setCode(newCode)
  }, [configuration])

  // Data
  const [form] = Form.useForm()

  const onGeometryOpen = () => {
    setGeometry(true)
  }

  const onGeometryClose = () => {
    setGeometry(false)
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
  }

  const onGeometryDelete = () => {
    setConfiguration({
      ...configuration,
      geometry: null
    })
  }

  const onMaterialsOpen = () => {
    setMaterials(true)
  }

  const onMaterialsClose = () => {
    setMaterials(false)
  }

  const onMaterials = (values) => {
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

  const onParametersOpen = () => {
    setParameters(true)
  }

  const onParametersClose = () => {
    setParameters(false)
  }

  const onParameters = (values) => {
    console.log(values)
  }

  /**
   * Render
   */
  return (
    <>
      <Dialog
        visible={geometry}
        title="Geometry"
        initialValues={{
          meshable: true,
          name: 'Mesh'
        }}
        onCancel={onGeometryClose}
        onOk={(values) => {
          onGeometry(values)
          onGeometryClose()
        }}
      >
        <Form.Item
          name="meshable"
          label="Meshable"
          tooltip="Enable automatic geometry meshing before FreeFEM script launch"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="name"
          label="name"
          tooltip="Only required if the geometry is meshable"
        >
          <Input />
        </Form.Item>
      </Dialog>
      <Dialog
        visible={materials}
        title="Materials"
        initialValues={{}}
        onCancel={onMaterialsClose}
        onOk={(values) => {
          onMaterials(values)
          onMaterialsClose()
        }}
      >
        <Form.Item
          label="Label"
          name="label"
          tooltip="Example: Density"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Symbol" name="symbol" rules={[{ required: true }]}>
          <Select>
            {existingMaterialSymbols.map((m) => (
              <Select.Option key={m}>{m}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Default value"
          name="default"
          tooltip="Example: 1e3"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Unit"
          name="unit"
          tooltip="LaTeX friendly, example: kg.m^{-3}"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Dialog>
      <Dialog
        visible={parameters}
        title="Parameters"
        initialValues={{}}
        onCancel={onParametersClose}
        onOk={(values) => {
          onParameters(values)
          onParametersClose()
        }}
      >
        <Form.Item
          label="Parameters group name"
          name="group"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.List name="parameters">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key}>
                  <Space>
                    Parameters {name + 1}
                    <Button
                      type="danger"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Space>

                  <Form.Item
                    {...restField}
                    label="Label"
                    name={[name, 'label']}
                    fieldKey={[fieldKey, 'label']}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Default value"
                    name={[name, 'default']}
                    fieldKey={[fieldKey, 'default']}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label="Unit"
                    name={[name, 'unit']}
                    fieldKey={[fieldKey, 'unit']}
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              ))}
              <Button onClick={add}>Add</Button>
            </>
          )}
        </Form.List>
      </Dialog>
      <Layout style={{ padding: 10 }}>
        <Layout.Sider theme="light" width="300px" style={{ paddingRight: 10 }}>
          <Form layout="vertical" form={form}>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select
                placeholder={'Select or add a category'}
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        padding: 8
                      }}
                    >
                      <Input
                        style={{ flex: 'auto' }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      />
                      <a
                        style={{
                          flex: 'none',
                          padding: '8px',
                          display: 'block',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          existingCategories.push(category)
                          setCategory()
                        }}
                      >
                        <PlusOutlined /> Add item
                      </a>
                    </div>
                  </div>
                )}
              >
                {existingCategories.map((c) => (
                  <Select.Option key={c}>{c}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item label="Configuration">
              <Form.Item>
                <Button
                  disabled={configuration.geometry}
                  onClick={onGeometryOpen}
                >
                  Geometry
                </Button>
                {configuration?.geometry && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 10
                    }}
                  >
                    Geometry
                    <Button.Group>
                      <Button icon={<EditOutlined />} />
                      <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={onGeometryDelete}
                      />
                    </Button.Group>
                  </div>
                )}
              </Form.Item>
              <Form.Item>
                <Button onClick={onMaterialsOpen}>Materials</Button>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {configuration?.materials?.children?.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 10
                      }}
                    >
                      Material {index + 1}
                      <Button.Group>
                        <Button icon={<EditOutlined />} />
                        <Button type="danger" icon={<DeleteOutlined />} />
                      </Button.Group>
                    </div>
                  ))}
                </div>
              </Form.Item>
              <Form.Item>
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
              <Form.Item
                name="configuration"
                noStyle
                rules={[{ required: true }]}
              >
                <Input value={configuration} style={{ display: 'none' }} />
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={form.resetFields()}>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </Layout.Sider>
        <Layout.Content>
          <Typography.Paragraph>
            Do not remove commented out lines starting with //TANATLOC, this is
            used to include specific pieces of code.
          </Typography.Paragraph>
          <div
            style={{
              width: '100%',
              maxHeight: 'calc(100% - 50px)',
              overflow: 'auto',
              border: '1px solid gray'
            }}
          >
            <SimpleEditor
              value={code}
              onValueChange={(c) => setCode(c)}
              highlight={(c) => highlight(c, languages.freefem)}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12
              }}
            />
          </div>
        </Layout.Content>
      </Layout>
    </>
  )
}

export default Editor
