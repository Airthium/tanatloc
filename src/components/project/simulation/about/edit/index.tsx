/** @module Components.Project.Simulation.About.Edit */

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import {
  IFrontSimulationsItem,
  IFrontMutateSimulationsItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'name'>
export type Swr = {
  mutateOneSimulation: (
    simulation: IFrontMutateSimulationsItem
  ) => Promise<void>
}
export interface IProps {
  simulation: Simulation
  swr: Swr
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
  simulation: Simulation,
  values: { name: string },
  swr: Swr
): Promise<void> => {
  // API
  await SimulationAPI.update({ id: simulation.id }, [
    { key: 'name', value: values.name }
  ])

  // Local
  await swr.mutateOneSimulation({
    id: simulation.id,
    name: values.name
  })
}

/**
 * Edit
 * @param props Props
 * @çeturns Edit
 */
const Edit: React.FunctionComponent<IProps> = ({ simulation, swr }) => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

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
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
        setLoading(false)
        throw err
      }
    },
    [simulation, swr, dispatch]
  )

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

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
