import L from 'leaflet';
import { useMap } from 'react-leaflet/esm/hooks'
import { useState, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getGeoJSONBBOXes, getClusterStatus, getSearchLayerIDs } from '../../redux/selectors/MainSliceSelectors';

import blueMarker from '../../assets/img/layer_position_icon_blue.png'
import redMarker from '../../assets/img/layer_position_icon.png'

export default function CentersClustersLayer() {

    const map = useMap()

    // Effect used to prepare leaflet centroids markers
    const [ready, setReady] = useState(false)
    const [markers, setMarkers] = useState(null)

    useEffect(() => {
        if (!ready) {
            map.setMaxZoom(22)
            
            // Icon definition
            var blueIcon = L.icon({
                iconUrl: blueMarker,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });
            
            var newMarkers = []
            for (let index = 0; index < geoJSONBBOXesData.features.length; index++) {
                const feature = geoJSONBBOXesData.features[index];
                const featureGeometry = L.geoJSON(feature)
                const marker = L.marker(
                    featureGeometry.getBounds().getCenter(),
                    { icon: blueIcon, pk: feature.properties.pk }
                )
                newMarkers.push(marker)
            }
            setMarkers(newMarkers)
            setReady(true)
        }

    }, [ready])

    // Effect used to filter leaflet centroids markers depending on search results and to display them in a cluster group
    const [clusterLayer, setClusterLayer] = useState(null)
    const geoJSONBBOXesData = useSelector(state => getGeoJSONBBOXes(state), shallowEqual)
    const clusterEnabled = useSelector(state => getClusterStatus(state), shallowEqual)
    const searchLayerIDs = useSelector(state => getSearchLayerIDs(state), shallowEqual)

    useEffect(() => {
        if (markers) {
            if (clusterEnabled) {
                var markerClusterLayer = L.markerClusterGroup();
                markers.forEach(marker => {
                    if (searchLayerIDs.includes(marker.options.pk)) {
                        markerClusterLayer.addLayer(marker)
                    }
                });
                if(clusterLayer){
                    map.removeLayer(clusterLayer)
                }
                markerClusterLayer.addTo(map)
                setClusterLayer(markerClusterLayer)
            }
            else{
                map.removeLayer(clusterLayer)
                setClusterLayer(null)
            }
        }
    }, [clusterEnabled, markers, searchLayerIDs])

    return null
}