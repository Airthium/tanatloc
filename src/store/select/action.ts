/** @module Store.Select.Action */

/**
 * Select action types
 */
export const selectActionTypes = {
  ENABLE: 'ENABLE',
  DISABLE: 'DISABLE',
  CLEAR: 'CLEAR',
  SETTYPE: 'SETTYPE',
  SETPART: 'SETPART',
  HIGHLIGHT: 'HIGHLIGHT',
  UNHIGHLIGHT: 'UNHIGHLIGHT',
  SELECT: 'SELECT',
  UNSELECT: 'UNSELECT'
}

/**
 * Enable select
 */
export const enable = (): { type: string } => ({
  type: selectActionTypes.ENABLE
})

/**
 * Disable select
 */
export const disable = (): { type: string } => ({
  type: selectActionTypes.DISABLE
})

/**
 * Clear selection
 */
export const clear = (): { type: string } => ({
  type: selectActionTypes.CLEAR
})

/**
 * Set type (solid, face, edge)
 * @param object Type
 */
export const setType = (object: string): { type: string; object: string } => ({
  type: selectActionTypes.SETTYPE,
  object
})

/**
 * Set part
 * @param uuid Part uuid
 */
export const setPart = (uuid: string): { type: string; uuid: string } => ({
  type: selectActionTypes.SETPART,
  uuid
})

/**
 * Highlight
 * @param uuid uuid
 */
export const highlight = (uuid: string): { type: string; uuid: string } => ({
  type: selectActionTypes.HIGHLIGHT,
  uuid
})

/**
 * Unhighlight
 */
export const unhighlight = (): { type: string } => ({
  type: selectActionTypes.UNHIGHLIGHT
})

/**
 * Select
 * @param uuid uuid
 */
export const select = (uuid: string): { type: string; uuid: string } => ({
  type: selectActionTypes.SELECT,
  uuid
})

/**
 * Unselect
 * @param uuid uuit
 */
export const unselect = (uuid: string): { type: string; uuid: string } => ({
  type: selectActionTypes.UNSELECT,
  uuid
})
