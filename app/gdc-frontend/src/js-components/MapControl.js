

// Adding JS libraries
import L from 'leaflet';
import 'leaflet-switch-basemap'
import $ from 'jquery';

// Import UIKIT (front-end css framework)
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

// =========================================================================================================================
// ================================================ FILTER MANAGER =========================================================
// =========================================================================================================================



// Class used to manage and refresh URL filters
export class FilterManager {


    constructor(DOMAIN_NAME_FULL) {
        this.url = new URL(DOMAIN_NAME_FULL + "gdc/api/resource_list_json/")
        this.bboxFilterActive = true
        this.bboxFilterValue = ''
        this.mainResultList = null
        this.results_fetching = []
    }

    setResultList(resultList){
        this.mainResultList = resultList
    }

    toggleBBOXFilterActive() {

        this.bboxFilterActive = !this.bboxFilterActive
        if (this.bboxFilterActive) {
            this.url.searchParams.delete('regions')
            this.url.searchParams.append('bbox', this.bboxFilterValue)
        }
        else {
            this.url.searchParams.delete('bbox')
        }
        this.applyFilters()
    }

    getFilter(filter_key) {
        return this.url.searchParams[filter_key]
    }

    setBBOXFilter(filter_value) {
        var filter_key = 'bbox'
        this.bboxFilterValue = filter_value
        // The bbox filter is refreshed only if bboxFilterActive is set to "true"
        if (this.bboxFilterActive) {
            this.url.searchParams.delete(filter_key)
            this.url.searchParams.append(filter_key, filter_value)
            this.applyFilters()
            return true
        }
    }

    setFilter(filter_key, filter_value) {
        // specific handler for bbox filter
        if (filter_key == 'bbox') {
            this.setBBOXFilter(filter_value)
            return true
        }
        else {
            this.url.searchParams.delete(filter_key)
            this.url.searchParams.append(filter_key, filter_value)
            this.applyFilters()
            return true
        }
    }

    deleteFilter(filter_key) {
        this.url.searchParams.delete(filter_key)
        this.applyFilters()
        return true
    }

    applyFilters() {
        if (this.mainResultList != null){
            this.mainResultList.refreshResults()
        }
    }


}

// =========================================================================================================================
// ================================================ LEAFLET LAYER MANAGER ==================================================
// =========================================================================================================================

// Class used to manage layer order and loading in leaflet
export class LayerManager {

    constructor(parentMap, DOMAIN_NAME_FULL) {
        this.parentMap = parentMap
        this.layers = {}
        this.DOMAIN_NAME_FULL = DOMAIN_NAME_FULL
        this.layerPane = parentMap.createPane('wmsPane');

        this.layerPane.style.zIndex = 250;
    }


    setLayerOpacity(layerKey, opacity) {
        this.layers[layerKey].opacity = opacity
        this.layers[layerKey].opacityOld = opacity
        this.layers[layerKey].layerLeaflet.setOpacity(opacity / 100)
    }

    toggleMapLayerVisibility(layerKey) {
        if (this.layers[layerKey].opacity !== 0) {
            this.layers[layerKey].opacity = 0
            this.layers[layerKey].layerLeaflet.setOpacity(this.layers[layerKey].opacity / 100)
        }
        else {
            this.layers[layerKey].opacity = this.layers[layerKey].opacityOld
            this.layers[layerKey].layerLeaflet.setOpacity(this.layers[layerKey].opacity / 100)
        }
    }

    addMapLayer(layerAlternateName, layerKey) {

        // Get layer name
        var wmsOptions = {
            layers: layerAlternateName,
            transparent: true,
            format: 'image/png',
            maxZoom: 20,
            pane: this.layerPane,
        }
        var layerLeaflet = L.tileLayer.wms(this.DOMAIN_NAME_FULL + 'geoserver/ows?', wmsOptions).addTo(this.parentMap);
        layerLeaflet.setOpacity(100)

        this.layers[layerKey] = {
            "layerLeaflet": layerLeaflet,
            "opacity": 100,
            "opacityOld": 100
        }
        this.reloadMapLayers()
    }

    removeMapLayer(layerKey) {
        this.parentMap.removeLayer(this.layers[layerKey].layerLeaflet)
        delete this.layers[layerKey]
    }

    reloadMapLayers() {
        // try {
        // Get last layers order from legend
        var layers_to_load = []
        for (let child of document.querySelector('#legend_main_container').children) {
            var childid = $('#' + child.id).attr('layername')
            if (childid !== "undefined") {
                layers_to_load.push(childid)
            }
        }
        layers_to_load = layers_to_load.reverse()

        // Unloading layers

        for (let layer_to_unload in this.layers) {
            if (typeof this.layers[layer_to_unload] !== 'undefined') {
                this.parentMap.removeLayer(this.layers[layer_to_unload].layerLeaflet)
            }
        }

        // Loading layers in the correct order

        for (let layer_to_load of layers_to_load) {
            if (typeof this.layers[layer_to_load] !== 'undefined') {
                this.layers[layer_to_load].layerLeaflet.addTo(this.parentMap)
            }
        }


        return true;
        // }
        // catch (error) {
        //     UIkit.notification('Error refreshing layers ('+error+')', 'danger');
        //     return false;
        // }
    }
}