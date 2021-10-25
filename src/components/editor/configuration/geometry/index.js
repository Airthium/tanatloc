import PropTypes from 'prop-types'
import { Checkbox, Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'

const Geometry = ({ visible, geometry, onOk, onClose }) => {
  /**
   * Render
   */
  return (
    <Dialog
      visible={visible}
      title="Geometry"
      initialValues={
        geometry
          ? geometry
          : {
              meshable: true,
              name: 'Mesh'
            }
      }
      onCancel={onClose}
      onOk={(values) => {
        onOk(values)
        onClose()
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
        label="Mesh name"
        tooltip="Only required if the geometry is meshable"
      >
        <Input />
      </Form.Item>
    </Dialog>
  )
}

Geometry.propTypes = {
  visible: PropTypes.bool.isRequired,
  geometry: PropTypes.exact({
    meshable: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired
  }),
  onOk: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Geometry
