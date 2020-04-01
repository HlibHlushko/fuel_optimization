import { get as getBase, put as putBase, post as postBase, delete_ as deleteBase } from './utilService'

export function get (url, headers = {}) {
  return getBase(url, { ...headers })
}

export function post (url, payload, headers = {}) {
  return postBase(url, payload, { ...headers })
}

export function put (url, payload, headers = {}) {
  return putBase(url, payload, { ...headers })
}

export function delete_ (url, headers = {}) {
  return deleteBase(url, { ...headers })
}
