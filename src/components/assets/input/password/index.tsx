/** @module Components.Assets.Input.Password */

import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

import { ISystem } from '@/database/index.d'

import {
  MIN_SIZE,
  MAX_SIZE,
  REQUIRE_LETTER,
  REQUIRE_NUMBER,
  REQUIRE_SYMBOL
} from '@/config/auth'

import SystemAPI from '@/api/system'

/**
 * Props
 */
export interface IProps {
  labelCol?: {}
  wrapperCol?: {}
  name?: string
  label?: string
  inputPlaceholder?: string
  inputAutoComplete?: string
  edit?: boolean
  style?: {}
  required?: boolean
  className?: string
}

/**
 * Errors
 */
const errors = {
  password: 'Please enter a password',
  passwordTooSmall: (min: number) =>
    'Your password is too small (minimum ' + min + ' characters)',
  passwordTooLong: (max: number) =>
    'Your password is too long (maximum ' + max + ' characters)',
  passwordRequireLetter: 'Your password must contain a letter',
  passwordRequireNumber: 'Your password must contain a number',
  passwordRequireSymbol: 'Your password must contain a symbol'
}

/**
 * Check min
 * @param passwordMinSize Password min size
 * @param value Value
 */
export const checkMin = (passwordMinSize: number, value: string): boolean => {
  if (value.length < passwordMinSize) return false
  return true
}

/**
 * Check max
 * @param passwordMaxSize Password max size
 * @param value Value
 */
export const checkMax = (passwordMaxSize: number, value: string): boolean => {
  if (value.length > passwordMaxSize) return false
  return true
}

/**
 * Check regex
 * @param value Value
 * @param regex Regex
 */
export const checkRegex = (value: string, regex: RegExp): boolean => {
  if (value.search(regex) === -1) return false
  return true
}

/**
 * Require letter
 * @param system System
 * @param value Value
 */
export const requireLetter = (system: ISystem, value: string): boolean => {
  if (system?.password?.requireLetter ?? REQUIRE_LETTER)
    return checkRegex(value, /[a-zA-Z]/)
  return true
}

/**
 * Require number
 * @param system System
 * @param value Value
 */
export const requireNumber = (system: ISystem, value: string): boolean => {
  if (system?.password?.requireNumber ?? REQUIRE_NUMBER)
    return checkRegex(value, /\d/)
  return true
}

/**
 * Require symbol
 * @param system System
 * @param value Value
 */
export const requireSymbol = (system: ISystem, value: string): boolean => {
  if (system?.password?.requireSymbol ?? REQUIRE_SYMBOL)
    return checkRegex(value, /[!@#$%^&*(){}[\]<>?/|.:;_-]/)
  return true
}

/**
 * Check size
 * @param value Value
 * @param err Errors
 */
export const checkSize = (
  passwordMinSize: number,
  passwordMaxSize: number,
  value: string,
  err: string[]
): void => {
  if (!checkMin(passwordMinSize, value))
    err.push(errors.passwordTooSmall(passwordMinSize))

  if (!checkMax(passwordMaxSize, value))
    err.push(errors.passwordTooLong(passwordMaxSize))
}

/**
 * Check format
 * @param system System
 * @param value Value
 * @param err Errors
 */
export const checkFormat = (
  system: ISystem,
  value: string,
  err: string[]
): void => {
  if (!requireLetter(system, value)) err.push(errors.passwordRequireLetter)

  if (!requireNumber(system, value)) err.push(errors.passwordRequireNumber)

  if (!requireSymbol(system, value)) err.push(errors.passwordRequireSymbol)
}

/**
 * Password item
 * @param props Props
 *
 * @description
 * Props:
 * - labelCol (Object) Label layout
 * - wrapperCol (Object) Input layout
 * - name (string) Name of the form item (default: `password`)
 * - label (string) Label of the form item (default: `Password`)
 * - inputPlaceholder (string) Input placeholder (default: none)
 * - inputAutoComplete (string) Input autocomplete (default: none)
 * - edit (boolean) Allow `******` as a valid password for editing purpose (default: `false`)
 * - style (Object) Style of the form item (default: none)
 * @returns PasswordItem
 */
const PasswordItem = ({
  labelCol,
  wrapperCol,
  name,
  label,
  inputPlaceholder,
  inputAutoComplete,
  edit,
  style,
  required,
  className
}: IProps): JSX.Element => {
  // Data
  const [system] = SystemAPI.useSystem()

  const passwordMinSize = system?.password?.min ?? MIN_SIZE
  const passwordMaxSize = system?.password?.max ?? MAX_SIZE

  /**
   * Render
   */
  return (
    <Form.Item
      className={className}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      name={name || 'password'}
      label={label || 'Password'}
      rules={[
        () => ({
          validator(_, value) {
            const err = []
            if (edit && value === '******') return Promise.resolve()

            if (!value) return Promise.reject(errors.password)

            checkSize(passwordMinSize, passwordMaxSize, value, err)
            checkFormat(system, value, err)

            if (err.length) return Promise.reject(err)
            else return Promise.resolve()
          }
        }),
        {
          required: !!required,
          message: ''
        }
      ]}
      style={style}
    >
      <Input.Password
        placeholder={inputPlaceholder}
        autoComplete={inputAutoComplete}
      />
    </Form.Item>
  )
}

PasswordItem.propTypes = {
  labelCol: PropTypes.object,
  wrapperCol: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  inputAutoComplete: PropTypes.string,
  edit: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string
}

export default PasswordItem
