// JS LIBRARIES
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import "leaflet-loading";
import "leaflet-switch-basemap";
import { vectorBasemapLayer } from "esri-leaflet-vector";
import "leaflet.markercluster";
import { MapContainer } from 'react-leaflet/esm/MapContainer'
import { Pane } from 'react-leaflet/esm/Pane'
import { useMap } from 'react-leaflet/esm/hooks'
import { createLegendPanelToggleControl, createSearchPanelToggleControl } from './CustomControls';
import "leaflet-loading";
import "leaflet-loading/src/Control.Loading.css"

export default function LeafletMap(){

    return (
        <MapContainer center={[14.5965788, 120.9445403]} zoom={4} style={{ height: "100%", width: "100%", padding: '0px', margin: '0px' }} scrollWheelZoom={true} loadingControl={true}>
            <MapInvalidator></MapInvalidator>
            <CustomControls></CustomControls>
            <Pane name="background" style={{ zIndex: -400 }}>
                <EsriVectorBasemapLayer apiKey={process.env.REACT_APP_ESRI_API_KEY} pane='background'></EsriVectorBasemapLayer>
            </Pane>
        </MapContainer>
    )
}

// This function observes map size change on screen and trigger invalidateSize when map is resized
function MapInvalidator(){
    const map = useMap()
    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            map.invalidateSize()
        })
        resizeObserver.observe(map._container);
    })
    return null
}

// This function renders the background layer inside the map
function EsriVectorBasemapLayer(props){
    const map = useMap()
    useEffect(() => {
        const apiKey = props.apiKey
        const backgroundPane = map.getPane(props.pane);
        const esriBasemap = vectorBasemapLayer("ArcGIS:Imagery:Standard", {
            apiKey: apiKey,
            pane: backgroundPane,
        })
        esriBasemap.addTo(map)
        map.invalidateSize()
    })
    return null
}


// This function renders a Spinner control showing the loading state of the layer
function CustomControls(){
    const map = useMap()
    useEffect(() => {
        map.addControl(createLegendPanelToggleControl(map));
        map.addControl(createSearchPanelToggleControl(map));
        map.addControl(new L.Control.loading());
    })
    return null
}




//         // === ADDING CONTROL TO THE MAP ====
//         // Adding custom controls to map
//         map.addControl(new legendPanelToggle());
//         L.control.zoom({ position: 'topright' }).addTo(map);
//         map.addControl(new searchPanelToggle());
//         map.addControl(new L.Control.loading());

//         // Base layer switcherz
//         var backgroundPane = map.createPane('background');
//         backgroundPane.style.zIndex = -400;

//         const esriBasemap = vectorBasemapLayer("ArcGIS:Imagery:Standard", {
//             apiKey: apiKey,
//             pane: backgroundPane,
//         })
//         new L.basemapsSwitcher([
//             {
//                 layer: esriBasemap.addTo(map),
//                 icon: img5png,
//                 name: 'Satellite'
//             },
//         ], { position: 'bottomright' }).addTo(map);


//         // ====================================================
//         // ======= ADDING LAYER GROUPS // LAYER MANAGER =======
//         // ====================================================

//         // Layers for symbology
//         var markers = L.markerClusterGroup();
//         var bboxes = L.layerGroup();
//         map.addLayer(markers);
//         map.addLayer(bboxes);

//         // ====================================
//         // ======= CATCH MAP EVENTS ===========
//         // ====================================

//         map.on('moveend', function (e) {
//             var bounds = map.getBounds().toBBoxString();
//             // mainFilterManager.setFilter('bbox', bounds)
//         });
//         var bounds = map.getBounds().toBBoxString();
//         // mainFilterManager.setFilter('bbox', bounds)

//         // This listenner triggers map invalidation on div size change
//         map.invalidateSize()
//     }

//     render(){
//         return (
//             <div ref={this.refMap} style="width: 100%; height: 100%; padding:0px"></div>
//         )
//     }
// }


