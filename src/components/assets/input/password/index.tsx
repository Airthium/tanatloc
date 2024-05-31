/** @module Components.Assets.Input.Password */

import { Form, Input } from 'antd'

import { IFrontSystem } from '@/api/index.d'

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
}

/**
 * Errors
 */
export const errors = {
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
export const _checkMin = (passwordMinSize: number, value: string): boolean => {
  if (value.length < passwordMinSize) return false
  return true
}

/**
 * Check max
 * @param passwordMaxSize Password max size
 * @param value Value
 */
export const _checkMax = (passwordMaxSize: number, value: string): boolean => {
  if (value.length > passwordMaxSize) return false
  return true
}

/**
 * Check regex
 * @param value Value
 * @param regex Regex
 */
export const _checkRegex = (value: string, regex: RegExp): boolean => {
  if (value.search(regex) === -1) return false
  return true
}

/**
 * Require letter
 * @param system System
 * @param value Value
 */
export const _requireLetter = (
  system: IFrontSystem,
  value: string
): boolean => {
  if (system?.password?.requireLetter ?? REQUIRE_LETTER)
    return _checkRegex(value, /[a-zA-Z]/)
  return true
}

/**
 * Require number
 * @param system System
 * @param value Value
 */
export const _requireNumber = (
  system: IFrontSystem,
  value: string
): boolean => {
  if (system?.password?.requireNumber ?? REQUIRE_NUMBER)
    return _checkRegex(value, /\d/)
  return true
}

/**
 * Require symbol
 * @param system System
 * @param value Value
 */
export const _requireSymbol = (
  system: IFrontSystem,
  value: string
): boolean => {
  if (system?.password?.requireSymbol ?? REQUIRE_SYMBOL)
    return _checkRegex(value, /[!@#$%^&*(){}[\]<>?/|.:;_-]/)
  return true
}

/**
 * Check size
 * @param value Value
 * @param err Errors
 */
export const _checkSize = (
  passwordMinSize: number,
  passwordMaxSize: number,
  value: string,
  err: string[]
): void => {
  if (!_checkMin(passwordMinSize, value))
    err.push(errors.passwordTooSmall(passwordMinSize))

  if (!_checkMax(passwordMaxSize, value))
    err.push(errors.passwordTooLong(passwordMaxSize))
}

/**
 * Check format
 * @param system System
 * @param value Value
 * @param err Errors
 */
export const _checkFormat = (
  system: IFrontSystem,
  value: string,
  err: string[]
): void => {
  if (!_requireLetter(system, value)) err.push(errors.passwordRequireLetter)

  if (!_requireNumber(system, value)) err.push(errors.passwordRequireNumber)

  if (!_requireSymbol(system, value)) err.push(errors.passwordRequireSymbol)
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
const PasswordItem: React.FunctionComponent<IProps> = ({
  labelCol,
  wrapperCol,
  name,
  label,
  inputPlaceholder,
  inputAutoComplete,
  edit,
  style,
  required
}) => {
  // Data
  const [system] = SystemAPI.useSystem()

  const passwordMinSize = system?.password?.min ?? MIN_SIZE
  const passwordMaxSize = system?.password?.max ?? MAX_SIZE

  /**
   * Render
   */
  return (
    <Form.Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      name={name ?? 'password'}
      label={label ?? 'Password'}
      rules={[
        () => ({
          validator(_, value) {
            const err: string[] = []
            if (edit && value === '******') return Promise.resolve()

            if (!value) return Promise.reject(new Error(errors.password))

            _checkSize(passwordMinSize, passwordMaxSize, value, err)
            _checkFormat(system, value, err)

            if (err.length) return Promise.reject(new Error(err.join('; ')))
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

export default PasswordItem
