import Vue from 'vue';
import Vuex from 'vuex';
import product from './modules/product';
import * as getters from "./getters";
import * as actions from "./actions";
import * as mutations from "./mutations";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        token: "",
        baseURL: "https://vue-login-and-product-default-rtdb.firebaseio.com/",
        fbAPIKey: "AIzaSyDGRAx8NvtQtYTjpTN6XIp75YA8r75vc1o",
        valueOfInventory: 0,
        sales: 0,
        uid: ""
    },
    getters,
    actions,
    mutations,
    modules: {
        product
    }
})