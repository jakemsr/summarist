import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface UserState {
    isLoggedIn: boolean
}

const initialState: UserState = {
    isLoggedIn: false
}

export const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers : {
        logOut: (state) => {
            state.isLoggedIn = false;
        },
        logIn: (state) => {
            state.isLoggedIn = true;
        },
    }
})

export const { logOut, logIn } = userSlice.actions

export const selectUser = (state: RootState) => state.user.isLoggedIn

export default userSlice.reducer
