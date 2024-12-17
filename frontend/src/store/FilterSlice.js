import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    data: {
        location: '',
        address: '',
        type: '',
        rate: [0, 150],
        rating: '',
        minAge: ''
    },
    applied: false,
    initialdata:[]
}

export const filterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        handleFilterState: (state, action) => {
            state.data = { ...state.data, ...action.payload }

        },
        clearFilterstate: (state) => {
            state.data = {
                location: '',
                address: '',
                type: '',
                rate: [0, 150],
                rating: '',
                minAge: ''
            }
            state.applied = false
        },
        handleApplied: (state) => {
            state.applied = !state.applied
        },
        setInitialdata :(state, action)=>{
            state.initialdata = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { handleFilterState, clearFilterstate, handleApplied, setInitialdata } = filterSlice.actions

export const FilterReducer = filterSlice.reducer