import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface UserState {
    isLoggedIn: boolean;
    isPremium: boolean;
}

const initialState: UserState = {
    isLoggedIn: false,
    isPremium: false,
}

export const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers : {
        logIn: (state) => {
            state.isLoggedIn = true;
        },
        logOut: (state) => {
            state.isLoggedIn = false;
        },
    }
})

export const { logIn, logOut } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
