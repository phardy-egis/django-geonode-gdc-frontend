import { createSlice } from '@reduxjs/toolkit'

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        filters: []
    },
    reducers: {
        // This function sets the value of search filter
        setSearchFilter: (state, action) => {
            state.filters = state.filters.filter(filter => filter.key !== 'search');
            state.filters.push({key: 'search', value: action.payload})
        },
        // This function removes a filter key/value pair
        removeFilter: (state, action) => {
            console.log(action.payload)
        },
    }
})

export default mainSlice
export const { setSearchFilter, removeFilter } = mainSlice.actions