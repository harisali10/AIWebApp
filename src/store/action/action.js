export const Types = {
    GET_SKU: "GET_SKU",
    SET_SKU: "SET_SKU",
    SKU_ARRAY: "SKU_ARRAY"
};

export const getSku = payload => ({
    type: Types.GET_SKU,
    payload
});

export const setSku = payload => ({
    type: Types.SET_SKU,
    payload
});

export const setSkuArray = payload => ({
    type: Types.SKU_ARRAY,
    payload
});
