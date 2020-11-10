import { selectActionTypes } from './action'

export const selectInitialState = {
  enabled: false,
  type: null,
  part: null,
  highlighted: null,
  selected: []
}

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
        enabled: false
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
        uuid: action.uuid
      }
    case selectActionTypes.HIGHLIGHT:
      return {
        ...state,
        highlighted: action.part
      }
    case selectActionTypes.UNHIGHLIGHT:
      return {
        ...state,
        highlighted: null
      }
    case selectActionTypes.SELECT:
      return {
        ...state,
        selected: [...state.selected, action.part]
      }
    case selectActionTypes.UNSELECT:
      const index = state.selected.findIndex((s) => s.uuid === action.part.uuid)
      if (index !== -1) {
        return {
          ...state,
          selected: [
            ...state.selected.splice(0, index),
            ...state.selected.splice(index + 1)
          ]
        }
      } else return state
    default:
      return state
  }
}

export default reducer
