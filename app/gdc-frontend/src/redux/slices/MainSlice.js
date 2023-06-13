import { createSlice } from '@reduxjs/toolkit'

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        filterByMapExtent: true,
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
        
        // This function toggle the map extent filter
        toggleSpatialExtentFilter: (state) => {
            console.log('filterByMapExtent')
            console.log(!state.filterByMapExtent)
            state.filterByMapExtent = !state.filterByMapExtent
        },

        // This function toggle the map extent filter
        setCategorieFilter: (state) => {
            console.log('filterByMapExtent')
            console.log(!state.filterByMapExtent)
            state.filterByMapExtent = !state.filterByMapExtent
        },
    }
})

export default mainSlice
export const { setSearchFilter, setRegionFilter, toggleSpatialExtentFilter } = mainSlice.actions