// JS LIBRARIES
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import "leaflet-loading";
import "leaflet-switch-basemap";
import { vectorBasemapLayer } from "esri-leaflet-vector";
import "leaflet.markercluster";
import { MapContainer } from 'react-leaflet/esm/MapContainer'
import { Pane } from 'react-leaflet/esm/Pane'
import { GeoJSON } from 'react-leaflet/esm/GeoJSON'
import { useMap, useMapEvent } from 'react-leaflet/esm/hooks'
import { createLegendPanelToggleControl, createSearchPanelToggleControl } from './CustomControls';
import "leaflet-loading";
import "leaflet-loading/src/Control.Loading.css"
import { store } from '../..';
import { setBBOXFilter } from '../../redux/slices/MainSlice';
import { useSelector } from 'react-redux';
import { getAvailableLayerReadinessStatus, getBBOXStatus, getGeoJSONBBOXes } from '../../redux/selectors/MainSliceSelectors';
import { debounce } from 'lodash';

export default function LeafletMap(){

    // geoJSONData selectors
    const geoJSONBBOXesData = useSelector(state => getGeoJSONBBOXes(state))
    const availableLayersReadiness = useSelector(state => getAvailableLayerReadinessStatus(state))
    const bboxLayerActive = useSelector(state => getBBOXStatus(state))

    // DOM rendering for GeoJSON BBOXes
    var geoJSONDom = null
    if (availableLayersReadiness){



        var geojsonStyle = {
            "color": "#ff7800",
            "weight": 1,
            "opacity": 0,
            "fillOpacity": 0,
        };
        if (bboxLayerActive){
            geojsonStyle = {
                "color": "#ff7800",
                "weight": 1,
                "opacity": 0.8,
                "fillOpacity": 0,
            };
        }
        geoJSONDom = (<GeoJSON data={geoJSONBBOXesData} style={geojsonStyle} />)
        
    }

    return (                    
        <div className="uk-width-expand uk-height-1-1 uk-padding-remove">                        
            <MapContainer center={[14.5965788, 120.9445403]} zoom={4} options={{ debounceMoveend : true}} style={{ height: "100%", width: "100%", padding: '0px', margin: '0px' }} scrollWheelZoom={true} loadingControl={true}>
                <BBOXFilterTracking></BBOXFilterTracking>
                <MapInvalidator></MapInvalidator>
                <CustomControls></CustomControls>
                <Pane name="background" style={{ zIndex: -300 }}>
                    <EsriVectorBasemapLayer apiKey={process.env.REACT_APP_ESRI_API_KEY} pane='background'></EsriVectorBasemapLayer>
                </Pane>

                {geoJSONDom}

            </MapContainer>
        </div>
    )
}

// This function observes map size change on screen and trigger invalidateSize when map is resized
function MapInvalidator(){

    const [ready, setReady] = useState(false)

    const map = useMap()
    useEffect(() => {
        if(!ready){
            function invalidate() {
                map.invalidateSize()
            }
            const resizeObserver = new ResizeObserver(debounce((entries) => {
                map.invalidateSize()
            }, 50)
            )
            resizeObserver.observe(map._container);
            setReady(true)
        }
    }, [ready])
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

    const [ready, setReady] = useState(false)
    
    const map = useMap()

    useEffect(() => {
        if (!ready) { 
            map.addControl(createLegendPanelToggleControl(map));
            map.addControl(createSearchPanelToggleControl(map));
            map.addControl(new L.Control.loading());
            setReady(true)
        }

    }, [ready])

    return null
}


function BBOXFilterTracking() {
    
    const map = useMapEvent('move', () => {
        var bounds = map.getBounds().toBBoxString();
        store.dispatch(setBBOXFilter(bounds))
    })

    return null
}