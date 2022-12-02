/** @module Context.Select.Actions */

import { actionTypes, ISelect, ISelectAction, ISelectPoint } from '.'

/**
 * Enable
 */
export const enable = (): ISelectAction => {
  return { type: actionTypes.ENABLE }
}

/**
 * Disable
 */
export const disable = (): ISelectAction => {
  return { type: actionTypes.DISABLE }
}

/**
 * Clear
 */
export const clear = (): ISelectAction => {
  return { type: actionTypes.CLEAR }
}

/**
 * Set type
 * @param type Type
 */
export const setType = (
  type: 'solids' | 'faces' | 'edges' | 'point'
): ISelectAction => {
  return { type: actionTypes.SETTYPE, value: type }
}

/**
 * Set part
 * @param part Part
 */
export const setPart = (part: string): ISelectAction => {
  return { type: actionTypes.SETPART, value: part }
}

/**
 * Highlight
 * @param value Value
 */
export const highlight = ({ uuid, label }: ISelect): ISelectAction => {
  return {
    type: actionTypes.HIGHLIGHT,
    value: { uuid, label }
  }
}

/**
 * Unhighlight
 */
export const unhighlight = (): ISelectAction => {
  return { type: actionTypes.UNHIGHLIGHT }
}

/**
 * Select
 * @param value Value
 */
export const select = ({ uuid, label }: ISelect): ISelectAction => {
  return {
    type: actionTypes.SELECT,
    value: { uuid, label: label }
  }
}

/**
 * Unselect
 * @param value Value
 */
export const unselect = ({ uuid, label }: ISelect): ISelectAction => {
  return {
    type: actionTypes.UNSELECT,
    value: { uuid, label: label }
  }
}

/**
 * Set point
 * @param point Point
 */
export const setPoint = (point?: ISelectPoint): ISelectAction => {
  return {
    type: actionTypes.SETPOINT,
    value: point
  }
}
