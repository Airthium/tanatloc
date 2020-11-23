/** @module renderer/store/select */

import { selectActionTypes } from './action'

/**
 * Select initial state
 */
export const selectInitialState = {
  enabled: false,
  type: null,
  part: null,
  highlighted: null,
  selected: []
}

/**
 * Select reducer
 * @param {Object} state Redux state
 * @param {Object} action Action
 */
const reducer = (state, action) => {
  if (!state) state = selectInitialState
  switch (action.type) {
    case selectActionTypes.ENABLE:
      return {
        ...state,
        enabled: true
      }
    case selectActionTypes.DISABLE:
      return {
        ...state,
        enabled: false,
        highlighted: null,
        selected: []
      }
    case selectActionTypes.CLEAR:
      return selectInitialState
    case selectActionTypes.SETTYPE:
      return {
        ...state,
        type: action.object
      }
    case selectActionTypes.SETPART:
      return {
        ...state,
        part: action.uuid
      }
    case selectActionTypes.HIGHLIGHT:
      return {
        ...state,
        highlighted: action.uuid
      }
    case selectActionTypes.UNHIGHLIGHT:
      return {
        ...state,
        highlighted: null
      }
    case selectActionTypes.SELECT:
      return {
        ...state,
        selected: [...state.selected, action.uuid]
      }
    case selectActionTypes.UNSELECT:
      const index = state.selected.findIndex((s) => s === action.uuid)
      if (index !== -1) {
        return {
          ...state,
          selected: [
            ...state.selected.slice(0, index),
            ...state.selected.slice(index + 1)
          ]
        }
      } else return state
    default:
      return state
  }
}

export default reducer
