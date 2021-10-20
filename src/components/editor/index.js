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
  Typography
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import SimpleEditor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs/components/prism-core'
import './prism/prism-freefem.js'

import Dialog from '@/components/assets/dialog'

import 'prism-themes/themes/prism-vs.css'

const existingCategories = ['Academic', 'Fluid', 'Mechanics']
const existingMaterialSymbols = ['Rho', 'Mu']
// TODO get real datas

/**
 * Editor
 * @memberof Components.Editor
 */
const Editor = () => {
  // State
  const [code, setCode] = useState('')
  const [category, setCategory] = useState()
  const [configuration, setConfiguration] = useState({})

  const [geometry, setGeometry] = useState(false)
  const [materials, setMaterials] = useState(false)

  useEffect(() => {
    const baseCode = '//TANATLOC HEADERS\n//TANATLOC DIMENSION\n'

    let newCode = baseCode

    if (configuration.geometry) {
      newCode += '//TANATLOC GEOMETRY\n'
    }

    if (configuration.materials) {
      newCode += '//TANATLOC MATERIALS\n'
    }

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

  console.log(configuration)

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
          setGeometry(false)
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
          setMaterials(false)
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
          tooltip="Example: kg.m^{-3}"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
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
                <Button onClick={onGeometryOpen}>Geometry</Button>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  {configuration?.geometry && (
                    <Button type="danger" icon={<DeleteOutlined />} />
                  )}
                </div>
              </Form.Item>
              <Form.Item>
                <Button onClick={onMaterialsOpen}>Materials</Button>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  {configuration?.materials?.children?.map((m, index) => (
                    <Button type="danger" icon={<DeleteOutlined />}>
                      Material {index + 1}
                    </Button>
                  ))}
                </div>
              </Form.Item>
              <Form.Item>
                <Button disabled={true}>Parameters</Button>
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
