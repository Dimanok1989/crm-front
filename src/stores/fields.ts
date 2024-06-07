import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FieldProps {
    id: number,
    isOptions: boolean,
    options: string[],
    placeholder: null | string,
    title: string,
    type: number,
    typeName: string,
    typeKey: string,
}

interface FieldsState {
    isCreate: boolean | number,
    fields: FieldProps[],
}

const initialState: FieldsState = {
    isCreate: false,
    fields: [],
}

export const fields = createSlice({
    name: 'fields',
    initialState,
    reducers: {
        setIsCreate: (state, action: PayloadAction<boolean>) => {
            state.isCreate = action.payload
        },
        setFields: (state, action: PayloadAction<FieldProps[]>) => {
            state.fields = action.payload;
        },
        setField: (state, action: PayloadAction<FieldProps>) => {
            let fields = [];
            let created = true;
            state.fields.forEach((item: FieldProps) => {
                if (item.id === action.payload.id) {
                    created = false;
                    fields.push(action.payload);
                } else {
                    fields.push(item);
                }
            });
            created && fields.push(action.payload);
            state.fields = fields;
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setIsCreate,
    setFields,
    setField,
} = fields.actions

export default fields.reducer;
