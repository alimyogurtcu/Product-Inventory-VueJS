import Vue from "vue";
import {
    router
} from "../../router"

const state = {
    products: [],
    baseURL: "https://vue-login-and-product-default-rtdb.firebaseio.com/"
}

const getters = {
    getProducts(state) {
        return state.products;
    },
    getProduct(state) {
        return key => state.products.filter(element => {
            return element.key == key;
        })
    }
}

const mutations = {
    updateProductList(state, product) {
        state.products.push(product);
    },
    deleteProductListProduct(state, product) {
        const index = state.products.map(function (e) {
            return e.key
        }).indexOf(product)
        state.products.splice(index, 1);
    }
}

const actions = {
    initApp({
        state,
        commit,
        getters
    }) {
        Vue.http.get(state.baseURL + getters.getUid.uid + "/products.json")
            .then(response => {
                let data = response.body
                for (let key in data) {
                    data[key].key = key
                    commit("updateProductList", data[key])
                }
            })
    },
    deleteApp({
        state,
        commit,
        getters
    }) {
        Vue.http.get(state.baseURL + getters.getUid.uid + "/products.json")
            .then(response => {
                let data = response.body
                for (let key in data) {
                    data[key].key = key
                    commit("deleteProductListProduct", data[key])
                }
            })
    },
    saveProduct({
        state,
        commit,
        dispatch,
        getters
    }, payload) {
        Vue.http.post(state.baseURL + getters.getUid.uid + "/products.json", payload)
            .then((response) => {
                payload.key = response.body.name;
                commit("updateProductList", payload);
                let totalBalance = {
                    valueOfInventory: payload.totalValue,
                    sales: 0
                }
                dispatch("setBalance", totalBalance)
                router.replace("/product-list").catch(() => {});
            })
    },
    updateProduct({
        state,
        dispatch,
        getters
    }, payload) {

        let product = state.products.filter(element => {
            return element.key == payload.key;
        })
        Vue.http.get(state.baseURL + getters.getUid.uid + "/products/" + payload.key + ".json")
            .then(response => {
                let lastBalance = response.body.totalValue
                let minusBalance = 0 - (lastBalance)

                let extendLastBalance = {
                    valueOfInventory: minusBalance,
                    sales: 0
                }

                dispatch("setBalance", extendLastBalance)
            })

        let updatedBalance = payload.price * payload.count;

        if (product) {
            Vue.http.patch(state.baseURL + getters.getUid.uid + "/products/" + payload.key + ".json", payload)
                .then((response) => {
                    console.log(response)
                    let totalBalance = {
                        valueOfInventory: updatedBalance,
                        sales: 0
                    }
                    dispatch("setBalance", totalBalance)
                    router.replace("/product-list").catch(() => {});
                })
        }
    },
    sellProduct({
        state,
        dispatch,
        getters
    }, payload) {
        let product = state.products.filter(element => {
            return element.key == payload.key;
        })
        let totalCount = product[0].count - payload.count;
        let totalBalance = product[0].price * totalCount;
        let lastBalance = product[0].price * product[0].count
        let newBalance = lastBalance - totalBalance
        let totalSell = payload.count * payload.price
        Vue.http.patch(state.baseURL + getters.getUid.uid + "/products/" + payload.key + ".json", {
                count: totalCount,
                totalValue: totalBalance
            })
            .then(response => {
                console.log(response)
                product[0].count = totalCount
                product[0].totalValue = totalBalance
                let minusBalance = 0 - newBalance
                let totalBalanced = {
                    valueOfInventory: minusBalance,
                    sales: totalSell
                }
                dispatch("setBalance", totalBalanced)
                router.replace("/product-list").catch(() => {});
            })
    },
    deleteProduct({
        state,
        commit,
        dispatch,
        getters
    }, payload) {
        let product = state.products.filter(element => {
            return element.key == payload.key;
        })
        commit("deleteProductListProduct", payload.key)
        Vue.http.delete(state.baseURL + getters.getUid.uid + "/products/" + payload.key + ".json")
            .then(response => {
                console.log(response)
                let minusBalance = 0 - (product[0].count * product[0].price)
                let totalBalance = {
                    valueOfInventory: minusBalance,
                    sales: 0
                }
                dispatch("setBalance", totalBalance)
                router.replace("/product-list").catch(() => {});
            })
    },
    deleteAll({
        state,
        commit,
        dispatch,
        getters
    }) {
        Vue.http.delete(state.baseURL + getters.getUid.uid + "/products.json")
            .then(response => {
                console.log(response)
                Vue.http.put(state.baseURL + getters.getUid.uid + "/total-balance/valueOfInventory.json", 0)
                    .then(response => {
                        console.log(response)
                        let temp = {
                            sales: 0
                        }
                        dispatch("deleteApp")
                        commit("updateBalance", temp)
                    })
                router.replace("/product-transactions").catch(() => {});
            })
    },
    resetSales({
        state,
        commit,
        getters
    }) {
        Vue.http.put(state.baseURL + getters.getUid.uid + "/total-balance/sales.json", 0)
            .then(response => {
                console.log(response)
                let temp = {
                    valueOfInventory: 0
                }
                commit("updateBalance", temp)
            })
        router.replace("/product-transactions").catch(() => {});
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}