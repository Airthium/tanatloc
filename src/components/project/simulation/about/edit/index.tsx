/** @module Components.Project.Simulation.About.Edit */

import { useState } from 'react'
import { Form, Input } from 'antd'

import { EditButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'
import Dialog from '@/components/assets/dialog'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: Pick<IFrontSimulationsItem, 'id' | 'name'>
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update simulation'
}

/**
 * On edit
 * @param simulation Simulation
 * @param values Values
 * @param swr SWR
 */
export const onEdit = async (
  simulation: Pick<IFrontSimulationsItem, 'id'>,
  values: { name: string },
  swr: {
    mutateOneSimulation: (simulation: IFrontMutateSimulationsItem) => void
  }
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
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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

export default Edit
