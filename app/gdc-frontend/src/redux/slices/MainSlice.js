import { createSlice } from '@reduxjs/toolkit'

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        filterByMapExtent: true,
        filters: [],
        activeGeonodeLayers: [],
        clusterIsActive: true,
        bboxIsActive: true
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
            state.filters = [...state.filters, { key: 'regions', value: action.payload.newValue }]
            console.log(state.filters)
        },
        
        // This function toggle the map extent filter
        toggleSpatialExtentFilter: (state) => {
            state.filterByMapExtent = !state.filterByMapExtent
            console.log(state.filters)
        },

        // This function toggle the map extent filter
        setCategoryFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'category__identifier' && filter.value !== action.payload));
            if (JSON.stringify(filtered) === JSON.stringify(state.filters)){
                state.filters = [...state.filters, { key: 'category__identifier', value: action.payload }]
            }
            else {
                state.filters = filtered
            }
            console.log(state.filters)
        },

        setStartDateFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'date__lte'))
            state.filters = [...filtered, {key: 'date__lte', value: action.payload }]
            console.log(state.filters)
        },

        setEndDateFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'date__gte'))
            state.filters = [...filtered, { key: 'date__gte', value: action.payload }]
            console.log(state.filters)
        },

        setBBOXFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'bbox'))
            state.filters = [...filtered, { key: 'bbox', value: action.payload }]
            console.log(state.filters)
        },

        toggleClusterStatus: (state, action) => {
            state.clusterIsActive = action.payload
            console.log(state.clusterIsActive)
        },

        toggleBBOXStatus: (state, action) => {
            state.bboxIsActive = action.payload
            console.log(state.bboxIsActive)
        },

        addLayer: (state, action) => {
            state.layers = [
                ...state.layers,
                {
                    key: state.key,
                    id: action.payload.geonodeLayerId,
                    bbox: action.payload.bbox,
                }
            ]
            state.key = state.key + 1
        }

    }
})

export default mainSlice
export const { 
    setSearchFilter, 
    setRegionFilter, 
    toggleSpatialExtentFilter, 
    setCategoryFilter, 
    setStartDateFilter, 
    setEndDateFilter, 
    setBBOXFilter,
    toggleClusterStatus,
    toggleBBOXStatus
} = mainSlice.actions