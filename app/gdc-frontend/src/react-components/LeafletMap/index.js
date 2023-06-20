// JS LIBRARIES
import L from 'leaflet';
import "leaflet-loading";
import "leaflet-switch-basemap";
import "leaflet.markercluster";
import "leaflet-loading/src/Control.Loading.css"
import "leaflet.markercluster"
import { MapContainer } from 'react-leaflet/esm/MapContainer'
import { Pane } from 'react-leaflet/esm/Pane'
import { GeoJSON } from 'react-leaflet/esm/GeoJSON'

import { useSelector, shallowEqual } from 'react-redux';
import { getActiveLayersOrderedList, getAvailableLayerReadinessStatus, getBBOXStatus, getGeoJSONBBOXes } from '../../redux/selectors/MainSliceSelectors';

// Custom Leaflet components
import CentersClustersLayer from './CentersClustersLayer';
import GeonodeWMSLayer from './GeonodeWMSLayer';
import BBOXFilterTracker from './BBOXFilterTracker';
import PanelsToggleControls from './PanelsToggleControls';
import EsriVectorBasemapLayer from './EsriBasemapVectorLayer';
import MapInvalidator from './MapInvalidator';

export default function LeafletMap(){

    // geoJSONData selectors
    const geoJSONBBOXesData = useSelector(state => getGeoJSONBBOXes(state))
    const availableLayersReadiness = useSelector(state => getAvailableLayerReadinessStatus(state))
    const bboxLayerActive = useSelector(state => getBBOXStatus(state))
    const activeLayers = useSelector(state => getActiveLayersOrderedList(state))



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
            const layerid = activeLayers[index];
            layerDOM.push(<GeonodeWMSLayer key={layerid} layerid={layerid}/>)           
        }
    }

    return (                    
        <div className="uk-width-expand uk-height-1-1 uk-padding-remove uk-animation-fade">                        
            <MapContainer center={[14.5965788, 120.9445403]} zoom={4} options={{ debounceMoveend : true}} style={{ height: "100%", width: "100%", padding: '0px', margin: '0px' }} scrollWheelZoom={true} loadingControl={true}>
                <BBOXFilterTracker></BBOXFilterTracker>
                <MapInvalidator></MapInvalidator>
                <CentersClustersLayer></CentersClustersLayer>
                <PanelsToggleControls></PanelsToggleControls>
                <Pane name="background" style={{ zIndex: -300 }}>
                    <EsriVectorBasemapLayer apiKey={process.env.REACT_APP_ESRI_API_KEY} pane='background'></EsriVectorBasemapLayer>
                </Pane>
                {layerDOM}
                {geoJSONDom}

            </MapContainer>
        </div>
    )
}