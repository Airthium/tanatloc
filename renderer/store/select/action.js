export const selectActionTypes = {
  CLEAR: 'CLEAR',
  SETTYPE: 'SETTYPE',
  SETPART: 'SETPART',
  HIGHLIGHT: 'HIGHLIGHT',
  UNHIGHLIGHT: 'UNHIGHLIGHT',
  SELECT: 'SELECT',
  UNSELECT: 'UNSELECT'
}

export const clear = () => ({
  type: selectActionTypes.CLEAR
})

export const setType = (object) => ({
  type: selectActionTypes.SETTYPE,
  object
})

export const setPart = (uuid) => ({
  type: selectActionTypes.SETPART,
  uuid
})

export const highlight = (part) => ({
  type: selectActionTypes.HIGHLIGHT,
  part
})

export const unhighlight = () => ({
  type: selectActionTypes.UNHIGHLIGHT
})

export const select = (part) => ({
  type: selectActionTypes.SELECT,
  part
})

export const unselect = (part) => ({
  type: selectActionTypes.UNSELECT,
  part
})
