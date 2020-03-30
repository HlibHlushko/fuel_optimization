/* global process, localStorage */

import jwtDecode from 'jwt-decode'

import { isLocal, delay, post, queryString } from './utilService'

export const auth = {
  _profile: null,
  _tokens: null,
  _refreshInterval: null,
  signedIn: false,
  get accessToken () {
    return this._tokens.access_token
  },
  get userProfile () {
    return this._profile
  },
  _retrieveTokens () {
    const tokensString = localStorage.getItem('auth-tokens')
    return tokensString == null ? null : JSON.parse(tokensString)
  },
  _storeTokens (tokens) {
    const prevTokens = this._retrieveTokens()
    if (prevTokens != null && tokens.refresh_token == null) {
      tokens.refresh_token = prevTokens.refresh_token
    }

    localStorage.setItem('auth-tokens', JSON.stringify(tokens))
  },
  _removeTokens () {
    localStorage.removeItem('auth-tokens')
  },
  _getTokens (payload, grantType) {
    Object.assign(payload, { grant_type: grantType, scope: 'openid offline_access profile email phone roles' })

    return post(`${process.env.REACT_APP_AUTH_URL}/login`, queryString(payload),
      { 'Content-Type': 'application/x-www-form-urlencoded' })
      .then(tokens => {
        const now = new Date()
        tokens.expiration_date = new Date(now.getTime() + tokens.expires_in * 1000).getTime().toString()

        this._storeTokens(tokens)
        this.signedIn = true
        this._tokens = tokens
        this._profile = jwtDecode(tokens.id_token)
      })
  },
  _refreshTokens () { // TODO: refine logic -> it may fail several times
    return this._getTokens({ refresh_token: this._tokens.refresh_token }, 'refresh_token')
      .catch(err => {
        throw err.status
          ? new Error(`Status "${err.status}": ${JSON.stringify(err.response)}`)
          : err
      })
  },
  _scheduleRefresh () {
    this._refreshInterval = setInterval(() => {
      this._refreshTokens()
        .catch(e => console.log(e))
    }, this._tokens.expires_in / 2 * 1000) // refresh every half the total expiration time
  },
  _startupTokenRefresh () {
    const tokens = this._retrieveTokens()
    if (!tokens) {
      return Promise.reject(new Error('No token in Storage'))
    }

    this.signedIn = true
    this._tokens = tokens
    this._profile = jwtDecode(tokens.id_token)

    // if (+tokens.expiration_date > new Date().getTime()) { // TODO: refresh after half expires_in - time_left_to_expire
    // }

    return this._refreshTokens()
      .then(() => { if (!this._refreshInterval) this._scheduleRefresh() })
  },
  logout () {
    this._removeTokens()
    this.signedIn = false
    this._profile = null
    this._tokens = null
    if (this._refreshInterval) {
      clearInterval(this._refreshInterval)
    }
  },
  initAsync () {
    if (this.signedIn) {
      return Promise.resolve()
    }

    return this._startupTokenRefresh()
  },
  loginAsync (user) {
    return this._getTokens(user, 'password')
      .then(res => {
        this._scheduleRefresh()
        return res
      })
  },
  activateUserAsync (userCodeModel) {
    return post(`${process.env.REACT_APP_AUTH_URL}/activate?${queryString(userCodeModel)}`, {})
  },
  setUserPasswordAsync (passwordModel) {
    return post(`${process.env.REACT_APP_AUTH_URL}/password`, queryString(passwordModel),
      { 'Content-Type': 'application/x-www-form-urlencoded' })
  }
}

if (isLocal) {
  auth.initAsync = delay(() => {
    auth.signedIn = true
    auth._profile = { sub: '1', name: 'Luke Smith', email: 'luke.smith@mail.com', email_verified: 'True', role: 'Manager' }
    auth._tokens = { access_token: 'dummy' }
  }, 0)
  auth.loginAsync = delay(() => ({ error: false }), 0)
  auth.registerAsync = delay(() => {}, 0)
}
