import { combineReducers } from "redux";
import { skuReducer } from "./SkuReducer";

//index for reducers
const appReducer = combineReducers({
    skuRes: skuReducer,
    
});

export default appReducer;