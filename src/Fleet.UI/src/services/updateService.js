import { HubConnectionBuilder } from '@aspnet/signalr'

export const updateService = {
  _connection: null,
  get connection () {
    return this._connection
  },
  connect () {
    this._connection = new HubConnectionBuilder()
      .withUrl('/tm/tripshub')
      .build()
    return this._connection.start()
  }
}
