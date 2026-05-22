import { configureStore } from "@reduxjs/toolkit";
import userSlice from "@/lib/features/user/userSlice"
import modalSlice from "@/lib/features/modal/modalSlice";
import sidebarSlice from "@/lib/features/sidebar/sidebarSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            user: userSlice,
            modal: modalSlice,
            sidebar: sidebarSlice,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
