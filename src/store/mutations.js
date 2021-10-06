export const updateBalance = (state, payload) => {

    if (!state.valueOfInventory)
        state.valueOfInventory = 0
    else if (!state.sales)
        state.sales = 0
    else if (payload.valueOfInventory == null)
        payload.valueOfInventory = 0
    else if (payload.sales == null)
        payload.sales = 0

    if (payload) {
        state.valueOfInventory = parseFloat(state.valueOfInventory) + parseFloat(payload.valueOfInventory)
        state.sales = parseFloat(state.sales) + parseFloat(payload.sales)
    }

    if (payload.sales == 0) {
        state.sales = 0
    } else if (payload.valueOfInventory == 0) {
        state.valueOfInventory = 0
    }
}

export const setUid = (state, uid) => {
    state.uid = uid
}

export const setToken = (state, token) => {
    state.token = token;
}

export const clearToken = (state) => {
    state.token = "";
}

export const clearUid = (state) => {
    state.uid = "";
}