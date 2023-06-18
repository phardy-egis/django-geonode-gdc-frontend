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
import { WMSTileLayer } from 'react-leaflet/esm/WMSTileLayer'
import { useMap, useMapEvent } from 'react-leaflet/esm/hooks'
import { createLegendPanelToggleControl, createSearchPanelToggleControl } from './CustomControls';
import "leaflet-loading";
import "leaflet-loading/src/Control.Loading.css"
import { store } from '../..';
import { setBBOXFilter } from '../../redux/slices/MainSlice';
import { useSelector } from 'react-redux';
import { getActiveLayerStyleById, getActiveLayersWithoutStyle, getAvailableLayerReadinessStatus, getBBOXStatus, getClusterStatus, getGeoJSONBBOXes } from '../../redux/selectors/MainSliceSelectors';
import { debounce } from 'lodash';
import "leaflet.markercluster"
import blueMarker from '../../assets/img/layer_position_icon_blue.png'
import redMarker from '../../assets/img/layer_position_icon.png'

export default function LeafletMap(){

    // geoJSONData selectors
    const geoJSONBBOXesData = useSelector(state => getGeoJSONBBOXes(state))
    const availableLayersReadiness = useSelector(state => getAvailableLayerReadinessStatus(state))
    const bboxLayerActive = useSelector(state => getBBOXStatus(state))
    const activeLayers = useSelector(state => getActiveLayersWithoutStyle(state))



    // DOM rendering for GeoJSON BBOXes
    var geoJSONDom = null
    if (availableLayersReadiness){

        var geojsonStyle = {
            "color": "#0000FF",
            "weight": 1,
            "opacity": 0,
            "fillOpacity": 0,
        };
        if (bboxLayerActive){
            geojsonStyle = {
                "color": "#0000FF",
                "weight": 1,
                "opacity": 0.8,
                "fillOpacity": 0,
            };
        }
        geoJSONDom = (<GeoJSON data={geoJSONBBOXesData} style={geojsonStyle} />)
        
    }

    if (activeLayers.length > 0){
        var layerDOM = []
        for (let index = 0; index < activeLayers.length; index++) {
            const layer = activeLayers[index];
            layerDOM.push(<GeonodeWMSLayer key={layer.alternate} layer={layer}/>)           
        }
    }

    return (                    
        <div className="uk-width-expand uk-height-1-1 uk-padding-remove uk-animation-fade">                        
            <MapContainer center={[14.5965788, 120.9445403]} zoom={4} options={{ debounceMoveend : true}} style={{ height: "100%", width: "100%", padding: '0px', margin: '0px' }} scrollWheelZoom={true} loadingControl={true}>
                <BBOXFilterTracking></BBOXFilterTracking>
                <MapInvalidator></MapInvalidator>
                <CentersClustersLayer></CentersClustersLayer>
                <CustomControls></CustomControls>
                <Pane name="background" style={{ zIndex: -300 }}>
                    <EsriVectorBasemapLayer apiKey={process.env.REACT_APP_ESRI_API_KEY} pane='background'></EsriVectorBasemapLayer>
                </Pane>
                {layerDOM}
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
            const resizeObserver = new ResizeObserver(debounce((entries) => {
                map.invalidateSize()
            }, 25)
            )
            resizeObserver.observe(map._container);
            setReady(true)
        }
    }, [ready])
    return null
}

// This function renders the background layer inside the map
function EsriVectorBasemapLayer(props){
    const [ready, setReady] = useState(false)
    const map = useMap()
    useEffect(() => {
        if(!ready){
            const apiKey = props.apiKey
            const backgroundPane = map.getPane(props.pane);
            const esriBasemap = vectorBasemapLayer("ArcGIS:Imagery:Standard", {
                apiKey: apiKey,
                pane: backgroundPane,
            })
            esriBasemap.addTo(map)
            map.invalidateSize()
            setReady(true)
        }
    })
    return null
}


// This function renders a Spinner control showing the loading state of the layer
function CustomControls(){

    const map = useMap()
    const [ready, setReady] = useState(false)
    
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

    const map = useMap()
    const tracker = useMapEvent('moveend', () => {
        const bounds = map.getBounds().toBBoxString();
        store.dispatch(setBBOXFilter(bounds))
    })

    return null
}

function GeonodeWMSLayer(props){

    // Opacity selector
    const layerStyle = useSelector(state => getActiveLayerStyleById(state, props.layer.id))

    // WMS Option used to display the request layer
    var wmsOptions = {
        layers: props.layer.details.alternate,
        transparent: true,
        format: 'image/png',
        maxZoom: 20,
    }

    // Setting opacity depending on visibility and 
    var displayOpacity
    if (layerStyle.visibility){
        displayOpacity = layerStyle.opacity
    }
    else {
        displayOpacity = 0
    }

    // DOM returned
    return (
        <WMSTileLayer
            url={process.env.REACT_APP_SITEURL + 'geoserver/ows'}
            params={wmsOptions}
            opacity={displayOpacity}>
        </WMSTileLayer>
    )
}

function CentersClustersLayer(){

    const map = useMap()
    const [ready, setReady] = useState(false)
    const geoJSONBBOXesData = useSelector(state => getGeoJSONBBOXes(state))
    const clusterEnabled = useSelector(state => getClusterStatus(state))
    const [markers, setMarkers] = useState(null)

    // Effect used to create the cluster marker layer
    useEffect(()=> {
        if(!ready){
            map.setMaxZoom(22) 
            var newMarkers = L.markerClusterGroup();

            // Icon definition
            var blueIcon = L.icon({
                iconUrl: blueMarker,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            for (let index = 0; index < geoJSONBBOXesData.features.length; index++) {
                const feature = geoJSONBBOXesData.features[index];
                var featureGeometry = L.geoJSON(feature)
                L.marker(
                    featureGeometry.getBounds().getCenter(), 
                    { icon: blueIcon }
                ).addTo(newMarkers)
            }
            setMarkers(newMarkers)
            setReady(true)
        }

    }, [ready])

    // Effect used to create the cluster marker layer
    useEffect(() => {
        if (markers){
            if (clusterEnabled) {
                markers.addTo(map)
            }
            else {
                map.removeLayer(markers)
            }
        }
    }, [clusterEnabled, markers])

    return null
}