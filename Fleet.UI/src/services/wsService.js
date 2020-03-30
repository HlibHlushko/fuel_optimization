import { HubConnectionBuilder } from '@aspnet/signalr'

import { isLocal, delay } from './utilService'
import { auth } from '../services/authService'

export const ws = {
  _connection: null,
  _connected: false,
  get connection () {
    return this._connection
  },
  get connected () {
    return this._connected
  },
  connect () {
    this._connection = new HubConnectionBuilder()
      .withUrl('/tm/notificationhub', {
        accessTokenFactory: () => auth.accessToken
      })
      .build()

    return this._connection.start()
      .then(() => {
        this._connected = true
      })
  },
  disconnect () {
    this._connected = false
    this._connection && this._connection.stop()
  }
}

if (isLocal) {
  ws.connect = () => {
    ws._connection = { on: () => {} }
    return delay(() => {
      ws._connected = true
    }, 0)()
  }
  ws.disconnect = () => { this._connected = false }
}
