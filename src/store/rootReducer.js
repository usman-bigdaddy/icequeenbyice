import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import productReducer from "./products/product-slice";
import authReducer from "./admin-auth/admin-auth-slice";
import usersReducer from "./users/users-slice";
import orderReducer from "./orders/orders-slice";
import customerProductsReducer from "./customer/products/products-slice";
import cartReducer from "./customer/cart/cart-slice";

const appReducer = combineReducers({
  product: productReducer,
  auth: authReducer,
  users: usersReducer,
  order: orderReducer,
  customerProducts: customerProductsReducer,
  cart: cartReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
};

export default persistReducer(persistConfig, rootReducer);
