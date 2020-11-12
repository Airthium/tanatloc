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

export const enable = () => ({
  type: selectActionTypes.ENABLE
})

export const disable = () => ({
  type: selectActionTypes.DISABLE
})

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

export const highlight = (uuid) => ({
  type: selectActionTypes.HIGHLIGHT,
  uuid
})

export const unhighlight = () => ({
  type: selectActionTypes.UNHIGHLIGHT
})

export const select = (uuid) => ({
  type: selectActionTypes.SELECT,
  uuid
})

export const unselect = (uuid) => ({
  type: selectActionTypes.UNSELECT,
  uuid
})
