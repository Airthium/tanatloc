/**
 * Select action types
 * @memberof Store.Select
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
 * @memberof Store.Select
 */
export const enable = (): { type: string } => ({
  type: selectActionTypes.ENABLE
})

/**
 * Disable select
 * @memberof Store.Select
 */
export const disable = (): { type: string } => ({
  type: selectActionTypes.DISABLE
})

/**
 * Clear selection
 * @memberof Store.Select
 */
export const clear = (): { type: string } => ({
  type: selectActionTypes.CLEAR
})

/**
 * Set type (solid, face, edge)
 * @memberof Store.Select
 * @param object Type
 */
export const setType = (object: string): { type: string; object: string } => ({
  type: selectActionTypes.SETTYPE,
  object
})

/**
 * Set part
 * @memberof Store.Select
 * @param uuid Part uuid
 */
export const setPart = (uuid: string): { type: string; uuid: string } => ({
  type: selectActionTypes.SETPART,
  uuid
})

/**
 * Highlight
 * @memberof Store.Select
 * @param uuid uuid
 */
export const highlight = (uuid: string): { type: string; uuid: string } => ({
  type: selectActionTypes.HIGHLIGHT,
  uuid
})

/**
 * Unhighlight
 * @memberof Store.Select
 */
export const unhighlight = (): { type: string } => ({
  type: selectActionTypes.UNHIGHLIGHT
})

/**
 * Select
 * @memberof Store.Select
 * @param uuid uuid
 */
export const select = (uuid: string): { type: string; uuid: string } => ({
  type: selectActionTypes.SELECT,
  uuid
})

/**
 * Unselect
 * @memberof Store.Select
 * @param uuid uuit
 */
export const unselect = (uuid: string): { type: string; uuid: string } => ({
  type: selectActionTypes.UNSELECT,
  uuid
})
