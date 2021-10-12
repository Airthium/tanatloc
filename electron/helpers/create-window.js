import { screen, BrowserWindow } from 'electron'
import * as Store from 'electron-store'

/**
 * Create electron window
 * @memberof Electron
 * @param {string} windowName Window name
 * @param {Object} options Options
 * @description Create the electron window
 */
export default function createWindow(windowName, options) {
  const key = 'window-state'
  const name = `window-state-${windowName}`
  const store = new Store({ name })
  const defaultSize = {
    width: options.width,
    height: options.height
  }
  let state = {}
  let win

  /**
   * Restore store
   * @memberof Electron
   * @returns {Object} Store
   */
  const restore = () => store.get(key, defaultSize)

  /**
   * Get current position
   * @memberof Electron
   * @returns {Object} Position
   */
  const getCurrentPosition = () => {
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
   * @param {Object} windowState Window state
   * @param {Object} bounds Bounds
   * @returns {boolean} Within
   */
  const windowWithinBounds = (windowState, bounds) => {
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
   * @returns {Object} Defaults
   */
  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    })
  }

  /**
   * Ensure visibile on some display
   * @memberof Electron
   * @param {Object} windowState Window state
   * @returns {Object} Window state
   */
  const ensureVisibleOnSomeDisplay = (windowState) => {
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
  const saveState = () => {
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
