/** @module Components.Organizations.Add */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Form, Input } from 'antd'

import { INewOrganization } from '@/database/index.d'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Props
 */
export interface IProps {
  swr: {
    addOneOrganization: (organization: INewOrganization) => void
  }
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add organization'
}

/**
 * On add
 * @param values Values
 * @param swr SWR
 */
export const onAdd = async (
  values: { name: string },
  swr: { addOneOrganization: (origanization: INewOrganization) => void }
): Promise<void> => {
  try {
    // API
    const organization = await OrganizationAPI.add({ name: values.name })

    // Local
    organization.name = values.name
    swr.addOneOrganization(organization)
  } catch (err) {
    ErrorNotification(errors.add, err)
    throw err
  }
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({ swr }: IProps): JSX.Element => {
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
      <Dialog
        title="New organization"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            await onAdd(values, swr)

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
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>
      </Dialog>

      <AddButton onAdd={() => setVisible(true)}>New organization</AddButton>
    </>
  )
}

Add.propTypes = {
  swr: PropTypes.exact({
    addOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Add
