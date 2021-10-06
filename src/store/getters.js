export const getBalance = (state) => {
    return {
        valueOfInventory: state.valueOfInventory,
        sales: state.sales
    }
}

export const isAuthenticated = (state) => {
    return state.token !== ""
}

export const getUid = (state) => {
    if (state.uid != "") {
        return {
            uid: state.uid
        }
    } else {
        return {
            uid: localStorage.getItem("uid")
        }
    }
}