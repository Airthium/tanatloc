const Geometry = ({ visible, onOk, onClose }) => {
  return (
    <Dialog
      visible={visible}
      title="Geometry"
      initialValues={{
        meshable: true,
        name: 'Mesh'
      }}
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

export default Geometry
