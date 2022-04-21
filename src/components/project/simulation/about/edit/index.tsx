/** @module Components.Project.Simulation.About.Edit */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Form, Input } from 'antd'

import { ISimulation } from '@/database/simulation/index'

import { EditButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'
import Dialog from '@/components/assets/dialog'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update the simulation'
}

/**
 * On edit
 * @param simulation Simulation
 * @param values Values
 * @param swr SWR
 */
export const onEdit = async (
  simulation: ISimulation,
  values: { name: string },
  swr: IProps['swr']
): Promise<void> => {
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
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Edit
 * @param props Props
 * @çeturns Edit
 */
const Edit = ({ simulation, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <>
      <EditButton onEdit={() => setVisible(true)} />
      <Dialog
        title="Edit the simulation's name"
        visible={visible}
        initialValues={{ name: simulation.name }}
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            await onEdit(simulation, values, swr)

            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
        loading={loading}
      >
        <Form.Item
          name="name"
          label="Name:"
          rules={[{ required: true, message: 'Name is required' }]}
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
