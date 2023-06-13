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
            console.log(state.filters)
        },

        // This function sets the region filter key/value pair
        setRegionFilter: (state, action) => {
            state.filters = state.filters.filter(filter => (filter.key !== 'regions' && filter.value !== action.payload.oldValue));
            state.filters.push({ key: 'regions', value: action.payload.newValue })
            console.log(state.filters)
        },
    }
})

export default mainSlice
export const { setSearchFilter, setRegionFilter } = mainSlice.actions