import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { Button, Form, Input } from 'antd'

import { AddButton } from '@/components/assets/button'

import { IConfiguration } from '../..'

export interface IProps {
  parameter?: IConfiguration['parameters']['key'] & { key: string }
  onAdd?: (values: IConfiguration['parameters']['key']) => void
  onEdit?: (values: IConfiguration['parameters']['key']) => void
}

const Parameter = ({ parameter, onAdd, onEdit }: IProps): JSX.Element => {
  return <div />
}

Parameter.propTypes = {
  parameter: PropTypes.exact({
    key: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.object).isRequired
  }),
  onAdd: PropTypes.func,
  onEdit: PropTypes.func
}

export default Parameter
