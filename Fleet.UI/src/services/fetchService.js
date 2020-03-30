import { get as getBase, put as putBase, post as postBase, delete_ as deleteBase } from './utilService'
import { auth } from './authService'

export { queryString } from './utilService'

export function get (url, headers = {}) {
  return getBase(url, { Authorization: `Bearer ${auth.accessToken}`, ...headers })
}

export function post (url, payload, headers = {}) {
  return postBase(url, payload, { Authorization: `Bearer ${auth.accessToken}`, ...headers })
}

export function put (url, payload, headers = {}) {
  return putBase(url, payload, { Authorization: `Bearer ${auth.accessToken}`, ...headers })
}

export function delete_ (url, headers = {}) {
  return deleteBase(url, { Authorization: `Bearer ${auth.accessToken}`, ...headers })
}
