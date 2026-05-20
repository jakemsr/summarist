import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface ModalState {
    isOpen: boolean;
}

const initialState: ModalState = {
    isOpen: false
}

export const modalSlice = createSlice ({
    name: 'modal',
    initialState,
    reducers : {
        openModal: (state) => {
            state.isOpen = true;
        },
        closeModal: (state) => {
            state.isOpen = false;
        },
    }
})

export const { openModal, closeModal } = modalSlice.actions;

export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;
