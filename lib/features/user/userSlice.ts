import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface UserState {
    isLoggedIn: boolean;
    firebaseUID: string;
    isPremium: boolean;
}

const initialState: UserState = {
    isLoggedIn: false,
    firebaseUID: "",
    isPremium: false,
}

export const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers : {
        logIn: (state, action) => {
            state.isLoggedIn = true;
            state.firebaseUID = action.payload;
        },
        logOut: (state) => {
            state.isLoggedIn = false;
            state.firebaseUID = "";
        },
    }
})

export const { logIn, logOut } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
