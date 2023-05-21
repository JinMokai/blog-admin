import { createStore } from "vuex";
const Store = createStore({
    state() {
        return {
            username: "",
            token: "",
            role: ""
        }
    },
    getters: {

    },
    mutations: {
        /**
          * 清理用户
          * @param {Object} state 
          */
        clearUserInfo(state) {
            state.username = ""
            localStorage.clear()
        },
        /**
         * 登录
         * @param {Object} state 
         * @param {Object} name && password 
         */
        login(state, { username,token }) {
            let ul = localStorage.getItem("token")
            if (ul) {
                state.username = ul
            } else {
                state.username = username
                state.token = token
                localStorage.setItem("userName", name)
            }

        }
    }
})

export default Store