import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

import {
  MIN_SIZE,
  MAX_SIZE,
  REQUIRE_LETTER,
  REQUIRE_NUMBER,
  REQUIRE_SYMBOL
} from '@/config/auth'

import SystemAPI from '@/api/system'

/**
 * Errors (password)
 * @memberof Components.Assets.Input
 */
const errors = {
  password: 'Please enter a password',
  passwordTooSmall: 'Your password is too small',
  passwordTooLong: 'Your password is too long',
  passwordRequireLetter: 'Your password must contain a letter',
  passwordRequireNumber: 'Your password must contain a number',
  passwordRequireSymbol: 'Your password must contain a symbol'
}

/**
 * Password item
 * @memberof Components.Assets.Input
 * @param {Object} props Props `{ labelCol, wrapperCol, name, label, inputPlaceholder, inputAutoComplete, edit, style }`
 *
 * @description
 * Props:
 * - name: Name of the form item (default: `password`)
 * - label: Label of the form item (default: `Password`)
 * - inputPlaceholder: Input placeholder (default: none)
 * - inputAutoComplete: Input autocomplete (default: none)
 * - edit: Allow `******` as a valid password for editing purpose (default: `false`)
 * - style: Style of the form item (default: none)
 */
const PasswordItem = ({
  labelCol,
  wrapperCol,
  name,
  label,
  inputPlaceholder,
  inputAutoComplete,
  edit,
  style
}) => {
  // Data
  const [system] = SystemAPI.useSystem()

  /**
   * Check min
   * @param {string} value Value
   */
  const checkMin = (value) => {
    if (
      value.length <
      (system?.password?.min !== undefined ? system?.password?.min : MIN_SIZE)
    )
      return false
    return true
  }

  /**
   * Check max
   * @param {string} value Value
   */
  const checkMax = (value) => {
    if (
      value.length >
      (system?.password?.max !== undefined ? system?.password?.max : MAX_SIZE)
    )
      return false
    return true
  }

  /**
   * Check regex
   * @param {string} value Value
   * @param {RegExp} regex Regex
   */
  const checkRegex = (value, regex) => {
    if (value.search(regex) === -1) return false
    return true
  }

  /**
   * Require letter
   * @param {string} value Value
   */
  const requireLetter = (value) => {
    if (
      system?.password?.requireLetter !== undefined
        ? system?.password?.requireLetter
        : REQUIRE_LETTER
    )
      return checkRegex(value, /[a-zA-Z]/)
    return true
  }

  /**
   * Require number
   * @param {string} value Value
   */
  const requireNumber = (value) => {
    if (
      system?.password?.requireNumber !== undefined
        ? system?.password?.requireNumber
        : REQUIRE_NUMBER
    )
      return checkRegex(value, /[0-9]/)
    return true
  }

  /**
   * Require symbol
   * @param {string} value Value
   */
  const requireSymbol = (value) => {
    if (
      system?.password?.requireSymbol !== undefined
        ? system?.password?.requireSymbol
        : REQUIRE_SYMBOL
    )
      return checkRegex(value, /[!@#$%^&*(){}[\]<>?/|.:;_-]/)
    return true
  }

  /**
   * Check size
   * @param {string} value Value
   * @param {Array} err Errors
   */
  const checkSize = (value, err) => {
    if (!checkMin(value)) err.push(errors.passwordTooSmall)

    if (!checkMax(value)) err.push(errors.passwordTooLong)
  }

  /**
   * Check format
   * @param {string} value Value
   * @param {Array} err Errors
   */
  const checkFormat = (value, err) => {
    if (!requireLetter(value)) err.push(errors.passwordRequireLetter)

    if (!requireNumber(value)) err.push(errors.passwordRequireNumber)

    if (!requireSymbol(value)) err.push(errors.passwordRequireSymbol)
  }

  /**
   * Render
   */
  return (
    <Form.Item
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      name={name || 'password'}
      label={label || 'Password'}
      rules={[
        { required: true, message: errors.password },
        () => ({
          validator(_, value) {
            const err = []
            if (edit && value === '******') return Promise.resolve()
            /* istanbul ignore next */
            if (!value) return Promise.resolve()

            checkSize(value, err)
            checkFormat(value, err)

            if (err.length) return Promise.reject(err.join(' - '))
            else return Promise.resolve()
          }
        })
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
  style: PropTypes.object
}

export default PasswordItem
