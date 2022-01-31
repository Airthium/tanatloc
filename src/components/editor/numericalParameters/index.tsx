import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Layout,
  Select,
  Space,
  Table,
  Typography
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'

import { IConfiguration } from '..'
import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

export interface IProps {
  configuration: IConfiguration
  onNext: ({ numericalParameters: { finiteElementSpace, solver } }) => void
}

/**
 * Numerical parameters
 * @param props Props
 */
const NumericalParameters = ({
  configuration,
  onNext
}: IProps): JSX.Element => {
  const [dialog, setDialog]: [{ title: string; content: any }, Function] =
    useState()
  const [finiteElementSpaceOptions, setFiniteElementSpaceOptions]: [
    { label: string; '2d': string; '3d': string }[],
    Function
  ] = useState([
    { label: 'P2/P1', '2d': '[P2, P2, P1]', '3d': '[P2, P2, P2, P1]' }
  ])
  const [solverOptions, setSolverOptions] = useState([])

  const [add, setAdd] = useState(false)

  const dropdownRender = (menu, onClick) => (
    <>
      {menu}
      <Divider style={{ margin: '4px 0' }} />
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'flex-end',
          paddingRight: '4px'
        }}
      >
        <Button onClick={onClick}>
          <PlusOutlined style={{ color: '#fad114' }} /> /{' '}
          <DeleteOutlined style={{ color: 'red' }} />
        </Button>
      </div>
    </>
  )

  // const setFiniteElementDialog = () => {
  //   setDialog({
  //     title: 'Manage finite element space',
  //     content: (
  //       <>
  //         {/* <Button
  //           type="primary"
  //           icon={<PlusOutlined />}
  //           onClick={() => setAdd(true)}
  //         >
  //           Add finite element space
  //         </Button> */}
  //         <Form>
  //           <Form.Item label="Label" name="label" rules={[{ required: true }]}>
  //             <Input />
  //           </Form.Item>
  //           <Form.Item label="2D" name="2d" rules={[{ required: true }]}>
  //             <Input />
  //           </Form.Item>
  //           <Form.Item label="3D" name="3d" rules={[{ required: true }]}>
  //             <Input />
  //           </Form.Item>
  //           <Form.Item>
  //             <Button htmlType="submit" type="primary">
  //               Add
  //             </Button>
  //           </Form.Item>
  //         </Form>
  //         <Table
  //           pagination={false}
  //           columns={[
  //             { title: 'Label', dataIndex: 'label' },
  //             { title: '2D', dataIndex: '2d' },
  //             { title: '3D', dataIndex: '3d' },
  //             {
  //               title: 'Action',
  //               dataIndex: 'action',
  //               render: (_, record) => (
  //                 <Button
  //                   icon={<DeleteOutlined />}
  //                   onClick={() => console.log(record)}
  //                 />
  //               )
  //             }
  //           ]}
  //           dataSource={finiteElementSpaceOptions}
  //         />
  //       </>
  //     )
  //   })
  // }

  /**
   * Render
   */
  return (
    <Layout>
      {dialog && (
        <Dialog
          visible={true}
          title={dialog.title}
          onCancel={() => setDialog()}
          cancelButtonText="Close"
        >
          {dialog.content}
        </Dialog>
      )}
      <Layout.Content>
        <Card size="small">
          <Form
            layout="vertical"
            initialValues={configuration.numericalParameters}
            onFinish={
              (values) =>
                console.log(values) /*onNext({ numericalParameters: values })*/
            }
          >
            <Typography.Text strong>Finite element space</Typography.Text>
            <br />
            <Form.Item
              name={['finiteElementSpace', 'name']}
              label="Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Options"
              name={['finiteElementSpace', 'options']}
              rules={[{ required: true }]}
            >
              <Select
                dropdownRender={(menu) => dropdownRender(menu, () => {})}
                optionLabelProp="label"
              >
                {finiteElementSpaceOptions.map((option) => (
                  <Select.Option
                    key={option.label}
                    value={option.label}
                    label={option.label}
                  >
                    <div>
                      {option.label} <Button danger icon={<DeleteOutlined />} />
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Typography.Text strong>Solver</Typography.Text>
            <br />
            <Form.Item
              label="Options"
              name={['solver', 'options']}
              rules={[{ required: true }]}
            >
              <Select
                dropdownRender={(menu) => dropdownRender(menu, () => {})}
                options={solverOptions.map((option) => ({
                  label: option,
                  value: option
                }))}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    </Layout>
  )
}

NumericalParameters.propTypes = {
  configuration: PropTypes.shape({
    numericalParameters: PropTypes.exact({
      finiteElementSpace: PropTypes.exact({
        name: PropTypes.string,
        options: PropTypes.array,
        default: PropTypes.string
      }).isRequired,
      solver: PropTypes.exact({
        options: PropTypes.array,
        default: PropTypes.string
      }).isRequired
    })
  }).isRequired,
  onNext: PropTypes.func.isRequired
}

export default NumericalParameters
