/* global fetch */

export const isLocal = process.env.REACT_APP_TM_URL == null

export const delay = (resolveFunc, ms) => {
  return function (...args) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(resolveFunc.apply(null, args)), ms)
    })
  }
}

export function queryString (obj) {
  return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')
}

export function validEmail (email) {
  return email.length < 256 && /^[^@]+@[^@]{2,}\.[^@]{2,}$/.test(email)
}

function _fetch (method, url, headers, payload) {
  return fetch(url, {
    method,
    headers,
    body: payload
  })
    .then(res => res.json()
      .then(resj => {
        if (res.ok) {
          return resj
        } else {
          const err = { response: resj, status: res.status }
          throw err
        }
      }, () => {
        if (res.ok) {
          return {}
        } else {
          const err = { status: res.status }
          throw err
        }
      })
    )
}

export function get (url, headers) {
  return _fetch('GET', url, headers)
}
export function post (url, payload, headers) {
  return _fetch('POST', url, { 'Content-Type': 'application/json', ...(headers || {}) }, payload)
}
export function put (url, payload, headers) {
  return _fetch('PUT', url, { 'Content-Type': 'application/json', ...(headers || {}) }, payload)
}
export function delete_ (url, headers) {
  return _fetch('DELETE', url, headers)
}
