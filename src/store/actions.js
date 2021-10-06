import Vue from "vue"
import {
    router
} from "../router"
import {
    getAuth,
    signInWithEmailAndPassword,
    deleteUser,
    updatePassword,
    updateEmail
} from "firebase/auth";
import {
    store
} from "./store";

export const setBalance = ({
    state,
    commit,
    getters
}, payload) => {
    commit("updateBalance", payload)
    let balanceTotal = +state.valueOfInventory
    let sellTotal = +state.sales
    let totalBalance = {
        valueOfInventory: balanceTotal,
        sales: sellTotal
    }
    Vue.http.put(state.baseURL + getters.getUid.uid + "/total-balance.json", totalBalance)
        .then(response => {
            console.log(response)
        })
}

export const getBalance = ({
    state,
    commit,
    getters
}) => {
    Vue.http.get(state.baseURL + getters.getUid.uid + "/total-balance.json")
        .then(response => {
            if (response.body)
                commit("updateBalance", response.body)
        })
}

export const initLogin = ({
    commit,
    dispatch,
}) => {
    let token = localStorage.getItem("token")
    if (token) {
        let expirationDate = localStorage.getItem("expirationDate")
        let time = new Date().getTime()

        if (time >= +expirationDate) {
            dispatch("logout")
        } else {
            commit("setToken", token)
        }
    } else {
        return false
    }
}

export const login = ({
    state,
    commit,
    dispatch,
}, authData) => {
    let authLink =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
    if (authData.isUser) {
        authLink =
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
    }
    return Vue.http
        .post(authLink + state.fbAPIKey, {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true,
        })
        .then((response) => {
            commit("setToken", response.data.idToken)
            if (authData.email.length > 0)
                localStorage.setItem("email", authData.email)
            if (authData.password.length > 0)
                localStorage.setItem("password", authData.password)
            localStorage.setItem("token", response.data.idToken)

            const auth = getAuth();
            signInWithEmailAndPassword(auth, authData.email, authData.password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    const uid = user.uid
                    store.state.uid = uid
                    commit("setUid", uid)
                    localStorage.setItem("uid", uid)
                    dispatch("getBalance");
                    dispatch("initApp");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    let errorMsg = errorMessage.charAt(0).toUpperCase() + error.slice(1)
                    this.$toastr.e(errorMsg, "Error Code: " + errorCode);
                });
        });


}

export const userDelete = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    deleteUser(user).then(() => {}).catch((error) => {
        let errorMsg = error.charAt(0).toUpperCase() + error.slice(1)
        this.$toastr.e(errorMsg, "Error")
    });
}

export const userUpdate = (newData) => {
    const auth = getAuth();
    const user = auth.currentUser;

    updateEmail(user, newData.email).then(() => {
        localStorage.setItem("email", newData.email)
        updatePassword(user, newData.password).then(() => {
            localStorage.setItem("password", newData.password)
        }).catch((error) => {
            let errorMsg = error.charAt(0).toUpperCase() + error.slice(1)
            this.$toastr.e(errorMsg, "Error")
        });
    }).catch((error) => {
        let errorMsg = error.charAt(0).toUpperCase() + error.slice(1)
        this.$toastr.e(errorMsg, "Error")
    });
}

export const logout = ({
    commit,
    dispatch
}) => {
    dispatch("deleteApp");
    let temp = {
        sales: 0
    }
    let temp2 = {
        valueOfInventory: 0
    }
    commit("updateBalance", temp)
    commit("updateBalance", temp2)

    commit("clearToken")
    commit("clearUid")
    localStorage.removeItem("uid")
    localStorage.removeItem("token")
    localStorage.removeItem("expirationDate")
    localStorage.removeItem("email")
    localStorage.removeItem("password")
    router.replace("/auth").catch(() => {});
}

export const setTimeoutTimer = ({
    dispatch
}, payload) => {
    let second = payload * 1000
    localStorage.setItem("expirationDate", new Date().getTime() + second)

    setTimeout(() => {
        dispatch("logout")
    }, second)
}