/**
 * Select action types
 * @memberof module:'src/store/select
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
 * @memberof module:'src/store/select
 */
export const enable = () => ({
  type: selectActionTypes.ENABLE
})

/**
 * Disable select
 * @memberof module:'src/store/select
 */
export const disable = () => ({
  type: selectActionTypes.DISABLE
})

/**
 * Clear selection
 * @memberof module:'src/store/select
 */
export const clear = () => ({
  type: selectActionTypes.CLEAR
})

/**
 * Set type (solid, face, edge)
 * @memberof module:'src/store/select
 * @param {Object} object Type
 */
export const setType = (object) => ({
  type: selectActionTypes.SETTYPE,
  object
})

/**
 * Set part
 * @memberof module:'src/store/select
 * @param {string} uuid Part uuid
 */
export const setPart = (uuid) => ({
  type: selectActionTypes.SETPART,
  uuid
})

/**
 * Highlight
 * @memberof module:'src/store/select
 * @param {string} uuid uuid
 */
export const highlight = (uuid) => ({
  type: selectActionTypes.HIGHLIGHT,
  uuid
})

/**
 * Unhighlight
 * @memberof module:'src/store/select
 */
export const unhighlight = () => ({
  type: selectActionTypes.UNHIGHLIGHT
})

/**
 * Select
 * @memberof module:'src/store/select
 * @param {string} uuid uuid
 */
export const select = (uuid) => ({
  type: selectActionTypes.SELECT,
  uuid
})

/**
 * Unselect
 * @memberof module:'src/store/select
 * @param {string} uuid uuit
 */
export const unselect = (uuid) => ({
  type: selectActionTypes.UNSELECT,
  uuid
})
