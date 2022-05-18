/**
 * promise finally polyfill
 */
function promiseFinally(callback) {
  const promise = this
  const P = this.constructor

  if (typeof callback === 'function') {
    return promise.then(
      (value) => P.resolve(callback()).then(() => value),
      (reason) => P.resolve(callback()).then(() => { throw reason })
    )
  }

  return promise.then(callback, callback)
}

/* eslint-disable no-extend-native */
Promise.prototype.finally = promiseFinally
