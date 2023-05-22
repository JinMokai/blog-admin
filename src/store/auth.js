
// auth.js
const state = {
    user: null,
    token: localStorage.getItem('token') || ''
}

const mutations = {
    setUser(state, user) {
        state.user = user
        localStorage.setItem('user', user)
    },
    setToken(state, token) {
        state.token = token
        localStorage.setItem('token', token)
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
