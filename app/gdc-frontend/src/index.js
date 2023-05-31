// ==================================================================================================================
// ================================================ LOADING DEPENDENCIES ============================================
// ==================================================================================================================

// CSS LIBRARIES
import '../node_modules/leaflet/dist/leaflet.css';
import '../node_modules/uikit/dist/css/uikit.css';
import '../node_modules/leaflet-switch-basemap/src/L.switchBasemap.css';
import './assets/css/spade.custom.css';
import './assets/css/flatpickr.min.css';
import './assets/css/leaflet.loading.css';
import './assets/css/MarkerCluster.Default.css';

// JS LIBRARIES
import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import L from 'leaflet';
import "leaflet-loading";
import "leaflet-switch-basemap";
import * as esri from "esri-leaflet";
import * as esri_vector from "esri-leaflet-vector";
import flatpickr from "flatpickr";
import "leaflet.markercluster";
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

// JS COMPONENTS
import { togglePanel } from "./js-components/PanelControl.js";
import { LayerManager, FilterManager } from "./js-components/MapControl.js"

// JSX COMPONENTS
import { 
    Legend,
    SelectGroupTree,
    SelectMultipleList,
    SearchBar,
    ResultList 
}   from './react-components/GDC.jsx'

// IMGs
// import img0png from './assets/img/img0.PNG'
import img1png from './assets/img/img1.PNG'
// import img2png from './assets/img/img2.PNG'
import img3png from './assets/img/img3.PNG'
import img4png from './assets/img/img4.PNG'
import img5png from './assets/img/img5.PNG'
import img6png from './assets/img/img6.PNG'

// ==================================================================================================================
// ================================================ MAP LOADING =====================================================
// ==================================================================================================================

// Main page loading spinner
setTimeout(toggleLoading, 500)
function toggleLoading() {
    $('#preloader').hide();
    $('#component').show();
    map.invalidateSize()
}

// Setting target domain name
// const queryParams = new URLSearchParams(window.location.search);
// const DOMAIN_NAME_FULL = queryParams.get('host');
const DOMAIN_NAME_FULL = process.env.REACT_APP_SITEURL;

// Preventing form submission
$(document).ready(function () {
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
});

// This line enable UIKit icons use in react 
// (Source: https://stackoverflow.com/questions/50212241/using-uikit-3-icons-in-react)
UIkit.use(Icons);

// ==================================================================================================================
// ================================================ LEAFLET MAP SETTINGS ============================================
// ==================================================================================================================


// LEAFLET COMPONENTS
var map = L.map('map', { attributionControl: true, zoomControl: false })
map._layersMaxZoom = 22


// ====================================
// ======= MAP POSITION ===============
// ====================================



// Setting map center
map.setView([14.5965788, 120.9445403], 4);

// Map boundary
var southWest = L.latLng(-90, -180), northEast = L.latLng(90, 180);
var bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds)

// Map Min Zoom
map.options.minZoom = 3;



// ====================================
// ======= CUSTOM CONTROLS ============
// ====================================


// === SETTINGS ====
// Settings for the LEGEND panel toggling control
document.getElementById("right-panel").style.width = "0px"

// Settings for the LEGEND panel toggling control
var legendPanelToggle = L.Control.extend({

    options: {
        position: 'topright',
    },

    onAdd: function () {
        var container = L.DomUtil.create('input', "uk-text-bolder gdc-custom-leaflet-button gdc-custom-leaflet-button-right");
        container.type = "button";
        container.title = "No cat";
        container.value = "        Legend >   ";

        container.onclick = function (e) {
            togglePanel(map, "right")
        }

        return container;
    }
});

// Settings for the SEARCH panel toggling control
var searchPanelToggle = L.Control.extend({

    options: {
        position: 'topleft',
    },

    onAdd: function () {
        var container = L.DomUtil.create('input', "uk-text-bolder gdc-custom-leaflet-button gdc-custom-leaflet-button-left");
        <a href="#" onClick={this.handleDelete} uk-icon="icon: trash"></a>
        container.type = "button";
        container.title = "No cat";
        container.value = "   < Search        ";

        container.onclick = function (e) {
            togglePanel(map, "left")
        }

        return container;
    }
});


// === ADDING CONTROL TO THE MAP ====
// Adding custom controls to map
map.addControl(new legendPanelToggle());
L.control.zoom({ position: 'topright' }).addTo(map);
map.addControl(new searchPanelToggle());
map.addControl(new L.Control.loading());

const apiKey = "AAPKbfe69f931a334900a983c3447e44c14baeeTitMxekf4cvy1stU8zKsWgrCIMsqrzEDsgVdveu52rg3GZ8N_hNBeBO03S6xb";

// Base layer switcherz
var backgroundPane = map.createPane('background');
backgroundPane.style.zIndex = -400;

