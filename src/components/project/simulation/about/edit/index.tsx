import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Input } from 'antd'

import { ISimulation } from '@/database/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'
import Dialog from '@/components/assets/dialog'
import { EditButton } from '@/components/assets/button'

import SimulationAPI from '@/api/simulation'

export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors (about/edit)
 * @memberof Components.Project.Simulation
 */
const errors = {
  update: 'Unable to update the simulation'
}

/**
 * Edit
 * @memberof Components.Project.Geometry
 * @param props Props
 */
const Edit = ({ simulation, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On edit
   * @param values Values
   */
  const onEdit = async (values: { name: string }): Promise<void> => {
    setLoading(true)

    try {
      // API
      await SimulationAPI.update({ id: simulation.id }, [
        { key: 'name', value: values.name }
      ])

      // Local
      swr.mutateOneSimulation({
        id: simulation.id,
        name: values.name
      })

      // Loading
      setLoading(false)

      // Close
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.update, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <EditButton onEdit={() => setVisible(true)} />
      <Dialog
        title="Edit the geometry's name"
        visible={visible}
        initialValues={{ name: simulation.name }}
        onCancel={() => setVisible(false)}
        onOk={onEdit}
        loading={loading}
      >
        <Form.Item
          name="name"
          label="Name:"
          rules={[{ required: true, message: 'A name is required' }]}
        >
          <Input />
        </Form.Item>
      </Dialog>
    </>
  )
}

Edit.propTypes = {
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneSimulation: PropTypes.func.isRequired
  })
}

export default Edit
