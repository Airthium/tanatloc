/** @module Context.Select.Actions */

import { actionTypes, ISelect, ISelectAction, ISelectPoint } from '.'

/**
 * Enable
 */
export const enable = (): ISelectAction => ({ type: actionTypes.ENABLE })

/**
 * Disable
 */
export const disable = (): ISelectAction => ({ type: actionTypes.DISABLE })

/**
 * Clear
 */
export const clear = (): ISelectAction => ({ type: actionTypes.CLEAR })

/**
 * Set type
 * @param type Type
 */
export const setType = (
  type: 'solids' | 'faces' | 'edges' | 'point'
): ISelectAction => ({ type: actionTypes.SETTYPE, value: type })

/**
 * Set part
 * @param part Part
 */
export const setPart = (part?: string): ISelectAction => ({
  type: actionTypes.SETPART,
  value: part
})

/**
 * Highlight
 * @param highlighted Highlighted
 */
export const highlight = (highlighted?: ISelect): ISelectAction => ({
  type: actionTypes.HIGHLIGHT,
  value: highlighted
})

/**
 * Select
 * @param selected Selected
 */
export const select = (selected: ISelect[]): ISelectAction => ({
  type: actionTypes.SELECT,
  value: selected
})

/**
 * Set point
 * @param point Point
 */
export const setPoint = (point?: ISelectPoint): ISelectAction => ({
  type: actionTypes.SETPOINT,
  value: point
})

/**
 * Set data
 * @param data Data
 */
export const setData = (data?: boolean): ISelectAction => ({
  type: actionTypes.SETDATA,
  value: data
})

/**
 * Set post processing
 * @param postProcessing Post processing
 */
export const setPostProcessing = (postProcessing?: boolean): ISelectAction => ({
  type: actionTypes.SETPOSTPROCESSING,
  value: postProcessing
})
