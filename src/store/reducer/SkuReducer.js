import { Types } from '../action/action';

const initialState = {
    skuValue: false,
    skuArray: []

};

export const skuReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SET_SKU:
            return {
                ...state,
                skuValue: action.payload || state.skuValue,
            };
        case Types.SKU_ARRAY:
            return {
                ...state,
                skuArray: action.payload || state.skuArray,
            };

        default:
            return state;
    }
};
