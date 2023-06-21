export function getSearchParams(state) {
    const searchParams = new URLSearchParams()

    var activeFilters = ''
    if (state.filterByMapExtent){
        // Datasets are not filtered by region if filterByMapExtent is true
        activeFilters = state.filters.filter(filter => (filter.key !== 'regions'));
    }
    else {
        // Datasets are not filtered by BBOX if filterByMapExtent is false
        activeFilters = state.filters.filter(filter => (filter.key !== 'bbox'));
    }
    

    for (let index = 0; index < activeFilters.length; index++) {
        const param = activeFilters[index];
        if (param.value){
            searchParams.append(param.key, param.value);
        }
    }
    return searchParams.toString()
}

export function getClusterStatus(state){
    return state.clusterIsActive
}

export function getBBOXStatus(state) {
    return state.bboxIsActive
}

/**
 * This function returns the layers listed in REDUX store without the style object to avoid re-rendering each time style of layer changes
 * @param  {object} state           The REDUX state object for current store
 * @return {object}                 Layers properties without style
 */
export function getActiveLayersWithoutStyle(state) {
    const layers = state.activeLayers
    const layersWithoutStyle = []
    for (let index = 0; index < layers.length; index++) {
        const layer = layers[index];
        layersWithoutStyle.push({
            id: layer.id,
            details:layer.details,
        })
        
    }
    return layersWithoutStyle
}

/**
 * This function returns an activeLayer using its ID
 * @param  {object} state           The REDUX state object for current store
 * @return {object}                 Layers properties without style
 */
export function getActiveLayerById(state, layerId) {
    const layer = state.activeLayers.filter(layer => layer.id === layerId)[0]
    return layer
}

/**
 * This function an ordered list of activeLayers IDs
 * @param  {object} state           The REDUX state object for current store
 * @return {object}                 Ordered layer list
 */
export function getActiveLayersOrderedIDList(state) {
    const layers = state.activeLayers.map(layer => layer.id).sort()
    return layers
}

/**
 * This function selects layer with a given geonode ID among the REDUX store
 * @param  {object} state           The REDUX state object for current store
 * @param  {string} layerid         Geonode layer ID to be selected
 * @return {object}                 Dict containing the layerProps
 */
export function getActiveLayerStyleById(state, layerid) {
    const layer = state.activeLayers.filter(layer => (layer.id == layerid))[0]
    return layer.style
}

/**
 * This function return a boolean if a layer of a given ID already exists in the store
 * @param  {object} state           The REDUX state object for current store
 * @param  {string} layerid         Geonode layer ID to be selected
 * @return {boolean}                true if layer exists, false if layer does not exists
 */
export function layerExists(state, layerid) {
    const layer = state.activeLayers.filter(layer => (layer.id == layerid))[0]
    if(layer){
        return true
    }
    else {
        return false
    }
    
}

export function getAvailableLayerReadinessStatus(state){
    return state.geoJSONBBOXesReady
}

export function getAvailableLayers(state) {
    return state.availableLayers
}

export function getActiveLayers(state) {
    return state.activeLayers
}

export function getActiveLayersIDs(state) {
    const activeLayersIDs = state.activeLayers.map(layer => layer.properties.pk)
    return activeLayersIDs
}

export function getGeoJSONBBOXes(state) {
    return state.geoJSONBBOXes
}

export function getZoomFocus(state) {
    return state.zoomFocus
}

export function getSearchLayerIDs(state){
    return state.searchLayerIDs
}