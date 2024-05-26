import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPayloadObject } from '../interfaces'

interface LeadsState {
    isShowCreate: boolean,
    leads: any[],
}

const initialState: LeadsState = {
    isShowCreate: false,
    leads: [],
}

export const leads = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setIsShowCreate: (state, action: PayloadAction<boolean>) => {
            state.isShowCreate = action.payload
        },
        setLeads: (state, action: PayloadAction<any[]>) => {
            state.leads = action.payload;
        },
        appendLead: (state, action: PayloadAction<any[]>) => {
            let leads = state.leads;
            leads.unshift(action.payload);
            state.leads = leads;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setIsShowCreate,
    setLeads,
    appendLead,
} = leads.actions

export default leads.reducer
