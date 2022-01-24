export const Types = {
    GET_SKU: "GET_SKU",
    SET_SKU: "SET_SKU",
    SKU_ARRAY: "SKU_ARRAY",
    RESET_SKU: "RESET_SKU",
    RESET_SKU_ARRAY: 'RESET_SKU_ARRAY'
};

export const getSku = payload => ({
    type: Types.GET_SKU,
    payload
});

export const setSku = payload => ({
    type: Types.SET_SKU,
    payload
});

export const resetSkuValue = () => ({
    type: Types.RESET_SKU,
});


export const resetSkuArray = () => ({
    type: Types.RESET_SKU_ARRAY,
});


export const setSkuArray = payload => ({
    type: Types.SKU_ARRAY,
    payload
});


// resetSkuValue RESET_SKU_ARRAY