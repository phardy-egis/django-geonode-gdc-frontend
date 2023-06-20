import L from 'leaflet';
import { useMap } from 'react-leaflet/esm/hooks'
import { useState, useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getGeoJSONBBOXes, getClusterStatus } from '../../redux/selectors/MainSliceSelectors';

import blueMarker from '../../assets/img/layer_position_icon_blue.png'
import redMarker from '../../assets/img/layer_position_icon.png'

export default function CentersClustersLayer() {

    const map = useMap()
    const [ready, setReady] = useState(false)
    const [markers, setMarkers] = useState(null)
    const geoJSONBBOXesData = useSelector(state => getGeoJSONBBOXes(state), shallowEqual)
    const clusterEnabled = useSelector(state => getClusterStatus(state), shallowEqual)

    // Effect used to create the cluster marker layer
    useEffect(() => {
        if (!ready) {
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
        if (markers) {
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