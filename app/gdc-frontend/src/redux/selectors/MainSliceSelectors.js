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
            ...layer,
            style: null,
        })
        
    }
    return layersWithoutStyle
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
    return state.availableLayersReady
}

export function getAvailableLayers(state) {
    return state.availableLayers
}

export function getGeoJSONBBOXes(state) {
    return state.geoJSONBBOXes
}