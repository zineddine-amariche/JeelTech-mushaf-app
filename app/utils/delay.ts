/**
 * A "modern" sleep statement.
 *
 * @param ms The number of milliseconds to wait.
 */
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>): Promise<ReturnType<T>> =>
    new Promise((resolve) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => resolve(func(...args)), wait)
    })
}
