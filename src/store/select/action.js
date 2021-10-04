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
export const enable = () => ({
  type: selectActionTypes.ENABLE
})

/**
 * Disable select
 * @memberof Store.Select
 */
export const disable = () => ({
  type: selectActionTypes.DISABLE
})

/**
 * Clear selection
 * @memberof Store.Select
 */
export const clear = () => ({
  type: selectActionTypes.CLEAR
})

/**
 * Set type (solid, face, edge)
 * @memberof Store.Select
 * @param {Object} object Type
 */
export const setType = (object) => ({
  type: selectActionTypes.SETTYPE,
  object
})

/**
 * Set part
 * @memberof Store.Select
 * @param {string} uuid Part uuid
 */
export const setPart = (uuid) => ({
  type: selectActionTypes.SETPART,
  uuid
})

/**
 * Highlight
 * @memberof Store.Select
 * @param {string} uuid uuid
 */
export const highlight = (uuid) => ({
  type: selectActionTypes.HIGHLIGHT,
  uuid
})

/**
 * Unhighlight
 * @memberof Store.Select
 */
export const unhighlight = () => ({
  type: selectActionTypes.UNHIGHLIGHT
})

/**
 * Select
 * @memberof Store.Select
 * @param {string} uuid uuid
 */
export const select = (uuid) => ({
  type: selectActionTypes.SELECT,
  uuid
})

/**
 * Unselect
 * @memberof Store.Select
 * @param {string} uuid uuit
 */
export const unselect = (uuid) => ({
  type: selectActionTypes.UNSELECT,
  uuid
})
