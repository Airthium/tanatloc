/** @module Components.Utils.AsyncFunctionExec */

/**
 * Assync function execution
 * @param callback Callback
 */
export const asyncFunctionExec = (callback: () => Promise<void>): void => {
  callback().catch(console.error)
}
