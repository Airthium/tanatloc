/** @module Context.Select.Actions */

import { IPart } from '@/lib/three/loaders/PartLoader'

import { actionTypes, ISelect, ISelectAction } from '.'

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
export const setType = (type: 'solids' | 'faces' | 'edges'): ISelectAction => {
  return { type: actionTypes.SETTYPE, value: type }
}

/**
 * Set part
 * @param part Part
 */
export const setPart = (part: IPart): ISelectAction => {
  return { type: actionTypes.SETPART, value: part }
}

/**
 * Highlight
 * @param value { uuid, label }
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
 * @param value { uuid, label }
 */
export const select = ({ uuid, label }: ISelect): ISelectAction => {
  return {
    type: actionTypes.SELECT,
    value: { uuid, label: label }
  }
}

/**
 * Unselect
 * @param value { uuid, label }
 */
export const unselect = ({ uuid, label }: ISelect): ISelectAction => {
  return {
    type: actionTypes.UNSELECT,
    value: { uuid, label: label }
  }
}