const esriBasemap = esri_vector.vectorBasemapLayer("ArcGIS:Imagery:Standard", {
    apiKey: apiKey,
    pane: backgroundPane,
})
console.log(esriBasemap)

new L.basemapsSwitcher([
    // {
    //     layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         maxZoom: 20,
    //         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //     }), //DEFAULT MAP
    //     icon: img1png,
    //     name: 'OSM Base'
    // },
    {
        layer: esriBasemap.addTo(map),
        icon: img5png,
        name: 'Satellite'
    },
    // {
    //     layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    //         maxZoom: 20,
    //         attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    //     }),
    //     icon: img3png,
    //     name: 'OSM Topo'
    // },
    // {
    //     layer: L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    //         maxZoom: 20,
    //         subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    //         attribution: 'Données cartographiques ©2022 Google'
    //     }),
    //     icon: img4png,
    //     name: 'G. Streets'
    // },
    // {
    //     layer: L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    //         maxZoom: 20,
    //         subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    //         attribution: 'Données cartographiques ©2022 Google'
    //     }),
    //     icon: img6png,
    //     name: 'G. Hybrid'
    // },
    // {
    //     layer: L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    //         maxZoom: 20,
    //         subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    //         attribution: 'Données cartographiques ©2022 Google'
    //     }),
    //     icon: img5png,
    //     name: 'G. Satellite'
    // },
], { position: 'bottomright' }).addTo(map);


// ====================================================
// ======= ADDING LAYER GROUPS // LAYER MANAGER =======
// ====================================================

// Layers for symbology
var markers = L.markerClusterGroup();
var bboxes = L.layerGroup();
map.addLayer(markers);
map.addLayer(bboxes);

// Layer manager
var mainLayerManager = new LayerManager(map, DOMAIN_NAME_FULL)
// Filter manager
var mainFilterManager = new FilterManager(DOMAIN_NAME_FULL, mainResultList)

// ====================================
// ======= CATCH MAP EVENTS ===========
// ====================================

map.on('moveend', function (e) {
    var bounds = map.getBounds().toBBoxString();
    mainFilterManager.setFilter('bbox', bounds)
});
var bounds = map.getBounds().toBBoxString();
mainFilterManager.setFilter('bbox', bounds)



// ====================================
// ===== ADD DATE SELECTION BUTTON ====
// ====================================

// Addition of date picker
var selectedDatesMain = []
flatpickr(
    '#flatpickr-after', {
    enableTime: false,
    onChange: function (selectedDates, dateStr, instance) {
        selectedDatesMain = selectedDates
        if (selectedDates.length == 1) {
            mainFilterManager.setFilter('date_begin', selectedDates[0].toISOString().substring(0, 10))
        }
        else {
            mainFilterManager.deleteFilter('date_begin')
        }
        mainFilterManager.applyFilters()
    },
}
);
flatpickr(
    '#flatpickr-before', {
    enableTime: false,
    onChange: function (selectedDates, dateStr, instance) {
        selectedDatesMain = selectedDates
        if (selectedDates.length == 1) {
            mainFilterManager.setFilter('date_end', selectedDates[0].toISOString().substring(0, 10))
        }
        else {
            mainFilterManager.deleteFilter('date_end')
        }
        mainFilterManager.applyFilters()
    },
}
);

// Addition of REACT Components
var legendComponent = ReactDOM.render(
    <Legend id='legend_main_container' domain_src={DOMAIN_NAME_FULL} mainlayermgr={mainLayerManager} target_map={map} marker_layer={markers} bbox_layer={bboxes}></Legend>,
    document.querySelector('#legend_container')
);
ReactDOM.render(
    <SelectGroupTree id='regions_filter' domain_src={DOMAIN_NAME_FULL} mainfiltermgr={mainFilterManager} filter_key='regions'></SelectGroupTree>,
    document.querySelector('#region_filter_container')
);
ReactDOM.render(
    <SelectMultipleList id='categories_filter' domain_src={DOMAIN_NAME_FULL} mainfiltermgr={mainFilterManager} filter_key='categories' endpoint='gdc/api/categories' verbose_name='Data theme'></SelectMultipleList>,
    document.querySelector('#categorie_filter_container')
);
ReactDOM.render(
    <SearchBar id='search_filter' filter_key='search' domain_src={DOMAIN_NAME_FULL} mainfiltermgr={mainFilterManager} verbose_name='Search layer name'></SearchBar>,
    document.querySelector('#search_filter_container')
);
var mainResultList = ReactDOM.render(
    <ResultList id='results_list' domain_src={DOMAIN_NAME_FULL} target_legend={legendComponent} target_map={map} marker_layer={markers} mainfiltermgr={mainFilterManager} bbox_layer={bboxes}></ResultList>,
    document.querySelector('#main_result_list_container')
);

mainFilterManager.setResultList(mainResultList)