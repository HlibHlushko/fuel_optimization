import { isLocal, delay } from './utilService'
import { queryString, get, post, delete_ } from './fetchService'
import { auth } from './authService'

export const userClient = {
  get profile () {
    return auth.userProfile
  },
  get signedIn () {
    return auth.signedIn
  },
  createUserAsync (user) {
    return post(process.env.REACT_APP_USERS_URL, queryString(user),
      { 'Content-Type': 'application/x-www-form-urlencoded' })
  },
  deleteUserAsync (user) {
    return delete_(`${process.env.REACT_APP_USERS_URL}/${user.id}`)
  },
  sendAccountConfirmationEmailAsync (user) {
    return post(`${process.env.REACT_APP_USERS_URL}/confirm`, queryString({ userName: user.email }),
      { 'Content-Type': 'application/x-www-form-urlencoded' })
  },
  getUsersAsync () {
    return get(process.env.REACT_APP_USERS_URL)
  }
}

if (isLocal) {
  const createData = (id, fullName, phoneNumber, truck, email) => {
    return { id, fullName, phoneNumber, truck, email }
  }
  let users = [
    createData(1, 'Hlib123', '+380 97 222 42 78', 'DAF -XF 95.430', 'gleb.glushko10@gmail.com'),
    createData(2, 'Oleh', '+380 97 148 82 28', 'Lohr 1.21', 'gleb.glushko10@gmail.com'),
    createData(3, 'Rodion', '+380 95 123 45 67', 'DAF -XF 95.430', 'gleb.glushko10@gmail.com'),
    createData(4, 'Gosha', '+380 97 349 03 92', 'Lohr 1.21', 'meefer@mail.ee'),
    createData(5, 'Hlib1', '+380 97 222 42 78', 'Lohr 2.53', 'meefer@mail.ee'),
    createData(6, 'Oleh1', '+380 97 148 82 28', 'DAF -XF 95.430', 'meefer@mail.ee'),
    createData(7, 'Rodion1', '+380 95 123 45 67', 'Lohr 2.53', 'meefer@mail.ee')
  ]

  userClient.getUsersAsync = delay(() => users)
  userClient.createUserAsync = delay(user => {
    users = users.concat(createData(users[users.length - 1].id + 1, user.fullName, user.phoneNumber, null, user.userName))
  })
  userClient.deleteUserAsync = delay(user => {
    users = users.filter(u => u.id !== user.id)
  })
  userClient.sendAccountConfirmationEmailAsync = delay(() => {})
}
