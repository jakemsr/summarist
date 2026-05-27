import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import type { UserSubscription } from "@/lib/types";

export interface UserState {
    isLoggedIn: boolean;
    firebaseUID: string;
    subscription: UserSubscription;
    email: string;
}

const initialState: UserState = {
    isLoggedIn: false,
    firebaseUID: "",
    subscription: "Basic",
    email: "",
}

export const userSlice = createSlice ({
    name: 'user',
    initialState,
    reducers : {
        logIn: (state, action) => {
            state.isLoggedIn = action.payload["isLoggedIn"];
            state.firebaseUID = action.payload["firebaseUID"];
            state.subscription = action.payload["subscription"];
            state.email = action.payload["email"];
        },
        logOut: (state) => {
            state.isLoggedIn = false;
            state.firebaseUID = "";
            state.subscription = "Basic";
            state.email = "";
        },
    }
})

export const { logIn, logOut } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
