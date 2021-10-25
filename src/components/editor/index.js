/** @namespace Components.Editor */

import { useState, useEffect } from 'react'
import { Button, Layout, Steps } from 'antd'

import Information from './information'
import Configuration from './configuration'
import Script from './script'

// const headersLine = `//TANATLOC HEADERS (mandatory)
// // You can now use:
// // - function: appendLog(string)
// // - function: appendError(string)\n\n`

// const dimensionLine = `//TANATLOC DIMENSION (mandatory)
// // You can now use:
// // - type: meshN (2D: mesh, 3D: mesh3)
// // - function: intN (2D: int2d, 3D: int3d)
// // - function: intN1 (2D: int1d, 3D, int2d)\n\n`

// const existingMaterialSymbols = ['Rho', 'Mu'] // must match the material database
// // TODO get real datas

/**
 * Editor
 * @memberof Components.Editor
 */
const Editor = () => {
  // State
  const [step, setStep] = useState(0)
  const [informationStatus, setInformationStatus] = useState('wait')
  const [configuration, setConfiguration] = useState({})

  useEffect(() => {
    if (step === 0) setInformationStatus('process')
    else if (
      configuration.name &&
      configuration.category &&
      configuration.description
    ) {
      setInformationStatus('finish')
    } else setInformationStatus('wait')
  }, [step, configuration])

  /**
   * On steps change
   * @param {number} current Current step
   */
  const onStepsChange = (current) => {
    setStep(current)
  }

  const onInformation = (values) => {
    setConfiguration({
      ...configuration,
      ...values
    })
    setStep(step + 1)
  }

  const onConfiguration = (values) => {
    setConfiguration({
      ...configuration,
      ...values
    })
    setStep(step + 1)
  }

  /**
   * Render
   */
  return (
    <Layout>
      <Layout.Sider theme="light" className="editor-sider" width={300}>
        <div className="logo">
          <img src="/images/logo.svg" alt="Tanatloc" />
        </div>
        <Steps
          className="editor-steps"
          type="navigation"
          direction="vertical"
          current={step}
          onChange={onStepsChange}
        >
          <Steps.Step
            status={informationStatus}
            title="Information"
            description="Title, description, category, ..."
          />
          <Steps.Step
            status={step !== 1 && 'wait'}
            title="Configuration"
            description="Geometry, parameters, ..."
          />
          <Steps.Step
            status={step !== 2 && 'wait'}
            title="Script"
            description="FreeFEM template"
          />
        </Steps>
        <Button disabled={true} type="primary">
          Submit
        </Button>
      </Layout.Sider>

      <Layout.Content style={{ padding: '10px' }}>
        {step === 0 && (
          <Information
            configuration={{
              name: configuration.name,
              category: configuration.category,
              description: configuration.description
            }}
            onNext={onInformation}
          />
        )}
        {step === 1 && (
          <Configuration
            configuration={{
              geometry: configuration.geometry,
              materials: configuration.materials,
              parameters: configuration.parameters,
              initialization: configuration.initialization,
              boundaryConditions: configuration.boundaryConditions,
              results: configuration.results
            }}
            onNext={onConfiguration}
          />
        )}
        {step === 2 && <Script />}
      </Layout.Content>
    </Layout>
  )

  // /**
  //  * Render
  //  */
  // return (
  //   <>
  //     <Geometry
  //       visible={geometryVisible}
  //       geometry={
  //         geometry && {
  //           meshable: geometry.meshable,
  //           name: geometry.name
  //         }
  //       }
  //       onOk={onGeometry}
  //       onClose={onGeometryClose}
  //     />
  //     <Dialog
  //       visible={materials}
  //       title="Materials"
  //       initialValues={{}}
  //       onCancel={onMaterialsClose}
  //       onOk={(values) => {
  //         onMaterials(values)
  //         onMaterialsClose()
  //       }}
  //     >
  //       <Form.Item
  //         label="Label"
  //         name="label"
  //         tooltip="Example: Density"
  //         rules={[{ required: true }]}
  //       >
  //         <Input />
  //       </Form.Item>
  //       <Form.Item label="Symbol" name="symbol" rules={[{ required: true }]}>
  //         <Select>
  //           {existingMaterialSymbols.map((m) => (
  //             <Select.Option key={m}>{m}</Select.Option>
  //           ))}
  //         </Select>
  //       </Form.Item>
  //       <Form.Item
  //         label="Default value"
  //         name="default"
  //         tooltip="Example: 1e3"
  //         rules={[{ required: true }]}
  //       >
  //         <Input />
  //       </Form.Item>
  //       <Form.Item
  //         label="Unit"
  //         name="unit"
  //         tooltip="LaTeX friendly, example: kg.m^{-3}"
  //         rules={[{ required: true }]}
  //       >
  //         <Input />
  //       </Form.Item>
  //     </Dialog>
  //     <Dialog
  //       visible={parameters}
  //       title="Parameters"
  //       initialValues={{}}
  //       onCancel={onParametersClose}
  //       onOk={(values) => {
  //         onParameters(values)
  //         onParametersClose()
  //       }}
  //     >
  //       <Form.Item
  //         label="Parameters group name"
  //         name="group"
  //         rules={[{ required: true }]}
  //       >
  //         <Input />
  //       </Form.Item>
  //       <Form.List name="parameters">
  //         {(fields, { add, remove }) => (
  //           <>
  //             {fields.map(({ key, name, fieldKey, ...restField }) => (
  //               <div key={key}>
  //                 <Space>
  //                   Parameters {name + 1}
  //                   <Button
  //                     type="danger"
  //                     icon={<DeleteOutlined />}
  //                     onClick={() => remove(name)}
  //                   />
  //                 </Space>

  //                 <Form.Item
  //                   {...restField}
  //                   label="Label"
  //                   name={[name, 'label']}
  //                   fieldKey={[fieldKey, 'label']}
  //                   rules={[{ required: true }]}
  //                 >
  //                   <Input />
  //                 </Form.Item>
  //                 <Form.Item
  //                   {...restField}
  //                   label="Default value"
  //                   name={[name, 'default']}
  //                   fieldKey={[fieldKey, 'default']}
  //                   rules={[{ required: true }]}
  //                 >
  //                   <Input />
  //                 </Form.Item>
  //                 <Form.Item
  //                   {...restField}
  //                   label="Unit"
  //                   name={[name, 'unit']}
  //                   fieldKey={[fieldKey, 'unit']}
  //                   rules={[{ required: true }]}
  //                 >
  //                   <Input />
  //                 </Form.Item>
  //               </div>
  //             ))}
  //             <Button onClick={add}>Add</Button>
  //           </>
  //         )}
  //       </Form.List>
  //     </Dialog>
  //     <Layout style={{ padding: 10 }}>
  //       <Layout.Sider theme="light" width="300px" style={{ paddingRight: 10 }}>
  //         <Form layout="vertical" form={form}>
  //           <Form.Item name="name" label="Name" rules={[{ required: true }]}>
  //             <Input />
  //           </Form.Item>
  //           <Form.Item
  //             name="category"
  //             label="Category"
  //             rules={[{ required: true }]}
  //           >
  //             <Select
  //               placeholder={'Select or add a category'}
  //               dropdownRender={(menu) => (
  //                 <div>
  //                   {menu}
  //                   <Divider style={{ margin: '4px 0' }} />
  //                   <div
  //                     style={{
  //                       display: 'flex',
  //                       flexWrap: 'nowrap',
  //                       padding: 8
  //                     }}
  //                   >
  //                     <Input
  //                       style={{ flex: 'auto' }}
  //                       value={category}
  //                       onChange={(e) => setCategory(e.target.value)}
  //                     />
  //                     <a
  //                       style={{
  //                         flex: 'none',
  //                         padding: '8px',
  //                         display: 'block',
  //                         cursor: 'pointer'
  //                       }}
  //                       onClick={() => {
  //                         existingCategories.push(category)
  //                         setCategory()
  //                       }}
  //                     >
  //                       <PlusOutlined /> Add item
  //                     </a>
  //                   </div>
  //                 </div>
  //               )}
  //             >
  //               {existingCategories.map((c) => (
  //                 <Select.Option key={c}>{c}</Select.Option>
  //               ))}
  //             </Select>
  //           </Form.Item>
  //           <Form.Item
  //             name="description"
  //             label="Description"
  //             rules={[{ required: true }]}
  //           >
  //             <Input.TextArea />
  //           </Form.Item>

  //       </Layout.Sider>
  //       <Layout.Content>
  //         <Typography.Paragraph>
  //           Do not remove commented out lines starting with //TANATLOC, this is
  //           used to include specific pieces of code.
  //         </Typography.Paragraph>
  //
  //       </Layout.Content>
  //     </Layout>
  //   </>
  // )
}

export default Editor
