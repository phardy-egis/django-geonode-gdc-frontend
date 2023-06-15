import { createSlice } from '@reduxjs/toolkit'

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        filterByMapExtent: true,
        filters: [],
        maxZIndex:0,
        activeLayers: [],
        clusterIsActive: true,
        bboxIsActive: true,
        mapZoomFocus: {
            consumed: true,
            bbox: null
        }
    },
    reducers: {
        // This function sets the value of search filter
        setSearchFilter: (state, action) => {
            const filtered = state.filters.filter(filter => filter.key !== 'search');
            state.filters = [...filtered, { key: 'search', value: action.payload }]
            // console.log(state.filters)
        },

        // This function sets the region filter key/value pair
        setRegionFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'regions' && filter.value !== action.payload.oldValue));
            state.filters = [...filtered, { key: 'regions', value: action.payload }]
            // console.log(state.filters)
        },
        
        // This function toggle the map extent filter
        toggleSpatialExtentFilter: (state) => {
            state.filterByMapExtent= !state.filterByMapExtent
            // console.log(state.filterByMapExtent)
        },

        // This function toggle the map extent filter
        setCategoryFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'category__identifier' && filter.value !== action.payload));
            // IF category filter is not existing we add it
            if (JSON.stringify(filtered) === JSON.stringify(state.filters)){
                state.filters = [...filtered, { key: 'category__identifier', value: action.payload }]                    
            }
            // IF category filter is existing we remove it
            else {
                state.filters = filtered
            }
            // console.log(state.filters)
        },

        setStartDateFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'date__lte'))
            state.filters = [...filtered, { key: 'date__lte', value: action.payload }]
            // console.log(state.filters)
        },

        setEndDateFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'date__gte'))
            state.filters = [...filtered, { key: 'date__gte', value: action.payload }]
            // console.log(state.filters)
        },

        setBBOXFilter: (state, action) => {
            const filtered = state.filters.filter(filter => (filter.key !== 'bbox'))
            state.filters = [...filtered, { key: 'bbox', value: action.payload }]
            // console.log(state.filters)
        },

        toggleClusterStatus: (state, action) => {
            state.clusterIsActive = action.payload
            // console.log(state.clusterIsActive)
        },

        toggleBBOXStatus: (state, action) => {
            state.bboxIsActive= action.payload
            // console.log(state.bboxIsActive)
        },

        addLayer: (state, action) => {
            
            // Generating a new layerProps object from action.payload content
            const newLayer = {
                id: action.payload.id,              // From action.payload
                details: action.payload.details,    // From action.payload
                //bbox: action.payload.bbox,
                style: { // The style enable the possibility to isolate these props for legend properties handlers
                    visibility: true,
                    opacity: 1.0,
                    zindex: state.maxZIndex,
                }
            }
            
            // Updating REDUX state object
            const updatedLayers = [
                ...state.activeLayers,
                newLayer
            ]
            
            // Update REDUX maxZIndex object
            state.maxZIndex = state.maxZIndex + 1
            state.activeLayers = updatedLayers
        },

        removeLayerById: (state, action) => {
            state.activeLayers = state.activeLayers.filter(layer => (layer.id !== action.payload))
        },

        setLayerOpacity: (state, action) => {

            // action.payload.layerid : Contains the ID of the layer
            // action.payload.opacity : Contains the opacity (number between 0 and 1) of the layer

            const layerNotToUpdate = state.activeLayers.filter(layer => (layer.id !== action.payload.layerid))
            var layerToUpdate = state.activeLayers.filter(layer => (layer.id == action.payload.layerid))[0]

            layerToUpdate.style.opacity = action.payload.opacity

            const updatedActiveLayers = [
                ...layerNotToUpdate,
                layerToUpdate
            ]

            state.activeLayers = updatedActiveLayers
            // console.log(state.activeLayers)
        },

        toggleLayerVisibility: (state, action) => {

            // action.payload.layerid : Contains the ID of the layer
            // action.payload.visibility : Contains the visibility status (boolean)
            
            const layerNotToUpdate = state.activeLayers.filter(layer => (layer.id !== action.payload))
            var layerToUpdate = state.activeLayers.filter(layer => (layer.id == action.payload))[0]

            layerToUpdate.style.visibility = !layerToUpdate.style.visibility

            const updatedActiveLayers = [
                ...layerNotToUpdate,
                layerToUpdate
            ]

            state.activeLayers = updatedActiveLayers
            console.log(state.activeLayers)
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
    toggleBBOXStatus,
    addLayer,
    removeLayerById,
    setLayerOpacity,
    toggleLayerVisibility
} = mainSlice.actions