
import jwtDecode from 'jwt-decode'
import axios from 'axios'
const state = {
  loading: false,
  token: true,
  err: null
}
const mutations = {
  storeLoginRequest (state) {
    state.loading = true
    state.token = null
    state.err = null
  },
  storeLoginSuccess (state, payload) {
    state.loading = false
    state.token = payload
    state.err = null
  },
  storeLoginFail (state, payload) {
    state.loading = false
    state.token = null
    state.err = payload
  }
}

const actions = {
  login ({ commit }, authUser) {
    commit('storeLoginRequest')
    axios
      .post('https://vexere-api-060197.herokuapp.com/api/users/login', authUser)
      .then((result) => {
        const decode = jwtDecode(result.data.token)
        console.log(decode)
        if (decode.userType === 'client') {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            response: { data: { message: 'Bạn không có quyền truy cập' } }
          })
        }
        commit('storeLoginSuccess', result.data.token)
      })
      .catch((err) => {
        commit('storeLoginFail', err)
      })
  }
}

export default { state, mutations, actions }
