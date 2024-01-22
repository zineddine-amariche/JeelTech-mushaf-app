export const createPromise = (handler) => {
  let resolve, reject

  const promise = new Promise(function (_resolve, _reject) {
    resolve = _resolve
    reject = _reject
    if (handler) handler(resolve, reject)
  })

  promise.resolve = resolve
  promise.reject = reject
  return promise
}

export const series = (arrayOfPromises) => {
  var results = []
  let seriesPromise = Promise.resolve()
  for (let i = 0; i < arrayOfPromises.length; i++) {
    const promise = arrayOfPromises[i]
    seriesPromise = seriesPromise.then(() => {
      return promise().then((result) => {
        results.push(result)
      })
    })
  }
  return seriesPromise.then(() => results)
}
export const copyToClipboard = (string) => {
  Clipboard.setString(string)
}
export const isPromise = (value) => {
  return Boolean(value && typeof value.then === "function")
}
export const returnsPromise = (f) => {
  if (f.constructor.name === "AsyncFunction" || (typeof f === "function" && isPromise(f()))) {
    return true
  }

  return false
}
export const _p = (foo, fieldName) => {
  return new Promise((resolve, reject) => {
    if (returnsPromise(foo)) {
      foo()
        .then((res) => {
          resolve({ field: fieldName, value: res })
        })
        .catch((e) => resolve({ field: fieldName, value: e }))
    } else {
      resolve({ field: fieldName, value: foo() })
    }
  })
}
