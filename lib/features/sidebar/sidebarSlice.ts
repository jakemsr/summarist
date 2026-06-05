import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import { FontSize } from "@/lib/types";


export interface SidebarState {
    isOpen: boolean;
    fontSize: FontSize;
}

const initialState: SidebarState = {
    isOpen: false,
    fontSize: FontSize.small
}

export const sidebarSlice = createSlice ({
    name: 'sidebar',
    initialState,
    reducers : {
        openSidebar: (state) => {
            state.isOpen = true;
        },
        closeSidebar: (state) => {
            state.isOpen = false;
        },
        setFontSize: (state, action) => {
            state.fontSize = action.payload;
        }
    }
})

export const { openSidebar, closeSidebar, setFontSize } = sidebarSlice.actions;

export const selectSidebar = (state: RootState) => state.user;

export default sidebarSlice.reducer;
