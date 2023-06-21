// JS LIBRARIES
import L from 'leaflet';
import "leaflet-loading";
import "leaflet-switch-basemap";
import "leaflet.markercluster";
import "leaflet-loading/src/Control.Loading.css"
import "leaflet.markercluster"
import { MapContainer } from 'react-leaflet/esm/MapContainer'
import { Pane } from 'react-leaflet/esm/Pane'

import { shallowEqual, useSelector } from 'react-redux';
import { getActiveLayersWithoutStyle, getAvailableLayerReadinessStatus, getBBOXStatus, getGeoJSONBBOXes } from '../../redux/selectors/MainSliceSelectors';

// Custom Leaflet components
import CentersClustersLayer from './CentersClustersLayer';
import GeonodeWMSLayers from './GeonodeWMSLayers';
import BBOXFilterTracker from './BBOXFilterTracker';
import PanelsToggleControls from './PanelsToggleControls';
import EsriVectorBasemapLayer from './EsriBasemapVectorLayer';
import MapInvalidator from './MapInvalidator';
import ZoomFocus from './ZoomFocus';
import BBOXFilterLayer from './BBOXLeafletLayer';

export default function LeafletMap(){



    // console.log('Map rendered')

    return (                    
        <div className="uk-width-expand uk-height-1-1 uk-padding-remove uk-animation-fade">                        
            <MapContainer center={[14.5965788, 120.9445403]} zoom={4} options={{ debounceMoveend : true}} style={{ height: "100%", width: "100%", padding: '0px', margin: '0px' }} scrollWheelZoom={true} loadingControl={true}>
                <ZoomFocus></ZoomFocus>
                <BBOXFilterTracker></BBOXFilterTracker>
                <MapInvalidator></MapInvalidator>
                <CentersClustersLayer></CentersClustersLayer>
                <PanelsToggleControls></PanelsToggleControls>
                <Pane name="background" style={{ zIndex: -300 }}>
                    <EsriVectorBasemapLayer apiKey={process.env.REACT_APP_ESRI_API_KEY} pane='background'></EsriVectorBasemapLayer>
                </Pane>
                <GeonodeWMSLayers/>
                <BBOXFilterLayer/>

            </MapContainer>
        </div>
    )
}