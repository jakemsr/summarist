import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/lib/features/user/userSlice"
import modalSlice from "@/lib/features/modal/modalSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userSlice,
            modal: modalSlice,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
