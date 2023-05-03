/** @module Components.Project.Simulation.About.Edit */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { EditButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'
import Dialog from '@/components/assets/dialog'

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
export const _onEdit = async (
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
  } catch (err: any) {
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
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * On edit
   * @param values Values
   */
  const onEdit = useCallback(
    async (values: { name: string }): Promise<void> => {
      setLoading(true)
      try {
        await _onEdit(simulation, values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
        throw err
      }
    },
    [simulation, swr]
  )

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * Render
   */
  return (
    <>
      <EditButton onEdit={setVisibleTrue} />
      <Dialog
        title="Edit the simulation's name"
        visible={visible}
        initialValues={{ name: simulation.name }}
        onCancel={setVisibleFalse}
        onOk={onEdit}
        loading={loading}
      >
        <Form.Item
          name="name"
          label="Name:"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input ref={inputRef} />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Edit
