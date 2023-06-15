// JS LIBRARIES
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import "leaflet-loading";
import "leaflet-switch-basemap";
import { vectorBasemapLayer } from "esri-leaflet-vector";
import "leaflet.markercluster";
import { MapContainer } from 'react-leaflet/esm/MapContainer'
import { Pane } from 'react-leaflet/esm/Pane'
import { useMap, useMapEvent } from 'react-leaflet/esm/hooks'
import { createLegendPanelToggleControl, createSearchPanelToggleControl } from './CustomControls';
import "leaflet-loading";
import "leaflet-loading/src/Control.Loading.css"
import { store } from '../..';
import { setBBOXFilter } from '../../redux/slices/MainSlice';

export default function LeafletMap(){

    return (
        <MapContainer center={[14.5965788, 120.9445403]} zoom={4} options={{ debounceMoveend : true}} style={{ height: "100%", width: "100%", padding: '0px', margin: '0px' }} scrollWheelZoom={true} loadingControl={true}>
            <BBOXFilterTracking></BBOXFilterTracking>
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


function BBOXFilterTracking() {
    const map = useMapEvent('move', () => {
        var bounds = map.getBounds().toBBoxString();
        store.dispatch(setBBOXFilter(bounds))
    })
    return null
}