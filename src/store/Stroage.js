import { createStore } from "vuex";
import auth from "./auth"

const Store = createStore({
    modules: {
        auth
    }
})
export default Store