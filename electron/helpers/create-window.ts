import { screen, BrowserWindow } from 'electron'
import Store from 'electron-store'

interface IWindow {
  getPosition: () => number[]
  getSize: () => number[]
  isMaximized: () => boolean
  isMinimized: () => boolean
  loadURL: (url: string) => Promise<void>
  maximize: () => void
  on: (event: string, callback: Function) => void
  webContents: {
    openDevTools: () => void
  }
}

interface IWindowState {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Create electron window
 * @memberof Electron
 * @param windowName Window name
 * @param options Options
 * @description Create the electron window
 */
export default (
  windowName: string,
  options: { width: number; height: number; webPreferences?: {} }
): IWindow => {
  const key = 'window-state'
  const name = `window-state-${windowName}`
  const store = new Store()
  store.set('name', name)
  const defaultSize = {
    width: options.width,
    height: options.height
  }
  let state = {}
  let win: IWindow

  /**
   * Restore store
   * @memberof Electron
   * @returns Store
   */
  const restore = (): any => store.get(key, defaultSize)

  /**
   * Get current position
   * @memberof Electron
   * @returns Position
   */
  const getCurrentPosition = (): IWindowState => {
    const position = win.getPosition()
    const size = win.getSize()
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    }
  }

  /**
   * Window within bounds
   * @memberof Electron
   * @param windowState Window state
   * @param bounds Bounds
   * @returns Within
   */
  const windowWithinBounds = (
    windowState: IWindowState,
    bounds: IWindowState
  ): boolean => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    )
  }

  /**
   * Reset to defaults
   * @memberof Electron
   * @returns Defaults
   */
  const resetToDefaults = (): IWindowState => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    })
  }

  /**
   * Ensure visibile on some display
   * @memberof Electron
   * @param windowState Window state
   * @returns Window state
   */
  const ensureVisibleOnSomeDisplay = (
    windowState: IWindowState
  ): IWindowState => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds)
    })
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults()
    }
    return windowState
  }

  /**
   * Save state
   * @memberof Electron
   */
  const saveState = (): void => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition())
    }
    store.set(key, state)
  }

  state = ensureVisibleOnSomeDisplay(restore())

  win = new BrowserWindow({
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      ...options.webPreferences
    }
  })

  win.on('close', saveState)

  return win
}
