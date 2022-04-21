/** @module Components.Project.Simulation.BoundaryConditions.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Typography } from 'antd'

import { ISimulation } from '@/database/simulation/index'
import { IModelTypedBoundaryCondition } from '@/models/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { SelectContext } from '@/context/select'
import { unselect } from '@/context/select/actions'

import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation: ISimulation
  type: string
  index: number
  swr: {
    mutateOneSimulation: (simulation: ISimulation) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to delete the boundary condition'
}

/**
 * On delete
 * @param simulation Simulation
 * @param type Type
 * @param index Index
 * @param dispatch Dispatch
 * @param swr SWR
 */
export const onDelete = async (
  simulation: IProps['simulation'],
  type: IProps['type'],
  index: IProps['index'],
  dispatch: Dispatch<any>,
  swr: IProps['swr']
): Promise<void> => {
  try {
    // New simulation
    const newSimulation = { ...simulation }

    // Update local
    const boundaryConditions =
      newSimulation.scheme.configuration.boundaryConditions
    const typedBoundaryCondition = boundaryConditions[
      type
    ] as IModelTypedBoundaryCondition
    const boundaryCondition = typedBoundaryCondition.values[index]

    // (unselect)
    boundaryCondition.selected.forEach((s) => {
      dispatch(unselect(s))
    })

    typedBoundaryCondition.values = [
      ...typedBoundaryCondition.values.slice(0, index),
      ...typedBoundaryCondition.values.slice(index + 1)
    ]

    // Diff
    let done = false
    Object.keys(boundaryConditions).forEach((t) => {
      if (t === 'index' || t === 'title' || t === 'done') return
      const ttypedBoundaryCondition = boundaryConditions[
        t
      ] as IModelTypedBoundaryCondition
      if (ttypedBoundaryCondition.values?.length) done = true
    })
    const diff = {
      ...boundaryConditions,
      done: done
    }

    // API
    await SimulationAPI.update({ id: simulation.id }, [
      {
        key: 'scheme',
        type: 'json',
        method: 'set',
        path: ['configuration', 'boundaryConditions'],
        value: diff
      }
    ])

    // Local
    swr.mutateOneSimulation(newSimulation)
  } catch (err) {
    ErrorNotification(errors.update, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @return Delete
 */
const Delete = ({ type, index, simulation, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  // Data
  const { dispatch } = useContext(SelectContext)
  const boundaryConditions = simulation.scheme.configuration.boundaryConditions
  const typedBoundaryCondition = boundaryConditions[
    type
  ] as IModelTypedBoundaryCondition
  const boundaryCondition = typedBoundaryCondition.values[index]

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(simulation, type, index, dispatch, swr)
        } finally {
          setLoading(false)
        }
      }}
      text={
        <>
          Are you sure you want to delete the condition{' '}
          <Typography.Text strong>{boundaryCondition?.name}</Typography.Text>?
        </>
      }
    />
  )
}

Delete.propTypes = {
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  simulation: PropTypes.exact({
    id: PropTypes.string.isRequired,
    scheme: PropTypes.shape({
      configuration: PropTypes.shape({
        boundaryConditions: PropTypes.object.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneSimulation: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
