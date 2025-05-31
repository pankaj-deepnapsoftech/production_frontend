import { configureStore } from "@reduxjs/toolkit";
import {agentApi, api, bomApi, employeeApi, invoiceApi, paymentApi, processApi, productApi, proformaInvoiceApi, storeApi, userRoleApi} from "./api/api";
import authSlice from "./reducers/authSlice";
import sidebarSlice from "./reducers/sidebarSlice";
import drawersSlice from "./reducers/drawersSlice";
import CommonSlice from "./reducers/commonSlice";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [sidebarSlice.name]: sidebarSlice.reducer,
    [drawersSlice.name]: drawersSlice.reducer,
    [CommonSlice.name] : CommonSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware).concat([productApi.middleware, storeApi.middleware, agentApi.middleware, bomApi.middleware, userRoleApi.middleware, employeeApi.middleware, proformaInvoiceApi.middleware, invoiceApi.middleware, processApi.middleware, paymentApi.middleware])
});

export default store;
